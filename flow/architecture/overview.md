---
title: Overview
order: 1
description: How Flow is built, how a workflow run moves from submit to finish, and how Flow scales.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Overview

This page explains how Boomerang Flow is put together and how a workflow run moves through it. It's for operators and integrators; [Configuring](../hosting/configuring) covers setting it up.

![Flow's parts: a browser calls the webapp on /apps/flow/, and the webapp and other systems call core on /api/v2. Core uses MongoDB and an S3-compatible artifact store. Dispatchers call core on /dispatcher/v1, core reads a live log from Flow's Kubernetes dispatcher, and that dispatcher creates task pods](./assets/flow-components.svg)

Read it from the top: a browser reaches core only through the webapp, other systems call core's API directly, and the dispatchers below core call up to it for work, while the dashed arrow is the one call core makes to a dispatcher.

## What are the parts?

Flow ships as three images, built from one release tag:

| Image | Part | Does |
| --- | --- | --- |
| `boomerangio/flow-service-core` | Core | The REST API under `/api/v2`, sign-in, schedules, webhooks and events, the GitHub and Slack integrations, and the engine that runs workflows |
| `boomerangio/flow-client-web` | The webapp | The only origin a browser talks to, under `/apps/flow/`. Its server calls core; the browser never calls `/api`. |
| `boomerangio/flow-service-dispatcher` | Flow's Kubernetes dispatcher | Claims task runs from core and runs each one as a pod |

The engine is part of core, not a separate service. Core keeps its data in MongoDB, and artifacts in an S3-compatible store: see [Infrastructure](./infrastructure). A dispatcher is any process that implements Flow's published contract, so Flow's Kubernetes dispatcher is one implementation, not the only one: see [Dispatchers](./dispatchers). Each release also publishes two Java libraries, `dispatcher-sdk` for writing a dispatcher and `flow-sdk` for calling the API.

## How does a run move through Flow?

1. **Submit.** A run starts from the webapp or the API, a schedule, a webhook, a CloudEvent, a GitHub delivery or a Run workflow task.
2. **Admit the run.** Core checks the workspace's quotas, resolves the parameters, creates a task run for every task and validates the graph. A run over its workflow's concurrency limit waits for a slot.
3. **Start the run.** A run without a run workspace starts at once. A run with one waits for a dispatcher to claim it and create the volume, then starts.
4. **Admit each task.** When the graph reaches a task, core resolves its parameters and marks it ready; a paused run admits nothing. Approvals, manual tasks, decisions, sleeps, locks and Run workflow tasks run inside the engine. Tasks that run a container wait for a dispatcher.
5. **Claim.** A dispatcher holds a poll open for up to 30 seconds and claims no more tasks than it has free slots.
6. **Run.** The dispatcher reports the start, runs the task, and reports the end with the task's results.
7. **Advance.** Core admits every task the end unblocks, back to step 4, or completes the run when the graph is done. Each status change can go out as a CloudEvent: see [Webhooks and events](./eventing).

Dispatchers pull work; core never pushes it. The only call core makes to a dispatcher is to read a running task's live log, at the address the dispatcher registered.

Recovery needs no per-run timers. Every claim carries a 90-second lease that the dispatcher renews every 30 seconds, and core requeues a task whose lease lapses. Sweeps on every core instance time out overdue runs and tasks, move stalled runs on and expire artifacts.

## Status and phase

Every run and task run carries two values. The **status** is the outcome the webapp shows, such as `running` or `timedout`. The **phase** is the lifecycle stage: `pending`, `queued`, `running`, then `completed`, which is final. A task on a dispatcher moves like this, one guarded write per step:

| Step | Status | Phase |
| --- | --- | --- |
| Created with its run | `notstarted` | `pending` |
| Admitted | `ready` | `pending` |
| Claimed by a dispatcher | `ready` | `queued` |
| Started | `running` | `running` |
| Ended | `succeeded`, or another final status | `completed` |

[Runs](../fundamentals/runs#status-and-phase) lists every status.

## How does Flow scale?

Run as many core instances as you need against one MongoDB database, behind a plain load balancer. Every instance serves the whole API and the dispatcher routes, fires schedules and runs every sweep. There's no leader and no message broker: each state change is a single-document compare-and-set, so when two instances race, one wins and the other does nothing. If an instance stops, the others' sweeps pick up its work.

Each instance caches validated tokens for 60 seconds and parameters for 10 seconds, so a revoked token can still work on another instance for up to a minute.

Add task capacity by adding dispatchers. Each claims only its free slots (25 by default for Flow's Kubernetes dispatcher), and work a full dispatcher can't take stays claimable by the others.

## Where are the specifications?

Each subsystem is specified in the [`specifications/`](https://github.com/boomerang-io/flow/tree/main/specifications) folder of the Flow repository on GitHub, from the execution model to the dispatcher and API contracts. Read them when you need the internals.

## Next steps

- [Webhooks and events](./eventing): start and resume runs from other systems, and receive status events.
- [Dispatchers](./dispatchers): how task runs are claimed, run and reported.
- [Security](./security): authentication, tokens, roles and secrets.
- [Infrastructure](./infrastructure): what a deployment runs on.
