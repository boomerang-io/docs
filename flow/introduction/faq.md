---
title: Frequently Asked Questions
order: 5
---

# Frequently asked questions

## What are the Use Cases

It is all about saving people time through automating repetitive or low value Tasks and increasing your productivity.

- Employee Onboarding - Send, track, and automatically action access requests for new employees
- Git Bot - Manage issue and PR responses and categorizations
- Report Generation - Integrate and collate data from multiple sources into a cohesive scorecard
- Incident Management - Help resolve issues with automatic routing and acknowledgement
- Operations - Implement runbook automation and issue remediation
- Syncing Systems - Send data between systems as events happen to ensure tools and access stay in sync

## What are Tasks and Workflows?

- Tasks are a discrete piece of work .e.g. making a HTTP request. They are the base unit of execution in Flow.
- Workflows are a series of Tasks connected together.
- Workflows form and are executed as a directed acyclic graph (DAG).

### Tasks

Tasks can be split into three distinct types. See [Getting To Know Tasks](../fundamentals/tasks) for more information.

- System Tasks: are logic based Tasks that influence the DAG.
- Template Tasks: are Tasks that perform a function and can be verified out-of-the box, are community-provided, and managed through Task Manager (in the Admin interface).
- Custom Task: a custom Task allows a bring-your-own container to run in place of a Task and executes any custom logic.

## How long does a Workflow take to execute?

A Workflow can take any amount of time. A Workflow generally starts executing a Task within three seconds. A simple Workflow with a single Task usually takes less then 15 seconds end-to-end.

## Does enabling the Workflow option for persistent storage have a performance impact?

Enabling the Workflow option for persistent storage results in a small performance impact, as the system works behind the scenes to spin up storage prior to executing any Tasks on the Workflow.

In tests, this has taken from 5 - 10 seconds of additional time.

## Are there any time limits defined or that can be set?

Yes, time limits are defined as part of the team quotas set by the team owner or administrator.

## Can I create my own Tasks?

Yes. There are two ways this can be done

1. You can bring your own containers and run them through the use of the **Custom** Task in the Workflow Editor.
2. You can define a Team Task and use that in your Workflow. These Tasks can also be imported from the Tekton Task Hub.

## What is a DAG?

- The core concept of Flow. It is how we represent Tasks and their relationships and dependencies that determine how a Workflow executes.
- It's a graph. Think vertices and edges between them.
- It's directed. Edges between vertices have an orientation or direction.
- It's acyclic. You can't end end up where you started in an execution.
- DAGs have a number of applications across a number of disciplines. For our purposes, it is used for scheduling the Tasks in a Workflow.
- Learn some more about [graph theory](https://en.wikipedia.org/wiki/Graph_theory) and [DAGs](https://en.wikipedia.org/wiki/Directed_acyclic_graph) via Wikipedia.
