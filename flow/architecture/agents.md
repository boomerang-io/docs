---
title: Agents
order: 4
---

# Custom Agents

Agents are a powerful way to extend the capabilities of Flow. They allow you to create custom logic and functionality that can be triggered by workflows and tasks.

The connection of an Agent to Flow is established through a long poll queue endpoint.

> [View the out of the box Agent on GitHub](https://github.com/boomerang-io/flow.services/tree/main/service-agent)

## Agent Registration

To register an Agent, you need to create a new Agent in Flow. This can be done through the Flow UI or by using the API.

When registering an Agent, you will need to provide the following information:

- **Name**: The name of the Agent.
- **Version**: The version of the Agent.
- **Host**: The host where the Agent is running.
- **Task Types**: The types of tasks that the Agent can handle as a comma separated list.

The following optional information can also be provided to help further filter the Workflows and Tasks that the Agent can handle. This allows you to create more specialized Agents that only handle specific types of Workflows and Tasks.

- **Workflow Labels**: The labels that the Agent can handle as a comma separated list.
- **Task Labels**: The labels that the Agent can handle as a comma separated list.

## Queues

An agent then retrieves the Workflows and Tasks assigned to its queue and needs to execute them and use the API to move the Workflow and Tasks through the lifecycle.

You can read in more detail around all of the Status and Phase combinations in the [Status and Phase documentation](../architecture/statusphase).

### Workflows

Workflows are retrieved that are either: READY status and PENDING phase, or COMPLETED phase.

The idea here is the agent can set up pre-requisites for the WorkflowRun or perform post-processing after the WorkflowRun has completed.

### Tasks

Tasks are retrieved that are either: READY status and PENDING phase, or COMPLETED phase and CANCELLED or TIMEDOUT status.

The idea here is that when the Task is received in ready, the agent starts executing the Task and then updates the Task status to RUNNING. Once the Task is completed, the agent updates the Task status to SUCCEEDED or FAILED.
