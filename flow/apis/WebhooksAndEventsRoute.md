---
title: Webhooks and Events
description: "Operations for Webhooks and Events: Listen for Events or Webhook requests to trigger Workflows and provide the ability to resolve Wait For Event TaskRuns."
verified: "5.0.0-beta.39"
---

# Webhooks and Events

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Accept CloudEvent**](#accept-cloudevent) | POST | `/api/v2/event` |
| [**Accept Wait for Event Callbcak**](#accept-wait-for-event-callbcak) | GET | `/api/v2/callback` |
| [**Accept Wait for Event Callback with JSON Payload**](#accept-wait-for-event-callback-with-json-payload) | POST | `/api/v2/callback` |
| [**Accept Webhook payloads from various sources.**](#accept-webhook-payloads-from-various-sources) | POST | `/api/v2/webhook` |



## Accept CloudEvent

`POST /api/v2/event`

Requires the `webhook/action` permission, from a session, user, global, key token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | false | The workspace whose workflow ref names |  |  |
| **ref** | **String** | false | The workflow: its id, or with workspace its name |  |  |


#### Request body
| Schema | Required |
| ------ | -------- |
| **byte[]** | false |


#### Authorization

One of [access_token](./overview#access_token), [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

**Object**

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/event?workspace=$WORKSPACE&ref=$WORKFLOW" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/cloudevents+json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/event -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "specversion": "1.0",
  "id": "build-42",
  "source": "/ci",
  "type": "io.example.build.finished",
  "datacontenttype": "application/json",
  "data": {
    "tag": "1.4.2"
  }
}
```

<!-- api-examples:end -->


## Accept Wait for Event Callbcak

`GET /api/v2/callback`

Requires the `webhook/action` permission, from a session, user, global, key token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **ref** | **String** | true | The WorkflowRun reference the request relates to |  |  |
| **topic** | **String** | true | The topic to publish to |  |  |
| **status** | **String** | false | The status to set for the WaitForEvent TaskRun. Succeeded | Failed. | Defaults to `succeeded`. |  |
| **eventId** | **String** | false | Identifies this delivery. A repeat with the same eventId for the same run is acknowledged and not applied again, for 7 days. |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [access_token](./overview#access_token), [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/callback?ref=$RUN_ID&topic=$TOPIC" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/callback -->
<!-- api-examples:end -->


## Accept Wait for Event Callback with JSON Payload

`POST /api/v2/callback`

Requires the `webhook/action` permission, from a session, user, global, key token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **ref** | **String** | true | The WorkflowRun reference the request relates to |  |  |
| **topic** | **String** | true | The topic to publish to |  |  |
| **status** | **String** | false | The status to set for the WaitForEvent TaskRun. Succeeded | Failed. | Defaults to `succeeded`. |  |
| **eventId** | **String** | false | Identifies this delivery. A repeat with the same eventId for the same run is acknowledged and not applied again, for 7 days. |  |  |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**JsonNode**](./models/JsonNode) | true |


#### Authorization

One of [access_token](./overview#access_token), [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json; charset=utf-8, application/json;charset=utf-8`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/callback?ref=$RUN_ID&topic=$TOPIC" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/callback -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "approved": true
}
```

<!-- api-examples:end -->


## Accept Webhook payloads from various sources.

`POST /api/v2/webhook`

Requires the `webhook/action` permission, from a session, user, global, key token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | false | The workspace whose workflow ref names |  |  |
| **ref** | **String** | false | The workflow: its id, or with workspace its name |  |  |
| **X-GitHub-Event** | **String** | false |  |  |  |
| **X-GitHub-Delivery** | **String** | false |  |  |  |
| **X-Hub-Signature-256** | **String** | false |  |  |  |
| **x-slack-signature** | **String** | false |  |  |  |


#### Request body
| Schema | Required |
| ------ | -------- |
| **String** | true |


#### Authorization

One of [access_token](./overview#access_token), [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json; charset=utf-8, application/json;charset=utf-8`
- **Accept**: `*/*`

#### Response

**Object**

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/webhook?workspace=$WORKSPACE&ref=$WORKFLOW" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/webhook -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "tag": "1.4.2"
}
```

<!-- api-examples:end -->

