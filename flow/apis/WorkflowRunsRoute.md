---
title: Workflow Runs
---

# Workflow Runs

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Cancel a WorkflowRun**](#cancel-a-workflowrun) | DELETE | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/cancel` |
| [**Retrieve a summary of WorkflowRuns by Status.**](#retrieve-a-summary-of-workflowruns-by-status) | GET | `/api/v2/workspace/{workspace}/workflowrun/count` |
| [**Retrieve a specific WorkflowRun.**](#retrieve-a-specific-workflowrun) | GET | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}` |
| [**Pause a running WorkflowRun**](#pause-a-running-workflowrun) | PUT | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/pause` |
| [**Purge a WorkflowRun with everything it owns and its lineage: its retries, its child runs, their task runs, actions, artifacts and logs. A run in flight is cancelled first. Audit records stay.**](#purge-a-workflowrun-with-everything-it-owns-and-its-lineage-its-retries-its-child-runs-their-task-runs-actions-artifacts-and-logs-a-run-in-flight-is-cancelled-first-audit-records-stay) | DELETE | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}` |
| [**Purge the WorkflowRuns matching every label, oldest first, each with its lineage. One call takes a page of matches and reports how many remain; repeat until none.**](#purge-the-workflowruns-matching-every-label-oldest-first-each-with-its-lineage-one-call-takes-a-page-of-matches-and-reports-how-many-remain-repeat-until-none) | DELETE | `/api/v2/workspace/{workspace}/workflowrun` |
| [**Search for WorkflowRuns**](#search-for-workflowruns) | GET | `/api/v2/workspace/{workspace}/workflowrun/query` |
| [**Resume a paused WorkflowRun**](#resume-a-paused-workflowrun) | PUT | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/resume` |
| [**Retry WorkflowRun execution.**](#retry-workflowrun-execution) | PUT | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/retry` |
| [**Start WorkflowRun execution. The WorkflowRun has to already have been queued.**](#start-workflowrun-execution-the-workflowrun-has-to-already-have-been-queued) | PUT | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/start` |



## Cancel a WorkflowRun

`DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/cancel`

Requires the `workflowrun/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Cancel | Defaults to null. | workflowRunId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)


## Retrieve a summary of WorkflowRuns by Status.

`GET /api/v2/workspace/{workspace}/workflowrun/count`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. |  |
| **workflows** | **List** of **String** | false | List of Workflow IDs  to filter for. Does not validate the IDs provided. Defaults to all. | Defaults to null. | 63d3656ca845957db7d25ef0,63a3e732b0496509a7f1d763 |
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

[**WorkflowRunCount**](./models/WorkflowRunCount)


## Retrieve a specific WorkflowRun.

`GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **workflowRunId** | **String** | true | ID of WorkflowRun | Defaults to null. | workflowRunId_example |
| **withTasks** | **Boolean** | false | Include Task Runs in the response | Defaults to true. | true |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)


## Pause a running WorkflowRun

`PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/pause`

Requires the `workflowrun/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Pause | Defaults to null. | workflowRunId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)


## Purge a WorkflowRun with everything it owns and its lineage: its retries, its child runs, their task runs, actions, artifacts and logs. A run in flight is cancelled first. Audit records stay.

`DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}`

Requires the `workflowrun/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **workflowRunId** | **String** | true | ID of WorkflowRun to purge | Defaults to null. | workflowRunId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunPurge**](./models/WorkflowRunPurge)


## Purge the WorkflowRuns matching every label, oldest first, each with its lineage. One call takes a page of matches and reports how many remain; repeat until none.

`DELETE /api/v2/workspace/{workspace}/workflowrun`

Requires the `workflowrun/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **labels** | **List** of **String** | true | List of url encoded labels, all of which a run must carry. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunPurge**](./models/WorkflowRunPurge)


## Search for WorkflowRuns

`GET /api/v2/workspace/{workspace}/workflowrun/query`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10 |
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0 |
| **order** | **String** | true | Ascending (ASC) or Descending (DESC) sort order on creationDate | Defaults to ASC. Enum: [ASC, DESC] | ASC |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. | Defaults to null. | succeeded,skipped |
| **phase** | **List** of **String** | false | List of phases to filter for. Defaults to all. | Defaults to null. | running,completed |
| **workflowruns** | **List** of **String** | false | List of WorkflowRun IDs to filter for. | Defaults to null. |  |
| **workflows** | **List** of **String** | false | List of Workflow IDs to filter for. | Defaults to null. |  |
| **triggers** | **List** of **String** | false | List of Triggers to filter for. | Defaults to null. |  |
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

[**PageWorkflowRun**](./models/PageWorkflowRun)


## Resume a paused WorkflowRun

`PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/resume`

Requires the `workflowrun/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Resume | Defaults to null. | workflowRunId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)


## Retry WorkflowRun execution.

`PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/retry`

Requires the `workflowrun/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Retry. | Defaults to null. | workflowRunId_example |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkflowRunRetryRequest**](./models/WorkflowRunRetryRequest) | false |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)


## Start WorkflowRun execution. The WorkflowRun has to already have been queued.

`PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/start`

Requires the `workflowrun/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Start | Defaults to null. | workflowRunId_example |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkflowRunRequest**](./models/WorkflowRunRequest) | false |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)

