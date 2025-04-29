---
title: API Specifications
order: 2
---

# API Specifications

<a name="documentation-for-api-endpoints"></a>
## Routes


## ActionsManagement

| Method | Route | 
| ------------- | ------------- |
| [**Provide an update for an Action**](./ActionsManagementApi.md#action) | **PUT** /api/v2/team/{team}/action |
| [**Retrieve a specific Action by Id**](./ActionsManagementApi.md#get3) | **GET** /api/v2/team/{team}/action/{actionId} |
| [**Search for Actions**](./ActionsManagementApi.md#query4) | **GET** /api/v2/team/{team}/action/query |
| [**Get Actions Summary**](./ActionsManagementApi.md#summary) | **GET** /api/v2/team/{team}/action/summary |

## InsightsManagement

| Method | Route | 
| ------------- | ------------- |
| [**Retrieve insights for a team.**](./InsightsManagementApi.md#getteaminsights) | **GET** /api/v2/team/{team}/insights |

## Integrations

| Method | Route | 
| ------------- | ------------- |
| [**Retrieve the integrations and their status within a Team**](./IntegrationsApi.md#get4) | **GET** /api/v2/integration |
| [**Retrieve the installation ID and store against a team**](./IntegrationsApi.md#githubinstall) | **GET** /api/v2/integration/github/installation |
| [**Links the GitHub Installation ID with a Team**](./IntegrationsApi.md#githublink) | **POST** /api/v2/integration/github/link |
| [**Unlinks the GitHub Installation ID from a Team**](./IntegrationsApi.md#githubunlink) | **POST** /api/v2/integration/github/unlink |
| [**Install URL Redirect**](./IntegrationsApi.md#installslack) | **GET** /api/v2/integration/slack/install |
| [**Receive Slack Oauth2 request**](./IntegrationsApi.md#receiveslackauth) | **GET** /api/v2/integration/slack/auth |
| [**Receive Slack Slash Commands**](./IntegrationsApi.md#receiveslackcommand) | **POST** /api/v2/integration/slack/commands |
| [**Receive Slack Events**](./IntegrationsApi.md#receiveslackevent) | **POST** /api/v2/integration/slack/events |
| [**Receive Slack Interactivity**](./IntegrationsApi.md#receiveslackinteractivity) | **POST** /api/v2/integration/slack/interactivity |

## Parameters

| Method | Route | 
| ------------- | ------------- |
| [**Create new global Param**](./ParametersApi.md#create1) | **POST** /api/v2/parameters |
| [**Delete specific global Param**](./ParametersApi.md#delete1) | **DELETE** /api/v2/parameters/{name} |
| [**Get all global Params**](./ParametersApi.md#getall) | **GET** /api/v2/parameters |
| [****](./ParametersApi.md#update) | **PUT** /api/v2/parameters |

## ScheduleManagement

| Method | Route | 
| ------------- | ------------- |
| [**Create a Schedule.**](./ScheduleManagementApi.md#createschedule) | **POST** /api/v2/team/{team}/schedule |
| [**Delete a Schedule.**](./ScheduleManagementApi.md#deleteschedule) | **DELETE** /api/v2/team/{team}/schedule/{scheduleId} |
| [**Retrieve a Schedule.**](./ScheduleManagementApi.md#get2) | **GET** /api/v2/team/{team}/schedule/{scheduleId} |
| [**Retrieve Calendars for Schedules by Dates.**](./ScheduleManagementApi.md#getcalendarsforschedules) | **GET** /api/v2/team/{team}/schedule/calendars |
| [**Search for Schedules**](./ScheduleManagementApi.md#query3) | **GET** /api/v2/team/{team}/schedule/query |
| [**Apply a Schedule.**](./ScheduleManagementApi.md#updateschedule) | **PUT** /api/v2/team/{team}/schedule |
| [**Validate a Schedules CRON.**](./ScheduleManagementApi.md#validatecron) | **GET** /api/v2/schedule/validate-cron |

## System

| Method | Route | 
| ------------- | ------------- |
| [**Create new global Param**](./SystemApi.md#create2) | **POST** /api/v2/global-params |
| [**Delete specific global Param**](./SystemApi.md#delete2) | **DELETE** /api/v2/global-params/{key} |
| [**Get all global Params**](./SystemApi.md#getall1) | **GET** /api/v2/global-params |
| [**Retrieve Boomerang Flow Settings**](./SystemApi.md#getappconfiguration) | **GET** /api/v2/settings |
| [**Retrieve feature flags.**](./SystemApi.md#getflowfeatures) | **GET** /api/v2/features |
| [**Retrieve this instances context, features, and navigation.**](./SystemApi.md#getheadernavigation) | **GET** /api/v2/context |
| [**Retrieve navigation.**](./SystemApi.md#getnavigation) | **GET** /api/v2/navigation |
| [**Register and activate an installation of Flow**](./SystemApi.md#register) | **PUT** /api/v2/activate |
| [****](./SystemApi.md#update1) | **PUT** /api/v2/global-params |
| [**Update Boomerang Flow Settings**](./SystemApi.md#updatesettings) | **PUT** /api/v2/settings |

## TaskManagement

| Method | Route | 
| ------------- | ------------- |
| [**Update, replace, or create new using Tekton Task YAML**](./TaskManagementApi.md#apply11) | **PUT** /api/v2/team/{team}/task/{name} |
| [**Update, replace, or create new using Tekton Task YAML**](./TaskManagementApi.md#apply12) | **PUT** /api/v2/task/{name} |
| [**Create a new Task Template using Tekton Task YAML**](./TaskManagementApi.md#create11) | **POST** /api/v2/team/{team}/task |
| [**Create a new Task using Tekton Task YAML**](./TaskManagementApi.md#create12) | **POST** /api/v2/task |
| [**Delete a Team Task**](./TaskManagementApi.md#delete) | **DELETE** /api/v2/team/{team}/task/{name} |
| [**Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.**](./TaskManagementApi.md#get21) | **GET** /api/v2/team/{team}/task/{name} |
| [**Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.**](./TaskManagementApi.md#get41) | **GET** /api/v2/task/{name} |
| [**Retrieve the changlog**](./TaskManagementApi.md#getchangelog1) | **GET** /api/v2/team/{team}/task/{name}/changelog |
| [**Retrieve the changlog**](./TaskManagementApi.md#getchangelog2) | **GET** /api/v2/task/{name}/changelog |
| [**Search for Task. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates**](./TaskManagementApi.md#query5) | **GET** /api/v2/task/query |
| [**Search for Tasks. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates**](./TaskManagementApi.md#querytasktemplates) | **GET** /api/v2/team/{team}/task/query |
| [****](./TaskManagementApi.md#validateyaml) | **POST** /api/v2/team/{team}/task/validate |
| [****](./TaskManagementApi.md#validateyaml1) | **POST** /api/v2/task/validate |

## TaskRunManagement

| Method | Route | 
| ------------- | ------------- |
| [**Retrieve a TaskRuns log from a specific WorkflowRun.**](./TaskRunManagementApi.md#streamtaskrunlog) | **GET** /api/v2/taskrun/{taskRunId}/log |

## TeamManagement

| Method | Route | 
| ------------- | ------------- |
| [**Create new team**](./TeamManagementApi.md#createteam) | **POST** /api/v2/team |
| [****](./TeamManagementApi.md#deleteapprovergroup) | **DELETE** /api/v2/team/{team}/approvers |
| [****](./TeamManagementApi.md#deleteparameters) | **DELETE** /api/v2/team/{team}/parameters/{name} |
| [**Delete a team**](./TeamManagementApi.md#deleteworkflow1) | **DELETE** /api/v2/team/{team} |
| [****](./TeamManagementApi.md#getdefaultquotas) | **GET** /api/v2/team/quotas/default |
| [****](./TeamManagementApi.md#getroles) | **GET** /api/v2/team/roles |
| [**Get team**](./TeamManagementApi.md#getteam) | **GET** /api/v2/team/{team} |
| [**Search for Teams**](./TeamManagementApi.md#getteams) | **GET** /api/v2/team/query |
| [****](./TeamManagementApi.md#leave) | **DELETE** /api/v2/team/{team}/leave |
| [****](./TeamManagementApi.md#removemembers) | **DELETE** /api/v2/team/{team}/members |
| [****](./TeamManagementApi.md#resetquotas) | **DELETE** /api/v2/team/{team}/quotas |
| [**Patch or update a team**](./TeamManagementApi.md#updateteam) | **PATCH** /api/v2/team/{team} |
| [**Validate team name and check uniqueness.**](./TeamManagementApi.md#validateteamname) | **POST** /api/v2/team/validate-name |

## TokenManagement

| Method | Route | 
| ------------- | ------------- |
| [**Create Token**](./TokenManagementApi.md#createtoken) | **POST** /api/v2/token |
| [**Delete Token**](./TokenManagementApi.md#deletetoken) | **DELETE** /api/v2/token/{id} |
| [**Search for Tokens**](./TokenManagementApi.md#query1) | **GET** /api/v2/token/query |

## TriggersForEventsTopicsAndWebhooks

| Method | Route | 
| ------------- | ------------- |
| [****](./TriggersForEventsTopicsAndWebhooksApi.md#acceptevent1) | **POST** /api/v2/event |
| [****](./TriggersForEventsTopicsAndWebhooksApi.md#acceptwaitforevent) | **POST** /api/v2/callback |
| [****](./TriggersForEventsTopicsAndWebhooksApi.md#acceptwaitforevent1) | **GET** /api/v2/callback |
| [**Trigger WorkflowRun via Webhook.**](./TriggersForEventsTopicsAndWebhooksApi.md#acceptwebhookevent) | **POST** /api/v2/webhook |

## UserManagement

| Method | Route | 
| ------------- | ------------- |
| [**Update a Boomerang Flow Users details**](./UserManagementApi.md#apply1) | **PATCH** /api/v2/user/{userId} |
| [**Delete a Boomerang Flow user**](./UserManagementApi.md#deleteflowuser) | **DELETE** /api/v2/user/{userId} |
| [**Get your Profile**](./UserManagementApi.md#getprofile) | **GET** /api/v2/profile |
| [**Get a Users details**](./UserManagementApi.md#getuserbyid) | **GET** /api/v2/user/{userId} |
| [**Search for Users**](./UserManagementApi.md#getusers) | **GET** /api/v2/user/query |
| [**Patch your Profile**](./UserManagementApi.md#updateprofile) | **PATCH** /api/v2/profile |

## WorkflowManagement

| Method | Route | 
| ------------- | ------------- |
| [**Update, replace, or create new, Workflow for Canvas**](./WorkflowManagementApi.md#applycanvas) | **PUT** /api/v2/team/{team}/workflow/{workflow}/compose |
| [**Update, replace, or create new, Workflow**](./WorkflowManagementApi.md#applyworkflow) | **PUT** /api/v2/team/{team}/workflow |
| [**Convert workflow to compose model for UI Designer and detailed Activity screens.**](./WorkflowManagementApi.md#compose) | **GET** /api/v2/team/{team}/workflow/{workflow}/compose |
| [**Create a new workflow**](./WorkflowManagementApi.md#createworkflow) | **POST** /api/v2/team/{team}/workflow |
| [**Delete a workflow**](./WorkflowManagementApi.md#deleteworkflow2) | **DELETE** /api/v2/team/{team}/workflow/{workflow} |
| [**Duplicates the workflow.**](./WorkflowManagementApi.md#duplicateworkflow) | **POST** /api/v2/team/{team}/workflow/{workflow}/duplicate |
| [**Export the Workflow as JSON.**](./WorkflowManagementApi.md#export) | **GET** /api/v2/team/{team}/workflow/{workflow}/export |
| [**Retrieve the parameters.**](./WorkflowManagementApi.md#getavailableparameters) | **GET** /api/v2/team/{team}/workflow/{workflow}/available-parameters |
| [**Retrieve the changlog**](./WorkflowManagementApi.md#getchangelog) | **GET** /api/v2/team/{team}/workflow/{workflow}/changelog |
| [**Retrieve a Workflow**](./WorkflowManagementApi.md#getworkflow) | **GET** /api/v2/team/{team}/workflow/{workflow} |
| [**Search for Workflows**](./WorkflowManagementApi.md#query workflows) | **GET** /api/v2/team/{team}/workflow/query |
| [**Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.**](./WorkflowManagementApi.md#submitworkflow) | **POST** /api/v2/team/{team}/workflow/{workflow}/submit |

## WorkflowRunManagement

| Method | Route | 
| ------------- | ------------- |
| [**Cancel a WorkflowRun**](./WorkflowRunManagementApi.md#cancel) | **DELETE** /api/v2/team/{team}/workflowrun/{workflowRunId}/cancel |
| [**Retrieve a summary of WorkflowRuns by Status.**](./WorkflowRunManagementApi.md#count) | **GET** /api/v2/team/{team}/workflowrun/count |
| [**End a WorkflowRun**](./WorkflowRunManagementApi.md#finalize) | **PUT** /api/v2/team/{team}/workflowrun/{workflowRunId}/finalize |
| [**Retrieve a specific WorkflowRun.**](./WorkflowRunManagementApi.md#get1) | **GET** /api/v2/team/{team}/workflowrun/{workflowRunId} |
| [**Search for WorkflowRuns**](./WorkflowRunManagementApi.md#query2) | **GET** /api/v2/team/{team}/workflowrun/query |
| [**Retry WorkflowRun execution.**](./WorkflowRunManagementApi.md#retry) | **PUT** /api/v2/team/{team}/workflowrun/{workflowRunId}/retry |
| [**Start WorkflowRun execution. The WorkflowRun has to already have been queued.**](./WorkflowRunManagementApi.md#start) | **PUT** /api/v2/team/{team}/workflowrun/{workflowRunId}/start |

## WorkflowTemplateManagement

| Method | Route | 
| ------------- | ------------- |
| [**Update, replace, or create new, Workflow Template**](./WorkflowTemplateManagementApi.md#apply) | **PUT** /api/v2/workflowtemplate |
| [**Create a new Workflow Template**](./WorkflowTemplateManagementApi.md#create) | **POST** /api/v2/workflowtemplate |
| [**Delete a Workflow Template**](./WorkflowTemplateManagementApi.md#deleteworkflow) | **DELETE** /api/v2/workflowtemplate/{name} |
| [**Retrieve a Workflow Template**](./WorkflowTemplateManagementApi.md#get) | **GET** /api/v2/workflowtemplate/{name} |
| [**Search for Workflow Templates**](./WorkflowTemplateManagementApi.md#query) | **GET** /api/v2/workflowtemplate/query |


<a name="documentation-for-models"></a>
## Documentation for Models

 - [AbstractParam](./Models/AbstractParam.md)
 - [Action](./Models/Action.md)
 - [ActionRequest](./Models/ActionRequest.md)
 - [ActionSummary](./Models/ActionSummary.md)
 - [Actioner](./Models/Actioner.md)
 - [ApproverGroup](./Models/ApproverGroup.md)
 - [ApproverGroupRequest](./Models/ApproverGroupRequest.md)
 - [CanvasEdge](./Models/CanvasEdge.md)
 - [CanvasEdgeData](./Models/CanvasEdgeData.md)
 - [CanvasNode](./Models/CanvasNode.md)
 - [CanvasNodeData](./Models/CanvasNodeData.md)
 - [CanvasNodePosition](./Models/CanvasNodePosition.md)
 - [ChangeLog](./Models/ChangeLog.md)
 - [ChangeLogVersion](./Models/ChangeLogVersion.md)
 - [CloudEvent](./Models/CloudEvent.md)
 - [CronValidationResponse](./Models/CronValidationResponse.md)
 - [CurrentQuotas](./Models/CurrentQuotas.md)
 - [Features](./Models/Features.md)
 - [GHLinkRequest](./Models/GHLinkRequest.md)
 - [HeaderFeatures](./Models/HeaderFeatures.md)
 - [HeaderNavigation](./Models/HeaderNavigation.md)
 - [HeaderNavigationResponse](./Models/HeaderNavigationResponse.md)
 - [HeaderOption](./Models/HeaderOption.md)
 - [HeaderPlatform](./Models/HeaderPlatform.md)
 - [HeaderPlatformMessage](./Models/HeaderPlatformMessage.md)
 - [Integration](./Models/Integration.md)
 - [KeyValuePair](./Models/KeyValuePair.md)
 - [Metadata](./Models/Metadata.md)
 - [Navigation](./Models/Navigation.md)
 - [OneTimeCode](./Models/OneTimeCode.md)
 - [PageAction](./Models/PageAction.md)
 - [PageTeam](./Models/PageTeam.md)
 - [PageToken](./Models/PageToken.md)
 - [PageUser](./Models/PageUser.md)
 - [PageWorkflowRun](./Models/PageWorkflowRun.md)
 - [PageWorkflowSchedule](./Models/PageWorkflowSchedule.md)
 - [PageableObject](./Models/PageableObject.md)
 - [ParamSpec](./Models/ParamSpec.md)
 - [Quotas](./Models/Quotas.md)
 - [ResultSpec](./Models/ResultSpec.md)
 - [Role](./Models/Role.md)
 - [RunParam](./Models/RunParam.md)
 - [RunResult](./Models/RunResult.md)
 - [Setting](./Models/Setting.md)
 - [SettingConfig](./Models/SettingConfig.md)
 - [SortObject](./Models/SortObject.md)
 - [Spec](./Models/Spec.md)
 - [Spec_timeout](./Models/Spec_timeout.md)
 - [Spec_timeout_units_inner](./Models/Spec_timeout_units_inner.md)
 - [Step](./Models/Step.md)
 - [Task](./Models/Task.md)
 - [TaskEnvVar](./Models/TaskEnvVar.md)
 - [TaskResponsePage](./Models/TaskResponsePage.md)
 - [TaskRun](./Models/TaskRun.md)
 - [TaskRunSpec](./Models/TaskRunSpec.md)
 - [TaskSpec](./Models/TaskSpec.md)
 - [TaskWorkspace](./Models/TaskWorkspace.md)
 - [Team](./Models/Team.md)
 - [TeamMember](./Models/TeamMember.md)
 - [TeamNameCheckRequest](./Models/TeamNameCheckRequest.md)
 - [TeamRequest](./Models/TeamRequest.md)
 - [TeamSummary](./Models/TeamSummary.md)
 - [TeamSummaryInsights](./Models/TeamSummaryInsights.md)
 - [TektonTask](./Models/TektonTask.md)
 - [Token](./Models/Token.md)
 - [TokenCreateRequest](./Models/TokenCreateRequest.md)
 - [TokenCreateResponse](./Models/TokenCreateResponse.md)
 - [Trigger](./Models/Trigger.md)
 - [TriggerCondition](./Models/TriggerCondition.md)
 - [User](./Models/User.md)
 - [UserProfile](./Models/UserProfile.md)
 - [UserRequest](./Models/UserRequest.md)
 - [UserSettings](./Models/UserSettings.md)
 - [Workflow](./Models/Workflow.md)
 - [WorkflowCanvas](./Models/WorkflowCanvas.md)
 - [WorkflowResponsePage](./Models/WorkflowResponsePage.md)
 - [WorkflowRun](./Models/WorkflowRun.md)
 - [WorkflowRunCount](./Models/WorkflowRunCount.md)
 - [WorkflowRunInsight](./Models/WorkflowRunInsight.md)
 - [WorkflowRunRequest](./Models/WorkflowRunRequest.md)
 - [WorkflowRunSummary](./Models/WorkflowRunSummary.md)
 - [WorkflowSchedule](./Models/WorkflowSchedule.md)
 - [WorkflowScheduleCalendar](./Models/WorkflowScheduleCalendar.md)
 - [WorkflowSubmitRequest](./Models/WorkflowSubmitRequest.md)
 - [WorkflowSummary](./Models/WorkflowSummary.md)
 - [WorkflowTask](./Models/WorkflowTask.md)
 - [WorkflowTaskDependency](./Models/WorkflowTaskDependency.md)
 - [WorkflowTemplate](./Models/WorkflowTemplate.md)
 - [WorkflowTemplateResponsePage](./Models/WorkflowTemplateResponsePage.md)
 - [WorkflowTrigger](./Models/WorkflowTrigger.md)
 - [WorkflowWorkspace](./Models/WorkflowWorkspace.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

<a name="bearerAuth"></a>
### bearerAuth

- **Type**: API key
- **API key parameter name**: bearerAuth
- **Location**: HTTP header

