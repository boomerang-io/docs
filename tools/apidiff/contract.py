"""Read an OpenAPI contract (JSON or YAML) and walk its operations.

Shared by diff.py and examples.py. Python 3 standard library, plus PyYAML when it is
installed. Without PyYAML, a YAML contract is converted to JSON with Ruby's YAML library;
without either, pass a JSON contract.
"""

import json
import shutil
import subprocess
import sys

METHODS = ("get", "put", "post", "delete", "patch", "head", "options", "trace")


def _load_yaml(text, path):
    try:
        import yaml  # PyYAML

        return yaml.safe_load(text)
    except ImportError:
        pass
    ruby = shutil.which("ruby")
    if ruby:
        script = "require 'yaml'; require 'json'; print JSON.generate(YAML.safe_load(STDIN.read))"
        done = subprocess.run([ruby, "-e", script], input=text, capture_output=True, text=True)
        if done.returncode == 0:
            return json.loads(done.stdout)
        sys.exit(f"{path}: Ruby could not read the YAML: {done.stderr.strip()}")
    sys.exit(f"{path}: reading YAML needs PyYAML (pip install pyyaml) or Ruby. Or pass the contract as JSON.")


def load(path):
    """Return the contract at path as a dict. JSON is tried first, then YAML."""
    with open(path, encoding="utf-8") as handle:
        text = handle.read()
    try:
        return json.loads(text)
    except ValueError:
        return _load_yaml(text, path)


def resolve(spec, node):
    """Follow a local $ref (#/components/...) until the node is not a reference."""
    seen = set()
    while isinstance(node, dict) and isinstance(node.get("$ref"), str) and node["$ref"].startswith("#/"):
        ref = node["$ref"]
        if ref in seen:
            break
        seen.add(ref)
        target = spec
        for part in ref[2:].split("/"):
            part = part.replace("~1", "/").replace("~0", "~")
            target = target.get(part, {}) if isinstance(target, dict) else {}
        node = target
    return node


def ref_name(node):
    """The component name a $ref points at, or None."""
    if isinstance(node, dict) and isinstance(node.get("$ref"), str):
        return node["$ref"].rsplit("/", 1)[-1]
    return None


def operations(spec):
    """Yield (METHOD, path, operation, parameters) for every operation.

    parameters merges the path item's parameters with the operation's own (the operation
    wins on the same name and location), each one resolved.
    """
    for path, item in (spec.get("paths") or {}).items():
        item = resolve(spec, item)
        shared = [resolve(spec, p) for p in item.get("parameters", [])]
        for method in METHODS:
            op = item.get(method)
            if not isinstance(op, dict):
                continue
            own = [resolve(spec, p) for p in op.get("parameters", [])]
            merged = {(p.get("name"), p.get("in")): p for p in shared}
            merged.update({(p.get("name"), p.get("in")): p for p in own})
            yield method.upper(), path, op, list(merged.values())


def first_tag(op):
    tags = op.get("tags") or []
    return tags[0] if tags else "Untagged"


def security(spec, op):
    """The operation's effective security, as a list of alternatives.

    Each alternative is a sorted tuple of scheme names that must all be sent. Returns
    None when neither the operation nor the contract declares security, and [] when the
    operation declares that it needs none (security: []).
    """
    declared = op.get("security", spec.get("security"))
    if declared is None:
        return None
    alternatives = []
    for requirement in declared:
        names = tuple(sorted((requirement or {}).keys()))
        if names:
            alternatives.append(names)
        else:
            return []  # an empty requirement object makes auth optional
    return sorted(set(alternatives))
