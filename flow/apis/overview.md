---
title: Overview
order: 1
---

# Overview

We expose a series of RESTFul APIs that allows management and extensibility of every aspect of the system, driven via an API first design.

## Authentication

> Please refer to [security architecture](../architecture/security#tokens) for further guidance.

APIs that required authentication, can use an appropriately scoped token in the following ways:

<a name="BearerAuth"></a>
### BearerAuth

- **Type**: HTTP Bearer Token authentication (JWT)

<a name="x-access-token"></a>
### x-access-token

- **Type**: API key
- **API key parameter name**: x-access-token
- **Location**: HTTP header



<a name="routes"></a>

## Routes


### Actions

| Method | Route | 
| ------------- | ------------- |
| [**Provide an update for an Action**](./ActionsRoute#action) | **PUT** /api/v2/team/{team}/action |
| [**Retrieve a specific Action by Id**](./ActionsRoute#get3) | **GET** /api/v2/team/{team}/action/{actionId} |
| [**Search for Actions**](./ActionsRoute#query4) | **GET** /api/v2/team/{team}/action/query |
| [**Get Actions Summary**](./ActionsRoute#summary) | **GET** /api/v2/team/{team}/action/summary |

### Insights

| Method | Route | 
| ------------- | ------------- |
| [**Retrieve insights for a team**](./InsightsRoute#getteaminsights) | **GET** /api/v2/team/{team}/insights |

### Integrations

| Method | Route | 
| ------------- | ------------- |
| [**Retrieve the integrations and their status within a Team**](./IntegrationsRoute#get4) | **GET** /api/v2/integration |
| [**Retrieve the installation ID and store against a team**](./IntegrationsRoute#githubinstall) | **GET** /api/v2/integration/github/installation |
| [**Links the GitHub Installation ID with a Team**](./IntegrationsRoute#githublink) | **POST** /api/v2/integration/github/link |
| [**Unlinks the GitHub Installation ID from a Team**](./IntegrationsRoute#githubunlink) | **POST** /api/v2/integration/github/unlink |
| [**Install URL Redirect**](./IntegrationsRoute#installslack) | **GET** /api/v2/integration/slack/install |
| [**Receive Slack Oauth2 request**](./IntegrationsRoute#receiveslackauth) | **GET** /api/v2/integration/slack/auth |
| [**Receive Slack Slash Commands**](./IntegrationsRoute#receiveslackcommand) | **POST** /api/v2/integration/slack/commands |
| [**Receive Slack Events**](./IntegrationsRoute#receiveslackevent) | **POST** /api/v2/integration/slack/events |
| [**Receive Slack Interactivity**](./IntegrationsRoute#receiveslackinteractivity) | **POST** /api/v2/integration/slack/interactivity |

### Parameters

| Method | Route | 
| ------------- | ------------- |
| [**Create new global Param**](./ParametersRoute#create1) | **POST** /api/v2/parameters |
| [**Delete specific global Param**](./ParametersRoute#delete1) | **DELETE** /api/v2/parameters/{name} |
| [**Get all global Params**](./ParametersRoute#getall) | **GET** /api/v2/parameters |
| [****](./ParametersRoute#update) | **PUT** /api/v2/parameters |

### Profile

| Method | Route | 
| ------------- | ------------- |
| [**Get your Profile**](./ProfileRoute#getprofile) | **GET** /api/v2/profile |
| [**Patch your Profile**](./ProfileRoute#updateprofile) | **PATCH** /api/v2/profile |

### Schedules

| Method | Route | 
| ------------- | ------------- |
| [**Create a Schedule.**](./SchedulesRoute#createschedule) | **POST** /api/v2/team/{team}/schedule |
| [**Delete a Schedule.**](./SchedulesRoute#deleteschedule) | **DELETE** /api/v2/team/{team}/schedule/{scheduleId} |
| [**Retrieve a Schedule.**](./SchedulesRoute#get2) | **GET** /api/v2/team/{team}/schedule/{scheduleId} |
| [**Retrieve Calendars for Schedules by Dates.**](./SchedulesRoute#getcalendarsforschedules) | **GET** /api/v2/team/{team}/schedule/calendars |
| [**Search for Schedules**](./SchedulesRoute#query3) | **GET** /api/v2/team/{team}/schedule/query |
| [**Apply a Schedule.**](./SchedulesRoute#updateschedule) | **PUT** /api/v2/team/{team}/schedule |
| [**Validate a Schedules CRON.**](./SchedulesRoute#validatecron) | **GET** /api/v2/team/{team}/schedule/validate-cron |

### System

| Method | Route | 
| ------------- | ------------- |
| [**Create new global Param**](./SystemRoute#create2) | **POST** /api/v2/global-params |
| [**Delete specific global Param**](./SystemRoute#delete2) | **DELETE** /api/v2/global-params/{key} |
| [**Get all global Params**](./SystemRoute#getall1) | **GET** /api/v2/global-params |
| [**Retrieve Boomerang Flow Settings**](./SystemRoute#getappconfiguration) | **GET** /api/v2/settings |
| [**Retrieve feature flags.**](./SystemRoute#getflowfeatures) | **GET** /api/v2/features |
| [**Retrieve this instances context, features, and navigation.**](./SystemRoute#getheadernavigation) | **GET** /api/v2/context |
| [**Retrieve navigation.**](./SystemRoute#getnavigation) | **GET** /api/v2/navigation |
| [**Register and activate an installation of Flow**](./SystemRoute#register) | **PUT** /api/v2/activate |
| [****](./SystemRoute#update1) | **PUT** /api/v2/global-params |
| [**Update Boomerang Flow Settings**](./SystemRoute#updatesettings) | **PUT** /api/v2/settings |

### TaskRuns

| Method | Route | 
| ------------- | ------------- |
| [**Retrieve a TaskRuns log from a specific WorkflowRun.**](./TaskRunsRoute#streamtaskrunlog) | **GET** /api/v2/taskrun/{taskRunId}/log |

### Tasks

| Method | Route | 
| ------------- | ------------- |
| [**Update, replace, or create new using Tekton Task YAML**](./TasksRoute#apply12) | **PUT** /api/v2/task/{name} |
| [**Create a new Task using Tekton Task YAML**](./TasksRoute#create12) | **POST** /api/v2/task |
| [**Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.**](./TasksRoute#get41) | **GET** /api/v2/task/{name} |
| [**Retrieve the changlog**](./TasksRoute#getchangelog2) | **GET** /api/v2/task/{name}/changelog |
| [**Search for Task. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates**](./TasksRoute#query5) | **GET** /api/v2/task/query |
| [****](./TasksRoute#validateyaml1) | **POST** /api/v2/task/validate |

### TeamManagement

| Method | Route | 
| ------------- | ------------- |
| [**Create new team**](./TeamManagementRoute#createteam) | **POST** /api/v2/team |
| [****](./TeamManagementRoute#deleteapprovergroup) | **DELETE** /api/v2/team/{team}/approvers |
| [****](./TeamManagementRoute#deleteparameters) | **DELETE** /api/v2/team/{team}/parameters/{name} |
| [**Delete a team**](./TeamManagementRoute#deleteworkflow1) | **DELETE** /api/v2/team/{team} |
| [****](./TeamManagementRoute#getdefaultquotas) | **GET** /api/v2/team/quotas/default |
| [****](./TeamManagementRoute#getroles) | **GET** /api/v2/team/roles |
| [**Get team**](./TeamManagementRoute#getteam) | **GET** /api/v2/team/{team} |
| [**Search for Teams**](./TeamManagementRoute#getteams) | **GET** /api/v2/team/query |
| [****](./TeamManagementRoute#leave) | **DELETE** /api/v2/team/{team}/leave |
| [****](./TeamManagementRoute#removemembers) | **DELETE** /api/v2/team/{team}/members |
| [****](./TeamManagementRoute#resetquotas) | **DELETE** /api/v2/team/{team}/quotas |
| [**Patch or update a team**](./TeamManagementRoute#updateteam) | **PATCH** /api/v2/team/{team} |
| [**Validate team name and check uniqueness.**](./TeamManagementRoute#validateteamname) | **POST** /api/v2/team/validate-name |

### TeamTasks

| Method | Route | 
| ------------- | ------------- |
| [**Update, replace, or create new using Tekton Task YAML**](./TeamTasksRoute#apply11) | **PUT** /api/v2/team/{team}/task/{name} |
| [**Create a new Task Template using Tekton Task YAML**](./TeamTasksRoute#create11) | **POST** /api/v2/team/{team}/task |
| [**Delete a Team Task**](./TeamTasksRoute#delete) | **DELETE** /api/v2/team/{team}/task/{name} |
| [**Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.**](./TeamTasksRoute#get21) | **GET** /api/v2/team/{team}/task/{name} |
| [**Retrieve the changlog**](./TeamTasksRoute#getchangelog1) | **GET** /api/v2/team/{team}/task/{name}/changelog |
| [**Search for Tasks. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates**](./TeamTasksRoute#querytasktemplates) | **GET** /api/v2/team/{team}/task/query |
| [****](./TeamTasksRoute#validateyaml) | **POST** /api/v2/team/{team}/task/validate |

### TokenManagement

| Method | Route | 
| ------------- | ------------- |
| [**Create Token**](./TokenManagementRoute#createtoken) | **POST** /api/v2/token |
| [**Delete Token**](./TokenManagementRoute#deletetoken) | **DELETE** /api/v2/token/{id} |
| [**Search for Tokens**](./TokenManagementRoute#query1) | **GET** /api/v2/token/query |

### Users

| Method | Route | 
| ------------- | ------------- |
| [**Update a Boomerang Flow Users details**](./UsersRoute#apply1) | **PATCH** /api/v2/user/{userId} |
| [**Delete a Boomerang Flow user**](./UsersRoute#deleteflowuser) | **DELETE** /api/v2/user/{userId} |
| [**Get a Users details**](./UsersRoute#getuserbyid) | **GET** /api/v2/user/{userId} |
| [**Search for Users**](./UsersRoute#getusers) | **GET** /api/v2/user/query |

### WebhooksAndEvents

| Method | Route | 
| ------------- | ------------- |
| [****](./WebhooksAndEventsRoute#acceptevent1) | **POST** /api/v2/event |
| [****](./WebhooksAndEventsRoute#acceptwaitforevent) | **POST** /api/v2/callback |
| [****](./WebhooksAndEventsRoute#acceptwaitforevent1) | **GET** /api/v2/callback |
| [**Trigger WorkflowRun via Webhook.**](./WebhooksAndEventsRoute#acceptwebhookevent) | **POST** /api/v2/webhook |

### WorkflowRuns

| Method | Route | 
| ------------- | ------------- |
| [**Cancel a WorkflowRun**](./WorkflowRunsRoute#cancel) | **DELETE** /api/v2/team/{team}/workflowrun/{workflowRunId}/cancel |
| [**Retrieve a summary of WorkflowRuns by Status.**](./WorkflowRunsRoute#count) | **GET** /api/v2/team/{team}/workflowrun/count |
| [**End a WorkflowRun**](./WorkflowRunsRoute#finalize) | **PUT** /api/v2/team/{team}/workflowrun/{workflowRunId}/finalize |
| [**Retrieve a specific WorkflowRun.**](./WorkflowRunsRoute#get1) | **GET** /api/v2/team/{team}/workflowrun/{workflowRunId} |
| [**Search for WorkflowRuns**](./WorkflowRunsRoute#query2) | **GET** /api/v2/team/{team}/workflowrun/query |
| [**Retry WorkflowRun execution.**](./WorkflowRunsRoute#retry) | **PUT** /api/v2/team/{team}/workflowrun/{workflowRunId}/retry |
| [**Start WorkflowRun execution. The WorkflowRun has to already have been queued.**](./WorkflowRunsRoute#start) | **PUT** /api/v2/team/{team}/workflowrun/{workflowRunId}/start |

### WorkflowTemplates

| Method | Route | 
| ------------- | ------------- |
| [**Update, replace, or create new, Workflow Template**](./WorkflowTemplatesRoute#apply) | **PUT** /api/v2/workflowtemplate |
| [**Create a new Workflow Template**](./WorkflowTemplatesRoute#create) | **POST** /api/v2/workflowtemplate |
| [**Delete a Workflow Template**](./WorkflowTemplatesRoute#deleteworkflow) | **DELETE** /api/v2/workflowtemplate/{name} |
| [**Retrieve a Workflow Template**](./WorkflowTemplatesRoute#get) | **GET** /api/v2/workflowtemplate/{name} |
| [**Search for Workflow Templates**](./WorkflowTemplatesRoute#query) | **GET** /api/v2/workflowtemplate/query |

### Workflows

| Method | Route | 
| ------------- | ------------- |
| [**Update, replace, or create new, Workflow for Canvas**](./WorkflowsRoute#applycanvas) | **PUT** /api/v2/team/{team}/workflow/{workflow}/compose |
| [**Update, replace, or create new, Workflow**](./WorkflowsRoute#applyworkflow) | **PUT** /api/v2/team/{team}/workflow |
| [**Convert workflow to compose model for UI Designer and detailed Activity screens.**](./WorkflowsRoute#compose) | **GET** /api/v2/team/{team}/workflow/{workflow}/compose |
| [**Create a new workflow**](./WorkflowsRoute#createworkflow) | **POST** /api/v2/team/{team}/workflow |
| [**Delete a workflow**](./WorkflowsRoute#deleteworkflow2) | **DELETE** /api/v2/team/{team}/workflow/{workflow} |
| [**Duplicates the workflow.**](./WorkflowsRoute#duplicateworkflow) | **POST** /api/v2/team/{team}/workflow/{workflow}/duplicate |
| [**Export the Workflow as JSON.**](./WorkflowsRoute#export) | **GET** /api/v2/team/{team}/workflow/{workflow}/export |
| [**Retrieve the parameters.**](./WorkflowsRoute#getavailableparameters) | **GET** /api/v2/team/{team}/workflow/{workflow}/available-parameters |
| [**Retrieve the changlog**](./WorkflowsRoute#getchangelog) | **GET** /api/v2/team/{team}/workflow/{workflow}/changelog |
| [**Retrieve a Workflow**](./WorkflowsRoute#getworkflow) | **GET** /api/v2/team/{team}/workflow/{workflow} |
| [**Search for Workflows**](./WorkflowsRoute#queryworkflows) | **GET** /api/v2/team/{team}/workflow/query |
| [**Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.**](./WorkflowsRoute#submitworkflow) | **POST** /api/v2/team/{team}/workflow/{workflow}/submit |


<a name="models"></a>

## Models

 - [AbstractParam](./Models/AbstractParam)
 - [Action](./Models/Action)
 - [ActionRequest](./Models/ActionRequest)
 - [ActionSummary](./Models/ActionSummary)
 - [Actioner](./Models/Actioner)
 - [ApproverGroup](./Models/ApproverGroup)
 - [ApproverGroupRequest](./Models/ApproverGroupRequest)
 - [CanvasEdge](./Models/CanvasEdge)
 - [CanvasEdgeData](./Models/CanvasEdgeData)
 - [CanvasNode](./Models/CanvasNode)
 - [CanvasNodeData](./Models/CanvasNodeData)
 - [CanvasNodePosition](./Models/CanvasNodePosition)
 - [ChangeLog](./Models/ChangeLog)
 - [ChangeLogVersion](./Models/ChangeLogVersion)
 - [CloudEvent](./Models/CloudEvent)
 - [CronValidationResponse](./Models/CronValidationResponse)
 - [CurrentQuotas](./Models/CurrentQuotas)
 - [Features](./Models/Features)
 - [GHLinkRequest](./Models/GHLinkRequest)
 - [HeaderFeatures](./Models/HeaderFeatures)
 - [HeaderNavigation](./Models/HeaderNavigation)
 - [HeaderNavigationResponse](./Models/HeaderNavigationResponse)
 - [HeaderOption](./Models/HeaderOption)
 - [HeaderPlatform](./Models/HeaderPlatform)
 - [HeaderPlatformMessage](./Models/HeaderPlatformMessage)
 - [Integration](./Models/Integration)
 - [KeyValuePair](./Models/KeyValuePair)
 - [Metadata](./Models/Metadata)
 - [Navigation](./Models/Navigation)
 - [OneTimeCode](./Models/OneTimeCode)
 - [PageAction](./Models/PageAction)
 - [PageTeam](./Models/PageTeam)
 - [PageToken](./Models/PageToken)
 - [PageUser](./Models/PageUser)
 - [PageWorkflowRun](./Models/PageWorkflowRun)
 - [PageWorkflowSchedule](./Models/PageWorkflowSchedule)
 - [PageableObject](./Models/PageableObject)
 - [ParamSpec](./Models/ParamSpec)
 - [Quotas](./Models/Quotas)
 - [ResultSpec](./Models/ResultSpec)
 - [Role](./Models/Role)
 - [RunParam](./Models/RunParam)
 - [RunResult](./Models/RunResult)
 - [Setting](./Models/Setting)
 - [SettingConfig](./Models/SettingConfig)
 - [SortObject](./Models/SortObject)
 - [Spec](./Models/Spec)
 - [Spec_timeout](./Models/Spec_timeout)
 - [Spec_timeout_units_inner](./Models/Spec_timeout_units_inner)
 - [Step](./Models/Step)
 - [Task](./Models/Task)
 - [TaskEnvVar](./Models/TaskEnvVar)
 - [TaskResponsePage](./Models/TaskResponsePage)
 - [TaskRun](./Models/TaskRun)
 - [TaskRunSpec](./Models/TaskRunSpec)
 - [TaskSpec](./Models/TaskSpec)
 - [TaskWorkspace](./Models/TaskWorkspace)
 - [Team](./Models/Team)
 - [TeamMember](./Models/TeamMember)
 - [TeamNameCheckRequest](./Models/TeamNameCheckRequest)
 - [TeamRequest](./Models/TeamRequest)
 - [TeamSummary](./Models/TeamSummary)
 - [TeamSummaryInsights](./Models/TeamSummaryInsights)
 - [TektonTask](./Models/TektonTask)
 - [Token](./Models/Token)
 - [TokenCreateRequest](./Models/TokenCreateRequest)
 - [TokenCreateResponse](./Models/TokenCreateResponse)
 - [Trigger](./Models/Trigger)
 - [TriggerCondition](./Models/TriggerCondition)
 - [User](./Models/User)
 - [UserProfile](./Models/UserProfile)
 - [UserRequest](./Models/UserRequest)
 - [UserSettings](./Models/UserSettings)
 - [Workflow](./Models/Workflow)
 - [WorkflowCanvas](./Models/WorkflowCanvas)
 - [WorkflowResponsePage](./Models/WorkflowResponsePage)
 - [WorkflowRun](./Models/WorkflowRun)
 - [WorkflowRunCount](./Models/WorkflowRunCount)
 - [WorkflowRunInsight](./Models/WorkflowRunInsight)
 - [WorkflowRunRequest](./Models/WorkflowRunRequest)
 - [WorkflowRunSummary](./Models/WorkflowRunSummary)
 - [WorkflowSchedule](./Models/WorkflowSchedule)
 - [WorkflowScheduleCalendar](./Models/WorkflowScheduleCalendar)
 - [WorkflowSubmitRequest](./Models/WorkflowSubmitRequest)
 - [WorkflowSummary](./Models/WorkflowSummary)
 - [WorkflowTask](./Models/WorkflowTask)
 - [WorkflowTaskDependency](./Models/WorkflowTaskDependency)
 - [WorkflowTemplate](./Models/WorkflowTemplate)
 - [WorkflowTemplateResponsePage](./Models/WorkflowTemplateResponsePage)
 - [WorkflowTrigger](./Models/WorkflowTrigger)
 - [WorkflowWorkspace](./Models/WorkflowWorkspace)


<a name="auth"></a>

## Open API Specification

The APIs are documented using the OpenAPI specification 3.0.1 and the raw specification file can can be found on [GitHub](https://github.com/boomerang-io/docs/blob/main/flow/apis/assets/spec.json). 

## Versioning

To make it easier to evolve and extend we version the API, such as `/apis/v1`. This is done at the API level rather than a particular context to ensure we have a consistent view and behavior for the life of a version.

## SDKs

We currently generate a Java client based on the OpenAPI specification, one such open source project to facilitate this is the open API-generator project. (https://github.com/OpenAPITools/openapi-generator).

_In the future we will also support NodeJS and Go._

## Limits

Our API endpoints have limits on the number of requests that can be made with the following defaults that can be edited in the Ingress definition.

| Type                      | Description                                                       | Default |
| ------------------------- | ----------------------------------------------------------------- | ------- |
| Connections               | Number of concurrent connections allowed from a single IP address | 3       |
| Requests Per Minute (rpm) | Number of requests accepted from a given IP each minute           | 100     |

_Reference_: https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#rate-limiting