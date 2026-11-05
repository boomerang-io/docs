---
title: Task container contract
order: 1
description: The exact contract between Flow and a task's container, including environment variables, parameter references, results, size caps, catalogue images and AI tasks.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Task container contract

This page sets out what Flow hands a task's container and what it takes back. It's for task developers who need the exact rules, and for developers whose own dispatcher runs task images. For a walkthrough that builds a task and adds it to a workspace, see [Develop a task](../guides/tasks).

## Which task types run in a container?

Seven task types go to a dispatcher. The engine runs every other type itself, with no container.

| Where it runs | Task types |
| --- | --- |
| A dispatcher | `template`, `custom`, `script`, `generic`, `ai`, `uploadartifact`, `downloadartifact` |
| The engine | `start`, `end`, `decision`, `acquirelock`, `releaselock`, `runworkflow`, `runscheduledworkflow`, `setwfstatus`, `setwfproperty`, `approval`, `manual`, `eventwait`, `sleep` |

A dispatcher receives only the types it registered. Flow's Kubernetes dispatcher registers every dispatched type except `generic`, so a `generic` task waits in the queue until a dispatcher that registers it is running.

- **`template` and `script`** run the task's image with its command, arguments or script. A task with no image takes **Admin › Settings › Tasks › Default Image Path** when its task run is created.
- **`custom`** takes its runtime from its own parameters: `image`, `command` and `arguments` (each split on newlines), and `shellScript`. A secret `command` or `arguments` arrives as one element.
- **`uploadartifact` and `downloadartifact`**: Flow fills in the transfer links when it hands the task out, and verifies an upload when the task ends. An optional download of a missing artifact ends `succeeded` with the result `found=false`, without reaching a dispatcher.
- **`ai`** runs the image its revision declares. See [How AI tasks run](#how-ai-tasks-run).

## When are references filled in?

Flow fills in every reference before a dispatcher sees the task, at two moments:

| What | When | Stored with the values |
| --- | --- | --- |
| The task run's parameter values | When the task is admitted | Yes. They're frozen, with secret values encrypted. |
| The task's `script`, `command`, `arguments` and `envs` | When a dispatcher claims the task | No. Only the copy handed to the dispatcher carries values, so no secret is written into a stored spec. |

So `$(params.x)` in a script, command, argument or environment variable reads the task's own parameter as frozen at admission, and a requeued task gets the same values. A `$(workspace.params.x)` or `$(global.params.x)` written straight into one of those four fields is read at the claim, so an edit made since admission shows.

Flow inserts each value byte for byte: quotes, newlines, backslashes and `$` included. Shell syntax such as `$(date)` isn't a Flow reference and stays as written. A reference to something undeclared fails the task before any dispatcher can claim it, with the reason `ParamUnresolved`. A reference that can't be filled at the claim, because its workspace or global parameter was deleted, fails the task with `SpecFillFailed`.

## What does the container receive?

Flow's Kubernetes dispatcher sets these environment variables. A later row wins on a name clash, so the task's own variables override the rest.

| Variable | Value |
| --- | --- |
| `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`, `PROXY_HOST`, `PROXY_PORT` | The proxy, in upper and lower case, when the operator turns one on |
| `DEBUG` | The run's debug flag |
| `CI` | `true` |
| `FLOW_VERSION` | The dispatcher's `flow.version` |
| `RESULTS_PATH` | `/tekton/results`, a directory, on the `tekton` executor; `/dev/termination-log`, a file, on the `kube-jobs` executor |
| `RESULTS_MAX_BYTES` | The most bytes all results together may take: `4096` on `kube-jobs`; on `tekton`, `4096` unless the operator raised it to match the cluster |
| `PARAM_NAMES` | Every parameter's original name, comma-separated |
| `PARAM_<NAME>` | One per parameter |
| `TRACEPARENT` | The task run's W3C trace context |
| The task's own variables | As declared |

The container also gets:
- **`/data`:** a scratch directory of its own;
- **the run workspace,** when the workflow declares one, at the workflow's mount path (`/workspace` by default);
- **a script:** on `kube-jobs` it's mounted at `/scripts/script` and runs as a file, so it must start with a shebang such as `#!/bin/sh`. On `tekton` it runs as the step's script.

There's no `/params` directory and no variable holding every parameter as JSON. Pass a large input on the run workspace, with a parameter carrying its path.

### How names and values are encoded

- **Names:** Flow upper-cases each name and replaces any character outside `A-Z`, `a-z`, `0-9` and `_` with `_`. So `api-url` arrives as `PARAM_API_URL`, and `privateKey` as `PARAM_PRIVATEKEY`. `PARAM_NAMES` maps each variable back to its exact name.
- **Clashes:** Flow refuses to save two names that fold to the same variable, with `PARAM_NAME_COLLISION`. The dispatcher repeats the check and fails a task that still has one.
- **Values:** a string arrives as it is and a null as an empty string. Numbers, booleans, arrays and objects arrive as JSON.
- **For-each items:** each item also gets `PARAM_ITEM`, the element (JSON when it's an object or array), and `PARAM_INDEX`, its position from 0 as text. See [Repeat a task for each item](../guides/repeat-a-task-for-each-item).

### Secrets arrive as plain environment variables

A `secret` parameter reaches the container as an ordinary `PARAM_<NAME>`, in plain text. Flow masks secrets on every read and scrubs the run's secret values from the logs it serves, but there's no per-task Kubernetes Secret.

> **Warning:** Anyone who can read the task's pod spec can read its secrets. On the `tekton` executor, every parameter is also a parameter of the TaskRun object. Don't print a secret: until Flow serves the log, it's unscrubbed. See [Use secrets](../guides/use-secrets).

## How does a task report its outcome?

Exit 0 to succeed. Any other exit code fails the task. When a task fails, Flow's Kubernetes dispatcher sends a status message of up to 4096 bytes: the Job's or TaskRun's condition, the container's exit code and termination reason, and the last 20 lines of its log.

Write results to `RESULTS_PATH`:

| Executor | `RESULTS_PATH` | Write |
| --- | --- | --- |
| `tekton` | `/tekton/results`, a directory | One file per result, named after the result, holding its value |
| `kube-jobs` | `/dev/termination-log`, a file | One JSON object of result names and values, or Tekton's `[{"key": "…", "value": "…"}]` array |

Only declared results count. Tekton collects only the results the task declares, and on `kube-jobs` Flow keeps only the declared names when the task declares any. On `kube-jobs`, the termination message carries results and nothing else: a short message that isn't a results payload is logged and returns no results. Write errors to the log instead: the status message carries its last 20 lines. [Develop a task](../guides/tasks#return-results) has a shell snippet that works on both executors, and the Node library `@boomerang-io/task-core`.

## What are the size caps?

| Cap | Limit | Over it |
| --- | --- | --- |
| All parameters, resolved | 16384 bytes, set by `flow.engine.task.params.max-bytes` on core | The task ends `invalid` with a `PARAMS_TOO_LARGE` message, before any dispatcher sees it. |
| All results | `RESULTS_MAX_BYTES`, 4096 bytes by default on Flow's Kubernetes dispatcher | The task fails with `ResultsTooLarge`. Kubernetes cuts a termination message at 4096 bytes, so Flow fails the task rather than keep a truncated payload. |
| Results the engine stores | 1048576 bytes (1 MB), set by `flow.engine.task.results.max-bytes` | The task fails with `ResultsTooLarge` and nothing is stored. This guards storage against a faulty dispatcher; a task meets the dispatcher's limit first. |
| A for-each parent's collected results | 16 MB, the database's document limit | The parent fails with `ResultsTooLarge`. |

A node's retry setting never retries `ResultsTooLarge`. Move larger data by reference: a path on the run workspace, or an artifact. See [Keep files between runs](../guides/keep-files-between-runs).

## Which images does the catalogue use?

Catalogue tasks are released from the `boomerang-io/tasks` repository on their own version lines, apart from Flow's.

| Image | Runs |
| --- | --- |
| `boomerangio/task-flow` | Every catalogue task that names no image of its own, through **Default Image Path** (`boomerangio/task-flow:3.3.0` at this release). Flow's Kubernetes dispatcher also runs it for the Upload Artifact and Download Artifact tasks. |
| `boomerangio/task-ai:2.1.0` and `2.0.0` | Revisions 2 and 1 of `ai-prompt` and `ai-agent` |
| `boomerangio/box-service:0.0.18` | The Box tasks |
| `boomerangio/worker-python:0.0.3` | Revision 2 of `run-python-script` |
| `rtsp/mongosh` | Revision 1 of `mongodb-query-execution` |

A workflow pins each node's task version when it's saved, so a new revision changes nothing until the workflow is saved again.

The `task-flow` tasks read their parameters from `PARAM_NAMES` and `PARAM_<NAME>`, and write results to `RESULTS_PATH`, through `@boomerang-io/task-core`. A dispatcher you write must set those variables to run catalogue images.

## How AI tasks run

An `ai` task runs the image and command its revision declares, `prompt` or `agent`. It never runs a script, and a workflow author never builds its container. An in-process dispatcher ignores the image and does the work itself.

Flow's Kubernetes dispatcher runs an `ai` task only when its image starts with a prefix the operator allows, `boomerangio/task-ai` by default. Any other image fails the task with `ImageNotAllowed` before anything is created, and a node's retry setting never retries it. To run an AI worker of your own, your operator adds its prefix: see [Flow's Kubernetes dispatcher](../hosting/dispatcher).

An `ai` pod also receives, when the operator sets them on the dispatcher:
- `OPENAI_BASE_URL` and `OPENAI_API_KEY`, a default endpoint and token. The task's own `endpoint` and `token` parameters still arrive as `PARAM_ENDPOINT` and `PARAM_TOKEN`, and win inside the image.
- `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_HEADERS` and `OTEL_EXPORTER_OTLP_PROTOCOL`, the OpenTelemetry exporter settings, with `OTEL_SERVICE_NAME` set to `flow-task-<taskRef>` and `OTEL_RESOURCE_ATTRIBUTES` carrying `flow.workflow.run.id`, `flow.task.run.id` and `flow.task.name`.

A task's own variable of the same name wins. The worker's parameters and results are documented in `tasks/ai/README.md` in the `boomerang-io/tasks` repository. For using AI tasks in a workflow, see [Use AI tasks](../guides/use-ai-tasks).

## Join the run's trace

`TRACEPARENT` is `00-`, then `00000000` followed by the run's 24-character id, then `-`, the last 16 characters of the task run's id, and `-01`. For example, task run `6ad1bfa6cfefa66e88d5e2e0` of run `6ad1bfa3cfefa66e88d5e24a` gets:

```text
00-000000006ad1bfa3cfefa66e88d5e24a-cfefa66e88d5e2e0-01
```

A task that exports OpenTelemetry spans and reads `TRACEPARENT` through the W3C propagator lands in its run's trace, beside the run's other tasks. A retry is a new run, so it's a new trace. Flow stores no traces and emits no run or task spans of its own.

## Next steps

- [Develop a task](../guides/tasks): build a task and add it in **Task Manager**.
- [Write a dispatcher](./write-a-dispatcher): run task runs on infrastructure of your own.
- [Use secrets](../guides/use-secrets): how a secret parameter travels.
- [Dispatchers](../architecture/dispatchers): how Flow hands work to a dispatcher.
