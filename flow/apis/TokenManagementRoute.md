---
title: Token Management
description: "Operations for Token Management: Create and retrieve Tokens."
verified: "5.0.0-beta.39"
---

# Token Management

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Create Token**](#create-token) | POST | `/api/v2/token` |
| [**Delete Token**](#delete-token) | DELETE | `/api/v2/token/{id}` |
| [**Retrieve the permission catalog for building a Token**](#retrieve-the-permission-catalog-for-building-a-token) | GET | `/api/v2/token/catalog` |
| [**Search for Tokens**](#search-for-tokens) | GET | `/api/v2/token/query` |



## Create Token

`POST /api/v2/token`

Requires the `token/write` permission, from a global, user, key, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**TokenCreateRequest**](./models/TokenCreateRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**TokenCreateResponse**](./models/TokenCreateResponse)

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/token" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/token -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "type": "key",
  "name": "docs-api-check",
  "description": "Reads runs for the API docs check.",
  "principal": "6aecf3e3755e5fc7e99bea30",
  "permissions": [
    "workspace/read",
    "workflow/read",
    "workflowrun/read",
    "taskrun/read",
    "schedule/read"
  ]
}
```

#### Example response

`200 OK`:

```json
{
  "actorKind": null,
  "expirationDate": null,
  "id": "6aed2289739ea20d87d5b9b1",
  "token": "bfk_<redacted>",
  "type": "key"
}
```

<!-- api-examples:end -->


## Delete Token

`DELETE /api/v2/token/{id}`

Requires the `token/delete` permission, from a global, user, key, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **id** | **String** | true | ID of the Token |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Object**

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/token/$TOKEN_ID" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/token/{id} -->
#### Example response

`200 OK`, with no body.

<!-- api-examples:end -->


## Retrieve the permission catalog for building a Token

`GET /api/v2/token/catalog`

Returns the resources, actions, and role presets the requesting caller could actually grant for the given scope/principal - sourced from the same catalog the enforcement path reads.

Requires the `token/read` permission, from a global, user, key, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **scope** | **String** | true | global or workspace |  Enum: [global, workspace, user] |  |
| **principal** | **String** | false | Workspace ref. Required when scope&#x3D;workspace. |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**TokenPermissionCatalog**](./models/TokenPermissionCatalog)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/token/catalog?scope=global" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/token/catalog -->
<!-- api-examples:end -->


## Search for Tokens

`GET /api/v2/token/query`

Requires the `token/read` permission, from a global, user, key, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **limit** | **Integer** | true | Result Size |  | `10` |
| **page** | **Integer** | true | Page Number | Defaults to `0`. | `0` |
| **order** | **String** | true | Ascending (ASC) or Descending (DESC) sort order on creationDate | Defaults to `ASC`. Enum: [ASC, DESC] | `ASC` |
| **types** | **List** of **String** | false | List of types to filter for. Defaults to all. |  Enum: [session, user, key, global] |  |
| **principals** | **List** of **String** | false | List of principals to filter for. Based on the types you are querying for. |  |  |
| **sort** | **String** | false | The element to sort onr | Defaults to `creationDate`. | `0` |
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch |  | `1677589200000` |
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch |  | `1680267600000` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageToken**](./models/PageToken)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/token/query?limit=10&page=0&order=ASC" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/token/query -->
<!-- api-examples:end -->

