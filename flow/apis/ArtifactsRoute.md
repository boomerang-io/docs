---
title: Artifacts
---

# Artifacts

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Delete a workspace artifact, by id, and its file**](#delete-a-workspace-artifact-by-id-and-its-file) | DELETE | `/api/v2/workspace/{workspace}/artifacts/{artifactId}` |
| [**Delete a run's artifact, by name, and its file**](#delete-a-runs-artifact-by-name-and-its-file) | DELETE | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name}` |
| [**Download an artifact's file**](#download-an-artifacts-file) | GET | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name}` |
| [**List a WorkflowRun's artifacts, expired ones included**](#list-a-workflowruns-artifacts-expired-ones-included) | GET | `/api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts` |
| [**List the workspace's artifacts, largest first**](#list-the-workspaces-artifacts-largest-first) | GET | `/api/v2/workspace/{workspace}/artifacts` |



## Delete a workspace artifact, by id, and its file

`DELETE /api/v2/workspace/{workspace}/artifacts/{artifactId}`

Requires the `workflowrun/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | workspace_example |
| **artifactId** | **String** | true | Artifact ID | Defaults to null. | artifactId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Delete a run's artifact, by name, and its file

`DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name}`

Requires the `workflowrun/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | workspace_example |
| **workflowRunId** | **String** | true | WorkflowRun ID | Defaults to null. | workflowRunId_example |
| **name** | **String** | true | Artifact name | Defaults to null. | name_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body


## Download an artifact's file

`GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name}`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | workspace_example |
| **workflowRunId** | **String** | true | WorkflowRun ID | Defaults to null. | workflowRunId_example |
| **name** | **String** | true | Artifact name | Defaults to null. | name_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Any**


## List a WorkflowRun's artifacts, expired ones included

`GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | workspace_example |
| **workflowRunId** | **String** | true | WorkflowRun ID | Defaults to null. | workflowRunId_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**Artifact**](./models/Artifact)


## List the workspace's artifacts, largest first

`GET /api/v2/workspace/{workspace}/artifacts`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. | Defaults to null. | workspace_example |
| **statuses** | **List** of **String** | false | Artifact statuses to include. Defaults to available. | Defaults to null. Enum: [uploading, available, expired] | available,expired |
| **scope** | **String** | false | Only artifacts of this scope: run or workflow. Defaults to both. | Defaults to null. Enum: [run, workflow, log] | workflow |
| **workflow** | **String** | false | Only artifacts of this workflow, by name. | Defaults to null. | nightly-build |
| **page** | **Integer** | false | Page Number | Defaults to 0. | 0 |
| **limit** | **Integer** | false | Result Size | Defaults to 10. | 10 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageArtifact**](./models/PageArtifact)

