---
title: Tasks
description: "Operations for Tasks: Create and Manage the global Task definitions."
verified: "5.0.0-beta.39"
---

# Tasks

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Update, replace, or create a global task using Tekton Task YAML**](#update-replace-or-create-a-global-task-using-tekton-task-yaml) | PUT | `/api/v2/task/{name}` |
| [**Create a new Task using Tekton Task YAML**](#create-a-new-task-using-tekton-task-yaml) | POST | `/api/v2/task` |
| [**Delete a Task**](#delete-a-task) | DELETE | `/api/v2/task/{name}` |
| [**Retrieve a global task as Tekton Task YAML. If no version specified, the latest version is returned.**](#retrieve-a-global-task-as-tekton-task-yaml-if-no-version-specified-the-latest-version-is-returned) | GET | `/api/v2/task/{name}` |
| [**Retrieve a global task's changelog**](#retrieve-a-global-tasks-changelog) | GET | `/api/v2/task/{name}/changelog` |
| [**Search for Task. If workspaces are provided it will query the workspaces. If no workspaces are provided it will query Global Task Templates**](#search-for-task-if-workspaces-are-provided-it-will-query-the-workspaces-if-no-workspaces-are-provided-it-will-query-global-task-templates) | GET | `/api/v2/task/query` |
| [**Validate a global task's Tekton Task YAML**](#validate-a-global-tasks-tekton-task-yaml) | POST | `/api/v2/task/validate` |



## Update, replace, or create a global task using Tekton Task YAML

`PUT /api/v2/task/{name}`

The name must only contain alphanumeric and - characeters. If the name exists, apply will create a new version.

Requires the `task/write` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **name** | **String** | true | Name of Task |  |  |
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
curl -X PUT "$FLOW_URL/api/v2/task/$TASK" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start PUT /api/v2/task/{name} -->
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


## Create a new Task using Tekton Task YAML

`POST /api/v2/task`

The name needs to be unique and must only contain alphanumeric and - characeters.

Requires the `task/write` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


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
curl -X POST "$FLOW_URL/api/v2/task" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/task -->
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


## Delete a Task

`DELETE /api/v2/task/{name}`

Requires the `task/delete` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
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
curl -X DELETE "$FLOW_URL/api/v2/task/$TASK" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/task/{name} -->
<!-- api-examples:end -->


## Retrieve a global task as Tekton Task YAML. If no version specified, the latest version is returned.

`GET /api/v2/task/{name}`

Requires the `task/read` permission, from a global, user, session token.

Requires the `task/read` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **name** | **String** | true | Name of Task |  |  |
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
curl -X GET "$FLOW_URL/api/v2/task/$TASK" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/task/{name} -->
<!-- api-examples:end -->


## Retrieve a global task's changelog

`GET /api/v2/task/{name}/changelog`

Retrieves each versions changelog and returns them all as a list.

Requires the `task/read` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
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
curl -X GET "$FLOW_URL/api/v2/task/$TASK/changelog" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/task/{name}/changelog -->
<!-- api-examples:end -->


## Search for Task. If workspaces are provided it will query the workspaces. If no workspaces are provided it will query Global Task Templates

`GET /api/v2/task/query`

Requires the `task/read` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
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
curl -X GET "$FLOW_URL/api/v2/task/query?limit=10&page=0&sort=ASC" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/task/query -->
<!-- api-examples:end -->


## Validate a global task's Tekton Task YAML

`POST /api/v2/task/validate`

Validates the Task YAML as a Tekton Task

Requires the `task/read` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


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
curl -X POST "$FLOW_URL/api/v2/task/validate" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/x-yaml" \
  --data-binary @task.yaml
```

<!-- api-examples:start POST /api/v2/task/validate -->
<!-- api-examples:end -->

