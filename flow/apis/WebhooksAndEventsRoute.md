---
title: Webhooks and Events Route
---

# Webhooks and Events Route

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
| **workspace** | **String** | false | The workspace whose workflow ref names | Defaults to null. | workspace_example |
| **ref** | **String** | false | The workflow: its id, or with workspace its name | Defaults to null. | ref_example |


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


## Accept Wait for Event Callbcak

`GET /api/v2/callback`

Requires the `webhook/action` permission, from a session, user, global, key token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **ref** | **String** | true | The WorkflowRun reference the request relates to | Defaults to null. | ref_example |
| **topic** | **String** | true | The topic to publish to | Defaults to null. | topic_example |
| **status** | **String** | false | The status to set for the WaitForEvent TaskRun. Succeeded | Failed. | Defaults to succeeded. | status_example |
| **eventId** | **String** | false | Identifies this delivery. A repeat with the same eventId for the same run is acknowledged and not applied again, for 7 days. | Defaults to null. | eventId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [access_token](./overview#access_token), [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Accept Wait for Event Callback with JSON Payload

`POST /api/v2/callback`

Requires the `webhook/action` permission, from a session, user, global, key token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **ref** | **String** | true | The WorkflowRun reference the request relates to | Defaults to null. | ref_example |
| **topic** | **String** | true | The topic to publish to | Defaults to null. | topic_example |
| **status** | **String** | false | The status to set for the WaitForEvent TaskRun. Succeeded | Failed. | Defaults to succeeded. | status_example |
| **eventId** | **String** | false | Identifies this delivery. A repeat with the same eventId for the same run is acknowledged and not applied again, for 7 days. | Defaults to null. | eventId_example |


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


## Accept Webhook payloads from various sources.

`POST /api/v2/webhook`

Requires the `webhook/action` permission, from a session, user, global, key token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | false | The workspace whose workflow ref names | Defaults to null. | workspace_example |
| **ref** | **String** | false | The workflow: its id, or with workspace its name | Defaults to null. | ref_example |
| **X-GitHub-Event** | **String** | false |  | Defaults to null. | X-GitHub-Event_example |
| **X-GitHub-Delivery** | **String** | false |  | Defaults to null. | X-GitHub-Delivery_example |
| **X-Hub-Signature-256** | **String** | false |  | Defaults to null. | X-Hub-Signature-256_example |
| **x-slack-signature** | **String** | false |  | Defaults to null. | x-slack-signature_example |


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

