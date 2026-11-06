---
title: Integrations
order: 13
description: Set up the platform's GitHub App and Slack app, and what the Google and Microsoft integrations need.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->
<!-- UI labels are source-verified at the tag (seed/settings.json, seed/integration-templates.json, client-web), not seen in a running webapp. -->

# Integrations

GitHub and Slack connect through one app each, which a platform admin sets up once for the whole install. Google and Microsoft need nothing on the platform. This page is for operators and admins. Workspace owners connect their own workspaces: see [Integrations](../webapp/integrations) and [Connect GitHub](../guides/connect-github).

## Before you start

- **A platform admin** in Flow. An operator sees **Admin › Settings** read-only.
- **A public HTTPS address** that routes `/api/v2/` to core, which GitHub and Slack call. This page calls it the Flow API URL, such as `https://flow.example.com`. See [Route traffic](./configuring#route-traffic).
- **Outbound access** from core to `github.com` and `api.github.com`, or to `slack.com`.

## Where do the settings go?

Every value goes in **Admin › Settings › Integrations**. Select **Save**; a change applies without a restart.

![Admin › Settings › Integrations, with the Slack and GitHub fields](./assets/integrations-settings.png)

| Setting | Key | Secured | For |
| --- | --- | --- | --- |
| **GitHub App ID** | `github.appId` | No | Signing GitHub API calls as the App |
| **GitHub Private Key** | `github.jwt` | Yes | Signing GitHub API calls, and the install link's state |
| **GitHub App Name** | `github.appName` | No | The install link |
| **GitHub Client ID** | `github.clientId` | No | Checking who installed the App |
| **GitHub Client Secret** | `github.clientSecret` | Yes | Checking who installed the App |
| **GitHub Webhook Secret** | `github.webhookSecret` | Yes | Checking each GitHub delivery's signature. Required. |
| **Slack Client ID** | `slack.clientId` | No | Connecting a workspace. Required. |
| **Slack Client Secret** | `slack.clientSecret` | Yes | Connecting a workspace. Required. |
| **Slack Signing Secret** | `slack.signingSecret` | Yes | Checking each Slack request's signature. Required. |
| **Slack App ID** | `slack.appId` | No | Returning to Slack after an install started from Slack |
| **Slack Auth Token** | `slack.token` | Yes | Optional: a bot token for a Slack workspace Flow holds no installation for |

To set them from a script instead, send `PATCH /api/v2/settings` with a token that holds a global grant:

```bash
curl -X PATCH "https://flow.example.com/api/v2/settings" \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/merge-patch+json" \
  -d "{\"integration\": {\"github.webhookSecret\": \"$WEBHOOK_SECRET\"}}"
```

## Set up the GitHub App

The GitHub App lets workspaces start workflows from GitHub events and lets GitHub tasks act as the App. It works with github.com only: Flow's GitHub addresses are fixed.

<!-- UNVERIFIED: the GitHub-side settings (Callback URL with user authorisation during installation, Webhook URL with access_token) are derived from the routes at the tag; not exercised against GitHub. -->

### Create the token for deliveries

GitHub posts each event to `POST /api/v2/webhook`. That route checks a Flow token first, then GitHub's signature, so the App's webhook URL must carry a token in `access_token`: GitHub can't send a custom header. The token must hold `webhook/action`. Any token kind with it passes, and the installation named in the delivery, not the token, picks the workspace, so one token serves every workspace.

Declare a global machine token that holds only `webhook/action`, as in [Declare a token](./machine-tokens#declare-a-token):

```bash
RAW="bfg_$(openssl rand -hex 32)"
printf %s "$RAW" | sha256sum | cut -d' ' -f1

# On service-core
FLOW_SECURITY_TOKENS_GITHUB_HASH=<the 64-character hash>
FLOW_SECURITY_TOKENS_GITHUB_PERMISSIONS=webhook/action
FLOW_SECURITY_TOKENS_GITHUB_DESCRIPTION=GitHub App deliveries
```

Restart core, and keep `$RAW` for the webhook URL.

> [!WARNING]
> Proxies and access logs record URLs, and anyone with this URL can post to Flow's webhook, event and callback routes as this token. Keep it out of shared places, and rotate it as [Rotate a token without a gap](./machine-tokens#rotate-a-token-without-a-gap) describes.

### Create the App on GitHub

1. In GitHub, open the organisation's or your account's **Settings › Developer settings › GitHub Apps**, and select **New GitHub App**.
2. Name it, and give a homepage URL.
3. Under **Identifying and authorizing users**, set **Callback URL** to `<Flow API URL>/api/v2/integration/github/callback`, and turn on **Request user authorization (OAuth) during installation**. Flow needs the authorisation `code` GitHub sends there to check who installed the App.
4. Under **Webhook**, turn on **Active**, and set **Webhook URL** to `<Flow API URL>/api/v2/webhook?access_token=<raw token>`. The URL takes no `ref` or `workspace`.
5. Set **Webhook secret** to a long random value, such as the output of `openssl rand -hex 32`. Keep it for Flow.
6. Grant the repository permissions the GitHub tasks use: Issues: write, Pull requests: write, Contents: read or write, Commit statuses: write and Actions: write. Each GitHub task's description names its own.
7. Under **Subscribe to events**, choose the events your workflows' GitHub triggers name, such as Issues or Push.
8. Choose where it can be installed, and select **Create GitHub App**.

When the App's permissions change later, an organisation owner approves them again on GitHub.

### Give Flow the App's credentials

On the App's page in GitHub:

| From GitHub | Into Flow |
| --- | --- |
| **App ID** | **GitHub App ID** |
| The App's slug, from its public link `https://github.com/apps/<slug>` | **GitHub App Name** |
| **Client ID** | **GitHub Client ID** |
| A client secret you generate | **GitHub Client Secret** |
| A private key you generate: paste the whole `.pem` file, which starts `-----BEGIN RSA PRIVATE KEY-----` | **GitHub Private Key** |
| The webhook secret from step 5 | **GitHub Webhook Secret** |

Save. On the App's **Advanced** tab in GitHub, **Recent Deliveries** lists the `ping` GitHub sent when the App was created. Redeliver it: the setup works when it answers `200`. Then a workspace owner can [connect GitHub](../guides/connect-github).

### Fix a GitHub setup

| Symptom | Cause | Fix |
| --- | --- | --- |
| A delivery answers `401` with `AUTH_REQUIRED` | The webhook URL has no token, or a wrong, expired or revoked one | Fix `access_token` in the webhook URL |
| A delivery answers `403` | The token lacks `webhook/action` | Declare it with `webhook/action` and restart core |
| A delivery answers `401` with no body, and core logs `GitHub ping webhook rejected - missing or invalid signature.` | **GitHub Webhook Secret** is unset or differs from the App's | Set the same value in both places |
| **Connect** opens a GitHub "page not found" | **GitHub App Name** is unset, or isn't the App's slug | Set it from the App's public link |
| After installing, the browser shows HTTP `400` from Flow | GitHub sent no authorisation `code`, because the callback URL is set as the App's **Setup URL** without user authorisation during installation | Turn on **Request user authorization (OAuth) during installation**, and set the **Callback URL** as above |
| After installing, Flow answers `INTEGRATION_INSTALL_MISMATCH`, and core logs `GitHub OAuth code exchange did not return an access_token` | **GitHub Client ID** or **GitHub Client Secret** is wrong | Copy them again from the App |
| After installing, Flow answers `INTEGRATION_INVALID_STATE` | More than 10 minutes passed, or **GitHub Private Key** changed during the install | Select **Connect** again |
| Sharing the token fails with `INTEGRATION_TOKEN_FAILED` | **GitHub App ID** or **GitHub Private Key** is wrong, or the App was uninstalled | Fix the setting, or install the App again |
| After installing, the browser lands on a page that doesn't exist | The webapp isn't on the same host as `/api/v2` | Set `FLOW_APPS_FLOW_URL` on core to the webapp's full address, such as `https://flow.example.com/apps/flow` |

## Set up the Slack app

The Slack app lets a workspace share its bot token with the Slack tasks. Until **Slack Client ID** and **Slack Client Secret** are set, a workspace's Slack card shows **Connect** disabled, with "Not set up on this platform".

> [!WARNING]
> Slack's `/workflow` slash command can't run a workflow yet: the permission check behind it always refuses. Only `/workflow help` answers. See [Known issues](../introduction/known-issues#slacks-workflow-command-never-runs-a-workflow) and [flow#751](https://github.com/boomerang-io/flow/issues/751).

### Create the app from a manifest

1. Replace `flow.example.com` in this manifest with your Flow API URL's host:

   ```yaml
   display_information:
     name: Boomerang Flow
     description: Workflows and tasks from Boomerang Flow
   features:
     bot_user:
       display_name: Boomerang Flow
       always_online: true
     slash_commands:
       - command: /workflow
         url: https://flow.example.com/api/v2/integration/slack/commands
         description: Run a Boomerang Flow workflow
         usage_hint: "[workflow ID]"
         should_escape: false
   oauth_config:
     redirect_urls:
       - https://flow.example.com/api/v2/integration/slack/auth
     scopes:
       bot:
         - channels:manage
         - channels:read
         - chat:write
         - commands
         - files:write
         - groups:read
         - groups:write
         - users:read
         - users:read.email
   settings:
     event_subscriptions:
       request_url: https://flow.example.com/api/v2/integration/slack/events
       bot_events:
         - app_home_opened
         - app_uninstalled
     interactivity:
       is_enabled: true
       request_url: https://flow.example.com/api/v2/integration/slack/interactivity
     org_deploy_enabled: false
     socket_mode_enabled: false
     token_rotation_enabled: false
   ```

   No URL carries a Flow token: Flow checks each request's Slack signature instead, and the OAuth redirect exchanges its code with Slack.
2. At `https://api.slack.com/apps`, create a new app from a manifest, choose the Slack workspace to create it in, and paste the manifest.
3. Review it and create the app.

Keep token rotation off: Flow doesn't refresh Slack tokens, so it refuses to share a rotating one. An app that isn't distributed installs only into the Slack workspace it was created in. To connect other Slack workspaces, turn on public distribution in the app's settings.

### Give Flow the app's credentials

From the app's **Basic Information** page in Slack, copy **App ID**, **Client ID**, **Client Secret** and **Signing Secret** into the Flow settings of the same names, then select **Save**.

Slack checks the events URL with a signed challenge, which Flow answers only once **Slack Signing Secret** is set. If Slack reports the URL as unverified, save the secret in Flow, then retry the check in the app's **Event Subscriptions**.

The setup works when a workspace's Slack card offers **Connect**, and connecting returns to **Integrations** with the card reading **Connected**.

### Fix a Slack setup

| Symptom | Cause | Fix |
| --- | --- | --- |
| The Slack card's **Connect** is disabled: "Not set up on this platform". `GET /api/v2/integration/slack/install` answers `409 INTEGRATION_NOT_CONFIGURED`: "Slack is not set up: an administrator enters its client ID and client secret in the Integrations settings." | **Slack Client ID** or **Slack Client Secret** is unset | Set both |
| Every Slack request fails, and core logs `Refusing a Slack request: no Slack signing secret is configured.` | **Slack Signing Secret** is unset | Set it |
| Slack requests fail with no such log | The signing secret is wrong, or core's clock is more than 5 minutes out | Copy the secret again, and check core's clock |
| Connecting fails with `INTEGRATION_TOKEN_FAILED` | Slack refused the code exchange: the client ID or secret is wrong | Copy them again |
| Sharing fails with `INTEGRATION_TOKEN_ROTATES` | Token rotation is on in the Slack app | Turn it off and install the app again |

Core's Slack calls don't read `proxy.host` and `proxy.port`, so core needs a direct route to `slack.com`.

## Prepare for Google and Microsoft

Neither needs a platform setting. A workspace owner connects each one by entering credentials on the workspace's Integrations page, and Flow stores them as read-only workspace parameters. What the owner needs from your cloud administrators:

| Integration | Credentials | Set up beforehand |
| --- | --- | --- |
| Google | A Google Cloud service account's JSON key | The Google Sheets and Google Drive APIs turned on in its project. Each spreadsheet or Drive folder the tasks use shared with the service account's email. Some organisations block key creation until an administrator lifts the policy. |
| Microsoft | A Microsoft Entra app registration's directory (tenant) ID, application (client) ID and a client secret | The Microsoft Graph application permissions below, with an administrator's consent |

The Microsoft tasks request their own Graph tokens with the app's credentials. Each needs:

| Task | Microsoft Graph application permission |
| --- | --- |
| Add Teams Member | `TeamMember.ReadWrite.All` (`TeamMember.ReadWriteNonOwnerRole.All` for members only) |
| Create Teams Channel | `Channel.Create` |
| Upload SharePoint File | `Sites.ReadWrite.All` or `Files.ReadWrite.All`, or `Sites.Selected` with a grant on the site |
| Download SharePoint File, List SharePoint Files | `Sites.Read.All` or `Files.Read.All`, or `Sites.Selected` with a grant on the site |

Send Teams Message posts through a Teams Workflows webhook and doesn't use the integration.

## Next steps

- [Integrations](../webapp/integrations): what each integration adds to a workspace, and sharing credentials.
- [Connect GitHub](../guides/connect-github): the workspace side of the GitHub App.
- [Machine tokens](./machine-tokens): declaring and rotating the delivery token.
- [Triggers](../fundamentals/triggers): the GitHub trigger's events and filters.
- [Security](../architecture/security#how-are-integrations-verified): how Flow verifies GitHub and Slack.
