---
title: TaskRunManagement
---

# TaskRunManagement



| Name | Method | Endpoint |
|------------- | ------------- | -------------|

| [**Retrieve a TaskRuns log from a specific WorkflowRun.**](#streamTaskRunLog) | GET | `/api/v2/taskrun/{taskRunId}/log` |


<a name="streamTaskRunLog"></a>
## **Retrieve a TaskRuns log from a specific WorkflowRun.**

> GET /api/v2/taskrun/{taskRunId}/log


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **taskRunId** | **String** | true | Id of TaskRun | Defaults to null. | taskRunId_example

### Request Body
This endpoint does not require a request body.

### Authorization

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

**Object**

