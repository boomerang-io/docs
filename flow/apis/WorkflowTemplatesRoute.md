---
title: Workflow Templates Route
---

# Workflow Templates Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Update, replace, or create new, Workflow Template**](#updatereplaceorcreatenew-workflow-template) | PUT | `/api/v2/workflowtemplate` |
| [**Create a new Workflow Template**](#createanew-workflow-template) | POST | `/api/v2/workflowtemplate` |
| [**Delete a Workflow Template**](#deletea-workflow-template) | DELETE | `/api/v2/workflowtemplate/{name}` |
| [**Retrieve a Workflow Template**](#retrievea-workflow-template) | GET | `/api/v2/workflowtemplate/{name}` |
| [**Search for Workflow Templates**](#searchfor-workflow-templates) | GET | `/api/v2/workflowtemplate/query` |


<a name="apply"></a>

## **Update, replace, or create new, Workflow Template**

> PUT /api/v2/workflowtemplate?replace=true


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **replace** | **Boolean** | false | Replace existing version | Defaults to false. | true


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowTemplate**](./models/WorkflowTemplate) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**WorkflowTemplate**](./models/WorkflowTemplate.md)

<a name="create"></a>

## **Create a new Workflow Template**

> POST /api/v2/workflowtemplate


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**WorkflowTemplate**](./models/WorkflowTemplate) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json
- **Accept**: */*

### Response

[**WorkflowTemplate**](./models/WorkflowTemplate.md)

<a name="deleteWorkflow"></a>

## **Delete a Workflow Template**

> DELETE /api/v2/workflowtemplate/{name}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true | Name of Workflow Template | Defaults to null. | name_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: Not defined

### Response

null (empty response body)

<a name="get"></a>

## **Retrieve a Workflow Template**

> GET /api/v2/workflowtemplate/{name}?version=56,withTasks=true

Retrieve a version of the Workflow Template. Defaults to latest. Optionally without Tasks

### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true | Name of Workflow Template | Defaults to null. | name_example
| **version** | **Integer** | false | Workflow Template Version | Defaults to null. | 56
| **withTasks** | **Boolean** | false | Include Tasks | Defaults to true. | true


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**WorkflowTemplate**](./models/WorkflowTemplate.md)

<a name="query"></a>

## **Search for Workflow Templates**

> GET /api/v2/workflowtemplate/query?labels=,names=mongodb-email-query-results,limit=10,page=0,sort=ASC


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **sort** | **String** | true | Ascending (ASC) or Descending (DESC) sort on creationDate | Defaults to Optional[ASC]. Enum: [ASC, DESC] | ASC
| **labels** | [**List**](./models/String) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **names** | [**List**](./models/String) | false | List of WorkflowTemplate names to filter for. Defaults to all. | Defaults to null. | mongodb-email-query-results


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**WorkflowTemplateResponsePage**](./models/WorkflowTemplateResponsePage.md)

