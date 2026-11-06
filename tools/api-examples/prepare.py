#!/usr/bin/env python3
"""Prepare the API contract for the docs generator: add the curl requests and clean notes.

    python3 tools/api-examples/prepare.py --in flow/apis/assets/api-v2.yaml --out "$OUT/api-v2.json"

Reads the contract (JSON or YAML) and writes a JSON copy, for openapi-generator only, with
vendor extensions that the templates in flow/apis/assets/templates/ read:

- on each operation, the curl request's parts: x-curl-url (base, path, required query and any
  query that examples.json adds),
  x-curl-content-type and x-curl-data (the body option);
- on each parameter, x-default and x-example, set only when the contract gives a value, so the
  parameter tables show no "Defaults to null." and no generated *_example values;
- on each model property, x-default, set only when the contract gives one;
- each tag's description without its closing full stop or double quotes, for the Route
  page's frontmatter description.

A request body comes from the request schema: its required fields, with readable placeholder
values. When examples.json has a body for the operation, the request sends it as body.json
instead, and inject.py shows that body under the request. The contract file itself is never
changed. See README.md in this folder.
"""

import argparse
import json
import os
import re
import sys
from urllib.parse import quote

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "apidiff"))
import contract  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))

# Path parameters become shell variables. Unlisted names use their own name in upper snake
# case (userId -> $USER_ID). A bare {name} or {id} takes the noun before it (/task/{name} -> $TASK).
PATH_VARS = {"workspace": "WORKSPACE", "workflow": "WORKFLOW", "workflowRunId": "RUN_ID"}

# Values for required query parameters with no default or enum in the contract. A value that
# starts with $ is a shell variable for the reader to set. Anything unlisted becomes $NAME.
QUERY_VALUES = {
    "workspace": "$WORKSPACE",
    "ref": "$RUN_ID",
    "schedules": "$SCHEDULE_ID",
    "limit": "10",
    "page": "0",
    "labels": "env=test",
    "fromDate": "1767225600000",
    "toDate": "1769904000000",
    "cron": "0 9 * * 1",
}


def snake_upper(name):
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "_", name).replace("-", "_").upper()


def path_variable(path, name):
    if name in PATH_VARS:
        return PATH_VARS[name]
    if name in ("name", "id"):
        before = path.split("{" + name + "}")[0].rstrip("/").rsplit("/", 1)[-1]
        noun = before[:-1] if before.endswith("s") else before
        return snake_upper(noun or name) + ("_ID" if name == "id" else "")
    return snake_upper(name)


def schema_type(schema):
    kind = schema.get("type")
    if isinstance(kind, list):  # OpenAPI 3.1: ["string", "null"]
        kind = next((k for k in kind if k != "null"), None)
    return kind


def query_value(param):
    schema = param.get("schema") or {}
    if schema.get("default") is not None:
        value = schema["default"]
    elif schema.get("enum"):
        value = schema["enum"][0]
    elif schema_type(schema) == "array" and (schema.get("items") or {}).get("enum"):
        value = schema["items"]["enum"][0]
    else:
        value = QUERY_VALUES.get(param["name"], "$" + snake_upper(param["name"]))
    value = str(value).lower() if isinstance(value, bool) else str(value)
    if value.startswith("$"):
        return value
    return quote(value, safe=",*")


def curl_url(path, params, extra=None):
    """The URL: path parameters as shell variables, then the required query parameters and any
    that examples.json adds (for a rule the contract can't state, such as "labels or workflowruns")."""
    url = "$FLOW_URL" + re.sub(r"\{([^}]+)\}", lambda m: "$" + path_variable(path, m.group(1)), path)
    query = [f"{p['name']}={query_value(p)}" for p in params if p.get("in") == "query" and p.get("required")]
    for name, value in (extra or {}).items():
        value = str(value)
        query.append(f"{name}={value if value.startswith('$') else quote(value, safe=',*')}")
    return url + ("?" + "&".join(query) if query else "")


# ---------------------------------------------------------------------------
# Placeholder bodies


def kebab(name):
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "-", name).replace("_", "-").lower()


def placeholder(spec, schema, name=None, seen=()):
    """A readable value for a schema: required fields only, never generated *_example strings."""
    ref = contract.ref_name(schema)
    if ref in seen:
        return {}
    schema = contract.resolve(spec, schema) or {}
    seen = seen + ((ref,) if ref else ())
    for key in ("allOf", "oneOf", "anyOf"):
        if schema.get(key):
            if key == "allOf":
                merged = {}
                for part in schema[key]:
                    value = placeholder(spec, part, name, seen)
                    if isinstance(value, dict):
                        merged.update(value)
                return merged
            return placeholder(spec, schema[key][0], name, seen)
    if schema.get("default") is not None:
        return schema["default"]
    if schema.get("enum"):
        return schema["enum"][0]
    kind = schema_type(schema)
    if kind == "array":
        item = placeholder(spec, schema.get("items") or {}, name, seen)
        return [item] if item not in ({}, None) else []
    if kind == "object" or "properties" in schema:
        props = schema.get("properties") or {}
        return {key: placeholder(spec, props.get(key) or {}, key, seen) for key in schema.get("required", [])}
    if kind == "boolean":
        return True
    if kind in ("integer", "number"):
        return 1
    if kind == "string":
        fmt = schema.get("format")
        if fmt == "date-time":
            return "2026-11-06T09:00:00Z"
        if fmt == "date":
            return "2026-11-06"
        if fmt == "email" or (name or "").lower() == "email":
            return "someone@example.com"
        if fmt in ("uri", "url"):
            return "https://example.com"
        return f"my-{kebab(name)}" if name else "text"
    return {}


def shell_quote(text):
    return "'" + text.replace("'", "'\\''") + "'"


def json_media(content):
    names = [m for m in content if "json" in m]
    return "application/json" if "application/json" in names else (names[0] if names else None)


def request_body(spec, op, method, path, examples):
    """Return (content type, curl data option, source) for the operation's body, or (None, None, None)."""
    body = contract.resolve(spec, op.get("requestBody"))
    content = (body or {}).get("content") or {}
    if not content:
        return None, None, None
    media = json_media(content)
    if media is None:
        if any("yaml" in m for m in content):
            return "application/x-yaml", "--data-binary @task.yaml", "file"
        return next(iter(content)), "--data-binary @body", "file"
    example = examples.get(f"{method} {path}") or {}
    if "body" in example:
        return example.get("contentType", "application/json"), "-d @body.json", "examples"
    if not body.get("required"):
        return None, None, None
    schema = content[media].get("schema") or {}
    value = placeholder(spec, schema)
    if isinstance(value, str) or value is None:  # a raw JSON payload, such as a webhook's
        value = {}
    text = json.dumps(value, ensure_ascii=False)
    if len(text) > 60:
        text = json.dumps(value, indent=2, ensure_ascii=False)
    return "application/json", "-d " + shell_quote(text), "placeholder"


# ---------------------------------------------------------------------------


def clean_parameter(spec, param):
    schema = contract.resolve(spec, param.get("schema")) or {}
    if schema.get("default") is not None:
        param["x-default"] = render_value(schema["default"])
    example = param.get("example", schema.get("example"))
    if example is not None:
        param["x-example"] = render_value(example)


def render_value(value):
    if isinstance(value, bool):
        return str(value).lower()
    if isinstance(value, (list, dict)):
        return json.dumps(value)
    return str(value)


def main():
    parser = argparse.ArgumentParser(description="Add the curl requests and clean notes to a copy of the contract.")
    parser.add_argument("--in", dest="source", required=True, help="the contract, JSON or YAML")
    parser.add_argument("--out", required=True, help="where to write the prepared JSON copy (outside the repo)")
    parser.add_argument("--examples", default=os.path.join(HERE, "examples.json"), help="the docs examples (default: examples.json here)")
    args = parser.parse_args()

    spec = contract.load(args.source)
    examples = {}
    if os.path.exists(args.examples):
        with open(args.examples, encoding="utf-8") as handle:
            examples = {k: v for k, v in json.load(handle).items() if not k.startswith("_")}

    sources = {"examples": [], "placeholder": [], "file": []}
    for method, path, op, params in contract.operations(spec):
        for param in op.get("parameters", []):
            param = contract.resolve(spec, param)
            clean_parameter(spec, param)
        op["x-curl-url"] = curl_url(path, params, (examples.get(f"{method} {path}") or {}).get("query"))
        content_type, data, source = request_body(spec, op, method, path, examples)
        if content_type:
            op["x-curl-content-type"] = content_type
            op["x-curl-data"] = data
            sources[source].append(f"{method} {path}")
    for tag in spec.get("tags") or []:
        # api.mustache puts the description in a quoted frontmatter sentence of its own.
        if tag.get("description"):
            tag["description"] = " ".join(tag["description"].split()).rstrip(".").replace('"', "'")
    for item in (spec.get("paths") or {}).values():
        for param in item.get("parameters", []):
            clean_parameter(spec, contract.resolve(spec, param))
    for schema in ((spec.get("components") or {}).get("schemas") or {}).values():
        for prop in (schema.get("properties") or {}).values():
            if isinstance(prop, dict) and prop.get("default") is not None:
                prop["x-default"] = render_value(prop["default"])

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(spec, handle, indent=1, ensure_ascii=False, default=str)
    print(
        f"request bodies: {len(sources['examples'])} from examples.json, "
        f"{len(sources['placeholder'])} built from the schema, {len(sources['file'])} sent as a file (YAML)",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
