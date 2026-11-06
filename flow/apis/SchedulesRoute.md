---
title: Schedules
description: "Operations for Schedules: Create, list and manage your Schedules."
verified: "5.0.0-beta.39"
---

# Schedules

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Create a Schedule.**](#create-a-schedule) | POST | `/api/v2/workspace/{workspace}/schedule` |
| [**Delete a Schedule.**](#delete-a-schedule) | DELETE | `/api/v2/workspace/{workspace}/schedule/{scheduleId}` |
| [**Retrieve a Schedule.**](#retrieve-a-schedule) | GET | `/api/v2/workspace/{workspace}/schedule/{scheduleId}` |
| [**Retrieve Calendars for Schedules by Dates.**](#retrieve-calendars-for-schedules-by-dates) | GET | `/api/v2/workspace/{workspace}/schedule/calendars` |
| [**Search for Schedules**](#search-for-schedules) | GET | `/api/v2/workspace/{workspace}/schedule/query` |
| [**Apply a Schedule.**](#apply-a-schedule) | PUT | `/api/v2/workspace/{workspace}/schedule` |
| [**Validate a Schedules CRON.**](#validate-a-schedules-cron) | GET | `/api/v2/workspace/{workspace}/schedule/validate-cron` |



## Create a Schedule.

`POST /api/v2/workspace/{workspace}/schedule`

Requires the `schedule/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkflowSchedule**](./models/WorkflowSchedule) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**WorkflowSchedule**](./models/WorkflowSchedule)

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/workspace/$WORKSPACE/schedule" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/workspace/{workspace}/schedule -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "name": "Weekday mornings",
  "workflowRef": "my-workflow",
  "type": "cron",
  "cronSchedule": "0 9 * * 1-5",
  "timezone": "Australia/Melbourne"
}
```

<!-- api-examples:end -->


## Delete a Schedule.

`DELETE /api/v2/workspace/{workspace}/schedule/{scheduleId}`

Requires the `schedule/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **scheduleId** | **String** | true |  |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/schedule/$SCHEDULE_ID" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/schedule/{scheduleId} -->
<!-- api-examples:end -->


## Retrieve a Schedule.

`GET /api/v2/workspace/{workspace}/schedule/{scheduleId}`

Requires the `schedule/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **scheduleId** | **String** | true |  |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowSchedule**](./models/WorkflowSchedule)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/schedule/$SCHEDULE_ID" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/schedule/{scheduleId} -->
<!-- api-examples:end -->


## Retrieve Calendars for Schedules by Dates.

`GET /api/v2/workspace/{workspace}/schedule/calendars`

Requires the `schedule/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **schedules** | **List** of **String** | true |  |  |  |
| **fromDate** | **Long** | true |  |  |  |
| **toDate** | **Long** | true |  |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**WorkflowScheduleCalendar**](./models/WorkflowScheduleCalendar)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/schedule/calendars?schedules=$SCHEDULE_ID&fromDate=1767225600000&toDate=1769904000000" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/schedule/calendars -->
<!-- api-examples:end -->


## Search for Schedules

`GET /api/v2/workspace/{workspace}/schedule/query`

Requires the `schedule/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **limit** | **Integer** | true | Result Size | Defaults to `10`. | `10` |
| **page** | **Integer** | true | Page Number | Defaults to `0`. | `0` |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. |  | `active,archived` |
| **types** | **List** of **String** | false | List of types to filter for. Defaults to all. |  | `cron,advancedCron` |
| **workflows** | **List** of **String** | false | List of workflows to filter for. |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageWorkflowSchedule**](./models/PageWorkflowSchedule)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/schedule/query?limit=10&page=0" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/schedule/query -->
#### Example response

`200 OK`:

```json
{
  "content": [
    {
      "creationDate": "2026-11-06T00:41:39.712Z",
      "cronSchedule": "0 3 * * 0",
      "description": "Clears old artifacts early on Sunday.",
      "id": "6aecfc6b755e5fc7e99bec3b",
      "labels": {},
      "name": "Weekly clean-up",
      "nextFireAt": "2026-11-07T16:00:00.000Z",
      "nextScheduleDate": "2026-11-07T16:00:00.000Z",
      "params": [],
      "retryCount": 0,
      "status": "active",
      "timezone": "Australia/Melbourne",
      "type": "cron",
      "workflowRef": "clean-up-artifacts"
    }
  ],
  "empty": false,
  "first": true,
  "last": true,
  "number": 0,
  "numberOfElements": 3,
  "pageable": {
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 10,
    "paged": true,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "unpaged": false
  },
  "size": 10,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "totalElements": 3,
  "totalPages": 1
}
```

<!-- api-examples:end -->


## Apply a Schedule.

`PUT /api/v2/workspace/{workspace}/schedule`

Requires the `schedule/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**WorkflowSchedule**](./models/WorkflowSchedule) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**WorkflowSchedule**](./models/WorkflowSchedule)

#### Example request

```bash
curl -X PUT "$FLOW_URL/api/v2/workspace/$WORKSPACE/schedule" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start PUT /api/v2/workspace/{workspace}/schedule -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "id": "<schedule id>",
  "name": "Weekday mornings",
  "workflowRef": "my-workflow",
  "type": "cron",
  "cronSchedule": "0 9 * * 1-5",
  "timezone": "Australia/Melbourne"
}
```

<!-- api-examples:end -->


## Validate a Schedules CRON.

`GET /api/v2/workspace/{workspace}/schedule/validate-cron`

Requires the `schedule/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  | `my-amazing-workspace` |
| **cron** | **String** | true | A CRON expression to validate |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**CronValidationResponse**](./models/CronValidationResponse)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/schedule/validate-cron?cron=0%209%20*%20*%201" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/schedule/validate-cron -->
<!-- api-examples:end -->

