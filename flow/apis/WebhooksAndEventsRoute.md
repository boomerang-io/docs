---
title: Webhooks And Events Route
---

# Webhooks And Events Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [****](#) | POST | `/api/v2/event` |
| [****](#) | POST | `/api/v2/callback` |
| [****](#) | GET | `/api/v2/callback` |
| [**Trigger WorkflowRun via Webhook.**](#trigger-workflow-run-via-webhook) | POST | `/api/v2/webhook` |



## ****

> POST /api/v2/event?workflow=workflow_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **workflow** | **String** | false | The Workflow the request relates to | Defaults to null. | workflow_example


### Request Body
| Schema | Required | 
| ------ | --- | 
| **String** | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json, application/cloudevents+json;charset=utf-8, application/cloudevents+json; charset=utf-8
- **Accept**: */*

#### Response

**Object**


## ****

> POST /api/v2/callback?workflowrun=workflowrun_example,topic=topic_example,status=status_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **workflowrun** | **String** | true | The WorkflowRun the request relates to | Defaults to null. | workflowrun_example
| **topic** | **String** | true | The topic to publish to | Defaults to null. | topic_example
| **status** | **String** | false | The status to set for the WaitForEvent TaskRun. Succeeded | Failed. | Defaults to succeeded. | status_example


### Request Body
| Schema | Required | 
| ------ | --- | 
| **Object** | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json;charset=utf-8, application/json; charset=utf-8
- **Accept**: Not defined

#### Response

null (empty response body)


## ****

> GET /api/v2/callback?workflowrun=workflowrun_example,topic=topic_example,status=status_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **workflowrun** | **String** | true | The WorkflowRun the request relates to | Defaults to null. | workflowrun_example
| **topic** | **String** | true | The topic to publish to | Defaults to null. | topic_example
| **status** | **String** | false | The status to set for the WaitForEvent TaskRun. Succeeded | Failed. | Defaults to succeeded. | status_example


### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: Not defined

#### Response

null (empty response body)


## **Trigger WorkflowRun via Webhook.**

> POST /api/v2/webhook?workflow=workflow_example


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **workflow** | **String** | false | Workflow reference the request relates to | Defaults to null. | workflow_example


### Request Body
| Schema | Required | 
| ------ | --- | 
| **Object** | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: application/json;charset=utf-8, application/json; charset=utf-8
- **Accept**: */*

#### Response

**Object**

