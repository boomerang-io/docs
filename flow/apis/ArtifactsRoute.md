---
title: Artifacts
description: "Operations for Artifacts: List, download and delete the files tasks upload to runs."
verified: "5.0.0-beta.39"
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
| **workspace** | **String** | true | Owning workspace name. |  |  |
| **artifactId** | **String** | true | Artifact ID |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/artifacts/$ARTIFACT_ID" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/artifacts/{artifactId} -->
<!-- api-examples:end -->


## Delete a run's artifact, by name, and its file

`DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name}`

Requires the `workflowrun/delete` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  |  |
| **workflowRunId** | **String** | true | WorkflowRun ID |  |  |
| **name** | **String** | true | Artifact name |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `Not defined`

#### Response

No response body

#### Example request

```bash
curl -X DELETE "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID/artifacts/$ARTIFACT" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start DELETE /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name} -->
<!-- api-examples:end -->


## Download an artifact's file

`GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name}`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  |  |
| **workflowRunId** | **String** | true | WorkflowRun ID |  |  |
| **name** | **String** | true | Artifact name |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Any**

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID/artifacts/$ARTIFACT" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts/{name} -->
<!-- api-examples:end -->


## List a WorkflowRun's artifacts, expired ones included

`GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  |  |
| **workflowRunId** | **String** | true | WorkflowRun ID |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**Artifact**](./models/Artifact)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/workflowrun/$RUN_ID/artifacts" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}/artifacts -->
<!-- api-examples:end -->


## List the workspace's artifacts, largest first

`GET /api/v2/workspace/{workspace}/artifacts`

Requires the `workflowrun/read` permission, from a global, key, user, session token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true | Owning workspace name. |  |  |
| **statuses** | **List** of **String** | false | Artifact statuses to include. Defaults to available. |  Enum: [uploading, available, expired] | `available,expired` |
| **scope** | **String** | false | Only artifacts of this scope: run or workflow. Defaults to both. |  Enum: [run, workflow, log] | `workflow` |
| **workflow** | **String** | false | Only artifacts of this workflow, by name. |  | `nightly-build` |
| **page** | **Integer** | false | Page Number | Defaults to `0`. | `0` |
| **limit** | **Integer** | false | Result Size | Defaults to `10`. | `10` |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageArtifact**](./models/PageArtifact)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/workspace/$WORKSPACE/artifacts" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/workspace/{workspace}/artifacts -->
<!-- api-examples:end -->

