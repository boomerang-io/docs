---
title: Parameters Route
---

# Parameters Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Create new global Param**](#Create new global Param) | POST | `/api/v2/parameters` |
| [**Delete specific global Param**](#Delete specific global Param) | DELETE | `/api/v2/parameters/{name}` |
| [**Get all global Params**](#Get all global Params) | GET | `/api/v2/parameters` |
| [****](#) | PUT | `/api/v2/parameters` |


<a name="create1"></a>

## **Create new global Param**

> POST /api/v2/parameters


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**AbstractParam**](./models/AbstractParam) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

#### Response

[**AbstractParam**](./models/AbstractParam.md)

<a name="delete1"></a>

## **Delete specific global Param**

> DELETE /api/v2/parameters/{name}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true |  | Defaults to null. | name_example


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

<a name="getAll"></a>

## **Get all global Params**

> GET /api/v2/parameters


#### Request Parameters
This endpoint does not need any parameter.


### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

[**List**](./models/AbstractParam.md)

<a name="update"></a>

## ****

> PUT /api/v2/parameters


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**AbstractParam**](./models/AbstractParam) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

#### Response

[**AbstractParam**](./models/AbstractParam.md)

