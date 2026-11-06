---
title: Workflows
description: "Operations for Workflows: Create, list, and manage your Workflows."
verified: "5.0.0-beta.39"
---

# Workflows

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Update, replace, or create new, Workflow for Canvas**](#update-replace-or-create-new-workflow-for-canvas) | PUT | `/api/v2/workspace/{workspace}/workflow/{name}/compose` |
| [**Update, replace, or create new, Workflow**](#update-replace-or-create-new-workflow) | PUT | `/api/v2/workspace/{workspace}/workflow` |
| [**Convert workflow to compose model for UI Designer and detailed Activity screens.**](#convert-workflow-to-compose-model-for-ui-designer-and-detailed-activity-screens) | GET | `/api/v2/workspace/{workspace}/workflow/{name}/compose` |
| [**Create a new workflow**](#create-a-new-workflow) | POST | `/api/v2/workspace/{workspace}/workflow` |
| [**Delete a workflow**](#delete-a-workflow) | DELETE | `/api/v2/workspace/{workspace}/workflow/{name}` |
| [**Duplicates the workflow.**](#duplicates-the-workflow) | POST | `/api/v2/workspace/{workspace}/workflow/{name}/duplicate` |
| [**Export the Workflow as JSON.**](#export-the-workflow-as-json) | GET | `/api/v2/workspace/{workspace}/workflow/{name}/export` |
| [**Retrieve the parameters.**](#retrieve-the-parameters) | GET | `/api/v2/workspace/{workspace}/workflow/{name}/available-parameters` |
| [**Retrieve a workflow's changelog**](#retrieve-a-workflows-changelog) | GET | `/api/v2/workspace/{workspace}/workflow/{name}/changelog` |
| [**Retrieve a Workflow**](#retrieve-a-workflow) | GET | `/api/v2/workspace/{workspace}/workflow/{name}` |
| [**Change what a workflow is**](#change-what-a-workflow-is) | PATCH | `/api/v2/workspace/{workspace}/workflow/{name}` |
| [**Search for Workflows**](#search-for-workflows) | GET | `/api/v2/workspace/{workspace}/workflow/query` |
| [**Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.**](#submit-a-workflow-to-be-run-will-queue-the-workflowrun-ready-for-execution) | POST | `/api/v2/workspace/{workspace}/workflow/{name}/submit` |



## Update, replace, or create new, Workflow for Canvas

`PUT /api/v2/workspace/{workspace}/workflow/{name}/compose`

Requires the `workflow/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Name of the workflow |  |  |
| **replace** | **Boolean** | false | Replace existing version | Defaults to `false`. |  |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkflowCanvas**](./models/WorkflowCanvas) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**WorkflowCanvas**](./models/WorkflowCanvas)

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW/compose" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

<!-- api-examples:start PUT /api/v2/workspace/{workspace}/workflow/{name}/compose -->
<!-- api-examples:end -->


## Update, replace, or create new, Workflow

`PUT /api/v2/workspace/{workspace}/workflow`

Requires the `workflow/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **replace** | **Boolean** | false | Replace existing version | Defaults to `false`. |  |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**Workflow**](./models/Workflow) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

<!-- api-examples:start PUT /api/v2/workspace/{workspace}/workflow -->
<!-- api-examples:end -->


## Convert workflow to compose model for UI Designer and detailed Activity screens.

`GET /api/v2/workspace/{workspace}/workflow/{name}/compose`

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Workflow name |  | `my-amazing-workflow` |
| **version** | **Integer** | false | Workflow Version |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowCanvas**](./models/WorkflowCanvas)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW/compose" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflow/{name}/compose -->
<!-- api-examples:end -->


## Create a new workflow

`POST /api/v2/workspace/{workspace}/workflow`

Requires the `workflow/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**Workflow**](./models/Workflow) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/workspace/{workspace}/workflow -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "name": "my-workflow",
  "displayName": "My workflow"
}
```

<!-- api-examples:end -->


## Delete a workflow

`DELETE /api/v2/workspace/{workspace}/workflow/{name}`

Requires the `workflow/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Workflow name |  | `my-amazing-workflow` |


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
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/workflow/{name} -->
<!-- api-examples:end -->


## Duplicates the workflow.

`POST /api/v2/workspace/{workspace}/workflow/{name}/duplicate`

Requires the `workflow/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Workflow name |  | `my-amazing-workflow` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW/duplicate" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start POST /api/v2/workspace/{workspace}/workflow/{name}/duplicate -->
<!-- api-examples:end -->


## Export the Workflow as JSON.

`GET /api/v2/workspace/{workspace}/workflow/{name}/export`

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Workflow name |  | `my-amazing-workflow` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `application/json`

#### Response

**File**

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW/export" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflow/{name}/export -->
<!-- api-examples:end -->


## Retrieve the parameters.

`GET /api/v2/workspace/{workspace}/workflow/{name}/available-parameters`

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Workflow name |  | `my-amazing-workflow` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of **String**

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW/available-parameters" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflow/{name}/available-parameters -->
<!-- api-examples:end -->


## Retrieve a workflow's changelog

`GET /api/v2/workspace/{workspace}/workflow/{name}/changelog`

Retrieves each versions changelog and returns them all as a list.

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Workflow name |  | `my-amazing-workflow` |


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
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW/changelog" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflow/{name}/changelog -->
<!-- api-examples:end -->


## Retrieve a Workflow

`GET /api/v2/workspace/{workspace}/workflow/{name}`

Retrieve a version of the Workflow. Defaults to latest. Optionally without Tasks

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **name** | **String** | true | Workflow name |  | `my-amazing-workflow` |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **version** | **Integer** | false | Workflow version |  |  |
| **withTasks** | **Boolean** | false | Include Workflow tasks in response | Defaults to `true`. |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflow/{name} -->
#### Example response

`200 OK`:

```json
{
  "name": "hello-flow",
  "displayName": "Hello Flow",
  "status": "active",
  "version": 1,
  "creationDate": "2026-11-05T21:59:34.347Z",
  "description": "Says hello from an Execute Shell task.",
  "labels": {},
  "annotations": {
    "boomerang.io/kind": "Workflow",
    "boomerang.io/generation": "4"
  },
  "params": [],
  "tasks": [
    {
      "name": "start",
      "type": "start",
      "dependencies": [],
      "annotations": {},
      "labels": {},
      "params": [],
      "results": [],
      "unknownFields": {},
      "upgradesAvailable": false
    },
    {
      "name": "Execute Shell",
      "type": "script",
      "dependencies": [
        {
          "executionCondition": "always",
          "taskRef": "start"
        }
      ],
      "annotations": {},
      "labels": {},
      "params": [
        {
          "name": "script",
          "value": "echo \"Hello from Boomerang Flow\""
        }
      ],
      "results": [],
      "taskRef": "execute-shell",
      "taskVersion": 2,
      "unknownFields": {},
      "upgradesAvailable": false
    },
    {
      "name": "end",
      "type": "end",
      "dependencies": [
        {
          "executionCondition": "always",
          "taskRef": "Execute Shell"
        }
      ],
      "annotations": {},
      "labels": {},
      "params": [],
      "results": [],
      "unknownFields": {},
      "upgradesAvailable": false
    }
  ],
  "changelog": {
    "author": "6aecf30e755e5fc7e99bea28",
    "date": "2026-11-05T21:59:34.347Z",
    "reason": "Initial Workflow"
  },
  "triggers": {
    "event": {
      "enabled": false,
      "conditions": []
    },
    "github": {
      "enabled": false,
      "conditions": []
    },
    "manual": {
      "enabled": true,
      "conditions": []
    },
    "schedule": {
      "enabled": false,
      "conditions": []
    },
    "webhook": {
      "enabled": false,
      "conditions": []
    }
  },
  "type": "workflow",
  "upgradesAvailable": false
}
```

<!-- api-examples:end -->


## Change what a workflow is

`PATCH /api/v2/workspace/{workspace}/workflow/{name}`

Sets the workflow's type: workflow, template or starter. A template or starter is the system workspace's alone, and a template that other workspaces link stays one. The revision is untouched.

Requires the `workflow/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Workflow name |  | `my-amazing-workflow` |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkflowPatch**](./models/WorkflowPatch) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)

#### Example request

```bash
curl -X PATCH "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start PATCH /api/v2/workspace/{workspace}/workflow/{name} -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "type": "workflow"
}
```

<!-- api-examples:end -->


## Search for Workflows

`GET /api/v2/workspace/{workspace}/workflow/query`

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **limit** | **Integer** | true | Result Size |  | `10` |
| **page** | **Integer** | true | Page Number | Defaults to `0`. | `0` |
| **sort** | **String** | true | Ascending (ASC) or Descending (DESC) sort on creationDate | Defaults to `ASC`. Enum: [ASC, DESC] | `ASC` |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) |  |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. |  | `active,inactive` |
| **workflows** | **List** of **String** | false | List of workflows to filter for. |  |  |
| **types** | **List** of **String** | false | Which kinds to list: workflow, template, starter. Defaults to all: the workspace&#39;s own workflows and the templates and starters it has not made its own. |  | `template` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowResponsePage**](./models/WorkflowResponsePage)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/query?limit=10&page=0&sort=ASC" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflow/query -->
<!-- api-examples:end -->


## Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.

`POST /api/v2/workspace/{workspace}/workflow/{name}/submit`

Requires the `workflow/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **name** | **String** | true | Workflow name |  | `my-amazing-workflow` |
| **start** | **Boolean** | false | Start the WorkflowRun after submission (default). Pass start&#x3D;false to park the run at ready for a later PUT /workflowrun/{id}/start. | Defaults to `true`. |  |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkflowSubmitRequest**](./models/WorkflowSubmitRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflow/$WORKFLOW/submit" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/workspace/{workspace}/workflow/{name}/submit -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "trigger": "manual",
  "labels": {
    "ticket": "OPS-12"
  }
}
```

<!-- api-examples:end -->

