---
title: Workflow Runs Route
---

# Workflow Runs Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Cancel a WorkflowRun**](#cancela-workflow-run) | DELETE | `/api/v2/team/{team}/workflowrun/{workflowRunId}/cancel` |
| [**Retrieve a summary of WorkflowRuns by Status.**](#retrieveasummaryof-workflow-runsby-status) | GET | `/api/v2/team/{team}/workflowrun/count` |
| [**End a WorkflowRun**](#enda-workflow-run) | PUT | `/api/v2/team/{team}/workflowrun/{workflowRunId}/finalize` |
| [**Retrieve a specific WorkflowRun.**](#retrieveaspecific-workflow-run) | GET | `/api/v2/team/{team}/workflowrun/{workflowRunId}` |
| [**Search for WorkflowRuns**](#searchfor-workflow-runs) | GET | `/api/v2/team/{team}/workflowrun/query` |
| [**Retry WorkflowRun execution.**](#retry-workflow-runexecution) | PUT | `/api/v2/team/{team}/workflowrun/{workflowRunId}/retry` |
| [**Start WorkflowRun execution. The WorkflowRun has to already have been queued.**](#start-workflow-runexecution-the-workflow-runhastoalreadyhavebeenqueued) | PUT | `/api/v2/team/{team}/workflowrun/{workflowRunId}/start` |


<a name="cancel"></a>

## **Cancel a WorkflowRun**

> DELETE /api/v2/team/{team}/workflowrun/{workflowRunId}/cancel


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflowRunId** | **String** | true | ID of WorkflowRun to Cancel | Defaults to null. | workflowRunId_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**WorkflowRun**](./models/WorkflowRun.md)

<a name="count"></a>

## **Retrieve a summary of WorkflowRuns by Status.**

> GET /api/v2/team/{team}/workflowrun/count?labels=,workflows=63d3656ca845957db7d25ef0,63a3e732b0496509a7f1d763,fromDate=1677589200000,toDate=1680267600000


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **labels** | [**List**](./models/String) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **workflows** | [**List**](./models/String) | false | List of Workflow IDs  to filter for. Does not validate the IDs provided. Defaults to all. | Defaults to null. | 63d3656ca845957db7d25ef0,63a3e732b0496509a7f1d763
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch | Defaults to null. | 1677589200000
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch | Defaults to null. | 1680267600000


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**WorkflowRunCount**](./models/WorkflowRunCount.md)

<a name="finalize"></a>

## **End a WorkflowRun**

> PUT /api/v2/team/{team}/workflowrun/{workflowRunId}/finalize


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflowRunId** | **String** | true | ID of WorkflowRun to Finalize | Defaults to null. | workflowRunId_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**WorkflowRun**](./models/WorkflowRun.md)

<a name="get1"></a>

## **Retrieve a specific WorkflowRun.**

> GET /api/v2/team/{team}/workflowrun/{workflowRunId}?withTasks=true


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflowRunId** | **String** | true | ID of WorkflowRun | Defaults to null. | workflowRunId_example
| **withTasks** | **Boolean** | false | Include Task Runs in the response | Defaults to true. | true


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**WorkflowRun**](./models/WorkflowRun.md)

<a name="query2"></a>

## **Search for WorkflowRuns**

> GET /api/v2/team/{team}/workflowrun/query?labels=,statuses=succeeded,skipped,phase=completed,finalized,workflowruns=,workflows=,triggers=,limit=10,page=0,order=ASC,fromDate=1677589200000,toDate=1680267600000


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **order** | **String** | true | Ascending (ASC) or Descending (DESC) sort order on creationDate | Defaults to Optional[ASC]. Enum: [ASC, DESC] | ASC
| **labels** | [**List**](./models/String) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **statuses** | [**List**](./models/String) | false | List of statuses to filter for. Defaults to all. | Defaults to null. | succeeded,skipped
| **phase** | [**List**](./models/String) | false | List of phases to filter for. Defaults to all. | Defaults to null. | completed,finalized
| **workflowruns** | [**List**](./models/String) | false | List of WorkflowRun IDs to filter for. | Defaults to null. | 
| **workflows** | [**List**](./models/String) | false | List of Workflow IDs to filter for. | Defaults to null. | 
| **triggers** | [**List**](./models/String) | false | List of Triggers to filter for. | Defaults to null. | 
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch | Defaults to null. | 1677589200000
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch | Defaults to null. | 1680267600000


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**PageWorkflowRun**](./models/PageWorkflowRun.md)

<a name="retry"></a>

## **Retry WorkflowRun execution.**

> PUT /api/v2/team/{team}/workflowrun/{workflowRunId}/retry


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflowRunId** | **String** | true | ID of WorkflowRun to Retry. | Defaults to null. | workflowRunId_example


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowRunRequest**](./models/WorkflowRunRequest) | false |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**WorkflowRun**](./models/WorkflowRun.md)

<a name="start"></a>

## **Start WorkflowRun execution. The WorkflowRun has to already have been queued.**

> PUT /api/v2/team/{team}/workflowrun/{workflowRunId}/start


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflowRunId** | **String** | true | ID of WorkflowRun to Start | Defaults to null. | workflowRunId_example


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowRunRequest**](./models/WorkflowRunRequest) | false |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

[x-access-token](./overview#x-access-token), [BearerAuth](./overview#BearerAuth)

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**WorkflowRun**](./models/WorkflowRun.md)

