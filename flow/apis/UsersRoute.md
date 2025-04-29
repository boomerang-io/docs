---
title: Users Route
---

# Users Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Update a Boomerang Flow Users details**](#update-a-boomerang-flow-users-details) | PATCH | `/api/v2/user/{userId}` |
| [**Delete a Boomerang Flow user**](#delete-a-boomerang-flow-user) | DELETE | `/api/v2/user/{userId}` |
| [**Get a Users details**](#get-a-users-details) | GET | `/api/v2/user/{userId}` |
| [**Search for Users**](#search-for-users) | GET | `/api/v2/user/query` |



## **Update a Boomerang Flow Users details**

> PATCH /api/v2/user/{userId}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **userId** | **String** | true |  | Defaults to null. | userId_example


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**UserRequest**](./models/UserRequest) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json
- **Accept**: Not defined

#### Response

null (empty response body)


## **Delete a Boomerang Flow user**

> DELETE /api/v2/user/{userId}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **userId** | **String** | true |  | Defaults to null. | userId_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: Not defined

#### Response

null (empty response body)


## **Get a Users details**

> GET /api/v2/user/{userId}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **userId** | **String** | true |  | Defaults to null. | userId_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

[**User**](./models/User.md)


## **Search for Users**

> GET /api/v2/user/query?labels=,status=active,inactive,ids=,limit=10,page=0,order=0,sort=0


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **labels** | [**List**](./models/String) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **status** | [**List**](./models/String) | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,inactive
| **ids** | [**List**](./models/String) | false | List of ids to filter for. | Defaults to null. | 
| **order** | **String** | false | Ascending or Descending (default) order | Defaults to Optional[DESC]. Enum: [ASC, DESC] | 0
| **sort** | **String** | false | The element to sort on | Defaults to Optional[name]. | 0


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

[**PageUser**](./models/PageUser.md)

