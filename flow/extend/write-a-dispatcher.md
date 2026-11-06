---
title: Write a dispatcher
order: 2
description: Write a dispatcher with the Java dispatcher SDK, implement TaskHandler, pick a shape and test it.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Write a dispatcher

A dispatcher is any process that claims task runs from Flow, runs them and reports how they ended. This page is for developers who write one with the dispatcher SDK. It covers the dependency, the handler, the shapes a dispatcher takes, and testing. The protocol's rules, from claims to compatibility, are in the [Dispatcher protocol reference](./dispatcher-protocol). To deploy the dispatcher Flow ships, see [Flow's Kubernetes dispatcher](../hosting/dispatcher). For how dispatchers fit into Flow, see [Dispatchers](../architecture/dispatchers).

## Before you start

- **Java 25 or later.** The SDK is a Java library. It depends on `spring-web` (Spring Framework 7) and Jackson 3, and nothing else: no Spring Boot and no Kubernetes client.
- **A GitHub token with `read:packages`,** to read the SDK from GitHub Packages.
- **A dispatcher token:** a `global` Flow token with an actor kind. Declare one in core's configuration, where the actor kind defaults to `SERVICE`, or create one in **Admin › Tokens** with **Actor** set to **Service** or **Agent**. Flow refuses a token with no actor kind. See [Give the dispatcher its token](../hosting/machine-tokens#give-the-dispatcher-its-token).
- **Flow's address** as your dispatcher reaches it, such as `http://flow:7700`.

## Which shape does your dispatcher need?

The protocol is the boundary, not the process. A dispatcher runs as its own process only where a boundary separates it from Flow's engine: credentials the engine must not hold, a different network zone, isolation of untrusted content, or placement on infrastructure the engine can't reach. Without one, the dispatcher runs inside another process.

| Shape | Use when | How |
| --- | --- | --- |
| A worker on infrastructure of its own | A boundary separates your runtime from the engine: Kubernetes, a serverless container, a VM with Docker | Run [the minimal program](#write-the-handler) as a service. Run several with different task types or [filters](./dispatcher-protocol#filters) to split the work. |
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

Maven sends your GitHub token from the `<server>` entry in `~/.m2/settings.xml` whose `id` is `boomerang-flow`. SLF4J and logback are optional: add them only to [capture task logs](./dispatcher-protocol#logs).

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

`StatusReason` names every reason a dispatcher sends. [Which end reasons requeue a task?](./dispatcher-protocol#which-end-reasons-requeue-a-task) says what Flow does with each.

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

Flow times a task out itself at its deadline and sends a [terminate order](./dispatcher-protocol#handle-terminate-orders). A dispatcher may also enforce `timeout` on its runtime: Flow's Kubernetes dispatcher does, and reports `DeadlineExceeded`.

## Test your dispatcher

To test a handler, call it with a `TaskRun` and `new TaskContext(task, "d-1", null)`. To test the client, bind a `MockRestServiceServer` to the `RestClient` you pass to `DispatcherClient`.

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
TaskLogAppender.attach(taskLogs);                          // logback; see "Logs" in the protocol reference for log4j2
Dispatcher.builder()
    .client(new DispatcherClient(hostRestClient, engineUrl, token))
    .name("in-process").taskTypes(List.of("ai"))
    .tasks(handler, () -> 4)
    .captureTaskLogs(taskLogs)
    .observationRegistry(observationRegistry)
    .build();
```

There's no `workflows(...)` and no `logs(...)`: an in-process dispatcher needs neither storage nor a live log route. The token goes on engine calls only. See [Embed Flow](./embed-flow).

## Next steps

- [Dispatcher protocol reference](./dispatcher-protocol): the rules for claims, ends, terminate orders, leases, logs, storage, traces and compatibility.
- [Task container contract](./task-contract): what a task's container receives and returns.
- [Embed Flow](./embed-flow): run Flow inside a host product, with an in-process dispatcher.
- [Flow's Kubernetes dispatcher](../hosting/dispatcher): deploy and configure the dispatcher Flow ships.
- [Machine tokens](../hosting/machine-tokens): declare and rotate the dispatcher's token.
