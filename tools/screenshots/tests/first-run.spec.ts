import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { DEST_ROOT, STORAGE_STATE } from "../playwright.config";
import { APP_BASENAME } from "../support/api";

/*
 * First-run captures on a FRESH, never-activated install: the signed-out page, the activation
 * screen, Home's first-run Get started checklist and the Create Workspace modal. Signing in here
 * activates the install and makes usr-flow-admin its admin, so it runs only when asked:
 *   SHOTS_FIRST_RUN=1 npx playwright test --project=first-run
 * Afterwards the saved session is reused by the seed, walk and capture projects.
 */
test.skip(process.env.SHOTS_FIRST_RUN !== "1", "first-run captures activate the install; set SHOTS_FIRST_RUN=1");

const CODE = process.env.SHOTS_ACTIVATION_CODE ?? "flow-local-activation-code-for-development";

async function shot(page: Page, out: string) {
  const file = path.join(DEST_ROOT, out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.mouse.move(0, 0);
  await page.screenshot({ path: file, animations: "disabled", caret: "hide" });
  fs.writeFileSync(file.replace(/\.png$/, ".yml"), await page.locator("body").ariaSnapshot());
}

test("first sign-in and activation", async ({ page, baseURL }) => {
  test.setTimeout(120_000);

  await page.goto(`${APP_BASENAME}/`);
  await expect(page.getByText("You're not signed in", { exact: true })).toBeVisible();
  await shot(page, "hosting/assets/signed-out.png");

  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/idp\.localhost:\d+\/login/);
  await page.locator('select[name="username"]').selectOption(process.env.SHOTS_USER ?? "usr-flow-admin");
  await page.getByRole("button", { name: "Sign In" }).click();

  const appOrigin = new URL(baseURL!).origin;
  await page.waitForURL((url) => url.origin === appOrigin && !url.pathname.startsWith(`${APP_BASENAME}/auth/`));
  const activation = page.getByRole("dialog").filter({ hasText: "activate Boomerang Flow" });
  await expect(activation).toBeVisible({ timeout: 15_000 });
  await shot(page, "hosting/assets/activation-screen.png");

  await activation.getByLabel("Activation code").fill(CODE);
  await activation.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("navigation", { name: "Platform navigation" })).toBeVisible({ timeout: 20_000 });
  await page.context().storageState({ path: STORAGE_STATE });

  await page.waitForLoadState("networkidle").catch(() => {});
  await shot(page, "introduction/assets/first-run-home.png");

  const create = page.getByRole("button", { name: /^Create (a )?workspace$/i }).first();
  await create.click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
  await shot(page, "introduction/assets/create-workspace.png");
  await page.keyboard.press("Escape");
});
