---
title: Installing
order: 1
description: What a Flow v5 install needs, how to try it locally with Docker Compose, and how to deploy it to Kubernetes.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->
<!-- The Helm chart facts are from bmrg-flow 6.0.1 on boomerang-io/charts main, merged but not released. -->

# Installing

Boomerang Flow v5 is three images, MongoDB, and a dispatcher that runs tasks on Kubernetes. This page is for operators: what an install needs, how to try Flow on a laptop, and the steps to deploy it.

## What does an install need?

| Component | Needed for | Notes |
| --- | --- | --- |
| A Kubernetes cluster | The dispatcher's task pods | No minimum version is stated for Flow. bmrg-flow 6.0.1, the unreleased chart, lists Kubernetes 1.25 or later. |
| MongoDB | Everything Flow stores | A user that can create collections and build indexes, plus `collMod`: `readWrite` with `dbAdmin` on Flow's database. Flow's own stack runs MongoDB 7.0; no minimum is stated. See [Connect MongoDB](./configuring#connect-mongodb). |
| An S3-compatible store | Artifacts and stored task logs | Optional, but without it a finished task's log lasts only as long as its pod. Create the bucket first. See [Connect the artifact store](./configuring#connect-the-artifact-store). |
| An OpenID Connect provider, or an authenticating proxy | Sign-in | See [Sign-in and the first admin](./sign-in). |
| Tekton Pipelines | The `tekton` executor only | The `kube-jobs` executor needs nothing more. See [Choose an executor](./dispatcher#choose-an-executor). |
| An ingress or reverse proxy | Browsers, GitHub and Slack | It must forward the `Host` header with its port. See [Route traffic](./configuring#route-traffic). |

The images are on Docker Hub, built for `linux/amd64` and `linux/arm64`. Deploy all three at one exact tag, such as `5.0.0-beta.39`:

- `boomerangio/flow-service-core`: the REST API, sign-in, the engine and the database migrations;
- `boomerangio/flow-service-dispatcher`: Flow's Kubernetes dispatcher;
- `boomerangio/flow-client-web`: the webapp.

Upgrading from v3? Read [Upgrading](./upgrading) instead: the first start migrates the database, and the migration is forward-only.

## Is there a Helm chart?

Not a released one. The latest release, bmrg-flow 5.5.4, installs Flow 4.0.0: don't use it for v5. bmrg-flow 6.0.1, the first chart for v5, is merged on the charts repository's `main` branch but isn't released. Until it is, deploy Flow with your own manifests, as below.

## Try Flow locally

The product repository's Docker Compose stack runs Flow on a laptop, secured, with a local sign-in provider, MongoDB and an S3-compatible store. It builds every image from source, so the first start takes a while. You need Docker and Git.

1. Clone the repository at the release tag:

   ```bash
   git clone --branch 5.0.0-beta.39 https://github.com/boomerang-io/flow.git
   cd flow
   ```

2. Start the stack:

   ```bash
   docker compose --profile stack up -d --build
   ```

3. Open `http://localhost:3000/apps/flow/` and select **Sign in**.
4. On the local provider's user picker, choose **Grace Hopper (Admin)**.
5. On **G’day! Let’s activate Boomerang Flow**, enter the stack's activation code, `flow-local-activation-code-for-development`, and select **Submit**.

Flow opens on **Home**, with **Admin** in the side navigation.

| Service | Address | Runs |
| --- | --- | --- |
| Webapp | `http://localhost:3000` | The browser-facing origin |
| Core | `http://localhost:7700` | The `/api/v2` API, for scripts and integrations |
| Sign-in provider | `http://idp.localhost:4380` | A passwordless user picker with two users, **Grace Hopper (Admin)** and **Alan Turing (User)** |
| Artifact store | `http://localhost:8333` | SeaweedFS, with the `flow-artifacts` bucket |

`docker compose down` stops the stack and keeps the database; `docker compose down -v` resets it.

> **Warning:** The stack is for evaluation only. Its encryption keys and activation code are published in the repository, and it turns off the dispatcher's authentication. Never carry its settings into a real install.

### Run tasks in the local stack

The stack starts no dispatcher, so a run's tasks stay `ready`. Its dispatcher, with the `kube-jobs` executor, is set up for OrbStack's Kubernetes:

1. Turn on OrbStack's Kubernetes with `orb config set k8s.enable true`, then restart OrbStack.
2. Write a kubeconfig to `docker/kube/config` with `kubectl config view --context orbstack --minify --flatten --raw`. In it, change the server's host to `host.docker.internal`, and set `insecure-skip-tls-verify: true`.
3. Start the dispatcher beside the stack:

   ```bash
   FLOW_ENGINE_URL=http://service-core:7700 \
   FLOW_DISPATCHER_LOGS_URL=http://service-dispatcher:7702/api/v1/logs/stream \
   docker compose up -d --build service-dispatcher
   ```

The dispatcher is connected when `docker compose logs service-dispatcher` shows `registered as <id>`. Then follow [Getting started](../introduction/getting-started) to run a first workflow.

| Symptom | Cause | Fix |
| --- | --- | --- |
| `http://localhost:3000` doesn't answer for the first minutes | Core migrates and seeds the database before it serves anything | Wait until `docker compose ps` shows `service-core` healthy |
| A port is already allocated | Something else uses 3000, 7700, 4380, 8333, 27017 or 7702 | Stop it, then start the stack again |
| No activation screen, and **Admin** is missing | Someone else signed in first and became the admin | Sign in as that user, or reset with `docker compose down -v` |
| The dispatcher logs refused connections to `host.docker.internal:7700` | `FLOW_ENGINE_URL` wasn't set | Start it again with the command above |

## Install with your own manifests

Each step links to the page with its properties. Use one namespace for Flow and, if you like, another for task pods.

1. **Prepare the dependencies.** Create Flow's MongoDB user and the bucket. Register a public OpenID Connect client whose redirect URI is the webapp's address followed by `/apps/flow/auth/callback`, such as `https://flow.example.com/apps/flow/auth/callback`. See [Sign in with OpenID Connect](./sign-in#sign-in-with-openid-connect).
2. **Create core's Secret,** with the MongoDB URI, the encryption pair and the activation code. See [Set the required configuration](./configuring#set-the-required-configuration).

   > **Warning:** Keep a copy of the encryption pair outside the cluster. If it's lost, every stored secret has to be entered again.

3. **Deploy core,** with a startup probe that outlasts its migrations, and a Service on port 7700. See [Configure health probes](./configuring#configure-health-probes). Core is up when its log shows `Started Application`.
   - **It restarts before that line:** lengthen the startup probe.
   - **It stops with a message:** see [Fix a configuration error](./configuring#fix-a-configuration-error).
4. **Deploy the webapp** with `CORE_SERVICE_INTERNAL_ORIGIN` set to core's Service, and route traffic by prefix. See [Route traffic](./configuring#route-traffic).
   - **Every form submission fails with HTTP 400:** the proxy drops the port from the `Host` header. Forward it with the port.
5. **Deploy the dispatcher.** Give it a machine token ([Give the dispatcher its token](./machine-tokens#give-the-dispatcher-its-token)), a service account bound to a Role ([Grant the Kubernetes permissions](./dispatcher#grant-the-kubernetes-permissions)), and `FLOW_ENGINE_URL`. See [Run the dispatcher](./dispatcher). It's connected when its log shows `registered as <id>`.
   - **It logs `Dispatcher registration attempt 1 failed` with a `401`:** check the token.
6. **Sign in and activate.** The first person to sign in enters the activation code and becomes the admin. See [Make the first admin with the activation code](./sign-in#make-the-first-admin-with-the-activation-code).
   - **The activation screen refuses every code:** no code is set, or someone already activated the install. See [Run without an activation code](./sign-in#run-without-an-activation-code).
7. **Run a workflow** with one task, as [Getting started](../introduction/getting-started) shows.
   - **Its task stays `ready`:** no connected dispatcher registers the task's type. See [Choose the task types](./dispatcher#choose-the-task-types).
   - **It fails with reason `DispatchError` and a `forbidden` message:** the dispatcher's Role is missing a rule.

The install works when the run ends **Succeeded** in **Activity**.

## Install with the Helm chart

<!-- PENDING: bmrg-flow 6.0.1 (charts#92 and #93, appVersion 5.0.0-beta.39) is merged on charts main but not released; the latest release is bmrg-flow-5.5.4. Its dispatcher Role lacks deletecollection. When 6.0.x is released, write the procedure here: helm repo add, the values to set (core.auth.oidc.*, core.artifacts.*, global.database.mongodb.*, global.ingress.*, dispatcher.executor), the activation code from the chart Secret, and re-check values names and the minimum Flow version. -->

No v5 chart is released yet. bmrg-flow 6.0.1 needs Flow 5.0.0-beta.39 or later, and its dispatcher defaults to the `kube-jobs` executor. [With the Helm chart](./configuring#with-the-helm-chart) lists what it sets.

## Next steps

- [Configuring](./configuring): every property, route and probe core needs.
- [Sign-in and the first admin](./sign-in): OpenID Connect, an authenticating proxy, and the activation code.
- [Run the dispatcher](./dispatcher): executors, permissions and task pods.
- [Task logs](./task-logs): stored and live logs.
- [Integrations](./integrations): the GitHub App and the Slack app.
- [Upgrading](./upgrading): moving a v3 install to v5.
