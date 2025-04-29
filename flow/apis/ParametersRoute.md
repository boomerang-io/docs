---
title: Parameters Route
---

# Parameters Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Create new global Param**](#create1) | POST | `/api/v2/parameters` |
| [**Delete specific global Param**](#delete1) | DELETE | `/api/v2/parameters/{name}` |
| [**Get all global Params**](#getAll) | GET | `/api/v2/parameters` |
| [****](#update) | PUT | `/api/v2/parameters` |



## **Create new global Param** <a name="create1"></a>

> POST /api/v2/parameters


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**AbstractParam**](./models/AbstractParam) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**AbstractParam**](./models/AbstractParam.md)


## **Delete specific global Param** <a name="delete1"></a>

> DELETE /api/v2/parameters/{name}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true |  | Defaults to null. | name_example


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


## **Get all global Params** <a name="getAll"></a>

> GET /api/v2/parameters


### Request Parameters
This endpoint does not need any parameter.


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**List**](./models/AbstractParam.md)


## **** <a name="update"></a>

> PUT /api/v2/parameters


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**AbstractParam**](./models/AbstractParam) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**AbstractParam**](./models/AbstractParam.md)

