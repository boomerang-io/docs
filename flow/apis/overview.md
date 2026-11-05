---
title: Overview
order: 1
description: What every Flow API route has in common, and an index of the routes and models.
---

<!-- Generated from contracts/api-v2.yaml at 5.0.0-beta.39 by flow/apis/assets/templates/README.mustache. Edit the template, not this page: see CLAUDE.md. -->

# Overview

Flow exposes a REST API under `/api/v2`. This page covers what every route has in common: where the API is, how to authenticate, and how errors, paging, labels and YAML work. The route pages list each operation with its parameters, permission and response.

## Where is the API?

Every route is under `/api/v2` on service-core. A resource that a workspace owns is under `/api/v2/workspace/{workspace}/…`, where `{workspace}` is the workspace's name. Everything else is global.

```bash
curl -H "Authorization: Bearer $FLOW_TOKEN" \
  "https://flow.example.com/api/v2/workspace/my-workspace/workflowrun/query?statuses=failed&limit=20"
```

`/api/v2` only gains routes and fields within 5.x, so a client written against an earlier 5.x release keeps working against a later one. The health probe, `GET /health`, is outside `/api/v2` and needs no token.

## Authenticate

Every route needs a Flow token, except the five that Slack and GitHub call: the GitHub App callback and four Slack routes. Those verify the request themselves, and their **Authorization** section reads "No authorization required". Send the token in one of the ways below.

### BearerAuth

`Authorization: Bearer <token>`, an HTTP bearer token. Send a Flow token, such as a `bfk_` key token. Behind an authenticating proxy, Flow also accepts the proxy's JSON Web Token (JWT) here, which is the format the contract names: `JWT`.


### access_token

`?access_token=<token>`, a URL query parameter. A token in the URL, for webhook senders that cannot set a header. Only the routes whose **Authorization** section lists `access_token` accept it: `POST /api/v2/webhook`, `POST /api/v2/event`, and `GET` or `POST /api/v2/callback`.

> **Warning:** A token in a URL is recorded by every proxy and access log it passes through. Prefer a header. If a sender can only use the URL, give it a `key` token with only the `webhook/action` permission on its workspace.


### x-access-token

`x-access-token: <token>`, an HTTP header. Send a Flow token here instead of in `Authorization`.


### Which token?

Each route's description names the permission it needs and the token kinds it accepts, for example "Requires the `workflowrun/read` permission, from a global, key, user, session token." [Machine tokens](../hosting/machine-tokens) covers the token kinds and how to create them, and [Tokens](../architecture/security#tokens) covers what each kind grants.

A request without a valid token is `401`, with a `WWW-Authenticate: Bearer` header. A token that lacks the route's permission is a bare `403` with no body. With `flow.security.enabled=false`, Flow checks no token at all: see [What happens with security off?](../architecture/security#what-happens-with-security-off).

## Read an error

An error Flow raises is a `RestErrorResponse`:

```json
{
  "timestamp": "2026-09-01T10:00:00.000+00:00",
  "code": 1001,
  "reason": "QUERY_INVALID_FILTERS",
  "message": "Invalid query filters(labels) have been provided.",
  "status": "400 BAD_REQUEST"
}
```

| Field | Holds |
| --- | --- |
| `timestamp` | When Flow raised the error |
| `code` | A number. Below 1000 mirrors HTTP. Then 10xx is generic, 11xx workspace, 12xx workflow, 13xx workflow run, 14xx task, 15xx task run, 16xx action, 17xx schedule, 18xx parameter, 19xx integration and 20xx artifact. |
| `reason` | The error's name, such as `WORKFLOWRUN_INVALID_REFERENCE`. Key on `reason`, not `code`: codes 1405 and 1802 each carry two reasons. |
| `message` | A readable explanation |
| `status` | The HTTP status, as its code and name |

The response adds `cause` only when the operator sets `flow.error.include-cause=true`. The default is `false`.

- A resource in the path that doesn't exist, or that you can't reach, is `404`, with a reason such as `WORKSPACE_INVALID_REF` or `WORKFLOWRUN_INVALID_REFERENCE`.
- Blank, missing or unusable input is `400`, with a reason such as `WORKFLOW_INVALID_REQ`.
- `PERMISSION_DENIED` carries code 403 but answers HTTP 401.
- Two answers have no `RestErrorResponse` body: a missing permission, which is a bare `403`, and a framework error such as a malformed body or an unsupported method, which keeps Spring's problem-detail body.

## Page through a list

List routes, usually ending `/query`, take these query parameters:
- `page`, counted from 0;
- `limit`;
- `order`, `ASC` or `DESC`;
- `sort`, a field name, where the list is sortable.

They return a page: the matches in `content`, with `totalElements`, `totalPages`, `number` and `size`. On the run, task run, workflow, task, workspace, user and token lists, leaving out `limit` returns every match. The action and schedule lists default to 10.

The run, task run, action and token lists also take `fromDate` and `toDate`, in epoch milliseconds: `fromDate` is included and `toDate` is not. `statuses` and `phase` ignore case. A value that names no status or phase is `400 QUERY_INVALID_FILTERS`.

## Filter by label

`labels` keeps the items that carry every `key=value` pair you list. URL-encode each pair and separate the pairs with commas: `labels=Organization%3DBoomerang,customKey%3Dtest`. Each pair splits on its first `=`, so `a%3Db%3Dc` matches the value `b=c`. A pair without a key or a value is `400 QUERY_INVALID_FILTERS`.

Labels under `boomerang.io/` are Flow's own. Flow sets some, such as `boomerang.io/model` on an AI task run, and drops any that a client sends. `PATCH` on a workspace replaces its labels, and `PUT` on a workflow merges them unless you add `replace=true`.

## Send and receive YAML

The task routes, under `/api/v2/task` and `/api/v2/workspace/{workspace}/task`, also serve and accept a task as YAML. Send `Accept: application/x-yaml` to read YAML and `Content-Type: application/x-yaml` to write it. With no `Accept` header, Flow answers JSON.

The YAML is a Tekton Task. Its `boomerang.io/params` annotation carries each parameter's other fields, so a task you read and apply back unchanged stays as it was.

## Use a client library

`flow-sdk` is the public API as a Java library: `Flow.connect(url, token)`, then typed calls to submit, read, cancel and retry workflow runs, query runs and task runs by label, and read Insights. Each Flow release publishes it to GitHub Packages as `io.boomerang:flow-sdk`, at the release's version. Use the version of the Flow you run against. Reading GitHub Packages needs a GitHub token with `read:packages`. [Call Flow with flow-sdk](../extend/embed-flow#call-flow-with-flow-sdk) has the dependency, an example and what the library covers.

Flow publishes no client for other languages. Generate one from the contract with a tool such as [OpenAPI Generator](https://openapi-generator.tech).

## Get the full contract

These pages are generated from [`contracts/api-v2.yaml`](https://github.com/boomerang-io/flow/blob/5.0.0-beta.39/contracts/api-v2.yaml) at `5.0.0-beta.39`, an OpenAPI 3.1.0 document. The rules every route follows are in [`specifications/api-contract.md`](https://github.com/boomerang-io/flow/blob/5.0.0-beta.39/specifications/api-contract.md). A running service-core serves the same document at `/api/docs/spec/api-v2`, and Swagger UI at `/api/docs/swagger-ui`.

## Routes


### Actions

| Route | Endpoint |
| ----- | -------- |
| [**Provide an update for an Action**](./ActionsRoute#provide-an-update-for-an-action) | `PUT /api/v2/workspace/{workspace}/action` |
| [**Retrieve a specific Action by Id**](./ActionsRoute#retrieve-a-specific-action-by-id) | `GET /api/v2/workspace/{workspace}/action/{actionId}` |
| [**Search for Actions**](./ActionsRoute#search-for-actions) | `GET /api/v2/workspace/{workspace}/action/query` |
| [**Get Actions Summary**](./ActionsRoute#get-actions-summary) | `GET /api/v2/workspace/{workspace}/action/summary` |

### Artifacts

| Route | Endpoint |
| ----- | -------- |
| [**Delete a workspace artifact, by id, and its file**](./ArtifactsRoute#delete-a-workspace-artifact-by-id-and-its-file) | `DELETE /api/v2/workspace/{workspace}/artifacts/{artifactId}` |
| [**Delete a run's artifact, by name, and its file**](./ArtifactsRoute#delete-a-runs-artifact-by-name-and-its-file) | `DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name}` |
| [**Download an artifact's file**](./ArtifactsRoute#download-an-artifacts-file) | `GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name}` |
| [**List a WorkflowRun's artifacts, expired ones included**](./ArtifactsRoute#list-a-workflowruns-artifacts-expired-ones-included) | `GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts` |
| [**List the workspace's artifacts, largest first**](./ArtifactsRoute#list-the-workspaces-artifacts-largest-first) | `GET /api/v2/workspace/{workspace}/artifacts` |

### Audit

| Route | Endpoint |
| ----- | -------- |
| [**Query the audit trail**](./AuditRoute#query-the-audit-trail) | `GET /api/v2/audit` |
| [**Count the audit trail by outcome**](./AuditRoute#count-the-audit-trail-by-outcome) | `GET /api/v2/audit/stats` |

### Insights

| Route | Endpoint |
| ----- | -------- |
| [**Summarise a workspace's runs over a period**](./InsightsRoute#summarise-a-workspaces-runs-over-a-period) | `GET /api/v2/workspace/{workspace}/insights` |
| [**Summarise runs across workspaces over a period**](./InsightsRoute#summarise-runs-across-workspaces-over-a-period) | `GET /api/v2/insights` |
| [**List task runs across workspaces**](./InsightsRoute#list-task-runs-across-workspaces) | `GET /api/v2/insights/taskruns` |
| [**Group a workspace's task runs over a period**](./InsightsRoute#group-a-workspaces-task-runs-over-a-period) | `GET /api/v2/workspace/{workspace}/insights/tasks` |
| [**Group task runs across workspaces over a period**](./InsightsRoute#group-task-runs-across-workspaces-over-a-period) | `GET /api/v2/insights/tasks` |
| [**Detail one workflow's runs over a period**](./InsightsRoute#detail-one-workflows-runs-over-a-period) | `GET /api/v2/workspace/{workspace}/insights/workflow/{workflow}` |

### Integrations

| Route | Endpoint |
| ----- | -------- |
| [**Retrieve the integrations and their status within a Workspace**](./IntegrationsRoute#retrieve-the-integrations-and-their-status-within-a-workspace) | `GET /api/v2/integration` |
| [**Receive the GitHub App installation setup callback**](./IntegrationsRoute#receive-the-github-app-installation-setup-callback) | `GET /api/v2/integration/github/callback` |
| [**Retrieve the installation ID and store against a workspace**](./IntegrationsRoute#retrieve-the-installation-id-and-store-against-a-workspace) | `GET /api/v2/integration/github/installation` |
| [**Unlinks the GitHub Installation ID from a Workspace**](./IntegrationsRoute#unlinks-the-github-installation-id-from-a-workspace) | `POST /api/v2/integration/github/unlink` |
| [**Install URL Redirect**](./IntegrationsRoute#install-url-redirect) | `GET /api/v2/integration/slack/install` |
| [**Receive Slack Oauth2 request**](./IntegrationsRoute#receive-slack-oauth2-request) | `GET /api/v2/integration/slack/auth` |
| [**Receive Slack Slash Commands**](./IntegrationsRoute#receive-slack-slash-commands) | `POST /api/v2/integration/slack/commands` |
| [**Receive Slack Events**](./IntegrationsRoute#receive-slack-events) | `POST /api/v2/integration/slack/events` |
| [**Receive Slack Interactivity**](./IntegrationsRoute#receive-slack-interactivity) | `POST /api/v2/integration/slack/interactivity` |
| [**Shares an integration's credentials with the Workspace's tasks as managed Workspace parameters, or stops sharing them: GitHub's installation token, Slack's bot token, or the values entered for a form integration such as Google or Microsoft**](./IntegrationsRoute#shares-an-integrations-credentials-with-the-workspaces-tasks-as-managed-workspace-parameters-or-stops-sharing-them-githubs-installation-token-slacks-bot-token-or-the-values-entered-for-a-form-integration-such-as-google-or-microsoft) | `POST /api/v2/integration/{integration}/share` |
| [**Disconnects the Slack installation from a Workspace**](./IntegrationsRoute#disconnects-the-slack-installation-from-a-workspace) | `POST /api/v2/integration/slack/unlink` |

### Parameters

| Route | Endpoint |
| ----- | -------- |
| [**Create a global Param**](./ParametersRoute#create-a-global-param) | `POST /api/v2/parameters` |
| [**Delete a global Param**](./ParametersRoute#delete-a-global-param) | `DELETE /api/v2/parameters/{name}` |
| [**Get all global Params**](./ParametersRoute#get-all-global-params) | `GET /api/v2/parameters` |
| [**Update a global Param**](./ParametersRoute#update-a-global-param) | `PATCH /api/v2/parameters/{name}` |

### Profile

| Route | Endpoint |
| ----- | -------- |
| [**Get your Profile**](./ProfileRoute#get-your-profile) | `GET /api/v2/profile` |
| [**Patch your Profile**](./ProfileRoute#patch-your-profile) | `PATCH /api/v2/profile` |

### Schedules

| Route | Endpoint |
| ----- | -------- |
| [**Create a Schedule.**](./SchedulesRoute#create-a-schedule) | `POST /api/v2/workspace/{workspace}/schedule` |
| [**Delete a Schedule.**](./SchedulesRoute#delete-a-schedule) | `DELETE /api/v2/workspace/{workspace}/schedule/{scheduleId}` |
| [**Retrieve a Schedule.**](./SchedulesRoute#retrieve-a-schedule) | `GET /api/v2/workspace/{workspace}/schedule/{scheduleId}` |
| [**Retrieve Calendars for Schedules by Dates.**](./SchedulesRoute#retrieve-calendars-for-schedules-by-dates) | `GET /api/v2/workspace/{workspace}/schedule/calendars` |
| [**Search for Schedules**](./SchedulesRoute#search-for-schedules) | `GET /api/v2/workspace/{workspace}/schedule/query` |
| [**Apply a Schedule.**](./SchedulesRoute#apply-a-schedule) | `PUT /api/v2/workspace/{workspace}/schedule` |
| [**Validate a Schedules CRON.**](./SchedulesRoute#validate-a-schedules-cron) | `GET /api/v2/workspace/{workspace}/schedule/validate-cron` |

### System

| Route | Endpoint |
| ----- | -------- |
| [**Retrieve Boomerang Flow Settings**](./SystemRoute#retrieve-boomerang-flow-settings) | `GET /api/v2/settings` |
| [**Retrieve feature flags.**](./SystemRoute#retrieve-feature-flags) | `GET /api/v2/features` |
| [**Retrieve this instances context, features, and navigation.**](./SystemRoute#retrieve-this-instances-context-features-and-navigation) | `GET /api/v2/context` |
| [**Retrieve navigation.**](./SystemRoute#retrieve-navigation) | `GET /api/v2/navigation` |
| [**Update Boomerang Flow Settings**](./SystemRoute#update-boomerang-flow-settings) | `PATCH /api/v2/settings` |
| [**List outbox rows, dead ones by default.**](./SystemRoute#list-outbox-rows-dead-ones-by-default) | `GET /api/v2/system/outbox` |
| [**Register and activate an installation of Flow**](./SystemRoute#register-and-activate-an-installation-of-flow) | `PUT /api/v2/activate` |
| [**Replay outbox rows**](./SystemRoute#replay-outbox-rows) | `PUT /api/v2/system/outbox/replay` |

### Task Runs

| Route | Endpoint |
| ----- | -------- |
| [**Search for TaskRuns across WorkflowRuns**](./TaskRunsRoute#search-for-taskruns-across-workflowruns) | `GET /api/v2/workspace/{workspace}/taskrun/query` |
| [**Retrieve a TaskRuns log from a specific WorkflowRun.**](./TaskRunsRoute#retrieve-a-taskruns-log-from-a-specific-workflowrun) | `GET /api/v2/taskrun/{taskRunId}/log` |

### Tasks

| Route | Endpoint |
| ----- | -------- |
| [**Update, replace, or create a global task using Tekton Task YAML**](./TasksRoute#update-replace-or-create-a-global-task-using-tekton-task-yaml) | `PUT /api/v2/task/{name}` |
| [**Create a new Task using Tekton Task YAML**](./TasksRoute#create-a-new-task-using-tekton-task-yaml) | `POST /api/v2/task` |
| [**Delete a Task**](./TasksRoute#delete-a-task) | `DELETE /api/v2/task/{name}` |
| [**Retrieve a global task as Tekton Task YAML. If no version specified, the latest version is returned.**](./TasksRoute#retrieve-a-global-task-as-tekton-task-yaml-if-no-version-specified-the-latest-version-is-returned) | `GET /api/v2/task/{name}` |
| [**Retrieve a global task's changelog**](./TasksRoute#retrieve-a-global-tasks-changelog) | `GET /api/v2/task/{name}/changelog` |
| [**Search for Task. If workspaces are provided it will query the workspaces. If no workspaces are provided it will query Global Task Templates**](./TasksRoute#search-for-task-if-workspaces-are-provided-it-will-query-the-workspaces-if-no-workspaces-are-provided-it-will-query-global-task-templates) | `GET /api/v2/task/query` |
| [**Validate a global task's Tekton Task YAML**](./TasksRoute#validate-a-global-tasks-tekton-task-yaml) | `POST /api/v2/task/validate` |

### Token Management

| Route | Endpoint |
| ----- | -------- |
| [**Create Token**](./TokenManagementRoute#create-token) | `POST /api/v2/token` |
| [**Delete Token**](./TokenManagementRoute#delete-token) | `DELETE /api/v2/token/{id}` |
| [**Retrieve the permission catalog for building a Token**](./TokenManagementRoute#retrieve-the-permission-catalog-for-building-a-token) | `GET /api/v2/token/catalog` |
| [**Search for Tokens**](./TokenManagementRoute#search-for-tokens) | `GET /api/v2/token/query` |

### Users

| Route | Endpoint |
| ----- | -------- |
| [**Update a Boomerang Flow Users details**](./UsersRoute#update-a-boomerang-flow-users-details) | `PATCH /api/v2/user/{userId}` |
| [**Delete a Boomerang Flow user**](./UsersRoute#delete-a-boomerang-flow-user) | `DELETE /api/v2/user/{userId}` |
| [**Get a Users details**](./UsersRoute#get-a-users-details) | `GET /api/v2/user/{userId}` |
| [**Get a Users Workspace memberships**](./UsersRoute#get-a-users-workspace-memberships) | `GET /api/v2/user/{userId}/workspaces` |
| [**Search for Users**](./UsersRoute#search-for-users) | `GET /api/v2/user/query` |

### Webhooks and Events

| Route | Endpoint |
| ----- | -------- |
| [**Accept CloudEvent**](./WebhooksAndEventsRoute#accept-cloudevent) | `POST /api/v2/event` |
| [**Accept Wait for Event Callbcak**](./WebhooksAndEventsRoute#accept-wait-for-event-callbcak) | `GET /api/v2/callback` |
| [**Accept Wait for Event Callback with JSON Payload**](./WebhooksAndEventsRoute#accept-wait-for-event-callback-with-json-payload) | `POST /api/v2/callback` |
| [**Accept Webhook payloads from various sources.**](./WebhooksAndEventsRoute#accept-webhook-payloads-from-various-sources) | `POST /api/v2/webhook` |

### Workflow Runs

| Route | Endpoint |
| ----- | -------- |
| [**Cancel a WorkflowRun**](./WorkflowRunsRoute#cancel-a-workflowrun) | `DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/cancel` |
| [**Retrieve a summary of WorkflowRuns by Status.**](./WorkflowRunsRoute#retrieve-a-summary-of-workflowruns-by-status) | `GET /api/v2/workspace/{workspace}/workflowrun/count` |
| [**Retrieve a specific WorkflowRun.**](./WorkflowRunsRoute#retrieve-a-specific-workflowrun) | `GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}` |
| [**Pause a running WorkflowRun**](./WorkflowRunsRoute#pause-a-running-workflowrun) | `PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/pause` |
| [**Purge a WorkflowRun with everything it owns and its lineage: its retries, its child runs, their task runs, actions, artifacts and logs. A run in flight is cancelled first. Audit records stay.**](./WorkflowRunsRoute#purge-a-workflowrun-with-everything-it-owns-and-its-lineage-its-retries-its-child-runs-their-task-runs-actions-artifacts-and-logs-a-run-in-flight-is-cancelled-first-audit-records-stay) | `DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}` |
| [**Purge the WorkflowRuns matching every label, oldest first, each with its lineage. One call takes a page of matches and reports how many remain; repeat until none.**](./WorkflowRunsRoute#purge-the-workflowruns-matching-every-label-oldest-first-each-with-its-lineage-one-call-takes-a-page-of-matches-and-reports-how-many-remain-repeat-until-none) | `DELETE /api/v2/workspace/{workspace}/workflowrun` |
| [**Search for WorkflowRuns**](./WorkflowRunsRoute#search-for-workflowruns) | `GET /api/v2/workspace/{workspace}/workflowrun/query` |
| [**Resume a paused WorkflowRun**](./WorkflowRunsRoute#resume-a-paused-workflowrun) | `PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/resume` |
| [**Retry WorkflowRun execution.**](./WorkflowRunsRoute#retry-workflowrun-execution) | `PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/retry` |
| [**Start WorkflowRun execution. The WorkflowRun has to already have been queued.**](./WorkflowRunsRoute#start-workflowrun-execution-the-workflowrun-has-to-already-have-been-queued) | `PUT /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/start` |

### Workflows

| Route | Endpoint |
| ----- | -------- |
| [**Update, replace, or create new, Workflow for Canvas**](./WorkflowsRoute#update-replace-or-create-new-workflow-for-canvas) | `PUT /api/v2/workspace/{workspace}/workflow/{name}/compose` |
| [**Update, replace, or create new, Workflow**](./WorkflowsRoute#update-replace-or-create-new-workflow) | `PUT /api/v2/workspace/{workspace}/workflow` |
| [**Convert workflow to compose model for UI Designer and detailed Activity screens.**](./WorkflowsRoute#convert-workflow-to-compose-model-for-ui-designer-and-detailed-activity-screens) | `GET /api/v2/workspace/{workspace}/workflow/{name}/compose` |
| [**Create a new workflow**](./WorkflowsRoute#create-a-new-workflow) | `POST /api/v2/workspace/{workspace}/workflow` |
| [**Delete a workflow**](./WorkflowsRoute#delete-a-workflow) | `DELETE /api/v2/workspace/{workspace}/workflow/{name}` |
| [**Duplicates the workflow.**](./WorkflowsRoute#duplicates-the-workflow) | `POST /api/v2/workspace/{workspace}/workflow/{name}/duplicate` |
| [**Export the Workflow as JSON.**](./WorkflowsRoute#export-the-workflow-as-json) | `GET /api/v2/workspace/{workspace}/workflow/{name}/export` |
| [**Retrieve the parameters.**](./WorkflowsRoute#retrieve-the-parameters) | `GET /api/v2/workspace/{workspace}/workflow/{name}/available-parameters` |
| [**Retrieve a workflow's changelog**](./WorkflowsRoute#retrieve-a-workflows-changelog) | `GET /api/v2/workspace/{workspace}/workflow/{name}/changelog` |
| [**Retrieve a Workflow**](./WorkflowsRoute#retrieve-a-workflow) | `GET /api/v2/workspace/{workspace}/workflow/{name}` |
| [**Change what a workflow is**](./WorkflowsRoute#change-what-a-workflow-is) | `PATCH /api/v2/workspace/{workspace}/workflow/{name}` |
| [**Search for Workflows**](./WorkflowsRoute#search-for-workflows) | `GET /api/v2/workspace/{workspace}/workflow/query` |
| [**Submit a Workflow to be run. Will queue the WorkflowRun ready for execution.**](./WorkflowsRoute#submit-a-workflow-to-be-run-will-queue-the-workflowrun-ready-for-execution) | `POST /api/v2/workspace/{workspace}/workflow/{name}/submit` |

### Workspace Management

| Route | Endpoint |
| ----- | -------- |
| [**Create new workspace**](./WorkspaceManagementRoute#create-new-workspace) | `POST /api/v2/workspace` |
| [**Delete Approver Groups**](./WorkspaceManagementRoute#delete-approver-groups) | `DELETE /api/v2/workspace/{workspace}/approvers` |
| [**Delete Workspace Parameter**](./WorkspaceManagementRoute#delete-workspace-parameter) | `DELETE /api/v2/workspace/{workspace}/parameters/{name}` |
| [**Delete Workspace**](./WorkspaceManagementRoute#delete-workspace) | `DELETE /api/v2/workspace/{workspace}` |
| [**Retrieve Default Workspace Quota**](./WorkspaceManagementRoute#retrieve-default-workspace-quota) | `GET /api/v2/workspace/quotas/default` |
| [**Retrieve Workspace Roles**](./WorkspaceManagementRoute#retrieve-workspace-roles) | `GET /api/v2/workspace/roles` |
| [**Get workspace**](./WorkspaceManagementRoute#get-workspace) | `GET /api/v2/workspace/{workspace}` |
| [**Search for Workspaces**](./WorkspaceManagementRoute#search-for-workspaces) | `GET /api/v2/workspace/query` |
| [**Leave Workspace**](./WorkspaceManagementRoute#leave-workspace) | `DELETE /api/v2/workspace/{workspace}/leave` |
| [**Remove Workspace Members**](./WorkspaceManagementRoute#remove-workspace-members) | `DELETE /api/v2/workspace/{workspace}/members` |
| [**Reset Workspace Quota**](./WorkspaceManagementRoute#reset-workspace-quota) | `DELETE /api/v2/workspace/{workspace}/quotas` |
| [**Patch or update a workspace**](./WorkspaceManagementRoute#patch-or-update-a-workspace) | `PATCH /api/v2/workspace/{workspace}` |
| [**Validate workspace name and check uniqueness.**](./WorkspaceManagementRoute#validate-workspace-name-and-check-uniqueness) | `POST /api/v2/workspace/validate-name` |

### Workspace Tasks

| Route | Endpoint |
| ----- | -------- |
| [**Update, replace, or create a workspace task using Tekton Task YAML**](./WorkspaceTasksRoute#update-replace-or-create-a-workspace-task-using-tekton-task-yaml) | `PUT /api/v2/workspace/{workspace}/task/{name}` |
| [**Create a new Task Template using Tekton Task YAML**](./WorkspaceTasksRoute#create-a-new-task-template-using-tekton-task-yaml) | `POST /api/v2/workspace/{workspace}/task` |
| [**Delete a Workspace Task**](./WorkspaceTasksRoute#delete-a-workspace-task) | `DELETE /api/v2/workspace/{workspace}/task/{name}` |
| [**Retrieve a workspace task as Tekton Task YAML. If no version specified, the latest version is returned.**](./WorkspaceTasksRoute#retrieve-a-workspace-task-as-tekton-task-yaml-if-no-version-specified-the-latest-version-is-returned) | `GET /api/v2/workspace/{workspace}/task/{name}` |
| [**Retrieve a workspace task's changelog**](./WorkspaceTasksRoute#retrieve-a-workspace-tasks-changelog) | `GET /api/v2/workspace/{workspace}/task/{name}/changelog` |
| [**Search for Tasks. If workspaces are provided it will query the workspaces. If no workspaces are provided it will query Global Task Templates**](./WorkspaceTasksRoute#search-for-tasks-if-workspaces-are-provided-it-will-query-the-workspaces-if-no-workspaces-are-provided-it-will-query-global-task-templates) | `GET /api/v2/workspace/{workspace}/task/query` |
| [**Validate a workspace task's Tekton Task YAML**](./WorkspaceTasksRoute#validate-a-workspace-tasks-tekton-task-yaml) | `POST /api/v2/workspace/{workspace}/task/validate` |


## Models

- [AbstractParam](./models/AbstractParam)
- [Action](./models/Action)
- [ActionRequest](./models/ActionRequest)
- [ActionSummary](./models/ActionSummary)
- [Actioner](./models/Actioner)
- [ApproverGroup](./models/ApproverGroup)
- [ApproverGroupRequest](./models/ApproverGroupRequest)
- [Artifact](./models/Artifact)
- [AuditEvent](./models/AuditEvent)
- [AuditStats](./models/AuditStats)
- [CanvasEdge](./models/CanvasEdge)
- [CanvasEdgeData](./models/CanvasEdgeData)
- [CanvasNode](./models/CanvasNode)
- [CanvasNodeData](./models/CanvasNodeData)
- [CanvasNodePosition](./models/CanvasNodePosition)
- [ChangeLog](./models/ChangeLog)
- [ChangeLogVersion](./models/ChangeLogVersion)
- [CronValidationResponse](./models/CronValidationResponse)
- [CurrentQuotas](./models/CurrentQuotas)
- [Day](./models/Day)
- [EventOutboxEntity](./models/EventOutboxEntity)
- [Failure](./models/Failure)
- [Features](./models/Features)
- [GHLinkRequest](./models/GHLinkRequest)
- [GHShareRequest](./models/GHShareRequest)
- [HeaderFeatures](./models/HeaderFeatures)
- [HeaderNavigation](./models/HeaderNavigation)
- [HeaderNavigationResponse](./models/HeaderNavigationResponse)
- [HeaderOption](./models/HeaderOption)
- [HeaderPlatform](./models/HeaderPlatform)
- [HeaderPlatformMessage](./models/HeaderPlatformMessage)
- [Integration](./models/Integration)
- [JsonNode](./models/JsonNode)
- [KeyValuePair](./models/KeyValuePair)
- [ModelUsage](./models/ModelUsage)
- [Navigation](./models/Navigation)
- [OneTimeCode](./models/OneTimeCode)
- [OutboxReplayResponse](./models/OutboxReplayResponse)
- [PageAction](./models/PageAction)
- [PageArtifact](./models/PageArtifact)
- [PageAuditEvent](./models/PageAuditEvent)
- [PageEventOutboxEntity](./models/PageEventOutboxEntity)
- [PageTaskRun](./models/PageTaskRun)
- [PageToken](./models/PageToken)
- [PageUser](./models/PageUser)
- [PageWorkflowRun](./models/PageWorkflowRun)
- [PageWorkflowSchedule](./models/PageWorkflowSchedule)
- [PageWorkspace](./models/PageWorkspace)
- [PageableObject](./models/PageableObject)
- [ParamSpec](./models/ParamSpec)
- [Quotas](./models/Quotas)
- [ResolvedPermissions](./models/ResolvedPermissions)
- [ResultSpec](./models/ResultSpec)
- [RetryBackoff](./models/RetryBackoff)
- [RetryFrom](./models/RetryFrom)
- [Role](./models/Role)
- [Routing](./models/Routing)
- [Row](./models/Row)
- [RunAttempt](./models/RunAttempt)
- [RunParam](./models/RunParam)
- [RunResult](./models/RunResult)
- [RunRetry](./models/RunRetry)
- [RunState](./models/RunState)
- [Setting](./models/Setting)
- [SettingConfig](./models/SettingConfig)
- [SlowTaskRun](./models/SlowTaskRun)
- [SortObject](./models/SortObject)
- [Step](./models/Step)
- [Task](./models/Task)
- [TaskEnvVar](./models/TaskEnvVar)
- [TaskResponsePage](./models/TaskResponsePage)
- [TaskRow](./models/TaskRow)
- [TaskRun](./models/TaskRun)
- [TaskRunRow](./models/TaskRunRow)
- [TaskRunSpec](./models/TaskRunSpec)
- [TaskSpec](./models/TaskSpec)
- [TektonMetadata](./models/TektonMetadata)
- [TektonSpec](./models/TektonSpec)
- [TektonTask](./models/TektonTask)
- [Token](./models/Token)
- [TokenCreateRequest](./models/TokenCreateRequest)
- [TokenCreateResponse](./models/TokenCreateResponse)
- [TokenPermissionCatalog](./models/TokenPermissionCatalog)
- [Totals](./models/Totals)
- [Trigger](./models/Trigger)
- [TriggerCondition](./models/TriggerCondition)
- [User](./models/User)
- [UserProfile](./models/UserProfile)
- [UserRequest](./models/UserRequest)
- [UserSettings](./models/UserSettings)
- [Workflow](./models/Workflow)
- [WorkflowCanvas](./models/WorkflowCanvas)
- [WorkflowConcurrency](./models/WorkflowConcurrency)
- [WorkflowPatch](./models/WorkflowPatch)
- [WorkflowResponsePage](./models/WorkflowResponsePage)
- [WorkflowRow](./models/WorkflowRow)
- [WorkflowRun](./models/WorkflowRun)
- [WorkflowRunCount](./models/WorkflowRunCount)
- [WorkflowRunInsightSummary](./models/WorkflowRunInsightSummary)
- [WorkflowRunInsightTaskRunPage](./models/WorkflowRunInsightTaskRunPage)
- [WorkflowRunInsightTasks](./models/WorkflowRunInsightTasks)
- [WorkflowRunInsightUsage](./models/WorkflowRunInsightUsage)
- [WorkflowRunInsightWorkflowDetail](./models/WorkflowRunInsightWorkflowDetail)
- [WorkflowRunPurge](./models/WorkflowRunPurge)
- [WorkflowRunRequest](./models/WorkflowRunRequest)
- [WorkflowRunRetryRequest](./models/WorkflowRunRetryRequest)
- [WorkflowSchedule](./models/WorkflowSchedule)
- [WorkflowScheduleCalendar](./models/WorkflowScheduleCalendar)
- [WorkflowSubmitRequest](./models/WorkflowSubmitRequest)
- [WorkflowSummary](./models/WorkflowSummary)
- [WorkflowTask](./models/WorkflowTask)
- [WorkflowTaskDependency](./models/WorkflowTaskDependency)
- [WorkflowTaskForeach](./models/WorkflowTaskForeach)
- [WorkflowTaskRetry](./models/WorkflowTaskRetry)
- [WorkflowTemplateRef](./models/WorkflowTemplateRef)
- [WorkflowTrigger](./models/WorkflowTrigger)
- [WorkflowWorkspace](./models/WorkflowWorkspace)
- [Workspace](./models/Workspace)
- [WorkspaceMember](./models/WorkspaceMember)
- [WorkspaceNameCheckRequest](./models/WorkspaceNameCheckRequest)
- [WorkspaceRequest](./models/WorkspaceRequest)
- [WorkspaceSummary](./models/WorkspaceSummary)
- [WorkspaceSummaryInsights](./models/WorkspaceSummaryInsights)

