---
title: Workspace Tasks
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
| **name** | **String** | true | Name of Task | Defaults to null. | name_example |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **replace** | **Boolean** | false | Replace existing version | Defaults to false. | true |


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


## Create a new Task Template using Tekton Task YAML

`POST /api/v2/workspace/{workspace}/task`

The name needs to be unique and must only contain alphanumeric and - characeters.

Requires the `task/write` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |


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


## Delete a Workspace Task

`DELETE /api/v2/workspace/{workspace}/task/{name}`

Requires the `task/delete` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Name of Task | Defaults to null. | name_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Retrieve a workspace task as Tekton Task YAML. If no version specified, the latest version is returned.

`GET /api/v2/workspace/{workspace}/task/{name}`

Requires the `task/read` permission, from a global, key, session, user token.

Requires the `task/read` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **name** | **String** | true | Name of Task | Defaults to null. | name_example |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **version** | **Integer** | false | Task Version | Defaults to null. | 56 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Task**](./models/Task)


## Retrieve a workspace task's changelog

`GET /api/v2/workspace/{workspace}/task/{name}/changelog`

Retrieves each versions changelog and returns them all as a list.

Requires the `task/read` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Name of Task | Defaults to null. | name_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**ChangeLogVersion**](./models/ChangeLogVersion)


## Search for Tasks. If workspaces are provided it will query the workspaces. If no workspaces are provided it will query Global Task Templates

`GET /api/v2/workspace/{workspace}/task/query`

Requires the `task/read` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10 |
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0 |
| **sort** | **String** | true | Ascending (ASC) or Descending (DESC) sort on creationDate | Defaults to ASC. Enum: [ASC, DESC] | ASC |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. | Defaults to [active]. | active,inactive |
| **names** | **List** of **String** | false | List of Task Names  to filter for. Defaults to all. | Defaults to null. | switch,event-wait |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**TaskResponsePage**](./models/TaskResponsePage)


## Validate a workspace task's Tekton Task YAML

`POST /api/v2/workspace/{workspace}/task/validate`

Validates the Task YAML as a Tekton Task

Requires the `task/read` permission, from a global, key, session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |


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

