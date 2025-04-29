---
title: Team Tasks Route
---

# Team Tasks Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Update, replace, or create new using Tekton Task YAML**](#apply11) | PUT | `/api/v2/team/{team}/task/{name}` |
| [**Create a new Task Template using Tekton Task YAML**](#create11) | POST | `/api/v2/team/{team}/task` |
| [**Delete a Team Task**](#delete) | DELETE | `/api/v2/team/{team}/task/{name}` |
| [**Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.**](#get21) | GET | `/api/v2/team/{team}/task/{name}` |
| [**Retrieve the changlog**](#getChangelog1) | GET | `/api/v2/team/{team}/task/{name}/changelog` |
| [**Search for Tasks. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates**](#queryTaskTemplates) | GET | `/api/v2/team/{team}/task/query` |
| [****](#validateYaml) | POST | `/api/v2/team/{team}/task/validate` |


<a name="apply11"></a>

## **Update, replace, or create new using Tekton Task YAML** {#apply11}

> PUT /api/v2/team/{team}/task/{name}?replace=true

The name must only contain alphanumeric and - characeters. If the name exists, apply will create a new version.

### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true | Name of Task | Defaults to null. | name_example
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
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

<a name="create11"></a>

## **Create a new Task Template using Tekton Task YAML** {#create11}

> POST /api/v2/team/{team}/task

The name needs to be unique and must only contain alphanumeric and - characeters.

### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team


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

<a name="delete"></a>

## **Delete a Team Task** {#delete}

> DELETE /api/v2/team/{team}/task/{name}


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **name** | **String** | true | Name of Task | Defaults to null. | name_example


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

<a name="get21"></a>

## **Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.** {#get21}

> GET /api/v2/team/{team}/task/{name}?version=56


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **name** | **String** | true | Name of Task | Defaults to null. | name_example
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
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

<a name="getChangelog1"></a>

## **Retrieve the changlog** {#getChangelog1}

> GET /api/v2/team/{team}/task/{name}/changelog

Retrieves each versions changelog and returns them all as a list.

### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
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

<a name="queryTaskTemplates"></a>

## **Search for Tasks. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates** {#queryTaskTemplates}

> GET /api/v2/team/{team}/task/query?labels=,statuses=active,inactive,names=switch,event-wait,limit=10,page=0,sort=ASC


### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
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

<a name="validateYaml"></a>

## **** {#validateYaml}

> POST /api/v2/team/{team}/task/validate


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

