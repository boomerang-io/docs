import { test, expect, type Locator, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { API_ORIGIN, APP_BASENAME, EXAMPLE_WORKSPACE } from "../support/api";
import { FLOWS, type FlowCtx } from "../flows";

/*
 * The live walk's interaction flows (flows.ts): each test opens the dialogs, menus and states of
 * one flow and records them under out/walk/ as <flow id>--<state>.yml and .png. A failed step is
 * noted, not fatal. out/walk/_flows.md indexes every flow; it's rebuilt from _flows.json, so a
 * rerun of some flows (`-g f04`) keeps the others' entries.
 *   npx playwright test --project=walk-flows
 */
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out", "walk");
const STATE = path.join(OUT, "_flows.json");

type Entry = { id: string; page: string; title: string; recorded: string[]; notes: string[]; changed: string[]; error?: string; at: string };

function save(entry: Entry) {
  let all: Record<string, Entry> = {};
  try {
    all = JSON.parse(fs.readFileSync(STATE, "utf8"));
  } catch {}
  all[entry.id] = entry;
  fs.writeFileSync(STATE, JSON.stringify(all, null, 2));
  const lines = FLOWS.map((f) => all[f.id]).filter(Boolean).map((e) => {
    const status = e.error ? "✗" : e.notes.some((n) => n.startsWith("⚠")) ? "⚠" : "ok";
    const out = [`- \`${e.id}\` (${e.page}) ${status} · ${e.title} · ${e.at}`];
    if (e.error) out.push(`  - ✗ ${e.error}`);
    if (e.recorded.length) out.push(`  - recorded: ${e.recorded.map((r) => `\`${r}\``).join(", ")}`);
    for (const n of e.notes) out.push(`  - ${n}`);
    for (const ch of e.changed) out.push(`  - state changed: ${ch}`);
    return out.join("\n");
  });
  const changed = FLOWS.flatMap((f) => all[f.id]?.changed ?? []);
  const unreachable = FLOWS.flatMap((f) =>
    (all[f.id]?.notes ?? []).filter((n) => n.startsWith("unreachable: ")).map((n) => `\`${f.id}\`: ${n.slice(13)}`),
  );
  fs.writeFileSync(
    path.join(OUT, "_flows.md"),
    `# Live walk: interaction flows\n\n` +
      `Dialogs, menus and states opened by \`npx playwright test --project=walk-flows\` (flows.ts). ` +
      `Each \`<id>\` is \`<id>.yml\` (the accessibility tree, exact labels) and \`<id>.png\` in this folder. ` +
      `⚠ marks a step that failed or was unreachable; ✗ a flow that stopped.\n\n` +
      `${lines.join("\n")}\n\n## Unreachable\n\n${unreachable.length ? unreachable.map((u) => `- ${u}`).join("\n") : "- none"}\n\n## State changed by these flows\n\n${changed.length ? changed.map((ch) => `- ${ch}`).join("\n") : "- none"}\n`,
  );
}

async function settle(page: Page) {
  await expect(page.getByRole("navigation", { name: "Platform navigation" })).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState("networkidle").catch(() => {});
  await expect(page.locator(".cds--loading:not(.cds--loading--stop)")).toHaveCount(0, { timeout: 15_000 }).catch(() => {});
}

const firstLine = (e: unknown) => String((e as Error)?.message ?? e).split("\n")[0].replace(/\u001b\[[0-9;]*m/g, "");

test.beforeAll(() => fs.mkdirSync(OUT, { recursive: true }));

for (const flow of FLOWS) {
  test(flow.id, async ({ page, request }) => {
    test.setTimeout(5 * 60_000);
    page.setDefaultTimeout(15_000); // a missing control fails its step instead of stalling the flow
    const entry: Entry = { id: flow.id, page: flow.page, title: flow.title, recorded: [], notes: [], changed: [], at: new Date().toISOString().slice(0, 16) };
    const ws = EXAMPLE_WORKSPACE.name;
    // This flow's earlier outputs go first, so a renamed or unreachable state leaves no stale file.
    for (const f of fs.readdirSync(OUT)) if (f.startsWith(`${flow.id}--`) || f.startsWith(`${flow.id}.`)) fs.rmSync(path.join(OUT, f));
    const errors: string[] = [];
    page.on("pageerror", (e) => {
      // React hydration mismatches and fallbacks (#418, #422, #423, #425) fire on most pages; they don't change what renders.
      if (!/Minified React error #(418|422|423|425)/.test(e.message)) errors.push(firstLine(e));
    });
    page.on("dialog", (d) => {
      entry.notes.push(`browser ${d.type()} "${d.message()}" accepted (leaving discards unsaved edits)`);
      d.accept().catch(() => {});
    });
    page.context().on("page", (p) => {
      entry.notes.push(`⚠ a new tab opened (${p.url() || "about:blank"}) and was closed`);
      p.close().catch(() => {});
    });

    const getRun = async (id: string) =>
      (await request.get(`${API_ORIGIN}/api/v2/workspace/${ws}/workflowrun/${id}?withTasks=true`)).json();
    const ctx: FlowCtx = {
      page,
      request,
      ws,
      go: async (p) => {
        await page.goto(APP_BASENAME + p);
        await settle(page);
      },
      rec: async (state, scope?: Locator) => {
        const name = state ? `${flow.id}--${state}` : flow.id;
        fs.writeFileSync(path.join(OUT, `${name}.yml`), await (scope ?? page.locator("body")).ariaSnapshot({ timeout: 10_000 }));
        await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true, animations: "disabled", caret: "hide" });
        entry.recorded.push(state ? `--${state}` : name);
      },
      step: async (name, fn) => {
        try {
          await fn();
        } catch (e) {
          entry.notes.push(`⚠ step "${name}": ${firstLine(e)}`);
          // A page that stopped responding would stall every later step: end the flow instead.
          const alive = await Promise.race([
            page.evaluate(() => true).catch(() => false),
            new Promise<boolean>((r) => setTimeout(() => r(false), 5_000)),
          ]);
          if (!alive) throw new Error(`the page stopped responding during step "${name}"`);
        }
      },
      note: (m) => entry.notes.push(m),
      changed: (m) => entry.changed.push(m),
      latestRun: async (workflow) => {
        const res = await (await request.get(`${API_ORIGIN}/api/v2/workspace/${ws}/workflowrun/query?limit=200`)).json();
        type R = { id: string; creationDate: string; workflowName: string };
        return ((res?.content ?? []) as R[])
          .filter((r) => r.workflowName === workflow)
          .sort((a, b) => b.creationDate.localeCompare(a.creationDate))[0] as never;
      },
      getRun,
    };

    try {
      await flow.run(ctx);
    } catch (e) {
      entry.error = firstLine(e);
      await page.screenshot({ path: path.join(OUT, `${flow.id}--error.png`), fullPage: true }).catch(() => {});
    }
    if (errors.length) entry.notes.push(`page errors: ${[...new Set(errors)].join(" | ")}`);
    if (entry.recorded.length) entry.recorded[0] = entry.recorded[0].startsWith("--") ? `${flow.id}${entry.recorded[0]}` : entry.recorded[0];
    save(entry);
  });
}
