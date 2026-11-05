---
title: Write a dispatcher
order: 2
description: Write a dispatcher with the Java dispatcher SDK, implement TaskHandler, pick a shape, and follow the protocol's rules for claims, ends, terminate orders, leases, logs, storage and traces.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Write a dispatcher

A dispatcher is any process that claims task runs from Flow, runs them and reports how they ended. This page is for developers who write one with the dispatcher SDK. It covers the dependency, the handler, the shapes a dispatcher takes, and the protocol rules a handler meets. To deploy the dispatcher Flow ships, see [Flow's Kubernetes dispatcher](../hosting/dispatcher). For how dispatchers fit into Flow, see [Dispatchers](../architecture/dispatchers).

## Before you start

- **Java 25 or later.** The SDK is a Java library. It depends on `spring-web` (Spring Framework 7) and Jackson 3, and nothing else: no Spring Boot and no Kubernetes client.
- **A GitHub token with `read:packages`,** to read the SDK from GitHub Packages.
- **A dispatcher token:** a `global` Flow token with an actor kind. Declare one in core's configuration, where the actor kind defaults to `SERVICE`, or create one in **Admin › Tokens** with **Actor** set to **Service** or **Agent**. Flow refuses a token with no actor kind. See [Give the dispatcher its token](../hosting/machine-tokens#give-the-dispatcher-its-token).
- **Flow's address** as your dispatcher reaches it, such as `http://flow:7700`.

## Which shape does your dispatcher need?

The protocol is the boundary, not the process. A dispatcher runs as its own process only where a boundary separates it from Flow's engine: credentials the engine must not hold, a different network zone, isolation of untrusted content, or placement on infrastructure the engine can't reach. Without one, the dispatcher runs inside another process.

| Shape | Use when | How |
| --- | --- | --- |
| A worker on infrastructure of its own | A boundary separates your runtime from the engine: Kubernetes, a serverless container, a VM with Docker | Run [the minimal program](#write-the-handler) as a service. Run several with different task types or filters to split the work. |
| A one-shot worker in a warm pool | Each task needs a fresh sandbox, such as a microVM, that runs one task and exits | Capacity 1, and stop after the first task. See [A one-shot worker](#a-one-shot-worker-in-a-warm-pool). |
| In-process, inside a host product | No boundary: the host product submits runs and runs their tasks | A bean in the host's process, using the host's HTTP client, log capture and tracing. See [In-process](#in-process-inside-a-host-product). |

Flow's Kubernetes dispatcher is the first shape, built on the same SDK.

## Add the SDK

Every product tag publishes the SDK to GitHub Packages as `io.boomerang:dispatcher-sdk`, at the product's version. Use the version of the Flow you run against:

```xml
<repository>
  <id>boomerang-flow</id>
  <url>https://maven.pkg.github.com/boomerang-io/flow</url>
</repository>

<dependency>
  <groupId>io.boomerang</groupId>
  <artifactId>dispatcher-sdk</artifactId>
  <version>5.0.0-beta.39</version>
</dependency>
```

Maven sends your GitHub token from the `<server>` entry in `~/.m2/settings.xml` whose `id` is `boomerang-flow`. SLF4J and logback are optional: add them only to [capture task logs](#logs).

## Write the handler

Implement `TaskHandler` and give it to `Dispatcher.builder()`. This is a complete dispatcher:

```java
TaskHandler handler =
    (task, context) -> {
      // task.getSpec() has the image, command, script, env; task.getParams() the resolved params.
      String output = runSomewhere(task);
      context.uploadLog(output);                       // optional: the engine stores and serves it
      return TaskResult.of(List.of(new RunResult("exitCode", "0")));
    };

try (Dispatcher dispatcher =
    Dispatcher.builder()
        .engine("http://flow:7700", dispatcherToken)   // a Flow machine token with an actor kind
        .name("my-dispatcher")                          // with the host, its identity across restarts
        .taskTypes(List.of("template", "custom", "script"))
        .tasks(handler, () -> 10)                       // at most 10 in flight; 0 is no cap
        .build()) {
  dispatcher.start();                                   // returns at once; registers, then polls
  waitForShutdown();
}                                                       // close() drains for 10 s, then stops
```

The SDK tells Flow a task is starting before it calls `run`, and doesn't call it when Flow says not to. It reports the end from what `run` returns or throws:

| Situation | In the handler | What Flow does |
| --- | --- | --- |
| The task succeeded | Return `TaskResult.of(results)` or `TaskResult.of(results, message)`, or `TaskResult.empty()` for no results | Ends it `succeeded` |
| It failed with a reason | Throw `new TaskFailure("OOMKilled", message)`, with the results written before the failure if there are any | Fails it, or retries it if the node asks for retries |
| A retry can't change the outcome | Throw `TaskFailure.terminal("JobFailed", message)`, sent with `retryable: false` | Fails it now, whatever the node's retry setting |
| The task never ran: no capacity, never began, refused for rate, or the runtime couldn't be reached | Throw `TaskFailure.exceededQuota(message)`, `startTimeout(message)`, `rateLimited(message)` or `clusterUnavailable(message)` | Requeues it for another attempt |
| Anything else is thrown | Nothing more | Fails it with `DispatchError` |
| Flow ordered it terminated | `context.isCancelled()` turns true, `context.onCancel(action)` runs and your handler's `cancel(task)` is called. Stop and return. | Nothing: the SDK reports no end |

`StatusReason` names every reason a dispatcher sends. To test a handler, call it with a `TaskRun` and `new TaskContext(task, "d-1", null)`. To test the client, bind a `MockRestServiceServer` to the `RestClient` you pass to `DispatcherClient`.

### What the handler receives

A `TaskRun` is the order. These are the parts a handler uses:

| Method | Returns |
| --- | --- |
| `getSpec()` | The image, command, arguments, script, environment and working directory, with every reference filled in |
| `getParams()`, `param(name)` | The resolved parameters, each typed `string` (when the type is absent), `array`, `object` or `secret` |
| `getResults()` | The results the task declares. Report only these names. |
| `getTimeout()` | The budget in minutes. Null or 0 is unguarded. |
| `getTaskRef()` | The task's slug form, as the `task` filter takes it |
| `getWorkspace()` | The run workspace to mount, when the workflow declares one |
| `getAttempt()`, `getAttempts()`, `getRetry()`, `isLastAttempt()` | Which attempt this is, how earlier attempts ended, and whether a failure reported now is the node's last |
| `traceparent()` | The task run's W3C trace context |

A `secret` parameter's value is plain text on the order, so keep it out of your own logs. A for-each item is an ordinary task run with two more parameters, `item` and `index`. To run catalogue images, give the container the variables in [What does the container receive?](./task-contract#what-does-the-container-receive)

Flow times a task out itself at its deadline and sends a terminate order. A dispatcher may also enforce `timeout` on its runtime: Flow's Kubernetes dispatcher does, and reports `DeadlineExceeded`.

## How does a dispatcher get work?

### Registration

On `start()`, the SDK calls `POST /dispatcher/v1/register` with its `name`, `host`, `version` and task types. `host` defaults to the machine's host name. Flow answers with an id that the SDK sends on every later call.

- Flow keys a registration on name and host, so a dispatcher that restarts keeps its id.
- Flow drops a task type it doesn't know. A dispatcher registered for no types is never handed work.
- A registration without a host is refused with `400 DISPATCHER_INVALID_REQ`.
- The SDK retries registration with backoff until Flow answers. When a poll or heartbeat is answered `404 DISPATCHER_NOT_REGISTERED`, it registers again and repeats the call once.
- Flow removes a registration 7 days after its dispatcher last connected. There's no route to deregister.

### Polling

The SDK long-polls `GET /dispatcher/v1/{id}/tasks`. Flow holds each poll for up to 30 seconds and answers as soon as it has claimed something, or with `204` when the window passes. Each claim is a compare-and-set, so two dispatchers never receive the same task run.

- **Capacity:** each poll sends `limit`, the pool's free slots, and one answer claims at most 20 task runs. A claimed task is committed to you, so never ask for more than you can run. With no free slot, the SDK keeps a `limit=0` poll open, which claims nothing but still receives terminate orders.
- **Pacing:** the SDK polls again at once after work or a full window, and waits about 5 seconds after a failure or an immediate empty answer.
- **Your own HTTP client:** a `RestClient` you pass must read for longer than 30 seconds. The SDK's default connects within 10 seconds and reads for 60.

### Filters

`tasks(handler, capacity)` claims every registered type. To claim a subset, or to give different work its own capacity, add pools. Each pool polls on its own thread with its own `limit`:

```java
.taskPool("gpu", TaskFilter.none().types("ai"), () -> 2, aiHandler)
.taskPool("rest", TaskFilter.none().types("template", "script").workflowLabel("team", "payments"), () -> 20, handler)
```

| Filter | Matches | In the SDK |
| --- | --- | --- |
| `type` | Task types, a subset of those you registered. An unregistered value without `*` is refused with `400 QUERY_INVALID_FILTERS`. | `types(...)` |
| `task` | Tasks by slug: `<slug>` for a global task, `<workspace>/<slug>` for a workspace task. A bare slug never matches a workspace task. | `tasks(...)`, such as `tasks("clone", "scan-*")` |
| `workflowLabel` | One label on the workflow definition, as `key=value[,value]` | `workflowLabel(key, values...)` |

`*` is the only wildcard, anchored at both ends. Filters are ANDed and values ORed, and terminate orders follow the same filters. A new task, or a workflow that has just been labelled, is claimable through a filter within 30 seconds.

Flow doesn't reserve work for a filtered dispatcher: a poll without filters still claims what a filtered poll would. Flow's Kubernetes dispatcher sends no filters, so it claims every task of the types it registers. Split work by workflow label among dispatchers you write, or for task types the Kubernetes dispatcher doesn't register.

## Start and end a task

### The start answer

Before your handler runs, the SDK calls `PUT /dispatcher/v1/taskrun/{id}/start` with your dispatcher id. It acts on the answer:

| Answer | Then |
| --- | --- |
| Phase `completed` | The task was cancelled while it was handed over. Don't run it. |
| A 4xx | Don't run it. |
| Flow can't be reached | You may run it: the end is still checked against your claim. |
| Phase `queued` | Run it. Flow moves the task to running asynchronously, so this is normal. |

### The end

`PUT /dispatcher/v1/taskrun/{id}/end` carries your dispatcher id, `status`, `statusReason`, `statusMessage`, `results` and an optional `retryable`.

- `status` is `succeeded`, `failed` or `invalid`, and absent means `succeeded`. Anything else is refused with `400 TASKRUN_INVALID_END_STATUS`.
- An end from a dispatcher that no longer holds the claim, such as after Flow requeued the attempt, is refused with `409 TASKRUN_CLAIM_SUPERSEDED` and changes nothing.
- The SDK retries the end with backoff, from 1 second doubling to 30, until Flow takes it or refuses it with a 4xx other than 408 or 429. Meanwhile the task stays in flight and its lease is renewed.

### Which end reasons requeue a task?

Five reasons mean the task never ran to an end. Flow requeues it after a backoff that starts at 10 seconds and doubles, up to 3 times beyond the first attempt, then fails it.

| Reason | Send when |
| --- | --- |
| `ExceededQuota` | The runtime refused to create the work for lack of capacity |
| `StartTimeout` | The work was created but never began within your start deadline |
| `RateLimited` | The runtime, or a gateway in front of it, refused the task for rate |
| `ClusterUnavailable` | The runtime's control plane couldn't be reached: a timeout, a refused connection or a 5xx |
| `DispatcherStopping` | Your dispatcher is stopping and never started the claim. The SDK sends it. |

A requeue keeps the claim. Before the next attempt can be claimed, Flow sends you a terminate order for the earlier one, so a task never runs twice at once.

The other reasons a dispatcher sends fail the task: `DispatchError`, `DeadlineExceeded`, `JobFailed`, `JobDeleted`, `OOMKilled`, `ImagePull`, `ImageNotAllowed`, `AdmissionDenied` and `ResultsTooLarge`. When the node asks for retries, Flow retries a reported failure on the node's budget, at most 10. It never retries `ImageNotAllowed`, `AdmissionDenied`, `ResultsTooLarge`, or a failure sent with `retryable: false`. A reason Flow doesn't know is an ordinary failure.

## Handle terminate orders

A poll answer holds two kinds of order:

| Phase and status | Order | Do |
| --- | --- | --- |
| `queued` and `ready` | Run it | Call start, run the task, then call end |
| `completed`, with `cancelled` or `timedout` | Terminate it | Stop any work you hold for that task run id. Never call end. |

A terminate order comes for a task that was cancelled or timed out while you held it, and for one Flow requeued while you might still hold earlier work. Claiming the order releases your claim. With nothing left to stop, treat the order as done. The SDK calls `cancel(task)` for every terminate order, including one for a task this process isn't running, because the work may have outlived an earlier process.

## Keep leases alive

Each claim carries a lease set 90 seconds ahead. `PUT /dispatcher/v1/{id}/heartbeat` lists the task runs you're still working on, and Flow renews each one's lease by 90 seconds. Heartbeat every task you hold, from its claim until Flow has taken its end, at least every 30 seconds.

- **A lapsed lease,** or no poll or heartbeat from the dispatcher for 60 seconds, gets the tasks requeued.
- **The SDK** sends one heartbeat every 30 seconds for every task in flight. With `heartbeatInterval(Duration.ZERO)` it sends none, and Flow requeues every claim when its first lease lapses, 90 seconds after the claim.
- **On `stop()`,** the SDK stops polling and waits 10 seconds (`drainTimeout`) for the poll in progress and the tasks in flight. It ends each claim it never started with `DispatcherStopping`. A task still running then reports nothing: its lease lapses and Flow hands it out again. Make `cancel`, and a re-run of the same task run id, safe.

## Add the optional pieces

A dispatcher may skip any of these.

### Logs

Three pieces, independent of each other:

- **Store the finished log.** Call `context.uploadLog(...)` from the handler before it returns. Flow stores the log when it has an artifact store and **Admin › Settings › Artifacts › Store Task Logs** is on, keeps it for **Task Log Retention (days)** (7 by default), and serves it ahead of any live read. A log over 10 MiB is refused whole. The upload is best effort: a refusal never fails the task.
- **Capture what the handler logs.** `.captureTaskLogs(new TaskLogCapture())` makes the lines a handler logs into the task's log. The handler's thread carries the task run id in the SLF4J MDC as `taskRunId`, and your log framework feeds the capture. With logback, call `TaskLogAppender.attach(taskLogs)`. With log4j2, write an appender that calls `taskLogs.append(event.getContextData().getValue("taskRunId"), layout.toSerializable(event))`. The SDK uploads the capture when the handler returns and every 30 seconds while it runs, keeping the first and last 64 KB of each task's log.
- **Serve the live log.** `.logs(url, token)` registers where Flow reads a running task's log. Flow calls the URL with `workflowRef`, `workflowRunRef` and `taskRunRef` as query parameters, and presents the token as a bearer. `Dispatcher.Builder.randomLogsToken()` makes one. Your route must check the bearer against `dispatcher.logsToken()` and refuse anything else, because a task log is unscrubbed until Flow serves it. Write each line as the task writes it, rather than collecting the body first.

### Storage

Add `.workflows(workflowHandler)` when your tasks share a run workspace. The SDK claims runs that declare a workspace from `GET /dispatcher/v1/{id}/workflows`; your handler provisions the volume and returns, and the SDK reports the run's storage ready. Make provisioning idempotent, because a run can arrive more than once.

When the handler throws, the SDK reports the innermost cause. The run shows it, Flow hands the run out again after 60 seconds, and the third failed attempt fails the run. To free volumes, ask with `dispatcher.client().releasable(...)` which of the runs you hold volumes for have finished, up to 500 runs per call.

### Traces

`TaskRun.traceparent()`, also `context.traceparent()`, gives the task run's W3C trace context. Its trace id is the run's id, so every task of one run lands in one trace. Hand it to the task as `TRACEPARENT`. It's null when either id isn't 24 hexadecimal characters.

With `.observationRegistry(registry)`, the SDK opens a Micrometer observation named `flow.task` around each handler call, tagged with the task run id, task name and workflow run id. With Micrometer Tracing on the registry, the observation becomes a span parented on the run's trace, and the handler's own spans join it. Without a registry nothing is opened, and the SDK adds no OpenTelemetry dependency.

### Artifact tasks

`context.artifacts()` gives an `ArtifactTransfer`, which runs the `uploadartifact` and `downloadartifact` transfers without the worker image and checks a download against its `sha256`.

## The other shapes

### A one-shot worker in a warm pool

A microVM or sandbox that takes one task and exits. Give it capacity 1 and stop after the first task:

```java
CountDownLatch done = new CountDownLatch(1);
Dispatcher dispatcher =
    Dispatcher.builder()
        .engine(url, token).name("sandbox").host(sandboxId)
        .taskTypes(List.of("script"))
        .tasks((task, context) -> { try { return run(task, context); } finally { done.countDown(); } }, () -> 1)
        .build();
dispatcher.start();
done.await();
dispatcher.stop();   // the end has been reported by now; the lease ends with the process
```

Each poll asks for at most one task, so a worker never claims more than it can run. Use a stable `name` and let `host` vary. Each worker leaves a registration behind until Flow removes it, 7 days after its last connection. A pool controller decides how many workers to keep warm, but Flow has no queue-depth read to size the pool from.

### In-process, inside a host product

The host product both submits runs and runs their tasks. Build the dispatcher as a bean in the host's process, with the host's `RestClient` so its proxy, certificates and timeouts apply. Capture the handler's logs as the task log, since there's no route for Flow to read them live, and hand it the host's `ObservationRegistry` so each task's spans join the run's trace:

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

There's no `workflows(...)` and no `logs(...)`: an in-process dispatcher needs neither storage nor a live log route. The token goes on engine calls only. See [Embed Flow](./embed-flow).

## How does the protocol stay compatible?

The protocol has its own version, `1`, apart from Flow's product version.

- An additive change keeps it at `1`: a new optional query parameter, response field, end reason or route.
- A dispatcher must ignore response fields it doesn't know, and must not rely on the order of fields or list entries.
- Flow accepts a request that leaves out a field added later, and treats an end reason it doesn't know as an ordinary failure.
- A change that removes or redefines anything ships as `/dispatcher/v2`, with `/dispatcher/v1` served beside it for at least one minor release.

The SDK ignores unknown fields and reads an unknown enum value as `unknown`. Its version is the product tag it was built with.

The SDK is Java only. To write a dispatcher in another language, implement the routes in `contracts/dispatcher-v1.yaml` in the `boomerang-io/flow` repository; Flow also serves the document at `/api/docs/spec/dispatcher-v1`. Send the token as `Authorization: Bearer <token>`, the only form the protocol accepts. Flow answers anything else with a bare `401`.

## Where the contract ends

The protocol covers registration, the two queues, start, heartbeat, end, terminate orders, storage release and the two log pieces. How a task runs (image, command, volumes, resources, placement) and what answers behind a live log route are your dispatcher's own.

These aren't built:
- a route to deregister a dispatcher;
- a queue-depth read for an autoscaler;
- reserving work for a filtered dispatcher ([flow#499](https://github.com/boomerang-io/flow/issues/499));
- run and task spans emitted by Flow itself: tasks and dispatchers export their own.

## Next steps

- [Task container contract](./task-contract): what a task's container receives and returns.
- [Embed Flow](./embed-flow): run Flow inside a host product, with an in-process dispatcher.
- [Flow's Kubernetes dispatcher](../hosting/dispatcher): deploy and configure the dispatcher Flow ships.
- [Machine tokens](../hosting/machine-tokens): declare and rotate the dispatcher's token.
