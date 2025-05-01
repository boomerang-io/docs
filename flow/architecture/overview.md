---
title: Overview
order: 1
---

# Architecture Overview

![Architecture](./assets/img/architecture-components.png)

The application has the following main components.

- **Frontend application**: This is the end user visual designer, enabling no-code Workflow building, as well as the ability to see and manage all aspects of your Workflows, including activity and insights.
- **Backend for frontend (BFF) microservice**: This component translates the requests from the Front End application.
- **Engine microservice**: This component manages the DAG lifecycle and trigger interactions.
- **Handler microservice**: The Handler integrates with Kubernetes<sup>®</sup> and Tekton and is responsible for managing the execution of the Tasks, including the orchestration of the TaskRuns and the management of the TaskRun lifecycle.
- **Tasks**: The Task workers are containers used to execute the tasks mapped in the Workflow using Tekton<sup>®</sup> TaskRuns

> Navigate to the [Application Architecture](../architecture/application) to learn more.

## Implementation Detail

You can find further implementation details and feature specifications in our [architecture repository](https://github.com/boomerang-io/architecture)

## Execution

The default handler executing the tasks within the DAG as part of the Workflow, relies on Tekton TaskRuns and Kubernetes to perform the execution of the Tasks that are a part of the the Workflow or Directed Acyclic Graph (DAG).

The default Handler could be replaced with a custom Handler, executing the tasks against a different cloud provider, for example Azure Container Apps.

## Tasks

There are a number of different types of Tasks including pre-built Tasks designed for a no-code experience. These are single-focus Tasks that offer tight integration into the platform, with certified Tasks providing a guaranteed implementation and tested experience.

See [Getting to Know Tasks](../fundamentals/tasks) to learn more.

### Bring Your Own Container Task

The Bring Your Own Container Task is a special type of System Task where you can bring your own container and run that as a Task. Typically, the Custom Task has no knowledge or understanding of integrating with Boomerang Flow and we do not force adherence to a specific implementation. The Custom Task is denoted by a flag in the upper left corner of the Task in the Workflow Editor and Workflow Run pages.
