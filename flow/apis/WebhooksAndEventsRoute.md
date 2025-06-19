---
title: Webhooks And Events Route
---

# Webhooks And Events Route

| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Accept CloudEvent**](#accept-cloud-event) | POST | `/api/v2/event` |
| [**Accept Wait for Event Callback with JSON Payload**](#accept-wait-for-event-callback-with-json-payload) | POST | `/api/v2/callback` |
| [**Accept Wait for Event Callbcak**](#accept-wait-for-event-callbcak) | GET | `/api/v2/callback` |
| [**Accept Webhook payloads from various sources.**](#accept-webhook-payloads-from-various-sources) | POST | `/api/v2/webhook` |



## **Accept CloudEvent**

> POST /api/v2/event?ref=ref_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **ref** | **String** | false | The Workflow reference the request relates to | Defaults to null. | ref_example


#### Request Body
| Schema | Required | 
| ------ | --- | 
| **String** | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json, application/cloudevents+json;charset=utf-8, application/cloudevents+json; charset=utf-8`
- **Accept**: `*/*`

#### Response

**Object**


## **Accept Wait for Event Callback with JSON Payload**

> POST /api/v2/callback?ref=ref_example,topic=topic_example,status=status_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **ref** | **String** | true | The WorkflowRun reference the request relates to | Defaults to null. | ref_example
| **topic** | **String** | true | The topic to publish to | Defaults to null. | topic_example
| **status** | **String** | false | The status to set for the WaitForEvent TaskRun. Succeeded | Failed. | Defaults to succeeded. | status_example


#### Request Body
| Schema | Required | 
| ------ | --- | 
| **Object** | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json;charset=utf-8, application/json; charset=utf-8`
- **Accept**: `Not defined`

#### Response

null (empty response body)


## **Accept Wait for Event Callbcak**

> GET /api/v2/callback?ref=ref_example,topic=topic_example,status=status_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **ref** | **String** | true | The WorkflowRun reference the request relates to | Defaults to null. | ref_example
| **topic** | **String** | true | The topic to publish to | Defaults to null. | topic_example
| **status** | **String** | false | The status to set for the WaitForEvent TaskRun. Succeeded | Failed. | Defaults to succeeded. | status_example


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


## **Accept Webhook payloads from various sources.**

> POST /api/v2/webhook?ref=ref_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **ref** | **String** | false | Workflow reference the request relates to | Defaults to null. | ref_example
| **X-GitHub-Event** | **String** | false |  | Defaults to null. | X-GitHub-Event_example
| **X-GitHub-Hook-Installation-Target-ID** | **String** | false |  | Defaults to null. | X-GitHub-Hook-Installation-Target-ID_example
| **x-slack-signature** | **String** | false |  | Defaults to null. | x-slack-signature_example


#### Request Body
| Schema | Required | 
| ------ | --- | 
| **Object** | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json;charset=utf-8, application/json; charset=utf-8`
- **Accept**: `*/*`

#### Response

**Object**

