---
title: Workspace Management
---

# Workspace Management

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Create new workspace**](#create-new-workspace) | POST | `/api/v2/workspace` |
| [**Delete Approver Groups**](#delete-approver-groups) | DELETE | `/api/v2/workspace/{workspace}/approvers` |
| [**Delete Workspace Parameter**](#delete-workspace-parameter) | DELETE | `/api/v2/workspace/{workspace}/parameters/{name}` |
| [**Delete Workspace**](#delete-workspace) | DELETE | `/api/v2/workspace/{workspace}` |
| [**Retrieve Default Workspace Quota**](#retrieve-default-workspace-quota) | GET | `/api/v2/workspace/quotas/default` |
| [**Retrieve Workspace Roles**](#retrieve-workspace-roles) | GET | `/api/v2/workspace/roles` |
| [**Get workspace**](#get-workspace) | GET | `/api/v2/workspace/{workspace}` |
| [**Search for Workspaces**](#search-for-workspaces) | GET | `/api/v2/workspace/query` |
| [**Leave Workspace**](#leave-workspace) | DELETE | `/api/v2/workspace/{workspace}/leave` |
| [**Remove Workspace Members**](#remove-workspace-members) | DELETE | `/api/v2/workspace/{workspace}/members` |
| [**Reset Workspace Quota**](#reset-workspace-quota) | DELETE | `/api/v2/workspace/{workspace}/quotas` |
| [**Patch or update a workspace**](#patch-or-update-a-workspace) | PATCH | `/api/v2/workspace/{workspace}` |
| [**Validate workspace name and check uniqueness.**](#validate-workspace-name-and-check-uniqueness) | POST | `/api/v2/workspace/validate-name` |



## Create new workspace

`POST /api/v2/workspace`

Requires the `workspace/write` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkspaceRequest**](./models/WorkspaceRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**Workspace**](./models/Workspace)


## Delete Approver Groups

`DELETE /api/v2/workspace/{workspace}/approvers`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. | Defaults to null. | workspace_example |


#### Request body
| Schema | Required |
| ------ | -------- |
| **List** of **String** | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

No response body


## Delete Workspace Parameter

`DELETE /api/v2/workspace/{workspace}/parameters/{name}`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. | Defaults to null. | workspace_example |
| **name** | **String** | true |  | Defaults to null. | name_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Delete Workspace

`DELETE /api/v2/workspace/{workspace}`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | ID of Workspace | Defaults to null. | workspace_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Retrieve Default Workspace Quota

`GET /api/v2/workspace/quotas/default`

Requires the `workspace/read` permission, from a session, user, key, global token.

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

[**Quotas**](./models/Quotas)


## Retrieve Workspace Roles

`GET /api/v2/workspace/roles`

Requires the `workspace/read` permission, from a session, user, key, global token.

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

**List** of [**Role**](./models/Role)


## Get workspace

`GET /api/v2/workspace/{workspace}`

Requires the `workspace/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. | Defaults to null. | my-amazing-workspace |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Workspace**](./models/Workspace)


## Search for Workspaces

`GET /api/v2/workspace/query`

Requires the `workspace/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10 |
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0 |
| **search** | **String** | false | Free-text search on Workspace name and displayName (prefix match, case-insensitive). | Defaults to null. | search_example |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,inactive |
| **workspaces** | **List** of **String** | false | List of Workspace names to filter for. | Defaults to null. | my-amazing-workspace,boomerangs-return |
| **externalRef** | **String** | false | The one workspace carrying this external reference. | Defaults to null. | externalRef_example |
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

[**PageWorkspace**](./models/PageWorkspace)


## Leave Workspace

`DELETE /api/v2/workspace/{workspace}/leave`

Requires the `workspace/read` permission, from a user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. | Defaults to null. | workspace_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Remove Workspace Members

`DELETE /api/v2/workspace/{workspace}/members`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. | Defaults to null. | my-amazing-workspace |


#### Request body
| Schema | Required |
| ------ | -------- |
| **List** of [**WorkspaceMember**](./models/WorkspaceMember) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

No response body


## Reset Workspace Quota

`DELETE /api/v2/workspace/{workspace}/quotas`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. | Defaults to null. | workspace_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Patch or update a workspace

`PATCH /api/v2/workspace/{workspace}`

Requires the `workspace/write` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | ID of Workspace | Defaults to null. | workspace_example |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkspaceRequest**](./models/WorkspaceRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**Workspace**](./models/Workspace)


## Validate workspace name and check uniqueness.

`POST /api/v2/workspace/validate-name`

Requires the `workspace/read` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkspaceNameCheckRequest**](./models/WorkspaceNameCheckRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

**Object**

