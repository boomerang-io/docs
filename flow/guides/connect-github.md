---
title: Connect GitHub
order: 8
description: Connect a workspace to GitHub, share the installation token with GitHub tasks, and start workflows from GitHub events.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. UI labels checked against the live webapp (build 490ba3894, 2026-11-06): 33 of 52 bolded terms seen live; the rest are states the walk didn't reach or aren't labels, and were verified in client-web source. -->

# Connect GitHub

Connecting a workspace to GitHub does two things. GitHub events, such as an issue being opened, can start its workflows, and its GitHub tasks can act as the platform's GitHub App without a personal token. This guide is for workspace owners and workflow authors.

## Before you start

- **The platform's GitHub App.** An administrator creates it and enters its settings in Flow: see [Integrations](../hosting/integrations).
- **The owner or editor role** in the workspace.
- **A GitHub account that can install the App** on the organisation or account you want, usually an organisation owner.
- **Workspace parameters turned on,** to share the token: **Admin › Settings › Features › Workspace Parameters**. It's on by default.

## Connect the workspace

1. In the side nav, select **Integrations**.

   The page lists one card per integration. The **GitHub** card reads **Not connected**.

2. On the **GitHub** card, select **Connect**.

   The **GitHub** modal shows what connecting asks of GitHub, and under **Parameters it can share with tasks** lists `$(workspace.params.github-token)` and `$(workspace.params.github-url)`.

3. Select **Connect**. GitHub opens in a new browser tab.
4. On GitHub, choose the organisation or account to install the App into, choose its repositories, and accept the App's permissions.

   The App asks for Issues: write, Pull requests: write, Contents: read or write, Commit statuses: write and Actions: write.

5. When the installation finishes, GitHub returns that tab to the workspace's **Integrations** page.

The **GitHub** card reads **Connected**.

<!-- SCREENSHOT: The Integrations page with the GitHub card showing Connected and its Manage button. (not capturable yet: GitHub card Connected: needs a GitHub App installed on an organisation) -->

A workspace connects one GitHub installation. To connect a different one, disconnect first: see [Disconnect GitHub](#disconnect-github).

## Share the installation token with tasks

Sharing writes the App's credentials into the workspace as two read-only parameters, which the GitHub tasks use by default.

> [!WARNING]
> A shared token lets every workflow author in the workspace act with the App's permissions on everything the installation can reach. Share it only in a workspace whose authors you'd trust with those permissions.

1. On the **GitHub** card, select **Manage**.
2. Turn on **Share the installation token with tasks**.

The message **Token shared** appears, and the modal lists **Parameters this integration manages**. On the workspace's **Parameters** page, `github-token` and `github-url` appear with the tag **Managed by GitHub**.

| Parameter | Holds |
| --- | --- |
| `github-token` | The App's installation token, a secret. A token lives one hour, and Flow replaces it every 45 minutes and within a minute of starting. |
| `github-url` | The GitHub API URL the token is for, `https://api.github.com` |

You can't edit or delete these parameters: Flow refuses with `PARAMS_MANAGED_BY_INTEGRATION`. To remove them, turn sharing off; the message **Token no longer shared** appears.

Sharing fails, with the reason in a message, when:

| Message | Fix |
| --- | --- |
| `The workspace already has a parameter named "github-token". Rename or delete it before sharing the GitHub credentials with tasks.` | Delete or rename your own `github-token` or `github-url` parameter, then share again |
| `Workspace parameters are turned off, so the GitHub credentials cannot be shared with tasks. Turn on workspace parameters first.` | Ask an administrator to turn on **Workspace Parameters** |
| `Flow could not get an installation token from GitHub. Check the integration settings and that the installation still exists.` | Check the App is still installed on GitHub; ask an administrator to check its settings |

## Create an issue from a workflow

Every task in the palette's **GitHub** category defaults **URL** to `$(workspace.params.github-url)` and **Github Access Token** to `$(workspace.params.github-token)`. This example creates an issue with the shared token.

1. In the editor's **Canvas** tab, drag **Create GitHub Issue** from the **GitHub** category onto the canvas, and select its edit icon.
2. Leave **URL** and **Github Access Token** on their defaults. The token field shows the reference as written.
3. In **Owner**, enter the organisation or user that owns the repository, such as `my-org`.
4. In **Repository**, enter the repository's name without the owner, such as `website`.
5. In **Title**, enter `Created by Flow`, then select **Apply**.
6. Link **Start** to the task, and the task to **End**.
7. [Save a version](./workflow-editor#save-a-version).
8. On the **Workflows** page, select **Run it**, then **Run and View**.

The run's status is **Succeeded**. In the task's **View Details**, the `issueUrl` result links to the new issue.

If the save warns **Workspace parameter missing** and names the token field, the workspace isn't sharing the token, and the run fails at that task with `no such workspace param 'github-token'`. Share the token, or enter a personal access token in **Github Access Token**.

A workflow keeps the task versions it was saved with, and older versions of the GitHub tasks don't have these defaults. When a newer version exists, the node shows a yellow warning icon: select it to open **New version available**, then select **Update task**.

## Start a workflow from GitHub events

The GitHub trigger starts a workflow when the installation sends an event that passes its filters.

1. In the editor, open the **Configure** tab and select **Triggers**.
2. Under **GitHub**, turn on **Enable**.

   Until the workspace is connected, the toggle is disabled and **Integration Required** shows.

3. Under **Repository Filter**, open **Choose Repositories** and select the repositories, shown as `<organisation> / <repository>`.
4. Under **Events Filter**, select the events that start the workflow, such as `issues`. The list holds the events the App subscribes to.
5. [Save a version](./workflow-editor#save-a-version).

Open an issue in one of the selected repositories. A new run of the workflow appears in **Activity**, and its run page shows the **Trigger** `github`.

<!-- SCREENSHOT: Configure › Triggers with the GitHub trigger enabled, one repository chosen and the issues event selected. (not capturable yet: The GitHub trigger is disabled (Integration Required) until GitHub is connected) -->

Every filter you set must match. A filter you never set lets everything through: with no repository chosen, events from every repository the installation can see start the workflow. A filter you set and then clear matches nothing.

The run gets two parameters:

| Parameter | Holds | Example reference |
| --- | --- | --- |
| `data` | The event's payload from GitHub | `$(params.data.issue.number)`, `$(params.data.repository.name)` |
| `event` | The event's type and delivery ID | `$(params.event.type)` |

Flow inserts these values as written and never expands a reference inside them, so a payload can't pull a stored secret into a task.

An event can carry several actions: `issues` fires when an issue is opened, edited, closed or labelled. To act on one, add a **Switch** whose **Value** is `$(params.data.action)` and give the link to the next task the **Switch Parameter Value** `opened`. See [Branch with a switch](./workflow-editor#branch-with-a-switch).

> [!WARNING]
> Don't let a workflow's own GitHub task trigger it again. A workflow that runs on `issue_comment` and posts a comment starts a new run with every comment it posts.

## Disconnect GitHub

1. On the **GitHub** card, select **Manage**.
2. Select **Disconnect**.

The message **Disconnected** appears, and the card reads **Not connected**. Flow removes the shared parameters, and tasks that use them fail until you connect again. The App stays installed on GitHub until you uninstall it there. Uninstalling it on GitHub also disconnects the workspace.

## Fix a failed connection

| Message | Cause | Fix |
| --- | --- | --- |
| `The integration authorization request is invalid or has expired. Please retry connecting the integration.` | More than 10 minutes passed between **Connect** and the end of the installation | Select **Connect** again |
| `You do not have access to link or unlink this integration for the workspace.` | You aren't a member of the workspace | Ask an owner to add you, or to connect it |
| `The GitHub installation could not be verified against your GitHub account.` | Your GitHub account can't see the installation | Install with an account that can manage it |

When workflows never start from events, ask an administrator to check **Admin › Settings › Integrations › GitHub Webhook Secret**. Without it, Flow refuses every delivery from GitHub.

## Not seeing what you expected?

- [Why doesn't a GitHub event start a run?](../introduction/troubleshooting#a-webhook-or-event-didnt-start-a-run)
- [Why did a GitHub task fail with `no such workspace param 'github-token'`?](../introduction/troubleshooting#a-task-failed-with-paramunresolved)

## Next steps

- [Integrations](../webapp/integrations): what each integration adds.
- [Triggers](../fundamentals/triggers): every way a run can start.
- [Use secrets](./use-secrets): how the shared token stays hidden.
- [Integrations for administrators](../hosting/integrations): set up the platform's GitHub App.
