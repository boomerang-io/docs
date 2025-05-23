---
title: Activity
order: 3
---

# Activity

Activity allows you to view each individual run of a Workflow. Each time you execute a Workflow, an activity is associated with this run. The system keeps information on Workflow status, Workflow duration, Task status, Task duration, output properties, and logs.

There are three ways to access the Activity page:

- Select **View Activity** from the overflow menu on any Workflow to access the Activity page, filtered to that specific Workflow.
- Select **Run and View** from the Run Workflow modal to access the Activity of a specific run.
- Navigate to 'Activity' in the left-hand navigation to access a full list of all Activities.

## Overview

The Activity page provides you with a snapshot breakdown with the ability to filter by:

- Workflow
- status
- trigger
- date range

![View Activity](./assets/img/activity-view.png)

Additional information for start time and duration will be displayed, along with visual markers to match the status. Any **In Progress** Workflow will pulsate through a range of the status colors.

Click an individual activity row to view the activity run detail.

## Run Detail

The activity run detail is a read-only view of your Workflow design with a visual indication of both the status of each Task, as well as the link state.

In addition to accessing activity run detail from the Activity page, activity run detail is also accessed when the Workflow is run. To do so:

1. Manually execute a Workflow. Click `Run It` on the Workflow tile.

2. An Execute Workflow modal displays with two options. Click `Run and View`, which takes you through to the detailed Activity Run screen, where you can view the Workflow progress.

![Activity Overview](./assets/img/activity-run.png)

### Metadata

Workflow metadata of; Team, Workflow Version, Initiated By, Trigger, and Start time, is displayed in the header.

### Run Status Task Log Panel

On the left, you are provided with a panel with the Workflow status and duration, as well as a breakdown of each Task that was executed.

In this Task breakdown, you can access actions depending on the Task type.

- For any Task or Custom Task you can view logs and task detail.
- For System Tasks, you will be provided with a range of specific actions such as **Action Approval**.

#### Vew Detail

![Activity Task Detail](./assets/img/activity-taskdetail.png)
