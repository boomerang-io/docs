---
title: Workflow Runs
description: "Operations for Workflow Runs: Submit requests to execute Workflows and provide the ability to search and retrieve Workflow activities."
verified: "5.0.0-beta.39"
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
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Cancel |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID/cancel" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/cancel -->
<!-- api-examples:end -->


## Retrieve a summary of WorkflowRuns by Status.

`GET /api/v2/workspace/{workspace}/workflowrun/count`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) |  |  |
| **workflows** | **List** of **String** | false | List of Workflow IDs  to filter for. Does not validate the IDs provided. Defaults to all. |  | `63d3656ca845957db7d25ef0,63a3e732b0496509a7f1d763` |
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

[**WorkflowRunCount**](./models/WorkflowRunCount)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/count" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflowrun/count -->
<!-- api-examples:end -->


## Retrieve a specific WorkflowRun.

`GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **workflowRunId** | **String** | true | ID of WorkflowRun |  |  |
| **withTasks** | **Boolean** | false | Include Task Runs in the response | Defaults to `true`. |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId} -->
#### Example response

`200 OK`:

```json
{
  "id": "6aed1feb739ea20d87d5b99e",
  "creationDate": "2026-11-06T00:31:39.357Z",
  "status": "succeeded",
  "phase": "completed",
  "paused": false,
  "startTime": "2026-11-06T00:31:39.465Z",
  "duration": 10506,
  "timeout": 30,
  "workflowRef": "6aecfc46755e5fc7e99bebd7",
  "workflowRevisionRef": "6aecfc46755e5fc7e99bebd8",
  "labels": {},
  "annotations": {
    "boomerang.io/kind": "WorkflowRun",
    "boomerang.io/generation": "4"
  },
  "params": [],
  "tasks": [
    {
      "annotations": {},
      "attempt": 1,
      "creationDate": "2026-11-06T00:31:39.411Z",
      "duration": 10399,
      "id": "6aed1feb739ea20d87d5b9a0",
      "labels": {},
      "name": "Execute Shell",
      "params": [
        {
          "name": "path",
          "type": "string",
          "value": ""
        },
        {
          "name": "shell",
          "type": "string",
          "value": ""
        },
        {
          "name": "script",
          "type": "string",
          "value": "echo \"Hello from Boomerang Flow\""
        }
      ],
      "phase": "completed",
      "results": [],
      "spec": {
        "arguments": [
          "shell",
          "execute"
        ],
        "command": [],
        "debug": true,
        "deletion": "Always",
        "envs": null,
        "image": "boomerangio/task-flow:3.3.0",
        "script": null,
        "timeout": 0,
        "workingDir": null
      },
      "startTime": "2026-11-06T00:31:39.565Z",
      "status": "succeeded",
      "statusMessage": "Task (6aed1feb739ea20d87d5b9a0) has been executed successfully.",
      "taskRef": "execute-shell",
      "taskVersion": 2,
      "timeout": 30,
      "type": "script",
      "workflowRef": "6aecfc46755e5fc7e99bebd7",
      "workflowRevisionRef": "6aecfc46755e5fc7e99bebd8",
      "workflowRunRef": "6aed1feb739ea20d87d5b99e"
    }
  ],
  "awaitingApproval": false,
  "debug": true,
  "initiatedByName": "api-quickstart",
  "initiatedByRef": "api-quickstart",
  "results": [],
  "workflowDisplayName": "Hello Flow",
  "workflowName": "hello-flow",
  "workflowVersion": 1
}
```

`404 Not Found`, for a run ID that doesn't exist:

```json
{
  "cause": null,
  "code": 1301,
  "message": "Invalid WorkflowRun reference has been provided.",
  "reason": "WORKFLOWRUN_INVALID_REFERENCE",
  "status": "404 NOT_FOUND",
  "timestamp": "2026-11-06T00:41:39.831Z"
}
```

<!-- api-examples:end -->


## Pause a running WorkflowRun

`PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/pause`

Requires the `workflowrun/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Pause |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID/pause" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/pause -->
<!-- api-examples:end -->


## Purge a WorkflowRun with everything it owns and its lineage: its retries, its child runs, their task runs, actions, artifacts and logs. A run in flight is cancelled first. Audit records stay.

`DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}`

Requires the `workflowrun/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **workflowRunId** | **String** | true | ID of WorkflowRun to purge |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunPurge**](./models/WorkflowRunPurge)

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId} -->
<!-- api-examples:end -->


## Purge the WorkflowRuns matching every label, oldest first, each with its lineage. One call takes a page of matches and reports how many remain; repeat until none.

`DELETE /api/v2/workspace/{workspace}/workflowrun`

Requires the `workflowrun/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **labels** | **List** of **String** | true | List of url encoded labels, all of which a run must carry. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunPurge**](./models/WorkflowRunPurge)

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun?labels=env%3Dtest" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/workflowrun -->
<!-- api-examples:end -->


## Search for WorkflowRuns

`GET /api/v2/workspace/{workspace}/workflowrun/query`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **limit** | **Integer** | true | Result Size |  | `10` |
| **page** | **Integer** | true | Page Number | Defaults to `0`. | `0` |
| **order** | **String** | true | Ascending (ASC) or Descending (DESC) sort order on creationDate | Defaults to `ASC`. Enum: [ASC, DESC] | `ASC` |
| **labels** | **List** of **String** | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) |  |  |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. |  | `succeeded,skipped` |
| **phase** | **List** of **String** | false | List of phases to filter for. Defaults to all. |  | `running,completed` |
| **workflowruns** | **List** of **String** | false | List of WorkflowRun IDs to filter for. |  |  |
| **workflows** | **List** of **String** | false | List of Workflow IDs to filter for. |  |  |
| **triggers** | **List** of **String** | false | List of Triggers to filter for. |  |  |
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

[**PageWorkflowRun**](./models/PageWorkflowRun)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/query?limit=10&page=0&order=ASC" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflowrun/query -->
#### Example response

`200 OK`:

```json
{
  "content": [
    {
      "id": "6aed1feb739ea20d87d5b99e",
      "creationDate": "2026-11-06T00:31:39.357Z",
      "status": "succeeded",
      "phase": "completed",
      "paused": false,
      "startTime": "2026-11-06T00:31:39.465Z",
      "duration": 10506,
      "timeout": 30,
      "workflowRef": "6aecfc46755e5fc7e99bebd7",
      "workflowRevisionRef": "6aecfc46755e5fc7e99bebd8",
      "labels": {},
      "annotations": {
        "boomerang.io/kind": "WorkflowRun",
        "boomerang.io/generation": "4"
      },
      "params": [],
      "awaitingApproval": false,
      "debug": true,
      "initiatedByName": "api-quickstart",
      "initiatedByRef": "api-quickstart",
      "results": [],
      "workflowDisplayName": "Hello Flow",
      "workflowName": "hello-flow",
      "workflowVersion": 1
    }
  ],
  "number": 0,
  "size": 2,
  "totalElements": 20,
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
  "totalPages": 10,
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

`400 Bad Request`, for a status that doesn't exist, such as `statuses=finished`:

```json
{
  "cause": null,
  "code": 1001,
  "message": "Invalid query filters(status) have been provided.",
  "reason": "QUERY_INVALID_FILTERS",
  "status": "400 BAD_REQUEST",
  "timestamp": "2026-11-06T00:41:39.796Z"
}
```

<!-- api-examples:end -->


## Resume a paused WorkflowRun

`PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/resume`

Requires the `workflowrun/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Resume |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRun**](./models/WorkflowRun)

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID/resume" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/resume -->
<!-- api-examples:end -->


## Retry WorkflowRun execution.

`PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/retry`

Requires the `workflowrun/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Retry. |  |  |


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

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID/retry" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/retry -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "scope": "failed"
}
```

<!-- api-examples:end -->


## Start WorkflowRun execution. The WorkflowRun has to already have been queued.

`PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/start`

Requires the `workflowrun/action` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **workflowRunId** | **String** | true | ID of WorkflowRun to Start |  |  |


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

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID/start" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/start -->
<!-- api-examples:end -->

