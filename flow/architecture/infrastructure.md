---
title: Infrastructure
order: 6
description: What a Flow deployment runs on, and what Flow's Kubernetes dispatcher creates in your cluster for each task and run.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Infrastructure

This page lists what a Flow deployment runs on and what Flow's Kubernetes dispatcher creates in your cluster. It's for operators planning and sizing an install; [Configuring](../hosting/configuring) has the properties.

![A Kubernetes cluster where an ingress routes /apps/flow/ to the webapp pod and /api/v2/ to a Service in front of several core pods. Core connects to MongoDB, an S3-compatible artifact store, and an optional OpenID Connect provider and OTLP collector. In the task namespace, the dispatcher pod creates task pods, each with its own /data emptyDir, and one run workspace PersistentVolumeClaim per run that the run's task pods mount. Task pods reach the artifact store through signed links](./assets/flow-infrastructure.svg)

Traffic enters at the ingress at the top, core reaches its dependencies on the right, and in the task namespace at the bottom the dispatcher creates each run's task pods and the run workspace volume they share.

## What does Flow run?

| Image | Port | Runs as | Base |
| --- | --- | --- | --- |
| `boomerangio/flow-service-core` | 7700 | uid 10001, group 0 | Ubuntu's chiseled Java 25 runtime |
| `boomerangio/flow-service-dispatcher` | 7702 | uid 10001, group 0 | Ubuntu's chiseled Java 25 runtime |
| `boomerangio/flow-client-web` | 3000 | uid 65532, group 0 | Google's distroless Node 24 |

One release tag builds all three; deploy them at the same tag. Each is built for `linux/amd64` and `linux/arm64`, and none has a shell. Task images, such as `boomerangio/task-flow` and `boomerangio/task-ai`, are released separately.

Core migrates its database as it starts, before it serves anything. Replicas that start together wait up to 30 minutes on the migration lock, so give core a startup probe that covers the migration. Run as many core replicas as you need: see [How does Flow scale?](./overview#how-does-flow-scale)

## What does Flow depend on?

| Dependency | Needed for | Required |
| --- | --- | --- |
| MongoDB | Everything core stores, in one database. Collections are named `flow_<name>` (`flow.mongo.collection.prefix`). | Yes |
| An S3-compatible object store | Artifacts and stored task logs | No. Until `flow.artifacts.enabled` is `true`, artifact calls fail with `ARTIFACTS_NOT_CONFIGURED`, and a task's log lasts only as long as its pod. |
| An OpenID Connect provider | People signing in | No. An authenticating proxy works instead: see [Sign-in](../hosting/sign-in). |
| Kubernetes | Flow's Kubernetes dispatcher and its task pods | For that dispatcher |
| Tekton Pipelines | The `tekton` executor, which creates `tekton.dev/v1` TaskRuns | Only with `dispatcher.executor=tekton`, the default. `kube-jobs` runs plain Jobs. |
| An OTLP collector | Traces | No. Core exports its request spans when `management.tracing.export.enabled` is `true`. |

Flow needs no message broker. It stores no traces either: each task gets a `TRACEPARENT` derived from its run, so tasks that export their own spans land in one trace per run.

<!-- UNVERIFIED: no v5 source states minimum versions for Kubernetes, Tekton Pipelines or MongoDB. -->

## What does a task pod get?

Flow's Kubernetes dispatcher runs each task as one pod, through a Tekton TaskRun or a Kubernetes Job, in `kube.namespace` (blank: the dispatcher's own namespace).

### Placement

Placement is set per dispatcher deployment, not per task: a node selector (`dispatcher.tasks.nodeselector`), tolerations (`dispatcher.tasks.tolerations`), host aliases, the image pull secret (`kube.image.pullSecret`) and a RuntimeClass (`dispatcher.tasks.runtimeClassName`) apply to every task it runs. To keep tasks on dedicated nodes, taint them and give the dispatcher a matching toleration and node selector. Tasks that need different placement or isolation need a second dispatcher.

### Resources and ephemeral storage

Every task container gets the same requests and limits, and a workflow author can't ask for more:

| Property | Default |
| --- | --- |
| `kube.resource.request.memory` / `kube.resource.limit.memory` | `2Gi` / `16Gi` |
| `kube.resource.request.ephemeral-storage` / `kube.resource.limit.ephemeral-storage` | `2Gi` / `16Gi` |
| `kube.resource.request.cpu` / `kube.resource.limit.cpu` | not set |

A blank value sets nothing. CPU is unset because a CPU limit throttles a task rather than failing it.

Each task also gets `/data`, an `emptyDir` for its own scratch files, which counts against ephemeral storage. With `kube.task.storage.data.memory=true` and the task's `worker.storage.data.memory` parameter set to `true`, `/data` is memory-backed and counts against the memory limit instead.

### The run workspace

A workflow that declares a run workspace gets one PersistentVolumeClaim per run, created by the dispatcher before the run starts and labelled `boomerang.io/workspace-ref=<run id>`. No volume is shared between runs, not even by a retry.
- **Size:** the workflow's declared size, refused with `QUOTA_EXCEEDED` above the workspace's storage quota while quotas are on. A blank size takes the **Max Workspace Storage** quota (`max.workspace.storage`, 2Gi by default), or, while quotas are on, the workspace's own quota when that's lower.
- **Storage class and access mode:** the workflow's, else `kube.workspace.storage.class` (blank uses the cluster's default class) and `kube.workspace.storage.accessMode` (`ReadWriteMany`).
- **Removal:** every 60 seconds the dispatcher asks core which of its claims belong to completed runs, and deletes them.

Every run creates and deletes a claim, so choose a storage class that provisions quickly. Plan capacity for concurrent runs times their size, plus the claims that kept task pods still hold (next section).

### When are finished task pods removed?

The **Deletion Policy** setting, in **Admin › Settings › Tasks**, decides when a finished task's TaskRun or Job, and its pod, go:
- `Never`, the default: kept until retention removes them.
- `OnSuccess`: removed when the task succeeds. A failed task's pod stays.
- `Always`: removed when the task ends.

Whatever the policy, a finished TaskRun or Job is removed `kube.task.ttlDays` (7) days after it completes: Kubernetes collects Jobs through `ttlSecondsAfterFinished`, and the dispatcher deletes old TaskRuns hourly. Until then, a kept pod still mounts its run workspace, so under `Never` a finished run's claim stays `Terminating` for up to 7 days. With the artifact store on and **Store Task Logs** on (the default), the dispatcher stores each task's log with core before removing its pod, so `Always` keeps every log.

### What happens when a pod can't start?

| Situation | Reported as | Then |
| --- | --- | --- |
| A namespace quota refuses to create it | `ExceededQuota` | Requeued |
| The pod is still `Pending` after 15 minutes (`kube.timeout.startMinutes`) | `StartTimeout` | Requeued |
| The Kubernetes API can't be reached or answers 5xx | `ClusterUnavailable` | Requeued |
| An image can't be pulled, or a container created, for 60 seconds (`kube.timeout.startFailureGraceSeconds`) | `ImagePull` or `DispatchError` | The task fails |
| An admission webhook refuses to create it | `AdmissionDenied` | The task fails |

A requeued task is tried again with backoff, up to three times. A cluster that restricts image sources must admit the task images, or mirrors of them: see [Set the task image](../hosting/configuring#set-the-task-image).

## Next steps

- [Configuring](../hosting/configuring): the properties, routes and probes for each image.
- [Dispatcher](../hosting/dispatcher): run Flow's Kubernetes dispatcher, with its Kubernetes role.
- [Artifacts and the run workspace](../fundamentals/artifacts): how workflows use storage.
- [Security](./security): how tasks are isolated.
