---
title: Tasks Route
---

# Tasks Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Update, replace, or create new using Tekton Task YAML**](#apply12) | PUT | `/api/v2/task/{name}` |
| [**Create a new Task using Tekton Task YAML**](#create12) | POST | `/api/v2/task` |
| [**Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.**](#get41) | GET | `/api/v2/task/{name}` |
| [**Retrieve the changlog**](#getChangelog2) | GET | `/api/v2/task/{name}/changelog` |
| [**Search for Task. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates**](#query5) | GET | `/api/v2/task/query` |
| [****](#validateYaml1) | POST | `/api/v2/task/validate` |


<a name="apply12"></a>

## **Update, replace, or create new using Tekton Task YAML** {#apply12}

> PUT /api/v2/task/{name}?replace=true

The name must only contain alphanumeric and - characeters. If the name exists, apply will create a new version.

### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true | Name of Task | Defaults to null. | name_example
| **replace** | **Boolean** | false | Replace existing version | Defaults to false. | true


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**Task**](./models/Task) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json, application/x-yaml
- **Accept**: */*

### Response

[**Task**](./models/Task.md)

<a name="create12"></a>

## **Create a new Task using Tekton Task YAML** {#create12}

> POST /api/v2/task

The name needs to be unique and must only contain alphanumeric and - characeters.

### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**Task**](./models/Task) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/json, application/x-yaml
- **Accept**: */*

### Response

[**Task**](./models/Task.md)

<a name="get41"></a>

## **Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.** {#get41}

> GET /api/v2/task/{name}?version=56


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true | Name of Task | Defaults to null. | name_example
| **version** | **Integer** | false | Task Version | Defaults to null. | 56


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**Task**](./models/Task.md)

<a name="getChangelog2"></a>

## **Retrieve the changlog** {#getChangelog2}

> GET /api/v2/task/{name}/changelog

Retrieves each versions changelog and returns them all as a list.

### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true | Name of Task | Defaults to null. | name_example


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**List**](./models/ChangeLogVersion.md)

<a name="query5"></a>

## **Search for Task. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates** {#query5}

> GET /api/v2/task/query?labels=,statuses=active,inactive,names=switch,event-wait,limit=10,page=0,sort=ASC


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **sort** | **String** | true | Ascending (ASC) or Descending (DESC) sort on creationDate | Defaults to Optional[ASC]. Enum: [ASC, DESC] | ASC
| **labels** | [**List**](./models/String) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **statuses** | [**List**](./models/String) | false | List of statuses to filter for. | Defaults to null. | active,inactive
| **names** | [**List**](./models/String) | false | List of Task Names  to filter for. Defaults to all. | Defaults to null. | switch,event-wait


### Request Body
This endpoint does not require a request body.

### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

### Response

[**TaskResponsePage**](./models/TaskResponsePage.md)

<a name="validateYaml1"></a>

## **** {#validateYaml1}

> POST /api/v2/task/validate


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


### Request Body
| Schema | Required | 
| ------ | --- | 
| [**TektonTask**](./models/TektonTask) | true |


### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

### Request Headers

- **Content-Type**: application/x-yaml
- **Accept**: Not defined

### Response

null (empty response body)

