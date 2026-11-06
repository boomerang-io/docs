# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Markdown source for the Boomerang Flow and Boomerang Bosun documentation at useboomerang.io/docs. The repo is content plus tooling in `tools/` (see each README):
- `screenshots/` walks the webapp and captures screenshots from a running Flow stack;
- `catalogue/`, `errors/`, `release-notes/` and `config-reference/` generate pages from flow.service.workflow at a release tag. There is no build, lint, or test tooling. Write and update Flow pages with the `flow-tech-writer` skill. The site is rendered by https://github.com/boomerang-io/website using the [Remix Docs Template](https://github.com/boomerang-io/remix-docs-template?tab=readme-ov-file#frontmatter), which defines the frontmatter rules. The home page cards and the sidenav category config (`contentConfig.js`) also live in that website repo, not here.

- `main` is published automatically.
- Versioned docs come from git tags named `<product>@<version>`, for example `flow@3.12.0` and `flow@4.0.0`.

## Content Structure

The layout is `<product>/<category>/<doc>.md`. The products are `flow/` and `bosun/`.

- **Category `index.md` files contain frontmatter only** (`title`, `order`). Their `order` sets the category's position in the sidenav, and each doc's `order` sets its position within its category. Content in a category `index.md` isn't reachable at a URL, so give a section's landing a named page (for example `catalogue/overview.md`).
- **Orders start at 1.** The website sorts with `order || Infinity`, so `order: 0` puts a page last.
- **Flow's sections, in menu order:** introduction, fundamentals (titled Concepts), webapp (Using the webapp), guides, catalogue (generated), apis (generated), architecture, hosting, extend, tutorials. The `flow-tech-writer` skill has the full table.
- **Product `index.md`** (`flow/index.md`, `bosun/index.md`) is the landing page. It is built from `<docs-cards>`/`<docs-card>` HTML blocks. `bosun/index.md` has `hidden: true`.
- **Frontmatter the site reads:** `title`, `order` (from 1), `description` (also listed in `/llms.txt`), `verified` (quoted Flow release, shown under the H1), `sidebarTitle` (short menu label), `toc`, `hidden`, `tag`. The site also serves every page as Markdown at its URL plus `.md`, and adds a "Found a problem?" issue link.
- **Syntax:** GitHub alerts (`> [!NOTE]`, `> [!WARNING]`) and tabs (same-level headings between `<!-- tabs -->` and `<!-- /tabs -->`).
- Images go in an `assets/` folder inside the category and are referenced relatively, for example `./assets/img/foo.png`.
- **The docs describe Flow v5** (5.0.0). Each rewritten page carries an HTML comment naming the Flow tag it was written against and how its UI labels were checked; re-check against the release tag before publishing. `guides/slack.md` is hidden until flow#751 is fixed.
- `.github/CONTRIBUTING.md` recommends that a new product start with an `introduction/` category containing `overview`, `getting-started`, `whats-new`, and `known-issues`.

### Linking

- **Same product:** use a relative path with no leading `/`, for example `../fundamentals/parameters` or `../architecture/security#tokens`. The `<docs-cards>` hrefs use the `/category/doc` form.
- **Another product:** use `/docs/<product>/<category>/<slug>` with no version.
- **Slugs are file paths.** The website loads `<slug>.md` (`website/app/utils/github/docs.ts:101`), so a page's URL is its path under `flow/` without `.md`. The title doesn't affect the URL. CONTRIBUTING.md's "kebab-case of the title" rule is out of date: older links built that way, such as `../guides/workflow-editor` for `guides/edit.md`, are broken. Renaming a file changes its URL, so fix inbound links and add a website redirect.

## API Reference (generated)

Everything in `flow/apis/` except `index.md` and the prose of `changelog.md` is generated: `overview.md`, `*Route.md` and `models/*.md`. Don't hand-edit these files. To change them, change the contract (in the Flow repo), the templates, or the examples, and regenerate:

- `flow/apis/assets/api-v2.yaml`: the v5 public API contract, OpenAPI 3.1, copied from `contracts/api-v2.yaml` in `boomerang-io/flow` at a release tag. Operation summaries and descriptions come from the Java annotations there, and each operation's summary also becomes its heading and anchor in the Route page. Its tag (each operation's first tag) becomes the Route page and its title.
- **Examples live in `tools/api-examples/examples.json`, never in the contract** (the owner's decision). They hold request bodies and real responses, captured from a running stack, keyed by `"METHOD /path"`. `inject.py` inserts them into the Route pages between markers.
- **`changelog.md`:** the lede and summary are hand-written. The section between `<!-- apidiff:start -->` and `<!-- apidiff:end -->` comes from `tools/apidiff/diff.py`, comparing two contracts (see its README). Generation never touches it.
- `flow/apis/assets/templates/`:
  - `README.mustache` produces `overview.md`: hand-written prose (base path, auth, errors, paging, labels, YAML, clients, the contract link) plus the generated auth schemes and route and model index. Write its prose to the `flow-tech-writer` voice guide and verify it against the tag.
  - `api.mustache` produces each `*Route.md`.
  - `model.mustache` produces each model page.
  - These templates emit the frontmatter, so the generated pages get their titles from them.
- `openapitools.json` pins the generator to version 7.13.0. It needs Java 11 or later; `npx` fetches the CLI, which downloads the pinned jar.

Regenerate from the repo root. Set `FLOW_REPO` to a clone of `boomerang-io/flow` and `FLOW_TAG` to the release the docs describe. The generator writes to a scratch directory outside the repo.

```bash
FLOW_REPO=../flow.service.workflow
FLOW_TAG=5.0.0-beta.39
OUT="${TMPDIR:-/tmp}/flow-apigen"

# 1. Refresh the contract from the Flow repo at the tag
git -C "$FLOW_REPO" fetch --tags
git -C "$FLOW_REPO" show "$FLOW_TAG:contracts/api-v2.yaml" > ./flow/apis/assets/api-v2.yaml

# 2. Prepare the contract (curl URLs and bodies the templates can't build), then generate into the
#    scratch directory. flowTag sets the contract link, version and `verified` in the pages.
rm -rf "$OUT" && mkdir -p "$OUT"
python3 tools/api-examples/prepare.py --in ./flow/apis/assets/api-v2.yaml --out "$OUT/api-v2.json"
npx @openapitools/openapi-generator-cli generate -i "$OUT/api-v2.json" -g markdown -o "$OUT" \
  --skip-validate-spec -t ./flow/apis/assets/templates/ --api-name-suffix 'Route' \
  --additional-properties=flowTag="$FLOW_TAG"

# 3. Remove route and model pages this generation didn't produce
for f in ./flow/apis/*Route.md; do [ -f "$OUT/Apis/$(basename "$f")" ] || git rm -q "$f"; done
for f in ./flow/apis/models/*.md; do [ -f "$OUT/Models/$(basename "$f")" ] || git rm -q "$f"; done

# 4. Move the new pages in
cp "$OUT/README.md" ./flow/apis/overview.md
cp "$OUT"/Apis/*.md ./flow/apis/
cp "$OUT"/Models/*.md ./flow/apis/models/
rm -rf "$OUT"

# 5. Insert the docs-side examples (idempotent)
python3 tools/api-examples/inject.py
```

Then check the result:

- **Anchors.** The templates build each operation's anchor as `kebabcase(titlecase(lowercase(summary)))`, which matches the website's heading slugger (`rehype-slug`) only while summaries are letters, spaces and `' , . :`. A summary with a digit, hyphen, parenthesis, backtick, underscore or `&` gets a link that misses its heading. Two operations with the same summary on one Route page collide. Check every link and anchor in `flow/apis/` resolves, and fix a bad summary in the Flow repo.
- **Inbound links.** Pages outside `apis/` link to `../apis/overview`, `../apis/WebhooksAndEventsRoute` and `../apis/SystemRoute`. If a tag is renamed, its Route page's URL changes: fix those links and add a website redirect.
- **Authorization.** Each operation shows its effective security: the contract's top-level schemes, or its own override. Only the routes that declare `security: []` say "No authorization required".

Templating references:
- [CodegenOperation variables](https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator/src/main/java/org/openapitools/codegen/CodegenOperation.java)
- [Mustache lambdas](https://openapi-generator.tech/docs/templating#mustache-lambdas)

## Task catalogue (generated)

`flow/catalogue/` is generated from Flow's task seed, except `index.md`, which is frontmatter only (a body there gets the slug `catalogue` and no page). Don't hand-edit `overview.md` or the category pages. Change the seed in the Flow repo, or `tools/catalogue/notes.json`, and regenerate at each release tag, as for the API reference. See `tools/catalogue/README.md`.

- `tools/catalogue/generate.py` (Python 3, standard library) reads `seed/tasks.json`, `seed/task-revisions.json` and `seed/settings.json` with `git show <tag>:<path>`, and writes `overview.md` plus one page per palette category, each at its latest revision.
- `tools/catalogue/notes.json` holds the hand-kept notes per task and revision, the category notes, and the tasks only a migration adds (`upload-artifact` and `download-artifact`, from `_0018__SeedArtifactTasks`), with their params read from the Java by hand.

```bash
FLOW_REPO=../flow.service.workflow
FLOW_TAG=5.0.0-beta.39

git -C "$FLOW_REPO" fetch --tags
python3 tools/catalogue/generate.py --flow-repo "$FLOW_REPO" --tag "$FLOW_TAG"
```

Then:

1. Read the warnings. The generator stops on a note for a task or revision the seed doesn't have. It warns when a migration task's names are missing from its Java source, when a migration task has moved into the seed, and when a note's `defaultImage` no longer matches the seeded default image.
2. Check `git -C "$FLOW_REPO" log <previous-tag>..<tag> -- service-core/src/main/java/io/boomerang/migration/` for a new migration that adds a task outside the seed, and add it to `migrationTasks`.
3. Review every note in `notes.json` against the release and `introduction/known-issues.md`. Remove a note whose defect is fixed.
4. A category page is removed when its category is gone. Fix inbound links to it. Pages outside `catalogue/` link only to `../catalogue/overview`.
5. Check every link and anchor in `flow/catalogue/` resolves.

`--check` writes nothing and exits 1 when the pages differ from what the tag generates.


## Other generated pages

Each of these is generated from flow.service.workflow at a release tag, so never hand-edit it. Edit the generator's `notes.json` (where it has one), regenerate, and read the warnings. Each generator takes `--flow-repo ../flow.service.workflow --tag <tag>` and has a `--check` mode that exits 1 when its pages are stale.

| Page | Generator | Source | Hand-kept input |
| --- | --- | --- | --- |
| `flow/introduction/error-codes.md` | `tools/errors/generate.py` | `BoomerangError.java`, `messages.properties`, `StatusReason.java` | `tools/errors/notes.json` (Why / What to do / Related, keyed by `reason`). Stops on a key that isn't in the source. |
| `flow/introduction/release-notes.md` | `tools/release-notes/generate.py` (also takes `--ref` and `--version`) | `CHANGELOG.md` | None. Read every **Breaking** mark in the diff: a word-matching rule sets them. `whats-new.md` stays hand-written. |
| `flow/hosting/properties-reference.md`, `settings-reference.md` | `tools/config-reference/generate.py` | both `application.properties`, `seed/settings.json` | `tools/config-reference/notes.json`. It reports properties that `configuration-reference.md` names but the source lacks; fix the hand page. |

At a release, regenerate all of these with the API reference and the task catalogue.
