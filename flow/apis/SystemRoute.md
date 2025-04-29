---
title: System Route
---

# System Route

| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Create new global Param**](#create-new-global-param) | POST | `/api/v2/global-params` |
| [**Delete specific global Param**](#delete-specific-global-param) | DELETE | `/api/v2/global-params/{key}` |
| [**Get all global Params**](#get-all-global-params) | GET | `/api/v2/global-params` |
| [**Retrieve Boomerang Flow Settings**](#retrieve-boomerang-flow-settings) | GET | `/api/v2/settings` |
| [**Retrieve feature flags.**](#retrieve-feature-flags) | GET | `/api/v2/features` |
| [**Retrieve this instances context, features, and navigation.**](#retrieve-this-instances-context-features-and-navigation) | GET | `/api/v2/context` |
| [**Retrieve navigation.**](#retrieve-navigation) | GET | `/api/v2/navigation` |
| [**Register and activate an installation of Flow**](#register-and-activate-an-installation-of-flow) | PUT | `/api/v2/activate` |
| [****](#) | PUT | `/api/v2/global-params` |
| [**Update Boomerang Flow Settings**](#update-boomerang-flow-settings) | PUT | `/api/v2/settings` |



## **Create new global Param**

> POST /api/v2/global-params


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


## **Delete specific global Param**

> DELETE /api/v2/global-params/{key}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **key** | **String** | true |  | Defaults to null. | key_example


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

> GET /api/v2/global-params


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


## **Retrieve Boomerang Flow Settings**

> GET /api/v2/settings


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

[**List**](./models/Setting)


## **Retrieve feature flags.**

> GET /api/v2/features


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

[**Features**](./models/Features)


## **Retrieve this instances context, features, and navigation.**

> GET /api/v2/context


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

[**HeaderNavigationResponse**](./models/HeaderNavigationResponse)


## **Retrieve navigation.**

> GET /api/v2/navigation?team=my-amazing-team


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | false | Team as owner reference | Defaults to null. | my-amazing-team


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**List**](./models/Navigation)


## **Register and activate an installation of Flow**

> PUT /api/v2/activate


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**OneTimeCode**](./models/OneTimeCode) | false |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

**Boolean**


## ****

> PUT /api/v2/global-params


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


## **Update Boomerang Flow Settings**

> PUT /api/v2/settings


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**List**](./models/Setting) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**List**](./models/Setting)

