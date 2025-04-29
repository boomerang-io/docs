---
title: Integrations Route
---

# Integrations Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Retrieve the integrations and their status within a Team**](#retrieve-the-integrations-and-their-status-within-a-team) | GET | `/api/v2/integration` |
| [**Retrieve the installation ID and store against a team**](#retrieve-the-installation-id-and-store-against-a-team) | GET | `/api/v2/integration/github/installation` |
| [**Links the GitHub Installation ID with a Team**](#links-the-git-hub-installation-id-with-a-team) | POST | `/api/v2/integration/github/link` |
| [**Unlinks the GitHub Installation ID from a Team**](#unlinks-the-git-hub-installation-id-from-a-team) | POST | `/api/v2/integration/github/unlink` |
| [**Install URL Redirect**](#install-url-redirect) | GET | `/api/v2/integration/slack/install` |
| [**Receive Slack Oauth2 request**](#receive-slack-oauth2-request) | GET | `/api/v2/integration/slack/auth` |
| [**Receive Slack Slash Commands**](#receive-slack-slash-commands) | POST | `/api/v2/integration/slack/commands` |
| [**Receive Slack Events**](#receive-slack-events) | POST | `/api/v2/integration/slack/events` |
| [**Receive Slack Interactivity**](#receive-slack-interactivity) | POST | `/api/v2/integration/slack/interactivity` |



## **Retrieve the integrations and their status within a Team**

> GET /api/v2/integration?team=team_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true |  | Defaults to null. | team_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

[**List**](./models/Integration.md)


## **Retrieve the installation ID and store against a team**

> GET /api/v2/integration/github/installation?id=56,team=team_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **id** | **Integer** | false |  | Defaults to null. | 56
| **team** | **String** | false |  | Defaults to null. | team_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

**Object**


## **Links the GitHub Installation ID with a Team**

> POST /api/v2/integration/github/link


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**GHLinkRequest**](./models/GHLinkRequest) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

#### Response

**Object**


## **Unlinks the GitHub Installation ID from a Team**

> POST /api/v2/integration/github/unlink


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**GHLinkRequest**](./models/GHLinkRequest) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json
- **Accept**: Not defined

#### Response

null (empty response body)


## **Install URL Redirect**

> GET /api/v2/integration/slack/install


#### Request Parameters
This endpoint does not need any parameter.


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

null (empty response body)


## **Receive Slack Oauth2 request**

> GET /api/v2/integration/slack/auth?code=code_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **code** | **String** | true |  | Defaults to null. | code_example


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

**Object**


## **Receive Slack Slash Commands**

> POST /api/v2/integration/slack/commands


#### Request Parameters
This endpoint does not need any parameter.


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

**Object**


## **Receive Slack Events**

> POST /api/v2/integration/slack/events


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **x-slack-request-timestamp** | **String** | true |  | Defaults to null. | x-slack-request-timestamp_example
| **x-slack-signature** | **String** | true |  | Defaults to null. | x-slack-signature_example


#### Request Body
| Schema | Required | 
| ------ | --- | 
| **Object** | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

#### Response

**Object**


## **Receive Slack Interactivity**

> POST /api/v2/integration/slack/interactivity


#### Request Parameters
This endpoint does not need any parameter.


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

**Object**

