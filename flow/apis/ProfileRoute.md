---
title: Profile Route
---

# Profile Route

| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Get your Profile**](#get-your-profile) | GET | `/api/v2/profile` |
| [**Patch your Profile**](#patch-your-profile) | PATCH | `/api/v2/profile` |



## **Get your Profile**

> GET /api/v2/profile


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

[**UserProfile**](./models/UserProfile)


## **Patch your Profile**

> PATCH /api/v2/profile


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**UserRequest**](./models/UserRequest) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

null (empty response body)

