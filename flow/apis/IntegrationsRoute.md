---
title: Integrations Route
---

# Integrations Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Retrieve the integrations and their status within a Team**](#get4) | GET | `/api/v2/integration` |
| [**Retrieve the installation ID and store against a team**](#githubInstall) | GET | `/api/v2/integration/github/installation` |
| [**Links the GitHub Installation ID with a Team**](#githubLink) | POST | `/api/v2/integration/github/link` |
| [**Unlinks the GitHub Installation ID from a Team**](#githubUnlink) | POST | `/api/v2/integration/github/unlink` |
| [**Install URL Redirect**](#installSlack) | GET | `/api/v2/integration/slack/install` |
| [**Receive Slack Oauth2 request**](#receiveSlackAuth) | GET | `/api/v2/integration/slack/auth` |
| [**Receive Slack Slash Commands**](#receiveSlackCommand) | POST | `/api/v2/integration/slack/commands` |
| [**Receive Slack Events**](#receiveSlackEvent) | POST | `/api/v2/integration/slack/events` |
| [**Receive Slack Interactivity**](#receiveSlackInteractivity) | POST | `/api/v2/integration/slack/interactivity` |


<a name="get4"></a>

## **Retrieve the integrations and their status within a Team**

> GET /api/v2/integration?team=team_example


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true |  | Defaults to null. | team_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**List**](../Models/Integration.md)

<a name="githubInstall"></a>

## **Retrieve the installation ID and store against a team**

> GET /api/v2/integration/github/installation?id=56,team=team_example


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **id** | **Integer** | false |  | Defaults to null. | 56
| **team** | **String** | false |  | Defaults to null. | team_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

**Object**

<a name="githubLink"></a>

## **Links the GitHub Installation ID with a Team**

> POST /api/v2/integration/github/link


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**GHLinkRequest**](../Models/GHLinkRequest) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

**Object**

<a name="githubUnlink"></a>

## **Unlinks the GitHub Installation ID from a Team**

> POST /api/v2/integration/github/unlink


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**GHLinkRequest**](../Models/GHLinkRequest) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: Not defined

### Response

null (empty response body)

<a name="installSlack"></a>

## **Install URL Redirect**

> GET /api/v2/integration/slack/install


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

null (empty response body)

<a name="receiveSlackAuth"></a>

## **Receive Slack Oauth2 request**

> GET /api/v2/integration/slack/auth?code=code_example


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **code** | **String** | true |  | Defaults to null. | code_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

**Object**

<a name="receiveSlackCommand"></a>

## **Receive Slack Slash Commands**

> POST /api/v2/integration/slack/commands


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

**Object**

<a name="receiveSlackEvent"></a>

## **Receive Slack Events**

> POST /api/v2/integration/slack/events


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **x-slack-request-timestamp** | **String** | true |  | Defaults to null. | x-slack-request-timestamp_example
| **x-slack-signature** | **String** | true |  | Defaults to null. | x-slack-signature_example


### Request Body
| Schema | Required | 
| ------ | --- | 
| **Object** | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

**Object**

<a name="receiveSlackInteractivity"></a>

## **Receive Slack Interactivity**

> POST /api/v2/integration/slack/interactivity


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

**Object**

