---
title: Workspace Management
description: "Operations for Workspace Management: Manage Workspaces, Workspace Members, Quotas, ApprovalGroups and Parameters."
verified: "5.0.0-beta.39"
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

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/workspace" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/workspace -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "name": "my-workspace",
  "displayName": "My workspace"
}
```

<!-- api-examples:end -->


## Delete Approver Groups

`DELETE /api/v2/workspace/{workspace}/approvers`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. |  |  |


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

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/approvers" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/approvers -->
#### Example request body

The request sends this as `body.json`:

```json
[
  "<approver group id>"
]
```

<!-- api-examples:end -->


## Delete Workspace Parameter

`DELETE /api/v2/workspace/{workspace}/parameters/{name}`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. |  |  |
| **name** | **String** | true |  |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/parameters/$PARAMETER" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/parameters/{name} -->
<!-- api-examples:end -->


## Delete Workspace

`DELETE /api/v2/workspace/{workspace}`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | ID of Workspace |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace} -->
<!-- api-examples:end -->


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

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/quotas/default" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/quotas/default -->
<!-- api-examples:end -->


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

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/roles" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/roles -->
<!-- api-examples:end -->


## Get workspace

`GET /api/v2/workspace/{workspace}`

Requires the `workspace/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. |  | `my-amazing-workspace` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Workspace**](./models/Workspace)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace} -->
#### Example response

`200 OK`:

```json
{
  "approverGroups": [],
  "creationDate": "2026-11-05T21:23:47.310Z",
  "displayName": "Example workspace",
  "externalRef": null,
  "id": "6aecf3e3755e5fc7e99bea30",
  "labels": {},
  "members": [
    {
      "email": "grace.hopper@flow.local",
      "id": "6aecf30e755e5fc7e99bea28",
      "name": "Grace Hopper",
      "role": "owner"
    }
  ],
  "name": "example-workspace",
  "parameters": [
    {
      "description": "The deploy service's API token.",
      "hiddenValue": true,
      "label": "Deploy token",
      "name": "deploy-token",
      "readOnly": false,
      "type": "password",
      "value": "*****"
    }
  ],
  "quotas": {
    "artifactRetentionDays": 30,
    "currentArtifactStorage": 145,
    "currentConcurrentRuns": 3,
    "currentRunAverageDuration": 54060,
    "currentRunTotalDuration": 1135265,
    "currentRuns": 21,
    "currentWorkflowCount": 18,
    "maxArtifactStorage": 5,
    "maxConcurrentRuns": 4,
    "maxWorkflowCount": 20,
    "maxWorkflowRunDuration": 30,
    "maxWorkflowRunMonthly": 100,
    "maxWorkspaceStorage": 2,
    "monthlyResetDate": "2026-12-01T00:00:00.000Z"
  },
  "status": "active",
  "type": null,
  "workflows": []
}
```

<!-- api-examples:end -->


## Search for Workspaces

`GET /api/v2/workspace/query`

Requires the `workspace/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **limit** | **Integer** | true | Result Size |  | `10` |
| **page** | **Integer** | true | Page Number | Defaults to `0`. | `0` |
| **search** | **String** | false | Free-text search on Workspace name and displayName (prefix match, case-insensitive). |  |  |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) |  |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. |  | `active,inactive` |
| **workspaces** | **List** of **String** | false | List of Workspace names to filter for. |  | `my-amazing-workspace,boomerangs-return` |
| **externalRef** | **String** | false | The one workspace carrying this external reference. |  |  |
| **order** | **String** | false | Ascending or Descending (default) order | Defaults to `DESC`. Enum: [ASC, DESC] | `0` |
| **sort** | **String** | false | The element to sort on | Defaults to `name`. | `0` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageWorkspace**](./models/PageWorkspace)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/query?limit=10&page=0" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/query -->
<!-- api-examples:end -->


## Leave Workspace

`DELETE /api/v2/workspace/{workspace}/leave`

Requires the `workspace/read` permission, from a user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/leave" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/leave -->
<!-- api-examples:end -->


## Remove Workspace Members

`DELETE /api/v2/workspace/{workspace}/members`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. |  | `my-amazing-workspace` |


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

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/members" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/members -->
#### Example request body

The request sends this as `body.json`:

```json
[
  {
    "id": "<user id>"
  }
]
```

<!-- api-examples:end -->


## Reset Workspace Quota

`DELETE /api/v2/workspace/{workspace}/quotas`

Requires the `workspace/delete` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Workspace as owner reference. |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/quotas" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/quotas -->
<!-- api-examples:end -->


## Patch or update a workspace

`PATCH /api/v2/workspace/{workspace}`

Requires the `workspace/write` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | ID of Workspace |  |  |


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

#### Example request

```bash
curl -X PATCH "$FLOW_URL/api/v2/workspace/$WORKSPACE" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start PATCH /api/v2/workspace/{workspace} -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "displayName": "Platform workspace"
}
```

<!-- api-examples:end -->


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

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/workspace/validate-name" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/workspace/validate-name -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "name": "my-workspace"
}
```

<!-- api-examples:end -->

