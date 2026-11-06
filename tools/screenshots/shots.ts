import { expect, test, type APIRequestContext, type Locator, type Page } from "@playwright/test";
import { API_ORIGIN, APP_BASENAME, EXAMPLE_WORKSPACE } from "./support/api";

/*
 * One entry per docs screenshot. `id` is the test title, so `npx playwright test -g <id>`
 * captures one. `out` is relative to flow/ (the docs) and mirrors there under out/.
 * `{ws}` is replaced with the example workspace's name. `ready` names something that must be
 * visible before the capture, so a half-loaded page is never saved. `placeholder` is the docs
 * page and line of the SCREENSHOT comment the image replaces.
 *
 * Ids holding "later" touch Home or Admin › Settings, or install-wide data: capture them only
 * while nobody else uses the stack (`-g later`). Everything else: `--grep-invert later`.
 */
export type Box = { x: number; y: number; width: number; height: number };

export type Shot = {
  id: string;
  page: string; // the docs page that uses it
  placeholder: string; // "<page>.md:<line>" of the SCREENSHOT comment it fills
  url: string; // path under the app basename
  out: string; // image path relative to flow/
  ready?: { role: Parameters<Page["getByRole"]>[0]; name: string } | { text: string };
  fullPage?: boolean;
  prepare?: (page: Page) => Promise<void>;
  /** Screenshot only this element, such as a dialog or a panel. */
  target?: (page: Page) => Locator;
  /** Or crop the window (the whole page with `fullPage`) to this box, computed after `prepare`. */
  clip?: Box | ((page: Page) => Promise<Box>);
};

/* ------------------------------------------------------------------------------------------ */
/* Data the shots need, beyond tests/seed.setup.ts. Each `ensure` is idempotent: it creates     */
/* only what's missing and reuses an earlier run, so recaptures don't add runs.                 */
/* ------------------------------------------------------------------------------------------ */

const WS = EXAMPLE_WORKSPACE.name;
const WS_API = `${API_ORIGIN}/api/v2/workspace/${WS}`;

type TaskRun = { name: string; status: string; attempt?: number };
type Run = { id: string; status: string; phase: string; workflowName: string; creationDate: string; tasks?: TaskRun[] };

async function call<T = any>(req: APIRequestContext, method: string, url: string, data?: unknown): Promise<T> {
  const res = await req.fetch(url, { method, data });
  if (!res.ok()) throw new Error(`${method} ${url} failed: ${res.status()} ${await res.text()}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// One promise per key and worker: shots that share data set it up once per capture.
const once = new Map<string, Promise<unknown>>();
function memo<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (!once.has(key)) once.set(key, fn().catch((e) => (once.delete(key), Promise.reject(e))));
  return once.get(key) as Promise<T>;
}

/** The example workspace holds the seed's 9 workflows and these 8, and keeps a few runs waiting. */
function ensureQuotas(req: APIRequestContext) {
  return memo("quotas", async () => {
    const ws = await call(req, "GET", WS_API);
    if ((ws.quotas?.maxWorkflowCount ?? 0) >= 20 && (ws.quotas?.maxWorkflowRunMonthly ?? 0) >= 100) return;
    await call(req, "PATCH", WS_API, { quotas: { maxWorkflowCount: 20, maxWorkflowRunMonthly: 100 } });
  });
}

async function ensureWorkflow(req: APIRequestContext, body: Record<string, any>) {
  await ensureQuotas(req);
  const res = await req.get(`${WS_API}/workflow/${body.name}`);
  if (res.ok()) return res.json();
  return call(req, "POST", `${WS_API}/workflow`, body);
}

/** Puts a new version of a workflow when `patch` would change it (`wanted` says if it already holds). */
async function ensureVersion(req: APIRequestContext, name: string, wanted: (wf: any) => boolean, patch: (wf: any) => void, reason: string) {
  const wf = await call(req, "GET", `${WS_API}/workflow/${name}`);
  if (wanted(wf)) return wf;
  patch(wf);
  wf.changelog = { reason };
  return call(req, "PUT", `${WS_API}/workflow`, wf);
}

const getRun = (req: APIRequestContext, id: string) => call<Run>(req, "GET", `${WS_API}/workflowrun/${id}?withTasks=true`);

async function runsOf(req: APIRequestContext, workflow: string): Promise<Run[]> {
  const res = await call(req, "GET", `${WS_API}/workflowrun/query?limit=200&workflows=${workflow}`);
  return ((res?.content ?? []) as Run[])
    .filter((r) => r.workflowName === workflow)
    .sort((a, b) => b.creationDate.localeCompare(a.creationDate));
}

async function waitRun(req: APIRequestContext, id: string, until: (r: Run) => boolean, timeout = 240_000): Promise<Run> {
  let run = await getRun(req, id);
  await expect
    .poll(async () => until((run = await getRun(req, id))), { timeout, intervals: [2_000] })
    .toBe(true);
  return run;
}

/** The newest run `accept` takes, else a fresh run (start=true) waited on until `until`. */
async function ensureRun(
  req: APIRequestContext,
  workflow: string,
  accept: (r: Run) => boolean,
  until: (r: Run) => boolean = (r) => r.phase === "completed",
): Promise<Run> {
  for (const r of await runsOf(req, workflow)) {
    const full = await getRun(req, r.id);
    if (accept(full)) return full;
  }
  test.setTimeout(6 * 60_000);
  const submitted = await call<Run>(req, "POST", `${WS_API}/workflow/${workflow}/submit?start=true`, {});
  return waitRun(req, submitted.id, until);
}

const succeeded = (r: Run) => r.status === "succeeded";
const taskIs = (name: string, status: string) => (r: Run) => (r.tasks ?? []).some((t) => t.name === name && t.status === status);

async function ensureSchedule(req: APIRequestContext, schedule: Record<string, unknown>) {
  const res = await call(req, "GET", `${WS_API}/schedule/query?limit=100`);
  const found = ((res?.content ?? []) as { name: string; workflowRef: string }[]).find(
    (s) => s.name === schedule.name && s.workflowRef === schedule.workflowRef,
  );
  return found ?? call(req, "POST", `${WS_API}/schedule`, schedule);
}

// Task graph builders, as the API takes them.
const start = { name: "start", type: "start" };
const end = (after: string, executionCondition = "always") => ({ name: "end", type: "end", dependencies: [{ taskRef: after, executionCondition }] });
const dep = (after: string, executionCondition = "always") => [{ taskRef: after, executionCondition }];
const p = (values: Record<string, string>) => Object.entries(values).map(([name, value]) => ({ name, value }));
const shell = (name: string, script: string, after: string, extra: Record<string, unknown> = {}) => ({
  name, type: "script", taskRef: "execute-shell", params: p({ script }), dependencies: dep(after), ...extra,
});
const param = (name: string, type: string, extra: Record<string, unknown> = {}) => ({ name, type, required: false, readOnly: false, ...extra });

/** getting-started: the Execute Shell node keeps the name the palette gives it. */
const HELLO_FLOW = {
  name: "hello-flow", displayName: "Hello Flow", description: "Says hello from an Execute Shell task.",
  triggers: { manual: { enabled: true } },
  tasks: [start, shell("Execute Shell", 'echo "Hello from Boomerang Flow"', "start"), end("Execute Shell")],
};

/** keep-files-between-runs: a counter kept as the workflow-scoped "state" artifact. */
const COUNT_RUNS = {
  name: "count-runs", displayName: "Count runs", description: "Keeps a run counter between runs as the state artifact.",
  workspace: { size: "1Gi" },
  triggers: { manual: { enabled: true } },
  tasks: [
    start,
    { name: "restore-state", type: "downloadartifact", taskRef: "download-artifact", params: p({ name: "state", path: "state", scope: "workflow", optional: "true" }), dependencies: dep("start") },
    shell("count-runs", 'mkdir -p /workspace/state\ncount=$(cat /workspace/state/count 2>/dev/null || echo 0)\ncount=$((count + 1))\necho "$count" > /workspace/state/count\necho "This workflow has run $count times"', "restore-state"),
    { name: "save-state", type: "uploadartifact", taskRef: "upload-artifact", params: p({ name: "state", path: "state", scope: "workflow" }), dependencies: dep("count-runs") },
    end("save-state"),
  ],
};

/**
 * retry-a-run, run, configure-workflow and triggers: two parameters, run options, three trigger
 * kinds, and a deploy that fails its first attempt (a marker in the run workspace) and retries.
 */
const BUILD_AND_DEPLOY = {
  name: "build-and-deploy", displayName: "Build and deploy", description: "Builds, tests and deploys a version; deploy retries once.",
  workspace: { size: "1Gi" },
  timeout: 20, retries: 1, concurrency: { limit: 1, overflow: "queue" },
  triggers: {
    manual: { enabled: true, conditions: [] },
    webhook: { enabled: true, conditions: [] },
    event: { enabled: true, conditions: [{ field: "type", operation: "equals", value: "com.example.build.finished" }] },
    schedule: { enabled: false, conditions: [] },
    github: { enabled: false, conditions: [] },
  },
  params: [
    param("environment", "text", { label: "Environment", description: "Where to deploy.", default: "staging", required: true }),
    param("version", "text", { label: "Version", description: "The version to build and deploy.", default: "1.4.2", required: true }),
  ],
  tasks: [
    start,
    shell("build", 'echo "Building $(params.version)"', "start"),
    { ...shell("test", 'echo "Testing $(params.version)"', "build"), dependencies: dep("build", "success") },
    {
      ...shell("deploy", 'if [ -f /workspace/.deploy-attempted ]; then\n  echo "Deployed $(params.version) to $(params.environment)"\nelse\n  touch /workspace/.deploy-attempted\n  echo "The $(params.environment) service is not responding"\n  exit 1\nfi', "test"),
      dependencies: dep("test", "success"), retry: { max: 1 },
    },
    end("deploy", "success"),
  ],
};

/** repeat-a-task-for-each-item. */
const DEPLOY_TO_REGIONS = {
  name: "deploy-to-regions", displayName: "Deploy to regions", description: "Deploys to each region in the regions parameter with For each.",
  triggers: { manual: { enabled: true } },
  params: [param("regions", "text", { default: '["sydney","london","virginia"]' })],
  tasks: [start, shell("deploy", 'echo "Deploying item $(params.index) to $(params.item)"', "start", { foreach: { items: "$(params.regions)" } }), end("deploy")],
};

/** tutorials/manual-approval-output. Its run waits on `approval`; nobody approves it. */
const APPROVAL_EMAIL = {
  name: "approval-email", displayName: "Approval email", description: "Asks for an approval, then emails the decision.",
  triggers: { manual: { enabled: true } },
  params: [param("sendgrid-api-key", "password", { label: "sendgrid-api-key" })],
  tasks: [
    start,
    { name: "approval", type: "approval", taskRef: "manual-approval", params: [], dependencies: dep("start") },
    {
      name: "email", type: "template", taskRef: "send-email-with-sendgrid", dependencies: dep("approval"),
      params: p({
        apiKey: "$(params.sendgrid-api-key)", to: "$(tasks.approval.results.approvalUserEmail)", from: "flow@example.com",
        subject: "Approval $(tasks.approval.results.approvalStatus) by $(tasks.approval.results.approvalUserName)", contentType: "Text",
        bodyContent: "status: $(tasks.approval.results.approvalStatus)\ncomments: $(tasks.approval.results.approvalComments)",
      }),
    },
    end("email"),
  ],
};

/**
 * tutorials/pass-results-with-an-approval: build returns `filename`, approve waits for a person,
 * and publish (on a success link) prints the result and the approval's results. Needs no outside
 * account. The parameter has a label: without one, Workflow Parameters shows an unlabelled field.
 */
const PASS_RESULTS_COMMENT = "Checked the release notes.";
const PUBLISH_WITH_APPROVAL = {
  name: "publish-with-approval", displayName: "Publish with approval", description: "Builds a file name from a version, waits for an approval, then publishes it.",
  triggers: { manual: { enabled: true } },
  params: [param("version", "text", { label: "Version", default: "1.0.0" })],
  tasks: [
    start,
    {
      ...shell("build", 'filename="my-app-$(params.version).tar.gz"\necho "Built $filename"\nif [ -d "$RESULTS_PATH" ]; then\n  printf \'%s\' "$filename" > "$RESULTS_PATH/filename"\nelse\n  printf \'{"filename":"%s"}\' "$filename" > "$RESULTS_PATH"\nfi', "start"),
      results: [{ name: "filename", description: "The file the build made" }],
    },
    { name: "approve", type: "approval", taskRef: "manual-approval", params: [], dependencies: dep("build") },
    {
      ...shell("publish", 'echo "Publishing $(tasks.build.results.filename)"\necho "Decision: $(tasks.approve.results.approvalStatus) by $(tasks.approve.results.approvalUserName)"\necho "Comment: $(tasks.approve.results.approvalComments)"', "approve"),
      dependencies: dep("approve", "success"),
    },
    end("publish"),
  ],
};

/** tutorials/box-file-download: canvas and Configure only (a run needs Box and SendGrid). */
const EMAIL_A_BOX_FILE = {
  name: "email-a-box-file", displayName: "Email a Box file", description: "Downloads a file from a Box shared link and emails it.",
  workspace: { size: "1Gi", mountPath: "" },
  triggers: { manual: { enabled: true } },
  params: [param("download-url", "url", { required: true }), param("file-name", "text", { required: true }), param("sendgrid-api-key", "password")],
  tasks: [
    start,
    { name: "download", type: "script", taskRef: "execute-shell", dependencies: dep("start"),
      params: p({ path: "/workspace", shell: "bash", script: 'curl -fsSL "$(params.download-url)" --output "$(params.file-name)"' }) },
    { name: "email", type: "template", taskRef: "send-email-with-sendgrid", dependencies: dep("download", "success"),
      params: p({ apiKey: "$(params.sendgrid-api-key)", to: "someone@example.com", from: "flow@example.com", subject: "Your file: $(params.file-name)", contentType: "Text", bodyContent: "The file is attached.", attachments: "/workspace/$(params.file-name)" }) },
    end("email"),
  ],
};

/** tutorials/github-issues-bot: canvas and its schedule (a run needs GitHub). */
const github = (org = "my-org", repo = "my-repo") => ({ url: "$(workspace.params.github-url)", token: "$(workspace.params.github-token)", org, repo });
const STALE_ISSUES_BOT = {
  name: "stale-issues-bot", displayName: "Stale issues bot", description: "Labels quiet issues stale, then closes them a week later.",
  triggers: { manual: { enabled: true, conditions: [] }, schedule: { enabled: true, conditions: [] } },
  tasks: [
    start,
    { name: "close-stale", type: "template", taskRef: "find-issues-and-remove", dependencies: dep("start"), params: p({ ...github(), daysSinceActivity: "7", label: "stale" }) },
    { name: "mark-stale", type: "template", taskRef: "find-issues-and-label", dependencies: dep("close-stale"), params: p({ ...github(), daysSinceActivity: "30", label: "stale", ignoreLabel: "ignore" }) },
    end("mark-stale"),
  ],
};

/** tutorials/github-teams: canvas only (a run needs a GitHub organisation). */
const gh = { url: "$(params.github-api-url)", token: "$(params.github-pat)", organizationName: "$(params.github-org)" };
const GITHUB_TEAM_DEMO = {
  name: "github-team-demo", displayName: "GitHub team demo", description: "Creates a team, invites someone to it, then deletes it.",
  triggers: { manual: { enabled: true } },
  params: [
    param("github-org", "text", { default: "my-org", required: true }),
    param("team-name", "text", { default: "Flow tutorial team", required: true }),
    param("invitee-email", "email", { required: true }),
    param("github-pat", "password"),
    param("github-api-url", "url", { default: "https://api.github.com" }),
  ],
  tasks: [
    start,
    { name: "create-team", type: "template", taskRef: "create-team-in-organization", dependencies: dep("start"), params: p({ ...gh, teamName: "$(params.team-name)", privacy: "closed" }) },
    { name: "get-team-slug", type: "template", taskRef: "jsonpath-to-parameter", dependencies: dep("create-team", "success"), params: p({ json: "$(tasks.create-team.results.team)", query: "$.slug" }) },
    { name: "invite-to-org", type: "template", taskRef: "invite-user-to-organization", dependencies: dep("get-team-slug", "success"), params: p({ ...gh, userEmail: "$(params.invitee-email)", role: "member" }) },
    { name: "add-to-team", type: "template", taskRef: "invite-member-to-team", dependencies: dep("invite-to-org", "success"), params: p({ ...gh, teamName: "$(tasks.get-team-slug.results.evaluation)", userEmail: "$(params.invitee-email)", role: "member" }) },
    { name: "pause", type: "sleep", taskRef: "sleep", dependencies: dep("add-to-team", "success"), params: p({ duration: "60000" }) },
    { name: "delete-team", type: "template", taskRef: "delete-team-from-organization", dependencies: dep("pause", "success"), params: p({ ...gh, teamName: "$(tasks.get-team-slug.results.evaluation)" }) },
    end("delete-team"),
  ],
};

/** guides/tasks: the Greet workspace task, as the guide's steps leave it. */
const GREET = {
  name: "greet", displayName: "Greet", category: "Examples", icon: "Message", description: "Greets someone by name", type: "template",
  spec: {
    image: "alpine:3.20",
    script: '#!/bin/sh\nset -eu\ngreeting="Hello, ${PARAM_RECIPIENT}"\necho "$greeting"\nif [ -d "$RESULTS_PATH" ]; then\n  printf \'%s\' "$greeting" > "$RESULTS_PATH/greeting"\nelse\n  printf \'{"greeting":"%s"}\' "$greeting" > "$RESULTS_PATH"\nfi\n',
    params: [{ name: "recipient", label: "Recipient", type: "text", required: true, readOnly: false, description: "", placeholder: "" }],
    results: [{ name: "greeting", description: "The greeting" }],
  },
};

const ensure = {
  helloFlowRun: (req: APIRequestContext) =>
    memo("hello-flow", async () => (await ensureWorkflow(req, HELLO_FLOW), ensureRun(req, "hello-flow", succeeded))),
  countRunsRun: (req: APIRequestContext) =>
    memo("count-runs", async () => (await ensureWorkflow(req, COUNT_RUNS), ensureRun(req, "count-runs", succeeded))),
  buildAndDeployRun: (req: APIRequestContext) =>
    memo("build-and-deploy", async () => {
      await ensureWorkflow(req, BUILD_AND_DEPLOY);
      return ensureRun(req, "build-and-deploy", (r) => succeeded(r) && (r.tasks ?? []).some((t) => t.name === "deploy" && (t.attempt ?? 1) > 1));
    }),
  deployToRegionsRun: (req: APIRequestContext) =>
    memo("deploy-to-regions", async () => (await ensureWorkflow(req, DEPLOY_TO_REGIONS), ensureRun(req, "deploy-to-regions", succeeded))),
  approvalEmailRun: (req: APIRequestContext) =>
    memo("approval-email", async () => {
      await ensureWorkflow(req, APPROVAL_EMAIL);
      return ensureRun(req, "approval-email", taskIs("approval", "waiting"), taskIs("approval", "waiting"));
    }),
  /** release-to-production needs two approvals; its newest run has one, Grace Hopper's. */
  releaseHalfApproved: (req: APIRequestContext) =>
    memo("release-to-production", async () => {
      await ensureVersion(
        req, "release-to-production",
        (wf) => wf.tasks.some((t: any) => t.name === "approve-release" && t.params?.some((x: any) => x.name === "numberOfApprovals" && x.value === "2")),
        (wf) => {
          const task = wf.tasks.find((t: any) => t.name === "approve-release");
          task.params = [...(task.params ?? []).filter((x: any) => x.name !== "numberOfApprovals"), { name: "numberOfApprovals", value: "2" }];
        },
        "A release needs two approvals",
      );
      const run = await ensureRun(req, "release-to-production", taskIs("approve-release", "waiting"), taskIs("approve-release", "waiting"));
      const actions = await call(req, "GET", `${WS_API}/action/query?types=approval&statuses=submitted&limit=50`);
      const action = ((actions?.content ?? []) as any[]).find((a) => a.workflowRunRef === run.id);
      if (action && !(action.actioners ?? []).length) {
        await call(req, "PUT", `${WS_API}/action`, [{ id: action.id, approved: true, comments: "Release notes checked." }]);
      }
      return run;
    }),
  /** publish-with-approval: a run (version 1.0.0) waiting on `approve`; nobody decides it. */
  passResultsWaiting: (req: APIRequestContext) =>
    memo("pass-results-waiting", async () => {
      await ensureWorkflow(req, PUBLISH_WITH_APPROVAL);
      return ensureRun(req, "publish-with-approval", taskIs("approve", "waiting"), taskIs("approve", "waiting"));
    }),
  /**
   * publish-with-approval: a run of version 1.4.2, approved with the tutorial's comment, that
   * succeeded on the workflow's latest version (so the image matches the current definition).
   */
  passResultsApproved: (req: APIRequestContext) =>
    memo("pass-results-approved", async () => {
      const wf = await ensureWorkflow(req, PUBLISH_WITH_APPROVAL);
      const done = (r: Run & { workflowVersion?: number }) =>
        r.workflowVersion === wf.version && succeeded(r) && taskIs("publish", "succeeded")(r);
      for (const r of await runsOf(req, "publish-with-approval")) {
        const full = await getRun(req, r.id);
        if (done(full)) return full;
      }
      test.setTimeout(8 * 60_000);
      const submitted = await call<Run>(req, "POST", `${WS_API}/workflow/publish-with-approval/submit?start=true`, {
        params: [{ name: "version", value: "1.4.2" }],
      });
      await waitRun(req, submitted.id, taskIs("approve", "waiting"));
      const actions = await call(req, "GET", `${WS_API}/action/query?types=approval&statuses=submitted&limit=50`);
      const action = ((actions?.content ?? []) as any[]).find((a) => a.workflowRunRef === submitted.id);
      if (!action) throw new Error(`no open approval for run ${submitted.id}`);
      await call(req, "PUT", `${WS_API}/action`, [{ id: action.id, approved: true, comments: PASS_RESULTS_COMMENT }]);
      return waitRun(req, submitted.id, (r) => r.phase === "completed");
    }),
  /** Every run the pages above show, so Activity and Insights list them all. */
  allRuns: async (req: APIRequestContext) => {
    await ensure.helloFlowRun(req);
    await ensure.countRunsRun(req);
    await ensure.buildAndDeployRun(req);
    await ensure.deployToRegionsRun(req);
    await ensure.releaseHalfApproved(req);
    await ensure.approvalEmailRun(req); // with release-to-production's, the runs still Running
  },
  /**
   * Install-wide: a template in the system workspace, listed on every workspace's Workflows page.
   * Only for the "later" set, while nobody else uses the stack.
   */
  template: (req: APIRequestContext) =>
    memo("template", async () => {
      const sys = `${API_ORIGIN}/api/v2/workspace/system/workflow`;
      const name = "deploy-a-static-site";
      if (!(await req.get(`${sys}/${name}`)).ok()) {
        await call(req, "POST", sys, {
          name, displayName: "Deploy a static site", description: "Builds a static site and publishes it.",
          triggers: { manual: { enabled: true } },
          tasks: [start, shell("publish", 'echo "Publishing the site"', "start"), end("publish")],
        });
      }
      const wf = await call(req, "GET", `${sys}/${name}`);
      if (wf.type !== "template") await call(req, "PATCH", `${sys}/${name}`, { type: "template" });
    }),
  /** Three schedules: nightly-report's (seeded, Scheduler trigger turned on), and two weekly ones. */
  schedules: (req: APIRequestContext) =>
    memo("schedules", async () => {
      await ensureQuotas(req);
      const scheduler = (wf: any) => wf.triggers?.schedule?.enabled && wf.triggers?.manual?.enabled;
      const turnOn = (wf: any) => {
        wf.triggers = { ...wf.triggers, manual: { enabled: true, conditions: [] }, schedule: { enabled: true, conditions: [] } };
      };
      await ensureVersion(req, "nightly-report", scheduler, turnOn, "Turn on the Manual and Scheduler triggers");
      await ensureVersion(req, "clean-up-artifacts", scheduler, turnOn, "Turn on the Scheduler trigger");
      await ensureWorkflow(req, STALE_ISSUES_BOT);
      await ensureSchedule(req, {
        name: "Weekly clean-up", description: "Clears old artifacts early on Sunday.", type: "cron", cronSchedule: "0 3 * * 0",
        timezone: "Australia/Melbourne", workflowRef: "clean-up-artifacts", params: [], labels: {},
      });
      await ensureSchedule(req, {
        name: "Weekly tidy", description: "Closes stale issues, then marks quiet ones.", type: "cron", cronSchedule: "0 9 * * 1",
        timezone: "Australia/Melbourne", workflowRef: "stale-issues-bot", params: [], labels: {},
      });
    }),
  greet: (req: APIRequestContext) =>
    memo("greet", async () => {
      const res = await req.get(`${WS_API}/task/greet`);
      return res.ok() ? res.json() : call(req, "POST", `${WS_API}/task`, GREET);
    }),
  deployToken: (req: APIRequestContext) =>
    memo("deploy-token", async () => {
      const ws = await call(req, "GET", WS_API);
      if ((ws.parameters ?? []).some((x: any) => x.name === "deploy-token")) return;
      await call(req, "PATCH", WS_API, {
        parameters: [{ name: "deploy-token", label: "Deploy token", description: "The deploy service's API token.", type: "password", value: "dt_8f3a1c2b9e7d4f60" }],
      });
    }),
};

/* ------------------------------------------------------------------------------------------ */
/* Page helpers. Locators come from flows.ts and the live walk's .yml files.                    */
/* ------------------------------------------------------------------------------------------ */

async function settle(page: Page) {
  await expect(page.getByRole("navigation", { name: "Platform navigation" })).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState("networkidle").catch(() => {});
  await expect(page.locator(".cds--loading:not(.cds--loading--stop)")).toHaveCount(0, { timeout: 15_000 });
}

async function go(page: Page, path: string) {
  await page.goto(APP_BASENAME + path.replace("{ws}", WS));
  await settle(page);
}

/**
 * The app scrolls an inner pane, not the window, so `fullPage` stops at 900 px. A long page is
 * captured in a taller window instead: still 1440 wide, cropped to what matters.
 */
async function tall(page: Page, height: number) {
  await page.setViewportSize({ width: 1440, height });
  await page.waitForTimeout(500);
  await settle(page);
}

const editor = (page: Page, workflow: string, tab: string) => go(page, `/{ws}/editor/${workflow}/${tab}`);

/** The topmost open dialog, optionally the one holding some text. */
function dialog(page: Page, hasText?: string | RegExp): Locator {
  const all = page.getByRole("dialog");
  return (hasText ? all.filter({ hasText }) : all).last();
}

async function open(page: Page, control: Locator, hasText?: string | RegExp): Promise<Locator> {
  await control.click({ timeout: 10_000 });
  const d = dialog(page, hasText);
  await expect(d).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(500); // the modal's open transition
  return d;
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

/** Drops keyboard focus, so no focus ring is left on the control just used. */
const blur = (page: Page) => page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());

/** Turns a Carbon toggle over: a click, else focus and Space, else a DOM click (flows.ts). */
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

/** HTML5-draggable palette tiles need synthetic drag events (flows.ts). */
async function dragToCanvas(page: Page, tileName: string, at: { x: number; y: number }) {
  await page.getByTestId("editor-task-search").fill(tileName);
  await page.getByRole("button", { name: "Expand all" }).click().catch(() => {});
  const tile = page.getByRole("option", { name: tileName }).first();
  await expect(tile).toBeVisible();
  const canvas = page.locator(".react-flow").first();
  const src = await tile.elementHandle();
  const tgt = await canvas.elementHandle();
  const box = await canvas.boundingBox();
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
  await page.getByTestId("editor-task-search").fill("");
}

/** The union of several elements' boxes, padded, for a `clip`. */
async function around(page: Page, locators: Locator[], pad = 16): Promise<Box> {
  const all = (await Promise.all(locators.map((l) => l.all()))).flat();
  const boxes = (await Promise.all(all.map((l) => l.boundingBox()))).filter(Boolean) as Box[];
  if (!boxes.length) throw new Error("nothing to clip around");
  const scrollY = await page.evaluate(() => window.scrollY);
  const x = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
  const y = Math.max(0, Math.min(...boxes.map((b) => b.y)) - pad + scrollY);
  const right = Math.min(page.viewportSize()?.width ?? 1440, Math.max(...boxes.map((b) => b.x + b.width)) + pad);
  const bottom = Math.max(...boxes.map((b) => b.y + b.height)) + pad + scrollY;
  return { x, y, width: right - x, height: bottom - y };
}

/** The window from the top down to `height`: header, page title and the part that matters. */
const top = (height: number): Box => ({ x: 0, y: 0, width: 1440, height });

const runPage = async (page: Page, run: Run) => {
  await go(page, `/{ws}/activity/${run.id}`);
  await expect(page.getByRole("tablist", { name: "Run detail" })).toBeVisible({ timeout: 15_000 });
};
const taskEntry = (page: Page, name: string) => page.locator(`[id="task-${name}"]`);
const taskLog = (page: Page) => page.getByRole("complementary").filter({ has: page.getByRole("tablist", { name: "Run detail" }) });

/* ------------------------------------------------------------------------------------------ */

const canvasNodes = (page: Page) => page.locator(".react-flow__node");
const aroundNodes = (page: Page) => around(page, [canvasNodes(page)], 32);

/** Gives the canvas the whole width and fits the graph to it, for a crop of just the nodes. */
async function fitCanvas(page: Page) {
  await page.getByRole("button", { name: "Collapse the task palette" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Fit View" }).click();
  await blur(page);
  await page.waitForTimeout(800);
}

export const SHOTS: Shot[] = [
  /* ---- introduction ---- */
  {
    id: "getting-started-canvas", page: "introduction/getting-started", placeholder: "introduction/getting-started.md:90",
    url: "/{ws}/workflows", out: "introduction/assets/getting-started-canvas.png",
    prepare: async (page) => {
      await ensure.helloFlowRun(page.request);
      await editor(page, "hello-flow", "canvas");
      await expect(canvasNodes(page)).toHaveCount(3);
    },
    clip: top(640),
  },
  {
    id: "getting-started-run", page: "introduction/getting-started", placeholder: "introduction/getting-started.md:124",
    url: "/{ws}/activity", out: "introduction/assets/getting-started-run.png",
    prepare: async (page) => runPage(page, await ensure.helloFlowRun(page.request)),
    clip: top(560),
  },

  /* ---- fundamentals ---- */
  {
    id: "home-later-returning-user", page: "fundamentals/home", placeholder: "fundamentals/home.md:13",
    url: "/home", out: "fundamentals/assets/home-returning-user.png",
    ready: { text: "Your workspaces" },
    prepare: async (page) => {
      await ensure.allRuns(page.request);
      await ensure.schedules(page.request);
      await go(page, "/home");
      await tall(page, 1300);
    },
    target: (page) => page.locator("main"),
  },
  {
    id: "activity-page", page: "fundamentals/activity", placeholder: "fundamentals/activity.md:15",
    url: "/{ws}/activity", out: "fundamentals/assets/activity-page.png",
    prepare: async (page) => {
      await ensure.allRuns(page.request);
      await go(page, "/{ws}/activity");
      await expect(page.getByRole("table").first()).toBeVisible();
      // Every run on one page, so the failed one shows beside the succeeded and running ones.
      await page.locator(".cds--pagination select").first().selectOption("20");
      await settle(page);
      await tall(page, 1200);
    },
    clip: async (page) => {
      const box = await around(page, [page.locator(".cds--pagination").first()], 16);
      return top(box.y + box.height);
    },
  },
  {
    id: "runs-failed-run", page: "fundamentals/runs", placeholder: "fundamentals/runs.md:24",
    url: "/{ws}/activity", out: "fundamentals/assets/runs-failed-run.png",
    prepare: async (page) => runPage(page, await ensureRun(page.request, "check-certificates", (r) => r.status === "failed")),
    clip: top(600),
  },
  {
    id: "actions-approvals", page: "fundamentals/actions", placeholder: "fundamentals/actions.md:59",
    url: "/{ws}/actions/approvals", out: "fundamentals/assets/actions-approvals.png",
    prepare: async (page) => {
      await ensure.releaseHalfApproved(page.request);
      await ensure.approvalEmailRun(page.request);
      await go(page, "/{ws}/actions/approvals");
      await expect(page.getByRole("row").filter({ hasText: "approve-release" }).first()).toBeVisible();
    },
    clip: top(520),
  },
  {
    id: "schedules-month", page: "fundamentals/schedules", placeholder: "fundamentals/schedules.md:22",
    url: "/{ws}/schedules", out: "fundamentals/assets/schedules-month.png",
    prepare: async (page) => {
      await ensure.schedules(page.request);
      await go(page, "/{ws}/schedules");
      await page.getByRole("tab", { name: "Month", exact: true }).click();
      await page.waitForTimeout(600);
      await page.getByText("Weekly tidy").first().click();
      await page.waitForTimeout(800);
    },
  },
  {
    id: "insights-page", page: "fundamentals/insights", placeholder: "fundamentals/insights.md:15",
    url: "/{ws}/insights", out: "fundamentals/assets/insights-page.png",
    ready: { text: "By workflow" },
    prepare: async (page) => {
      await ensure.allRuns(page.request);
      await go(page, "/{ws}/insights");
      await tall(page, 1500);
      const row = page.getByRole("table", { name: "Workflow statistics" }).getByRole("row").filter({ hasText: "check-certificates" });
      await row.first().getByRole("link", { name: "check-certificates" }).click();
      await page.waitForURL(/workflows=check-certificates/);
      await settle(page);
      await page.waitForTimeout(800);
    },
    clip: async (page) => around(page, [page.getByText("Runs", { exact: true }).first(), page.getByRole("table", { name: "Workflow statistics" })], 24),
  },
  {
    id: "manage-members", page: "fundamentals/manage", placeholder: "fundamentals/manage.md:15",
    url: "/{ws}/manage", out: "fundamentals/assets/manage-members.png",
    ready: { role: "columnheader", name: "Email" },
    clip: top(480),
  },
  {
    id: "parameters-add-secured", page: "fundamentals/parameters", placeholder: "fundamentals/parameters.md:95",
    url: "/{ws}/parameters", out: "fundamentals/assets/parameters-add-secured.png",
    prepare: async (page) => {
      const d = await open(page, page.getByRole("button", { name: "Add parameter" }), "Add parameter");
      await flip(page, d.getByRole("switch", { name: "Secured" }));
      await blur(page);
      await page.waitForTimeout(300);
    },
    target: (page) => dialog(page, "Add parameter"),
  },
  {
    id: "quotas-page", page: "fundamentals/quotas", placeholder: "fundamentals/quotas.md:29",
    url: "/{ws}/manage/quotas", out: "fundamentals/assets/quotas-page.png",
    ready: { text: "Number of Workflows" },
    prepare: (page) => tall(page, 1500),
    clip: top(1130),
  },
  {
    id: "artifacts-configure-workspace", page: "fundamentals/artifacts", placeholder: "fundamentals/artifacts.md:23",
    url: "/{ws}/workflows", out: "fundamentals/assets/artifacts-configure-workspace.png",
    prepare: async (page) => {
      await ensure.countRunsRun(page.request);
      await editor(page, "count-runs", "configure/workspace");
      await expect(page.getByRole("switch", { name: "Shared workspace for each run" })).toBeChecked();
    },
    clip: top(560),
  },
  {
    id: "tasks-palette", page: "fundamentals/tasks", placeholder: "fundamentals/tasks.md:48",
    url: "/{ws}/workflows", out: "fundamentals/assets/tasks-palette.png",
    prepare: async (page) => {
      await ensure.helloFlowRun(page.request);
      await editor(page, "hello-flow", "canvas");
      await tall(page, 1400);
      await page.getByRole("button", { name: /^AI \(\d+\)/ }).click();
      await blur(page);
      await page.waitForTimeout(400);
    },
    target: (page) => page.getByRole("complementary").filter({ has: page.getByRole("heading", { name: "Add a task" }) }),
  },
  {
    id: "tasks-workspace-task", page: "fundamentals/tasks", placeholder: "fundamentals/tasks.md:133",
    url: "/{ws}/task-manager", out: "fundamentals/assets/tasks-workspace-task.png",
    prepare: async (page) => {
      await ensure.greet(page.request);
      await go(page, "/{ws}/task-manager/greet/1");
      await expect(page.getByRole("heading", { name: "Greet" }).first()).toBeVisible();
      await tall(page, 1000);
    },
  },
  {
    id: "triggers-configure", page: "fundamentals/triggers", placeholder: "fundamentals/triggers.md:23",
    url: "/{ws}/workflows", out: "fundamentals/assets/triggers-configure.png",
    prepare: async (page) => {
      await ensure.buildAndDeployRun(page.request);
      await editor(page, "build-and-deploy", "configure/triggers");
      await expect(page.getByRole("heading", { name: "Events" })).toBeVisible();
      await tall(page, 1400);
    },
    target: (page) => page.getByRole("region", { name: "Configure" }),
  },
  {
    id: "administer-later-settings-features", page: "fundamentals/administer", placeholder: "fundamentals/administer.md:29",
    url: "/admin/settings/features", out: "fundamentals/assets/administer-settings-features.png",
    ready: { text: "Features" },
  },

  /* ---- guides ---- */
  {
    id: "create-workflows-page", page: "guides/create", placeholder: "guides/create.md:24",
    // Searched for "deploy", which leaves three cards and the Create a new workflow tile.
    url: "/{ws}/workflows", out: "guides/assets/create-workflows-page.png",
    prepare: async (page) => {
      await ensure.buildAndDeployRun(page.request);
      await ensure.deployToRegionsRun(page.request);
      await go(page, "/{ws}/workflows?query=deploy");
      await expect(page.getByTestId("workflow-card")).toHaveCount(3);
    },
    clip: top(640),
  },
  {
    id: "workflows-later-page", page: "fundamentals/workflows", placeholder: "fundamentals/workflows.md:21",
    // Install-wide: makes a template in the system workspace, which every workspace lists. It
    // runs after create-workflows-page, whose search would list the template too; delete it
    // afterwards (DELETE /api/v2/workspace/system/workflow/deploy-a-static-site).
    url: "/{ws}/workflows", out: "fundamentals/assets/workflows-page.png",
    prepare: async (page) => {
      await ensure.buildAndDeployRun(page.request);
      await ensure.deployToRegionsRun(page.request);
      await ensure.template(page.request);
      await go(page, "/{ws}/workflows?query=deploy"); // three workflows and the template
      await expect(page.getByText("Template", { exact: true }).first()).toBeVisible();
    },
    clip: top(640),
  },
  {
    id: "create-new-workflow-modal", page: "guides/create", placeholder: "guides/create.md:37",
    url: "/{ws}/workflows", out: "guides/assets/create-new-workflow-modal.png",
    prepare: async (page) => {
      const d = await open(page, page.getByRole("button", { name: /Create a new workflow/ }), "Create a new workflow");
      await d.getByRole("textbox", { name: /^Display Name/ }).fill("Nightly report");
      await page.waitForTimeout(800); // the name check
      await blur(page);
    },
    target: (page) => dialog(page, "Create a new workflow"),
  },
  {
    id: "run-workflow-parameters", page: "guides/run", placeholder: "guides/run.md:27",
    url: "/{ws}/workflows", out: "guides/assets/run-workflow-parameters.png",
    prepare: async (page) => {
      await ensure.buildAndDeployRun(page.request);
      await go(page, "/{ws}/workflows");
      const card = page.getByTestId("workflow-card").filter({ has: page.getByRole("heading", { name: "Build and deploy", exact: true }) }).first();
      await open(page, card.getByRole("button", { name: /^Run it/ }), "Workflow Parameters");
    },
    target: (page) => dialog(page, "Workflow Parameters"),
  },
  {
    id: "workflow-editor-canvas", page: "guides/workflow-editor", placeholder: "guides/workflow-editor.md:37",
    url: "/{ws}/workflows", out: "guides/assets/workflow-editor-canvas.png",
    prepare: async (page) => {
      await ensure.countRunsRun(page.request);
      await editor(page, "count-runs", "canvas");
      await expect(canvasNodes(page)).toHaveCount(5);
    },
    clip: top(640),
  },
  {
    id: "workflow-editor-task-modal", page: "guides/workflow-editor", placeholder: "guides/workflow-editor.md:64",
    url: "/{ws}/workflows", out: "guides/assets/workflow-editor-task-modal.png",
    prepare: async (page) => {
      await ensure.helloFlowRun(page.request);
      await editor(page, "hello-flow", "canvas");
      const before = await canvasNodes(page).count();
      await dragToCanvas(page, "Read File to Parameter", { x: 560, y: 600 });
      await expect(canvasNodes(page)).toHaveCount(before + 1, { timeout: 10_000 });
      const node = canvasNodes(page).filter({ hasText: "Read File to Parameter" }).last();
      const d = await open(page, node.getByRole("button", { name: "edit" }), "Edit Read File to Parameter");
      await d.getByRole("textbox", { name: "Task name" }).fill("read-version");
      await d.getByRole("textbox", { name: /File Path/ }).fill("/workspace/VERSION");
      await blur(page);
      await page.waitForTimeout(300);
    },
    target: (page) => dialog(page, "Edit Read File to Parameter"),
  },
  {
    id: "configure-workflow-run-options", page: "guides/configure-workflow", placeholder: "guides/configure-workflow.md:20",
    url: "/{ws}/workflows", out: "guides/assets/configure-workflow-run-options.png",
    prepare: async (page) => {
      await ensure.buildAndDeployRun(page.request);
      await editor(page, "build-and-deploy", "configure/run");
      await expect(page.getByRole("spinbutton", { name: "Timeout" })).toHaveValue("20");
      await tall(page, 1000);
    },
    clip: top(720),
  },
  {
    id: "keep-files-canvas", page: "guides/keep-files-between-runs", placeholder: "guides/keep-files-between-runs.md:87",
    url: "/{ws}/workflows", out: "guides/assets/keep-files-canvas.png",
    prepare: async (page) => {
      await ensure.countRunsRun(page.request);
      await editor(page, "count-runs", "canvas");
      await expect(canvasNodes(page)).toHaveCount(5);
      await fitCanvas(page);
    },
    clip: aroundNodes,
  },
  {
    id: "keep-files-artifacts", page: "guides/keep-files-between-runs", placeholder: "guides/keep-files-between-runs.md:110",
    url: "/{ws}/workflows", out: "guides/assets/keep-files-artifacts.png",
    prepare: async (page) => {
      await ensure.countRunsRun(page.request);
      await editor(page, "count-runs", "configure/artifacts");
      await expect(page.getByText("state", { exact: true }).first()).toBeVisible();
    },
    clip: top(520),
  },
  {
    id: "repeat-foreach-modal", page: "guides/repeat-a-task-for-each-item", placeholder: "guides/repeat-a-task-for-each-item.md:60",
    url: "/{ws}/workflows", out: "guides/assets/repeat-foreach-modal.png",
    prepare: async (page) => {
      await ensure.deployToRegionsRun(page.request);
      await editor(page, "deploy-to-regions", "canvas");
      // The saved workflow already has `deploy`: remove it (unsaved) so the guide's name is free.
      await canvasNodes(page).filter({ hasText: "deploy" }).getByRole("button", { name: "close-button" }).click();
      await expect(canvasNodes(page)).toHaveCount(2);
      await dragToCanvas(page, "For each", { x: 560, y: 600 });
      const d = dialog(page, "Repeat a task for each item");
      await expect(d).toBeVisible({ timeout: 10_000 });
      const task = d.getByRole("combobox", { name: "Task" });
      await task.click();
      await task.fill("Execute Shell");
      await page.getByRole("option", { name: "Execute Shell", exact: true }).first().click();
      await d.getByRole("textbox", { name: "Items" }).fill("$(params.regions)");
      await d.getByRole("textbox", { name: "Task name" }).fill("deploy");
      await blur(page);
      await page.waitForTimeout(300);
    },
    target: (page) => dialog(page, "Repeat a task for each item"),
  },
  {
    id: "repeat-foreach-items", page: "guides/repeat-a-task-for-each-item", placeholder: "guides/repeat-a-task-for-each-item.md:91",
    url: "/{ws}/activity", out: "guides/assets/repeat-foreach-items.png",
    prepare: async (page) => {
      await runPage(page, await ensure.deployToRegionsRun(page.request));
      await taskEntry(page, "deploy").getByRole("button", { name: /Show items/ }).click();
      await blur(page);
      await page.waitForTimeout(600);
    },
    clip: async (page) => around(page, [taskLog(page).getByRole("tablist", { name: "Run detail" }), taskEntry(page, "deploy")], 0),
  },
  {
    id: "retry-run-modal", page: "guides/retry-a-run", placeholder: "guides/retry-a-run.md:42",
    url: "/{ws}/activity", out: "guides/assets/retry-run-modal.png",
    prepare: async (page) => {
      await runPage(page, await ensureRun(page.request, "check-certificates", (r) => r.status === "failed"));
      const d = await open(page, page.getByRole("button", { name: "Retry run", exact: true }), "Retry run");
      await choose(d.getByRole("radio", { name: /The tasks that did not succeed/ }));
      await page.waitForTimeout(300);
    },
    target: (page) => dialog(page, "Retry run"),
  },
  {
    id: "retry-attempts", page: "guides/retry-a-run", placeholder: "guides/retry-a-run.md:116",
    url: "/{ws}/activity", out: "guides/assets/retry-attempts.png",
    prepare: async (page) => {
      await runPage(page, await ensure.buildAndDeployRun(page.request));
      await open(page, taskEntry(page, "deploy").getByRole("button", { name: "View Details" }), "View Details");
    },
    target: (page) => dialog(page, "View Details"),
  },
  {
    id: "tasks-greet-overview", page: "guides/tasks", placeholder: "guides/tasks.md:170",
    url: "/{ws}/task-manager", out: "guides/assets/tasks-greet-overview.png",
    prepare: async (page) => {
      await ensure.greet(page.request);
      await go(page, "/{ws}/task-manager/greet/1");
      await expect(page.getByRole("heading", { name: "Greet" }).first()).toBeVisible();
      await tall(page, 1000);
    },
  },
  {
    id: "use-secrets-parameters", page: "guides/use-secrets", placeholder: "guides/use-secrets.md:42",
    url: "/{ws}/parameters", out: "guides/assets/use-secrets-parameters.png",
    prepare: async (page) => {
      await ensure.deployToken(page.request);
      await go(page, "/{ws}/parameters");
      await expect(page.getByText("deploy-token").first()).toBeVisible();
    },
    clip: top(420),
  },

  /* ---- hosting ---- */
  {
    id: "hosting-later-settings-integrations", page: "hosting/integrations", placeholder: "hosting/integrations.md:24",
    url: "/admin/settings/integration", out: "hosting/assets/integrations-settings.png",
    ready: { role: "heading", name: "Integrations" },
    prepare: (page) => tall(page, 1500),
    target: (page) => page.locator("main"),
  },
  {
    id: "task-logs-later-settings-artifacts", page: "hosting/task-logs", placeholder: "hosting/task-logs.md:43",
    url: "/admin/settings/artifacts", out: "hosting/assets/task-logs-settings.png",
    ready: { text: "Store Task Logs" },
  },

  /* ---- tutorials ---- */
  {
    id: "tut-pass-results-canvas", page: "tutorials/pass-results-with-an-approval", placeholder: "tutorials/pass-results-with-an-approval.md:120",
    url: "/{ws}/workflows", out: "tutorials/assets/pass-results-canvas.png",
    prepare: async (page) => {
      await ensureWorkflow(page.request, PUBLISH_WITH_APPROVAL);
      await editor(page, "publish-with-approval", "canvas");
      await expect(canvasNodes(page)).toHaveCount(5);
      await fitCanvas(page);
    },
    clip: aroundNodes,
  },
  {
    id: "tut-pass-results-approve", page: "tutorials/pass-results-with-an-approval", placeholder: "tutorials/pass-results-with-an-approval.md:141",
    url: "/{ws}/actions/approvals", out: "tutorials/assets/pass-results-approve.png",
    prepare: async (page) => {
      await ensure.passResultsWaiting(page.request);
      await go(page, "/{ws}/actions/approvals");
      const row = page.getByRole("row").filter({ hasText: "Publish with approval" }).filter({ hasText: "Waiting" }).first();
      const d = await open(page, row.getByRole("cell", { name: "approve", exact: true }), "Action details");
      await d.getByRole("textbox", { name: "Comments (optional)" }).fill(PASS_RESULTS_COMMENT);
      await blur(page);
      await page.waitForTimeout(300);
    },
    target: (page) => dialog(page, "Action details"),
  },
  {
    id: "tut-pass-results-run", page: "tutorials/pass-results-with-an-approval", placeholder: "tutorials/pass-results-with-an-approval.md:150",
    url: "/{ws}/activity", out: "tutorials/assets/pass-results-run.png",
    prepare: async (page) => runPage(page, await ensure.passResultsApproved(page.request)),
    clip: top(560),
  },
  {
    id: "tut-pass-results-log", page: "tutorials/pass-results-with-an-approval", placeholder: "tutorials/pass-results-with-an-approval.md:160",
    url: "/{ws}/activity", out: "tutorials/assets/pass-results-log.png",
    prepare: async (page) => {
      await runPage(page, await ensure.passResultsApproved(page.request));
      const d = await open(page, taskEntry(page, "publish").getByRole("button", { name: "View Log" }), "Execution Log");
      await expect(d.getByText(/Publishing my-app-1\.4\.2\.tar\.gz/).first()).toBeVisible({ timeout: 20_000 });
    },
    target: (page) => dialog(page, "Execution Log"),
  },
  {
    id: "box-file-download-workspace", page: "tutorials/box-file-download", placeholder: "tutorials/box-file-download.md:55",
    url: "/{ws}/workflows", out: "tutorials/assets/box-file-download-workspace.png",
    prepare: async (page) => {
      await ensureWorkflow(page.request, EMAIL_A_BOX_FILE);
      await editor(page, "email-a-box-file", "configure/workspace");
      await expect(page.getByRole("switch", { name: "Shared workspace for each run" })).toBeChecked();
      // Saved with an empty mount path, the API stores /workspace; clear it as the tutorial does (unsaved).
      await page.getByRole("textbox", { name: "Mount path" }).fill("");
      await blur(page);
    },
    clip: top(560),
  },
  {
    id: "box-file-download-canvas", page: "tutorials/box-file-download", placeholder: "tutorials/box-file-download.md:100",
    url: "/{ws}/workflows", out: "tutorials/assets/box-file-download-canvas.png",
    prepare: async (page) => {
      await ensureWorkflow(page.request, EMAIL_A_BOX_FILE);
      await editor(page, "email-a-box-file", "canvas");
      await expect(canvasNodes(page)).toHaveCount(4);
      await fitCanvas(page);
    },
    clip: aroundNodes,
  },
  {
    id: "github-issues-bot-canvas", page: "tutorials/github-issues-bot", placeholder: "tutorials/github-issues-bot.md:84",
    url: "/{ws}/workflows", out: "tutorials/assets/github-issues-bot-canvas.png",
    prepare: async (page) => {
      await ensure.schedules(page.request);
      await editor(page, "stale-issues-bot", "canvas");
      await expect(canvasNodes(page)).toHaveCount(4);
      await fitCanvas(page);
    },
    clip: aroundNodes,
  },
  {
    id: "github-issues-bot-schedule", page: "tutorials/github-issues-bot", placeholder: "tutorials/github-issues-bot.md:117",
    url: "/{ws}/workflows", out: "tutorials/assets/github-issues-bot-schedule.png",
    prepare: async (page) => {
      await ensure.schedules(page.request);
      await editor(page, "stale-issues-bot", "schedule");
      await expect(page.getByText("Weekly tidy").first()).toBeVisible();
    },
    clip: top(520),
  },
  {
    id: "github-teams-canvas", page: "tutorials/github-teams", placeholder: "tutorials/github-teams.md:116",
    url: "/{ws}/workflows", out: "tutorials/assets/github-teams-canvas.png",
    prepare: async (page) => {
      await ensureWorkflow(page.request, GITHUB_TEAM_DEMO);
      await editor(page, "github-team-demo", "canvas");
      await expect(canvasNodes(page)).toHaveCount(8);
      // Eight nodes overflow a 1440-wide canvas even at the minimum zoom: widen the window (the
      // nodes keep the scale of the other canvas crops) and crop to them.
      await page.setViewportSize({ width: 2000, height: 900 });
      await page.waitForTimeout(500);
      await fitCanvas(page);
    },
    clip: aroundNodes,
  },
  {
    id: "manual-approval-output-canvas", page: "tutorials/manual-approval-output", placeholder: "tutorials/manual-approval-output.md:99",
    url: "/{ws}/workflows", out: "tutorials/assets/manual-approval-output-canvas.png",
    prepare: async (page) => {
      await ensure.approvalEmailRun(page.request);
      await editor(page, "approval-email", "canvas");
      await expect(canvasNodes(page)).toHaveCount(4);
      await fitCanvas(page);
    },
    clip: aroundNodes,
  },
  {
    id: "manual-approval-output-action", page: "tutorials/manual-approval-output", placeholder: "tutorials/manual-approval-output.md:109",
    url: "/{ws}/activity", out: "tutorials/assets/manual-approval-output-action.png",
    prepare: async (page) => {
      await runPage(page, await ensure.approvalEmailRun(page.request));
      const d = await open(page, taskEntry(page, "approval").getByRole("button", { name: "Action", exact: true }), "Action Manual Approval");
      await choose(d.getByRole("radio", { name: "Approve" }));
      await d.getByRole("textbox").last().fill("Approved for this week's release.");
      await blur(page);
      await page.waitForTimeout(300);
    },
    target: (page) => dialog(page, "Action Manual Approval"),
  },
];

/**
 * Placeholders this stack can't fill, so they have no entry above. Each needs an outside service;
 * on a stack that has it, add an entry like the ones above.
 */
export const UNCAPTURABLE: { placeholder: string; out: string; reason: string }[] = [
  { placeholder: "fundamentals/integrations.md:13", out: "fundamentals/assets/integrations-github-connected.png", reason: "GitHub connected: needs a GitHub App (Admin › Settings › Integrations is empty)" },
  { placeholder: "guides/connect-github.md:39", out: "guides/assets/connect-github-connected.png", reason: "GitHub card Connected: needs a GitHub App installed on an organisation" },
  { placeholder: "guides/connect-github.md:103", out: "guides/assets/connect-github-trigger.png", reason: "The GitHub trigger is disabled (Integration Required) until GitHub is connected" },
  { placeholder: "guides/use-ai-tasks.md:67", out: "guides/assets/use-ai-tasks-view-details.png", reason: "Needs an OpenAI-compatible endpoint for a succeeded summarise run" },
  { placeholder: "guides/use-ai-tasks.md:147", out: "guides/assets/use-ai-tasks-model-usage.png", reason: "Model usage lists AI task runs; there are none without an AI endpoint" },
  { placeholder: "tutorials/box-file-download.md:110", out: "tutorials/assets/box-file-download-run.png", reason: "A succeeded run needs a Box shared link and a SendGrid API key" },
  { placeholder: "tutorials/github-teams.md:130", out: "tutorials/assets/github-teams-run.png", reason: "A succeeded run needs a GitHub organisation and a personal access token" },
  { placeholder: "tutorials/manual-approval-output.md:129", out: "tutorials/assets/manual-approval-output-run.png", reason: "email succeeds only with a SendGrid API key and a verified sender" },
];
