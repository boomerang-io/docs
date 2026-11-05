---
title: What's new
order: 3
description: What changed in Boomerang Flow 5.0.0, for anyone coming from Flow 3.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. UI labels checked against the live webapp (build 490ba3894, 2026-11-06): 28 of 39 bolded terms seen live; the rest are states the walk didn't reach or aren't labels, and were verified in client-web source. Facts from CHANGELOG.md "Unreleased: 5.0.0" at that tag. -->

# What's new

Boomerang Flow 5.0.0 rebuilds Flow's engine, webapp and API. Flow 4 was never released for general use, so this page compares 5.0.0 with Flow 3. It covers the changes workflow authors and operators notice; the [release notes on GitHub](https://github.com/boomerang-io/flow/releases) list every change.

## What's new

### Workspaces, Home and Admin

- **Workspaces replace teams.** A workspace holds workflows, members, parameters and quotas. Any signed-in user can create one and becomes its owner, unless an admin turns off **Workspace creation by users**. See [Manage workspace](../fundamentals/manage).
- **Home shows your day at a glance.** Today's runs, the approvals and manual tasks waiting on you, your workspaces and recent activity, plus a three-step **Get started** list for new users. See [Home](../fundamentals/home).
- **Starter workflows on Home.** **Start a workflow** copies a ready-made workflow into a workspace. Templates from a v3 install come across as starters.
- **One Admin area.** **Admin** replaces v3's administration menu, with tabs for Settings, Workspaces, Users, Parameters, Tokens, Tasks and Audit. Each tab shows only to people allowed to use it. See [Admin](../fundamentals/administer).
- **An audit trail.** **Admin › Audit** records who changed what, including settings, global parameters, catalogue tasks and schedules.

### Building workflows

- **Repeat a task for each item.** Turn on **Run for each item** on a task's **Configure** tab and give it a JSON array: Flow runs the task once per item, up to 256 items. See [Repeat a task for each item](../guides/repeat-a-task-for-each-item).
- **AI tasks.** **AI Prompt** sends a prompt, files or images to an OpenAI-compatible model and returns the reply. **AI Agent** lets the model call tools until it reaches an answer. See [Use AI tasks](../guides/use-ai-tasks).
- **A shared run workspace.** Turn on **Shared workspace for each run** under **Configure › Workspace**, and every task in a run reads and writes the same files. Flow creates it when the run starts and removes it when the run completes.
- **Artifacts.** **Upload Artifact** and **Download Artifact** keep a file for one run, or between runs with scope Workflow. See [Artifacts and the run workspace](../fundamentals/artifacts).
- **Secret parameters.** A secret is encrypted at rest, masked on every read and never written to a log. See [Use secrets](../guides/use-secrets).
- **Finally tasks.** Link a task from **End**, and it runs after the run ends, however it ended: for clean-up or a notification.
- **Task retries.** A task's **Configure** tab sets **Retries**, from 0 to 10, and a **Backoff** for failures its dispatcher reports.
- **Concurrency limits.** **Concurrency limit** under **Configure › Run Options** caps a workflow's runs in flight. Choose **Queue until a run ends** or **Skip the run** for the runs over the limit. See [Configure a workflow](../guides/configure-workflow).
- **Child workflows pass values both ways.** **Run Workflow** passes the parameters the child workflow declares, and a child it waits for returns its results as the task's results. It can start one child per item.
- **Integrations per workspace.** Connect GitHub, Slack, Google or Microsoft on a workspace's **Integrations** page, then **Share the installation token with tasks** for GitHub or Slack, so tasks don't need a token typed into each node. 16 new catalogue tasks cover GitHub, Microsoft Teams, SharePoint and Google Drive. See [Integrations](../fundamentals/integrations) and [Connect GitHub](../guides/connect-github).

### Running workflows

- **Event and GitHub triggers start runs.** A run started by a CloudEvent or a GitHub event gets two parameters, `event` and `data`, so its tasks read a field as `$(params.data.<field>)`. A webhook or event URL can name the workflow: `?workspace=<workspace>&ref=<workflow name>`, the URL the editor shows. See [Triggers](../fundamentals/triggers).
- **Pause and resume a run.** **Pause run** stops new tasks starting while the work in flight finishes, and **Resume run** carries on.
- **Retry from where it failed.** **Retry run**, or a task's **Retry from here**, reruns everything, only the tasks that did not succeed, or the tasks you select. The tasks it doesn't rerun are carried over and tagged **Reused**. See [Retry a run](../guides/retry-a-run).
- **Timeouts count working time only.** Waits for approvals, manual tasks, events, child runs, sleeps and locks don't use up the run's timeout, and nor does a pause. Activity and the run page show each run's **Active time**. See [Runs](../fundamentals/runs).
- **Live task logs.** A running task's log streams as it's written. With an artifact store, Flow keeps a finished task's log after its pod is gone.

### Running Flow

- **Dispatchers run every task.** A dispatcher claims ready tasks from Flow and runs them. Flow's Kubernetes dispatcher runs each task as a Tekton TaskRun or a Kubernetes Job. A dispatcher can run in another cluster or network zone, and you can write your own with the dispatcher SDK. See [Configuring](../hosting/configuring).
- **Sign-in with OpenID Connect,** set at install time, with admins decided by a claim from your identity provider and optional invite-only sign-up. See [Sign-in](../hosting/sign-in).
- **Machine tokens in configuration.** Declare tokens for the dispatcher and other callers in properties, and rotate them without a gap. See [Machine tokens](../hosting/machine-tokens).
- **A versioned REST API.** `/api/v2`, with a published OpenAPI contract and a Java library, `flow-sdk`. See the [API reference](../apis/overview).
- **CloudEvents out.** Flow sends run and task status events to a sink you configure, filtered by type, status or phase. See [Configuring](../hosting/configuring).

## Improvements

- **Faster hops between tasks.** A ready task reaches a waiting dispatcher at once, so each step in a chain takes about 100–200 ms.
- **Sleeps end on time,** within about a second of their due time.
- **Clearer failures.** A failed task's message includes its container's exit code and the end of its log. A run whose workspace can't be created shows the cause, and tries again after a minute.
- **Approvals return results.** An approval task ends with `approvalStatus`, `approvalDate`, `approvalUserName`, `approvalUserEmail` and `approvalComments`, read with `$(tasks.<name>.results.approvalStatus)`.
- **Locks go with their run.** A run that ends holding an **Acquire Lock** lock frees it at once.
- **Repeated callbacks are ignored.** A Wait For Event callback that carries an `eventId` is applied once, and a repeat within 7 days is acknowledged without effect.
- **Durations read the same everywhere:** "< 1 s", "42 s", "1 min 48 s", "1 h 10 min".
- **Who started a run** shows by name in Activity and on the run page.
- **Insights break down task runs** by task, type, workflow or label, with mean, median, 95th-percentile and longest durations, and the tokens and cost of AI tasks.
- **A roomier task form.** The task's name and tabs sit in the header, with its declared results on a **Results** tab.
- **The side nav remembers your workspace.** On Home, Admin and your profile, it points at the last workspace you opened.

## Fixed

- **An approval that needs several approvers waits for all of them.** Its **Number of Approvals (optional)** field was ignored, so one approver completed every approval.
- **A switch that never ran no longer fails the run.** The tasks after it are skipped, and the run carries on.
- **Release Lock frees the key** that an Acquire Lock in the same run took.
- **Acquire Lock states its timeout in milliseconds,** with a default of 5 minutes, in its revision 2. Revision 1 said seconds and defaulted to 300, which meant 300 ms.
- **An approval or manual task that a cancel or timeout completed stays completed,** instead of reopening with its action left for nobody.
- **Disconnecting GitHub** on the Integrations page disconnects it.
- **Deleting a workflow revokes only its own tokens.**

## Upgrading

Upgrading a v3 install is forward-only: back up first. [Upgrading](../hosting/upgrading) has every step.

- **Start from bmrg-flow 4.13.5 or later.** v5 refuses an older v3 database, a v4 database or one a 5.0 beta migrated. See [Check that v5 can upgrade this database](../hosting/upgrading#check-that-v5-can-upgrade-this-database).
- **Export the run history you need.** v3 runs come across without their task runs, and Flow purges finished runs older than 365 days within hours of the first start. No setting keeps every run. See [Expect the run purge](../hosting/upgrading#expect-the-run-purge).
- **Resolve users who share an email** before you start. See [Check for duplicate emails](../hosting/upgrading#check-for-duplicate-emails).
- **Plan a dispatcher.** v5 runs every task through one. See [Before you start](../hosting/upgrading#before-you-start).
- **Set both encryption pairs** before the first start: v3's pair to read v3's secured settings, and v5's to encrypt from then on. See [Set the encryption keys](../hosting/upgrading#set-the-encryption-keys).
- **Remove the loader.** `service-core` migrates the database as it starts, and the Java images have no shell: move JVM flags to `JDK_JAVA_OPTIONS`. See [Configure v5](../hosting/upgrading#configure-v5).
- **Issue new tokens.** v3 tokens don't carry over. See [Issue new tokens](../hosting/upgrading#issue-new-tokens).
- **Save workflows that used Workflow storage.** Each is refused with `WORKFLOW_STORAGE_REMOVED` until it's saved again. Keep files between runs with workflow-scoped artifacts. See [Update workflows](../hosting/upgrading#update-workflows).
- **Change CloudEvent inputs** to read `$(params.data.<path>)`. See [Find the workflows that read CloudEvent inputs](../hosting/upgrading#find-the-workflows-that-read-cloudevent-inputs).
- **Replace `$(team.params.x)`** with `$(workspace.params.x)`. The old form still resolves, with a warning, until the next major version. See [Update workflows](../hosting/upgrading#update-workflows).
- **Check workspace quotas of 0.** In v5, `0` means unlimited. See [Update workflows](../hosting/upgrading#update-workflows).
- **Re-enter integration secrets.** The Slack signing secret and the GitHub webhook secret are now required. See [Re-enter integration secrets](../hosting/upgrading#re-enter-integration-secrets).
- **Check `auditor` and `author` users.** They're plain users in v5. See [Check user types](../hosting/upgrading#check-user-types).
- **Update API clients.** Settings and global parameters take `PATCH`, and `teams` and the `TEAM_*` error reasons are now `workspaces` and `WORKSPACE_*`. See [Update API clients](../hosting/upgrading#update-api-clients).

## Next steps

- [Getting started](./getting-started): build and run your first workflow in v5.
- [Known issues](./known-issues): defects in 5.0.0 and their workarounds.
- [Upgrading](../hosting/upgrading): the full upgrade from v3.
