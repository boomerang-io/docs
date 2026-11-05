# Docs screenshots

Captures the Flow docs screenshots from a running v5 stack with Playwright. Sign-in and the API helpers are borrowed from `flow.service.workflow/e2e`.

## Run

1. Start the v5 stack in `flow.service.workflow`, using either option:
   - `docker compose --profile stack up -d --build`;
   - or service-core on the host plus `cd client-web && pnpm dev`.

   You need the webapp on `:3000`, service-core on `:7700`, and IDPZero on `:4380`.
2. Install and capture:

```bash
cd tools/screenshots
npm install
npx playwright test                       # every shot, into out/ (git-ignored) for review
npx playwright test -g home               # one shot, by its id in shots.ts
SHOTS_DEST=flow npx playwright test       # write into flow/<category>/assets/ for the docs
```

### Live walk of every route

```bash
npx playwright test --project=walk
```

This visits every user-reachable route in `walk.ts` (46 stops, including each editor tab, each Configure section, each Manage workspace tab and each Admin settings group). For each stop it writes to `out/walk/`:
- `<id>.yml`: the accessibility tree, with every label exactly as rendered;
- `<id>.png`: a full-page image;
- `<id>--<n>.yml` and `<id>--<n>.png`: each dialog the stop opens (for example **Create a new workflow** and **Add parameter**).

`_index.md` lists every stop, with anything that failed to load or open. Write docs labels from the `.yml` files.

### Every run

Each run:
1. signs in as `usr-flow-admin` through IDPZero;
2. seeds an **Example workspace** (three small workflows and a run of each) if it's missing;
3. captures every entry in `shots.ts` at 1440×900, light theme.

## Settings

| Variable | Default | Meaning |
| --- | --- | --- |
| `SHOTS_DEST` | `out` | `flow` writes into the docs' asset folders |
| `SHOTS_BASE_URL` | `http://localhost:3000` | The webapp |
| `SHOTS_API_URL` | `http://localhost:7700` | service-core, for seeding |
| `SHOTS_USER` | `usr-flow-admin` | IDPZero user to sign in as (`usr-flow-user` for a non-admin view) |
| `SHOTS_SCALE` | `1` | Device scale factor; `2` for high-density images |
| `SHOTS_SEED_START` | `true` | `false` parks the seeded runs at `ready` when no dispatcher is running |

## Adding a shot

Add an entry to `shots.ts`:
- `id`: the test title;
- `page`: the docs page that uses it;
- `url`: the path under `/apps/flow`, with `{ws}` for the example workspace;
- `out`: the image path relative to `flow/`;
- `ready`: optionally, a role and name, or text, that must be visible first;
- `prepare`: optionally, steps that open a modal or tab before the capture.

## Final captures need a clean database

Screenshots show whatever the database holds: the platform name (Admin › Settings › Customization, default **Boomerang Flow**), every workspace on Home, and the runs. A shared development database carries e2e leftovers, such as an `e2e-app-name-…` platform name and other people's workspaces. Use those captures for review only.

Take the published images from a fresh database: a dedicated stack, or a reset of a stack nobody else is using. Never reset a shared one.
