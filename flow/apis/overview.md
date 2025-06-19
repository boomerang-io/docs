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

| Route | Endpoint | 
| ------------- | ------------- |
| [**Provide an update for an Action**](./ActionsRoute#provide-an-update-for-an-action) | **PUT** /api/v2/team/{team}/action |
| [**Retrieve a specific Action by Id**](./ActionsRoute#retrieve-a-specific-action-by-id) | **GET** /api/v2/team/{team}/action/{actionId} |
| [**Search for Actions**](./ActionsRoute#search-for-actions) | **GET** /api/v2/team/{team}/action/query |
| [**Get Actions Summary**](./ActionsRoute#get-actions-summary) | **GET** /api/v2/team/{team}/action/summary |

### Insights

| Route | Endpoint | 
| ------------- | ------------- |
| [**Retrieve insights for a team**](./InsightsRoute#retrieve-insights-for-a-team) | **GET** /api/v2/team/{team}/insights |

### Integrations

| Route | Endpoint | 
| ------------- | ------------- |
| [**Retrieve the integrations and their status within a Team**](./IntegrationsRoute#retrieve-the-integrations-and-their-status-within-a-team) | **GET** /api/v2/integration |
| [**Retrieve the installation ID and store against a team**](./IntegrationsRoute#retrieve-the-installation-id-and-store-against-a-team) | **GET** /api/v2/integration/github/installation |
| [**Links the GitHub Installation ID with a Team**](./IntegrationsRoute#links-the-git-hub-installation-id-with-a-team) | **POST** /api/v2/integration/github/link |
| [**Unlinks the GitHub Installation ID from a Team**](./IntegrationsRoute#unlinks-the-git-hub-installation-id-from-a-team) | **POST** /api/v2/integration/github/unlink |
| [**Install URL Redirect**](./IntegrationsRoute#install-url-redirect) | **GET** /api/v2/integration/slack/install |
| [**Receive Slack Oauth2 request**](./IntegrationsRoute#receive-slack-oauth2-request) | **GET** /api/v2/integration/slack/auth |
| [**Receive Slack Slash Commands**](./IntegrationsRoute#receive-slack-slash-commands) | **POST** /api/v2/integration/slack/commands |
| [**Receive Slack Events**](./IntegrationsRoute#receive-slack-events) | **POST** /api/v2/integration/slack/events |
| [**Receive Slack Interactivity**](./IntegrationsRoute#receive-slack-interactivity) | **POST** /api/v2/integration/slack/interactivity |

### Parameters

| Route | Endpoint | 
| ------------- | ------------- |
| [**Create a global Param**](./ParametersRoute#create-a-global-param) | **POST** /api/v2/parameters |
| [**Delete a global Param**](./ParametersRoute#delete-a-global-param) | **DELETE** /api/v2/parameters/{name} |
| [**Get all global Params**](./ParametersRoute#get-all-global-params) | **GET** /api/v2/parameters |
| [**Update global Params**](./ParametersRoute#update-global-params) | **PUT** /api/v2/parameters |

### Profile

| Route | Endpoint | 
| ------------- | ------------- |
| [**Get your Profile**](./ProfileRoute#get-your-profile) | **GET** /api/v2/profile |
| [**Patch your Profile**](./ProfileRoute#patch-your-profile) | **PATCH** /api/v2/profile |

### Schedules

| Route | Endpoint | 
| ------------- | ------------- |
| [**Create a Schedule.**](./SchedulesRoute#create-a-schedule) | **POST** /api/v2/team/{team}/schedule |
| [**Delete a Schedule.**](./SchedulesRoute#delete-a-schedule) | **DELETE** /api/v2/team/{team}/schedule/{scheduleId} |
| [**Retrieve a Schedule.**](./SchedulesRoute#retrieve-a-schedule) | **GET** /api/v2/team/{team}/schedule/{scheduleId} |
| [**Retrieve Calendars for Schedules by Dates.**](./SchedulesRoute#retrieve-calendars-for-schedules-by-dates) | **GET** /api/v2/team/{team}/schedule/calendars |
| [**Search for Schedules**](./SchedulesRoute#search-for-schedules) | **GET** /api/v2/team/{team}/schedule/query |
| [**Apply a Schedule.**](./SchedulesRoute#apply-a-schedule) | **PUT** /api/v2/team/{team}/schedule |
| [**Validate a Schedules CRON.**](./SchedulesRoute#validate-a-schedules-cron) | **GET** /api/v2/team/{team}/schedule/validate-cron |

### System

| Route | Endpoint | 
| ------------- | ------------- |
| [**Retrieve Boomerang Flow Settings**](./SystemRoute#retrieve-boomerang-flow-settings) | **GET** /api/v2/settings |
| [**Retrieve feature flags.**](./SystemRoute#retrieve-feature-flags) | **GET** /api/v2/features |
| [**Retrieve this instances context, features, and navigation.**](./SystemRoute#retrieve-this-instances-context-features-and-navigation) | **GET** /api/v2/context |
| [**Retrieve navigation.**](./SystemRoute#retrieve-navigation) | **GET** /api/v2/navigation |
| [**Register and activate an installation of Flow**](./SystemRoute#register-and-activate-an-installation-of-flow) | **PUT** /api/v2/activate |
| [**Update Boomerang Flow Settings**](./SystemRoute#update-boomerang-flow-settings) | **PUT** /api/v2/settings |

### Task Runs

| Route | Endpoint | 
| ------------- | ------------- |
| [**Retrieve a TaskRuns log from a specific WorkflowRun.**](./TaskRunsRoute#retrieve-a-task-runs-log-from-a-specific-workflow-run) | **GET** /api/v2/taskrun/{taskRunId}/log |

### Tasks

| Route | Endpoint | 
| ------------- | ------------- |
| [**Update, replace, or create new using Tekton Task YAML**](./TasksRoute#update-replace-or-create-new-using-tekton-task-yaml) | **PUT** /api/v2/task/{name} |
| [**Create a new Task using Tekton Task YAML**](./TasksRoute#create-a-new-task-using-tekton-task-yaml) | **POST** /api/v2/task |
| [**Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.**](./TasksRoute#retrieve-a-specific-task-as-tekton-task-yaml-if-no-version-specified-the-latest-version-is-returned) | **GET** /api/v2/task/{name} |
| [**Retrieve the changlog**](./TasksRoute#retrieve-the-changlog) | **GET** /api/v2/task/{name}/changelog |
| [**Search for Task. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates**](./TasksRoute#search-for-task-if-teams-are-provided-it-will-query-the-teams-if-no-teams-are-provided-it-will-query-global-task-templates) | **GET** /api/v2/task/query |
| [**Validate Tekton Task YAML**](./TasksRoute#validate-tekton-task-yaml) | **POST** /api/v2/task/validate |

### Team Management

| Route | Endpoint | 
| ------------- | ------------- |
| [**Create new team**](./TeamManagementRoute#create-new-team) | **POST** /api/v2/team |
| [**Delete Approver Groups**](./TeamManagementRoute#delete-approver-groups) | **DELETE** /api/v2/team/{team}/approvers |
| [**Delete Team Parameter**](./TeamManagementRoute#delete-team-parameter) | **DELETE** /api/v2/team/{team}/parameters/{name} |
| [**Delete Team**](./TeamManagementRoute#delete-team) | **DELETE** /api/v2/team/{team} |
| [**Retrieve Default Team Quota**](./TeamManagementRoute#retrieve-default-team-quota) | **GET** /api/v2/team/quotas/default |
| [**Retrieve Team Roles**](./TeamManagementRoute#retrieve-team-roles) | **GET** /api/v2/team/roles |
| [**Get team**](./TeamManagementRoute#get-team) | **GET** /api/v2/team/{team} |
| [**Search for Teams**](./TeamManagementRoute#search-for-teams) | **GET** /api/v2/team/query |
| [**Leave Team**](./TeamManagementRoute#leave-team) | **DELETE** /api/v2/team/{team}/leave |
| [**Remove Team Members**](./TeamManagementRoute#remove-team-members) | **DELETE** /api/v2/team/{team}/members |
| [**Reset Team Quota**](./TeamManagementRoute#reset-team-quota) | **DELETE** /api/v2/team/{team}/quotas |
| [**Patch or update a team**](./TeamManagementRoute#patch-or-update-a-team) | **PATCH** /api/v2/team/{team} |
| [**Validate team name and check uniqueness.**](./TeamManagementRoute#validate-team-name-and-check-uniqueness) | **POST** /api/v2/team/validate-name |

### Team Tasks

| Route | Endpoint | 
| ------------- | ------------- |
| [**Update, replace, or create new using Tekton Task YAML**](./TeamTasksRoute#update-replace-or-create-new-using-tekton-task-yaml) | **PUT** /api/v2/team/{team}/task/{name} |
| [**Create a new Task Template using Tekton Task YAML**](./TeamTasksRoute#create-a-new-task-template-using-tekton-task-yaml) | **POST** /api/v2/team/{team}/task |
| [**Delete a Team Task**](./TeamTasksRoute#delete-a-team-task) | **DELETE** /api/v2/team/{team}/task/{name} |
| [**Retrieve a specific task as Tekton Task YAML. If no version specified, the latest version is returned.**](./TeamTasksRoute#retrieve-a-specific-task-as-tekton-task-yaml-if-no-version-specified-the-latest-version-is-returned) | **GET** /api/v2/team/{team}/task/{name} |
| [**Retrieve the changlog**](./TeamTasksRoute#retrieve-the-changlog) | **GET** /api/v2/team/{team}/task/{name}/changelog |
| [**Search for Tasks. If teams are provided it will query the teams. If no teams are provided it will query Global Task Templates**](./TeamTasksRoute#search-for-tasks-if-teams-are-provided-it-will-query-the-teams-if-no-teams-are-provided-it-will-query-global-task-templates) | **GET** /api/v2/team/{team}/task/query |
| [**Validate Tekton Task YAML**](./TeamTasksRoute#validate-tekton-task-yaml) | **POST** /api/v2/team/{team}/task/validate |

### Token Management

| Route | Endpoint | 
| ------------- | ------------- |
| [**Create Token**](./TokenManagementRoute#create-token) | **POST** /api/v2/token |
| [**Delete Token**](./TokenManagementRoute#delete-token) | **DELETE** /api/v2/token/{id} |
| [**Search for Tokens**](./TokenManagementRoute#search-for-tokens) | **GET** /api/v2/token/query |

### Users

| Route | Endpoint | 
| ------------- | ------------- |
| [**Update a Boomerang Flow Users details**](./UsersRoute#update-a-boomerang-flow-users-details) | **PATCH** /api/v2/user/{userId} |
| [**Delete a Boomerang Flow user**](./UsersRoute#delete-a-boomerang-flow-user) | **DELETE** /api/v2/user/{userId} |
| [**Get a Users details**](./UsersRoute#get-a-users-details) | **GET** /api/v2/user/{userId} |
| [**Search for Users**](./UsersRoute#search-for-users) | **GET** /api/v2/user/query |

### Webhooks And Events

| Route | Endpoint | 
| ------------- | ------------- |
| [**Accept CloudEvent**](./WebhooksAndEventsRoute#accept-cloud-event) | **POST** /api/v2/event |
| [**Accept Wait for Event Callback with JSON Payload**](./WebhooksAndEventsRoute#accept-wait-for-event-callback-with-json-payload) | **POST** /api/v2/callback |
| [**Accept Wait for Event Callbcak**](./WebhooksAndEventsRoute#accept-wait-for-event-callbcak) | **GET** /api/v2/callback |
| [**Accept Webhook payloads from various sources.**](./WebhooksAndEventsRoute#accept-webhook-payloads-from-various-sources) | **POST** /api/v2/webhook |

### Workflow Runs

| Route | Endpoint | 
| ------------- | ------------- |
| [**Cancel a WorkflowRun**](./WorkflowRunsRoute#cancel-a-workflow-run) | **DELETE** /api/v2/team/{team}/workflowrun/{workflowRunId}/cancel |
| [**Retrieve a summary of WorkflowRuns by Status.**](./WorkflowRunsRoute#retrieve-a-summary-of-workflow-runs-by-status) | **GET** /api/v2/team/{team}/workflowrun/count |
| [**End a WorkflowRun**](./WorkflowRunsRoute#end-a-workflow-run) | **PUT** /api/v2/team/{team}/workflowrun/{workflowRunId}/finalize |
| [**Retrieve a specific WorkflowRun.**](./WorkflowRunsRoute#retrieve-a-specific-workflow-run) | **GET** /api/v2/team/{team}/workflowrun/{workflowRunId} |
| [**Search for WorkflowRuns**](./WorkflowRunsRoute#search-for-workflow-runs) | **GET** /api/v2/team/{team}/workflowrun/query |
| [**Retry WorkflowRun execution.**](./WorkflowRunsRoute#retry-workflow-run-execution) | **PUT** /api/v2/team/{team}/workflowrun/{workflowRunId}/retry |
| [**Start WorkflowRun execution. The WorkflowRun has to already have been queued.**](./WorkflowRunsRoute#start-workflow-run-execution-the-workflow-run-has-to-already-have-been-queued) | **PUT** /api/v2/team/{team}/workflowrun/{workflowRunId}/start |

### Workflow Templates

| Route | Endpoint | 
| ------------- | ------------- |
| [**Update, replace, or create new, Workflow Template**](./WorkflowTemplatesRoute#update-replace-or-create-new-workflow-template) | **PUT** /api/v2/workflowtemplate |
| [**Create a new Workflow Template**](./WorkflowTemplatesRoute#create-a-new-workflow-template) | **POST** /api/v2/workflowtemplate |
| [**Delete a Workflow Template**](./WorkflowTemplatesRoute#delete-a-workflow-template) | **DELETE** /api/v2/workflowtemplate/{name} |
| [**Retrieve a Workflow Template**](./WorkflowTemplatesRoute#retrieve-a-workflow-template) | **GET** /api/v2/workflowtemplate/{name} |
| [**Search for Workflow Templates**](./WorkflowTemplatesRoute#search-for-workflow-templates) | **GET** /api/v2/workflowtemplate/query |

### Workflows

| Route | Endpoint | 
| ------------- | ------------- |
| [**Update, replace, or create new, Workflow for Canvas**](./WorkflowsRoute#update-replace-or-create-new-workflow-for-canvas) | **PUT** /api/v2/team/{team}/workflow/{name}/compose |
| [**Update, replace, or create new, Workflow**](./WorkflowsRoute#update-replace-or-create-new-workflow) | **PUT** /api/v2/team/{team}/workflow |
| [**Convert workflow to compose model for UI Designer and detailed Activity screens.**](./WorkflowsRoute#convert-workflow-to-compose-model-for-ui-designer-and-detailed-activity-screens) | **GET** /api/v2/team/{team}/workflow/{name}/compose |
| [**Create a new workflow**](./WorkflowsRoute#create-a-new-workflow) | **POST** /api/v2/team/{team}/workflow |
| [**Delete a workflow**](./WorkflowsRoute#delete-a-workflow) | **DELETE** /api/v2/team/{team}/workflow/{name} |
| [**Duplicates the workflow.**](./WorkflowsRoute#duplicates-the-workflow) | **POST** /api/v2/team/{team}/workflow/{name}/duplicate |
| [**Export the Workflow as JSON.**](./WorkflowsRoute#export-the-workflow-as-json) | **GET** /api/v2/team/{team}/workflow/{name}/export |
| [**Retrieve the parameters.**](./WorkflowsRoute#retrieve-the-parameters) | **GET** /api/v2/team/{team}/workflow/{name}/available-parameters |
| [**Retrieve the changlog**](./WorkflowsRoute#retrieve-the-changlog) | **GET** /api/v2/team/{team}/workflow/{name}/changelog |
| [**Retrieve a Workflow**](./WorkflowsRoute#retrieve-a-workflow) | **GET** /api/v2/team/{team}/workflow/{name} |
| [**Search for Workflows**](./WorkflowsRoute#search-for-workflows) | **GET** /api/v2/team/{team}/workflow/query |
| [**Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.**](./WorkflowsRoute#submit-a-workflow-to-be-run-will-queue-the-workflow-run-ready-for-execution) | **POST** /api/v2/team/{team}/workflow/{name}/submit |


<a name="models"></a>

## Models

 - [AbstractParam](./models/AbstractParam)
 - [Action](./models/Action)
 - [ActionRequest](./models/ActionRequest)
 - [ActionSummary](./models/ActionSummary)
 - [Actioner](./models/Actioner)
 - [ApproverGroup](./models/ApproverGroup)
 - [ApproverGroupRequest](./models/ApproverGroupRequest)
 - [CanvasEdge](./models/CanvasEdge)
 - [CanvasEdgeData](./models/CanvasEdgeData)
 - [CanvasNode](./models/CanvasNode)
 - [CanvasNodeData](./models/CanvasNodeData)
 - [CanvasNodePosition](./models/CanvasNodePosition)
 - [ChangeLog](./models/ChangeLog)
 - [ChangeLogVersion](./models/ChangeLogVersion)
 - [CloudEvent](./models/CloudEvent)
 - [CronValidationResponse](./models/CronValidationResponse)
 - [CurrentQuotas](./models/CurrentQuotas)
 - [Features](./models/Features)
 - [GHLinkRequest](./models/GHLinkRequest)
 - [HeaderFeatures](./models/HeaderFeatures)
 - [HeaderNavigation](./models/HeaderNavigation)
 - [HeaderNavigationResponse](./models/HeaderNavigationResponse)
 - [HeaderOption](./models/HeaderOption)
 - [HeaderPlatform](./models/HeaderPlatform)
 - [HeaderPlatformMessage](./models/HeaderPlatformMessage)
 - [Integration](./models/Integration)
 - [KeyValuePair](./models/KeyValuePair)
 - [Metadata](./models/Metadata)
 - [Navigation](./models/Navigation)
 - [OneTimeCode](./models/OneTimeCode)
 - [PageAction](./models/PageAction)
 - [PageTeam](./models/PageTeam)
 - [PageToken](./models/PageToken)
 - [PageUser](./models/PageUser)
 - [PageWorkflowRun](./models/PageWorkflowRun)
 - [PageWorkflowSchedule](./models/PageWorkflowSchedule)
 - [PageableObject](./models/PageableObject)
 - [ParamSpec](./models/ParamSpec)
 - [Quotas](./models/Quotas)
 - [ResolvedPermissions](./models/ResolvedPermissions)
 - [ResultSpec](./models/ResultSpec)
 - [Role](./models/Role)
 - [RunParam](./models/RunParam)
 - [RunResult](./models/RunResult)
 - [Setting](./models/Setting)
 - [SettingConfig](./models/SettingConfig)
 - [SortObject](./models/SortObject)
 - [Spec](./models/Spec)
 - [Spec_timeout](./models/Spec_timeout)
 - [Spec_timeout_units_inner](./models/Spec_timeout_units_inner)
 - [Step](./models/Step)
 - [Task](./models/Task)
 - [TaskEnvVar](./models/TaskEnvVar)
 - [TaskResponsePage](./models/TaskResponsePage)
 - [TaskRun](./models/TaskRun)
 - [TaskRunSpec](./models/TaskRunSpec)
 - [TaskSpec](./models/TaskSpec)
 - [TaskWorkspace](./models/TaskWorkspace)
 - [Team](./models/Team)
 - [TeamMember](./models/TeamMember)
 - [TeamNameCheckRequest](./models/TeamNameCheckRequest)
 - [TeamRequest](./models/TeamRequest)
 - [TeamSummary](./models/TeamSummary)
 - [TeamSummaryInsights](./models/TeamSummaryInsights)
 - [TektonTask](./models/TektonTask)
 - [Token](./models/Token)
 - [TokenCreateRequest](./models/TokenCreateRequest)
 - [TokenCreateResponse](./models/TokenCreateResponse)
 - [Trigger](./models/Trigger)
 - [TriggerCondition](./models/TriggerCondition)
 - [User](./models/User)
 - [UserProfile](./models/UserProfile)
 - [UserRequest](./models/UserRequest)
 - [UserSettings](./models/UserSettings)
 - [Workflow](./models/Workflow)
 - [WorkflowCanvas](./models/WorkflowCanvas)
 - [WorkflowResponsePage](./models/WorkflowResponsePage)
 - [WorkflowRun](./models/WorkflowRun)
 - [WorkflowRunCount](./models/WorkflowRunCount)
 - [WorkflowRunInsight](./models/WorkflowRunInsight)
 - [WorkflowRunRequest](./models/WorkflowRunRequest)
 - [WorkflowRunSummary](./models/WorkflowRunSummary)
 - [WorkflowSchedule](./models/WorkflowSchedule)
 - [WorkflowScheduleCalendar](./models/WorkflowScheduleCalendar)
 - [WorkflowSubmitRequest](./models/WorkflowSubmitRequest)
 - [WorkflowSummary](./models/WorkflowSummary)
 - [WorkflowTask](./models/WorkflowTask)
 - [WorkflowTaskDependency](./models/WorkflowTaskDependency)
 - [WorkflowTemplate](./models/WorkflowTemplate)
 - [WorkflowTemplateResponsePage](./models/WorkflowTemplateResponsePage)
 - [WorkflowTrigger](./models/WorkflowTrigger)
 - [WorkflowWorkspace](./models/WorkflowWorkspace)


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