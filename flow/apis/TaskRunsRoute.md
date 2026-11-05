---
title: Task Runs Route
---

# Task Runs Route

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Search for TaskRuns across WorkflowRuns**](#search-for-taskruns-across-workflowruns) | GET | `/api/v2/workspace/{workspace}/taskrun/query` |
| [**Retrieve a TaskRuns log from a specific WorkflowRun.**](#retrieve-a-taskruns-log-from-a-specific-workflowrun) | GET | `/api/v2/taskrun/{taskRunId}/log` |



## Search for TaskRuns across WorkflowRuns

`GET /api/v2/workspace/{workspace}/taskrun/query`

Lists task runs by label or by WorkflowRun; one of the two is required. A row leaves out params, results, spec, annotations and the status message - retrieve the WorkflowRun for those.

Requires the `taskrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10 |
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0 |
| **order** | **String** | true | Ascending (ASC) or Descending (DESC) sort order on creationDate | Defaults to ASC. Enum: [ASC, DESC] | ASC |
| **labels** | **List** of **String** | false | List of url encoded labels. A WorkflowRun&#39;s labels are on each of its TaskRuns and a child WorkflowRun has its parent&#39;s. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. | Defaults to null. | failed,cancelled |
| **phase** | **List** of **String** | false | List of phases to filter for. Defaults to all. | Defaults to null. | running,completed |
| **workflowruns** | **List** of **String** | false | List of WorkflowRun IDs to filter for. | Defaults to null. |  |
| **workflows** | **List** of **String** | false | List of Workflow IDs to filter for. | Defaults to null. |  |
| **tasks** | **List** of **String** | false | List of task names to filter for. A name also matches its for-each items. | Defaults to null. | checklist,review |
| **foreach** | **Boolean** | false | true lists for-each parents only, the task run that stands for a for-each task&#39;s items and never runs itself; false leaves them out. Defaults to both. | Defaults to null. | false |
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch | Defaults to null. | 1677589200000 |
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch | Defaults to null. | 1680267600000 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageTaskRun**](./models/PageTaskRun)


## Retrieve a TaskRuns log from a specific WorkflowRun.

`GET /api/v2/taskrun/{taskRunId}/log`

Requires the `taskrun/read` permission, from a key, session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **taskRunId** | **String** | true | Id of TaskRun | Defaults to null. | taskRunId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Any**

