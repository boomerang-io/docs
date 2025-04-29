---
title: Actions Route
---

# Actions Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Provide an update for an Action**](#provideanupdateforan-action) | PUT | `/api/v2/team/{team}/action` |
| [**Retrieve a specific Action by Id**](#retrieveaspecific-actionby-id) | GET | `/api/v2/team/{team}/action/{actionId}` |
| [**Search for Actions**](#searchfor-actions) | GET | `/api/v2/team/{team}/action/query` |
| [**Get Actions Summary**](#get-actions-summary) | GET | `/api/v2/team/{team}/action/summary` |


<a name="action"></a>

## **Provide an update for an Action**

> PUT /api/v2/team/{team}/action


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**List**](./models/ActionRequest) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: Not defined

### Response

null (empty response body)

<a name="get3"></a>

## **Retrieve a specific Action by Id**

> GET /api/v2/team/{team}/action/{actionId}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **actionId** | **String** | true | ID of Action | Defaults to null. | actionId_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**Action**](./models/Action.md)

<a name="query4"></a>

## **Search for Actions**

> GET /api/v2/team/{team}/action/query?types=manual,approval,statuses=approved,rejected,submitted,workflows=,limit=10,page=0,order=0,sort=0,fromDate=1677589200000,toDate=1680267600000


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **limit** | **Integer** | true | Result Size | Defaults to 10. | 10
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0
| **types** | [**List**](./models/String) | false | List of types to filter for. Defaults to all. | Defaults to null. Enum: [approval, manual] | manual,approval
| **statuses** | [**List**](./models/String) | false | List of statuses to filter for. Defaults to all. | Defaults to null. Enum: [approved, submitted, rejected, cancelled] | approved,rejected,submitted
| **workflows** | [**List**](./models/String) | false | List of workflows to filter for. | Defaults to null. | 
| **order** | **String** | false | Ascending or Descending (default) order | Defaults to Optional[DESC]. Enum: [ASC, DESC] | 0
| **sort** | **String** | false | The element to sort on | Defaults to Optional[creationDate]. | 0
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch | Defaults to null. | 1677589200000
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch | Defaults to null. | 1680267600000


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**PageAction**](./models/PageAction.md)

<a name="summary"></a>

## **Get Actions Summary**

> GET /api/v2/team/{team}/action/summary?workflows=,fromDate=1677589200000,toDate=1680267600000


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **workflows** | [**List**](./models/String) | false | List of workflows to filter for. | Defaults to null. | 
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch | Defaults to null. | 1677589200000
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch | Defaults to null. | 1680267600000


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**ActionSummary**](./models/ActionSummary.md)

