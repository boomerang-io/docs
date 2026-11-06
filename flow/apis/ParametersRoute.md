---
title: Parameters
description: "Operations for Parameters: Create, update and delete global parameters, available to every workspace and workflow."
verified: "5.0.0-beta.39"
---

# Parameters

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Create a global Param**](#create-a-global-param) | POST | `/api/v2/parameters` |
| [**Delete a global Param**](#delete-a-global-param) | DELETE | `/api/v2/parameters/{name}` |
| [**Get all global Params**](#get-all-global-params) | GET | `/api/v2/parameters` |
| [**Update a global Param**](#update-a-global-param) | PATCH | `/api/v2/parameters/{name}` |



## Create a global Param

`POST /api/v2/parameters`

Requires the `system/write` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**AbstractParam**](./models/AbstractParam) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**AbstractParam**](./models/AbstractParam)

#### Example request

```bash
curl -X POST "$FLOW_URL/api/v2/parameters" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start POST /api/v2/parameters -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "name": "slack-channel",
  "type": "text",
  "label": "Slack channel",
  "description": "Where build notices go.",
  "value": "#builds"
}
```

#### Example response

`200 OK`:

```json
{
  "description": "Where build notices go.",
  "label": "Slack channel",
  "name": "slack-channel",
  "readOnly": false,
  "type": "text",
  "value": "#builds"
}
```

<!-- api-examples:end -->


## Delete a global Param

`DELETE /api/v2/parameters/{name}`

Requires the `system/delete` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **name** | **String** | true |  |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/parameters/$PARAMETER" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/parameters/{name} -->
#### Example response

`200 OK`, with no body.

<!-- api-examples:end -->


## Get all global Params

`GET /api/v2/parameters`

Requires the `system/read` permission, from a session, user, global token.

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

**List** of [**AbstractParam**](./models/AbstractParam)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/parameters" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/parameters -->
<!-- api-examples:end -->


## Update a global Param

`PATCH /api/v2/parameters/{name}`

A JSON Merge Patch (RFC 7396): an absent member is unchanged, null clears it, any other value replaces it. A secured value or default sent as ***** keeps the stored one.

Requires the `system/write` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **name** | **String** | true |  |  |  |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**JsonNode**](./models/JsonNode) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json, application/merge-patch+json`
- **Accept**: `*/*`

#### Response

[**AbstractParam**](./models/AbstractParam)

#### Example request

```bash
curl -X PATCH "$FLOW_URL/api/v2/parameters/$PARAMETER" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d @body.json
```

<!-- api-examples:start PATCH /api/v2/parameters/{name} -->
#### Example request body

The request sends this as `body.json`:

```json
{
  "value": "#deployments"
}
```

<!-- api-examples:end -->

