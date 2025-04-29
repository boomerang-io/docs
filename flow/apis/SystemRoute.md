---
title: System Route
---

# System Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Create new global Param**](#create2) | POST | `/api/v2/global-params` |
| [**Delete specific global Param**](#delete2) | DELETE | `/api/v2/global-params/{key}` |
| [**Get all global Params**](#getAll1) | GET | `/api/v2/global-params` |
| [**Retrieve Boomerang Flow Settings**](#getAppConfiguration) | GET | `/api/v2/settings` |
| [**Retrieve feature flags.**](#getFlowFeatures) | GET | `/api/v2/features` |
| [**Retrieve this instances context, features, and navigation.**](#getHeaderNavigation) | GET | `/api/v2/context` |
| [**Retrieve navigation.**](#getNavigation) | GET | `/api/v2/navigation` |
| [**Register and activate an installation of Flow**](#register) | PUT | `/api/v2/activate` |
| [****](#update1) | PUT | `/api/v2/global-params` |
| [**Update Boomerang Flow Settings**](#updateSettings) | PUT | `/api/v2/settings` |



## **Create new global Param**<a href="#create2"></a>

> POST /api/v2/global-params


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


## **Delete specific global Param**<a href="#delete2"></a>

> DELETE /api/v2/global-params/{key}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **key** | **String** | true |  | Defaults to null. | key_example


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


## **Get all global Params**<a href="#getAll1"></a>

> GET /api/v2/global-params


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


## **Retrieve Boomerang Flow Settings**<a href="#getAppConfiguration"></a>

> GET /api/v2/settings


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

[**List**](./models/Setting.md)


## **Retrieve feature flags.**<a href="#getFlowFeatures"></a>

> GET /api/v2/features


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

[**Features**](./models/Features.md)


## **Retrieve this instances context, features, and navigation.**<a href="#getHeaderNavigation"></a>

> GET /api/v2/context


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

[**HeaderNavigationResponse**](./models/HeaderNavigationResponse.md)


## **Retrieve navigation.**<a href="#getNavigation"></a>

> GET /api/v2/navigation?team=my-amazing-team


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | false | Team as owner reference | Defaults to null. | my-amazing-team


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**List**](./models/Navigation.md)


## **Register and activate an installation of Flow**<a href="#register"></a>

> PUT /api/v2/activate


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**OneTimeCode**](./models/OneTimeCode) | false |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

**Boolean**


## ****<a href="#update1"></a>

> PUT /api/v2/global-params


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


## **Update Boomerang Flow Settings**<a href="#updateSettings"></a>

> PUT /api/v2/settings


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**List**](./models/Setting) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**List**](./models/Setting.md)

