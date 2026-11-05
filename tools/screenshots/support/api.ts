import type { APIRequestContext } from "@playwright/test";

/*
 * Borrowed from flow.service.workflow/e2e/support/api.ts: direct calls to service-core's REST
 * API (/api/v2) on its own origin. The flow_session cookie saved by auth.setup.ts rides on every
 * request (cookies match by host, not port), so no auth header is needed.
 */
export const API_ORIGIN = process.env.SHOTS_API_URL ?? "http://localhost:7700";

// client-web mounts the app under this basename; every page.goto() must include it.
export const APP_BASENAME = "/apps/flow";

// The workspace every screenshot is taken in. Seeded once, reused on every capture.
export const EXAMPLE_WORKSPACE = { name: "example-workspace", displayName: "Example workspace" };

export type Workspace = { name: string; displayName: string };
export type Workflow = { id: string; name: string; displayName: string };

async function ok<T>(res: Awaited<ReturnType<APIRequestContext["get"]>>, what: string): Promise<T> {
  if (!res.ok()) throw new Error(`${what} failed: ${res.status()} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export async function currentUser(request: APIRequestContext): Promise<{ id: string; email: string }> {
  return ok(await request.get(`${API_ORIGIN}/api/v2/profile`), "GET /api/v2/profile");
}

export async function findWorkspace(request: APIRequestContext, name: string): Promise<Workspace | null> {
  const res = await request.get(`${API_ORIGIN}/api/v2/workspace/${name}`);
  return res.ok() ? res.json() : null;
}

export async function createWorkspace(request: APIRequestContext, ws: Workspace): Promise<Workspace> {
  // The creator is not self-added as a member, so include the caller explicitly, as the UI does.
  const me = await currentUser(request);
  return ok(
    await request.post(`${API_ORIGIN}/api/v2/workspace`, {
      data: { ...ws, members: [{ id: me.id, email: me.email, role: "owner" }] },
    }),
    `create workspace ${ws.name}`,
  );
}

// A minimal runnable graph: start -> sleep -> end. `sleep` is seeded by service-core's migrations.
export async function createWorkflow(
  request: APIRequestContext,
  workspace: string,
  wf: { name: string; displayName: string; description?: string; seconds?: number },
): Promise<Workflow> {
  return ok(
    await request.post(`${API_ORIGIN}/api/v2/workspace/${workspace}/workflow`, {
      data: {
        name: wf.name,
        displayName: wf.displayName,
        description: wf.description,
        tasks: [
          { name: "start", type: "start" },
          {
            name: "sleep",
            type: "template",
            taskRef: "sleep",
            params: [{ name: "duration", value: String(wf.seconds ?? 5) }],
            dependencies: [{ taskRef: "start" }],
          },
          { name: "end", type: "end", dependencies: [{ taskRef: "sleep" }] },
        ],
      },
    }),
    `create workflow ${workspace}/${wf.name}`,
  );
}

export async function findWorkflow(request: APIRequestContext, workspace: string, name: string) {
  const res = await request.get(`${API_ORIGIN}/api/v2/workspace/${workspace}/workflow/${name}`);
  return res.ok() ? res.json() : null;
}

// Any workflow body (tasks graph, triggers, params) as the API takes it.
export async function createWorkflowBody(request: APIRequestContext, workspace: string, body: Record<string, unknown>) {
  return ok(
    await request.post(`${API_ORIGIN}/api/v2/workspace/${workspace}/workflow`, { data: body }),
    `create workflow ${workspace}/${body.name}`,
  );
}

export async function cancelRun(request: APIRequestContext, workspace: string, runId: string) {
  return ok(
    await request.delete(`${API_ORIGIN}/api/v2/workspace/${workspace}/workflowrun/${runId}/cancel`),
    `cancel run ${runId}`,
  );
}

export async function createSchedule(request: APIRequestContext, workspace: string, schedule: Record<string, unknown>) {
  return ok(
    await request.post(`${API_ORIGIN}/api/v2/workspace/${workspace}/schedule`, { data: schedule }),
    `create schedule ${schedule.name}`,
  );
}

// start=true runs it through the dispatcher; start=false parks it at `ready` with no dispatcher.
export async function submitRun(request: APIRequestContext, workspace: string, workflow: string, start: boolean) {
  return ok(
    await request.post(`${API_ORIGIN}/api/v2/workspace/${workspace}/workflow/${workflow}/submit?start=${start}`, {
      data: {},
    }),
    `submit ${workspace}/${workflow}`,
  );
}
