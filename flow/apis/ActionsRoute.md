---
title: Actions Route
---

# Actions Route

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Provide an update for an Action**](#provide-an-update-for-an-action) | PUT | `/api/v2/workspace/{workspace}/action` |
| [**Retrieve a specific Action by Id**](#retrieve-a-specific-action-by-id) | GET | `/api/v2/workspace/{workspace}/action/{actionId}` |
| [**Search for Actions**](#search-for-actions) | GET | `/api/v2/workspace/{workspace}/action/query` |
| [**Get Actions Summary**](#get-actions-summary) | GET | `/api/v2/workspace/{workspace}/action/summary` |



## Provide an update for an Action

`PUT /api/v2/workspace/{workspace}/action`

Requires the `action/action` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |


#### Request body
| Schema | Required |
| ------ | -------- |
| **List** of [**ActionRequest**](./models/ActionRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

No response body


## Retrieve a specific Action by Id

`GET /api/v2/workspace/{workspace}/action/{actionId}`

Requires the `action/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **actionId** | **String** | true | ID of Action | Defaults to null. | actionId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Action**](./models/Action)


## Search for Actions

`GET /api/v2/workspace/{workspace}/action/query`

Requires the `action/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **limit** | **Integer** | true | Result Size | Defaults to 10. | 10 |
| **page** | **Integer** | true | Page Number | Defaults to 0. | 0 |
| **types** | **List** of **String** | false | List of types to filter for. Defaults to all. | Defaults to null. Enum: [approval, manual] | manual,approval |
| **statuses** | **List** of **String** | false | List of statuses to filter for. Defaults to all. | Defaults to null. Enum: [approved, submitted, rejected, cancelled] | approved,rejected,submitted |
| **workflows** | **List** of **String** | false | List of workflows to filter for. | Defaults to null. |  |
| **order** | **String** | false | Ascending or Descending (default) order | Defaults to DESC. Enum: [ASC, DESC] | 0 |
| **sort** | **String** | false | The element to sort on | Defaults to creationDate. | 0 |
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch | Defaults to null. | 1677589200000 |
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch | Defaults to null. | 1680267600000 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageAction**](./models/PageAction)


## Get Actions Summary

`GET /api/v2/workspace/{workspace}/action/summary`

Requires the `action/read` permission, from a session, user, key, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | my-amazing-workspace |
| **workflows** | **List** of **String** | false | List of workflows to filter for. | Defaults to null. |  |
| **statuses** | **List** of **String** | false | Statuses to count. Defaults to submitted (waiting). | Defaults to null. Enum: [approved, submitted, rejected, cancelled] |  |
| **fromDate** | **Long** | false | The unix timestamp / date to search from in milliseconds since epoch | Defaults to null. | 1677589200000 |
| **toDate** | **Long** | false | The unix timestamp / date to search to in milliseconds since epoch | Defaults to null. | 1680267600000 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**ActionSummary**](./models/ActionSummary)

