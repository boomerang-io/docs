---
title: Schedules Route
---

# Schedules Route

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
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |


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


## Delete a Schedule.

`DELETE /api/v2/workspace/{workspace}/schedule/{scheduleId}`

Requires the `schedule/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **scheduleId** | **String** | true |  | Defaults to null. | scheduleId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Retrieve a Schedule.

`GET /api/v2/workspace/{workspace}/schedule/{scheduleId}`

Requires the `schedule/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **scheduleId** | **String** | true |  | Defaults to null. | scheduleId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**WorkflowSchedule**](./models/WorkflowSchedule)


## Retrieve Calendars for Schedules by Dates.

`GET /api/v2/workspace/{workspace}/schedule/calendars`

Requires the `schedule/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **schedules** | **List** of **String** | true |  | Defaults to null. |  |
| **fromDate** | **Long** | true |  | Defaults to null. | 789 |
| **toDate** | **Long** | true |  | Defaults to null. | 789 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**WorkflowScheduleCalendar**](./models/WorkflowScheduleCalendar)


## Search for Schedules

`GET /api/v2/workspace/{workspace}/schedule/query`

Requires the `schedule/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **limit** | **Integer** | true | Result Size | Defaults to 10. | 10 |
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0 |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,archived |
| **types** | **List** of **String** | false | List of types to filter for. Defaults to all. | Defaults to null. | cron,advancedCron |
| **workflows** | **List** of **String** | false | List of workflows to filter for. | Defaults to null. |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageWorkflowSchedule**](./models/PageWorkflowSchedule)


## Apply a Schedule.

`PUT /api/v2/workspace/{workspace}/schedule`

Requires the `schedule/write` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |


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


## Validate a Schedules CRON.

`GET /api/v2/workspace/{workspace}/schedule/validate-cron`

Requires the `schedule/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **cron** | **String** | true | A CRON expression to validate | Defaults to null. | cron_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**CronValidationResponse**](./models/CronValidationResponse)

