---
title: Team Management Route
---

# Team Management Route

| Name | Method | Endpoint |
|------------- | ------------- | -------------|
| [**Create new team**](#create-new-team) | POST | `/api/v2/team` |
| [**Delete Approver Groups**](#delete-approver-groups) | DELETE | `/api/v2/team/{team}/approvers` |
| [**Delete Team Parameter**](#delete-team-parameter) | DELETE | `/api/v2/team/{team}/parameters/{name}` |
| [**Delete Team**](#delete-team) | DELETE | `/api/v2/team/{team}` |
| [**Retrieve Default Team Quota**](#retrieve-default-team-quota) | GET | `/api/v2/team/quotas/default` |
| [**Retrieve Team Roles**](#retrieve-team-roles) | GET | `/api/v2/team/roles` |
| [**Get team**](#get-team) | GET | `/api/v2/team/{team}` |
| [**Search for Teams**](#search-for-teams) | GET | `/api/v2/team/query` |
| [**Leave Team**](#leave-team) | DELETE | `/api/v2/team/{team}/leave` |
| [**Remove Team Members**](#remove-team-members) | DELETE | `/api/v2/team/{team}/members` |
| [**Reset Team Quota**](#reset-team-quota) | DELETE | `/api/v2/team/{team}/quotas` |
| [**Patch or update a team**](#patch-or-update-a-team) | PATCH | `/api/v2/team/{team}` |
| [**Validate team name and check uniqueness.**](#validate-team-name-and-check-uniqueness) | POST | `/api/v2/team/validate-name` |



## **Create new team**

> POST /api/v2/team


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**TeamRequest**](./models/TeamRequest) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**Team**](./models/Team)


## **Delete Approver Groups**

> DELETE /api/v2/team/{team}/approvers


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Team as owner reference. | Defaults to null. | team_example


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**List**](./models/string) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

null (empty response body)


## **Delete Team Parameter**

> DELETE /api/v2/team/{team}/parameters/{name}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Team as owner reference. | Defaults to null. | team_example
| **name** | **String** | true |  | Defaults to null. | name_example


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


## **Delete Team**

> DELETE /api/v2/team/{team}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | ID of Team | Defaults to null. | team_example


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


## **Retrieve Default Team Quota**

> GET /api/v2/team/quotas/default


#### Request Parameters
This endpoint does not need any parameter.


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Quotas**](./models/Quotas)


## **Retrieve Team Roles**

> GET /api/v2/team/roles


#### Request Parameters
This endpoint does not need any parameter.


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**List**](./models/Role)


## **Get team**

> GET /api/v2/team/{team}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Team as owner reference. | Defaults to null. | my-amazing-team


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**Team**](./models/Team)


## **Search for Teams**

> GET /api/v2/team/query?labels=,statuses=active,inactive,teams=my-amazing-team,boomerangs-return,limit=10,page=0,order=0,sort=0


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **limit** | **Integer** | true | Result Size | Defaults to null. | 10
| **page** | **Integer** | true | Page Number | Defaults to null. | 0
| **labels** | [**List**](./models/String) | false | List of url encoded labels. For example Organization&#x3D;Boomerang,customKey&#x3D;test would be encoded as Organization%3DBoomerang,customKey%3Dtest) | Defaults to null. | 
| **statuses** | [**List**](./models/String) | false | List of statuses to filter for. Defaults to all. | Defaults to null. | active,inactive
| **teams** | [**List**](./models/String) | false | List of Team names to filter for. | Defaults to null. | my-amazing-team,boomerangs-return
| **order** | **String** | false | Ascending or Descending (default) order | Defaults to Optional[DESC]. Enum: [ASC, DESC] | 0
| **sort** | **String** | false | The element to sort on | Defaults to Optional[name]. | 0


#### Request Body
This endpoint does not require a request body.

#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageTeam**](./models/PageTeam)


## **Leave Team**

> DELETE /api/v2/team/{team}/leave


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Team as owner reference. | Defaults to null. | team_example


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


## **Remove Team Members**

> DELETE /api/v2/team/{team}/members


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Team as owner reference. | Defaults to null. | my-amazing-team


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**List**](./models/TeamMember) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

null (empty response body)


## **Reset Team Quota**

> DELETE /api/v2/team/{team}/quotas


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | Team as owner reference. | Defaults to null. | team_example


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


## **Patch or update a team**

> PATCH /api/v2/team/{team}


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|
| **team** | **String** | true | ID of Team | Defaults to null. | team_example


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**TeamRequest**](./models/TeamRequest) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

[**Team**](./models/Team)


## **Validate team name and check uniqueness.**

> POST /api/v2/team/validate-name


#### Request Parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | --- |---|


#### Request Body
| Schema | Required | 
| ------ | --- | 
| [**TeamNameCheckRequest**](./models/TeamNameCheckRequest) | true |


#### Authorization

> Note: this section and the documentation around what is required is still actively being updated.

No authorization required

#### Request Headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

**Object**

