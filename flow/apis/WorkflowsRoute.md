---
title: Workflows Route
---

# Workflows Route

| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Update, replace, or create new, Workflow for Canvas**](#update-replace-or-create-new-workflow-for-canvas) | PUT | `/api/v2/team/{team}/workflow/{workflow}/compose` |
| [**Update, replace, or create new, Workflow**](#update-replace-or-create-new-workflow) | PUT | `/api/v2/team/{team}/workflow` |
| [**Convert workflow to compose model for UI Designer and detailed Activity screens.**](#convert-workflow-to-compose-model-for-ui-designer-and-detailed-activity-screens) | GET | `/api/v2/team/{team}/workflow/{workflow}/compose` |
| [**Create a new workflow**](#create-a-new-workflow) | POST | `/api/v2/team/{team}/workflow` |
| [**Delete a workflow**](#delete-a-workflow) | DELETE | `/api/v2/team/{team}/workflow/{workflow}` |
| [**Duplicates the workflow.**](#duplicates-the-workflow) | POST | `/api/v2/team/{team}/workflow/{workflow}/duplicate` |
| [**Export the Workflow as JSON.**](#export-the-workflow-as-json) | GET | `/api/v2/team/{team}/workflow/{workflow}/export` |
| [**Retrieve the parameters.**](#retrieve-the-parameters) | GET | `/api/v2/team/{team}/workflow/{workflow}/available-parameters` |
| [**Retrieve the changlog**](#retrieve-the-changlog) | GET | `/api/v2/team/{team}/workflow/{workflow}/changelog` |
| [**Retrieve a Workflow**](#retrieve-a-workflow) | GET | `/api/v2/team/{team}/workflow/{workflow}` |
| [**Search for Workflows**](#search-for-workflows) | GET | `/api/v2/team/{team}/workflow/query` |
| [**Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.**](#submit-a-workflow-to-be-run-will-queue-the-workflow-run-ready-for-execution) | POST | `/api/v2/team/{team}/workflow/{workflow}/submit` |



## **Update, replace, or create new, Workflow for Canvas**

> PUT /api/v2/team/{team}/workflow/{workflow}/compose?replace=true


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **replace** | **Boolean** | false | Replace existing version | Defaults to false. | true


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowCanvas**](./models/WorkflowCanvas) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**WorkflowCanvas**](./models/WorkflowCanvas)


## **Update, replace, or create new, Workflow**

> PUT /api/v2/team/{team}/workflow?replace=true


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **replace** | **Boolean** | false | Replace existing version | Defaults to false. | true


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**Workflow**](./models/Workflow) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)


## **Convert workflow to compose model for UI Designer and detailed Activity screens.**

> GET /api/v2/team/{team}/workflow/{workflow}/compose?version=56


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example
| **version** | **Integer** | false | Workflow Version | Defaults to null. | 56


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowCanvas**](./models/WorkflowCanvas)


## **Create a new workflow**

> POST /api/v2/team/{team}/workflow


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**Workflow**](./models/Workflow) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)


## **Delete a workflow**

> DELETE /api/v2/team/{team}/workflow/{workflow}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

null (empty response body)


## **Duplicates the workflow.**

> POST /api/v2/team/{team}/workflow/{workflow}/duplicate


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)


## **Export the Workflow as JSON.**

> GET /api/v2/team/{team}/workflow/{workflow}/export


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `application/json`

#### Response

**File**


## **Retrieve the parameters.**

> GET /api/v2/team/{team}/workflow/{workflow}/available-parameters


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List**


## **Retrieve the changlog**

> GET /api/v2/team/{team}/workflow/{workflow}/changelog

Retrieves each versions changelog and returns them all as a list.

#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**List**](./models/ChangeLogVersion)


## **Retrieve a Workflow**

> GET /api/v2/team/{team}/workflow/{workflow}?version=56,withTasks=true

Retrieve a version of the Workflow. Defaults to latest. Optionally without Tasks

#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **version** | **Integer** | false | Workflow Version | Defaults to null. | 56
| **withTasks** | **Boolean** | false | Include Workflow Tasks | Defaults to true. | true


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Workflow**](./models/Workflow)


## **Search for Workflows**

> GET /api/v2/team/{team}/workflow/query?labels=,statuses=active,inactive,workflows=,limit=10,page=0,sort=ASC


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **sort** | **String** | true | Ascending (ASC) or Descending (DESC) sort on creationDate | Defaults to Optional[ASC]. Enum: [ASC, DESC] | ASC
| **labels** | [**List**](./models/String) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **statuses** | [**List**](./models/String) | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,inactive
| **workflows** | [**List**](./models/String) | false | List of workflows to filter for. | Defaults to null. | 


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowResponsePage**](./models/WorkflowResponsePage)


## **Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.**

> POST /api/v2/team/{team}/workflow/{workflow}/submit?start=true


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflow** | **String** | true | Workflow reference | Defaults to null. | workflow_example
| **start** | **Boolean** | false | Start the WorkflowRun immediately after submission | Defaults to false. | true


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowSubmitRequest**](./models/WorkflowSubmitRequest) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)

