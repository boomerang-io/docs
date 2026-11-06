---
title: Workspace Tasks
description: "Operations for Workspace Tasks: Create and manage the workspace based Task definitions."
verified: "5.0.0-beta.39"
---

# Workspace Tasks

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Update, replace, or create a workspace task using Tekton Task YAML**](#update-replace-or-create-a-workspace-task-using-tekton-task-yaml) | PUT | `/api/v2/workspace/{workspace}/task/{name}` |
| [**Create a new Task Template using Tekton Task YAML**](#create-a-new-task-template-using-tekton-task-yaml) | POST | `/api/v2/workspace/{workspace}/task` |
| [**Delete a Workspace Task**](#delete-a-workspace-task) | DELETE | `/api/v2/workspace/{workspace}/task/{name}` |
| [**Retrieve a workspace task as Tekton Task YAML. If no version specified, the latest version is returned.**](#retrieve-a-workspace-task-as-tekton-task-yaml-if-no-version-specified-the-latest-version-is-returned) | GET | `/api/v2/workspace/{workspace}/task/{name}` |
| [**Retrieve a workspace task's changelog**](#retrieve-a-workspace-tasks-changelog) | GET | `/api/v2/workspace/{workspace}/task/{name}/changelog` |
| [**Search for Tasks. If workspaces are provided it will query the workspaces. If no workspaces are provided it will query Global Task Templates**](#search-for-tasks-if-workspaces-are-provided-it-will-query-the-workspaces-if-no-workspaces-are-provided-it-will-query-global-task-templates) | GET | `/api/v2/workspace/{workspace}/task/query` |
| [**Validate a workspace task's Tekton Task YAML**](#validate-a-workspace-tasks-tekton-task-yaml) | POST | `/api/v2/workspace/{workspace}/task/validate` |



## Update, replace, or create a workspace task using Tekton Task YAML

`PUT /api/v2/workspace/{workspace}/task/{name}`

The name must only contain alphanumeric and - characeters. If the name exists, apply will create a new version.

Requires the `task/write` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **name** | **String** | true | Name of Task |  |  |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **replace** | **Boolean** | false | Replace existing version | Defaults to `false`. |  |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**Task**](./models/Task) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json, application/x-yaml`
- **Accept**: `*/*`

#### Response

[**Task**](./models/Task)

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/workspace/$WORKSPACE/task/$TASK" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start PUT /api/v2/workspace/{workspace}/task/{name} -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "name": "hello-world",
  "displayName": "Hello world",
  "type": "template",
  "spec": {
    "image": "alpine:3.20",
    "command": [
      "echo"
    ],
    "arguments": [
      "Hello from Flow"
    ]
  }
}
```

<!-- api-examples:end -->


## Create a new Task Template using Tekton Task YAML

`POST /api/v2/workspace/{workspace}/task`

The name needs to be unique and must only contain alphanumeric and - characeters.

Requires the `task/write` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**Task**](./models/Task) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json, application/x-yaml`
- **Accept**: `*/*`

#### Response

[**Task**](./models/Task)

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/workspace/$WORKSPACE/task" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/workspace/{workspace}/task -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "name": "hello-world",
  "displayName": "Hello world",
  "type": "template",
  "spec": {
    "image": "alpine:3.20",
    "command": [
      "echo"
    ],
    "arguments": [
      "Hello from Flow"
    ]
  }
}
```

<!-- api-examples:end -->


## Delete a Workspace Task

`DELETE /api/v2/workspace/{workspace}/task/{name}`

Requires the `task/delete` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Name of Task |  |  |


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
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/task/$TASK" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/task/{name} -->
<!-- api-examples:end -->


## Retrieve a workspace task as Tekton Task YAML. If no version specified, the latest version is returned.

`GET /api/v2/workspace/{workspace}/task/{name}`

Requires the `task/read` permission, from a global, key, session, user token.

Requires the `task/read` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **name** | **String** | true | Name of Task |  |  |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **version** | **Integer** | false | Task Version |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Task**](./models/Task)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/task/$TASK" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/task/{name} -->
<!-- api-examples:end -->


## Retrieve a workspace task's changelog

`GET /api/v2/workspace/{workspace}/task/{name}/changelog`

Retrieves each versions changelog and returns them all as a list.

Requires the `task/read` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Name of Task |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**ChangeLogVersion**](./models/ChangeLogVersion)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/task/$TASK/changelog" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/task/{name}/changelog -->
<!-- api-examples:end -->


## Search for Tasks. If workspaces are provided it will query the workspaces. If no workspaces are provided it will query Global Task Templates

`GET /api/v2/workspace/{workspace}/task/query`

Requires the `task/read` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **limit** | **Integer** | true | Result Size |  | `10` |
| **page** | **Integer** | true | Page Number | Defaults to `0`. | `0` |
| **sort** | **String** | true | Ascending (ASC) or Descending (DESC) sort on creationDate | Defaults to `ASC`. Enum: [ASC, DESC] | `ASC` |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) |  |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. | Defaults to `["active"]`. | `active,inactive` |
| **names** | **List** of **String** | false | List of Task Names  to filter for. Defaults to all. |  | `switch,event-wait` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**TaskResponsePage**](./models/TaskResponsePage)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/task/query?limit=10&page=0&sort=ASC" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/task/query -->
<!-- api-examples:end -->


## Validate a workspace task's Tekton Task YAML

`POST /api/v2/workspace/{workspace}/task/validate`

Validates the Task YAML as a Tekton Task

Requires the `task/read` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**TektonTask**](./models/TektonTask) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/x-yaml`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/workspace/$WORKSPACE/task/validate" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/x-yaml" \
  --data-binary @task.yaml
```

<!-- api-examples:start POST /api/v2/workspace/{workspace}/task/validate -->
<!-- api-examples:end -->

