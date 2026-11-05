---
title: Users Route
---

# Users Route

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Update a Boomerang Flow Users details**](#update-a-boomerang-flow-users-details) | PATCH | `/api/v2/user/{userId}` |
| [**Delete a Boomerang Flow user**](#delete-a-boomerang-flow-user) | DELETE | `/api/v2/user/{userId}` |
| [**Get a Users details**](#get-a-users-details) | GET | `/api/v2/user/{userId}` |
| [**Get a Users Workspace memberships**](#get-a-users-workspace-memberships) | GET | `/api/v2/user/{userId}/workspaces` |
| [**Search for Users**](#search-for-users) | GET | `/api/v2/user/query` |



## Update a Boomerang Flow Users details

`PATCH /api/v2/user/{userId}`

Requires the `user/write` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **userId** | **String** | true |  | Defaults to null. | userId_example |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**UserRequest**](./models/UserRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

No response body


## Delete a Boomerang Flow user

`DELETE /api/v2/user/{userId}`

Requires the `user/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **userId** | **String** | true |  | Defaults to null. | userId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Get a Users details

`GET /api/v2/user/{userId}`

Requires the `user/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **userId** | **String** | true |  | Defaults to null. | userId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**User**](./models/User)


## Get a Users Workspace memberships

`GET /api/v2/user/{userId}/workspaces`

Requires the `user/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **userId** | **String** | true |  | Defaults to null. | userId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**WorkspaceSummary**](./models/WorkspaceSummary)


## Search for Users

`GET /api/v2/user/query`

Requires the `user/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10 |
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0 |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. |  |
| **status** | **List** of **String** | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,inactive |
| **ids** | **List** of **String** | false | List of ids to filter for. | Defaults to null. |  |
| **order** | **String** | false | Ascending or Descending (default) order | Defaults to DESC. Enum: [ASC, DESC] | 0 |
| **sort** | **String** | false | The element to sort on | Defaults to name. | 0 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageUser**](./models/PageUser)

