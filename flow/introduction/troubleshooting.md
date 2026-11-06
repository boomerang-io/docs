---
title: Troubleshooting
order: 3
description: What to check when a run doesn't start, a task fails or waits, a trigger does nothing, sign-in fails or a log is empty, with Flow's exact messages.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. Messages quoted from service-core and service-dispatcher messages.properties and the code at that tag; UI labels source-verified in client-web. -->

# Troubleshooting

Each section starts from what you see, then lists causes, how to tell them apart, and fixes. Workflow authors' problems come first; operators' come last.

On the run page, the run's reason shows beside its status, and **View run error** shows its message. For a task, select **View Details** to read its **Message**, **Reason** and **Attempts**. An API caller gets the error code in the response's `reason` field.

## A run didn't start

No run appears in **Activity**, or one appears and none of its tasks runs.

| Cause | How to tell | Fix |
| --- | --- | --- |
| The trigger is off | `400 WORKFLOWRUN_TRIGGER_DISABLED`: "The Trigger provided is not enabled for this Workflow." A schedule shows **Trigger Disabled**. | Turn the trigger on under **Configure › Triggers**, then select **Create new version**. |
| A workspace quota is reached | `429 QUOTA_EXCEEDED`, naming `Number of runs (executions)`, `Concurrent runs (executions)` or `Requested Workspace size`: "A quota has been exceeded. Number of runs (executions): 20 / 20". The webapp shows **Quota Exceeded**. | Wait for a run to end or the month to reset (UTC), or ask an admin to raise the quota. |
| The workflow's concurrency limit is reached | The run is **Waiting**: "Waiting for a slot: the workflow's concurrency limit of … in-flight runs is reached." Or **Cancelled** with `ConcurrencyLimit`. | Let the earlier run finish, or raise **Concurrency limit**. |
| The run failed admission: the workflow is incomplete or invalid | The run is **Invalid** with `WorkflowInvalid`: "Failed to run workflow: incomplete, or invalid, workflow" | Fix the workflow in the editor and create a new version. |
| No dispatcher has created the run workspace | The run is **Ready**: "Waiting for a dispatcher to provision its workspace" | Ask your operator to check the dispatcher. |
| No dispatcher runs this task type | The first container task stays **Ready** | Ask your operator to [register the task type](../hosting/dispatcher#choose-the-task-types). |
| The cluster refused the pod | The task is **Failed** with `AdmissionDenied` or `ImagePull` | Correct the image, or ask your operator about admission policy. |

The first two create no run. See [Runs](../fundamentals/runs) and [When a task can't start](../hosting/dispatcher#when-a-task-cant-start).

## Run it is greyed out

Hover over the workflow card's status icon for the reason.

| Cause | How to tell | Fix |
| --- | --- | --- |
| The **Manual** trigger is off | **Trigger disabled** | Turn on **Manual** under **Configure › Triggers**, then create a new version. |
| The monthly run quota is used up | "This workspace has reached the maximum number of runs (executions) allowed this month…" | Wait for the month to reset, or ask an admin to raise **Number of Executions**. |
| The concurrent run quota is reached | "This workspace has reached the maximum number of concurrent runs (executions) allowed…" | Wait for a run to end, or cancel one. |

See [Why is Run it disabled?](../guides/run#why-is-run-it-disabled) and [Quotas](../webapp/quotas).

## A task failed with ParamUnresolved

The task fails with the reason `ParamUnresolved` before its container starts. Its **Message** names the field, the reference and why:

```text
Task 'deploy': script references $(params.registryTokn): no such param 'registryTokn'
```

| Cause | How to tell | Fix |
| --- | --- | --- |
| A typo, or a parameter no layer declares | "no such param '…'" | Correct the reference, or declare the parameter. |
| A credential the workspace doesn't share | "no such workspace param 'github-token'" | Connect the [integration](../webapp/integrations) and share its credentials, or type a value on the node. |
| A wrong task or result name | "task '…' is not in this workflow" or "task '…' declares no result '…'" | Use the node's **Task name** and a declared result. |
| The layer is off | **Workspace Parameters** or **Global Parameters** is off in **Admin › Settings › Features** | Ask an admin, or move the value to the workflow. |

Task retries don't apply. See [Parameters](../fundamentals/parameters#why-did-a-task-fail-with-paramunresolved).

## A task timed out

The task or run is **Timed Out**, with the reason `DeadlineExceeded`.

| Cause | How to tell | Fix |
| --- | --- | --- |
| The run used its timeout | Without a **Timeout**, a run gets the run duration quota, 30 minutes by default. | Raise **Timeout** under **Configure › Run Options**, up to the quota. |
| The task waited for a dispatcher | It stayed **Ready** for most of the run; that wait counts | Ask your operator to check the dispatcher. |
| An admin capped every task | It timed out at **Maximum task duration** (**Admin › Settings › Tasks**) | Ask an admin to raise it. |
| The pod never started | **Attempts** lists `StartTimeout` | Ask your operator about cluster capacity. |

Waiting on people, events, child runs, sleeps and locks doesn't count. A timeout shorter than the longest chain of task timeouts is refused with `WORKFLOWRUN_TIMEOUT_TOO_SHORT`. See [Timeouts](../fundamentals/runs#timeouts).

## A task succeeded but did nothing

The task is **Succeeded**, but its work didn't happen, or a later task gets empty results.

| Cause | How to tell | Fix |
| --- | --- | --- |
| An HTTP Call task | **Execute Basic HTTP Call** or **Execute Advanced HTTP Call**. Neither sends a request on the default image, `boomerangio/task-flow:3.3.0`. | Call with `curl --fail` in **Execute Shell**. See [Known issues](./known-issues#the-http-call-tasks-do-nothing). |
| An old task revision | Send Email with Sendgrid 1 or 2, Find Repositories in Org 1, or Run Python Script 1 | Upgrade the node. See [Known issues](./known-issues#some-older-task-revisions-do-nothing). |
| **Run Workflow** didn't wait | **Wait for the child run to finish** is off | Turn it on, or check the child run. |
| An optional download found nothing | **Download Artifact** set `found` to `false` | Check the artifact's name and scope. |

## A run is stuck waiting

The run stays **Running**, **Waiting** or **Ready**, and nothing moves.

| Cause | How to tell | Fix |
| --- | --- | --- |
| An approval or manual task | A task is **Waiting**, and the action is on **Actions**. An approval may show "1/2 approvals" or name an approver group. | An owner or editor, in the group if one is named, answers it on **Actions**, **Home** or the run page. |
| A Wait For Event task | It waits for a callback with its **Topic** | Send `POST /api/v2/callback` with that `topic` and `status` `succeeded` or `failed`, in lowercase. |
| A lock or a child run | **Acquire Lock** waits for another run to release the lock; **Run Workflow** waits for its child while **Wait for the child run to finish** is on | Find the run holding the lock, or check the child. |
| The run is paused | A **Paused** tag | Select **Resume run**. |

A run **Waiting** before any task starts is held by its [concurrency limit](#a-run-didnt-start). See [Actions](../fundamentals/actions).

## A webhook or event didn't start a run

The sender got an error, or a success and no run.

| Cause | How to tell | Fix |
| --- | --- | --- |
| The trigger is off, or an Events filter didn't match | `400 WORKFLOWRUN_TRIGGER_DISABLED` | Turn on **Webhook** or **Events**, create a new version, and check each filter row. An **in** row [never matches](./known-issues#the-events-triggers-in-operation-never-matches). |
| A token problem | `401` for no token or one Flow refuses; `403` for a token without `webhook/action` | Send a token with `webhook/action`, as `Authorization: Bearer` or `access_token`. |
| The `ref` names no workflow the token can reach | `404 WORKFLOW_INVALID_REFERENCE`: "Invalid Workflow reference has been provided." | Send `workspace`, and the workflow's name as `ref`. |
| A GitHub delivery is refused | GitHub's delivery log shows `401` | Ask an admin to set **GitHub Webhook Secret** to the GitHub App's secret. |

See [Triggers](../fundamentals/triggers).

## Sign-in fails

For operators. The webapp shows **Sign-in didn't complete**, or the activation screen refuses the code.

| Cause | How to tell | Fix |
| --- | --- | --- |
| **Auto-Create Users** is off | **Sign-in didn't complete** with `403 AUTH_USER_NOT_ADMITTED`: "You are not a user of this Flow install, and it does not create users at first sign-in. Ask an admin to add you to a workspace." | Add the person by email in **Manage workspace › Members › Add members**, or turn the setting on in **Admin › Settings › Features**. |
| A wrong activation code | "The activation code is not correct." (`AUTH_ACTIVATION_CODE_INVALID`) | Enter the value of `FLOW_ACTIVATION_CODE`. |
| No activation code is set | The activation screen refuses every code | Set `FLOW_ACTIVATION_CODE`, at least 32 characters, and restart service-core. |

See [Sign-in and the first admin](../hosting/sign-in).

## Live logs are empty

For operators. A running task's **View Log** shows a message instead.

| Cause | How to tell | Fix |
| --- | --- | --- |
| No live log route | "No log is available for this task: no stored log was uploaded, and its dispatcher registered no live log route." | Set `FLOW_DISPATCHER_LOGS_URL` on the dispatcher and restart it. |
| Core can't reach the dispatcher | "The live log cannot be read: the dispatcher running this task could not be reached or refused the read. …" | Check the registered address from core's pod. |
| Loki labels aren't mapped | "Unable to retrieve logs. This could be due to data retention policy, activity cleanup, or unavailable in log store." | [Map the pod labels](../hosting/task-logs#map-the-pod-labels-in-your-log-shipper) in your log shipper. |

Behind a proxy, Loki reads also fail: see [Known issues](./known-issues#loki-task-logs-ignore-the-http-client-settings). See [Task logs](../hosting/task-logs).

## Next steps

- [Known issues](./known-issues): defects in 5.0.0 and their workarounds.
- [Frequently asked questions](./faq): timings, limits and retention.
- [Runs](../fundamentals/runs): statuses, retries and timeouts.
