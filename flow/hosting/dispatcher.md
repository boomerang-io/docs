---
title: Run the dispatcher
order: 6
description: Deploy Flow's Kubernetes dispatcher, choose its executor and task types, grant its permissions, and size, place and clean up task pods.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->
<!-- The Helm chart facts are from bmrg-flow 6.0.1 on boomerang-io/charts main, merged but not released. -->

# Run the dispatcher

Flow's Kubernetes dispatcher, `flow-service-dispatcher`, claims task runs from core and runs each one as a pod in your cluster. This page is for operators deploying it. It covers executors, task types, Kubernetes permissions, task pods, AI tasks and running more than one dispatcher.

## Before you start

- **Core is running,** and the dispatcher can reach its port 7700. See [Configuring](./configuring).
- **A namespace** for task pods, run workspace volumes and script ConfigMaps.
- **A dispatcher token:** a global machine token with an actor kind. See [Give the dispatcher its token](./machine-tokens#give-the-dispatcher-its-token).
- **Tekton Pipelines,** only for the `tekton` executor.
- **The same release tag as core,** such as `5.0.0-beta.39`. Core and the dispatcher move together.

## What does the dispatcher do?

At start, the dispatcher registers with core for the task types it runs, then long-polls core for work. For each task it claims, it:

1. creates a Kubernetes Job or a Tekton TaskRun;
2. watches it;
3. reports the end and the results to core.

It also creates each run's run workspace volume before the run starts, and deletes the volume once the run has ended. Core calls the dispatcher only to read a running task's log, at the address the dispatcher registers (see [Task logs](./task-logs)). The dispatcher needs no ingress.

## Choose an executor

`dispatcher.executor` (`DISPATCHER_EXECUTOR`) sets how each task runs. Both executors build the same volumes, environment and resources, and report the same failure reasons.

| Executor | Runs each task as | Needs | Results limit | Cancel |
| --- | --- | --- | --- | --- |
| `tekton` | One `tekton.dev/v1` TaskRun with one step, `task` | Tekton Pipelines | `tekton.results.maxBytes`, 4096 bytes by default | Marks the TaskRun `TaskRunCancelled` |
| `kube-jobs` | One `batch/v1` Job with one container, `task` | Nothing more | 4096 bytes, the container termination message | Deletes the Job and its script ConfigMap |

- **The defaults differ.** The image defaults to `tekton`. bmrg-flow 6.0.1, the unreleased v5 chart, defaults to `kube-jobs`.
- **No minimum version** of Kubernetes or Tekton is stated for Flow.
- **On `kube-jobs`,** a script task's body is mounted at `/scripts/script` and must start with a shebang, such as `#!/bin/sh`. Tekton runs it as the step's script.
- **On Tekton,** raise `tekton.results.maxBytes` only to the cluster's `max-result-size`, and only when Tekton runs with sidecar logs.
- **Jobs only:** `kube.task.backOffLimit` (`0`) and `kube.task.restartPolicy` (`Never`) set the Job's backoff limit and the pod's restart policy.

With `tekton` on a cluster without Tekton Pipelines, the dispatcher can't create a TaskRun, and every task fails with reason `DispatchError`. Install Tekton Pipelines, or set `DISPATCHER_EXECUTOR=kube-jobs` and restart the dispatcher.

<!-- UNVERIFIED: the DispatchError outcome without Tekton is read from TaskService's exception handling (a 404 is "any other 4xx"); not run on a cluster without Tekton. -->

## Connect the dispatcher to Flow

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `flow.engine.url` | `FLOW_ENGINE_URL` | `http://localhost:7700` | Core's base URL with its scheme and port, such as `http://flow-core:7700` |
| `flow.engine.dispatcher.token` | `FLOW_ENGINE_DISPATCHER_TOKEN` | blank | The dispatcher token. It's sent to core only. |
| `flow.dispatcher.name` | `FLOW_DISPATCHER_NAME` | `flow-tekton-dispatcher` | The name it registers under, whatever the executor. Give each dispatcher deployment its own. |
| `kube.namespace` | `KUBE_NAMESPACE` | blank | Where task pods, run workspace volumes and script ConfigMaps go. Blank uses the service account's namespace. |
| `flow.dispatcher.logs.url` | `FLOW_DISPATCHER_LOGS_URL` | blank | Where core reads a running task's log. See [Follow a running task's log](./task-logs#follow-a-running-tasks-log). |

For example, on the dispatcher's container:

```yaml
env:
  - name: FLOW_ENGINE_URL
    value: http://flow-core.flow.svc:7700
  - name: FLOW_ENGINE_DISPATCHER_TOKEN
    valueFrom:
      secretKeyRef: { name: flow-dispatcher, key: token }
  - name: FLOW_DISPATCHER_NAME
    value: flow-kube-jobs
  - name: DISPATCHER_EXECUTOR
    value: kube-jobs
  - name: KUBE_NAMESPACE
    value: flow-tasks
  - name: FLOW_DISPATCHER_LOGS_URL
    value: http://flow-dispatcher.flow.svc:7702/api/v1/logs/stream
```

Like core, the image has no shell. Put JVM flags in `JDK_JAVA_OPTIONS`, and probe it with HTTP `GET /health` on port 7702 (see [Configure health probes](./configuring#configure-health-probes)).

The dispatcher is connected when its log shows:

```text
Dispatcher flow-kube-jobs (<host>) registered as <id> for task types [template, custom, script, ai, uploadartifact, downloadartifact].
```

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Dispatcher registration attempt 1 failed, retrying in … ms: …` with a `401`, repeating | The token is missing, wrong or expired, or has no actor kind | Check `FLOW_ENGINE_DISPATCHER_TOKEN` against [Machine tokens](./machine-tokens#give-the-dispatcher-its-token), then restart the dispatcher |
| The same message with a refused connection | `FLOW_ENGINE_URL` is wrong or unset. `FLOW_ENGINE_SERVICE_HOST` is no longer read. | Set `FLOW_ENGINE_URL` and restart |
| Start fails: `No Kubernetes namespace resolved for the dispatcher client: set kube.namespace, or give the kubeconfig context a namespace.` | No namespace is set or inferred | Set `KUBE_NAMESPACE` |
| The dispatcher is registered, but tasks stay `ready` | No connected dispatcher registers the task's type | See [Choose the task types](#choose-the-task-types) |

## Grant the Kubernetes permissions

Bind a namespaced Role in `kube.namespace` to the dispatcher's service account. No Role ships with Flow itself.

<!-- UNVERIFIED: rules read from the dispatcher's Kubernetes calls at 5.0.0-beta.39; not applied on a cluster. -->

| apiGroups | resources | verbs | When |
| --- | --- | --- | --- |
| `""` | `pods` | get, list | Always |
| `""` | `pods/log` | get | Always |
| `""` | `persistentvolumeclaims` | get, list, watch, create, deletecollection | Always (run workspaces) |
| `batch` | `jobs` | get, list, watch, create, deletecollection | `kube-jobs` executor |
| `""` | `configmaps` | create, deletecollection | `kube-jobs` executor |
| `tekton.dev` | `taskruns` | get, list, watch, create, delete, deletecollection | `tekton` executor |
| `tekton.dev` | `taskruns/status` | update | `tekton` executor (cancel) |

The dispatcher cancels, cleans up and releases volumes by label, with one collection delete each. That needs `deletecollection`; `delete` isn't enough. As a manifest:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: flow-dispatcher
  namespace: flow-tasks
rules:
  - apiGroups: [""]
    resources: [pods]
    verbs: [get, list]
  - apiGroups: [""]
    resources: [pods/log]
    verbs: [get]
  - apiGroups: [""]
    resources: [persistentvolumeclaims]
    verbs: [get, list, watch, create, deletecollection]
  # kube-jobs executor
  - apiGroups: [batch]
    resources: [jobs]
    verbs: [get, list, watch, create, deletecollection]
  - apiGroups: [""]
    resources: [configmaps]
    verbs: [create, deletecollection]
  # tekton executor
  - apiGroups: [tekton.dev]
    resources: [taskruns]
    verbs: [get, list, watch, create, delete, deletecollection]
  - apiGroups: [tekton.dev]
    resources: [taskruns/status]
    verbs: [update]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: flow-dispatcher
  namespace: flow-tasks
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: flow-dispatcher
subjects:
  - kind: ServiceAccount
    name: flow-dispatcher
    namespace: flow
```

> **Warning:** bmrg-flow 6.0.1's dispatcher Role may lack `deletecollection`: on charts `main` it grants `delete` instead, and no `watch` on `persistentvolumeclaims`. Check each rule, and add what's missing to the Role.

<!-- PENDING: re-check bmrg-flow's rbac-role-dispatcher.yaml when 6.0.x is released. -->

```bash
kubectl auth can-i deletecollection jobs.batch -n flow-tasks \
  --as=system:serviceaccount:flow:flow-dispatcher
```

A missing rule shows as a Kubernetes `forbidden` error in the dispatcher's log, and as:

| Missing | What you see |
| --- | --- |
| `create` on `jobs` or `taskruns` | Every task fails with reason `DispatchError`, and its message names `forbidden` |
| `create` or `watch` on `persistentvolumeclaims` | A run with a run workspace shows `Workspace provisioning failed: <cause>`, retries each minute, and fails on the third attempt |
| `deletecollection` on `jobs` | Cancelling a task doesn't stop its pod, and the Deletion Policy doesn't remove Jobs. Jobs still go after `kube.task.ttlDays`. |
| `deletecollection` on `configmaps` | Script ConfigMaps pile up in the namespace |
| `deletecollection` on `persistentvolumeclaims` | Run workspace volumes are never released |
| `deletecollection` on `taskruns`, or `update` on `taskruns/status` | The Deletion Policy doesn't remove TaskRuns, or cancelling doesn't stop one |

## Choose the task types

`flow.dispatcher.task-types` (`FLOW_DISPATCHER_TASK_TYPES`) lists the task types this dispatcher registers. Core hands it claims for those types only. Every other type, such as approvals, sleeps and child workflows, runs inside core.

| Type | Runs | Registered by default |
| --- | --- | --- |
| `template`, `custom`, `script` | Catalogue tasks, your own container tasks and script tasks | Yes |
| `ai` | AI Prompt and AI Agent. See [Run AI tasks](#run-ai-tasks). | Yes |
| `uploadartifact`, `downloadartifact` | Upload Artifact and Download Artifact, on `flow.dispatcher.artifact.image` (`boomerangio/task-flow:3.3.0`) | Yes |
| `generic` | A task whose image and command are authored | No |

To register `generic` too:

```properties
flow.dispatcher.task-types=template,custom,script,ai,uploadartifact,downloadartifact,generic
```

A task whose type no connected dispatcher registers waits, at status `ready`, until one does. Core drops a type it doesn't know from a registration.

`flow.dispatcher.task.max-in-flight` (`FLOW_DISPATCHER_TASK_MAX_IN_FLIGHT`, 25; 0 is no cap) is the most tasks one dispatcher holds at once. A slot is held from the claim until core takes the task's end, including while a pod is `Pending`. While every slot is full, the dispatcher still receives cancels.

## How leases and heartbeats work

A claim carries a lease. The dispatcher's heartbeat renews the lease of every task it holds, so core can tell a slow task from a lost one.

| Setting | Where | Default | Meaning |
| --- | --- | --- | --- |
| `flow.dispatcher.lease.beat-ms` | Dispatcher | `30000` | The heartbeat interval. `0` sends none, and core then requeues every claim once its first lease lapses. |
| `flow.dispatcher.lease-ms` | Core | `90000` | The lease set at claim and at each heartbeat. Keep it at least twice the heartbeat plus one sweep. 90 seconds is the floor. |

- **A dispatcher silent for 60 seconds,** with no poll or heartbeat, is treated as gone, and core requeues its claims.
- **On stop,** the dispatcher waits up to 10 seconds for the tasks in flight. It hands back each claim it never started, and core requeues it at once. A task still running reports nothing, so its lease lapses and core hands it out again.
- **After a restart,** both executors adopt a Job or TaskRun still running under the task's labels rather than create a second one.
- **Registrations expire.** Core deletes a dispatcher's registration after 7 days without a connection, so replaced pods don't pile up. A dispatcher that comes back registers again with a new ID.
- **To stop handing out work,** set `flow.queue.enabled=false` on core. See [Connect the dispatcher](./configuring#connect-the-dispatcher).

## Size and place task pods

Sizing, placement and isolation are set per dispatcher deployment, never per task. A workload that needs another size or tier runs a second dispatcher with its own task types (see [Run several dispatchers](#run-several-dispatchers)).

Six properties size every task container, on both executors:

| Property | Default | Applied as |
| --- | --- | --- |
| `kube.resource.request.memory` | `2Gi` | `requests.memory` |
| `kube.resource.limit.memory` | `16Gi` | `limits.memory` |
| `kube.resource.request.ephemeral-storage` | `2Gi` | `requests.ephemeral-storage` |
| `kube.resource.limit.ephemeral-storage` | `16Gi` | `limits.ephemeral-storage` |
| `kube.resource.request.cpu` | blank | `requests.cpu` |
| `kube.resource.limit.cpu` | blank | `limits.cpu` |

A blank value sets nothing, and with all six blank the container has no resources block. CPU ships blank because a CPU limit throttles a task rather than failing it.

Every task also gets `/data`, an `emptyDir`. It's memory-backed when `kube.task.storage.data.memory=true` and the task's `worker.storage.data.memory` parameter is `true`. Memory-backed data counts against the memory limit, so size memory to cover it.

| Property | Environment variable | Default | Sets |
| --- | --- | --- | --- |
| `dispatcher.tasks.runtimeClassName` | `DISPATCHER_TASKS_RUNTIMECLASSNAME` | blank | The pod's `runtimeClassName`, such as gVisor or Kata Containers, on both executors |
| `dispatcher.tasks.nodeselector` | `DISPATCHER_TASKS_NODESELECTOR` | `{}` | A node selector, as a JSON object |
| `dispatcher.tasks.tolerations` | `DISPATCHER_TASKS_TOLERATIONS` | `[]` | Tolerations, as a JSON array |
| `dispatcher.tasks.hostaliases` | `DISPATCHER_TASKS_HOSTALIASES` | `[]` | Host aliases, as a JSON array |
| `dispatcher.tasks.serviceaccount` | `DISPATCHER_TASKS_SERVICEACCOUNT` | blank | The pod's service account, on Jobs only. A TaskRun names none, so Tekton's own default applies. |
| `kube.image.pullSecret` | `KUBE_IMAGE_PULLSECRET` | `boomerang.registrykey` | The image pull secret named on every task pod |
| `kube.image.pullPolicy` | `KUBE_IMAGE_PULLPOLICY` | `IfNotPresent` | The image pull policy |
| `proxy.enable`, `proxy.host`, `proxy.port`, `proxy.ignore` | `PROXY_ENABLE`, and so on | `false`, blank | Passes `PROXY_HOST`, `PROXY_PORT`, `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY` (from `proxy.ignore`) and the lower-case forms to every task |

> **Warning:** A secured parameter reaches its pod as a plain environment variable, and on Tekton it's in the TaskRun too. Limit who can read pods and TaskRuns in `kube.namespace`. See [Security](../architecture/security#how-are-secrets-protected).

### When a task can't start

Starting is bounded apart from running. A task that never started is handed back to core rather than failed, unless the task itself is wrong.

| Situation | Reason | Then | Property |
| --- | --- | --- | --- |
| A namespace quota refuses the pod (`exceeded quota`) | `ExceededQuota` | Requeued | — |
| An admission webhook refuses it | `AdmissionDenied` | Fails | — |
| The API server times out, refuses the connection or answers 5xx | `ClusterUnavailable` | Requeued | — |
| An image can't be pulled | `ImagePull` | Fails | `kube.timeout.startFailureGraceSeconds` (60) |
| A container can't be created | `DispatchError` | Fails | `kube.timeout.startFailureGraceSeconds` (60) |
| The pod stays `Pending` | `StartTimeout` | Requeued | `kube.timeout.startMinutes` (15; 0 is off) |

Core requeues a task up to three times, with backoff, then fails it. A full cluster therefore delays a task, and an image mistake fails it in about a minute. A pod lost after it started, by eviction or preemption, is an ordinary failure.

A task with no timeout gets `kube.task.timeout` (60 minutes) as a per-pod backstop. The **Maximum task duration** setting, in **Admin › Settings › Tasks**, caps every task; its default, 0, lets a task inherit its run's timeout.

## Configure run workspaces

For a run that declares a run workspace, the dispatcher creates one PersistentVolumeClaim before the run starts, labelled `boomerang.io/workspace-ref=<run id>`. Every task in the run mounts it. Every `flow.dispatcher.workspace.reconcile-ms` (60 seconds), the dispatcher deletes the claims of finished runs.

| Property | Default | Meaning |
| --- | --- | --- |
| `kube.workspace.storage.size` | `1Gi` | Size, when the workflow sets none |
| `kube.workspace.storage.class` | blank | Storage class. Blank uses the cluster's default class. |
| `kube.workspace.storage.accessMode` | `ReadWriteMany` | Access mode. Set `ReadWriteOnce` where the class has no `ReadWriteMany`. |
| `kube.timeout.waitUntil` | `30` | Seconds to wait for a new claim to reach `Pending` or `Bound` |

A finished task's pod still holds the claim. Under the Deletion Policy **Never**, the claim stays `Terminating` until those pods are removed (see [Clean up finished tasks](#clean-up-finished-tasks)).

## Clean up finished tasks

The **Deletion Policy** setting, in **Admin › Settings › Tasks**, decides when a finished task's Job or TaskRun is deleted:

| Option | Deletes the Job or TaskRun |
| --- | --- |
| **Never (keep until the retention period)**, the default | Only after `kube.task.ttlDays` |
| **On Success (remove when a task succeeds)** | When the task succeeds |
| **Always (remove when a task ends)** | When the task ends |

- **Whatever the policy,** a finished Job or TaskRun is removed `kube.task.ttlDays` (7) days after it completes. Jobs use `ttlSecondsAfterFinished`. For TaskRuns, the dispatcher sweeps its own every `flow.dispatcher.task.reconcile-ms` (hourly), or never with `flow.dispatcher.task.reconcile.enabled=false`.
- **The policy is taken when a run is queued,** so a change applies to runs queued after it.
- **`kube.task.deletion` never applies,** because core always sends the policy.
- **The pod log goes with the Job or TaskRun.** With an artifact store, Flow keeps its own copy: see [Store finished logs](./task-logs#store-finished-logs).

## Run AI tasks

AI Prompt and AI Agent are `ai` tasks. Their catalogue revision declares the image, `boomerangio/task-ai`, and the dispatcher runs it like any other task.

| Property | Default | Meaning |
| --- | --- | --- |
| `flow.dispatcher.ai.image-prefixes` | `boomerangio/task-ai` | Comma-separated prefixes an `ai` task's image must start with |
| `flow.dispatcher.ai.endpoint` | blank | An OpenAI-compatible base URL, given to every `ai` pod as `OPENAI_BASE_URL` |
| `flow.dispatcher.ai.token` | blank | Its bearer token, given to every `ai` pod as `OPENAI_API_KEY` |

The endpoint and token reach a pod only when set. A task's own **Endpoint** and **API token** win over them (see [Use AI tasks](../guides/use-ai-tasks)).

- **An image outside the prefixes** fails the task with reason `ImageNotAllowed` before anything is created. To run your own AI worker image, add its prefix: `flow.dispatcher.ai.image-prefixes=boomerangio/task-ai,registry.example.com/ai/`.
- **The token is visible in the pod spec,** like any secured parameter.

### Give AI tasks their own network zone

1. Run a second dispatcher deployment with `flow.dispatcher.task-types=ai` and its own `flow.dispatcher.name`.
2. Put it in a namespace whose egress policy allows only the model endpoint.
3. Set the general dispatcher's `flow.dispatcher.task-types` to `template,custom,script,uploadartifact,downloadartifact`, without `ai`.

No other task type can then reach the model endpoint, and no AI task runs outside the zone. One dispatcher can't hold two zones.

## Export traces from tasks

Flow stores no traces, and core emits no run or task spans. Each task gets `TRACEPARENT`, derived from its run and task run, so tasks that export their own spans land in one trace per run.

For `ai` pods, the dispatcher can set the exporter:

| Property | Default | Given to `ai` pods as |
| --- | --- | --- |
| `flow.dispatcher.ai.otel.endpoint` | blank | `OTEL_EXPORTER_OTLP_ENDPOINT`. Blank sets none of these. |
| `flow.dispatcher.ai.otel.headers` | blank | `OTEL_EXPORTER_OTLP_HEADERS`, such as a backend key. It's visible in the pod spec. |
| `flow.dispatcher.ai.otel.protocol` | `http/protobuf` | `OTEL_EXPORTER_OTLP_PROTOCOL`: `http/protobuf` or `http/json` |

Each `ai` pod also gets `OTEL_SERVICE_NAME=flow-task-<task>` and `OTEL_RESOURCE_ATTRIBUTES` with `flow.workflow.run.id`, `flow.task.run.id` and `flow.task.name`. The AI worker doesn't support `grpc`: it logs one warning and exports nothing. Langfuse takes OTLP over HTTP at `<host>/api/public/otel`; Tempo listens for it on port 4318.

## Run several dispatchers

Flow's Kubernetes dispatcher splits work by task type only. Run one deployment per split, each with its own `flow.dispatcher.name` and `flow.dispatcher.task-types`:

- **An AI zone:** see [Give AI tasks their own network zone](#give-ai-tasks-their-own-network-zone).
- **An isolation tier or a size:** a deployment with its own `dispatcher.tasks.runtimeClassName` or `kube.resource.*`, registered for the types that need it.

Two deployments registered for the same type both claim it, so remove a type from one when another should own it. Flow's Kubernetes dispatcher can't split by workflow label, by task or by workspace. Only a dispatcher built with the dispatcher SDK can, through its poll filters: see [Write a dispatcher](../extend/write-a-dispatcher). Even then, a dispatcher without filters still claims work a filtered one would take.

**Replicas of one deployment** each register under the pod's host name and claim work. Each dispatcher process also accepts live log reads only with the bearer it generated at its own start. If `flow.dispatcher.logs.url` names a Service in front of several replicas, a live log read can land on the wrong one and be refused. Run one replica, or register each pod's own address:

```yaml
env:
  - name: POD_IP
    valueFrom:
      fieldRef: { fieldPath: status.podIP }
  - name: FLOW_DISPATCHER_LOGS_URL
    value: http://$(POD_IP):7702/api/v1/logs/stream
```

<!-- UNVERIFIED: the replica behaviour is read from LogAuthFilter and Dispatcher.Builder.randomLogsToken at the tag; not run with more than one replica. -->

## Next steps

- [Task logs](./task-logs): stored logs, live logs and Loki.
- [Machine tokens](./machine-tokens): the dispatcher's token and its rotation.
- [Configuring](./configuring): core's properties, routes and probes.
- [Use AI tasks](../guides/use-ai-tasks): what workflow authors set on AI tasks.
- [Write a dispatcher](../extend/write-a-dispatcher): run tasks somewhere other than Kubernetes, or split work by workflow label.
