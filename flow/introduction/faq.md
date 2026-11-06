---
title: Frequently asked questions
order: 4
description: Short answers to common questions about workflows, tasks, timings and limits in Boomerang Flow.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. UI labels checked against the live webapp (build 490ba3894, 2026-11-06): 25 of 29 bolded terms seen live; the rest are states the walk didn't reach or aren't labels, and were verified in client-web source. -->

# Frequently asked questions

Short answers to the questions workflow authors ask most, with links to the pages that go deeper. The numbers are Flow's defaults; an admin can change many of them.

## What can I automate with Flow?

Work that follows the same steps every time. For example:

- **Repository housekeeping:** create issues, comment on pull requests, set commit statuses and create releases with the GitHub tasks.
- **Approvals:** pause a run until a person approves or rejects, then carry on or stop.
- **Notifications:** post to Slack or Microsoft Teams, or send email.
- **Reports:** gather data and write it to Google Sheets.
- **Operations runbooks:** run scripts in order, retry what fails, and keep a record of every run.
- **AI steps:** summarise or classify text and images with **AI Prompt**, or let **AI Agent** call tools until it reaches an answer.

## What are workflows and tasks?

A **task** is one unit of work. Most tasks run as a container, through a dispatcher. A few, such as **Sleep**, **Switch** and **Manual Approval**, are handled by Flow itself.

A **workflow** is a graph of tasks linked on a canvas. Flow runs the tasks in the order the links set, and records each execution as a workflow run, with one task run per task.

Tasks come from three places:

- the **catalogue**, the tasks Flow ships, listed by category in the editor's **Add a task** panel;
- your workspace's **Task Manager**;
- your own container image, through **Run Custom Task**.

See [Workflows](../fundamentals/workflows) and [Tasks](../fundamentals/tasks).

## What is a DAG?

A directed acyclic graph: the shape of every Flow workflow.

- **Graph:** tasks are the nodes, and links are the edges between them.
- **Directed:** each link runs one way, from a task to the tasks that depend on it.
- **Acyclic:** no path leads back to an earlier task, so a run can't loop.

A task with several links into it waits until all of them have ended. To repeat work, turn on **Run for each item** on one task instead of looping. See [Repeat a task for each item](../guides/repeat-a-task-for-each-item).

## Can I create my own tasks?

Yes, in three ways:

1. **Run Custom Task** runs a container image you name, with your own command, arguments or script.
2. **Execute Shell** and **Run Python Script** run a script you write in the task.
3. **Task Manager** adds a task to your workspace, from scratch or by importing a Tekton Task YAML or JSON file. Admins add tasks for every workspace in **Admin › Tasks**.

See [Add your own tasks in Task Manager](../fundamentals/tasks#add-your-own-tasks-in-task-manager).

## How quickly does a task start?

Within about a second of being ready. When the dispatcher is polling the same Flow instance, it's handed the task at once, and each step in a chain of tasks takes about 100–200 ms. Otherwise the dispatcher checks again every second.

The container then has to start, which depends on your cluster and on pulling the image. A **Sleep** ends within about a second of its due time.

## How long can a run take?

As long as the run's **Timeout**, set in minutes under **Configure › Run Options** in the editor. With none set, the workspace's run-duration quota applies: 30 minutes by default. Flow notices an expired run within about 30 seconds, after a 5-second grace.

Waiting doesn't count. While every running task is waiting for an approval, a manual task, an event, a child run, a sleep or a lock, the run's clock stops, and it stops while the run is paused. An approval can wait indefinitely unless its task declares a timeout.

A single task can run as long as its run allows. An admin can set a ceiling for every task with **Maximum task duration** in **Admin › Settings › Tasks**. See [Runs](../fundamentals/runs).

## What happens when a task can't start?

| Problem | What Flow does |
| --- | --- |
| The image can't be pulled | The task fails after about a minute. |
| The pod isn't running within 15 minutes, for example because it can't be scheduled | The dispatcher hands the task back, and Flow queues it again, up to 3 times. |
| The dispatcher holding the task stops responding | Flow queues the task again after 60 seconds without a poll, or when its 90-second lease lapses, up to 3 times. |

## Why is my run Waiting or Ready?

- **Waiting**, before any task has started: the workflow's own concurrency limit is holding the run. It starts when a run ends and frees a slot. The workspace's **Concurrent Runs (executions)** quota works differently: a run submitted over it is refused with `QUOTA_EXCEEDED`, not held.
- **Ready**, with "Waiting for a dispatcher to provision its workspace": the workflow has a run workspace, and no dispatcher has created it yet. If creating it fails, the run shows the cause, tries again after a minute, and fails on the third attempt.
- A task stays **Ready**: no dispatcher has claimed it. Ask your operator to check the dispatcher.

## How many workflows and runs can a workspace have?

These are the default workspace quotas:

| Quota | Default |
| --- | --- |
| Workflows | 10 |
| Runs at the same time | 4 |
| Runs per month | 20 |
| Run duration | 30 minutes |
| Run workspace size | 2 GiB |
| Artifact storage | 5 GiB |

A quota of `0` means unlimited. An admin sets the platform defaults in **Admin › Settings › Quotas**. A workspace's own limits show in **Manage workspace › Quotas**. See [Quotas](../webapp/quotas).

## How long does Flow keep runs, logs and artifacts?

- **Finished runs:** 365 days by default, and at least 60 (**Activity Retention (days)**). Flow purges older runs every hour, with their task runs, actions, run-scoped artifacts and logs. No value keeps every run.
- **Run-scoped artifacts:** 30 days by default, and at most 90.
- **Workflow-scoped artifacts:** until a later run replaces them, or someone deletes them.
- **Stored task logs:** 7 days.
- **Artifact download links:** 15 minutes.

## How big can parameters, results and files be?

| Item | Limit |
| --- | --- |
| A task's resolved parameters | 16 KB |
| A task's results, on Flow's Kubernetes dispatcher | 4 KB (4,096 bytes) |
| An artifact | 1,024 MB |
| A stored task log | 10 MiB |
| Items in one for-each task | 256 |
| Child workflows nested inside each other | 5 levels |

Pass anything bigger by reference: a path in the run workspace, or an artifact.

## Can I keep files between runs?

Not in the run workspace: each run gets a new one, removed when the run completes, and a retry starts with an empty one. Upload the file with **Upload Artifact** at scope Workflow, and read it in the next run with **Download Artifact**. See [Keep files between runs](../guides/keep-files-between-runs).

## Which browsers does Flow support?

Recent versions of Chrome, Firefox, Safari and Edge. In another browser, Flow warns that "Your experience may be degraded" and offers **Continue, anyway**.

## Where do I report a problem?

In the [Flow issue tracker](https://github.com/boomerang-io/flow/issues) on GitHub. Check [Known issues](./known-issues) first.

## Next steps

- [Getting started](./getting-started): build and run your first workflow.
- [Runs](../fundamentals/runs): statuses, retries, timeouts and concurrency.
- [Artifacts and the run workspace](../fundamentals/artifacts): sharing and keeping files.
