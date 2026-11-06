# API contract diff

`diff.py` compares two OpenAPI contracts and writes the difference as Markdown. It generates the detail of `flow/apis/changelog.md`.

Python 3, standard library only. It reads JSON or YAML: YAML through PyYAML when it's installed, otherwise through Ruby's YAML library (`ruby -ryaml`). Without either, pass JSON. `contract.py` holds the loader and the operation walk; `tools/api-examples/prepare.py` uses it too.

## Run

```bash
python3 tools/apidiff/diff.py --old OLD --new NEW [options]
```

| Option | Meaning |
| --- | --- |
| `--old`, `--new` | The two contracts, JSON or YAML |
| `--old-label`, `--new-label` | How the generated comment names each contract (default: its path) |
| `--rename OLD=NEW` | Treat paths under the `OLD` prefix as moved to `NEW`, so their operations compare as changed, with a path note, instead of removed and added. Repeatable; the longest matching prefix wins. |
| `--undeclared-auth unknown\|none` | How to read an old operation that declares no security. `unknown` (default) leaves its auth out of the comparison and counts it in one sentence. `none` reads it as no auth, as OpenAPI does, so any new auth is tightening. |
| `--route-links` | Link each tag to its generated Route page (`./<Tag>Route`) |
| `--heading-level` | The Markdown level of each tag heading (default 3) |
| `--page FILE` | Replace the text between `<!-- apidiff:start -->` and `<!-- apidiff:end -->` in `FILE` instead of printing |

It prints the counts to stderr: `added 28, removed 9, changed 61, breaking 60`.

## What it compares

Operations match on method and path, with path parameter names ignored (`/run/{id}` matches `/run/{runId}`), after any `--rename`. Per tag, it lists:
- **Added** and **Removed** operations, by method and path, with the first sentence of the summary. A removed operation sits under its old tag.
- **Changed** operations, under the new tag, each with notes: a moved path or a new tag; query, header and cookie parameters added or removed, or now required or optional; the request body's schemas; the success responses' schemas; auth; a new `deprecated` flag.

Schemas are compared by name (`Team` → `Workspace`), not field by field.

**Breaking** marks:
- a removed operation;
- a moved path;
- a new required parameter, or a parameter that became required;
- a new required request body, or a body that became required;
- auth tightening: no auth to some, or an auth scheme dropped.

## The API changelog

`flow/apis/changelog.md` keeps its hand-written lede and summary outside the markers, so a rerun replaces only the detail. The API generation never touches the page: it removes and copies only `overview.md`, `*Route.md` and `models/*.md`.

The first run compared the v4 contract with the v5 contract at `5.0.0-beta.39`:

```bash
git show main:flow/apis/assets/spec.json > "${TMPDIR:-/tmp}/flow-v4.json"
python3 tools/apidiff/diff.py --old "${TMPDIR:-/tmp}/flow-v4.json" --new flow/apis/assets/api-v2.yaml \
  --old-label "the v4 contract (flow/apis/assets/spec.json on main, version 4.0.0)" \
  --new-label "the v5 contract at 5.0.0-beta.39 (flow/apis/assets/api-v2.yaml)" \
  --rename '/api/v2/team/{team}=/api/v2/workspace/{workspace}' --rename '/api/v2/team=/api/v2/workspace' \
  --route-links --page flow/apis/changelog.md
```

After a rerun, check the summary above the markers still matches the counts and the big moves.
