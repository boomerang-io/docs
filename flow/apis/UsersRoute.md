---
title: Users Route
---

# Users Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Update a Boomerang Flow Users details**](#apply1) | PATCH | `/api/v2/user/{userId}` |
| [**Delete a Boomerang Flow user**](#deleteFlowUser) | DELETE | `/api/v2/user/{userId}` |
| [**Get a Users details**](#getUserByID) | GET | `/api/v2/user/{userId}` |
| [**Search for Users**](#getUsers) | GET | `/api/v2/user/query` |



## **Update a Boomerang Flow Users details** <a name="apply1"></a>

> PATCH /api/v2/user/{userId}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **userId** | **String** | true |  | Defaults to null. | userId_example


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**UserRequest**](./models/UserRequest) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: Not defined

### Response

null (empty response body)


## **Delete a Boomerang Flow user** <a name="deleteFlowUser"></a>

> DELETE /api/v2/user/{userId}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **userId** | **String** | true |  | Defaults to null. | userId_example


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


## **Get a Users details** <a name="getUserByID"></a>

> GET /api/v2/user/{userId}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **userId** | **String** | true |  | Defaults to null. | userId_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**User**](./models/User.md)


## **Search for Users** <a name="getUsers"></a>

> GET /api/v2/user/query?labels=,status=active,inactive,ids=,limit=10,page=0,order=0,sort=0


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **labels** | [**List**](./models/String) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **status** | [**List**](./models/String) | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,inactive
| **ids** | [**List**](./models/String) | false | List of ids to filter for. | Defaults to null. | 
| **order** | **String** | false | Ascending or Descending (default) order | Defaults to Optional[DESC]. Enum: [ASC, DESC] | 0
| **sort** | **String** | false | The element to sort on | Defaults to Optional[name]. | 0


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**PageUser**](./models/PageUser.md)

