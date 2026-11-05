---
title: Webhooks and events
order: 2
description: The routes that start and resume runs from other systems, and the CloudEvents Flow sends when a run's status changes.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Webhooks and events

Other systems reach Flow over HTTP: a webhook or a CloudEvent starts a workflow run, and a callback resumes a waiting one. Flow in turn posts a CloudEvent each time a run or task run changes status. There's no message broker: every event is an HTTP request. This page is for integrators; [Triggers](../fundamentals/triggers) covers switching triggers on in a workflow.

![Inbound, a sender posts to /api/v2/webhook, /api/v2/event or /api/v2/callback to start or resume a run, GitHub posts signed deliveries to /api/v2/webhook, and Slack posts signed requests to /api/v2/integration/slack/*. Outbound, each status change writes a row to the outbox in MongoDB, which every core instance drains every 5 seconds to post CloudEvents to the sinks](./assets/flow-webhooks-and-events.svg)

Requests come in from the left and start or resume a run in core; each status change of that run then goes down into the MongoDB outbox and back up through the outbox drain, which posts it to your sinks as a CloudEvent.

## Which routes accept inbound calls?

| Route | Does | Answers |
| --- | --- | --- |
| `POST /api/v2/webhook` | Starts a run, with the JSON body as its `data` parameter | `200`, no body |
| `POST /api/v2/event` | Starts a run from a CloudEvent | `200`, with the new run |
| `POST` or `GET /api/v2/callback` | Ends a run's waiting Wait For Event tasks | `200`, no body |

Each route needs a token with the `webhook/action` permission, such as a workflow token. Send it as `Authorization: Bearer <token>`, as an `x-access-token` header or, for a sender that can't set headers, as the `access_token` query parameter; proxies and access logs record URLs, so prefer a header. A refused request creates no run.

A triggered run counts against the workspace's quotas, and is refused with `WORKFLOWRUN_TRIGGER_DISABLED` while the workflow's matching trigger is off. It starts at once unless an operator sets `flow.workflowrun.auto-start-on-submit=false`, which parks runs without a run workspace until they're started through the API.

## Start a run from a webhook

```http
POST /api/v2/webhook?workspace=<workspace>&ref=<workflow name>
Content-Type: application/json
```

With `workspace`, `ref` is the workflow's name in that workspace; `ref` alone is its ID. The JSON body becomes the run's `data` parameter, read as `$(params.data.<field>)`. The route answers `200` with no body, so find the run on the **Activity** page or through the API. No `ref` answers `400`, and a workflow the caller can't reach `404 WORKFLOW_INVALID_REFERENCE`.

## Start a run from a CloudEvent

`POST /api/v2/event` takes a [CloudEvents](https://cloudevents.io) 1.0 event in structured mode (`Content-Type: application/cloudevents+json`, attributes in the body) or binary mode (attributes in `ce-*` headers, the body as the data). The workflow is named by `ref`, read as with the webhook. Without `ref`, the first segment of the event's `subject` names it, as a name with `workspace` and an ID without, so `/deploy-service/image-pushed` names `deploy-service`. With neither, the route answers `400 WORKFLOW_INVALID_REQ`.

The run gets two parameters:
- `event`: the event's attributes and extensions (`type`, `source`, `id`, `subject` and so on), as the CloudEvents JSON format writes them;
- `data`: the event's data. JSON arrives as sent, `text/*` data as a string, and anything else as base64 text. An event without data gives no `data` parameter.

The workflow's event trigger filters are paths into the event as sent, such as `type` or `data.tag`. For example:

```bash
curl -X POST "https://flow.example.com/api/v2/event?workspace=payments" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/cloudevents+json" \
  -d '{"specversion": "1.0", "id": "e-1042", "source": "/registry",
       "type": "com.example.image.pushed", "subject": "/deploy-service/image-pushed",
       "datacontenttype": "application/json", "data": {"tag": "4f2a9c1"}}'
```

The new run of `deploy-service` reads `$(params.data.tag)` as `4f2a9c1` and `$(params.event.type)` as `com.example.image.pushed`.

## Resume a Wait For Event task

```http
POST /api/v2/callback?ref=<run id>&topic=<topic>&status=succeeded&eventId=<id>
```

The callback ends every Wait For Event task in the run whose topic matches.
- `status` is `succeeded`, the default, or `failed`, in any case. Anything else answers `400 QUERY_INVALID_FILTERS`.
- A JSON body becomes each task's `data` result. `GET` takes no body, so a link in an email can resume a run.
- A repeat with the same `eventId` for the same run within 7 days is acknowledged and not applied. Without `eventId`, every delivery is applied, so a sender that retries should set one.
- A callback that arrives before its task waits is recorded and applied when it does. An unknown run answers `404 WORKFLOWRUN_INVALID_REFERENCE`.

## How are GitHub and Slack verified?

- **GitHub** App deliveries arrive at `POST /api/v2/webhook` with an `X-GitHub-Event` header. Like any webhook, a delivery needs a token, so the App's webhook URL carries one in `access_token`. Each delivery must also carry `X-Hub-Signature-256`, signed with the **GitHub Webhook Secret** setting. An unsigned or wrongly signed delivery, or any delivery while the secret is unset, answers `401` and starts nothing. The installation named in the delivery picks the workspace.
- **Slack** sends commands, interactions and events to Flow's own routes under `/api/v2/integration/slack/`, with no Flow token. Each request must be signed with the **Slack Signing Secret** and be at most 5 minutes old; while the secret is unset, every request is refused.

[Integrations](../hosting/integrations) covers setting up both apps.

## Send status events out

With `flow.events.sink.enabled=true` (off by default), core posts a structured CloudEvent 1.0 to each configured sink whenever a run or task run changes status. [Send status events and traces](../hosting/configuring#send-status-events-and-traces) covers the sinks and their filters.

| Attribute | Value |
| --- | --- |
| `type` | `io.boomerang.event.status.workflowrun` or `io.boomerang.event.status.taskrun` |
| `source` | `/apis/v1/events` |
| `subject` | `/workflowrun/<id>/status/<status>` or `/taskrun/<id>/status/<status>` |
| `id` | The same on every delivery of one status change; not a run ID |
| `time` | When the change happened, not when it was sent |
| `initiatorcontext` | Task events only: the run's `initiatorContext` label, when set |

The graph's start and end nodes send no events. `flow.events.sink.payload` sets what `data` holds, for every sink:
- `thin`, the default: `id`, `workflowRef`, `workflowRunRef` (task events), `status`, `statusReason`, `phase`, `labels`, `creationDate`, `startTime` and `duration`. Read parameters and results back through the API.
- `full`: the whole run or task run, with secured values shown as `*****` and scrubbed from results, the status message and annotations.

The subject, `data.status` and `data.phase` are the change the event records; the rest of `data` is the run as it stood when the event was sent.

### How is delivery guaranteed?

Each status change writes a row to an outbox in MongoDB, which every core instance drains every 5 seconds. Delivery is at least once:
- A failed delivery, any non-2xx answer included, is retried after about 20 seconds, then 40. After 3 failed attempts the row is marked dead.
- A repeated `id` is a duplicate: drop it. Events can arrive out of order, so order them by `time`.
- A crash between a status change and its outbox row loses that one event. A lost event never stalls a run.
- Sent rows are deleted after 7 days.

`GET /api/v2/system/outbox` lists rows by `status` (`pending`, `sent` or `dead`, dead by default), each failed row with its `lastError`. `PUT /api/v2/system/outbox/replay` requeues the rows named in `ids`, or every row in a `status`, with a fresh retry budget. Both need a global token with the `system` permission, not a signed-in session: see [Machine tokens](../hosting/machine-tokens).

```bash
curl -X PUT "https://flow.example.com/api/v2/system/outbox/replay?status=dead" \
  -H "Authorization: Bearer $FLOW_GLOBAL_TOKEN"
```

The answer counts the rows requeued, such as `{"replayed": 3}`.

## Next steps

- [Triggers](../fundamentals/triggers): switch a workflow's webhook, event and GitHub triggers on.
- [Webhooks and events routes](../apis/WebhooksAndEventsRoute) and [System routes](../apis/SystemRoute): the API reference.
- [Security](./security): tokens and permissions.
