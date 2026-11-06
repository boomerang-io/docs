---
title: Task Runs
description: "Operations for Task Runs: View, Start, Stop, and Update Status of your Task Runs."
verified: "5.0.0-beta.39"
---

# Task Runs

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
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **limit** | **Integer** | true | Result Size |  | `10` |
| **page** | **Integer** | true | Page Number | Defaults to `0`. | `0` |
| **order** | **String** | true | Ascending (ASC) or Descending (DESC) sort order on creationDate | Defaults to `ASC`. Enum: [ASC, DESC] | `ASC` |
| **labels** | **List** of **String** | false | List of url encoded labels. A WorkflowRun&#39;s labels are on each of its TaskRuns and a child WorkflowRun has its parent&#39;s. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) |  |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. |  | `failed,cancelled` |
| **phase** | **List** of **String** | false | List of phases to filter for. Defaults to all. |  | `running,completed` |
| **workflowruns** | **List** of **String** | false | List of WorkflowRun IDs to filter for. |  |  |
| **workflows** | **List** of **String** | false | List of Workflow IDs to filter for. |  |  |
| **tasks** | **List** of **String** | false | List of task names to filter for. A name also matches its for-each items. |  | `checklist,review` |
| **foreach** | **Boolean** | false | true lists for-each parents only, the task run that stands for a for-each task&#39;s items and never runs itself; false leaves them out. Defaults to both. |  | `false` |
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch |  | `1677589200000` |
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch |  | `1680267600000` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageTaskRun**](./models/PageTaskRun)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/taskrun/query?limit=10&page=0&order=ASC&workflowruns=$RUN_ID" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/taskrun/query -->
#### Example response

`200 OK`:

```json
{
  "content": [
    {
      "creationDate": "2026-11-06T00:31:39.410Z",
      "duration": 0,
      "id": "6aed1feb739ea20d87d5b99f",
      "labels": {},
      "name": "start",
      "phase": "completed",
      "status": "succeeded",
      "type": "start",
      "workflowRef": "6aecfc46755e5fc7e99bebd7",
      "workflowRunRef": "6aed1feb739ea20d87d5b99e"
    },
    {
      "attempt": 1,
      "creationDate": "2026-11-06T00:31:39.411Z",
      "duration": 10399,
      "id": "6aed1feb739ea20d87d5b9a0",
      "labels": {},
      "name": "Execute Shell",
      "phase": "completed",
      "startTime": "2026-11-06T00:31:39.565Z",
      "status": "succeeded",
      "taskRef": "execute-shell",
      "type": "script",
      "workflowRef": "6aecfc46755e5fc7e99bebd7",
      "workflowRunRef": "6aed1feb739ea20d87d5b99e"
    }
  ],
  "number": 0,
  "size": 2,
  "totalElements": 3,
  "pageable": {
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 2,
    "paged": true,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "unpaged": false
  },
  "last": false,
  "totalPages": 2,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "first": true,
  "numberOfElements": 2,
  "empty": false
}
```

<!-- api-examples:end -->


## Retrieve a TaskRuns log from a specific WorkflowRun.

`GET /api/v2/taskrun/{taskRunId}/log`

Requires the `taskrun/read` permission, from a key, session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **taskRunId** | **String** | true | Id of TaskRun |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Any**

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/taskrun/$TASK_RUN_ID/log" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/taskrun/{taskRunId}/log -->
<!-- api-examples:end -->

