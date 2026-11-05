import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Captures docs screenshots from a running Flow v5 stack (flow.service.workflow:
 * `docker compose --profile stack up -d --build`, or service-core + `pnpm dev` on the host).
 * The browser talks only to client-web's server (:3000); seeding calls service-core's API
 * directly (:7700). Sign-in and the API helpers are borrowed from flow.service.workflow/e2e.
 */
const here = path.dirname(fileURLToPath(import.meta.url));

export const STORAGE_STATE = path.join(here, ".auth", "user.json");

// Where images land: `out` (default, git-ignored, for review) or `flow` (the docs pages' assets).
export const DEST_ROOT =
  process.env.SHOTS_DEST === "flow" ? path.resolve(here, "..", "..", "flow") : path.join(here, "out");

const baseURL = process.env.SHOTS_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  // One worker: every shot reads the same seeded workspace, and order keeps runs predictable.
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "off",
  },
  projects: [
    // Fresh, never-activated install only: SHOTS_FIRST_RUN=1 npx playwright test --project=first-run
    {
      name: "first-run",
      testMatch: /first-run\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, colorScheme: "light" },
    },
    // A new, non-admin user's first visit: SHOTS_FIRST_RUN_USER=1 npx playwright test --project=first-run-user
    {
      name: "first-run-user",
      testMatch: /first-run-user\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, colorScheme: "light" },
    },
    { name: "auth", testMatch: /auth\.setup\.ts/ },
    { name: "seed", testMatch: /seed\.setup\.ts/, dependencies: ["auth"] },
    {
      // The live walk of every route (walk.ts): `npx playwright test --project=walk`.
      name: "walk",
      testMatch: /walk\.spec\.ts/,
      dependencies: ["seed"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE, viewport: { width: 1440, height: 900 } },
    },
    {
      // The walk's interaction flows (flows.ts): dialogs, menus and states. `npx playwright test --project=walk-flows`.
      name: "walk-flows",
      testMatch: /walk-flows\.spec\.ts/,
      dependencies: ["seed"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE, viewport: { width: 1440, height: 900 } },
    },
    {
      name: "capture",
      testMatch: /capture\.spec\.ts/,
      dependencies: ["seed"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE,
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: Number(process.env.SHOTS_SCALE ?? 1),
        colorScheme: "light",
      },
    },
  ],
});
