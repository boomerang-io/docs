import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { API_ORIGIN, APP_BASENAME, EXAMPLE_WORKSPACE } from "../support/api";
import { STOPS } from "../walk";

/*
 * The live walk: visits every route in walk.ts and writes, under out/walk/:
 *   <id>.yml         the page's accessibility tree (exact labels, for the docs)
 *   <id>.png         a full-page image (for review only)
 *   <id>--<n>.yml    the dialog opened by the stop's n-th `open` control, and <id>--<n>.png
 *   _index.md        one line per stop: status, title, and anything that failed
 * A missing control or a failed step is recorded, not fatal, so one run covers the whole app.
 */
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out", "walk");
const index: string[] = [];

async function settle(page: Page) {
  await expect(page.getByRole("navigation", { name: "Platform navigation" })).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState("networkidle").catch(() => {});
  await expect(page.locator(".cds--loading:not(.cds--loading--stop)")).toHaveCount(0, { timeout: 15_000 }).catch(() => {});
}

async function record(page: Page, name: string, scope = page.locator("body")) {
  fs.writeFileSync(path.join(OUT, `${name}.yml`), await scope.ariaSnapshot());
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true, animations: "disabled", caret: "hide" });
}

test.beforeAll(() => fs.mkdirSync(OUT, { recursive: true }));
test.afterAll(() => fs.writeFileSync(path.join(OUT, "_index.md"), `# Live walk\n\n${index.sort().join("\n")}\n`));

test("walk every route", async ({ page, request }) => {
  test.setTimeout(STOPS.length * 45_000);
  const ws = EXAMPLE_WORKSPACE.name;
  const wf = "nightly-report";
  const runs = await (await request.get(`${API_ORIGIN}/api/v2/workspace/${ws}/workflowrun/query?limit=1`)).json();
  const run = runs?.content?.[0]?.id ?? "unknown-run";
  const user = (await (await request.get(`${API_ORIGIN}/api/v2/profile`)).json())?.id ?? "unknown-user";
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  for (const stop of STOPS) {
    const url = APP_BASENAME + stop.url.replace("{ws}", ws).replace("{wf}", wf).replace("{run}", run).replace("{user}", user);
    const notes: string[] = [];
    errors.length = 0;
    await test.step(stop.id, async () => {
      try {
        await page.goto(url);
        await settle(page);
        await record(page, stop.id);
      } catch (e) {
        notes.push(`load failed: ${(e as Error).message.split("\n")[0]}`);
        await page.screenshot({ path: path.join(OUT, `${stop.id}.png`), fullPage: true }).catch(() => {});
      }
      for (const [n, control] of (stop.open ?? []).entries()) {
        try {
          await page.getByRole(control.role, { name: control.name }).first().click({ timeout: 10_000 });
          const dialog = page.getByRole("dialog").last();
          await expect(dialog).toBeVisible({ timeout: 10_000 });
          await record(page, `${stop.id}--${n + 1}`, dialog);
          await page.keyboard.press("Escape");
          await expect(dialog).toBeHidden({ timeout: 5_000 }).catch(() => page.goto(url));
        } catch (e) {
          notes.push(`open "${control.name}" failed: ${(e as Error).message.split("\n")[0]}`);
          await page.goto(url).catch(() => {});
        }
      }
      if (errors.length) notes.push(`page errors: ${errors.join(" | ")}`);
      const title = await page.title().catch(() => "");
      index.push(`- \`${stop.id}\` (${stop.page}) ${notes.length ? "⚠" : "ok"} · ${title}${notes.length ? `\n  - ${notes.join("\n  - ")}` : ""}`);
    });
  }
});
