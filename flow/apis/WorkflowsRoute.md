---
title: Workflows Route
---

# Workflows Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|

| [**Update, replace, or create new, Workflow for Canvas**](#applyCanvas) | PUT | `/api/v2/team/{team}/workflow/{workflow}/compose` |

| [**Update, replace, or create new, Workflow**](#applyWorkflow) | PUT | `/api/v2/team/{team}/workflow` |

| [**Convert workflow to compose model for UI Designer and detailed Activity screens.**](#compose) | GET | `/api/v2/team/{team}/workflow/{workflow}/compose` |

| [**Create a new workflow**](#createWorkflow) | POST | `/api/v2/team/{team}/workflow` |

| [**Delete a workflow**](#deleteWorkflow2) | DELETE | `/api/v2/team/{team}/workflow/{workflow}` |

| [**Duplicates the workflow.**](#duplicateWorkflow) | POST | `/api/v2/team/{team}/workflow/{workflow}/duplicate` |

| [**Export the Workflow as JSON.**](#export) | GET | `/api/v2/team/{team}/workflow/{workflow}/export` |

| [**Retrieve the parameters.**](#getAvailableParameters) | GET | `/api/v2/team/{team}/workflow/{workflow}/available-parameters` |

| [**Retrieve the changlog**](#getChangelog) | GET | `/api/v2/team/{team}/workflow/{workflow}/changelog` |

| [**Retrieve a Workflow**](#getWorkflow) | GET | `/api/v2/team/{team}/workflow/{workflow}` |

| [**Search for Workflows**](#queryWorkflows) | GET | `/api/v2/team/{team}/workflow/query` |

| [**Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.**](#submitWorkflow) | POST | `/api/v2/team/{team}/workflow/{workflow}/submit` |


<a name="applyCanvas"></a>

## **Update, replace, or create new, Workflow for Canvas**

> PUT /api/v2/team/{team}/workflow/{workflow}/compose?replace=true


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **replace** | **Boolean** | false | Replace existing version | Defaults to false. | true

### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowCanvas**](../Models/WorkflowCanvas) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**WorkflowCanvas**](../Models/WorkflowCanvas.md)

<a name="applyWorkflow"></a>

## **Update, replace, or create new, Workflow**

> PUT /api/v2/team/{team}/workflow?replace=true


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **replace** | **Boolean** | false | Replace existing version | Defaults to false. | true

### Request Body
| Schema | Required | 
| ------ | --- | 
| [**Workflow**](../Models/Workflow) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**Workflow**](../Models/Workflow.md)

<a name="compose"></a>

## **Convert workflow to compose model for UI Designer and detailed Activity screens.**

> GET /api/v2/team/{team}/workflow/{workflow}/compose?version=56


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example
| **version** | **Integer** | false | Workflow Version | Defaults to null. | 56

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**WorkflowCanvas**](../Models/WorkflowCanvas.md)

<a name="createWorkflow"></a>

## **Create a new workflow**

> POST /api/v2/team/{team}/workflow


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team

### Request Body
| Schema | Required | 
| ------ | --- | 
| [**Workflow**](../Models/Workflow) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**Workflow**](../Models/Workflow.md)

<a name="deleteWorkflow2"></a>

## **Delete a workflow**

> DELETE /api/v2/team/{team}/workflow/{workflow}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: Not defined

### Response

null (empty response body)

<a name="duplicateWorkflow"></a>

## **Duplicates the workflow.**

> POST /api/v2/team/{team}/workflow/{workflow}/duplicate


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**Workflow**](../Models/Workflow.md)

<a name="export"></a>

## **Export the Workflow as JSON.**

> GET /api/v2/team/{team}/workflow/{workflow}/export


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: application/json

### Response

**File**

<a name="getAvailableParameters"></a>

## **Retrieve the parameters.**

> GET /api/v2/team/{team}/workflow/{workflow}/available-parameters


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

**List**

<a name="getChangelog"></a>

## **Retrieve the changlog**

> GET /api/v2/team/{team}/workflow/{workflow}/changelog

Retrieves each versions changelog and returns them all as a list.

### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**List**](../Models/ChangeLogVersion.md)

<a name="getWorkflow"></a>

## **Retrieve a Workflow**

> GET /api/v2/team/{team}/workflow/{workflow}?version=56,withTasks=true

Retrieve a version of the Workflow. Defaults to latest. Optionally without Tasks

### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **version** | **Integer** | false | Workflow Version | Defaults to null. | 56
| **withTasks** | **Boolean** | false | Include Workflow Tasks | Defaults to true. | true

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**Workflow**](../Models/Workflow.md)

<a name="queryWorkflows"></a>

## **Search for Workflows**

> GET /api/v2/team/{team}/workflow/query?labels=,statuses=active,inactive,workflows=,limit=10,page=0,sort=ASC


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **sort** | **String** | true | Ascending (ASC) or Descending (DESC) sort on creationDate | Defaults to Optional[ASC]. Enum: [ASC, DESC] | ASC
| **labels** | [**List**](../Models/String) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **statuses** | [**List**](../Models/String) | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,inactive
| **workflows** | [**List**](../Models/String) | false | List of workflows to filter for. | Defaults to null. | 

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**WorkflowResponsePage**](../Models/WorkflowResponsePage.md)

<a name="submitWorkflow"></a>

## **Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.**

> POST /api/v2/team/{team}/workflow/{workflow}/submit?start=true


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example
| **start** | **Boolean** | false | Start the WorkflowRun immediately after submission | Defaults to false. | true

### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowSubmitRequest**](../Models/WorkflowSubmitRequest) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**WorkflowRun**](../Models/WorkflowRun.md)

