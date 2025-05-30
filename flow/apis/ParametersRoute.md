---
title: Parameters Route
---

# Parameters Route

| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Create a global Param**](#create-a-global-param) | POST | `/api/v2/parameters` |
| [**Delete a global Param**](#delete-a-global-param) | DELETE | `/api/v2/parameters/{name}` |
| [**Get all global Params**](#get-all-global-params) | GET | `/api/v2/parameters` |
| [**Update global Params**](#update-global-params) | PUT | `/api/v2/parameters` |



## **Create a global Param**

> POST /api/v2/parameters


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**AbstractParam**](./models/AbstractParam) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**AbstractParam**](./models/AbstractParam)


## **Delete a global Param**

> DELETE /api/v2/parameters/{name}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true |  | Defaults to null. | name_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

null (empty response body)


## **Get all global Params**

> GET /api/v2/parameters


#### Request Parameters
This endpoint does not need any parameter.


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**List**](./models/AbstractParam)


## **Update global Params**

> PUT /api/v2/parameters


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**AbstractParam**](./models/AbstractParam) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**AbstractParam**](./models/AbstractParam)

