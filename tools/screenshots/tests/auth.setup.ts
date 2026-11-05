import { test as setup, expect } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";
import { APP_BASENAME } from "../support/api";

/*
 * Borrowed from flow.service.workflow/e2e/tests/auth.setup.ts: signs in once through the real
 * flow (signed-out page -> IDPZero's passwordless picker -> /auth/callback sets flow_session)
 * and saves the storage state the capture project reuses. Signs in as usr-flow-admin
 * (docker/idpzero/server.yaml) so the Admin pages can be captured too.
 */
setup("sign in via IDPZero", async ({ page, baseURL }) => {
  await page.goto(`${APP_BASENAME}/`);
  await expect(page.getByText("You're not signed in", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(/idp\.localhost:\d+\/login/);
  await page.locator('select[name="username"]').selectOption(process.env.SHOTS_USER ?? "usr-flow-admin");
  await page.getByRole("button", { name: "Sign In" }).click();

  const appOrigin = new URL(baseURL!).origin;
  await page.waitForURL((url) => url.origin === appOrigin && !url.pathname.startsWith(`${APP_BASENAME}/auth/`));
  await expect(page.getByRole("navigation", { name: "Platform navigation" })).toBeVisible({ timeout: 15_000 });

  await page.context().storageState({ path: STORAGE_STATE });
});
