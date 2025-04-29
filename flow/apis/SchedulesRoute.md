---
title: Schedules Route
---

# Schedules Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|

| [**Create a Schedule.**](#createSchedule) | POST | `/api/v2/team/{team}/schedule` |

| [**Delete a Schedule.**](#deleteSchedule) | DELETE | `/api/v2/team/{team}/schedule/{scheduleId}` |

| [**Retrieve a Schedule.**](#get2) | GET | `/api/v2/team/{team}/schedule/{scheduleId}` |

| [**Retrieve Calendars for Schedules by Dates.**](#getCalendarsForSchedules) | GET | `/api/v2/team/{team}/schedule/calendars` |

| [**Search for Schedules**](#query3) | GET | `/api/v2/team/{team}/schedule/query` |

| [**Apply a Schedule.**](#updateSchedule) | PUT | `/api/v2/team/{team}/schedule` |

| [**Validate a Schedules CRON.**](#validateCron) | GET | `/api/v2/team/{team}/schedule/validate-cron` |


<a name="createSchedule"></a>

## **Create a Schedule.**

> POST /api/v2/team/{team}/schedule


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team

### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowSchedule**](../Models/WorkflowSchedule) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**WorkflowSchedule**](../Models/WorkflowSchedule.md)

<a name="deleteSchedule"></a>

## **Delete a Schedule.**

> DELETE /api/v2/team/{team}/schedule/{scheduleId}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **scheduleId** | **String** | true |  | Defaults to null. | scheduleId_example

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: Not defined

### Response

null (empty response body)

<a name="get2"></a>

## **Retrieve a Schedule.**

> GET /api/v2/team/{team}/schedule/{scheduleId}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **scheduleId** | **String** | true |  | Defaults to null. | scheduleId_example

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**WorkflowSchedule**](../Models/WorkflowSchedule.md)

<a name="getCalendarsForSchedules"></a>

## **Retrieve Calendars for Schedules by Dates.**

> GET /api/v2/team/{team}/schedule/calendars?schedules=,fromDate=789,toDate=789


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **schedules** | [**List**](../Models/String) | true |  | Defaults to null. | 
| **fromDate** | **Long** | true |  | Defaults to null. | 789
| **toDate** | **Long** | true |  | Defaults to null. | 789

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**List**](../Models/WorkflowScheduleCalendar.md)

<a name="query3"></a>

## **Search for Schedules**

> GET /api/v2/team/{team}/schedule/query?statuses=active,archived,types=cron,advancedCron,workflows=,limit=10,page=0


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **limit** | **Integer** | true | Result Size | Defaults to 10. | 10
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0
| **statuses** | [**List**](../Models/String) | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,archived
| **types** | [**List**](../Models/String) | false | List of types to filter for. Defaults to all. | Defaults to null. | cron,advancedCron
| **workflows** | [**List**](../Models/String) | false | List of workflows to filter for. | Defaults to null. | 

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**PageWorkflowSchedule**](../Models/PageWorkflowSchedule.md)

<a name="updateSchedule"></a>

## **Apply a Schedule.**

> PUT /api/v2/team/{team}/schedule


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team

### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowSchedule**](../Models/WorkflowSchedule) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**WorkflowSchedule**](../Models/WorkflowSchedule.md)

<a name="validateCron"></a>

## **Validate a Schedules CRON.**

> GET /api/v2/team/{team}/schedule/validate-cron?cron=cron_example


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **cron** | **String** | true | A CRON expression to validate | Defaults to null. | cron_example

### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**CronValidationResponse**](../Models/CronValidationResponse.md)

