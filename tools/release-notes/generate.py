#!/usr/bin/env python3
"""Generate the Boomerang Flow release notes page from flow.service.workflow's CHANGELOG.md at a ref.

Reads CHANGELOG.md with `git show <ref>:CHANGELOG.md` and writes flow/introduction/release-notes.md:
one `## <version>` section per release, newest first, with the Upgrading, Added, Changed and Fixed
subsections kept verbatim. Upgrading items that ask the operator to act are marked Breaking, with a
link to the upgrade page. Markdown links that point inside the Flow repo become GitHub URLs at the
ref. See tools/release-notes/README.md.

Python 3.9+, standard library only.
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path

DOCS_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_OUT = DOCS_ROOT / "flow" / "introduction" / "release-notes.md"

GITHUB = "https://github.com/boomerang-io/flow"
CHANGELOG = "CHANGELOG.md"

TITLE = "Release notes"
ORDER = 7
DESCRIPTION = ("Every change in each Boomerang Flow release, newest first, "
               "with the upgrade steps each one needs.")

# Subsections in the order the page shows them. Any other subsection follows, in CHANGELOG order.
SUBSECTION_ORDER = ["Upgrading", "Added", "Changed", "Fixed"]
UPGRADING = "Upgrading"

# Upgrade pages, relative to flow/introduction/.
UPGRADE_FROM_V3 = ("Upgrade from v3", "../hosting/upgrading")
UPGRADE_BETWEEN_V5 = ("Upgrade between v5 releases", "../hosting/rolling-upgrades")
# The release a v3 install upgrades to. Its Breaking items link to the v3 upgrade; a later
# release's link to the rolling upgrade, unless the item itself is about v3.
FIRST_V5 = (5, 0, 0)

VERSION_RE = re.compile(r"\b(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?\b")
DATE_RE = re.compile(r"\b(\d{4})-(\d{2})-(\d{2})\b")
MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
          "September", "October", "November", "December"]

# --- Breaking: an Upgrading item whose text asks the operator to do something -------------------

# A clause that starts with one of these verbs is an instruction: "Set `flow.engine.url`",
# "remove them from the deployment", "To keep files between runs, add ...".
IMPERATIVES = {
    "add", "back", "change", "check", "configure", "copy", "create", "delete", "enter", "export",
    "give", "grant", "install", "migrate", "mount", "move", "point", "read", "remove", "rename",
    "replace", "restart", "route", "send", "set", "trust", "update", "upgrade",
}
# Clause openings that look imperative but aren't. "Change unit `_0036_...`" names a migration.
NOT_IMPERATIVE = re.compile(r"^change units?\b", re.IGNORECASE)
# A leading clause before the instruction: "Before a v3 upgrade, check ...",
# "In the Slack app's settings, set ...".
LEAD_CLAUSE = re.compile(
    r"^(after|before|for|if|in|on|once|to|unless|until|when|where|while|with|without)\b[^,]*,\s*",
    re.IGNORECASE,
)
# Obligations and preconditions anywhere in the item.
OBLIGATION = re.compile(
    r"\bmust\b"
    r"|\bneeds?\b"
    r"|\bstops? (?:the )?start(?:up)?\b"
    r"|\brefused at startup\b"
    r"|\b(?:a|any) client that\b",
    re.IGNORECASE,
)
NEGATED_NEED = re.compile(r"\b(?:no longer|not|never) needs?\b", re.IGNORECASE)
MENTIONS_V3 = re.compile(r"\bv3\b")

CODE_SPAN = re.compile(r"(`+)(.+?)\1", re.DOTALL)
FENCE = re.compile(r"^\s*(```|~~~)")
INLINE_LINK = re.compile(r"(!?\[(?:[^\]\\]|\\.)*\])\(\s*(<[^>]*>|[^)\s]+)(\s+\"[^\"]*\")?\s*\)")
REFERENCE_DEF = re.compile(r"^(\s{0,3}\[[^\]]+\]:\s*)(\S+)(.*)$")
EXTERNAL = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//)", re.IGNORECASE)


class GenerateError(Exception):
    pass


def git(repo, *args):
    result = subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True)
    if result.returncode != 0:
        raise GenerateError(f"git {' '.join(args)}: {result.stderr.strip()}")
    return result.stdout


def is_tag(repo, name):
    result = subprocess.run(["git", "-C", str(repo), "show-ref", "--verify", "--quiet", f"refs/tags/{name}"])
    return result.returncode == 0


def url_ref(repo, ref):
    """The ref to put in GitHub URLs: the tag itself, or the commit a branch points at."""
    if is_tag(repo, ref):
        return ref
    return git(repo, "rev-parse", "--verify", f"{ref}^{{commit}}").strip()


def tag_date(repo, tag):
    out = git(repo, "for-each-ref", "--format=%(creatordate:short)", f"refs/tags/{tag}").strip()
    return out or None


def long_date(iso):
    m = DATE_RE.search(iso or "")
    if not m:
        return None
    year, month, day = int(m.group(1)), int(m.group(2)), int(m.group(3))
    return f"{day} {MONTHS[month - 1]} {year}"


def version_tuple(version):
    m = VERSION_RE.search(version or "")
    return (int(m.group(1)), int(m.group(2)), int(m.group(3))) if m else None


# --- Parsing ---------------------------------------------------------------------------------------

class Release:
    def __init__(self, heading):
        self.heading = heading
        self.unreleased = "unreleased" in heading.lower()
        m = VERSION_RE.search(heading)
        self.version = m.group(0) if m else None
        self.date = None
        d = DATE_RE.search(heading)
        if d:
            self.date = d.group(0)
        self.preamble = []          # lines before the first ### subsection
        self.subsections = []       # [(name, [lines])]

    @property
    def name(self):
        return self.version or self.heading


def parse_changelog(text):
    releases = []
    current = None
    in_fence = False
    for line in text.splitlines():
        if FENCE.match(line):
            in_fence = not in_fence
        if not in_fence and line.startswith("## "):
            current = Release(line[3:].strip())
            releases.append(current)
            continue
        if current is None:
            continue  # the CHANGELOG's title and introduction
        if not in_fence and line.startswith("### "):
            current.subsections.append((line[4:].strip(), []))
            continue
        if current.subsections:
            current.subsections[-1][1].append(line)
        else:
            current.preamble.append(line)
    return releases


def split_blocks(lines):
    """Split a subsection into top-level list items and other blocks, each a list of lines."""
    blocks = []
    in_fence = False
    for line in lines:
        starts_item = not in_fence and re.match(r"^[-*+] ", line)
        if FENCE.match(line):
            in_fence = not in_fence
        if starts_item:
            blocks.append(["item", [line]])
        elif blocks and blocks[-1][0] == "item" and (line.startswith((" ", "\t")) or not line.strip() or in_fence):
            blocks[-1][1].append(line)
        elif not line.strip():
            blocks.append(["blank", [line]])
        elif blocks and blocks[-1][0] == "text":
            blocks[-1][1].append(line)
        else:
            blocks.append(["text", [line]])
    # A blank line that ends an item belongs between blocks, not inside the item.
    for block in blocks:
        while block[0] == "item" and len(block[1]) > 1 and not block[1][-1].strip():
            block[1].pop()
    return [b for b in blocks if b[0] != "blank"]


# --- Breaking --------------------------------------------------------------------------------------

def plain(item_lines):
    """The item as one line of prose: list marker, emphasis and code spans removed."""
    text = " ".join(line.strip() for line in item_lines)
    text = re.sub(r"^[-*+]\s+", "", text)
    text = CODE_SPAN.sub(" CODE ", text)
    text = text.replace("**", "").replace("__", "")
    return re.sub(r"\s+", " ", text).strip()


def clauses(text):
    for clause in re.split(r"(?<=[.:;!?])\s+", text):
        clause = clause.strip().lstrip("(")
        while True:
            stripped = LEAD_CLAUSE.sub("", clause, count=1)
            if stripped == clause:
                break
            clause = stripped
        if clause:
            yield clause


def is_breaking(item_lines):
    text = plain(item_lines)
    if OBLIGATION.search(NEGATED_NEED.sub("", text)):
        return True
    for clause in clauses(text):
        if NOT_IMPERATIVE.match(clause):
            continue
        first = re.match(r"[A-Za-z]+", clause)
        if first and first.group(0).lower() in IMPERATIVES:
            return True
    return False


def upgrade_link(release, item_lines):
    if version_tuple(release.version) == FIRST_V5 or MENTIONS_V3.search(plain(item_lines)):
        return UPGRADE_FROM_V3
    return UPGRADE_BETWEEN_V5


def mark_breaking(item_lines, link):
    """Put the Breaking label and the upgrade link on the item's first line; the text stays as written."""
    first = item_lines[0]
    m = re.match(r"^([-*+] )(.*)$", first)
    label, href = link
    return [f"{m.group(1)}**Breaking:** see [{label}]({href}).", "  " + m.group(2), *item_lines[1:]]


# --- Links into the Flow repo ----------------------------------------------------------------------

def repo_url(target, ref):
    if target.startswith("<") and target.endswith(">"):
        target = target[1:-1]
    if EXTERNAL.match(target):
        return None
    if target.startswith("#"):
        return f"{GITHUB}/blob/{ref}/{CHANGELOG}{target}"
    path = re.sub(r"^(\./|/)+", "", target)
    return f"{GITHUB}/blob/{ref}/{path}"


def rewrite_links(lines, ref, counter):
    """Point relative Markdown links at GitHub at the ref. Code spans and fenced code are left alone."""

    def inline(match):
        url = repo_url(match.group(2), ref)
        if not url:
            return match.group(0)
        counter[0] += 1
        return f"{match.group(1)}({url}{match.group(3) or ''})"

    def prose(run):
        # Code spans may cross line breaks, so rewrite a run of prose lines as one piece.
        text = "\n".join(run)
        pieces, pos = [], 0
        for code in CODE_SPAN.finditer(text):
            pieces.append(INLINE_LINK.sub(inline, text[pos:code.start()]))
            pieces.append(code.group(0))
            pos = code.end()
        pieces.append(INLINE_LINK.sub(inline, text[pos:]))
        out = []
        for line in "".join(pieces).split("\n"):
            m = REFERENCE_DEF.match(line)
            url = repo_url(m.group(2), ref) if m else None
            if url:
                counter[0] += 1
                line = f"{m.group(1)}{url}{m.group(3)}"
            out.append(line)
        return out

    out, run, in_fence = [], [], False
    for line in lines:
        if FENCE.match(line) or in_fence:
            if run:
                out += prose(run)
                run = []
            if FENCE.match(line):
                in_fence = not in_fence
            out.append(line)
        else:
            run.append(line)
    if run:
        out += prose(run)
    return out


# --- Rendering -------------------------------------------------------------------------------------

def frontmatter(ref, ref_is_tag):
    # "Verified against Flow <ref>" only makes sense for a release tag; a branch moves.
    verified = f'verified: "{ref}"\n' if ref_is_tag else ""
    return f"---\ntitle: {TITLE}\norder: {ORDER}\ndescription: {DESCRIPTION}\n{verified}---\n"


def marker(ref):
    return (f"<!-- Generated by tools/release-notes/generate.py from flow.service.workflow {ref}. "
            "Don't edit by hand. -->")


def status_line(release, ref, ref_is_tag, link_ref, released, date):
    if not released:
        if ref_is_tag:
            source = f"[{ref}]({GITHUB}/releases/tag/{ref})"
        else:
            source = f"the `{ref}` branch at [{link_ref[:9]}]({GITHUB}/tree/{link_ref})"
        return (f"> [!NOTE]\n> {release.name} isn't released yet. These notes are from {source}, "
                "and can change before the release.")
    github = f"[{release.version} on GitHub]({GITHUB}/releases/tag/{release.version})"
    if date:
        return f"Released {date}. {github}."
    return f"{github}."


def ordered_subsections(release):
    named = {name: lines for name, lines in release.subsections}
    order = [n for n in SUBSECTION_ORDER if n in named]
    order += [n for n, _ in release.subsections if n not in SUBSECTION_ORDER]
    return [(n, named[n]) for n in order]


def render_release(release, repo, ref, ref_is_tag, link_ref, stats):
    released = not release.unreleased or (ref_is_tag and release.version == ref)
    date = long_date(release.date)
    if released and not date and release.unreleased:
        date = long_date(tag_date(repo, ref))  # the release tag still carries "Unreleased: <version>"
    out = [f"## {release.name}", "", status_line(release, ref, ref_is_tag, link_ref, released, date), ""]

    preamble = rewrite_links(release.preamble, link_ref, stats["links"])
    if any(line.strip() for line in preamble):
        out += preamble
        out.append("")

    counts = {"breaking": 0, "upgrading": 0}
    for name, lines in ordered_subsections(release):
        lines = rewrite_links(lines, link_ref, stats["links"])
        blocks = split_blocks(lines)
        if not blocks:
            continue
        out += [f"### {name}", ""]
        for kind, block in blocks:
            if kind == "item" and name == UPGRADING:
                counts["upgrading"] += 1
                if is_breaking(block):
                    counts["breaking"] += 1
                    block = mark_breaking(block, upgrade_link(release, block))
            out += block
            if kind != "item":
                out.append("")
        if out[-1] != "":
            out.append("")
    stats["sections"].append((release.name, released, counts["breaking"], counts["upgrading"]))
    return out


def render_page(releases, repo, ref):
    ref_is_tag = is_tag(repo, ref)
    link_ref = url_ref(repo, ref)
    stats = {"links": [0], "sections": []}
    lines = [
        frontmatter(ref, ref_is_tag),
        marker(ref),
        "",
        f"# {TITLE}",
        "",
        "Every change in each Boomerang Flow release, newest first, as the product's changelog records it. "
        "For the story of what changed and why it matters, see [What's new](./whats-new).",
        "",
        "Under **Upgrading**, an item marked **Breaking** needs an action from you when you upgrade, "
        "and links to the upgrade steps.",
        "",
    ]
    for release in releases:
        lines += render_release(release, repo, ref, ref_is_tag, link_ref, stats)
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(lines) + "\n", stats


def select(releases, versions):
    wanted = []
    for v in versions:
        match = [r for r in releases if r.version == v or r.heading == v]
        if not match:
            names = ", ".join(r.heading for r in releases) or "none"
            raise GenerateError(f"no CHANGELOG section for {v!r}. Sections at this ref: {names}")
        wanted += match
    chosen = [r for r in releases if r in wanted or (not r.unreleased and r.version)]
    for r in releases:
        if r not in chosen and r.unreleased:
            print(f"warning: skipped unreleased section {r.heading!r}; name it with --version to publish it",
                  file=sys.stderr)
        elif r not in chosen:
            print(f"warning: skipped section {r.heading!r}: no version in its heading", file=sys.stderr)
    return chosen


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--flow-repo", required=True, help="a clone of boomerang-io/flow.service.workflow")
    parser.add_argument("--ref", required=True, help="the tag (such as 5.0.0) or branch to read CHANGELOG.md at")
    parser.add_argument("--version", required=True, action="append", dest="versions",
                        help="a version heading to publish, such as 5.0.0; repeat for more. "
                             "Every released section is published as well.")
    parser.add_argument("--out", default=str(DEFAULT_OUT),
                        help="the page to write (default: flow/introduction/release-notes.md)")
    parser.add_argument("--check", action="store_true",
                        help="write nothing; exit 1 if the page differs from what the ref generates")
    args = parser.parse_args(argv)

    try:
        text = git(args.flow_repo, "show", f"{args.ref}:{CHANGELOG}")
        releases = select(parse_changelog(text), args.versions)
        page, stats = render_page(releases, args.flow_repo, args.ref)
    except GenerateError as e:
        print(f"error: {e}", file=sys.stderr)
        return 1

    out = Path(args.out)
    if args.check:
        current = out.read_text() if out.exists() else ""
        if current != page:
            print(f"{out} differs from what {args.ref} generates", file=sys.stderr)
            return 1
        print(f"{out} is current")
        return 0

    out.write_text(page)
    for name, released, breaking, upgrading in stats["sections"]:
        state = "released" if released else "not released yet"
        print(f"{name} ({state}): {upgrading} upgrading items, {breaking} marked Breaking")
    print(f"{stats['links'][0]} links into the Flow repo pointed at GitHub")
    print(f"wrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
