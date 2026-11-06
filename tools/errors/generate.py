#!/usr/bin/env python3
"""Generate the Boomerang Flow error code reference from flow.service.workflow at a tag.

Reads, with `git show <tag>:<path>`:
  - service-core/.../common/error/BoomerangError.java (each error's code, reason and HTTP status);
  - service-core/src/main/resources/messages.properties (each reason's message);
  - service-core/.../common/model/StatusReason.java (the reasons a task or run ends with),
    the dispatcher SDK's StatusReason.java (the subset a dispatcher sends) and
    engine/EngineConstants.java (the requeue budget);
  - specifications/dispatcher-contract.md (its requeue table, checked against StatusReason.java);
and `git grep` at the tag, to mark the errors service-core defines but never raises.

The hand-kept "Why it happens", "What to do" and "Related" text comes from notes.json, keyed by
reason. Writes flow/introduction/error-codes.md. See tools/errors/README.md.

Python 3.9+, standard library only.
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

DOCS_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_OUT = DOCS_ROOT / "flow" / "introduction" / "error-codes.md"
DEFAULT_NOTES = Path(__file__).resolve().parent / "notes.json"

CORE_MAIN = "service-core/src/main"
JAVA = f"{CORE_MAIN}/java/io/boomerang"
ERRORS_PATH = f"{JAVA}/common/error/BoomerangError.java"
MESSAGES_PATH = f"{CORE_MAIN}/resources/messages.properties"
STATUS_REASON_PATH = f"{JAVA}/common/model/StatusReason.java"
SDK_STATUS_REASON_PATH = "dispatcher-sdk/src/main/java/io/boomerang/dispatcher/sdk/StatusReason.java"
ENGINE_CONSTANTS_PATH = f"{JAVA}/engine/EngineConstants.java"
CONTRACT_PATH = "specifications/dispatcher-contract.md"

TITLE = "Error codes"
ORDER = 4
# Plain YAML: no ": " or leading special characters, so it needs no quoting.
DESCRIPTION = (
    "The error codes Flow's API returns and the status reasons a task or run ends with,"
    " each with its message, why it happens and what to do."
)

# Spring's HttpStatus constants, as BoomerangError names them.
HTTP_STATUS = {
    "BAD_REQUEST": 400, "UNAUTHORIZED": 401, "PAYMENT_REQUIRED": 402, "FORBIDDEN": 403,
    "NOT_FOUND": 404, "METHOD_NOT_ALLOWED": 405, "NOT_ACCEPTABLE": 406, "REQUEST_TIMEOUT": 408,
    "CONFLICT": 409, "GONE": 410, "LENGTH_REQUIRED": 411, "PRECONDITION_FAILED": 412,
    "CONTENT_TOO_LARGE": 413, "PAYLOAD_TOO_LARGE": 413, "URI_TOO_LONG": 414,
    "UNSUPPORTED_MEDIA_TYPE": 415, "UNPROCESSABLE_ENTITY": 422, "UNPROCESSABLE_CONTENT": 422,
    "LOCKED": 423, "FAILED_DEPENDENCY": 424, "PRECONDITION_REQUIRED": 428,
    "TOO_MANY_REQUESTS": 429, "INTERNAL_SERVER_ERROR": 500, "NOT_IMPLEMENTED": 501,
    "BAD_GATEWAY": 502, "SERVICE_UNAVAILABLE": 503, "GATEWAY_TIMEOUT": 504,
}

# The areas, in page order: (key, heading, one-sentence intro).
AREAS = [
    ("workflows", "Workflows", "Errors from creating, saving, reading and submitting a workflow."),
    ("runs", "Runs", "Errors from starting, retrying and reading runs, and from the actions,"
     " schedules and artifacts that belong to a run."),
    ("tasks", "Tasks", "Errors from Task Manager and the task routes, and from the dispatcher"
     " protocol."),
    ("workspaces", "Workspaces", "Errors from workspaces, their members and their quotas."),
    ("parameters", "Parameters", "Errors from parameter names, types and values, at every layer."),
    ("auth", "Tokens and auth", "Errors from sign-in, tokens, users and permission checks."),
    ("settings", "Settings", "Errors from changing the platform settings in"
     " **Admin › Settings**."),
    ("integrations", "Integrations", "Errors from connecting an integration and sharing its"
     " credentials with tasks."),
    ("query", "Query", "Errors from a request's filters or body, and generic request errors."),
]

# How an error is placed, first match wins: (enum name prefixes or names, code range, area,
# the "See" link for an entry without notes). A code BoomerangError gains outside every rule
# stops the generator, so each new range gets a deliberate home.
AREA_RULES = [
    (("AUTH_",), None, "auth", ("Sign-in and the first admin", "../hosting/sign-in")),
    (("TOKEN_",), None, "auth", ("Machine tokens", "../hosting/machine-tokens")),
    (("USER_",), None, "auth", ("Admin: Users", "../webapp/administer#users")),
    (("PERMISSION_DENIED",), None, "auth",
     ("Security: what each role can do", "../architecture/security#what-can-each-role-do")),
    (("QUOTA_",), None, "workspaces", ("Quotas", "../webapp/quotas")),
    (("SETTINGS_",), None, "settings", ("Admin: Settings", "../webapp/administer#settings")),
    (("QUERY_", "UNABLE_PATCH_REL", "TOO_MANY_REQUESTS", "DATA_CONVERSION_FAILED"), None, "query",
     ("Read an error", "../apis/overview#read-an-error")),
    (("PARAM_", "PARAMS_"), None, "parameters", ("Parameters", "../fundamentals/parameters")),
    (("WORKFLOW_TEMPLATE_",), None, "workflows", ("Templates", "../fundamentals/workflows#templates")),
    (("WORKFLOW_", "IMPORT_WORKFLOW_"), (0, 1299), "workflows", ("Workflow editor", "../guides/workflow-editor")),
    (None, (1100, 1199), "workspaces", ("Manage workspace", "../webapp/manage")),
    (None, (1300, 1399), "runs", ("Runs", "../fundamentals/runs")),
    (None, (1400, 1499), "tasks", ("Tasks", "../fundamentals/tasks")),
    (None, (1500, 1599), "tasks",
     ("Dispatcher protocol reference", "../extend/dispatcher-protocol#start-and-end-a-task")),
    (None, (1600, 1699), "runs", ("Actions", "../fundamentals/actions")),
    (None, (1700, 1799), "runs", ("Schedules", "../webapp/schedules")),
    (None, (1900, 1999), "integrations", ("Integrations", "../webapp/integrations")),
    (None, (2000, 2099), "runs", ("Artifacts and the run workspace", "../fundamentals/artifacts")),
    (None, (2100, 2199), "tasks", ("Dispatcher protocol reference", "../extend/dispatcher-protocol")),
]

STATUS_SEE = ("Runs", "../fundamentals/runs#status-and-phase")

MARKER = "<!-- Generated by tools/errors/generate.py"
PLACEHOLDER = re.compile(r"\{\d+(?:,[^}]*)?\}")


class GenerateError(Exception):
    pass


# ---------------------------------------------------------------------------------------------
# Reading the source


def git(repo, *args):
    result = subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True)
    return result


def git_show(repo, tag, path):
    result = git(repo, "show", f"{tag}:{path}")
    if result.returncode != 0:
        raise GenerateError(f"git show {tag}:{path} failed: {result.stderr.strip()}")
    return result.stdout


def git_grep(repo, tag, pattern, *pathspecs):
    """Lines `path:line:text` matching an extended regex at the tag, or [] when none match."""
    result = git(repo, "grep", "-n", "-E", pattern, tag, "--", *pathspecs)
    if result.returncode not in (0, 1):
        raise GenerateError(f"git grep {pattern!r} at {tag} failed: {result.stderr.strip()}")
    prefix = f"{tag}:"
    return [line[len(prefix):] if line.startswith(prefix) else line
            for line in result.stdout.splitlines()]


def strip_java_comments(text):
    text = re.sub(r"/\*.*?\*/", lambda m: "\n" * m.group(0).count("\n"), text, flags=re.S)
    return re.sub(r"//[^\n]*", "", text)


def load_errors(repo, tag):
    """BoomerangError's constants in declaration order."""
    source = strip_java_comments(git_show(repo, tag, ERRORS_PATH))
    pattern = re.compile(
        r"\b([A-Z][A-Z0-9_]*)\s*\(\s*(\d+)\s*,\s*\"([A-Z][A-Z0-9_]*)\"\s*,\s*HttpStatus\.([A-Z_]+)\s*\)"
    )
    errors = []
    for match in pattern.finditer(source):
        name, code, reason, status = match.groups()
        if status not in HTTP_STATUS:
            raise GenerateError(f"{ERRORS_PATH}: {name} uses HttpStatus.{status}, which the"
                                " generator doesn't know: add it to HTTP_STATUS")
        errors.append({"name": name, "code": int(code), "reason": reason,
                       "status": HTTP_STATUS[status]})
    if not errors:
        raise GenerateError(f"{ERRORS_PATH}: found no error constants")
    seen = {}
    for error in errors:
        if error["reason"] in seen:
            raise GenerateError(f"{ERRORS_PATH}: reason {error['reason']} is used by both"
                                f" {seen[error['reason']]} and {error['name']}")
        seen[error["reason"]] = error["name"]
    return errors


def parse_properties(text):
    """A java.util.Properties file: comments, continuation lines, escapes and separators."""
    logical, current = [], ""
    for raw in text.splitlines():
        line = raw.lstrip()
        if not current and (not line or line[0] in "#!"):
            continue
        backslashes = len(line) - len(line.rstrip("\\"))
        if backslashes % 2 == 1:
            current += line[:-1]
            continue
        logical.append(current + line)
        current = ""
    if current:
        logical.append(current)

    def unescape(value):
        out, i = [], 0
        while i < len(value):
            ch = value[i]
            if ch == "\\" and i + 1 < len(value):
                nxt = value[i + 1]
                if nxt == "u" and re.fullmatch(r"[0-9a-fA-F]{4}", value[i + 2:i + 6]):
                    out.append(chr(int(value[i + 2:i + 6], 16)))
                    i += 6
                    continue
                out.append({"t": "\t", "n": "\n", "r": "\r", "f": "\f"}.get(nxt, nxt))
                i += 2
                continue
            out.append(ch)
            i += 1
        return "".join(out)

    props = {}
    for line in logical:
        key_end, i = len(line), 0
        while i < len(line):
            if line[i] == "\\":
                i += 2
                continue
            if line[i] in "=: \t\f":
                key_end = i
                break
            i += 1
        key = unescape(line[:key_end])
        rest = line[key_end:].lstrip(" \t\f")
        if rest[:1] in ("=", ":"):
            rest = rest[1:].lstrip(" \t\f")
        props[key] = unescape(rest)
    return props


def raised_errors(repo, tag, warnings):
    """The BoomerangError constants service-core's main code refers to, other than to read one."""
    lines = git_grep(repo, tag, r"BoomerangError\.[A-Z]", f"{CORE_MAIN}/", f":!{ERRORS_PATH}")
    used = set()
    reference = re.compile(r"BoomerangError\.([A-Z][A-Z0-9_]*)(\s*\.)?")
    for line in lines:
        parts = line.split(":", 2)
        if len(parts) < 3:
            continue
        text = parts[2].strip()
        if text.startswith(("//", "*", "/*")):
            continue
        for match in reference.finditer(text):
            if match.group(2):  # BoomerangError.X.getReason() and the like: a read, not a raise
                continue
            used.add(match.group(1))
    static_imports = git_grep(repo, tag, r"import\s+static\s+io\.boomerang\.common\.error\.BoomerangError",
                              f"{CORE_MAIN}/")
    for line in static_imports:
        path = line.split(":", 1)[0]
        source = strip_java_comments(git_show(repo, tag, path))
        for name in re.findall(r"\b([A-Z][A-Z0-9_]+)\b", source):
            used.add(name)
        warnings.append(f"{path} imports BoomerangError statically; its bare names count as raised")
    return used


def load_status_reasons(repo, tag, warnings):
    source = git_show(repo, tag, STATUS_REASON_PATH)
    body = strip_java_comments(source)
    constants = re.findall(r"public\s+static\s+final\s+String\s+([A-Z][A-Z0-9_]*)\s*=\s*\"([^\"]+)\"", body)
    if not constants:
        raise GenerateError(f"{STATUS_REASON_PATH}: found no status reasons")
    by_name = dict(constants)

    def set_members(set_name):
        match = re.search(rf"\b{set_name}\s*=\s*Set\.of\(([^;]*)\)\s*;", body, flags=re.S)
        if not match:
            warnings.append(f"{STATUS_REASON_PATH}: no {set_name} set found")
            return set()
        names = re.findall(r"[A-Z][A-Z0-9_]*", match.group(1))
        unknown = [n for n in names if n not in by_name]
        if unknown:
            raise GenerateError(f"{STATUS_REASON_PATH}: {set_name} names unknown {unknown}")
        return {by_name[n] for n in names}

    requeued = set_members("REQUEUEABLE")
    never_retried = set_members("NOT_RETRIABLE")

    sdk = strip_java_comments(git_show(repo, tag, SDK_STATUS_REASON_PATH))
    sent_by_dispatcher = set(re.findall(r"public\s+static\s+final\s+String\s+[A-Z0-9_]+\s*=\s*\"([^\"]+)\"", sdk))
    stray = sorted(sent_by_dispatcher - set(by_name.values()))
    if stray:
        warnings.append(f"{SDK_STATUS_REASON_PATH} has reasons service-core doesn't know: {stray}")

    set_by_flow = set()
    lines = git_grep(repo, tag, r"StatusReason\.[A-Z]", f"{CORE_MAIN}/", f":!{STATUS_REASON_PATH}")
    for line in lines:
        text = line.split(":", 2)[-1].strip()
        if text.startswith(("//", "*", "/*")):
            continue
        for name in re.findall(r"StatusReason\.([A-Z][A-Z0-9_]*)", text):
            if name in by_name:
                set_by_flow.add(by_name[name])

    reasons = []
    for name, value in constants:
        setters = []
        if value in sent_by_dispatcher:
            setters.append("a dispatcher")
        if value in set_by_flow:
            setters.append("Flow")
        if not setters:
            warnings.append(f"status reason {value} is neither in the SDK nor set in service-core")
        reasons.append({"name": name, "value": value, "setters": setters,
                        "requeued": value in requeued, "never_retried": value in never_retried})

    budget = None
    constants_source = git_show(repo, tag, ENGINE_CONSTANTS_PATH)
    match = re.search(r"\bMAX_RETRIES\s*=\s*(\d+)\s*;", constants_source)
    if match:
        budget = int(match.group(1))
    else:
        warnings.append(f"{ENGINE_CONSTANTS_PATH}: no MAX_RETRIES; the requeue budget is left out")

    check_contract(repo, tag, requeued, warnings)
    return reasons, budget


def check_contract(repo, tag, requeued, warnings):
    """The dispatcher contract's requeue table should list exactly StatusReason.REQUEUEABLE."""
    text = git_show(repo, tag, CONTRACT_PATH)
    section = re.search(r"^## Ending\n(.*?)(?=^## )", text, flags=re.S | re.M)
    if not section:
        warnings.append(f"{CONTRACT_PATH}: no '## Ending' section to check the requeue table against")
        return
    listed = set(re.findall(r"^\|\s*`([A-Za-z]+)`\s*\|", section.group(1), flags=re.M))
    if listed != requeued:
        warnings.append(f"{CONTRACT_PATH} lists {sorted(listed)} as requeued; StatusReason.java"
                        f" says {sorted(requeued)}")


# ---------------------------------------------------------------------------------------------
# Notes and areas


def area_for(error):
    for prefixes, span, area, see in AREA_RULES:
        if prefixes and not any(error["name"].startswith(p) for p in prefixes):
            continue
        if span and not span[0] <= error["code"] <= span[1]:
            continue
        return area, see
    raise GenerateError(f"no area for {error['name']} (code {error['code']}): add a rule to AREA_RULES")


def check_notes(notes, errors, reasons, warnings):
    if not isinstance(notes.get("errors"), dict) or not isinstance(notes.get("statusReasons"), dict):
        raise GenerateError("notes.json needs \"errors\" and \"statusReasons\" objects")
    by_reason = {e["reason"]: e for e in errors}
    by_name = {e["name"]: e for e in errors}
    for key, note in notes["errors"].items():
        if key not in by_reason:
            hint = (f" (that's the enum name; the reason is {by_name[key]['reason']})"
                    if key in by_name else "")
            raise GenerateError(f"notes.json: {key} isn't a reason in BoomerangError{hint}")
        check_note_shape(f"errors.{key}", note, ("why", "do"))
    values = {r["value"] for r in reasons}
    for key, note in notes["statusReasons"].items():
        if key not in values:
            raise GenerateError(f"notes.json: status reason {key} isn't in StatusReason.java")
        check_note_shape(f"statusReasons.{key}", note, ("meaning", "do"))
    for reason in reasons:
        if reason["value"] not in notes["statusReasons"]:
            warnings.append(f"status reason {reason['value']} has no note")


def check_note_shape(where, note, required):
    if not isinstance(note, dict):
        raise GenerateError(f"notes.json: {where} must be an object")
    for field in required:
        if not isinstance(note.get(field), str) or not note[field].strip():
            raise GenerateError(f"notes.json: {where} needs \"{field}\"")
    related = note.get("related", [])
    if not isinstance(related, list) or not all(
            isinstance(r, dict) and r.get("text") and r.get("link") for r in related):
        raise GenerateError(f"notes.json: {where}.related must be a list of {{text, link}}")
    unknown = set(note) - set(required) - {"related"}
    if unknown:
        raise GenerateError(f"notes.json: {where} has unknown fields {sorted(unknown)}")


# ---------------------------------------------------------------------------------------------
# Rendering


def marker(tag):
    return (f"{MARKER} from flow.service.workflow {tag}. Don't edit by hand;"
            " edit tools/errors/notes.json. -->")


def show_message(message):
    return PLACEHOLDER.sub("{…}", message)


def link(text, target):
    return f"[{text}]({target})"


def code_ranges(codes):
    codes = sorted(set(codes))
    spans, start, prev = [], None, None
    for c in codes:
        if start is None:
            start = prev = c
        elif c == prev + 1:
            prev = c
        else:
            spans.append((start, prev))
            start = prev = c
    if start is not None:
        spans.append((start, prev))
    return ", ".join(str(a) if a == b else f"{a}–{b}" for a, b in spans)


def note_text(text, budget):
    """A note's text, with {requeueBudget} replaced by the engine's requeue budget."""
    if "{requeueBudget}" in text and budget is None:
        raise GenerateError("a note uses {requeueBudget}, but EngineConstants.MAX_RETRIES wasn't found")
    return text.strip().replace("{requeueBudget}", str(budget))


def render_related(note):
    return ", ".join(link(r["text"], r["link"]) for r in note.get("related", []))


def render_error(error, note, see, shared_with, unused, budget):
    lines = [f"### {error['reason']}", ""]
    status = f"HTTP status {error['status']} · code {error['code']}"
    if shared_with:
        status += ", shared with " + ", ".join(f"`{r}`" for r in shared_with)
    lines += [status, ""]
    lines += ["```text", error["message"], "```", ""]
    if unused:
        lines += ["**Not returned in this release.** Flow defines this code, but no request"
                  " returns it.", ""]
    if note:
        lines += [f"**Why it happens:** {note_text(note['why'], budget)}", ""]
        lines += [f"**What to do:** {note_text(note['do'], budget)}", ""]
        if note.get("related"):
            lines += [f"**Related:** {render_related(note)}", ""]
    else:
        lines += [f"See: {link(*see)}.", ""]
    return lines


def render_reason(reason, note, budget):
    lines = [f"### {reason['value']}", ""]
    facts = []
    if reason["setters"]:
        facts.append("Set by " + " or ".join(reason["setters"]))
    if reason["requeued"]:
        facts.append("Requeued" + (f" up to {budget} times, then failed" if budget else ", then failed"))
    if reason["never_retried"]:
        facts.append("Task retries don't apply")
    if facts:
        lines += [" · ".join(facts), ""]
    if note:
        lines += [f"**What it means:** {note_text(note['meaning'], budget)}", ""]
        lines += [f"**What to do:** {note_text(note['do'], budget)}", ""]
        if note.get("related"):
            lines += [f"**Related:** {render_related(note)}", ""]
    else:
        lines += [f"See: {link(*STATUS_SEE)}.", ""]
    return lines


def render(errors, raised, reasons, budget, notes, tag):
    if ": " in DESCRIPTION or " #" in DESCRIPTION:
        raise GenerateError("DESCRIPTION would need YAML quoting: drop the ': ' or ' #'")
    lines = [
        "---",
        f"title: {TITLE}",
        f"order: {ORDER}",
        f"description: {DESCRIPTION}",
        f'verified: "{tag}"',
        "---",
        "",
        marker(tag),
        "",
        f"# {TITLE}",
        "",
        "When Flow refuses a request, the API answers with a code, a reason and a message. When a"
        " task or run ends early, it carries a status reason. This page lists them all, as Flow"
        f" {tag} defines them, with what each means and what to do.",
        "",
        "To find one, search this page for the code or the reason, such as `1020` or"
        " `QUOTA_EXCEEDED`. Status reasons, such as `ParamUnresolved`, are under"
        " [Task and run status reasons](#task-and-run-status-reasons).",
        "",
        "## How to read an entry",
        "",
        "- **The heading** is the error's reason, as the response's `reason` field carries it."
        " Look errors up by reason, not code: a few codes carry two reasons.",
        "- **The HTTP status and code** are the response's status and its `code` field.",
        "- **The message** is the response's `message`, verbatim. `{…}` marks a value Flow fills"
        " in, such as a name or a count.",
        "- **Not returned in this release** marks a code Flow defines but never sends.",
        "",
        "For the whole response body, see [Read an error](../apis/overview#read-an-error).",
        "",
    ]

    by_code = {}
    for error in errors:
        by_code.setdefault(error["code"], []).append(error["reason"])
    placed = {key: [] for key, _, _ in AREAS}
    for error in errors:
        area, see = area_for(error)
        placed[area].append((error, see))

    for key, heading, intro in AREAS:
        # By code, with the codes Flow never returns last.
        entries = sorted(placed[key], key=lambda pair: (
            pair[0]["name"] not in raised, pair[0]["code"], pair[0]["reason"]))
        if not entries:
            continue
        codes = [e["code"] for e, _ in entries]
        label = "Code" if len(set(codes)) == 1 else "Codes"
        lines += [f"## {heading}", "", f"{intro} {label} {code_ranges(codes)}.", ""]
        for error, see in entries:
            shared = [r for r in by_code[error["code"]] if r != error["reason"]]
            lines += render_error(error, notes["errors"].get(error["reason"]), see, shared,
                                  error["name"] not in raised, budget)

    lines += [
        "## Task and run status reasons",
        "",
        "A status reason says why a task or run ended the way it did. On the run page, a run's"
        " reason shows beside its status, and a task's shows as **Reason** under **View Details**,"
        " with its **Message** beside it. A task or run that ends for no cause of its own has none.",
        "",
        "Each entry says who sets the reason. **Requeued** means the task never ran to an end,"
        " so Flow hands it to a dispatcher again before failing it. **Task retries don't apply**"
        " means the task's own **Retries** setting never repeats it, because a retry can't change"
        " the outcome. A reason Flow doesn't know is an ordinary failure.",
        "",
    ]
    for reason in reasons:
        lines += render_reason(reason, notes["statusReasons"].get(reason["value"]), budget)

    lines += [
        "## Next steps",
        "",
        "- [Troubleshooting](./troubleshooting): what to check, starting from what you see.",
        "- [Known issues](./known-issues): defects in this release and their workarounds.",
        "- [Read an error](../apis/overview#read-an-error): the API's error body.",
        "- [Runs](../fundamentals/runs): statuses, retries and timeouts.",
        "",
    ]
    return "\n".join(lines).rstrip() + "\n"


# ---------------------------------------------------------------------------------------------
# Link check


def slugify(heading):
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", heading)
    text = text.replace("`", "").replace("**", "")
    text = re.sub(r"[^\w\- ]", "", text.lower())
    return text.replace(" ", "-")


def anchors(markdown):
    found, counts, in_fence = set(), {}, False
    for line in markdown.splitlines():
        if line.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        match = re.match(r"^(#{1,6})\s+(.*?)\s*#*\s*$", line)
        if not match:
            continue
        slug = slugify(match.group(2))
        n = counts.get(slug, 0)
        counts[slug] = n + 1
        found.add(slug if n == 0 else f"{slug}-{n}")
    return found


def check_links(page, base):
    """Every relative link and anchor on the page, resolved from the folder the page lives in."""
    problems, cache = [], {}
    own = anchors(page)
    in_fence = False
    for line in page.splitlines():
        if line.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        for target in re.findall(r"\]\(([^)\s]+)\)", line):
            if re.match(r"^[a-z]+:", target):
                continue
            path, _, anchor = target.partition("#")
            if not path:
                if anchor not in own:
                    problems.append(f"#{anchor}: no such heading on this page")
                continue
            if path.endswith(".md") or path.startswith("/"):
                problems.append(f"{target}: use a relative path without .md")
                continue
            file = (base / f"{path}.md").resolve()
            if not file.is_file():
                problems.append(f"{target}: {file} doesn't exist")
                continue
            if anchor:
                if file not in cache:
                    cache[file] = anchors(file.read_text())
                if anchor not in cache[file]:
                    problems.append(f"{target}: no heading #{anchor} in {file.name}")
    return list(dict.fromkeys(problems))


# ---------------------------------------------------------------------------------------------


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--flow-repo", required=True, help="a clone of boomerang-io/flow.service.workflow")
    parser.add_argument("--tag", required=True, help="the Flow release tag the docs describe")
    parser.add_argument("--out", default=str(DEFAULT_OUT),
                        help="the page to write (default: flow/introduction/error-codes.md)")
    parser.add_argument("--notes", default=str(DEFAULT_NOTES),
                        help="notes file (default: tools/errors/notes.json)")
    parser.add_argument("--check", action="store_true",
                        help="write nothing; exit 1 if the page differs from what the tag generates")
    args = parser.parse_args(argv)

    out = Path(args.out).resolve()
    warnings = []
    try:
        notes = json.loads(Path(args.notes).read_text())
        errors = load_errors(args.flow_repo, args.tag)
        messages = parse_properties(git_show(args.flow_repo, args.tag, MESSAGES_PATH))
        for error in errors:
            message = messages.get(error["reason"])
            if message is None:
                warnings.append(f"{error['reason']} has no message; the API answers"
                                " \"No message available\"")
                message = "No message available"
            elif PLACEHOLDER.search(message) and "'" in message:
                warnings.append(f"{error['reason']}: MessageFormat drops the single quotes in"
                                " this message when it has arguments")
            error["message"] = show_message(message)
        raised = raised_errors(args.flow_repo, args.tag, warnings)
        reasons, budget = load_status_reasons(args.flow_repo, args.tag, warnings)
        check_notes(notes, errors, reasons, warnings)
        for key in notes["errors"]:
            name = next(e["name"] for e in errors if e["reason"] == key)
            if name not in raised:
                warnings.append(f"notes.json has a note for {key}, which isn't returned at {args.tag}")
        page = render(errors, raised, reasons, budget, notes, args.tag)
        # The links are written for the page's place in flow/introduction/, wherever --out points.
        problems = check_links(page, DEFAULT_OUT.parent)
        if problems:
            raise GenerateError("broken links:\n  " + "\n  ".join(problems))
    except (GenerateError, json.JSONDecodeError, OSError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1

    for message in warnings:
        print(f"warning: {message}", file=sys.stderr)

    if args.check:
        if not out.exists() or out.read_text() != page:
            print(f"differs: {out}")
            return 1
        return 0

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page)
    unused = [e for e in errors if e["name"] not in raised]
    with_notes = [e for e in errors if e["reason"] in notes["errors"]]
    reason_notes = [r for r in reasons if r["value"] in notes["statusReasons"]]
    print(
        f"Wrote {out} from {args.tag}: {len(errors)} error codes ({len(with_notes)} with notes,"
        f" {len(unused)} not returned) and {len(reasons)} status reasons"
        f" ({len(reason_notes)} with notes)."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
