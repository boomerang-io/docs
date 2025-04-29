---
title: Schedules Route
---

# Schedules Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Create a Schedule.**](#create-a-schedule) | POST | `/api/v2/team/{team}/schedule` |
| [**Delete a Schedule.**](#delete-a-schedule) | DELETE | `/api/v2/team/{team}/schedule/{scheduleId}` |
| [**Retrieve a Schedule.**](#retrieve-a-schedule) | GET | `/api/v2/team/{team}/schedule/{scheduleId}` |
| [**Retrieve Calendars for Schedules by Dates.**](#retrieve-calendars-for-schedules-by-dates) | GET | `/api/v2/team/{team}/schedule/calendars` |
| [**Search for Schedules**](#search-for-schedules) | GET | `/api/v2/team/{team}/schedule/query` |
| [**Apply a Schedule.**](#apply-a-schedule) | PUT | `/api/v2/team/{team}/schedule` |
| [**Validate a Schedules CRON.**](#validate-a-schedules-cron) | GET | `/api/v2/team/{team}/schedule/validate-cron` |



## **Create a Schedule.**

> POST /api/v2/team/{team}/schedule


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowSchedule**](./models/WorkflowSchedule) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

#### Response

[**WorkflowSchedule**](./models/WorkflowSchedule.md)


## **Delete a Schedule.**

> DELETE /api/v2/team/{team}/schedule/{scheduleId}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **scheduleId** | **String** | true |  | Defaults to null. | scheduleId_example


### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: Not defined

#### Response

null (empty response body)


## **Retrieve a Schedule.**

> GET /api/v2/team/{team}/schedule/{scheduleId}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **scheduleId** | **String** | true |  | Defaults to null. | scheduleId_example


### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

[**WorkflowSchedule**](./models/WorkflowSchedule.md)


## **Retrieve Calendars for Schedules by Dates.**

> GET /api/v2/team/{team}/schedule/calendars?schedules=,fromDate=789,toDate=789


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **schedules** | [**List**](./models/String) | true |  | Defaults to null. | 
| **fromDate** | **Long** | true |  | Defaults to null. | 789
| **toDate** | **Long** | true |  | Defaults to null. | 789


### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

[**List**](./models/WorkflowScheduleCalendar.md)


## **Search for Schedules**

> GET /api/v2/team/{team}/schedule/query?statuses=active,archived,types=cron,advancedCron,workflows=,limit=10,page=0


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **limit** | **Integer** | true | Result Size | Defaults to 10. | 10
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0
| **statuses** | [**List**](./models/String) | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,archived
| **types** | [**List**](./models/String) | false | List of types to filter for. Defaults to all. | Defaults to null. | cron,advancedCron
| **workflows** | [**List**](./models/String) | false | List of workflows to filter for. | Defaults to null. | 


### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

[**PageWorkflowSchedule**](./models/PageWorkflowSchedule.md)


## **Apply a Schedule.**

> PUT /api/v2/team/{team}/schedule


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowSchedule**](./models/WorkflowSchedule) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

#### Response

[**WorkflowSchedule**](./models/WorkflowSchedule.md)


## **Validate a Schedules CRON.**

> GET /api/v2/team/{team}/schedule/validate-cron?cron=cron_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **cron** | **String** | true | A CRON expression to validate | Defaults to null. | cron_example


### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

[**CronValidationResponse**](./models/CronValidationResponse.md)

