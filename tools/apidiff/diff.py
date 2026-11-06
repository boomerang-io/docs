#!/usr/bin/env python3
"""Compare two OpenAPI contracts and write the difference as Markdown.

    python3 tools/apidiff/diff.py --old OLD --new NEW [options]

Lists, per tag, the operations added, removed and changed between the two contracts,
by method and path. For a changed operation it lists added and removed parameters,
parameters that became required, request and response schema changes, and auth changes.
It flags as Breaking: a removed operation, a moved path, a new required parameter or
request body, and auth tightening.

See README.md in this folder.
"""

import argparse
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import contract  # noqa: E402

START = "<!-- apidiff:start -->"
END = "<!-- apidiff:end -->"
PARAM = re.compile(r"\{([^}]+)\}")


# ---------------------------------------------------------------------------
# Describing one operation


def schema_label(spec, schema):
    """A short name for a schema: its component name, or its type."""
    if not isinstance(schema, dict) or not schema:
        return "any"
    name = contract.ref_name(schema)
    if name:
        return name
    for key in ("oneOf", "anyOf", "allOf"):
        if key in schema:
            joiner = " and " if key == "allOf" else " or "
            return joiner.join(schema_label(spec, s) for s in schema[key])
    kind = schema.get("type")
    if isinstance(kind, list):  # OpenAPI 3.1: ["string", "null"]
        kind = next((k for k in kind if k != "null"), "any")
    if kind == "array":
        return "array of " + schema_label(spec, schema.get("items"))
    if kind == "object" or (kind is None and "properties" in schema):
        extra = schema.get("additionalProperties")
        if isinstance(extra, dict) and extra:
            return "map of " + schema_label(spec, extra)
        return "object"
    if kind:
        return f"{kind} ({schema['format']})" if schema.get("format") else kind
    return "any"


def body_labels(spec, op):
    body = contract.resolve(spec, op.get("requestBody"))
    if not isinstance(body, dict) or not body.get("content"):
        return None, False
    labels = sorted({schema_label(spec, media.get("schema")) for media in body["content"].values()})
    return labels, bool(body.get("required"))


def response_labels(spec, op):
    """The success responses, as 'CODE label' strings."""
    labels = []
    for code, response in sorted((op.get("responses") or {}).items()):
        if not str(code).startswith("2"):
            continue
        response = contract.resolve(spec, response)
        content = (response or {}).get("content") or {}
        names = sorted({schema_label(spec, m.get("schema")) for m in content.values()}) or ["no body"]
        labels.append(f"{code} " + ", ".join(names))
    return labels


def describe(spec, method, path, op, params):
    # Path parameters are part of the path, which is compared on its own.
    described = {(p.get("name"), p.get("in")): bool(p.get("required")) for p in params if p.get("in") != "path"}
    body, body_required = body_labels(spec, op)
    return {
        "method": method,
        "path": path,
        "summary": op.get("summary") or "",
        "tag": contract.first_tag(op),
        "params": described,
        "body": body,
        "body_required": body_required,
        "responses": response_labels(spec, op),
        "security": contract.security(spec, op),
        "deprecated": bool(op.get("deprecated")),
    }


# ---------------------------------------------------------------------------
# Renames


def norm(path):
    """A path with its parameter names blanked, so /run/{id} and /run/{runId} match."""
    return PARAM.sub("{}", path.rstrip("/") or "/")


def parse_renames(values):
    renames = []
    for value in values or []:
        if "=" not in value:
            sys.exit(f"--rename {value}: expected OLD=NEW, for example /api/v2/team/{{team}}=/api/v2/workspace/{{workspace}}")
        old, new = value.split("=", 1)
        renames.append((norm(old), norm(new)))
    return sorted(renames, key=lambda r: len(r[0]), reverse=True)


def apply_rename(key, renames):
    """Move a normalised path under the longest OLD prefix that matches to NEW."""
    for old, new in renames:
        if key == old or key.startswith(old + "/"):
            return new + key[len(old):]
    return key


# ---------------------------------------------------------------------------
# Comparing


def auth_label(security):
    if security is None:
        return "not declared"
    if not security:
        return "no auth"
    return " or ".join(" and ".join(f"`{name}`" for name in alt) for alt in security)


def compare_auth(old, new, undeclared):
    """Return (note, breaking) for an auth change, or (None, False)."""
    if old == new or (old is None and undeclared == "unknown"):
        return None, False
    old_set = set(old or [])
    new_set = set(new or [])
    if new is None or not new_set:
        return f"Auth: {auth_label(old)} → {auth_label(new)}.", False
    if old is None or not old_set:
        return f"Auth: {auth_label(old)} → {auth_label(new)}.", True
    dropped = old_set - new_set
    note = f"Auth: {auth_label(old)} → {auth_label(new)}."
    return note, bool(dropped)


def compare(old, new, undeclared):
    """Return (notes, breaking) for one matched operation."""
    notes, breaking = [], False

    if norm(old["path"]) != norm(new["path"]):
        notes.append(f"Path: was `{old['path']}`.")
        breaking = True
    elif old["path"] != new["path"]:
        notes.append(f"Path parameters renamed: was `{old['path']}`.")
    if old["tag"] != new["tag"]:
        notes.append(f"Tag: was {old['tag']}.")

    for key in sorted(set(new["params"]) - set(old["params"])):
        required = new["params"][key]
        notes.append(f"Parameter added: `{key[0]}` ({key[1]}, {'required' if required else 'optional'}).")
        breaking = breaking or required
    for key in sorted(set(old["params"]) - set(new["params"])):
        notes.append(f"Parameter removed: `{key[0]}` ({key[1]}).")
    for key in sorted(set(old["params"]) & set(new["params"])):
        if new["params"][key] and not old["params"][key]:
            notes.append(f"Parameter now required: `{key[0]}` ({key[1]}).")
            breaking = True
        elif old["params"][key] and not new["params"][key]:
            notes.append(f"Parameter now optional: `{key[0]}` ({key[1]}).")

    if old["body"] != new["body"]:
        if old["body"] is None:
            notes.append(f"Request body added: {codes(new['body'])}{' (required)' if new['body_required'] else ''}.")
            breaking = breaking or new["body_required"]
        elif new["body"] is None:
            notes.append(f"Request body removed: was {codes(old['body'])}.")
        else:
            notes.append(f"Request body: {codes(old['body'])} → {codes(new['body'])}.")
    elif new["body"] is not None and new["body_required"] and not old["body_required"]:
        notes.append("Request body now required.")
        breaking = True

    if old["responses"] != new["responses"]:
        notes.append(f"Response: {responses(old['responses'])} → {responses(new['responses'])}.")

    note, tightened = compare_auth(old["security"], new["security"], undeclared)
    if note:
        notes.append(note)
        breaking = breaking or tightened

    if new["deprecated"] and not old["deprecated"]:
        notes.append("Deprecated.")
    return notes, breaking


def codes(labels):
    return ", ".join(f"`{label}`" for label in labels)


def responses(labels):
    if not labels:
        return "none"
    out = []
    for label in labels:
        code, _, rest = label.partition(" ")
        out.append(f"{code} `{rest}`")
    return ", ".join(out)


# ---------------------------------------------------------------------------
# Rendering


def route_page(tag):
    """The Route page openapi-generator's markdown generator writes for a tag."""
    words = re.split(r"[^A-Za-z0-9]+", tag)
    return "".join(w[:1].upper() + w[1:] for w in words if w) + "Route"


def uncamelize(tag):
    """WorkflowRuns -> Workflow Runs, as the Route page titles show tags."""
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", tag)


def join(parts):
    if len(parts) < 3:
        return " and ".join(parts)
    return ", ".join(parts[:-1]) + " and " + parts[-1]


def first_sentence(text):
    text = " ".join(text.split()).rstrip(".")
    head = re.split(r"(?<=[a-z0-9)])\. ", text, maxsplit=1)[0]
    return head.replace("<", "&lt;")


def line(entry, breaking):
    flag = "**Breaking:** " if breaking else ""
    summary = first_sentence(entry["summary"])
    return f"- {flag}`{entry['method']} {entry['path']}`" + (f": {summary}" if summary else "")


def render(old_spec, new_spec, args):
    renames = parse_renames(args.rename)
    new_ops = {(m, norm(p)): describe(new_spec, m, p, op, prm) for m, p, op, prm in contract.operations(new_spec)}

    old_by_new_key = {}
    for method, path, op, params in contract.operations(old_spec):
        key = (method, norm(path))
        if key not in new_ops:
            key = (method, apply_rename(key[1], renames))
        old_by_new_key[key] = describe(old_spec, method, path, op, params)

    groups = {}

    def group(tag):
        return groups.setdefault(tag, {"Added": [], "Removed": [], "Changed": []})

    counts = {"Added": 0, "Removed": 0, "Changed": 0, "Breaking": 0}
    undeclared = {}
    for key, entry in new_ops.items():
        if key not in old_by_new_key:
            group(entry["tag"])["Added"].append((entry["path"], entry["method"], line(entry, False), []))
            counts["Added"] += 1
    for key, entry in old_by_new_key.items():
        if key not in new_ops:
            group(entry["tag"])["Removed"].append((entry["path"], entry["method"], line(entry, True), []))
            counts["Removed"] += 1
            counts["Breaking"] += 1
            continue
        if entry["security"] is None and args.undeclared_auth == "unknown":
            undeclared[auth_label(new_ops[key]["security"])] = undeclared.get(auth_label(new_ops[key]["security"]), 0) + 1
        notes, breaking = compare(entry, new_ops[key], args.undeclared_auth)
        if notes:
            new = new_ops[key]
            group(new["tag"])["Changed"].append((new["path"], new["method"], line(new, breaking), notes))
            counts["Changed"] += 1
            counts["Breaking"] += int(breaking)

    new_tags = {e["tag"] for e in new_ops.values()}
    out = [
        f"<!-- Generated by tools/apidiff/diff.py from {args.old_label or args.old} to {args.new_label or args.new}. "
        "Don't edit between the apidiff markers: rerun the tool. -->",
        "",
        "| Change | Operations |",
        "| --- | --- |",
    ]
    out += [f"| {name} | {counts[name]} |" for name in ("Added", "Removed", "Changed", "Breaking")]
    if undeclared:
        total = sum(undeclared.values())
        parts = [f"{label} on {n}" for label, n in sorted(undeclared.items(), key=lambda kv: -kv[1])]
        out += [
            "",
            f"Auth isn't compared for the {total} operations that declare none in the old contract. "
            f"Of those, the new contract declares {join(parts)}.",
        ]
    hashes = "#" * args.heading_level
    for tag in sorted(groups, key=str.lower):
        out += ["", f"{hashes} {uncamelize(tag)}", ""]
        if args.route_links:
            if tag in new_tags:
                out += [f"Route page: [{uncamelize(tag)}](./{route_page(tag)})", ""]
            else:
                out += ["This tag is gone from the new contract.", ""]
        for kind in ("Added", "Removed", "Changed"):
            items = sorted(groups[tag][kind])
            if not items:
                continue
            out += [f"**{kind}**", ""]
            for _, _, text, notes in items:
                out.append(text)
                out += [f"  - {note}" for note in notes]
            out.append("")
        while out and out[-1] == "":
            out.pop()
    return "\n".join(out) + "\n", counts


def write_page(page, body):
    with open(page, encoding="utf-8") as handle:
        text = handle.read()
    if START not in text or END not in text or text.index(START) > text.index(END):
        sys.exit(f"{page}: needs the markers {START} and {END}, in that order.")
    head, rest = text.split(START, 1)
    _, tail = rest.split(END, 1)
    with open(page, "w", encoding="utf-8") as handle:
        handle.write(f"{head}{START}\n\n{body}\n{END}{tail}")


def main():
    parser = argparse.ArgumentParser(description="Compare two OpenAPI contracts and write the difference as Markdown.")
    parser.add_argument("--old", required=True, help="the earlier contract, JSON or YAML")
    parser.add_argument("--new", required=True, help="the later contract, JSON or YAML")
    parser.add_argument("--old-label", help="how to name the old contract in the output (default: its path)")
    parser.add_argument("--new-label", help="how to name the new contract in the output (default: its path)")
    parser.add_argument(
        "--rename",
        action="append",
        metavar="OLD=NEW",
        help="treat paths under the OLD prefix as moved to NEW, so their operations compare as changed, "
        "not removed and added. Repeatable; the longest matching prefix wins.",
    )
    parser.add_argument(
        "--undeclared-auth",
        choices=("unknown", "none"),
        default="unknown",
        help="how to read an old operation with no security declared: 'unknown' (default) reports the new "
        "auth without a Breaking flag; 'none' reads it as no auth, as OpenAPI does, so new auth is tightening",
    )
    parser.add_argument("--route-links", action="store_true", help="link each tag to its generated Route page")
    parser.add_argument("--heading-level", type=int, default=3, help="Markdown heading level for each tag (default 3)")
    parser.add_argument("--page", help=f"replace the text between {START} and {END} in this file instead of printing")
    args = parser.parse_args()

    body, counts = render(contract.load(args.old), contract.load(args.new), args)
    if args.page:
        write_page(args.page, body)
    else:
        sys.stdout.write(body)
    print(
        "added {Added}, removed {Removed}, changed {Changed}, breaking {Breaking}".format(**counts),
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
