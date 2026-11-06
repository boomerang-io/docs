---
title: Integrations
order: 5
description: Connect a workspace to GitHub, Slack, Google or Microsoft, and share their credentials with the catalogue tasks as workspace parameters.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. UI labels checked against the live webapp (build 490ba3894, 2026-11-06): 16 of 18 bolded terms seen live; the rest are states the walk didn't reach or aren't labels, and were verified in client-web source. -->

# Integrations

An integration connects one workspace to an outside service, so its events can start workflows and its tasks can act with its credentials. This page is for workspace owners and editors. **Integrations** is in every workspace's side nav, tagged beta.

<!-- SCREENSHOT: The Integrations page with the GitHub, Slack, Google and Microsoft cards, GitHub connected. (not capturable yet: GitHub connected: needs a GitHub App (Admin › Settings › Integrations is empty)) -->

## Which integrations are there?

Flow 5.0 offers four. Two are apps that Flow installs on the other service; two take credentials you enter.

| Integration | How you connect | What it adds | Workspace parameters it can share |
| --- | --- | --- | --- |
| **GitHub** | Install the platform's GitHub App on an organisation or account | The GitHub trigger under **Configure**, and token sharing for the GitHub tasks | `github-token` (refreshed every 45 minutes), `github-url` |
| **Slack** | Install the platform's Slack app in a Slack workspace | Token sharing for the Slack tasks | `slack-token` |
| **Google** | Paste a Google Cloud service account's JSON key | Credentials for the Google Sheets and Drive tasks | `google-service-account-key` |
| **Microsoft** | Enter a Microsoft Entra app's tenant ID, client ID and client secret | Credentials for the Teams and SharePoint tasks | `microsoft-tenant-id`, `microsoft-client-id`, `microsoft-client-secret` |

GitHub and Slack need the platform's app set up first, in **Admin › Settings › Integrations**. Until an admin enters the Slack app's client ID and secret, the Slack card's **Connect** is disabled with "Not set up on this platform".

A workspace connects each integration once. Several Flow workspaces can connect the same Slack workspace.

## Connect an integration

1. In the side nav, select **Integrations**.
2. On the integration's card, select **Connect**.
3. For GitHub or Slack, select **Connect** in the dialog. The other service opens in a new tab: choose where to install the app and accept its permissions. It returns you to **Integrations**.
4. For Google or Microsoft, fill in the fields in the dialog and select **Connect**.

The card reads **Connected**, and its button changes to **Manage**. For the step-by-step GitHub set-up, see [Connect GitHub](../guides/connect-github).

## Share credentials with tasks

The catalogue's GitHub, Slack, Google and Microsoft tasks default their credential fields to these workspace parameters, such as `$(workspace.params.github-token)`. See [Credentials in catalogue tasks](../fundamentals/tasks#credentials-in-catalogue-tasks).

- **GitHub and Slack:** select **Manage** and switch on **Share the installation token with tasks**. Sharing is a separate choice because it lets every workflow author in the workspace act with the app's permissions.
- **Google and Microsoft:** connecting writes the parameters. **Manage** edits them; a stored secret is kept until you type a new one, then **Save**.

Shared parameters appear on the workspace's **Parameters** page as **Managed by** the integration, and are read-only there. Sharing is refused when:

- **Admin › Settings › Features › Workspace Parameters** is off (`INTEGRATION_PARAMS_DISABLED`);
- the workspace already has a parameter of the same name that someone created (`INTEGRATION_PARAM_EXISTS`). Rename or delete it first.

A GitHub task left on its default in a workspace that doesn't share the token fails before it runs, with `no such workspace param 'github-token'`. Share the token, or type a token into the task.

## Disconnect

Select **Manage**, then **Disconnect**. It acts at once, with no confirmation. Flow removes the link and every parameter the integration shares in this workspace. Anything installed on the other service stays until you remove it there.

For GitHub and Slack, switching **Share the installation token with tasks** off removes the shared parameters but keeps the connection. Uninstalling the GitHub App in GitHub removes its link and shared parameters too. Removing the Flow app inside Slack disconnects every Flow workspace that uses it.

## Who can connect and share?

Sharing, editing and disconnecting need a role that can write in the workspace: owner or editor. The webapp shows the controls to every member, but Flow refuses a reader. For GitHub, Flow also checks that the person installing the app is a member of the workspace.

## Limitations

- Slack's slash command doesn't run a workflow yet, although the Slack card and its instructions describe it. See [Known issues](../introduction/known-issues).
- A workspace has one connection per integration, shared by all its workflows. Per-user credentials aren't built.

## Next steps

- [Connect GitHub](../guides/connect-github).
- [Parameters](../fundamentals/parameters#parameters-an-integration-manages): managed parameters.
- [Triggers](../fundamentals/triggers): start workflows from GitHub events.
- [Admin](./administer#settings): the platform's integration settings.
