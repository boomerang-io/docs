---
title: Triggers
order: 7
---

# Triggers & Integrations

Workflows can be triggered in the following ways and these can be configured in the Workflow Editor via the **Configure** tab and selecting **Triggers**.

- Manual: allows a workflow to be triggered from the Workflows page.
- Scheduler: allows a workflow to be triggered by the Schedules defined on the Schedules tab of the Workflow.
- Webhook: a simple and common API driven integration method.
- Events: a CloudEvent based trigger.
- GitHub (_beta_): a GitHub based trigger that allows you to trigger a workflow when a commit is made to a specific branch of a repository.

![Configure Triggers](./assets/img/workflow-triggers.png)

## Manual

Determines whether you can manually trigger the Workflow through the UI or API.

## Scheduling

Workflows can be used executed on a schedule. See [Getting To Know Schedules](../fundamentals/schedules) for more detailed information.

## Webhook

Enable the Webhook trigger, then click the **View Usage Example** link. This will open a modal with endpoint you need to use to trigger the Workflow.

![Webhook Triggers](./assets/img/workflow-triggers-webhook.png)

### Triggering Workflow

**Request**

POST `/api/v2/trigger/webhook?workflow={workflow_id}&access_token={token}`

```json
{}
```

**Response**

After the submission, you will receive the Workflow Run payload which contains the run ID. This can be used to request the status of the Workflow Run via the API.

```json
{
  "id": "5de81b5fe638b70001fa9d09"
}
```

### Execution Status

**Request**

GET `/api/v2/team/{team}/workflowrun/{workflow_run_id}?access_token={token}`

**Response**

The response for execution status will contain the overall execution status and breakdown of individual Tasks, including the output properties of each Task if they exist.

## Events

See the [eventing architecture](../architecture/eventing) for more information.
