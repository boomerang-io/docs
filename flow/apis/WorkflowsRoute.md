---
title: Workflows
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
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Name of the workflow | Defaults to null. | name_example |
| **replace** | **Boolean** | false | Replace existing version | Defaults to false. | true |


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


## Update, replace, or create new, Workflow

`PUT /api/v2/workspace/{workspace}/workflow`

Requires the `workflow/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **replace** | **Boolean** | false | Replace existing version | Defaults to false. | true |


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


## Convert workflow to compose model for UI Designer and detailed Activity screens.

`GET /api/v2/workspace/{workspace}/workflow/{name}/compose`

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Workflow name | Defaults to null. | my-amazing-workflow |
| **version** | **Integer** | false | Workflow Version | Defaults to null. | 56 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowCanvas**](./models/WorkflowCanvas)


## Create a new workflow

`POST /api/v2/workspace/{workspace}/workflow`

Requires the `workflow/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |


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


## Delete a workflow

`DELETE /api/v2/workspace/{workspace}/workflow/{name}`

Requires the `workflow/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Workflow name | Defaults to null. | my-amazing-workflow |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Duplicates the workflow.

`POST /api/v2/workspace/{workspace}/workflow/{name}/duplicate`

Requires the `workflow/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Workflow name | Defaults to null. | my-amazing-workflow |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)


## Export the Workflow as JSON.

`GET /api/v2/workspace/{workspace}/workflow/{name}/export`

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Workflow name | Defaults to null. | my-amazing-workflow |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `application/json`

#### Response

**File**


## Retrieve the parameters.

`GET /api/v2/workspace/{workspace}/workflow/{name}/available-parameters`

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Workflow name | Defaults to null. | my-amazing-workflow |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of **String**


## Retrieve a workflow's changelog

`GET /api/v2/workspace/{workspace}/workflow/{name}/changelog`

Retrieves each versions changelog and returns them all as a list.

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Workflow name | Defaults to null. | my-amazing-workflow |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**ChangeLogVersion**](./models/ChangeLogVersion)


## Retrieve a Workflow

`GET /api/v2/workspace/{workspace}/workflow/{name}`

Retrieve a version of the Workflow. Defaults to latest. Optionally without Tasks

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **name** | **String** | true | Workflow name | Defaults to null. | my-amazing-workflow |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **version** | **Integer** | false | Workflow version | Defaults to null. | 56 |
| **withTasks** | **Boolean** | false | Include Workflow tasks in response | Defaults to true. | true |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)


## Change what a workflow is

`PATCH /api/v2/workspace/{workspace}/workflow/{name}`

Sets the workflow's type: workflow, template or starter. A template or starter is the system workspace's alone, and a template that other workspaces link stays one. The revision is untouched.

Requires the `workflow/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Workflow name | Defaults to null. | my-amazing-workflow |


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


## Search for Workflows

`GET /api/v2/workspace/{workspace}/workflow/query`

Requires the `workflow/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10 |
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0 |
| **sort** | **String** | true | Ascending (ASC) or Descending (DESC) sort on creationDate | Defaults to ASC. Enum: [ASC, DESC] | ASC |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,inactive |
| **workflows** | **List** of **String** | false | List of workflows to filter for. | Defaults to null. |  |
| **types** | **List** of **String** | false | Which kinds to list: workflow, template, starter. Defaults to all: the workspace&#39;s own workflows and the templates and starters it has not made its own. | Defaults to null. | template |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowResponsePage**](./models/WorkflowResponsePage)


## Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.

`POST /api/v2/workspace/{workspace}/workflow/{name}/submit`

Requires the `workflow/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **name** | **String** | true | Workflow name | Defaults to null. | my-amazing-workflow |
| **start** | **Boolean** | false | Start the WorkflowRun after submission (default). Pass start&#x3D;false to park the run at ready for a later PUT /workflowrun/{id}/start. | Defaults to true. | true |


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

