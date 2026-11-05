---
title: Integrations Route
---

# Integrations Route

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Retrieve the integrations and their status within a Workspace**](#retrieve-the-integrations-and-their-status-within-a-workspace) | GET | `/api/v2/integration` |
| [**Receive the GitHub App installation setup callback**](#receive-the-github-app-installation-setup-callback) | GET | `/api/v2/integration/github/callback` |
| [**Retrieve the installation ID and store against a workspace**](#retrieve-the-installation-id-and-store-against-a-workspace) | GET | `/api/v2/integration/github/installation` |
| [**Unlinks the GitHub Installation ID from a Workspace**](#unlinks-the-github-installation-id-from-a-workspace) | POST | `/api/v2/integration/github/unlink` |
| [**Install URL Redirect**](#install-url-redirect) | GET | `/api/v2/integration/slack/install` |
| [**Receive Slack Oauth2 request**](#receive-slack-oauth2-request) | GET | `/api/v2/integration/slack/auth` |
| [**Receive Slack Slash Commands**](#receive-slack-slash-commands) | POST | `/api/v2/integration/slack/commands` |
| [**Receive Slack Events**](#receive-slack-events) | POST | `/api/v2/integration/slack/events` |
| [**Receive Slack Interactivity**](#receive-slack-interactivity) | POST | `/api/v2/integration/slack/interactivity` |
| [**Shares an integration's credentials with the Workspace's tasks as managed Workspace parameters, or stops sharing them: GitHub's installation token, Slack's bot token, or the values entered for a form integration such as Google or Microsoft**](#shares-an-integrations-credentials-with-the-workspaces-tasks-as-managed-workspace-parameters-or-stops-sharing-them-githubs-installation-token-slacks-bot-token-or-the-values-entered-for-a-form-integration-such-as-google-or-microsoft) | POST | `/api/v2/integration/{integration}/share` |
| [**Disconnects the Slack installation from a Workspace**](#disconnects-the-slack-installation-from-a-workspace) | POST | `/api/v2/integration/slack/unlink` |



## Retrieve the integrations and their status within a Workspace

`GET /api/v2/integration`

Requires the `integration/read` permission, from a key, user, session, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **workspace** | **String** | true |  | Defaults to null. | workspace_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**List** of [**Integration**](./models/Integration)


## Receive the GitHub App installation setup callback

`GET /api/v2/integration/github/callback`

No permission check: GitHub App setup callback reached by a browser redirect from GitHub, so it carries no bearer; secured by the signed short-lived state, the workspace-membership check and the installer-ownership check against GitHub's token exchange. permitAll in SecurityConfiguration.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **installation\_id** | **Integer** | true |  | Defaults to null. | 56 |
| **code** | **String** | true |  | Defaults to null. | code_example |
| **state** | **String** | true |  | Defaults to null. | state_example |
| **setup\_action** | **String** | false |  | Defaults to null. | setup\_action_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

No authorization required

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

No response body


## Retrieve the installation ID and store against a workspace

`GET /api/v2/integration/github/installation`

Requires the `integration/read` permission, from a key, user, session, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **id** | **Integer** | false |  | Defaults to null. | 56 |
| **workspace** | **String** | false |  | Defaults to null. | workspace_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Object**


## Unlinks the GitHub Installation ID from a Workspace

`POST /api/v2/integration/github/unlink`

Requires the `integration/write` permission, from a key, user, session, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**GHLinkRequest**](./models/GHLinkRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

No response body


## Install URL Redirect

`GET /api/v2/integration/slack/install`

No permission check: Meant for a browser, which may hold a Flow session. Nothing to protect: it redirects to Slack's authorize URL for the configured app and takes no input, but it is kept behind sign-in because it carries no check of its own.

#### Request parameters
This endpoint does not need any parameter.


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

No response body


## Receive Slack Oauth2 request

`GET /api/v2/integration/slack/auth`

No permission check: Reached by Slack, which cannot hold a Flow token, so permitAll in SecurityConfiguration and skipped by AuthenticationFilter (SLACK_ROUTES); the handler checks the request itself - the Slack signature, or the OAuth code exchange against Slack.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **code** | **String** | true |  | Defaults to null. | code_example |
| **state** | **String** | false |  | Defaults to null. | state_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

No authorization required

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Object**


## Receive Slack Slash Commands

`POST /api/v2/integration/slack/commands`

No permission check: Reached by Slack, which cannot hold a Flow token, so permitAll in SecurityConfiguration and skipped by AuthenticationFilter (SLACK_ROUTES); the handler checks the request itself - the Slack signature, or the OAuth code exchange against Slack.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **x-slack-request-timestamp** | **String** | false |  | Defaults to null. | x-slack-request-timestamp_example |
| **x-slack-signature** | **String** | false |  | Defaults to null. | x-slack-signature_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

No authorization required

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Object**


## Receive Slack Events

`POST /api/v2/integration/slack/events`

No permission check: Reached by Slack, which cannot hold a Flow token, so permitAll in SecurityConfiguration and skipped by AuthenticationFilter (SLACK_ROUTES); the handler checks the request itself - the Slack signature, or the OAuth code exchange against Slack.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **x-slack-request-timestamp** | **String** | false |  | Defaults to null. | x-slack-request-timestamp_example |
| **x-slack-signature** | **String** | false |  | Defaults to null. | x-slack-signature_example |


#### Request body
| Schema | Required |
| ------ | -------- |
| **String** | true |


#### Authorization

No authorization required

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`

#### Response

**Object**


## Receive Slack Interactivity

`POST /api/v2/integration/slack/interactivity`

No permission check: Reached by Slack, which cannot hold a Flow token, so permitAll in SecurityConfiguration and skipped by AuthenticationFilter (SLACK_ROUTES); the handler checks the request itself - the Slack signature, or the OAuth code exchange against Slack.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **x-slack-request-timestamp** | **String** | false |  | Defaults to null. | x-slack-request-timestamp_example |
| **x-slack-signature** | **String** | false |  | Defaults to null. | x-slack-signature_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

No authorization required

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

**Object**


## Shares an integration's credentials with the Workspace's tasks as managed Workspace parameters, or stops sharing them: GitHub's installation token, Slack's bot token, or the values entered for a form integration such as Google or Microsoft

`POST /api/v2/integration/{integration}/share`

Requires the `integration/write` permission, from a key, user, session, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **integration** | **String** | true |  | Defaults to null. | integration_example |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**GHShareRequest**](./models/GHShareRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

No response body


## Disconnects the Slack installation from a Workspace

`POST /api/v2/integration/slack/unlink`

Requires the `integration/write` permission, from a key, user, session, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |


#### Request body
| Schema | Required |
| ------ | -------- |
| [**GHLinkRequest**](./models/GHLinkRequest) | true |


#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `application/json`
- **Accept**: `Not defined`

#### Response

No response body

