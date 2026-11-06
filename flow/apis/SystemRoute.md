---
title: System
description: "Operations for System: Register the instance, retrieve context and navigation, and manage global admin areas."
verified: "5.0.0-beta.39"
---

# System

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Retrieve Boomerang Flow Settings**](#retrieve-boomerang-flow-settings) | GET | `/api/v2/settings` |
| [**Retrieve feature flags.**](#retrieve-feature-flags) | GET | `/api/v2/features` |
| [**Retrieve this instances context, features, and navigation.**](#retrieve-this-instances-context-features-and-navigation) | GET | `/api/v2/context` |
| [**Retrieve navigation.**](#retrieve-navigation) | GET | `/api/v2/navigation` |
| [**Update Boomerang Flow Settings**](#update-boomerang-flow-settings) | PATCH | `/api/v2/settings` |
| [**List outbox rows, dead ones by default.**](#list-outbox-rows-dead-ones-by-default) | GET | `/api/v2/system/outbox` |
| [**Register and activate an installation of Flow**](#register-and-activate-an-installation-of-flow) | PUT | `/api/v2/activate` |
| [**Replay outbox rows**](#replay-outbox-rows) | PUT | `/api/v2/system/outbox/replay` |



## Retrieve Boomerang Flow Settings

`GET /api/v2/settings`

Requires the `system/read` permission, from a session, user, global token.

#### Request parameters
This endpoint does not need any parameter.


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**Setting**](./models/Setting)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/settings" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/settings -->
<!-- api-examples:end -->


## Retrieve feature flags.

`GET /api/v2/features`

Requires the `system/read` permission, from a session, user, global token.

#### Request parameters
This endpoint does not need any parameter.


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Features**](./models/Features)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/features" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/features -->
<!-- api-examples:end -->


## Retrieve this instances context, features, and navigation.

`GET /api/v2/context`

Requires the `system/read` permission, from a session, user, global token.

#### Request parameters
This endpoint does not need any parameter.


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**HeaderNavigationResponse**](./models/HeaderNavigationResponse)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/context" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/context -->
<!-- api-examples:end -->


## Retrieve navigation.

`GET /api/v2/navigation`

Requires the `system/read` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | false | Workspace as owner reference |  | `my-amazing-workspace` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**Navigation**](./models/Navigation)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/navigation" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/navigation -->
<!-- api-examples:end -->


## Update Boomerang Flow Settings

`PATCH /api/v2/settings`

A merge patch of {"<group>": {"<key>": value}}: an absent entry is unchanged, null clears it, any other value replaces it. A secured entry sent as ***** keeps the stored value. An unknown group or key refuses the whole patch.

Requires the `system/write` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**JsonNode**](./models/JsonNode) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json, application/merge-patch+json`
- **Accept**: `*/*`

#### Response

**List** of [**Setting**](./models/Setting)

#### Example request

```bash
curl -X PATCH "$FLOW_URL/api/v2/settings" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start PATCH /api/v2/settings -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "artifacts": {
    "retention.default.days": "14"
  }
}
```

<!-- api-examples:end -->


## List outbox rows, dead ones by default.

`GET /api/v2/system/outbox`

A row that failed delivery carries lastError, the most recent failure; a dead row also carries deadAt, when it gave up. Rows that died before these were recorded carry neither.

Requires the `system/read` permission, from a global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **status** | **String** | false | Delivery status to list | Defaults to `dead`. Enum: [pending, sent, dead] | `dead` |
| **page** | **Integer** | false | Page Number | Defaults to `0`. | `0` |
| **limit** | **Integer** | false | Result Size | Defaults to `100`. | `100` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageEventOutboxEntity**](./models/PageEventOutboxEntity)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/system/outbox" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/system/outbox -->
<!-- api-examples:end -->


## Register and activate an installation of Flow

`PUT /api/v2/activate`

Requires the `system/action` permission, from a session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**OneTimeCode**](./models/OneTimeCode) | false |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

**Boolean**

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/activate" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start PUT /api/v2/activate -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "otc": "<activation code, 32 or more characters>"
}
```

<!-- api-examples:end -->


## Replay outbox rows

`PUT /api/v2/system/outbox/replay`

Puts rows back in the queue for the next dispatcher pass. Replays the named ids, or every row in the given status when no ids are supplied.

Requires the `system/write` permission, from a global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **ids** | **List** of **String** | false | Outbox row ids to replay |  |  |
| **status** | **String** | false | Replay every row in this status | Defaults to `dead`. Enum: [pending, sent, dead] | `dead` |
| **olderThan** | **Long** | false | Only replay rows that occurred before this epoch millisecond |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**OutboxReplayResponse**](./models/OutboxReplayResponse)

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/system/outbox/replay" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start PUT /api/v2/system/outbox/replay -->
<!-- api-examples:end -->

