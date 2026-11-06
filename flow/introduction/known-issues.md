---
title: Known issues
order: 6
description: Defects in Boomerang Flow 5.0.0 that you might hit, with a workaround for each where there is one.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. UI labels checked against the live webapp (build 490ba3894, 2026-11-06): 17 of 26 bolded terms seen live; the rest are states the walk didn't reach or aren't labels, and were verified in client-web source. -->
<!-- Checked open at 5.0.0-beta.39 (3960b0a79) and task-flow 3.3.0 on 4 November 2026: flow#534, #751, #756, #322 and tasks#46 are open. task-flow 3.4.0 (tasks PR #47) published to Docker Hub for amd64 and arm64 on 6 November 2026; Flow's seed still sets 3.3.0. -->

# Known issues

These are the defects in Boomerang Flow 5.0.0 that a workflow author or operator is likely to hit. Each has its workaround, where there is one, and a link to its GitHub issue where one exists. To report a defect that isn't listed, open an issue in the [Flow issue tracker](https://github.com/boomerang-io/flow/issues).

## Tasks

### The HTTP Call tasks do nothing

**Execute Basic HTTP Call** and **Execute Advanced HTTP Call**, every revision, send no request and end **Succeeded**. They run on `boomerangio/task-flow:3.3.0`, the default task image, in which the HTTP command is switched off. A task after them that reads their `response` or `statusCode` result gets nothing.

**Workaround:** make the call with `curl` in an **Execute Shell** task. With `--fail`, an HTTP error status fails the task:

```bash
curl --fail --silent --show-error https://api.example.com/status
```

**Fixed in task-flow 3.4.0.** In **Admin › Settings › Tasks**, set **Default Image Path** to `boomerangio/task-flow:3.4.0`, and every revision of these tasks uses the fix.

### Some older task revisions do nothing

These revisions end **Succeeded** without doing anything, because the command they call no longer exists in the task image:

| Task | Revisions that do nothing | Working revisions |
| --- | --- | --- |
| Send Email with Sendgrid | 1 and 2 | 3 |
| Find Repositories in Org | 1 | 2 to 4 |
| Run Python Script | 1 | 2 |

The editor's **Add a task** panel adds the latest revision, so a new node is never affected. A workflow upgraded from v3 can still be pinned to an old revision.

**Workaround:** upgrade the node. On the canvas, select the node's yellow warning icon, review the fields in **New version available**, and select **Update task**. Then select **Create new version**. A workflow card shows "New version of a task available! To update, edit your workflow." when one of its tasks has a newer version.

### Upload Slack File with Message fails

**Upload Slack File with Message**, every revision, calls a Slack method that Slack has retired, so the task fails.

**Workaround:** use **Send Custom Slack Message** to post the content as a message. **Send Slack Message with File Contents** isn't a workaround: it fails too (see below).

### Two Slack message tasks send nothing

**Send Simple Slack Message** and **Send Slack Message with File Contents** fail inside the task image (`ReferenceError: datetime is not defined` in the task log) yet end **Succeeded**, so nothing reaches Slack. **Send Custom Slack Message** works, but it also ends **Succeeded** when Slack rejects the request, so check its log when a message doesn't arrive.

**Workaround:** use **Send Custom Slack Message**, and check the task log for a Slack error after a run.

**Fixed in task-flow 3.4.0.** In **Admin › Settings › Tasks**, set **Default Image Path** to `boomerangio/task-flow:3.4.0`, and every revision of these tasks uses the fix. On 3.4.0, these two tasks and **Send Custom Slack Message** fail with Slack's answer when Slack rejects a message, instead of ending **Succeeded**.

**Tracked in:** [tasks#46](https://github.com/boomerang-io/tasks/issues/46)

## Starter workflows

### Two starters depend on the HTTP Call tasks

Under **Start a workflow** on Home, **Looking through planets with HTTP Call** and **Summarise a web page with AI** both start with an HTTP Call task, which [does nothing](#the-http-call-tasks-do-nothing). Neither does what its description says.

**Workaround:** in **Summarise a web page with AI**, replace the **Fetch the page** task with an **Execute Shell** task that downloads the page to the path the AI task reads, then link it in the same place:

```bash
curl --fail --silent --show-error --location "$(workflow.params.url)" --output /workspace/page.html
```

The planets starter has no workaround short of replacing each of its three HTTP Call tasks.

## Workflow settings

### The Events trigger's `in` operation never matches

Under **Configure › Triggers**, in the Events section, a condition saved with the **Operation** `in` never matches, so the event never starts a run. The form stores the condition's **Value** where the `in` check doesn't read it.

**Workaround:** use `equals`, or `matches` with a regular expression that lists the values, such as `push|release`.

### Retries under Run Options only retries a run that timed out

The **Retries** field under **Configure › Run Options** says "The number of times to retry a failed workflow. Defaults to 0." Flow starts a new run only when a run times out. A run that fails isn't retried.

**Workaround:** to retry failures, set **Retries** on the **Configure** tab of each task that can fail, or select **Retry run** on the run page.

### Number of Approvals applies without an approver group

On a **Manual Approval** task, the hint for **Number of Approvals (optional)** says "Only respected if Approver Group is specified". Flow applies the number whether or not you choose an approver group.

**Workaround:** leave **Number of Approvals (optional)** blank when one approval is enough.

## Integrations

### Slack's /workflow command never runs a workflow

The Slack `/workflow` command never starts a run, whoever sends it.

**Workaround:** start the run from the webapp, or from outside Flow with a [webhook trigger](../fundamentals/triggers).

**Tracked in:** [flow#751](https://github.com/boomerang-io/flow/issues/751)

## The webapp

### Home loads slowly when you can see many workspaces

Listing workspaces takes about 67 ms per workspace: about 6 seconds for 91. Home, and every page that reads the list, waits for it, so a few hundred workspaces means ten seconds or more.

**Workaround:** none.

**Tracked in:** [flow#534](https://github.com/boomerang-io/flow/issues/534)

### Some links go to old documentation

These links in the webapp go to documentation pages that no longer exist:

- **For more details, check our Docs**, under **Configure › General**, in the Labels section of the workflow editor;
- **Event Triggers**, under **Configure › Triggers**, in the Events section;
- the links in the instructions beside Task Manager's YAML editor.

**Workaround:** see [Triggers](../fundamentals/triggers) and [Tasks](../fundamentals/tasks) on this site.

**Tracked in:** [flow#756](https://github.com/boomerang-io/flow/issues/756)

## The API

### A run request that sends `*****` for an ordinary parameter uses `*****`

On a run request, a parameter sent as `*****` keeps its declared default only when the parameter is a secret. Any other parameter runs with the literal value `*****`.

**Workaround:** to keep a parameter's default, leave it out of the request or send `null`.

### The token permission error describes the wrong format

When a token request has an invalid permission, `TOKEN_INVALID_PERMISSION` says permissions take the form scope, principal and action. The API refuses that form.

**Workaround:** write each permission as `<resource>/<action>`, in lowercase, such as `workflow/read`. See [Machine tokens](../hosting/machine-tokens).

## For operators

### Loki task logs ignore the HTTP client settings

With `dispatcher.logging.type=loki`, the dispatcher reads Loki with its own HTTP client, which ignores the shared proxy, trust store and timeout settings. Behind a proxy, or with Loki behind an internal certificate authority, task logs can't be read while tasks still run.

**Workaround:** none in configuration. Make Loki reachable from the dispatcher without the proxy, or keep `dispatcher.logging.type=default`.

**Tracked in:** [flow#322](https://github.com/boomerang-io/flow/issues/322)

## Next steps

- [What's new](./whats-new): what changed in 5.0.0.
- [Task catalogue](../catalogue/overview): every task, with notes on which revisions to avoid.
- [Upgrading](../hosting/upgrading): moving a v3 install to v5.
