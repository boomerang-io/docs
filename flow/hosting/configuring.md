---
title: Configuring
order: 2
description: Set the properties, routes and probes a Flow v5 deployment needs, and connect Flow to its dispatcher.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. The Helm chart facts are from charts#92 (bmrg-flow 6.0.0). -->

# Configuring

This page covers what each Flow v5 image needs to start, how to route traffic to it, its health probes, and how Flow connects to its dispatcher. It's for operators deploying Flow.

## Before you start

- **A Kubernetes cluster** for the dispatcher. The default `tekton` executor needs Tekton Pipelines installed; `kube-jobs` runs plain Kubernetes Jobs and needs nothing more. See [Dispatcher](./dispatcher).
- **A MongoDB database** and a user for Flow with the rights in [Connect MongoDB](#connect-mongodb). Flow's own stack runs MongoDB 7.0.
- **An S3-compatible bucket** for artifacts and stored task logs. Create it beforehand: S3 doesn't create a bucket on first upload.
- **An OpenID Connect provider or an authenticating proxy** for sign-in. See [Sign-in](./sign-in).
- **An exact release tag**, such as `5.0.0-beta.39`. Pin it: every beta sorts below every release candidate of the same version, so "highest version" can pick an older build.
- **Upgrading from v3?** Read [Upgrading](./upgrading) first. The first start migrates the database, and the migration is forward-only.

## What you deploy

One release tag builds three images. Deploy all three at the same tag.

| Image | Port | Runs as | Does |
| --- | --- | --- | --- |
| `boomerangio/flow-service-core` | 7700 | uid 10001, group 0 | The REST API, sign-in, the engine and the database migrations |
| `boomerangio/flow-service-dispatcher` | 7702 | uid 10001, group 0 | Flow's Kubernetes dispatcher: claims task runs and runs them as pods |
| `boomerangio/flow-client-web` | 3000 | uid 65532, group 0 | The webapp, served under `/apps/flow/` |

Every image is built for `linux/amd64` and `linux/arm64`. Group 0 owns the files, so OpenShift's arbitrary user ID, which is also in group 0, can read them.

No image has a shell or a package manager:
- **JVM flags** for core and the dispatcher go in `JDK_JAVA_OPTIONS`. The v3 chart's `JAVA_OPTS` variable and `sh -c java …` command no longer apply.
- **An internal certificate authority** is trusted through a mounted truststore named in `JDK_JAVA_OPTIONS`, for example `-Djavax.net.ssl.trustStore=/etc/flow/truststore.p12`. There's no `keytool` to import a certificate at container start.
- **Start-up** reads an ahead-of-time class cache built into each Java image. A `JDK_JAVA_OPTIONS` value that picks another garbage collector or turns compact object headers off makes the JVM skip the cache, with one warning, and start more slowly.

Core migrates its database as it starts, so there's no loader Job. Remove the v3 `flow-service-loader` Job when you upgrade.

Run as many core replicas as you need behind a plain Kubernetes Service. Every instance does every job (the API, dispatcher polls, schedules and sweeps), with no leader. Each instance caches a validated token for 60 seconds, so a token revoked on one instance can still work on another for up to a minute.

### With the Helm chart

<!-- PENDING: bmrg-flow 6.0.1 (charts#92 and #93, appVersion 5.0.0-beta.39) is merged on charts main but not released; the latest release is bmrg-flow-5.5.4. Its dispatcher Role lacks deletecollection (raised with the Flow core session). Re-check values names and the minimum Flow version when 6.0.x is released. -->

No Helm chart for Flow v5 is released yet. The current `bmrg-flow` chart, 5.5.4, installs Flow 4.0.0: don't use it for v5. Until the v5 chart is released, deploy the three images with your own manifests, using the properties and probes on this page.

bmrg-flow 6.0.1, the first chart for v5, needs Flow 5.0.0-beta.39 or later. It sets the properties on this page from its values:

- **One tag** for all three images, `image.tag`, which defaults to the chart's `appVersion`.
- **A generated Secret** holds the encryption key (`core.encrypt.secret`, `core.encrypt.salt`), the activation code, and a `bfg_` bootstrap token (`core.security.bootstrapToken`) that the dispatcher uses as its token. Each is generated once and kept across upgrades.
- **Sign-in:** `core.auth.oidc.issuer` and `core.auth.oidc.clientId`, and the admin claim in `core.security.adminClaim.*`.
- **The artifact store:** `core.artifacts.*`.
- **The startup probe:** `core.startupProbe.periodSeconds` and `core.startupProbe.failureThreshold`, 30 minutes by default.
- **The dispatcher:** its own ServiceAccount and Role. Its executor, `dispatcher.executor`, defaults to `kube-jobs`, not `tekton`.

  > **Warning:** bmrg-flow 6.0.1's dispatcher Role may lack the `deletecollection` verb that the dispatcher's clean-up needs (see [Connect the dispatcher](#connect-the-dispatcher)). Check it with `kubectl auth can-i deletecollection jobs --as=system:serviceaccount:<namespace>:<dispatcher service account>`, and add the verb to the Role if the answer is `no`.
- **Any other property:** `core.env` or `dispatcher.env`, as environment variables.

## Set the required configuration

Core and the dispatcher each read the `application.properties` inside their image, and an environment variable overrides any property: `flow.encrypt.secret` becomes `FLOW_ENCRYPT_SECRET`. The webapp reads only environment variables.

Properties wire the deployment: addresses, credentials and switches, read at start. Behaviour an admin tunes while Flow runs, such as quotas, retention and the default task image, is a setting. Settings are stored in MongoDB and changed in **Admin › Settings** or with `PATCH /api/v2/settings`, without a restart. See [Administer](../fundamentals/administer).

Core needs these to start:

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `spring.mongodb.uri` | `SPRING_MONGODB_URI` | a `localhost` sample | MongoDB connection string. Always set it. |
| `flow.encrypt.secret` | `FLOW_ENCRYPT_SECRET` | blank | Half of the key Flow encrypts stored secrets with. Required. |
| `flow.encrypt.salt` | `FLOW_ENCRYPT_SALT` | blank | The other half of the key. Required. |
| `flow.activation-code` | `FLOW_ACTIVATION_CODE` | blank | The code the first admin enters on an empty install. At least 32 characters. See [Sign-in](./sign-in). |

Keep all four in a Kubernetes Secret, since the URI usually carries a password:

```bash
kubectl create secret generic flow-core -n flow \
  --from-literal=SPRING_MONGODB_URI='mongodb://flow:<password>@mongodb:27017/boomerang' \
  --from-literal=FLOW_ENCRYPT_SECRET="$(openssl rand -hex 32)" \
  --from-literal=FLOW_ENCRYPT_SALT="$(openssl rand -hex 16)" \
  --from-literal=FLOW_ACTIVATION_CODE="$(openssl rand -hex 24)"
```

Load it into core's container with `envFrom: [{secretRef: {name: flow-core}}]`.

### Connect MongoDB

Core builds every index itself, in its migrations; nothing else creates them. Its database user needs to read and write, create and drop collections, and build indexes. When the audit retention setting changes, core also changes the audit index's expiry with `collMod`. MongoDB's `readWrite` role doesn't include `collMod`, so add `dbAdmin` on Flow's database, or a custom role that grants it.

### Keep the encryption key

Flow encrypts secured settings, secret parameter values and stored integration tokens with `flow.encrypt.secret` and `flow.encrypt.salt`. Any string works for either. A v3 upgrade reads a second pair once, `mongo.encrypt.*`: see [Upgrading](./upgrading).

> **Warning:** Never change the pair after the first start. Nothing re-encrypts stored values under a new key, so every stored secret stops decrypting. Keep a copy of the Secret outside the cluster. If the pair was changed, put the original back. If it's lost, every secret has to be entered again.

### Connect the artifact store

Artifacts and stored task logs live in an S3-compatible store, such as AWS S3, MinIO or Cloud Storage in S3 mode. The store is off by default. Until it's on, every artifact call answers `ARTIFACTS_NOT_CONFIGURED`, and a finished task's log lasts only as long as its pod (see [Task logs](./task-logs)).

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `flow.artifacts.enabled` | `FLOW_ARTIFACTS_ENABLED` | `false` | Turn the artifact store on |
| `flow.artifacts.store.endpoint` | `FLOW_ARTIFACTS_STORE_ENDPOINT` | blank | The store address core uses |
| `flow.artifacts.store.link-endpoint` | `FLOW_ARTIFACTS_STORE_LINK_ENDPOINT` | blank | The store address task pods use, when it differs from core's |
| `flow.artifacts.store.bucket` | `FLOW_ARTIFACTS_STORE_BUCKET` | `flow-artifacts` | The bucket |
| `flow.artifacts.store.region` | `FLOW_ARTIFACTS_STORE_REGION` | `us-east-1` | The region |
| `flow.artifacts.store.access-key` | `FLOW_ARTIFACTS_STORE_ACCESS_KEY` | blank | Access key. Keep it in the Secret. |
| `flow.artifacts.store.secret-key` | `FLOW_ARTIFACTS_STORE_SECRET_KEY` | blank | Secret key. Keep it in the Secret. |
| `flow.artifacts.store.path-style` | `FLOW_ARTIFACTS_STORE_PATH_STYLE` | `true` | Path-style addressing |

Task pods transfer files through signed links valid for 15 minutes (`flow.artifacts.link-ttl-minutes`). Retention, the largest artifact and the storage quota are settings, under **Admin › Settings › Artifacts** and **Quotas**.

### Fix a configuration error

| Symptom | Cause | Fix |
| --- | --- | --- |
| Start fails: `flow.encrypt.secret and flow.encrypt.salt must be set: …` | The key is blank | Set both values |
| Start fails: `flow.activation-code must be at least 32 characters.` | The code is too short | Set a longer code |
| Start fails: `flow.activation-code and the retired flow.otc are both set and differ; set flow.activation-code only.` | The old `FLOW_OTC` is still set | Remove `FLOW_OTC` |
| Start warns: `No activation code is set, so no first admin can be created …` | No code and no admin claim | Set `FLOW_ACTIVATION_CODE` before anyone signs in |
| Start fails with a MongoDB authorisation error during the migrations | The user can't create collections or indexes | Grant the rights and restart. A failed migration runs again on the next start. |
| Core logs `Could not apply audit retention (…) - the trail keeps its current TTL` | The user can't run `collMod` | Grant it. Core retries within a minute. |

## Route traffic

The browser talks only to the webapp, and the webapp's server calls core. Each of core's route prefixes belongs to one kind of caller, so the ingress routes by prefix:

| Path | Route to | Called by |
| --- | --- | --- |
| `/apps/flow/` | webapp, port 3000 | Browsers |
| `/api/v2/` | core, port 7700 | API clients, webhooks, CloudEvents and integrations |
| `/dispatcher/v1/` | core, port 7700 | Only dispatchers that run outside core's network |
| `/api/docs/` | core, port 7700 | Optional: Swagger UI and the OpenAPI documents |
| `/internal/v1/` | Never route it | The webapp's server, directly |

> **Warning:** A prefix is a routing boundary, not a credential. Anything that reaches core's port directly reaches `/internal/v1` too. Keep core's Service inside the cluster and expose it only through the ingress.

Behind a reverse proxy or ingress, forward the `Host` header with its port (nginx: `proxy_set_header Host $http_host;`, not `$host`). The webapp checks each form submission's `Origin` against that host. Without the port, every form submission fails with HTTP 400. The REST API is unaffected.

The webapp takes these environment variables:

| Variable | Example | Meaning |
| --- | --- | --- |
| `CORE_SERVICE_INTERNAL_ORIGIN` | `http://flow-core:7700` | Core's address from the webapp's server. Unset, the webapp has no address for core. |
| `APP_ROOT` | `/apps/flow` | The base path. Keep `/apps/flow`: it's fixed when the image is built. |
| `PORT` | `3000` | The port the webapp listens on |
| `PRODUCT_SERVICE_ENV_URL` | `/api/v2` | The API address shown in copyable webhook and event URLs. A relative value uses the webapp's own host, so route `/api/v2/` there too, or give a full URL. |

## Configure health probes

Core runs its migrations before it serves any HTTP, so it needs a startup probe that outlasts them. A 16 MB v3 database migrates in under a minute; on a heavily loaded laptop, core took 46 to 85 seconds to start. For example:

```yaml
# service-core container
startupProbe:
  httpGet: { path: /health/liveness, port: 7700 }
  periodSeconds: 10
  failureThreshold: 60   # 10 minutes for start-up and migrations
livenessProbe:
  httpGet: { path: /health/liveness, port: 7700 }
readinessProbe:
  httpGet: { path: /health/readiness, port: 7700 }
```

Both paths answer without a token on a secured install.

| Container | Path | Port |
| --- | --- | --- |
| core | `/health/liveness`, `/health/readiness` (or `/health`) | 7700 |
| dispatcher | `/health` | 7702 |
| webapp | `/apps/flow/health` | 3000 |

- **Use HTTP probes.** There's no shell for an `exec` probe.
- **A passing probe doesn't mean MongoDB is reachable.** Core's health doesn't check the database.
- **If core restarts before it logs `Started Application`,** the startup probe is too short. Lengthen it.
- **Replicas that start together** wait on the migration lock for up to 30 minutes. Roll out one replica first, and for a v3 upgrade size the probe for the largest run history: see [Upgrading](./upgrading).

## Connect the dispatcher

Set these on the dispatcher:

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `flow.engine.url` | `FLOW_ENGINE_URL` | `http://localhost:7700` | Core's base URL from the dispatcher, such as `http://flow-core:7700` |
| `flow.engine.dispatcher.token` | `FLOW_ENGINE_DISPATCHER_TOKEN` | blank | The token the dispatcher sends to core: a global machine token. See [Machine tokens](./machine-tokens). |
| `kube.namespace` | `KUBE_NAMESPACE` | blank | The namespace for task pods, claims and ConfigMaps. Blank uses the service account's namespace. |
| `dispatcher.executor` | `DISPATCHER_EXECUTOR` | `tekton` | `tekton` or `kube-jobs` |

Upgrading from an earlier release? `flow.engine.service.host` is gone: set `flow.engine.url`, with its scheme and port.

Core checks the token on every `/dispatcher/v1/` call, whatever `flow.security.enabled` says, and refuses a missing, expired or non-machine token with HTTP 401. Leave `flow.dispatcher.auth.enabled` at `true` on core. Flow's local development stack turns it off; with it off, core checks nothing on the dispatcher routes.

No Kubernetes Role ships for v5. Bind one to the dispatcher's service account in `kube.namespace`, with these rules:

<!-- UNVERIFIED: rules read from the dispatcher's Kubernetes calls at 5.0.0-beta.38 (the dispatcher's code is unchanged at 5.0.0-beta.39); not yet applied on a cluster. -->

| apiGroups | resources | verbs | When |
| --- | --- | --- | --- |
| `""` | `pods` | get, list | Always |
| `""` | `pods/log` | get | Always |
| `""` | `persistentvolumeclaims` | get, list, watch, create, deletecollection | Always (run workspaces) |
| `batch` | `jobs` | get, list, watch, create, deletecollection | `kube-jobs` executor |
| `""` | `configmaps` | create, deletecollection | `kube-jobs` executor |
| `tekton.dev` | `taskruns` | get, list, watch, create, delete, deletecollection | `tekton` executor |
| `tekton.dev` | `taskruns/status` | update | `tekton` executor (cancel) |

A missing rule shows as a Kubernetes `forbidden` error in the dispatcher's log. Check a rule with:

```bash
kubectl auth can-i create jobs.batch -n flow-tasks \
  --as=system:serviceaccount:flow:flow-dispatcher
```

Flow removes a dispatcher's registration after 7 days without a connection, so replicas replaced on every deploy don't pile up. A dispatcher that comes back registers again with a new ID.

To stop handing out work, for maintenance, set `flow.queue.enabled=false` on core. Dispatchers claim nothing new, work in flight finishes or times out, and recovery keeps running. Polls don't count as connections while it's off, so an idle dispatcher's registration can expire if it stays off for a week; the dispatcher registers again on its next call.

[Dispatcher](./dispatcher) covers executors, task pod settings and running several dispatchers. [Task logs](./task-logs) covers live and stored logs.

## Choose a deployment shape

Two properties on core set the shape:

| Property | Environment variable | Default | Effect |
| --- | --- | --- | --- |
| `flow.security.enabled` | `FLOW_SECURITY_ENABLED` | `true` | Authentication and authorisation, together. `false` runs every request as an admin. |
| `flow.workspace.single` | `FLOW_WORKSPACE_SINGLE` | `false` | `true` serves only the seeded `system` workspace; workspaces can't be created or deleted. |

| Shape | `flow.security.enabled` | `flow.workspace.single` | Use for |
| --- | --- | --- | --- |
| The full product | `true` | `false` | Every product install: workspaces, sign-in, tokens and the webapp |
| A headless engine | `false` | `true` | An engine embedded in another product, which owns identity and tenancy |

> **Warning:** With `flow.security.enabled=false` there's no sign-in and every caller is an admin. Run that shape only for local development, or behind a route that only the embedding product can reach.

A secured install that no person signs in to takes its first credential from `flow.security.bootstrap-token`. See [Machine tokens](./machine-tokens).

## Send status events and traces

Core can send a CloudEvent for every workflow run and task run status change. It's off by default.

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `flow.events.sink.enabled` | `FLOW_EVENTS_SINK_ENABLED` | `false` | Send status events |
| `flow.events.sink.urls` | `FLOW_EVENTS_SINK_URLS` | blank | Receiver URLs, comma-separated |
| `flow.events.sink.destinations[0].url`, `.header-name`, `.header-value` | `FLOW_EVENTS_SINK_DESTINATIONS_0_URL`, and so on | header name `Authorization` | A receiver that authenticates with a request header |
| `flow.events.sink.payload` | `FLOW_EVENTS_SINK_PAYLOAD` | `thin` | `thin`: IDs, status, phase, labels and timings. `full`: the whole run, with secrets redacted. |
| `flow.events.sink.types`, `.statuses`, `.phases` | `FLOW_EVENTS_SINK_STATUSES`, and so on | blank (no filter) | Filters. `statuses=terminal` sends only ends; `phases=completed` is the true end of a run with finally tasks. |

A secret in a bare URL travels in the query string, where proxies and access logs record it. Use a destination with a header, and take the value from a Secret:

```yaml
env:
  - name: FLOW_EVENTS_SINK_ENABLED
    value: "true"
  - name: FLOW_EVENTS_SINK_DESTINATIONS_0_URL
    value: https://receiver.example.com/events
  - name: FLOW_EVENTS_SINK_DESTINATIONS_0_HEADER_VALUE
    valueFrom:
      secretKeyRef: { name: flow-core, key: events-sink-token }
```

Delivery is at least once. Every core instance sends from an outbox every 5 seconds, and a repeat delivery carries the same CloudEvent `id`, so treat a repeated `id` as a duplicate. After three failed attempts an event is marked dead. List dead events with `GET /api/v2/system/outbox` and resend them with `PUT /api/v2/system/outbox/replay`.

<!-- UNVERIFIED: flow.events.outbox.interval-ms (5000) is read in code but not declared in application.properties; not documented. -->

Core can also export its own request spans over OTLP:

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `management.tracing.export.enabled` | `MANAGEMENT_TRACING_EXPORT_ENABLED` | `false` | Export core's request spans |
| `management.opentelemetry.tracing.export.otlp.endpoint` | `MANAGEMENT_OPENTELEMETRY_TRACING_EXPORT_OTLP_ENDPOINT` | not set | The OTLP collector to send them to |

Core emits no run or task spans. Each task gets a `TRACEPARENT` derived from its run, so tasks that export their own spans land in one trace per run. On the dispatcher, `flow.dispatcher.ai.otel.endpoint` points `ai` task pods at a collector. Flow stores no traces.

## Set the task image

Catalogue tasks that name no image of their own run on the `task` settings group's `default.image`. At this release it's `boomerangio/task-flow:3.3.0`, built for amd64 and arm64. Change it in **Admin › Settings › Tasks** › **Default Image Path**, or with the API, for example to pull from a registry mirror:

```bash
curl -X PATCH https://flow.example.com/api/v2/settings \
  -H "Authorization: Bearer $FLOW_TOKEN" \
  -H "Content-Type: application/merge-patch+json" \
  -d '{"task": {"default.image": "registry.example.com/boomerangio/task-flow:3.3.0"}}'
```

A change applies to runs created after it; a run already created keeps its image.

- **On upgrade,** an install whose setting still held `boomerangio/task-flow:3.1.0` moves to 3.3.0 on first start. An image you chose is kept.
- **On arm64 nodes,** `task-flow:3.1.0` has no arm64 build: a task on it is held on `ErrImagePull` and fails after 60 seconds. Set a multi-arch tag, 3.3.0 or later.
- **Other images:** the Upload Artifact and Download Artifact tasks run the dispatcher's `flow.dispatcher.artifact.image`, also `task-flow:3.3.0`. AI tasks declare their own image.

Settings take effect without a restart. For example, a change to **Admin › Settings › Audit** › **Retention Days** reaches every core instance within about a minute.

<!-- UNVERIFIED: flow.audit.retention-interval-ms (60000) and the flow.watcher.* intervals are read in code but not declared in application.properties; not documented. -->

## Next steps

- [Sign-in](./sign-in): OpenID Connect or an authenticating proxy, and the first admin.
- [Machine tokens](./machine-tokens): the dispatcher's token and the bootstrap token.
- [Dispatcher](./dispatcher): executors, task pods and run workspaces.
- [Task logs](./task-logs): live and stored task logs.
- [Upgrading](./upgrading): moving a v3 install to v5.
- [Security](../architecture/security): how Flow authenticates and authorises callers.
- [Administer](../fundamentals/administer): the settings an admin changes while Flow runs.
