import { test as setup } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";
import {
  EXAMPLE_WORKSPACE,
  cancelRun,
  createSchedule,
  createWorkflowBody,
  createWorkspace,
  findWorkflow,
  findWorkspace,
  submitRun,
} from "../support/api";

/*
 * Seeds the Example workspace the screenshots show: workflows whose runs end in each state the
 * docs describe (succeeded, failed, running, waiting on an approval or a manual task, cancelled),
 * a for-each run and a schedule. Incremental: only a missing workflow is created and run, so an
 * existing workspace stays stable between captures. Each extra step is best-effort and logs a
 * failure instead of stopping the walk. Delete the workspace in Admin › Workspaces to reseed.
 */
const start = { name: "start", type: "start" };
const end = (after: string) => ({ name: "end", type: "end", dependencies: [{ taskRef: after }] });
const sleep = (name: string, seconds: number, after = "start") => ({
  name, type: "sleep", taskRef: "sleep", params: [{ name: "duration", value: String(seconds) }], dependencies: [{ taskRef: after }],
});
const shell = (name: string, script: string, after = "start", extra: Record<string, unknown> = {}) => ({
  name, type: "script", taskRef: "execute-shell",
  params: [{ name: "shell", value: "sh" }, { name: "script", value: script }],
  dependencies: [{ taskRef: after }], ...extra,
});

type Seed = { body: Record<string, unknown>; run?: "start" | "cancel" | "none" };

const WORKFLOWS: Seed[] = [
  { body: { name: "nightly-report", displayName: "Nightly report", description: "Builds and emails the daily summary.",
      triggers: { manual: { enabled: true }, schedule: { enabled: true } },
      tasks: [start, sleep("build-summary", 5), end("build-summary")] } },
  { body: { name: "deploy-service", displayName: "Deploy service", description: "Builds, tests and deploys the service.",
      tasks: [start, sleep("deploy", 10), end("deploy")] } },
  { body: { name: "clean-up-artifacts", displayName: "Clean up artifacts", description: "Removes artifacts older than 30 days.",
      tasks: [start, sleep("clean-up", 3), end("clean-up")] } },
  { body: { name: "check-certificates", displayName: "Check certificates", description: "Fails when a certificate expires within 14 days.",
      tasks: [start, shell("check", 'echo "Checking certificates"; echo "api.example.com expires in 9 days"; exit 1'),
        // A success-only link to End, so the failed task fails the run (an always link would let it succeed).
        { name: "end", type: "end", dependencies: [{ taskRef: "check", executionCondition: "success" }] }] } },
  { body: { name: "migrate-database", displayName: "Migrate database", description: "Runs the schema migration; takes about ten minutes.",
      tasks: [start, sleep("migrate", 600), end("migrate")] } },
  { body: { name: "release-to-production", displayName: "Release to production", description: "Waits for an approval, then releases.",
      tasks: [start,
        { name: "approve-release", type: "approval", taskRef: "manual-approval", params: [], dependencies: [{ taskRef: "start" }] },
        shell("release", 'echo "Releasing"', "approve-release"), end("release")] } },
  { body: { name: "rotate-keys", displayName: "Rotate keys", description: "Asks an operator to rotate the signing keys.",
      tasks: [start,
        { name: "rotate", type: "manual", taskRef: "manual-task", params: [{ name: "instructions", value: "Rotate the signing keys in the vault, then mark this task done." }], dependencies: [{ taskRef: "start" }] },
        end("rotate")] } },
  { body: { name: "rebuild-index", displayName: "Rebuild index", description: "Rebuilds the search index; this run was cancelled.",
      tasks: [start, sleep("rebuild", 600), end("rebuild")] }, run: "cancel" },
  { body: { name: "process-regions", displayName: "Process regions", description: "Runs one task per region with For each.",
      tasks: [start, shell("process", 'echo "Processing $(params.item)"', "start", { foreach: { items: ["sydney", "london", "dallas"] } }), end("process")] } },
];

setup.use({ storageState: STORAGE_STATE });

setup("seed the example workspace", async ({ request }) => {
  const ws = EXAMPLE_WORKSPACE.name;
  if (!(await findWorkspace(request, ws))) await createWorkspace(request, EXAMPLE_WORKSPACE);
  const startRuns = process.env.SHOTS_SEED_START !== "false";
  const created = new Set<string>();

  for (const seed of WORKFLOWS) {
    const name = String(seed.body.name);
    if (await findWorkflow(request, ws, name)) continue;
    try {
      await createWorkflowBody(request, ws, seed.body);
      created.add(name);
      if (seed.run === "none") continue;
      const run = await submitRun(request, ws, name, startRuns);
      if (seed.run === "cancel") {
        await new Promise((r) => setTimeout(r, 5_000));
        await cancelRun(request, ws, run.id);
      }
    } catch (e) {
      console.warn(`seed: ${name}: ${(e as Error).message}`);
    }
  }

  if (created.has("nightly-report")) try {
    await createSchedule(request, ws, {
      name: "Every night", description: "Runs the nightly report at 2am.", type: "cron",
      cronSchedule: "0 2 * * *", timezone: "Australia/Melbourne", workflowRef: "nightly-report", params: [], labels: {},
    });
  } catch (e) {
    console.warn(`seed: schedule: ${(e as Error).message}`);
  }
});
