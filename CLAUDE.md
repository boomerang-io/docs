# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Markdown source for the Boomerang Flow and Boomerang Bosun documentation at useboomerang.io/docs. The repo is content plus one tool: `tools/screenshots/`, a Playwright project that captures docs screenshots from a running Flow stack (see its README). There is no build, lint, or test tooling. Write and update Flow pages with the `flow-tech-writer` skill. The site is rendered by https://github.com/boomerang-io/website using the [Remix Docs Template](https://github.com/boomerang-io/remix-docs-template?tab=readme-ov-file#frontmatter), which defines the frontmatter rules. The home page cards and the sidenav category config (`contentConfig.js`) also live in that website repo, not here.

- `main` is published automatically.
- Versioned docs come from git tags named `<product>@<version>`, for example `flow@3.12.0` and `flow@4.0.0`.

## Content Structure

The layout is `<product>/<category>/<doc>.md`. The products are `flow/` and `bosun/`.

- **Category `index.md` files contain frontmatter only** (`title`, `order`). Their `order` sets the category's position in the sidenav. Each doc's `order` sets its position within its category.
- **Product `index.md`** (`flow/index.md`, `bosun/index.md`) is the landing page. It is built from `<docs-cards>`/`<docs-card>` HTML blocks. `bosun/index.md` has `hidden: true`.
- Common frontmatter keys: `title`, `order`, `description`, `toc`, `hidden`.
- Images go in an `assets/` folder inside the category and are referenced relatively, for example `./assets/img/foo.png`.
- **The docs describe Flow v5** (5.0.0). Each rewritten page carries an HTML comment naming the Flow tag it was written against and how its UI labels were checked; re-check against the release tag before publishing. `guides/slack.md` is hidden until flow#751 is fixed.
- `.github/CONTRIBUTING.md` recommends that a new product start with an `introduction/` category containing `overview`, `getting-started`, `whats-new`, and `known-issues`.

### Linking

- **Same product:** use a relative path with no leading `/`, for example `../fundamentals/parameters` or `../architecture/security#tokens`. The `<docs-cards>` hrefs use the `/category/doc` form.
- **Another product:** use `/docs/<product>/<category>/<slug>` with no version.
- **Slugs are file paths.** The website loads `<slug>.md` (`website/app/utils/github/docs.ts:101`), so a page's URL is its path under `flow/` without `.md`. The title doesn't affect the URL. CONTRIBUTING.md's "kebab-case of the title" rule is out of date: older links built that way, such as `../guides/workflow-editor` for `guides/edit.md`, are broken. Renaming a file changes its URL, so fix inbound links and add a website redirect.

## API Reference (generated)

Everything in `flow/apis/` except `index.md` is generated: `overview.md`, `*Route.md`, and `models/*.md`. Don't hand-edit these files. To change them, change the contract (in the Flow repo) or the templates, and regenerate:

- `flow/apis/assets/api-v2.yaml`: the v5 public API contract, OpenAPI 3.1, copied from `contracts/api-v2.yaml` in `boomerang-io/flow` at a release tag. Operation summaries and descriptions come from the Java annotations there, and each operation's summary also becomes its heading and anchor in the Route page. Its tag (each operation's first tag) becomes the Route page and its title.
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

# 2. Generate into the scratch directory. flowTag sets the contract link and version in overview.md.
rm -rf "$OUT"
npx @openapitools/openapi-generator-cli generate -i ./flow/apis/assets/api-v2.yaml -g markdown -o "$OUT" \
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
```

Then check the result:

- **Anchors.** The templates build each operation's anchor as `kebabcase(titlecase(lowercase(summary)))`, which matches the website's heading slugger (`rehype-slug`) only while summaries are letters, spaces and `' , . :`. A summary with a digit, hyphen, parenthesis, backtick, underscore or `&` gets a link that misses its heading. Two operations with the same summary on one Route page collide. Check every link and anchor in `flow/apis/` resolves, and fix a bad summary in the Flow repo.
- **Inbound links.** Pages outside `apis/` link to `../apis/overview`, `../apis/WebhooksAndEventsRoute` and `../apis/SystemRoute`. If a tag is renamed, its Route page's URL changes: fix those links and add a website redirect.
- **Authorization.** Each operation shows its effective security: the contract's top-level schemes, or its own override. Only the routes that declare `security: []` say "No authorization required".

Templating references:
- [CodegenOperation variables](https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator/src/main/java/org/openapitools/codegen/CodegenOperation.java)
- [Mustache lambdas](https://openapi-generator.tech/docs/templating#mustache-lambdas)
