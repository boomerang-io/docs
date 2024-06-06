---
title: Managing Workflows
order: 1
---

# Manage an existing Workflow

The unique features offered by Flow help you in creating a Workflow. Executing a Workflow is also determined by these features.

From Launchpad, click the Boomerang Flow tile.

The Workflows page displays all currently defined Workflows for any team you are a member of. The Workflows page is the central area to begin actions on all your Workflows.

![Workflows Page](./assets/workflow-tile-dropdown.png)

The following functionality is available on the Workflows page:

| Control                   | Functionality                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Filter by team**        | The **Filter by team** dropdown controls the Workflows presented, as restricted by the team selected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Search                    | The Search field refreshes the display with Workflows that contain any portion of the search text. The search results produced are restricted to Workflows in your team.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Create a new Workflow** | Displays the **Create a new Workflow** modal. A new Workflow can be created from scratch or an existing Workflow can be imported and used as a basis for the new Workflow. See [Create Workflow](../guides/create-workflow).                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Workflow quota            | Displays the number of Workflows created out of the allocated quota set by the Administrator. Click **View more quotas** to display the **Team quotas** modal. This modal displays data for: **Number of Workflows** that can be created by the team, **Total Workflow executors** per month for all team Workflows, **Storage size capacity** as persistent storage per Workflow, and number of **Current Workflows** that can be run at the same time.                                                                                                                                                                                                                       |
| Overflow menu             | The Workflow tile overflow menu provides the following actionable items: <br>**Edit Workflow** - displays the Editor page for the Workflow. See [Workflow Editor](../guides/workflow-editor).<br>**View Activity** - displays the Activity page for the Workflow. See [Activity](../fundamentals/activity). <br>**Export .json** - provides a file that can be imported into another Flow instance.<br>**Update .json** - provides a modal where you can drag and drop or choose a file to update the Workflow with. It will validate that the JSON file is valid for this particular Workflow.<br> **Delete** - once **Delete** is selected, the Workflow is removed forever. |
| **Run it**                | Click **Run it** to kick off the corresponding Workflow. See [Execute Workflow](../guides/execute-workflow).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |