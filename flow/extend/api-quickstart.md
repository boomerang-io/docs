---
title: Make your first API call
order: 1
description: Create a workspace token, list your workspaces, start a workflow run and read its status with Flow's REST API, in about 5 minutes.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->
<!-- Requests and responses were captured from a local stack built at 5.0.0-beta.39-26, on 6 November 2026, with a workspace token that was revoked afterwards. Responses are trimmed, and fields that differ at the tag (the run's trigger, the 403 body) are left out. UI labels are source-verified at the tag (client-web), and Manage workspace, Tokens and Create token were also seen live. -->

# Make your first API call

This quickstart calls Flow's REST API with a workspace token. You list your workspaces, start a workflow run, and read the run until it ends. It's for developers integrating with Flow, and takes about 5 minutes.

## What you'll have at the end

A run you started with `curl`, read back from the API as succeeded:

```json
{
  "id": "6aed1feb739ea20d87d5b99e",
  "workflowName": "hello-flow",
  "status": "succeeded",
  "phase": "completed",
  "duration": 10506
}
```

## Before you start

You need:

- **A running Flow, and core's address.** On the stack from [Try Flow locally](../hosting/quickstart), it's `http://localhost:7700`. On another install, it's the address your front door routes `/api/v2` to.
- **A workspace where you're an owner or editor,** with a workflow that runs. Hello Flow from [Try Flow locally](../hosting/quickstart#run-a-first-workflow) or [Getting started](../introduction/getting-started) works. The examples use the workspace `example-workspace` and the workflow `hello-flow`; use your own names.
- **`curl`.**

## Create a token

A workspace token, which starts `bfk_`, acts on its own workspace and no other.

1. Open your workspace, and select **Manage workspace** in the side nav, then the **Tokens** tab.
2. Select **Create token**.
3. In **Create new token**, enter a **Name**, such as `api-quickstart`. Use lowercase letters, digits and dashes.
4. Leave **Role** at **Editor**. It can read, write and run everything in the workspace, which covers every call on this page.
5. Select **Create**.
6. **Token successfully created** shows the token in **Token**. Select **Copy**, then **Done**.

Flow shows the token only once. If you lose it, delete it and create another.

**Editor** is broad for a quickstart. For a real integration, open **Customise permissions** and keep only what it needs. This page needs `workspace/read`, `workflow/read`, `workflow/action` and `workflowrun/read`.

An admin can create a `global` token in **Admin › Tokens** instead. A global token reaches every workspace, so use a workspace token for anything that works in one. [Machine tokens](../hosting/machine-tokens) covers every token kind.

Set your shell up for the calls below:

```bash
export FLOW_API=http://localhost:7700
export FLOW_TOKEN='bfk_<the token you copied>'
export WORKSPACE=example-workspace
export WORKFLOW=hello-flow
```

## List your workspaces

Send the token in the `Authorization` header:

```bash
curl -s "$FLOW_API/api/v2/workspace/query?limit=10&page=0" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

Flow answers with a page of workspaces (trimmed):

```json
{
  "content": [
    {
      "id": "6aecf3e3755e5fc7e99bea30",
      "name": "example-workspace",
      "displayName": "Example workspace",
      "status": "active"
    }
  ],
  "totalElements": 1
}
```

A workspace token sees only its own workspace, so `content` holds one. `name` is the workspace's identifier in every URL under `/api/v2/workspace/{workspace}/`.

## Start a run

Submit the workflow, and start the run straight away:

```bash
curl -s -X POST "$FLOW_API/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW/submit?start=true" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"trigger": "manual"}'
```

`"trigger": "manual"` makes the run answer to the workflow's **Manual** trigger, as a run from the webapp does. `start=true` is the default. With `start=false`, the run waits at `ready` until you send `PUT /api/v2/workspace/{workspace}/workflowrun/{id}/start`.

Flow answers with the new run (trimmed):

```json
{
  "id": "6aed1feb739ea20d87d5b99e",
  "creationDate": "2026-11-06T00:31:39.357Z",
  "status": "ready",
  "phase": "pending",
  "workflowVersion": 1,
  "initiatedByRef": "api-quickstart"
}
```

Keep the run's `id`:

```bash
export RUN_ID=6aed1feb739ea20d87d5b99e
```

## Read the run's status

```bash
curl -s "$FLOW_API/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID?withTasks=false" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

While its task runs, the run reads (trimmed):

```json
{
  "id": "6aed1feb739ea20d87d5b99e",
  "status": "running",
  "phase": "running"
}
```

Repeat the call until `phase` is `completed`. A run has two fields for where it is:

- **`phase`** is its lifecycle: `queued`, `pending`, `running`, then `completed`.
- **`status`** is its outcome: `ready`, `running` or `waiting` while it's under way, then a final value such as `succeeded`, `failed`, `cancelled` or `timedout`.

Read `status` once `phase` is `completed`. A run's finally tasks can still be running after its `status` is final. [Status and phase](../fundamentals/runs#status-and-phase) lists every value.

`withTasks=false` leaves out the run's task runs. Without it, the response lists each one in `tasks`, with its own `status` and `phase`.

## Verify it worked

The last read shows the run ended successfully, about 10 seconds after it started (trimmed):

```json
{
  "id": "6aed1feb739ea20d87d5b99e",
  "status": "succeeded",
  "phase": "completed",
  "startTime": "2026-11-06T00:31:39.465Z",
  "duration": 10506,
  "workflowName": "hello-flow",
  "workflowDisplayName": "Hello Flow",
  "workflowVersion": 1
}
```

`duration` is in milliseconds. In the webapp, the run is listed in **Activity** with status **Succeeded**.

## Common errors

| Answer | Cause | Fix |
| --- | --- | --- |
| `401` with `AUTH_REQUIRED`: "Authentication is required to access this resource." | No token, a mistyped one, or one that was revoked or has expired | Send `Authorization: Bearer <token>` with the whole token, or create a new one |
| `403`, without a `reason` | The token lacks the route's permission. Each route in the [API reference](../apis/overview) names the one it needs. | Create a token with that permission |
| `429` with `QUOTA_EXCEEDED`, such as "A quota has been exceeded. Concurrent runs (executions): 4 / 4" | The workspace has reached a run quota | Wait for a run to end, or for the monthly count to reset, or ask an admin to raise the quota |
| `400` with `WORKFLOWRUN_TRIGGER_DISABLED`: "The Trigger provided is not enabled for this Workflow." | The workflow's **Manual** trigger is off | Turn it on under **Configure › Triggers** in the workflow editor, then select **Create new version** |

The other errors come back as JSON, with `reason` naming the error (trimmed):

```json
{
  "code": 1003,
  "reason": "AUTH_REQUIRED",
  "message": "Authentication is required to access this resource.",
  "status": "401 UNAUTHORIZED",
  "timestamp": "2026-11-06T00:30:01.266Z"
}
```

[Error codes](../introduction/error-codes) lists every `reason`.

## Clean up

Revoke the token when you've finished with it:

1. In **Manage workspace › Tokens**, select the delete icon at the end of the token's row.
2. In **Are you sure?**, select **Yes**.

Flow confirms with **Token successfully deleted**, and the token answers `401` from then on. With more than one core instance, the others can accept it for up to 60 seconds.

## Next steps

- [API reference](../apis/overview): authentication, errors, paging, and every route and model.
- [Webhooks and Events](../apis/WebhooksAndEventsRoute): start runs from other systems' webhooks and CloudEvents.
- [Embed Flow](./embed-flow): use Flow as the workflow engine inside your own product, with flow-sdk.
- [Machine tokens](../hosting/machine-tokens): token kinds, tokens declared in configuration, and rotation.
