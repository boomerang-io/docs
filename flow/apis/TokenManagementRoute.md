---
title: Token Management Route
---

# Token Management Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Create Token**](#createToken) | POST | `/api/v2/token` |
| [**Delete Token**](#deleteToken) | DELETE | `/api/v2/token/{id}` |
| [**Search for Tokens**](#query1) | GET | `/api/v2/token/query` |


<a name="createToken"></a>

## **Create Token**

> POST /api/v2/token


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**TokenCreateRequest**](./Models/TokenCreateRequest) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**TokenCreateResponse**](./Models/TokenCreateResponse.md)

<a name="deleteToken"></a>

## **Delete Token**

> DELETE /api/v2/token/{id}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **id** | **String** | true | ID of the Token | Defaults to null. | id_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

**Object**

<a name="query1"></a>

## **Search for Tokens**

> GET /api/v2/token/query?types=,principals=,limit=10,page=0,order=ASC,sort=0,fromDate=1677589200000,toDate=1680267600000


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **order** | **String** | true | Ascending (ASC) or Descending (DESC) sort order on creationDate | Defaults to Optional[ASC]. Enum: [ASC, DESC] | ASC
| **types** | [**List**](./Models/String) | false | List of types to filter for. Defaults to all. | Defaults to null. Enum: [session, user, team, workflow, global] | 
| **principals** | [**List**](./Models/String) | false | List of principals to filter for. Based on the types you are querying for. | Defaults to null. | 
| **sort** | **String** | false | The element to sort onr | Defaults to Optional[creationDate]. | 0
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

[**PageToken**](./Models/PageToken.md)

