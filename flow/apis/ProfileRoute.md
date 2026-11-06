---
title: Profile
description: "Operations for Profile: Retrieve your profile and update your details."
verified: "5.0.0-beta.39"
---

# Profile

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Get your Profile**](#get-your-profile) | GET | `/api/v2/profile` |
| [**Patch your Profile**](#patch-your-profile) | PATCH | `/api/v2/profile` |



## Get your Profile

`GET /api/v2/profile`

Requires the `user/read` permission, from a session, user token.

#### Request parameters
This endpoint does not need any parameter.


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**UserProfile**](./models/UserProfile)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/profile" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/profile -->
<!-- api-examples:end -->


## Patch your Profile

`PATCH /api/v2/profile`

Requires the `user/write` permission, from a session, user token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**UserRequest**](./models/UserRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X PATCH "$FLOW_URL/api/v2/profile" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

<!-- api-examples:start PATCH /api/v2/profile -->
<!-- api-examples:end -->

