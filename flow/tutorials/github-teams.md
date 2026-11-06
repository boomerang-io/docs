---
title: GitHub teams and members
order: 4
description: Create a GitHub team, invite a person to the organisation and the team, then delete the team again.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. UI labels checked against the live webapp (build 490ba3894, 2026-11-06): 35 of 52 bolded terms seen live; the rest are states the walk didn't reach or aren't labels, and were verified in client-web source. -->

# GitHub teams and members

This tutorial creates a team in a GitHub organisation, invites a person to the organisation and adds them to the team, waits a minute so you can see the result in GitHub, then deletes the team. It's for workflow authors, and it shows how one task reads another task's result.

## Before you start

You need:

- the owner or editor role in a Flow workspace;
- owner rights in a GitHub organisation you can test in;
- a GitHub personal access token for that owner, for example a classic token with the `admin:org` scope. Creating teams and inviting members needs organisation administration rights;
- the email address of the person to invite. It must be the public email on their GitHub profile: the invite tasks search GitHub for the address and stop unless exactly one account matches.

The GitHub tasks default to the token the workspace's GitHub integration shares (see [Connect GitHub](../guides/connect-github)). That token acts with the GitHub App's permissions, which may not include managing an organisation's members, so this tutorial uses a personal access token.

<!-- UNVERIFIED: no product source states whether the Flow GitHub App is granted organisation member administration. If it is, the four GitHub tasks can keep their URL and token defaults. -->

> **Note:** The person receives a real invitation from GitHub. Invite an account you own, or someone who expects it.

## What you'll build

| Task name | Catalogue task | What it does |
| --- | --- | --- |
| `create-team` | Create Team in Organization | Creates the team. Its result `team` holds GitHub's response as JSON. |
| `get-team-slug` | JSONPath To Parameter | Reads the team's slug from that JSON. Its result is always `evaluation`. |
| `invite-to-org` | Invite User to Organization | Invites the person to the organisation. |
| `add-to-team` | Invite Member to Team | Adds the person to the team. |
| `pause` | Sleep | Waits 60 seconds so you can look in GitHub. |
| `delete-team` | Delete Team from Organization | Deletes the team. |

## Create the workflow

1. In the side nav, select **Workflows**.
2. Select **Create a new workflow**.
3. Leave **Start from scratch** selected, and enter a **Display Name**, such as `GitHub team demo`.
4. Select **Create**. The editor opens on the **Canvas** tab.

## Add the parameters

1. Select the **Parameters** tab.
2. Select **Add parameter**.
3. Fill in **Name**, **Type**, **Default value (optional)** and **Required** from the first row of the table below, then select **Add**.
4. Repeat for the other rows.

| Name | Type | Default value | Required |
| --- | --- | --- | --- |
| `github-org` | Text | your organisation's login | On |
| `team-name` | Text | `Flow tutorial team` | On |
| `invitee-email` | Email | none | On |
| `github-pat` | Password | your personal access token | Off |
| `github-api-url` | URL | `https://api.github.com` | Off |

For GitHub Enterprise Server, set the `github-api-url` default to `https://<host>/api/v3`.

## Add the tasks

1. Select the **Canvas** tab.
2. In **Add a task**, open **GitHub** and drag four tasks onto the canvas: **Create Team in Organization**, **Invite User to Organization**, **Invite Member to Team** and **Delete Team from Organization**.
3. Open **Utilities** and drag **JSONPath To Parameter** onto the canvas.
4. Open **Workflow** and drag **Sleep** onto the canvas.

## Configure the tasks

Select each node's edit (pencil) icon, fill in its fields, then select **Apply**.

Set these three fields the same way on all four GitHub tasks:

| Field | Value |
| --- | --- |
| **URL** | `$(params.github-api-url)` |
| **Github Access Token** | `$(params.github-pat)` |
| **Organization Name** | `$(params.github-org)` |

Then set each task's own fields:

| Node | Field | Value |
| --- | --- | --- |
| Create Team in Organization | **Task name** | `create-team` |
| | **Team Name** | `$(params.team-name)` |
| | **Level of privacy** | `closed` |
| JSONPath To Parameter | **Task name** | `get-team-slug` |
| | **Json** | `$(tasks.create-team.results.team)` |
| | **Query Expression** | `$.slug` |
| Invite User to Organization | **Task name** | `invite-to-org` |
| | **User Email Address** | `$(params.invitee-email)` |
| | **User Role** | `member` |
| Invite Member to Team | **Task name** | `add-to-team` |
| | **Team Name** | `$(tasks.get-team-slug.results.evaluation)` |
| | **User Email Address** | `$(params.invitee-email)` |
| | **User Role** | `member` |
| Sleep | **Task name** | `pause` |
| | **Duration** | `60000` (milliseconds) |
| Delete Team from Organization | **Task name** | `delete-team` |
| | **Team Name** | `$(tasks.get-team-slug.results.evaluation)` |

A result reference is `$(tasks.<task name>.results.<result>)`, with the task name exactly as you entered it in **Task name**. The **Results** tab of a task's form lists the results it declares. The v3 form, `$(Task.<task name>.results.<result>)`, doesn't resolve.

GitHub derives a team's slug from its name: `Flow tutorial team` becomes `flow-tutorial-team`. The later tasks find the team by its name or its slug.

<!-- UNVERIFIED: the team result is GitHub's full create-team response, including the organisation object, and task results share a 4,096-byte Kubernetes limit. Confirm on a live run that create-team's result fits. If it doesn't, set Response File Path on create-team to a file in the run workspace and read it with File JSONPath To Parameter. -->

## Connect the tasks and save

1. Link the nodes in this order, dragging from each node's right port to the next node's left port: **Start**, `create-team`, `get-team-slug`, `invite-to-org`, `add-to-team`, `pause`, `delete-team`, **End**.
2. A new link runs **always**. On each link between two tasks, select the condition icon until it shows success. The icon cycles through always, success and failure. The run then stops at the first task that fails.
3. Select **Create new version**, enter a **Version comment** such as `First version`, then select **Create**.

![The finished canvas: the six tasks in a chain from Start to End, with the success condition on each link between tasks](./assets/github-teams-canvas.png)

## Run the workflow

1. Select **Workflows**, then **Run it** on the workflow's card.
2. In **Workflow Parameters**, check **github-org** and **team-name**, and enter **invitee-email**. Leave **github-pat** blank to use its stored default.
3. Select **Run and View**.

While `pause` waits, open your organisation's teams page in GitHub, `https://github.com/orgs/<org>/teams`. The team is listed. The person's team membership stays pending until they accept the organisation invitation.

On the run page, select **View Details** on `get-team-slug`. Under **Results**, `evaluation` holds the slug, `flow-tutorial-team`.

When the run's **Status** reads **Succeeded**, refresh the GitHub teams page: the team is gone. The organisation invitation stays open. Cancel it in GitHub if you don't want the person to join.

<!-- SCREENSHOT: The run page with Status Succeeded and all six tasks Succeeded in the task log. (not capturable yet: A succeeded run needs a GitHub organisation and a personal access token) -->

If a task fails, select **View Log** on it. `Number of users found based on email is not 1.` means the email isn't the public email of exactly one GitHub account. If the run stops after `create-team` succeeded, delete the team in GitHub by hand before you run again.

## Next steps

- [Parameters](../fundamentals/parameters): every reference form, including JSON paths into a result.
- [Use an approval's results](./manual-approval-output): read the results a person's decision leaves behind.
- [GitHub issues bot](./github-issues-bot): use the shared GitHub token on a schedule.
