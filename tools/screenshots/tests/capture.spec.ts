import { test, expect } from "@playwright/test";
import path from "node:path";
import { DEST_ROOT } from "../playwright.config";
import { APP_BASENAME, EXAMPLE_WORKSPACE } from "../support/api";
import { SHOTS } from "../shots";

for (const shot of SHOTS) {
  test(shot.id, async ({ page }) => {
    // A crashed page renders the webapp's error screen; surface the cause in the test output.
    page.on("pageerror", (err) => console.error(`[${shot.id}] page error: ${err.message}`));
    await page.goto(APP_BASENAME + shot.url.replace("{ws}", EXAMPLE_WORKSPACE.name));

    // Ready: the app shell, the shot's own marker, and no Carbon loading spinner left on screen.
    await expect(page.getByRole("navigation", { name: "Platform navigation" })).toBeVisible({ timeout: 15_000 });
    if (shot.ready) {
      const marker = "text" in shot.ready ? page.getByText(shot.ready.text).first() : page.getByRole(shot.ready.role, { name: shot.ready.name }).first();
      await expect(marker).toBeVisible({ timeout: 15_000 });
    }
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".cds--loading:not(.cds--loading--stop)")).toHaveCount(0, { timeout: 15_000 });
    if (shot.prepare) await shot.prepare(page);

    // Keep pointer hover and the caret out of the image. (0, 0) hovers the side-nav button, so
    // park the pointer on the header's empty middle.
    await page.mouse.move(720, 24);
    const options = { path: path.join(DEST_ROOT, shot.out), animations: "disabled" as const, caret: "hide" as const };
    // A dialog or panel is captured on its own; otherwise the window, optionally cropped.
    if (shot.target) {
      await shot.target(page).screenshot(options);
    } else {
      const clip = typeof shot.clip === "function" ? await shot.clip(page) : shot.clip;
      await page.screenshot({ ...options, fullPage: shot.fullPage ?? false, clip });
    }
  });
}
