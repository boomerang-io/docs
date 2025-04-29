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


<a name="create2"></a>

## **Create new global Param**

> POST /api/v2/global-params


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**AbstractParam**](../Models/AbstractParam) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**AbstractParam**](../Models/AbstractParam.md)

<a name="delete2"></a>

## **Delete specific global Param**

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

<a name="getAll1"></a>

## **Get all global Params**

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

[**List**](../Models/AbstractParam.md)

<a name="getAppConfiguration"></a>

## **Retrieve Boomerang Flow Settings**

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

[**List**](../Models/Setting.md)

<a name="getFlowFeatures"></a>

## **Retrieve feature flags.**

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

[**Features**](../Models/Features.md)

<a name="getHeaderNavigation"></a>

## **Retrieve this instances context, features, and navigation.**

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

[**HeaderNavigationResponse**](../Models/HeaderNavigationResponse.md)

<a name="getNavigation"></a>

## **Retrieve navigation.**

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

[**List**](../Models/Navigation.md)

<a name="register"></a>

## **Register and activate an installation of Flow**

> PUT /api/v2/activate


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**OneTimeCode**](../Models/OneTimeCode) | false |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

**Boolean**

<a name="update1"></a>

## ****

> PUT /api/v2/global-params


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**AbstractParam**](../Models/AbstractParam) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**AbstractParam**](../Models/AbstractParam.md)

<a name="updateSettings"></a>

## **Update Boomerang Flow Settings**

> PUT /api/v2/settings


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**List**](../Models/Setting) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**List**](../Models/Setting.md)

