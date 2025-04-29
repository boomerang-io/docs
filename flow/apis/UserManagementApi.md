---
title: UserManagement
---

# UserManagement



| Name | Method | Endpoint |
|------------- | ------------- | -------------|

| [**Update a Boomerang Flow Users details**](#apply1) | PATCH | `/api/v2/user/{userId}` |

| [**Delete a Boomerang Flow user**](#deleteFlowUser) | DELETE | `/api/v2/user/{userId}` |

| [**Get your Profile**](#getProfile) | GET | `/api/v2/profile` |

| [**Get a Users details**](#getUserByID) | GET | `/api/v2/user/{userId}` |

| [**Search for Users**](#getUsers) | GET | `/api/v2/user/query` |

| [**Patch your Profile**](#updateProfile) | PATCH | `/api/v2/profile` |


<a name="apply1"></a>
## **Update a Boomerang Flow Users details**

> PATCH /api/v2/user/{userId}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **userId** | **String** | true |  | Defaults to null. | userId_example

### Request Body
| Schema | Required | 
| ------ | --- | 
| [**UserRequest**](../Models/UserRequest.md) | true |


### Authorization

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: Not defined

### Response

null (empty response body)

<a name="deleteFlowUser"></a>
## **Delete a Boomerang Flow user**

> DELETE /api/v2/user/{userId}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **userId** | **String** | true |  | Defaults to null. | userId_example

### Request Body
This endpoint does not require a request body.

### Authorization

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: Not defined

### Response

null (empty response body)

<a name="getProfile"></a>
## **Get your Profile**

> GET /api/v2/profile


### Request Parameters
This endpoint does not need any parameter.

### Request Body
This endpoint does not require a request body.

### Authorization

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**UserProfile**](../Models/UserProfile.md)

<a name="getUserByID"></a>
## **Get a Users details**

> GET /api/v2/user/{userId}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **userId** | **String** | true |  | Defaults to null. | userId_example

### Request Body
This endpoint does not require a request body.

### Authorization

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**User**](../Models/User.md)

<a name="getUsers"></a>
## **Search for Users**

> GET /api/v2/user/query?labels=, status=active,inactive, ids=, limit=10, page=0, order=0, sort=0


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **labels** | [**List**](../Models/String.md) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **status** | [**List**](../Models/String.md) | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,inactive
| **ids** | [**List**](../Models/String.md) | false | List of ids to filter for. | Defaults to null. | 
| **order** | **String** | false | Ascending or Descending (default) order | Defaults to Optional[DESC]. Enum: [ASC, DESC] | 0
| **sort** | **String** | false | The element to sort on | Defaults to Optional[name]. | 0

### Request Body
This endpoint does not require a request body.

### Authorization

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**PageUser**](../Models/PageUser.md)

<a name="updateProfile"></a>
## **Patch your Profile**

> PATCH /api/v2/profile


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|

### Request Body
| Schema | Required | 
| ------ | --- | 
| [**UserRequest**](../Models/UserRequest.md) | true |


### Authorization

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: Not defined

### Response

null (empty response body)

