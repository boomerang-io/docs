---
title: Token Management
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


## Delete Token

`DELETE /api/v2/token/{id}`

Requires the `token/delete` permission, from a global, user, key, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **id** | **String** | true | ID of the Token | Defaults to null. | id_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Object**


## Retrieve the permission catalog for building a Token

`GET /api/v2/token/catalog`

Returns the resources, actions, and role presets the requesting caller could actually grant for the given scope/principal - sourced from the same catalog the enforcement path reads.

Requires the `token/read` permission, from a global, user, key, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **scope** | **String** | true | global or workspace | Defaults to null. Enum: [global, workspace, user] | scope_example |
| **principal** | **String** | false | Workspace ref. Required when scope&#x3D;workspace. | Defaults to null. | principal_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**TokenPermissionCatalog**](./models/TokenPermissionCatalog)


## Search for Tokens

`GET /api/v2/token/query`

Requires the `token/read` permission, from a global, user, key, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10 |
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0 |
| **order** | **String** | true | Ascending (ASC) or Descending (DESC) sort order on creationDate | Defaults to ASC. Enum: [ASC, DESC] | ASC |
| **types** | **List** of **String** | false | List of types to filter for. Defaults to all. | Defaults to null. Enum: [session, user, key, global] |  |
| **principals** | **List** of **String** | false | List of principals to filter for. Based on the types you are querying for. | Defaults to null. |  |
| **sort** | **String** | false | The element to sort onr | Defaults to creationDate. | 0 |
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch | Defaults to null. | 1677589200000 |
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch | Defaults to null. | 1680267600000 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageToken**](./models/PageToken)

