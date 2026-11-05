---
title: Dispatchers
order: 4
description: What a dispatcher is, where one runs, and how it claims, runs and reports task runs.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Dispatchers

A dispatcher is the process that takes task runs from Flow, runs them and reports how they ended. This page explains the model. To run Flow's Kubernetes dispatcher, see [Dispatcher](../hosting/dispatcher); to build your own, see [Write a dispatcher](../extend/write-a-dispatcher).

![Three dispatchers call core and its task queue on /dispatcher/v1 to register, poll, start, heartbeat and end: Flow's Kubernetes dispatcher, which creates task pods as Tekton TaskRuns or Jobs; a second Kubernetes dispatcher registered only for ai tasks, in its own namespace; and a host application running dispatcher-sdk in-process. Core reads a live log from Flow's Kubernetes dispatcher](./assets/flow-dispatchers.svg)

Every arrow to core starts at a dispatcher, because dispatchers pull work and core never pushes it; below each one is what it runs, and the dashed arrow is core reading a running task's live log.

## What is a dispatcher?

Core decides what runs and when; a dispatcher does the running. Any process that implements Flow's published dispatcher contract is a dispatcher. The contract is an HTTP protocol under `/dispatcher/v1`, versioned apart from the product: register, poll for work, report each start and end, and keep claims alive. How a task runs (its image, command, volumes, resources and placement) belongs to the dispatcher, not to core.

Only the task types `template`, `script`, `custom`, `generic`, `ai`, `uploadartifact` and `downloadartifact` reach a dispatcher. The engine runs every other type itself, such as approvals, decisions and sleeps. A dispatcher registers the types it runs and is handed only those. It authenticates with a global machine token: see [Security](./security#tokens).

## Where does a dispatcher run?

The contract is the boundary, not the process. A dispatcher runs as its own deployment only where something has to separate it from core:
- **credentials** core must not hold, such as a cluster's;
- **a network zone** of its own;
- **trust**, to isolate untrusted content;
- **placement** on infrastructure core can't reach.

Otherwise the poll loop can run inside another Java process, through the dispatcher SDK.

| Shape | Built | Where the poll loop runs |
| --- | --- | --- |
| Kubernetes, through Tekton or Jobs | Yes: Flow's Kubernetes dispatcher | Its own image |
| In-process | Yes, through the SDK | A host application that implements the SDK's `TaskHandler` |
| Docker, for local development | No | — |
| Serverless containers | No | — |
| A warm pool of microVMs | No | — |

Several dispatchers can serve one Flow, each claiming only the types it registered. For example, to give AI tasks their own network zone, remove `ai` from the first Kubernetes dispatcher's types and run a second one registered only for `ai`, in its own namespace. A poll can also filter by task or workflow label, but Flow's Kubernetes dispatcher sends no filters.

## Flow's Kubernetes dispatcher or your own?

| | Flow's Kubernetes dispatcher | A dispatcher built with the SDK |
| --- | --- | --- |
| What it is | The `boomerangio/flow-service-dispatcher` image, built on the SDK | Your Java code; the SDK (`io.boomerang:dispatcher-sdk`) registers, polls, renews leases and reports ends |
| Runs a task as | A pod: a Tekton TaskRun (`tekton`, the default) or a Kubernetes Job (`kube-jobs`) | Whatever your `TaskHandler` does |
| Task types | `template`, `custom`, `script`, `ai`, `uploadartifact` and `downloadartifact`, so `generic` tasks wait for another dispatcher | The types it registers |
| Run workspaces | Creates one volume per run | Optional |
| Task logs | Serves live logs once it's given an address core can reach, and uploads each finished log to core | Optional |

A dispatcher can also speak the protocol directly, in any language.

## How does a dispatcher get and run work?

- **Polling.** Dispatchers pull work; core never pushes it. Core holds a poll open for up to 30 seconds and answers as soon as it has claimed something. A poll claims no more tasks than the dispatcher has free slots, and at most 20. A full dispatcher keeps a poll open that claims nothing, so it still receives terminate orders.
- **Claims.** Each claim is a compare-and-set on one task run, so two dispatchers never receive the same task. Core refuses a start, end or log upload from a dispatcher that no longer holds the claim, with `409 TASKRUN_CLAIM_SUPERSEDED`.
- **Leases and heartbeats.** A claim carries a 90-second lease. At least every 30 seconds, from the claim until core has taken the end, the dispatcher sends one heartbeat listing every task it holds, which renews their leases. When a lease lapses, or the dispatcher goes 60 seconds without a poll or heartbeat, core requeues the task, or after three requeues ends it `timedout`. A dispatcher silent for 7 days loses its registration, and registers again when it returns.
- **Ends.** A dispatcher ends a task `succeeded`, `failed` or `invalid`, with its results and a reason. Five reasons mean the task never ran to an end, and core requeues it with backoff, up to three times: `ExceededQuota`, `StartTimeout`, `RateLimited`, `ClusterUnavailable` and `DispatcherStopping`. A failure the dispatcher marks final is never retried; any other follows the task's own retry setting.
- **Terminate orders.** When a task a dispatcher holds is cancelled or times out, or core requeues it, the dispatcher's next poll carries a terminate order. The dispatcher stops any work it holds for that task and reports nothing. The next attempt can't be claimed until the order is taken, so a task never runs twice at once.

## Where does the contract end?

The contract covers registration, the work and storage queues, start, heartbeat, end, terminate orders, storage release and two optional log routes. These aren't built:
- **Deregistering.** There's no route for it; a registration ends only by expiring after 7 days without contact.
- **Reserved work.** A poll without filters still claims work a filtered poll would, so work goes to one dispatcher only when no other registers its task type.
- **Per-task isolation, sizing or placement.** Flow's Kubernetes dispatcher sets these per deployment, so a different tier is a second dispatcher.
- **Serverless and warm-pool dispatchers.** They wait for additions to the contract, such as a queue-depth read for an autoscaler.

## Next steps

- [Dispatcher](../hosting/dispatcher): run and configure Flow's Kubernetes dispatcher.
- [Write a dispatcher](../extend/write-a-dispatcher): build one with the SDK or the protocol.
- [Overview](./overview): how a run moves through Flow.
- [Infrastructure](./infrastructure): what Flow's task pods need from a cluster.
