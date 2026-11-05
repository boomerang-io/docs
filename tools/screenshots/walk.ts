/*
 * Every user-reachable route in the v5 webapp (client-web/app/routes.ts), for the docs' live
 * walk. Each stop records the page's accessibility tree (exact labels) and a full-page image.
 * `open` names a button or link to select after load: the dialog it opens is recorded as its own
 * stop. Placeholders: {ws} the example workspace, {wf} its first workflow, {run} its newest run,
 * {user} the signed-in user's id. Labels come from .claude/v5-sources/webapp-ui.md.
 */
export type Stop = {
  id: string;
  url: string;
  page: string; // the docs page this feeds
  open?: { role: "button" | "link" | "tab"; name: string | RegExp }[];
};

export const STOPS: Stop[] = [
  { id: "home", url: "/home", page: "fundamentals/home", open: [{ role: "button", name: "New workspace" }] },
  { id: "workflows", url: "/{ws}/workflows", page: "fundamentals/workflows", open: [{ role: "button", name: /Create a new workflow/ }, { role: "button", name: /^Run it/ }] },
  { id: "editor-canvas", url: "/{ws}/editor/{wf}/canvas", page: "guides/workflow-editor" },
  { id: "editor-parameters", url: "/{ws}/editor/{wf}/parameters", page: "guides/workflow-editor", open: [{ role: "button", name: "Add parameter" }] },
  { id: "editor-configure-general", url: "/{ws}/editor/{wf}/configure/general", page: "guides/configure-workflow" },
  { id: "editor-configure-triggers", url: "/{ws}/editor/{wf}/configure/triggers", page: "fundamentals/triggers" },
  { id: "editor-configure-run", url: "/{ws}/editor/{wf}/configure/run", page: "guides/configure-workflow" },
  { id: "editor-configure-workspace", url: "/{ws}/editor/{wf}/configure/workspace", page: "fundamentals/artifacts" },
  { id: "editor-configure-artifacts", url: "/{ws}/editor/{wf}/configure/artifacts", page: "fundamentals/artifacts" },
  { id: "editor-configure-tokens", url: "/{ws}/editor/{wf}/configure/tokens", page: "guides/configure-workflow" },
  { id: "editor-schedule", url: "/{ws}/editor/{wf}/schedule", page: "fundamentals/schedules", open: [{ role: "button", name: "Create schedule" }] },
  { id: "editor-changelog", url: "/{ws}/editor/{wf}/changelog", page: "guides/workflow-editor" },
  { id: "activity", url: "/{ws}/activity", page: "fundamentals/activity" },
  { id: "run", url: "/{ws}/activity/{run}", page: "fundamentals/runs" },
  { id: "actions-approvals", url: "/{ws}/actions/approvals", page: "fundamentals/actions" },
  { id: "actions-manual", url: "/{ws}/actions/manual", page: "fundamentals/actions" },
  { id: "schedules", url: "/{ws}/schedules", page: "fundamentals/schedules", open: [{ role: "button", name: "Create schedule" }] },
  { id: "insights", url: "/{ws}/insights", page: "fundamentals/insights" },
  { id: "integrations", url: "/{ws}/integrations", page: "fundamentals/integrations" },
  { id: "parameters", url: "/{ws}/parameters", page: "fundamentals/parameters", open: [{ role: "button", name: "Add parameter" }] },
  { id: "task-manager", url: "/{ws}/task-manager", page: "fundamentals/tasks", open: [{ role: "button", name: /Add a new task/ }] },
  { id: "manage-members", url: "/{ws}/manage", page: "fundamentals/manage" },
  { id: "manage-workflows", url: "/{ws}/manage/workflows", page: "fundamentals/manage" },
  { id: "manage-approver-groups", url: "/{ws}/manage/approver-groups", page: "fundamentals/manage" },
  { id: "manage-artifacts", url: "/{ws}/manage/artifacts", page: "fundamentals/artifacts" },
  { id: "manage-quotas", url: "/{ws}/manage/quotas", page: "fundamentals/quotas" },
  { id: "manage-tokens", url: "/{ws}/manage/tokens", page: "fundamentals/manage" },
  { id: "manage-settings", url: "/{ws}/manage/settings", page: "fundamentals/manage" },
  ...["artifacts", "audit", "auth", "customizations", "features", "integration", "quotas", "workflowrun", "task"].map(
    (g): Stop => ({ id: `admin-settings-${g}`, url: `/admin/settings/${g}`, page: "fundamentals/administer" }),
  ),
  { id: "admin-workspaces", url: "/admin/workspaces", page: "fundamentals/administer" },
  { id: "admin-users", url: "/admin/users", page: "fundamentals/administer" },
  { id: "admin-user-detail", url: "/admin/users/{user}", page: "fundamentals/administer" },
  { id: "admin-parameters", url: "/admin/parameters", page: "fundamentals/parameters" },
  { id: "admin-task-manager", url: "/admin/task-manager", page: "fundamentals/tasks" },
  { id: "admin-tokens", url: "/admin/tokens", page: "fundamentals/administer" },
  { id: "admin-audit", url: "/admin/audit", page: "fundamentals/administer" },
  { id: "profile", url: "/profile", page: "fundamentals/home" },
  { id: "not-found", url: "/{ws}/no-such-page", page: "introduction/faq" },
];
