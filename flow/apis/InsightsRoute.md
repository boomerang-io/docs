---
title: Insights Route
---

# Insights Route




| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Retrieve insights for a team**](#Retrieve insights for a team) | GET | `/api/v2/team/{team}/insights` |


<a name="getTeamInsights"></a>

## **Retrieve insights for a team**

> GET /api/v2/team/{team}/insights?fromDate=789,toDate=789,workflows=,statuses=

The insights are based on the workflow runs and their statuses.

#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Owning team name. | Defaults to null. | my-amazing-team
| **fromDate** | **Long** | false |  | Defaults to null. | 789
| **toDate** | **Long** | false |  | Defaults to null. | 789
| **workflows** | [**List**](./models/String) | false |  | Defaults to null. | 
| **statuses** | [**List**](./models/String) | false |  | Defaults to null. | 


### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: Not defined
- **Accept**: */*

#### Response

[**WorkflowRunInsight**](./models/WorkflowRunInsight.md)

