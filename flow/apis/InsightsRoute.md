---
title: Insights
description: "Operations for Insights: Provide the ability to search and retrieve Insights."
verified: "5.0.0-beta.39"
---

# Insights

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Summarise a workspace's runs over a period**](#summarise-a-workspaces-runs-over-a-period) | GET | `/api/v2/workspace/{workspace}/insights` |
| [**Summarise runs across workspaces over a period**](#summarise-runs-across-workspaces-over-a-period) | GET | `/api/v2/insights` |
| [**List task runs across workspaces**](#list-task-runs-across-workspaces) | GET | `/api/v2/insights/taskruns` |
| [**Group a workspace's task runs over a period**](#group-a-workspaces-task-runs-over-a-period) | GET | `/api/v2/workspace/{workspace}/insights/tasks` |
| [**Group task runs across workspaces over a period**](#group-task-runs-across-workspaces-over-a-period) | GET | `/api/v2/insights/tasks` |
| [**Detail one workflow's runs over a period**](#detail-one-workflows-runs-over-a-period) | GET | `/api/v2/workspace/{workspace}/insights/workflow/{workflow}` |



## Summarise a workspace's runs over a period

`GET /api/v2/workspace/{workspace}/insights`

Counts, success rate, duration and queue-wait percentiles, runs per day, one row per workflow and the model usage of its ai tasks, with the same-length previous period for comparison. Computed from the runs the workspace still holds; the period defaults to the last 90 days.

Requires the `insights/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **fromDate** | **Long** | false |  |  |  |
| **toDate** | **Long** | false |  |  |  |
| **workflows** | **List** of **String** | false |  |  |  |
| **labels** | **List** of **String** | false | Run labels to narrow by, as the run query takes them: URL-encoded key&#x3D;value, comma-separated, all of which must match. |  |  |
| **statuses** | **List** of **String** | false |  |  |  |
| **triggers** | **List** of **String** | false |  |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunInsightSummary**](./models/WorkflowRunInsightSummary)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/insights" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/insights -->
<!-- api-examples:end -->


## Summarise runs across workspaces over a period

`GET /api/v2/insights`

The workspace summary computed over the union of the named workspaces' runs, or every workspace's when none is named, with the same-length previous period for comparison. Needs a global insights grant; the period defaults to the last 90 days.

Requires the `insights/read` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspaces** | **List** of **String** | false | Workspace names to aggregate over; absent means every workspace. One that does not exist contributes nothing. |  |  |
| **fromDate** | **Long** | false |  |  |  |
| **toDate** | **Long** | false |  |  |  |
| **workflows** | **List** of **String** | false |  |  |  |
| **labels** | **List** of **String** | false | Run labels to narrow by, as the run query takes them: URL-encoded key&#x3D;value, comma-separated, all of which must match. |  |  |
| **statuses** | **List** of **String** | false |  |  |  |
| **triggers** | **List** of **String** | false |  |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunInsightSummary**](./models/WorkflowRunInsightSummary)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/insights" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/insights -->
<!-- api-examples:end -->


## List task runs across workspaces

`GET /api/v2/insights/taskruns`

One page of task runs over the named workspaces, or every workspace, newest first, each with its workspace, its identity and its lifecycle: never params, results or spec. Task runs are indexed by label, so labels is required. Needs a global insights grant.

Requires the `insights/read` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **labels** | **List** of **String** | true | Run labels to narrow by, as the run query takes them: URL-encoded key&#x3D;value, comma-separated, all of which must match. Required. |  |  |
| **workspaces** | **List** of **String** | false | Workspace names to aggregate over; absent means every workspace. One that does not exist contributes nothing. |  |  |
| **fromDate** | **Long** | false |  |  |  |
| **toDate** | **Long** | false |  |  |  |
| **statuses** | **List** of **String** | false |  |  |  |
| **phases** | **List** of **String** | false |  |  |  |
| **tasks** | **List** of **String** | false | Task node names; a name also matches its for-each items. |  |  |
| **foreach** | **Boolean** | false | true keeps for-each parents only, false leaves them out. |  |  |
| **limit** | **Integer** | false | Result Size |  | `50` |
| **page** | **Integer** | false | Page Number |  | `0` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunInsightTaskRunPage**](./models/WorkflowRunInsightTaskRunPage)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/insights/taskruns?labels=env%3Dtest" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/insights/taskruns -->
<!-- api-examples:end -->


## Group a workspace's task runs over a period

`GET /api/v2/workspace/{workspace}/insights/tasks`

Counts and duration statistics (mean, p50, p95, max over succeeded task runs) per group and, optionally, per hour, day or month, with the usage its ai task runs reported; the wall clock of the runs sharing a label; and the slowest task runs. A task run counts once it completed, unless it was skipped, and a for-each task counts its items under its own name. Computed from the runs the workspace still holds; the period defaults to the last 90 days.

Requires the `insights/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  |  |
| **fromDate** | **Long** | false |  |  |  |
| **toDate** | **Long** | false |  |  |  |
| **workflows** | **List** of **String** | false |  |  |  |
| **labels** | **List** of **String** | false | Run labels to narrow by, as the run query takes them: URL-encoded key&#x3D;value, comma-separated, all of which must match. |  |  |
| **tasks** | **List** of **String** | false | Task node names to count. |  |  |
| **types** | **List** of **String** | false | Task types to count, such as ai. |  |  |
| **groupBy** | **String** | false | task, type, workflow or label:&lt;key&gt; (a task run&#39;s label, such as the server&#39;s boomerang.io/model or boomerang.io/item); one row when absent. |  | `label:boomerang.io/model` |
| **bucket** | **String** | false | hour, day or month (UTC), by task run start. |  |  |
| **spanBy** | **String** | false | label:&lt;key&gt;: per row, the first start to the last end of the task runs of the runs sharing each value of that run label. |  |  |
| **slowest** | **Integer** | false | How many slowest task runs to list, up to 100. | Defaults to `0`. |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunInsightTasks**](./models/WorkflowRunInsightTasks)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/insights/tasks" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/insights/tasks -->
<!-- api-examples:end -->


## Group task runs across workspaces over a period

`GET /api/v2/insights/tasks`

The workspace task breakdown computed over the union of the named workspaces' runs, or every workspace's when none is named. Needs a global insights grant; the period defaults to the last 90 days.

Requires the `insights/read` permission, from a global, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspaces** | **List** of **String** | false | Workspace names to aggregate over; absent means every workspace. One that does not exist contributes nothing. |  |  |
| **fromDate** | **Long** | false |  |  |  |
| **toDate** | **Long** | false |  |  |  |
| **workflows** | **List** of **String** | false |  |  |  |
| **labels** | **List** of **String** | false | Run labels to narrow by, as the run query takes them: URL-encoded key&#x3D;value, comma-separated, all of which must match. |  |  |
| **tasks** | **List** of **String** | false | Task node names to count. |  |  |
| **types** | **List** of **String** | false | Task types to count, such as ai. |  |  |
| **groupBy** | **String** | false | task, type, workflow or label:&lt;key&gt;; one row when absent. |  | `label:boomerang.io/model` |
| **bucket** | **String** | false | hour, day or month (UTC), by task run start. |  |  |
| **spanBy** | **String** | false | label:&lt;key&gt;: the wall clock of the runs sharing each value of a run label. |  |  |
| **slowest** | **Integer** | false | How many of the slowest task runs to list, up to 100. | Defaults to `0`. |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunInsightTasks**](./models/WorkflowRunInsightTasks)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/insights/tasks" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/insights/tasks -->
<!-- api-examples:end -->


## Detail one workflow's runs over a period

`GET /api/v2/workspace/{workspace}/insights/workflow/{workflow}`

Where a typical run spends its time (per task), why runs did not succeed and the model usage of its ai tasks, from the runs and task runs the workspace still holds.

Requires the `insights/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  |  |
| **workflow** | **String** | true | Workflow name or id. |  |  |
| **fromDate** | **Long** | false |  |  |  |
| **toDate** | **Long** | false |  |  |  |
| **labels** | **List** of **String** | false | Run labels to narrow by, as the run query takes them: URL-encoded key&#x3D;value, comma-separated, all of which must match. |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowRunInsightWorkflowDetail**](./models/WorkflowRunInsightWorkflowDetail)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/insights/workflow/$WORKFLOW" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/insights/workflow/{workflow} -->
<!-- api-examples:end -->

