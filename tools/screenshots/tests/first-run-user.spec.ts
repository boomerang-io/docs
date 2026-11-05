import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { DEST_ROOT } from "../playwright.config";
import { APP_BASENAME } from "../support/api";

/*
 * A new, non-admin user's first visit on an activated install: Home's "G’day" greeting, Get started
 * at step 1, and the Create Workspace modal. Signs in as usr-flow-user (auto-created on first sign-in
 * while Auto-Create Users is on), so run it once, before that user has a workspace:
 *   SHOTS_FIRST_RUN_USER=1 npx playwright test --project=first-run-user
 */
test.skip(process.env.SHOTS_FIRST_RUN_USER !== "1", "signs in a second user; set SHOTS_FIRST_RUN_USER=1");

async function shot(page: Page, out: string) {
  const file = path.join(DEST_ROOT, out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.mouse.move(0, 0);
  await page.screenshot({ path: file, animations: "disabled", caret: "hide" });
  fs.writeFileSync(file.replace(/\.png$/, ".yml"), await page.locator("body").ariaSnapshot());
}

test("a new user's first visit", async ({ page, baseURL }) => {
  test.setTimeout(120_000);
  await page.goto(`${APP_BASENAME}/`);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/idp\.localhost:\d+\/login/);
  await page.locator('select[name="username"]').selectOption("usr-flow-user");
  await page.getByRole("button", { name: "Sign In" }).click();
  const appOrigin = new URL(baseURL!).origin;
  await page.waitForURL((url) => url.origin === appOrigin && !url.pathname.startsWith(`${APP_BASENAME}/auth/`));
  await expect(page.getByRole("navigation", { name: "Platform navigation" })).toBeVisible({ timeout: 20_000 });
  await page.waitForLoadState("networkidle").catch(() => {});
  await shot(page, "introduction/assets/first-run-home-new-user.png");

  const create = page.getByRole("region", { name: "Get started" }).getByRole("button").filter({ hasText: /workspace/i }).first();
  await create.click({ timeout: 15_000 });
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
  await shot(page, "introduction/assets/create-workspace.png");
  await page.keyboard.press("Escape");
});
