import { expect, type APIRequestContext, type Locator, type Page } from "@playwright/test";
import { API_ORIGIN, submitRun } from "./support/api";

/*
 * Interaction flows for the docs' live walk: each opens a dialog, menu or state that a plain
 * route visit (walk.ts) can't reach, and records it, so the labels inside come from the running
 * webapp. Run by tests/walk-flows.spec.ts, which writes under out/walk/:
 *   <flow id>--<state>.yml   the dialog, menu or region's accessibility tree (exact labels)
 *   <flow id>--<state>.png   a full-page image (for review only)
 *   _flows.md                one entry per flow: what it recorded, what failed, any state changed
 * Flows close by Cancel or Escape and never submit, save or connect anything. Controls are found
 * by role and accessible name, as flow.service.workflow/e2e does. Labels to expect are in
 * .claude/v5-sources/webapp-ui.md.
 */

export type FlowCtx = {
  page: Page;
  request: APIRequestContext;
  ws: string;
  /** Opens a path under /apps/flow and waits for the page to settle. */
  go(path: string): Promise<void>;
  /** Records `<flow id>--<state>` (the scope's tree, and a full-page image). */
  rec(state: string, scope?: Locator): Promise<void>;
  /** Runs a sub-step; a failure is noted in _flows.md and the flow carries on. */
  step(name: string, fn: () => Promise<void>): Promise<void>;
  note(message: string): void;
  /** Notes a change this flow made to the stack's data (a submitted run, say). */
  changed(message: string): void;
  /** The newest run of a workflow in the example workspace. */
  latestRun(workflow: string): Promise<Run | undefined>;
  getRun(id: string): Promise<Run>;
};

export type Flow = { id: string; page: string; title: string; run: (c: FlowCtx) => Promise<void> };

type Run = { id: string; status: string; phase: string; workflowName: string; tasks?: { name: string; status: string }[] };

export const slug = (s: string, max = 60) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, max).replace(/^-+|-+$/g, "");

/** The topmost open dialog, optionally the one holding some text. */
export function dialog(page: Page, hasText?: string | RegExp): Locator {
  const all = page.getByRole("dialog");
  return (hasText ? all.filter({ hasText }) : all).last();
}

/** Opens a dialog with a control and waits for it. */
async function open(page: Page, control: Locator, hasText?: string | RegExp): Promise<Locator> {
  await control.click({ timeout: 10_000 });
  const d = dialog(page, hasText);
  await expect(d).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(400); // the modal's open transition
  return d;
}

/**
 * Closes a dialog without submitting: its Cancel button, else Escape. A "Close this? / will not
 * be saved" prompt is confirmed (it discards, never saves). A dialog that won't close is
 * dropped by reloading the page.
 */
export async function close(page: Page, d: Locator) {
  const cancel = d.getByRole("button", { name: "Cancel", exact: true });
  if (await cancel.isVisible().catch(() => false)) await cancel.click();
  else await page.keyboard.press("Escape");
  const prompt = page.getByRole("dialog").filter({ hasText: /will not be saved|Close this\?/ }).last();
  if (await prompt.isVisible({ timeout: 1_500 }).catch(() => false)) {
    if ((await prompt.innerText()).match(/will not be saved|Close this\?/)) await prompt.getByRole("button", { name: "Yes", exact: true }).click();
  }
  try {
    await expect(d).toBeHidden({ timeout: 5_000 });
  } catch {
    await page.keyboard.press("Escape");
    await expect(d).toBeHidden({ timeout: 3_000 }).catch(() => page.reload());
  }
}

/** Selects a Carbon radio button (its input is visually hidden behind the label). */
async function choose(radio: Locator) {
  try {
    await radio.check({ timeout: 3_000 });
  } catch {
    await radio.evaluate((el: HTMLInputElement) => el.click());
    await expect(radio).toBeChecked({ timeout: 3_000 });
  }
}

/** Records each tab of a tabbed dialog or panel: `<prefix><tab name>`. */
async function eachTab(c: FlowCtx, scope: Locator, prefix: string) {
  const tabs = scope.getByRole("tab");
  const n = await tabs.count();
  if (!n) {
    await c.rec(`${prefix}form`, scope);
    c.note(`${prefix || "dialog "}has no tab bar`);
    return;
  }
  for (let i = 0; i < n; i++) {
    const tab = tabs.nth(i);
    const name = (await tab.innerText()).trim();
    await c.step(`tab "${name}"`, async () => {
      await tab.click();
      await c.page.waitForTimeout(300);
      await c.rec(`${prefix}${slug(name)}`, scope);
    });
  }
  await tabs.first().click();
}

/** Opens a Carbon Dropdown or ComboBox and returns its option names; the list stays open. */
async function openOptions(page: Page, combobox: Locator): Promise<string[]> {
  await combobox.click();
  const options = page.getByRole("option");
  await expect(options.first()).toBeVisible({ timeout: 5_000 });
  return (await options.allInnerTexts()).map((s) => s.trim()).filter(Boolean);
}

/** Turns a Carbon toggle (role switch) over: a click, else focus and Space, else a DOM click. */
async function flip(page: Page, toggle: Locator) {
  const before = await toggle.getAttribute("aria-checked");
  const changed = async () => (await toggle.getAttribute("aria-checked")) !== before;
  await toggle.click({ timeout: 3_000 }).catch(() => {});
  if (await changed()) return;
  await toggle.focus();
  await page.keyboard.press("Space");
  if (await changed()) return;
  await toggle.evaluate((el: HTMLElement) => el.click());
  await expect.poll(changed, { timeout: 3_000 }).toBe(true);
}

/**
 * Chooses a Carbon Dropdown option with the keyboard: in the workflow editor's Add parameter
 * dialog, a mouse click on any Type option leaves the page unresponsive.
 */
async function pickByKeyboard(page: Page, combobox: Locator, name: string) {
  await combobox.focus();
  if ((await combobox.getAttribute("aria-expanded")) !== "true") await page.keyboard.press("ArrowDown");
  const option = page.getByRole("option", { name, exact: true });
  for (let i = 0; i < 24; i++) {
    if (await option.evaluate((el) => el.className.includes("highlighted"))) {
      await page.keyboard.press("Enter");
      await expect(combobox).toContainText(name, { timeout: 3_000 });
      return;
    }
    await page.keyboard.press("ArrowDown");
  }
  throw new Error(`option "${name}" was never highlighted`);
}

/**
 * The palette tiles are HTML5-draggable, which Playwright's mouse drag doesn't drive: dispatch
 * the drag events with a shared DataTransfer (flow.service.workflow/e2e/tests/dispatcher-ui.spec.ts).
 */
async function dragPaletteItemToCanvas(page: Page, source: Locator, target: Locator, at: { x: number; y: number }) {
  const src = await source.elementHandle();
  const tgt = await target.elementHandle();
  const box = await target.boundingBox();
  if (!src || !tgt || !box) throw new Error("drag source/target not resolvable");
  await page.evaluate(
    ([s, t, x, y]) => {
      const dataTransfer = new DataTransfer();
      const opts = { bubbles: true, cancelable: true, composed: true, dataTransfer } as DragEventInit;
      (s as Element).dispatchEvent(new DragEvent("dragstart", opts));
      (t as Element).dispatchEvent(new DragEvent("dragenter", opts));
      (t as Element).dispatchEvent(new DragEvent("dragover", { ...opts, clientX: x as number, clientY: y as number }));
      (t as Element).dispatchEvent(new DragEvent("drop", { ...opts, clientX: x as number, clientY: y as number }));
      (s as Element).dispatchEvent(new DragEvent("dragend", opts));
    },
    [src, tgt, box.x + at.x, box.y + at.y] as const,
  );
}

/** Opens a canvas node's task configuration modal and records each tab. */
async function taskModal(c: FlowCtx, node: Locator, title: string | RegExp, prefix: string): Promise<Locator> {
  await expect(node).toBeVisible({ timeout: 15_000 });
  const d = await open(c.page, node.getByRole("button", { name: "edit" }), title);
  await eachTab(c, d, prefix);
  return d;
}

/** Hovers a control and records the tooltip it shows. */
async function tooltip(c: FlowCtx, control: Locator, state: string) {
  await control.hover();
  const tip = c.page.getByRole("tooltip").filter({ visible: true }).last();
  await expect(tip).toBeVisible({ timeout: 3_000 });
  await c.rec(state, tip);
}

/** Opens an overflow menu, records it, and closes it with Escape. */
async function menu(c: FlowCtx, control: Locator, state: string) {
  await control.click();
  const m = c.page.getByRole("menu").last();
  await expect(m).toBeVisible({ timeout: 5_000 });
  await c.rec(state, m);
  await c.page.keyboard.press("Escape");
}

const run = (c: FlowCtx, id: string) => c.go(`/${c.ws}/activity/${id}`);

// When no listed workflow has a parameter, f03 gives this one a text parameter (as a new version).
const PARAM_WORKFLOW = "deploy-service";
const PARAM = { name: "environment", label: "Environment", description: "Where to deploy.", type: "text", default: "staging", required: false, readOnly: false };

export const FLOWS: Flow[] = [
  {
    id: "f01-task-config-execute-shell",
    page: "guides/workflow-editor",
    title: "Editor canvas: Execute Shell node's task configuration modal (check-certificates)",
    run: async (c) => {
      await c.go(`/${c.ws}/editor/check-certificates/canvas`);
      const d = await taskModal(c, c.page.locator(".react-flow__node-script").first(), "Edit Execute Shell", "");
      await c.step("script text editor", async () => {
        const script = d.locator("textarea[readonly]").last();
        const editor = await open(c.page, script, /Update Shell Script/);
        await c.rec("script-editor", editor);
        await close(c.page, editor);
      });
      await close(c.page, d);
    },
  },
  {
    id: "f01-task-config-for-each",
    page: "guides/repeat-a-task-for-each-item",
    title: "Editor canvas: the for-each node's task configuration modal (process-regions)",
    run: async (c) => {
      await c.go(`/${c.ws}/editor/process-regions/canvas`);
      const node = c.page.locator(".react-flow__node-script").filter({ has: c.page.getByTestId("foreach-badge") }).first();
      await c.step("canvas node", async () => c.rec("canvas-node", node));
      const d = await taskModal(c, node, "Edit Execute Shell", "");
      await c.step("Run for each item is on", async () => {
        await d.getByRole("tab", { name: /Configure/ }).click();
        await expect(d.getByRole("switch", { name: "Run for each item" })).toBeChecked();
      });
      await close(c.page, d);
    },
  },
  {
    id: "f02-create-new-version",
    page: "guides/workflow-editor",
    title: "Editor: the Create new version dialog",
    run: async (c) => {
      await c.go(`/${c.ws}/editor/check-certificates/canvas`);
      const d = await open(c.page, c.page.getByRole("button", { name: "Create new version" }), "Create New Version");
      await c.rec("dialog", d);
      await close(c.page, d);
    },
  },
  {
    id: "f03-run-it",
    page: "guides/run",
    title: "Workflow card Run it: the run modal without and with parameters",
    run: async (c) => {
      await c.go(`/${c.ws}/workflows`);
      const card = (name: string) =>
        c.page.getByTestId("workflow-card").filter({ has: c.page.getByRole("heading", { name, exact: true }) }).first();
      const runIt = async (state: string, name: string) => {
        const button = card(name).getByRole("button", { name: /^Run it/ });
        if (await button.isDisabled({ timeout: 10_000 })) {
          await c.rec(`${state}-card`, card(name));
          throw new Error(`"Run it" on ${name} is disabled (a run quota is reached, or the Manual trigger is off)`);
        }
        const d = await open(c.page, button);
        await c.rec(state, d);
        await close(c.page, d);
      };
      await c.step("no parameters", () => runIt("no-params", "Nightly report"));
      await c.step("with parameters", async () => {
        // The query also returns the workspace's starter templates, which the page doesn't list.
        const query = async () =>
          ((await (await c.request.get(`${API_ORIGIN}/api/v2/workspace/${c.ws}/workflow/query?limit=100`)).json()).content as Wf[]).filter(
            (w) => w.type === "workflow",
          );
        type Wf = { name: string; displayName: string; type?: string; params?: { name: string; readOnly?: boolean }[] };
        let wf = (await query()).find((w) => (w.params ?? []).some((p) => !p.readOnly));
        if (!wf) {
          // None has one: give deploy-service a text parameter with a default, as a new version.
          const url = `${API_ORIGIN}/api/v2/workspace/${c.ws}/workflow`;
          const body = await (await c.request.get(`${url}/${PARAM_WORKFLOW}`)).json();
          body.params = [...(body.params ?? []), PARAM];
          body.changelog = { reason: "Add the environment parameter" };
          const res = await c.request.put(url, { data: body });
          if (!res.ok()) throw new Error(`adding a parameter to ${PARAM_WORKFLOW} failed: ${res.status()} ${await res.text()}`);
          c.changed(`added the text parameter "${PARAM.name}" (default "${PARAM.default}") to ${PARAM_WORKFLOW} through the API, as version ${(await res.json()).version}`);
          wf = (await query()).find((w) => w.name === PARAM_WORKFLOW)!;
          await c.go(`/${c.ws}/workflows`);
        } else if (wf.name === PARAM_WORKFLOW && wf.params?.some((p) => p.name === PARAM.name)) {
          c.changed(`${PARAM_WORKFLOW} carries the text parameter "${PARAM.name}" (default "${PARAM.default}"), added through the API by an earlier run of this flow`);
        }
        c.note(`with parameters: ${wf.displayName} (${wf.name})`);
        await runIt("with-params", wf.displayName);
      });
    },
  },
  {
    id: "f04-run-failed",
    page: "fundamentals/runs",
    title: "Run page of check-certificates (its check task failed): header, menu, retry dialogs, task log",
    run: async (c) => {
      const r = await c.latestRun("check-certificates");
      if (!r) throw new Error("check-certificates has no run");
      const detail = await c.getRun(r.id);
      c.note(`run ${r.id}: status ${detail.status}; tasks ${(detail.tasks ?? []).map((t) => `${t.name} ${t.status}`).join(", ")}`);
      await run(c, r.id);
      await c.rec("page", c.page.locator("main"));
      await c.step("overflow menu", () => menu(c, c.page.getByRole("button", { name: "More run actions" }), "overflow-menu"));
      await c.step("Advanced detail", async () => {
        await c.page.getByRole("button", { name: "More run actions" }).click();
        const d = await open(c.page, c.page.getByRole("menuitem", { name: "Advanced detail" }), "Advanced detail");
        await c.rec("advanced-detail", d);
        await close(c.page, d);
      });
      await c.step("View run error", async () => {
        const button = c.page.getByRole("button", { name: "View run error" });
        if (!(await button.isVisible())) return c.note("unreachable: Run Error (the run has no status message, so there is no View run error button)");
        const d = await open(c.page, button, "Run Error");
        await c.rec("run-error", d);
        await close(c.page, d);
      });
      await c.step("Retry run", async () => {
        const d = await open(c.page, c.page.getByRole("button", { name: "Retry run", exact: true }), "Retry run");
        await c.rec("retry-run", d);
        const radios = d.getByRole("radio");
        for (let i = 0; i < (await radios.count()); i++) {
          const radio = radios.nth(i);
          const label = (await radio.getAttribute("aria-label")) ?? (await d.locator(`label[for="${await radio.getAttribute("id")}"]`).innerText());
          await c.step(`scope "${label}"`, async () => {
            if (await radio.isDisabled({ timeout: 10_000 })) return c.note(`retry scope "${label}" is disabled`);
            await choose(radio);
            await c.rec(`retry-run-${slug(label, 30)}`, d);
          });
        }
        await c.step("Tasks to retry from", async () => {
          const combo = d.getByRole("combobox", { name: /Tasks to retry from/ });
          if (!(await combo.isVisible())) return c.note("Tasks to retry from is not showing");
          await openOptions(c.page, combo);
          await c.rec("retry-run-tasks-to-retry-from", d);
          await combo.click();
        });
        await close(c.page, d);
      });
      const task = c.page.locator("#task-check");
      await c.step("task Retry", async () => {
        const d = await open(c.page, task.getByRole("button", { name: /^Retry/ }), "Retry run");
        await c.rec("task-retry", d);
        await close(c.page, d);
      });
      const panel = c.page.getByRole("complementary").filter({ has: c.page.getByRole("tablist", { name: "Run detail" }) });
      await c.step("task log panel tabs", () => eachTab(c, panel, "panel-"));
      await c.step("task View Details", async () => {
        const d = await open(c.page, task.getByRole("button", { name: "View Details" }), "View Details");
        await c.rec("task-view-details", d);
        await close(c.page, d);
      });
      await c.step("task View Log", async () => {
        const d = await open(c.page, task.getByRole("button", { name: "View Log" }), "Execution Log");
        await c.page.waitForTimeout(3_000); // the log streams in
        await c.rec("task-view-log", d);
        await close(c.page, d);
      });
      await c.step("collapse the task log", async () => {
        await c.page.getByRole("button", { name: "Collapse the task log" }).click();
        await c.rec("task-log-collapsed", c.page.locator("main"));
        await c.page.getByRole("button", { name: "Expand the task log" }).click();
      });
    },
  },
  {
    id: "f05-run-running",
    page: "fundamentals/runs",
    title: "Run page of a running run: Pause run and the Cancel run menu (not pressed)",
    run: async (c) => {
      // process-regions (for each on execute-shell) runs for a while on Kubernetes. The seed left
      // it without a run (the quota was full), so submit one then; FLOWS_SUBMIT_RUN=true submits
      // another. Otherwise fall back to rotate-keys, which stays running on its manual task.
      let target = await c.latestRun("process-regions");
      if (!target || process.env.FLOWS_SUBMIT_RUN === "true") {
        const submitted = await submitRun(c.request, c.ws, "process-regions", true);
        c.changed(`submitted a run of process-regions (${submitted.id})`);
        await expect
          .poll(async () => {
            const r = await c.getRun(submitted.id);
            return (r.tasks ?? []).some((t) => t.status === "running") || r.phase === "completed";
          }, { timeout: 120_000, intervals: [2_000] })
          .toBe(true)
          .catch(() => c.note("no task of the submitted run started within 2 minutes"));
        target = await c.getRun(submitted.id);
      }
      if (target.status !== "running") {
        c.note(`process-regions' newest run is ${target.status}; showing rotate-keys' run instead (running, on its manual task). FLOWS_SUBMIT_RUN=true submits a fresh process-regions run`);
        target = await c.latestRun("rotate-keys");
        if (!target) throw new Error("rotate-keys has no run");
      }
      c.note(`run ${target.id} (${target.workflowName}), status ${target.status}`);
      await run(c, target.id);
      await c.rec("page", c.page.locator("main"));
      await c.step("Pause run tooltip", async () => {
        const pause = c.page.getByRole("button", { name: "Pause run" });
        if (!(await pause.isVisible())) return c.note("no Pause run button");
        await tooltip(c, pause, "pause-run-tooltip");
      });
      await c.step("overflow menu", () => menu(c, c.page.getByRole("button", { name: "More run actions" }), "overflow-menu"));
      await c.step("for-each items", async () => {
        const show = c.page.getByRole("button", { name: /Show items/ });
        if (!(await show.first().isVisible())) return c.note("no Show items (not a for-each run, or no items yet)");
        await show.first().click();
        await c.rec("for-each-items", c.page.getByRole("complementary").filter({ has: c.page.getByRole("tablist", { name: "Run detail" }) }));
      });
      c.note("unreachable: Resume run (it shows only on a paused run, and Pause run was not pressed)");
    },
  },
  {
    id: "f05-run-waiting-approval",
    page: "fundamentals/runs",
    title: "Run page of release-to-production (waiting on an approval): controls and the Action approval modal",
    run: async (c) => {
      const r = await c.latestRun("release-to-production");
      if (!r) throw new Error("release-to-production has no run");
      c.note(`run ${r.id}, status ${r.status}`);
      await run(c, r.id);
      await c.rec("page", c.page.locator("main"));
      await c.step("overflow menu", () => menu(c, c.page.getByRole("button", { name: "More run actions" }), "overflow-menu"));
      await c.step("Action Manual Approval", async () => {
        const d = await open(c.page, c.page.locator("#task-approve-release").getByRole("button", { name: "Action", exact: true }), "Action Manual Approval");
        await c.rec("action-manual-approval", d);
        await close(c.page, d);
      });
    },
  },
  {
    id: "f05-run-waiting-manual-task",
    page: "fundamentals/runs",
    title: "Run page of rotate-keys (waiting on a manual task): the Action manual task modal",
    run: async (c) => {
      const r = await c.latestRun("rotate-keys");
      if (!r) throw new Error("rotate-keys has no run");
      await run(c, r.id);
      await c.rec("page", c.page.locator("main"));
      await c.step("Action Manual Task", async () => {
        const d = await open(c.page, c.page.locator("#task-rotate").getByRole("button", { name: "Action", exact: true }), "Action Manual Task");
        await c.rec("action-manual-task", d);
        await close(c.page, d);
      });
    },
  },
  {
    id: "f06-actions-approvals",
    page: "fundamentals/actions",
    title: "Actions › Approvals: a pending approval's Action details, and the bulk Approve and Reject dialogs",
    run: async (c) => {
      await c.go(`/${c.ws}/actions/approvals`);
      const row = c.page.getByRole("row").filter({ hasText: "approve-release" }).filter({ hasText: "Waiting" }).first();
      await expect(row).toBeVisible({ timeout: 10_000 });
      await c.step("Action details", async () => {
        const d = await open(c.page, row.getByRole("cell", { name: "approve-release" }), "Action details");
        await c.rec("action-details", d);
        await close(c.page, d);
      });
      await c.step("bulk Approve and Reject", async () => {
        const box = row.getByRole("checkbox");
        await choose(box);
        for (const [state, name] of [["approve-selected", /^Approve .*selected/], ["reject-selected", /Reject .*selected/]] as const) {
          await c.step(state, async () => {
            const d = await open(c.page, c.page.getByRole("button", { name }));
            await c.rec(state, d);
            await close(c.page, d);
          });
        }
        await box.uncheck({ force: true }).catch(() => {});
      });
    },
  },
  {
    id: "f06-actions-manual-tasks",
    page: "fundamentals/actions",
    title: "Actions › Manual Tasks: the rotate-keys manual task modal",
    run: async (c) => {
      await c.go(`/${c.ws}/actions/manual`);
      const row = c.page.getByRole("row").filter({ hasText: "Rotate keys" }).filter({ hasText: "Waiting" }).first();
      const d = await open(c.page, row.getByRole("cell", { name: "rotate", exact: true }), "Action Manual Task");
      await c.rec("action-manual-task", d);
      await close(c.page, d);
    },
  },
  ...(["workspace", "admin"] as const).map(
    (scope): Flow => ({
      id: `f07-tokens-${scope}`,
      page: scope === "admin" ? "fundamentals/administer" : "fundamentals/manage",
      title: `${scope === "admin" ? "Admin" : "Manage workspace"} › Tokens: the Create token dialog`,
      run: async (c) => {
        await c.go(scope === "admin" ? "/admin/tokens" : `/${c.ws}/manage/tokens`);
        const d = await open(c.page, c.page.getByRole("button", { name: "Create token" }), "Create new token");
        await c.rec("create", d);
        await c.step("Actor", async () => {
          const radios = d.getByRole("group", { name: "Actor" }).getByRole("radio");
          const n = await radios.count();
          if (!n) return c.note("unreachable: the Actor choice (this dialog has none)");
          for (let i = 0; i < n; i++) {
            const label = await d.locator(`label[for="${await radios.nth(i).getAttribute("id")}"]`).innerText();
            const value = (await radios.nth(i).getAttribute("value")) || label.trim().split(/\s/)[0];
            await choose(radios.nth(i));
            await c.rec(`actor-${slug(value)}`, d);
          }
          await choose(radios.first());
        });
        await c.step("Role options", async () => {
          const role = d.getByRole("combobox", { name: /Role/ });
          await openOptions(c.page, role);
          await c.rec("role-options", d);
          await role.click();
        });
        await c.step("Customise permissions", async () => {
          await d.getByRole("button", { name: "Customise permissions" }).click();
          await c.page.waitForTimeout(400);
          await c.rec("customise-permissions", d);
        });
        await close(c.page, d);
      },
    }),
  ),
  {
    id: "f08-task-manager-admin",
    page: "fundamentals/tasks",
    title: "Admin › Tasks: Execute Shell's Overview and Editor, and the field and save dialogs on an editable task",
    run: async (c) => {
      const version = async (name: string) =>
        (await (await c.request.get(`${API_ORIGIN}/api/v2/task/${name}`)).json())?.version as number | undefined;
      const shell = (await version("execute-shell")) ?? 2;
      await c.go(`/admin/task-manager/execute-shell/${shell}`);
      await expect(c.page.getByRole("heading", { name: "Execute Shell" }).first()).toBeVisible({ timeout: 15_000 });
      await c.rec("execute-shell-overview", c.page.locator("main"));
      await c.step("Execute Shell Preview", async () => {
        const d = await open(c.page, c.page.getByRole("button", { name: /^Preview/ }).first(), /\[Preview\]/);
        await c.rec("execute-shell-preview", d);
        await close(c.page, d);
      });
      await c.step("Execute Shell Version History", async () => {
        // The Version History button has no accessible name (only a hover tooltip): it's the first
        // button after the task's title.
        const control = c.page.getByRole("heading", { name: "Execute Shell", level: 1 }).locator("xpath=following::button[1]");
        c.note("the Version History and Basics edit buttons have no accessible name; found by position after their headings");
        const d = await open(c.page, control, "Version History");
        await c.rec("execute-shell-version-history", d);
        await close(c.page, d);
      });
      await c.step("Execute Shell Editor tab", async () => {
        await c.page.getByRole("link", { name: "Editor", exact: true }).or(c.page.getByRole("tab", { name: "Editor", exact: true })).first().click();
        await c.page.waitForURL(/\/editor$/);
        await c.page.waitForLoadState("networkidle").catch(() => {});
        await c.rec("execute-shell-editor", c.page.locator("main"));
      });
      await c.step("Execute Shell edit controls", async () => {
        await c.go(`/admin/task-manager/execute-shell/${shell}`);
        const add = c.page.getByRole("button", { name: /Add a field/ }).first();
        const save = c.page.getByRole("button", { name: "Save", exact: true }).first();
        c.note(`Execute Shell (verified): Add a field ${(await add.isDisabled({ timeout: 10_000 })) ? "disabled" : "enabled"}, Save ${(await save.isDisabled({ timeout: 10_000 })) ? "disabled" : "enabled"}`);
      });

      // Execute Shell is verified, so it isn't editable (Admin › Settings › Tasks); a community
      // task shows the field and save dialogs. Nothing is saved: Save changes is cancelled and
      // the page is left with its unsaved edit discarded.
      const editable = "copy-file";
      const before = await version(editable);
      await c.step(`${editable}: Add a field`, async () => {
        await c.go(`/admin/task-manager/${editable}/${before}`);
        await c.rec(`${editable}-overview`, c.page.locator("main"));
        const d = await open(c.page, c.page.getByRole("button", { name: /Add a field/ }).first(), "Create field");
        await c.rec("create-field", d);
        const type = d.getByRole("combobox", { name: /Type/ });
        await openOptions(c.page, type);
        await c.rec("create-field-types", d);
        await c.page.getByRole("option", { name: "Password", exact: true }).click();
        await c.rec("create-field-password", d);
        await close(c.page, d);
      });
      await c.step(`${editable}: Edit the basics, then Save changes`, async () => {
        const edit = c.page.getByRole("heading", { name: "Basics", level: 1 }).locator("xpath=following::button[1]"); // unnamed
        const d = await open(c.page, edit, "Edit the basics");
        await c.rec("edit-the-basics", d);
        const display = d.getByRole("textbox", { name: "Display Name" });
        await display.fill(`${await display.inputValue()} (draft)`);
        await d.getByRole("button", { name: "Update", exact: true }).click();
        await expect(d).toBeHidden();
        const save = await open(c.page, c.page.getByRole("button", { name: "Save", exact: true }).first(), "Save changes");
        await c.rec("save-changes", save);
        await close(c.page, save);
      });
      await c.page.goto("about:blank"); // drops the unsaved edit
      const after = await version(editable);
      if (after !== before) c.changed(`${editable} moved from version ${before} to ${after}: check it`);
    },
  },
  {
    id: "f08-task-manager-workspace",
    page: "fundamentals/tasks",
    title: "Workspace Task Manager: the Add a new task dialog (the workspace has no tasks of its own)",
    run: async (c) => {
      await c.go(`/${c.ws}/task-manager`);
      await c.rec("page", c.page.locator("main"));
      c.note("unreachable: Execute Shell here (a global task, listed only in Admin › Tasks; the workspace has no tasks of its own)");
      const d = await open(c.page, c.page.getByRole("button", { name: /Add a new task/ }), "Add a new task");
      await c.rec("add-new-task", d);
      await c.step("Import a template", async () => {
        await choose(d.getByRole("radio", { name: /Import/ }));
        await c.rec("add-new-task-import", d);
      });
      await close(c.page, d);
    },
  },
  {
    id: "f09-integrations",
    page: "fundamentals/integrations",
    title: "Integrations: each card's dialog (nothing connected)",
    run: async (c) => {
      await c.go(`/${c.ws}/integrations`);
      const cards = c.page.getByRole("region", { name: "My Integrations" }).getByRole("region");
      const names = await cards.evaluateAll((els) => els.map((e) => e.getAttribute("aria-label") ?? e.querySelector("h2")?.textContent ?? ""));
      c.note(`cards: ${names.join(", ")}`);
      for (const name of names) {
        await c.step(name, async () => {
          const card = c.page.getByRole("region", { name, exact: true });
          const button = card.getByRole("button", { name: /^(Connect|Manage)$/ });
          if (await button.isDisabled({ timeout: 10_000 })) {
            await c.rec(`${slug(name)}-card`, card);
            return c.note(`unreachable: the ${name} dialog (${await button.innerText()} is disabled, title "${await button.getAttribute("title")}")`);
          }
          const d = await open(c.page, button, name);
          await c.rec(slug(name), d);
          await close(c.page, d);
          await expect(c.page).toHaveURL(/\/integrations/);
        });
      }
    },
  },
  {
    id: "f10-schedules",
    page: "fundamentals/schedules",
    title: "Schedules: the List, Upcoming, Week and Month views, and Create schedule with each When choice",
    run: async (c) => {
      await c.go(`/${c.ws}/schedules`);
      for (const view of ["List", "Upcoming", "Week", "Month"]) {
        await c.step(`view ${view}`, async () => {
          await c.page.getByRole("tab", { name: view, exact: true }).click();
          await c.page.waitForTimeout(600);
          await c.rec(`view-${slug(view)}`, c.page.locator("main"));
        });
      }
      await c.page.getByRole("tab", { name: "List", exact: true }).click();
      const d = await open(c.page, c.page.getByRole("button", { name: "Create schedule" }), "Create schedule");
      const radios = d.getByRole("group", { name: "When" }).getByRole("radio");
      for (let i = 0; i < (await radios.count()); i++) {
        const label = await d.locator(`label[for="${await radios.nth(i).getAttribute("id")}"]`).innerText();
        await c.step(`When ${label}`, async () => {
          await choose(radios.nth(i));
          await c.page.waitForTimeout(300);
          await c.rec(`create-${slug(label)}`, d);
        });
      }
      await close(c.page, d);
    },
  },
  {
    id: "f11-parameters",
    page: "fundamentals/parameters",
    title: "Parameters: Add parameter with each type (workflow editor), and Secured on (workspace and global)",
    run: async (c) => {
      await c.step("workflow editor: each type", async () => {
        await c.go(`/${c.ws}/editor/check-certificates/parameters`);
        const d = await open(c.page, c.page.getByRole("button", { name: "Add parameter" }), "Add parameter");
        const type = d.getByRole("combobox", { name: /^Type/ });
        const types = await openOptions(c.page, type);
        await c.rec("editor-types", d);
        await type.click();
        c.note("a mouse click on a Type option leaves the page unresponsive (every option, on any workflow), so the types are chosen with the keyboard");
        for (const t of types) {
          await c.step(`type ${t}`, async () => {
            await pickByKeyboard(c.page, type, t);
            await c.page.waitForTimeout(300);
            await c.rec(`editor-type-${slug(t)}`, d);
          });
        }
        await c.step("Required on", async () => {
          await flip(c.page, d.getByRole("switch", { name: "Required" }));
          await c.rec("editor-required", d);
        });
        await close(c.page, d);
      });
      for (const [scope, path] of [["workspace", `/${c.ws}/parameters`], ["admin", "/admin/parameters"]] as const) {
        await c.step(`${scope}: Secured`, async () => {
          await c.go(path);
          const d = await open(c.page, c.page.getByRole("button", { name: "Add parameter" }), "Add parameter");
          await c.rec(`${scope}-add`, d);
          await flip(c.page, d.getByRole("switch", { name: "Secured" }));
          await c.page.waitForTimeout(300);
          await c.rec(`${scope}-secured`, d);
          await close(c.page, d);
        });
      }
    },
  },
  {
    id: "f12-insights",
    page: "fundamentals/insights",
    title: "Insights: the Task runs group-by and time choices, and the filter controls",
    run: async (c) => {
      await c.go(`/${c.ws}/insights`);
      const main = c.page.locator("main");
      const section = c.page.locator("section, div").filter({ has: c.page.getByRole("heading", { name: "Task runs", exact: true }) }).filter({ has: c.page.getByRole("combobox", { name: "Group by" }) }).last();
      await c.step("Group by", async () => {
        const group = c.page.getByRole("combobox", { name: "Group by" });
        const options = await openOptions(c.page, group);
        await c.rec("group-by-options", section);
        await group.click();
        for (const option of options) {
          await c.step(`group by ${option}`, async () => {
            await group.click();
            await c.page.getByRole("option", { name: option, exact: true }).click();
            await c.page.waitForLoadState("networkidle").catch(() => {});
            await c.page.waitForTimeout(500);
            await c.rec(`group-by-${slug(option)}`, section);
          });
        }
      });
      await c.step("By time", async () => {
        const byTime = c.page.getByRole("combobox", { name: "By time" });
        await openOptions(c.page, byTime);
        await c.rec("by-time-options", section);
        await byTime.click();
      });
      for (const name of ["Filter by Workflow", "Filter by status", "Filter by trigger"]) {
        await c.step(name, async () => {
          const filter = c.page.getByRole("combobox", { name: new RegExp(`^${name}`) });
          await openOptions(c.page, filter);
          await c.rec(`filter-${slug(name.replace("Filter by ", ""))}`, main);
          await c.page.keyboard.press("Escape");
        });
      }
      await c.step("date range", async () => {
        await c.page.getByRole("textbox", { name: "Start date" }).click();
        await c.page.waitForTimeout(300);
        await c.rec("filter-date-range", main);
        await c.page.keyboard.press("Escape");
      });
    },
  },
  {
    id: "f13-ai-task",
    page: "guides/use-ai-tasks",
    title: "AI task: an AI Prompt node dragged from the palette, and its task configuration modal (not saved)",
    run: async (c) => {
      await c.step("drag AI Prompt onto the canvas", async () => {
        await c.go(`/${c.ws}/editor/nightly-report/canvas`);
        const canvas = c.page.locator(".react-flow").first();
        await expect(c.page.locator(".react-flow__node-start")).toBeVisible({ timeout: 15_000 });
        await c.page.getByTestId("editor-task-search").fill("ai-prompt");
        await c.page.getByRole("button", { name: "Expand all" }).click().catch(() => {});
        const tile = c.page.getByRole("option", { name: "AI Prompt" }).first();
        await expect(tile).toBeVisible();
        await c.rec("palette", c.page.getByRole("complementary").filter({ has: c.page.getByRole("heading", { name: "Add a task" }) }));
        const nodes = c.page.locator(".react-flow__node");
        const before = await nodes.count();
        await dragPaletteItemToCanvas(c.page, tile, canvas, { x: 520, y: 360 });
        await expect(nodes).toHaveCount(before + 1, { timeout: 10_000 });
        const node = nodes.filter({ hasText: "AI Prompt" }).last();
        const d = await taskModal(c, node, "Edit AI Prompt", "");
        await close(c.page, d);
        await c.page.goto("about:blank"); // leaves the editor without a new version
      });
      await c.step("existing AI node (summarise-a-web-page-with-ai)", async () => {
        await c.go(`/${c.ws}/editor/summarise-a-web-page-with-ai/canvas`);
        const node = c.page.locator(".react-flow__node-ai").first();
        if (!(await node.isVisible({ timeout: 10_000 }).catch(() => false))) return c.note("summarise-a-web-page-with-ai has no ai node");
        const d = await taskModal(c, node, /^Edit /, "existing-");
        await close(c.page, d);
      });
    },
  },
];
