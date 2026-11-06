---
title: Glossary
order: 7
description: The terms Boomerang Flow and these docs use, each defined in a sentence or two, with a link to the page that explains it.
toc: false
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Glossary

The terms Boomerang Flow and these docs use, in alphabetical order. Each links to the page that explains it.

**action**: A point in a workflow where a person decides before the run carries on: an approval or a manual task. See [Actions](../fundamentals/actions).

**approval**: An action where people approve or reject, added with the **Manual Approval** task. Once approved, the task ends **Succeeded**; once rejected, **Failed**. See [How an approval is decided](../fundamentals/actions#how-an-approval-is-decided).

**artifact**: A file a task uploads with **Upload Artifact** so that it outlasts the run. A run-scoped artifact belongs to its run and expires after its retention, 30 days by default. A workflow-scoped artifact is kept for later runs of the workflow until a new upload replaces it or someone deletes it. See [Artifacts and the run workspace](../fundamentals/artifacts).

**catalogue**: The tasks Flow seeds, available in every workspace from the editor's **Add a task** panel. Admins manage them in **Admin › Tasks**. See [The catalogue](../fundamentals/tasks#the-catalogue).

**claim**: A dispatcher taking a ready task run from Flow to run it. Each claim carries a lease. See [Dispatchers](../architecture/dispatchers).

**dispatcher**: The process that claims task runs and runs them. Flow ships a Kubernetes dispatcher that runs each task as a pod, and any process that follows Flow's dispatcher contract can be one. See [Dispatchers](../architecture/dispatchers).

**executor**: How Flow's Kubernetes dispatcher runs a task: `tekton`, as a Tekton TaskRun (the dispatcher's default), or `kube-jobs`, as a Kubernetes Job. See [Choose an executor](../hosting/dispatcher#choose-an-executor).

**finally task**: A task linked from **End**, which runs once the run's graph has ended, however it ended. Use one to clean up or report the outcome. See [Run a task after the run ends](../guides/workflow-editor#run-a-task-after-the-run-ends).

**for each**: A task setting, **Run for each item**, that runs the task once per item of a list, each item as its own task run, up to 256 items. See [Repeat a task for each item](../guides/repeat-a-task-for-each-item).

**global parameter**: A parameter an admin sets in **Admin › Parameters** for every workspace, read as `$(global.params.<name>)`. See [Parameters](../fundamentals/parameters).

**integration**: A connection between a workspace and another service, such as GitHub or Slack. It can share that service's credentials with tasks as workspace parameters. See [Integrations](../webapp/integrations).

**lease**: How long a claim stays valid: 90 seconds, renewed by the dispatcher's heartbeat every 30 seconds. When a lease lapses, Flow queues the task again. See [How leases and heartbeats work](../hosting/dispatcher#how-leases-and-heartbeats-work).

**node**: A task placed on a workflow's canvas, with a task name unique in the workflow. Later tasks read its results by that name. See [Workflow editor](../guides/workflow-editor).

**parameter**: A named value a workflow or task reads, written as a reference such as `$(params.registry)`. Values come from layers: global, workspace, workflow, task, and the run's context. When two layers hold a value, the later one in that list wins. See [Parameters](../fundamentals/parameters).

**phase**: Where a run or task run is in its lifecycle: `pending`, `queued`, `running` or `completed`. The webapp shows the status, not the phase. See [Status and phase](../fundamentals/runs#status-and-phase).

**quota**: A limit on what one workspace can use, such as runs per month, concurrent runs or artifact storage. See [Quotas](../webapp/quotas).

**revision**: One saved form of a task. A node stays on its task's revision until you upgrade it in the editor. A workflow's saved forms are called versions. See [Tasks](../fundamentals/tasks).

**run**: Short for workflow run. See [Runs](../fundamentals/runs).

**run workspace**: The volume a run's tasks share, mounted at `/workspace` unless the workflow sets another path. Each run gets a new one, removed when the run completes. Don't confuse it with a workspace, the tenant. See [The run workspace](../fundamentals/artifacts#the-run-workspace).

**schedule**: A timetable that starts runs of a workflow, once or repeating, with the parameter values each run starts with. See [Schedules](../webapp/schedules).

**secured parameter**: A parameter stored encrypted, masked in the webapp and scrubbed from logs. A secured parameter can't be made unsecured. See [Secured parameters](../fundamentals/parameters#secured-parameters).

**starter**: See template.

**status**: The outcome of a run or task run, such as `running`, `succeeded` or `timedout`. The webapp shows it as a label, such as **Succeeded** or **Timed Out**. See [Status and phase](../fundamentals/runs#status-and-phase).

**task**: One unit of work in a workflow: a container a dispatcher runs, or a step Flow runs itself, such as an approval. See [Tasks](../fundamentals/tasks).

**task run**: The record of one execution of one task in a run, with its status, results and log. See [Runs](../fundamentals/runs).

**task type**: The kind of task, which decides who runs it. Container types, such as `template` and `script`, go to a dispatcher; the rest, such as `approval` and `sleep`, run inside Flow. See [Task types](../fundamentals/tasks#task-types).

**template**: A workflow shared with every workspace. Running it makes it your workspace's own workflow, whose tasks follow the template's versions. A starter is different: **Start a workflow** on Home copies it into a workspace as an ordinary workflow. See [Templates](../fundamentals/workflows#templates).

**token**: A credential for Flow's API, of one of four kinds: `session`, for a signed-in person; `user`, a person's long-lived token; `key`, for a service or a workflow on one workspace; and `global`, for an admin, an automation or a dispatcher. See [Machine tokens](../hosting/machine-tokens).

**trigger**: How a run starts: manual, schedule, webhook, event or GitHub. Each workflow turns each one on or off. See [Triggers](../fundamentals/triggers).

**workflow**: A graph of tasks that automates a process the same way every time. See [Workflows](../fundamentals/workflows).

**workflow run**: The record of one execution of a workflow: the version it ran, what started it, and a task run for every task. See [Runs](../fundamentals/runs).

**workspace**: The tenant that holds workflows, members, parameters and quotas. In these docs a bare "workspace" always means this, never the run workspace. See [Manage workspace](../webapp/manage).

## Next steps

- [Flow in five minutes](./flow-in-five-minutes): how the pieces fit together.
- [Getting started](./getting-started): build and run your first workflow.
