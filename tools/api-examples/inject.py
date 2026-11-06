#!/usr/bin/env python3
"""Put the docs examples into the generated API route pages.

    python3 tools/api-examples/inject.py [--examples FILE] [--pages DIR] [--check]

api.mustache leaves an empty marker pair under each operation's example request:

    <!-- api-examples:start GET /api/v2/... -->
    <!-- api-examples:end -->

This script fills each pair from examples.json: an "Example request body" when the entry has
a body, and an "Example response" for each response. It replaces whatever is between the
markers, so a rerun gives the same pages. It stops, writing nothing, when examples.json names
an operation that no route page has. With --check it writes nothing and exits 1 when a page
would change. See README.md in this folder.
"""

import argparse
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_PAGES = os.path.normpath(os.path.join(HERE, "..", "..", "flow", "apis"))
MARKERS = re.compile(r"(<!-- api-examples:start (\S+) (\S+) -->\n)(.*?)(<!-- api-examples:end -->)", re.S)
REASONS = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
}


def block(value):
    return "```json\n" + json.dumps(value, indent=2, ensure_ascii=False) + "\n```\n"


def render(entry):
    out = []
    if "body" in entry:
        out += ["#### Example request body", "", "The request sends this as `body.json`:", "", block(entry["body"])]
    responses = entry.get("response") or []
    if isinstance(responses, dict):
        responses = [responses]
    if responses:
        out += ["#### Example response", ""]
    for response in responses:
        status = int(response["status"])
        label = f"`{status} {REASONS.get(status, '')}`".replace(" `", "`")
        title = response.get("title")
        has_json = "json" in response
        if title:
            line = f"{label}, {title}"
        else:
            line = label
        line += ":" if has_json else ", with no body."
        out += [line, ""]
        if has_json:
            out.append(block(response["json"]))
    return "\n".join(out)


def main():
    parser = argparse.ArgumentParser(description="Put the docs examples into the generated API route pages.")
    parser.add_argument("--examples", default=os.path.join(HERE, "examples.json"), help="default: examples.json here")
    parser.add_argument("--pages", default=DEFAULT_PAGES, help="the folder holding the *Route.md pages (default: flow/apis)")
    parser.add_argument("--check", action="store_true", help="write nothing; exit 1 when a page would change")
    args = parser.parse_args()

    with open(args.examples, encoding="utf-8") as handle:
        examples = {k: v for k, v in json.load(handle).items() if not k.startswith("_")}

    pages, seen, problems = {}, set(), []
    for path in sorted(glob.glob(os.path.join(args.pages, "*Route.md"))):
        with open(path, encoding="utf-8") as handle:
            text = handle.read()

        def fill(match):
            key = f"{match.group(2)} {match.group(3)}"
            seen.add(key)
            entry = examples.get(key)
            body = render(entry) if entry else ""
            if entry and "body" in entry:
                before = text[: match.start()]
                curl = before[before.rfind("```bash") :]
                if "-d @body.json" not in curl:
                    problems.append(f"{key}: has an example body, but its request doesn't send body.json. Regenerate with prepare.py.")
            return match.group(1) + (body + "\n" if body else "") + match.group(5)

        pages[path] = (text, MARKERS.sub(fill, text))

    unknown = sorted(set(examples) - seen)
    for key in unknown:
        problems.append(f"{key}: no route page has this operation. Fix or remove its entry in examples.json.")
    if unknown:
        sys.exit("\n".join(problems))
    for problem in problems:
        print(f"warning: {problem}", file=sys.stderr)

    changed = [path for path, (old, new) in pages.items() if old != new]
    if args.check:
        for path in changed:
            print(f"would change: {os.path.relpath(path)}", file=sys.stderr)
        sys.exit(1 if changed else 0)
    for path in changed:
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(pages[path][1])
    filled = sum(1 for key in seen if key in examples)
    print(f"{filled} operations have examples; {len(changed)} pages changed", file=sys.stderr)


if __name__ == "__main__":
    main()
