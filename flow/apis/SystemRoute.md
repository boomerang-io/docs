---
title: System Route
---

# System Route

| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Retrieve Boomerang Flow Settings**](#retrieve-boomerang-flow-settings) | GET | `/api/v2/settings` |
| [**Retrieve feature flags.**](#retrieve-feature-flags) | GET | `/api/v2/features` |
| [**Retrieve this instances context, features, and navigation.**](#retrieve-this-instances-context-features-and-navigation) | GET | `/api/v2/context` |
| [**Retrieve navigation.**](#retrieve-navigation) | GET | `/api/v2/navigation` |
| [**Register and activate an installation of Flow**](#register-and-activate-an-installation-of-flow) | PUT | `/api/v2/activate` |
| [**Update Boomerang Flow Settings**](#update-boomerang-flow-settings) | PUT | `/api/v2/settings` |



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

