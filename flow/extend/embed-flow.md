---
title: Embed Flow
order: 5
description: Use Flow as the workflow engine inside a host product, choose a deployment shape, call it with flow-sdk, run its tasks and read results back.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Embed Flow

An embedding product uses Flow as its workflow engine: the product submits runs, Flow walks each run's graph, and a dispatcher runs the tasks. This page is for developers building Flow into a host product. It covers the deployment shape, the `flow-sdk` client, where the tasks run, and how to read results back.

## Before you start

- **A Flow service-core** that the host product can reach. See [Configuring](../hosting/configuring).
- **Java 25 or later,** for `flow-sdk` and `dispatcher-sdk`.
- **A GitHub token with `read:packages`,** to read both libraries from GitHub Packages.

## How does the host product reach Flow?

| Shape | Properties on service-core | Use when | Trade-off |
| --- | --- | --- | --- |
| A headless engine | `flow.security.enabled=false`, `flow.workspace.single=true` | The host product owns identity and tenancy, and nothing else can reach Flow | The API has no authentication: every request is an admin |
| A secured embedding | The defaults: `flow.security.enabled=true`, `flow.workspace.single=false` | Something besides the host can reach Flow, or the host maps its tenants to workspaces | The host product manages tokens |

Every part of service-core loads in both shapes. There's no smaller engine-only build or image.

### Run a headless engine

Set these on service-core:

```bash
FLOW_SECURITY_ENABLED=false
FLOW_WORKSPACE_SINGLE=true
```

With security off, Flow checks no token on `/api/v2`. Every request runs as a synthetic admin: principal `system`, actor kind `SERVICE`, holding every permission on everything. It's never stored, and the audit trail records each action with `actor.principal=system`. The webapp shows no sign-in and no tokens.

> [!WARNING]
> With `flow.security.enabled=false`, anyone who can reach service-core can do anything in Flow. Put it on a network only the host product can reach. Run the webapp against it only for local development, or behind a route the host product protects.

With a single workspace, Flow serves only the seeded `system` workspace:
- a path naming any other workspace is refused with `WORKSPACE_INVALID_REF`;
- creating or deleting a workspace is refused with `WORKSPACE_INVALID_REQ`;
- the `system` workspace's four quota limits are 0, which means unlimited, and its runs take the platform's maximum run duration.

The dispatcher protocol keeps its own check: `/dispatcher/**` still needs a dispatcher token with security off. Declare one, as in [Give the dispatcher its token](../hosting/machine-tokens#give-the-dispatcher-its-token). Declared tokens register whether or not security is on. `flow.dispatcher.auth.enabled=false` turns the check off, for local development only.

`Flow.connect` refuses an empty token, although a headless engine never reads it, so pass a placeholder.

### Embed with security on

The defaults apply: workspaces, roles, sign-in and tokens. The host product calls Flow with machine tokens:
- **First setup,** with no person signing in, uses the bootstrap token, `flow.security.bootstrap-token`. It's a full-admin global token: use it to create workspaces and mint narrower tokens.
- **Everyday calls** use a narrower token: a global token declared in configuration, or a workspace (`key`) token. `flow-sdk` takes either.

See [Machine tokens](../hosting/machine-tokens).

To mirror the host's own records as workspaces, give each workspace an `externalRef`, the host's id for the record. `GET /api/v2/workspace/query?externalRef=<id>` finds it. A create that names a reference another workspace already carries is refused with `409 WORKSPACE_EXTERNAL_REF_TAKEN`, so a retried create is safe. In `flow-sdk`, `flow.workspaces().ensure(...)` creates the workspace once, however often it's retried. The reference is set at create and never changes.

## Call Flow with flow-sdk

`flow-sdk` is Flow's public API, `/api/v2`, as typed Java calls. Every product tag publishes it beside the dispatcher SDK, at the product's version, from the same `boomerang-flow` repository as in [Add the SDK](./write-a-dispatcher#add-the-sdk):

```xml
<dependency>
  <groupId>io.boomerang</groupId>
  <artifactId>flow-sdk</artifactId>
  <version>5.0.0-beta.39</version>
</dependency>
```

It depends on `spring-web` and Jackson only. Use the library version of the Flow you run against. `/api/v2` only gains routes and fields within 5.x, so an older library keeps working against a newer Flow, and a status, phase or task type added later reads as `unknown`.

```java
Flow flow = Flow.connect("https://flow.example.com", token);   // a workspace or global Flow token
Runs runs = flow.runs("my-workspace");

WorkflowRun run =
    runs.submit("analysis", SubmitRequest.of(List.of(RunParam.of("depth", 3)), Map.of("team.io/batch", "b-7")));

run = runs.get(run.id());                                       // with its task runs
if (run.status() == RunStatus.failed) {
  run = runs.retry(run.id(), Retry.failed().param("depth", 5)); // a new run, parked at ready
  runs.start(run.id());
}
```

On a headless engine, the workspace is `system`. A submit starts the run unless you pass `false` as a third argument, which parks it at `ready` for a later `runs.start(id)`.

| Call | Gives |
| --- | --- |
| `flow.runs(workspace)` | Submit, start, get, pause, resume, cancel and retry runs; query them by label, status and page; count them |
| `flow.taskRuns(workspace)` | Query task runs across runs; read a task run's stored log |
| `flow.actions(workspace)` | Query and decide approvals and manual tasks |
| `flow.insights(workspace)` | Summaries, task groupings and per-workflow figures |
| `flow.workspaces()` | Create, find and delete workspaces |
| `flow.health()` | `UP` or `DOWN` |

Every call returns Flow's answer or throws `FlowApiException`, which carries Flow's error: `code()`, `reason()` (such as `WORKFLOWRUN_INVALID_REFERENCE`), `error().message()` and `status()`. A Flow that can't be reached throws Spring's `ResourceAccessException`. The library retries nothing. Hand it the host's `RestClient` so the host's proxy, trust store and timeouts apply:

```java
Flow.builder().baseUrl(url).token(token).restClient(hostRestClient).build();
```

`toString` on a run, task run, parameter or spec never prints a value that may be a secret.

`flow-sdk` doesn't cover workflow authoring, tokens, settings, schedules, quotas, or the callback and webhook routes. Provision those with your own client against the REST API. Its routes are in `contracts/api-v2.yaml` in the `boomerang-io/flow` repository, and Flow serves the document at `/api/docs/spec/api-v2`.

## Where do the tasks run?

| Option | Use when | Trade-off |
| --- | --- | --- |
| An in-process dispatcher | No boundary separates the host product from its tasks: the host's own code does the work | Tasks run in the host's process, with its credentials. There's no live log; the SDK captures and uploads each task's log. |
| Flow's Kubernetes dispatcher, pointed at your cluster | Tasks are containers: catalogue tasks, scripts, AI tasks, or work that needs isolation | Needs a cluster with Tekton or Kubernetes Jobs, and someone to operate the dispatcher |

Both can serve one engine. Split the work by task type, registering each type with only one of them.

### Run an in-process dispatcher

Embed `dispatcher-sdk` and implement `TaskHandler`. Build the dispatcher as a bean, with the host's `RestClient`, log capture and `ObservationRegistry`:

```java
TaskLogCapture taskLogs = new TaskLogCapture();            // 64 KB head + 64 KB tail per task
TaskLogAppender.attach(taskLogs);                          // logback; see "Logs" for log4j2
Dispatcher.builder()
    .client(new DispatcherClient(hostRestClient, engineUrl, token))
    .name("in-process").taskTypes(List.of("ai"))
    .tasks(handler, () -> 4)
    .captureTaskLogs(taskLogs)
    .observationRegistry(observationRegistry)
    .build();
```

An in-process dispatcher ignores an `ai` revision's image: your handler does the work, such as calling the model. Isolating untrusted content is a boundary, so work that parses content you don't trust belongs in a dispatcher of its own, away from the process that holds the dispatcher token. See [Write a dispatcher](./write-a-dispatcher).

### Point Flow's Kubernetes dispatcher at your cluster

Deploy Flow's dispatcher image, `boomerangio/flow-service-dispatcher`, in the cluster where tasks should run. It reaches service-core at `flow.engine.url` and authenticates with `flow.engine.dispatcher.token`. See [Flow's Kubernetes dispatcher](../hosting/dispatcher) for the deployment, and [Task container contract](./task-contract) for what each container receives.

## Read results back

- **Read the run.** `runs.get(id)` returns the run with its task runs, and each task run carries its results. Over HTTP, call `GET /api/v2/workspace/{workspace}/workflowrun/{id}?withTasks=true`. Secret parameters read as `*****`.
- **Label your runs.** Submit with labels, such as `team.io/batch`, then query runs and task runs by label. Labels under `boomerang.io/` are reserved: Flow drops a client's on submit, start and retry. Flow sets two of its own: an AI task run carries `boomerang.io/model`, and each for-each item, and each child run a for-each run-workflow task starts, carries `boomerang.io/item`.
- **Listen for status events.** With the event sink on, Flow sends a CloudEvent for every workflow run and task run status change, typed `io.boomerang.event.status.workflowrun` and `io.boomerang.event.status.taskrun`. The default thin payload carries identity and lifecycle only: the id, references, status, `statusReason`, phase, labels, creation date, start time and duration. Read the run back over the API for its parameters and results. See [Send status events and traces](../hosting/configuring#send-status-events-and-traces).
- **Read a task's log.** `flow.taskRuns(workspace).log(taskRunId)` returns the stored log as text.
- **Meter AI usage.** An AI task run returns `promptTokens`, `completionTokens`, `totalTokens`, `reasoningTokens`, `cachedPromptTokens` and `cost` as results. Sum them over task runs, or read the totals from `flow.insights(workspace)`.
- **Follow traces.** Flow stores no traces. Each task gets a `TRACEPARENT` derived from its run, so spans the tasks export land in one trace per run, in your own tracing backend.

## Next steps

- [Write a dispatcher](./write-a-dispatcher): the SDK, the handler and the protocol rules.
- [Task container contract](./task-contract): what a task's container receives and returns.
- [Machine tokens](../hosting/machine-tokens): the bootstrap token, declared tokens and the dispatcher's token.
- [Configuring](../hosting/configuring#choose-a-deployment-shape): the deployment shape and the event sink.
