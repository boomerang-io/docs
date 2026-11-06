---
title: Configuration reference
order: 3
description: The properties and environment variables that configure Flow v5's core, webapp and dispatcher link, grouped by area, with their defaults.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Configuration reference

This page lists the properties and environment variables that configure a Flow v5 deployment, grouped by area, with their defaults. It's for operators who know what they need to set. For a step-by-step walkthrough, see [Configuring](./configuring).

Core and the dispatcher read properties, and an environment variable overrides any property: `flow.encrypt.secret` becomes `FLOW_ENCRYPT_SECRET`. The webapp reads only environment variables. Behaviour an admin tunes while Flow runs is a setting, not a property: see [Administer](../webapp/administer).

## Core

Set these on core. Core needs the first three to start; keep them in a Kubernetes Secret, as [Set the required configuration](./configuring#set-the-required-configuration) shows.

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `spring.mongodb.uri` | `SPRING_MONGODB_URI` | a `localhost` sample | MongoDB connection string. Always set it. |
| `flow.encrypt.secret` | `FLOW_ENCRYPT_SECRET` | blank | Half of the key Flow encrypts stored secrets with. Required. |
| `flow.encrypt.salt` | `FLOW_ENCRYPT_SALT` | blank | The other half of the key. Required. |
| `flow.mongo.collection.prefix` | `FLOW_MONGO_COLLECTION_PREFIX` | `flow` | The prefix on every collection name. A v3 upgrade keeps v3's value. |

## Webapp

The webapp takes these environment variables:

| Variable | Example | Meaning |
| --- | --- | --- |
| `CORE_SERVICE_INTERNAL_ORIGIN` | `http://flow-core:7700` | Core's address from the webapp's server. Unset, the webapp has no address for core. |
| `APP_ROOT` | `/apps/flow` | The base path. Keep `/apps/flow`: it's fixed when the image is built. |
| `PORT` | `3000` | The port the webapp listens on |
| `PRODUCT_SERVICE_ENV_URL` | `/api/v2` | The API address shown in copyable webhook and event URLs. A relative value uses the webapp's own host, so route `/api/v2/` there too, or give a full URL. |

## Dispatcher link

Set these on the dispatcher:

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `flow.engine.url` | `FLOW_ENGINE_URL` | `http://localhost:7700` | Core's base URL from the dispatcher, such as `http://flow-core:7700` |
| `flow.engine.dispatcher.token` | `FLOW_ENGINE_DISPATCHER_TOKEN` | blank | The token the dispatcher sends to core: a global machine token. See [Machine tokens](./machine-tokens). |
| `kube.namespace` | `KUBE_NAMESPACE` | blank | The namespace for task pods, claims and ConfigMaps. Blank uses the service account's namespace. |
| `dispatcher.executor` | `DISPATCHER_EXECUTOR` | `tekton` | `tekton` or `kube-jobs` |

Set these on core:

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `flow.dispatcher.auth.enabled` | `FLOW_DISPATCHER_AUTH_ENABLED` | `true` | Check the token on every `/dispatcher/v1/` call. Leave it at `true`: with it off, core checks nothing on the dispatcher routes. |
| `flow.queue.enabled` | `FLOW_QUEUE_ENABLED` | `true` | `false` stops handing out work, for maintenance. Dispatchers claim nothing new, and work in flight finishes or times out. |

The dispatcher's other properties, for executors, task pods, run workspaces and AI tasks, are on [Run the dispatcher](./dispatcher).

## Security and sign-in

Set these on core:

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `flow.activation-code` | `FLOW_ACTIVATION_CODE` | blank | The code the first admin enters on an empty install. At least 32 characters. See [Sign-in](./sign-in). |
| `flow.auth.oidc.issuer` | `FLOW_AUTH_OIDC_ISSUER` | blank | The OpenID Connect issuer, written into the **OIDC Issuer** setting while that setting is empty. See [Sign in with OpenID Connect](./sign-in#sign-in-with-openid-connect). |
| `flow.auth.oidc.client-id` | `FLOW_AUTH_OIDC_CLIENT_ID` | blank | The client ID, written into the **OIDC Client ID** setting while that setting is empty |
| `flow.security.admin-claim.name`, `.values`, `.trust-forwarded-token` | `FLOW_SECURITY_ADMIN_CLAIM_NAME`, and so on | empty, empty, `false` | The identity-provider claim that makes its holder an admin. See [Let your identity provider decide admins](./sign-in#let-your-identity-provider-decide-admins). |
| `flow.security.bootstrap-token` | `FLOW_SECURITY_BOOTSTRAP_TOKEN` | blank | A `bfg_` token with at least 32 more characters, registered at start as a global machine token. See [Machine tokens](./machine-tokens). |
| `flow.security.tokens.<name>.*` | `FLOW_SECURITY_TOKENS_<NAME>_*` | none | Narrower machine tokens declared in configuration. See [Machine tokens](./machine-tokens). |

`flow.security.enabled` is under [Deployment shape](#deployment-shape).

## Artifacts

Set these on core. The store is off by default.

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
| `flow.artifacts.link-ttl-minutes` | `FLOW_ARTIFACTS_LINK_TTL_MINUTES` | `15` | How long the signed links task pods transfer files through stay valid |

## Events and tracing

Set these on core. Status events are off by default.

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `flow.events.sink.enabled` | `FLOW_EVENTS_SINK_ENABLED` | `false` | Send status events |
| `flow.events.sink.urls` | `FLOW_EVENTS_SINK_URLS` | blank | Receiver URLs, comma-separated |
| `flow.events.sink.destinations[0].url`, `.header-name`, `.header-value` | `FLOW_EVENTS_SINK_DESTINATIONS_0_URL`, and so on | header name `Authorization` | A receiver that authenticates with a request header |
| `flow.events.sink.payload` | `FLOW_EVENTS_SINK_PAYLOAD` | `thin` | `thin`: IDs, status, phase, labels and timings. `full`: the whole run, with secrets redacted. |
| `flow.events.sink.types`, `.statuses`, `.phases` | `FLOW_EVENTS_SINK_STATUSES`, and so on | blank (no filter) | Filters. `statuses=terminal` sends only ends; `phases=completed` is the true end of a run with finally tasks. |

Core's own request spans, over OTLP:

| Property | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `management.tracing.export.enabled` | `MANAGEMENT_TRACING_EXPORT_ENABLED` | `false` | Export core's request spans |
| `management.opentelemetry.tracing.export.otlp.endpoint` | `MANAGEMENT_OPENTELEMETRY_TRACING_EXPORT_OTLP_ENDPOINT` | not set | The OTLP collector to send them to |

## Deployment shape

Two properties on core set the shape:

| Property | Environment variable | Default | Effect |
| --- | --- | --- | --- |
| `flow.security.enabled` | `FLOW_SECURITY_ENABLED` | `true` | Authentication and authorisation, together. `false` runs every request as an admin. |
| `flow.workspace.single` | `FLOW_WORKSPACE_SINGLE` | `false` | `true` serves only the seeded `system` workspace; workspaces can't be created or deleted. |

[Choose a deployment shape](./configuring#choose-a-deployment-shape) says which combination to run.

## Next steps

- [Configuring](./configuring): set up each image step by step.
- [Sign-in and the first admin](./sign-in): sign-in modes, the activation code and the admin claim.
- [Machine tokens](./machine-tokens): the bootstrap token and tokens declared in configuration.
- [Run the dispatcher](./dispatcher): executors, task pods, run workspaces and AI tasks.
- [Administer](../webapp/administer): the settings an admin changes while Flow runs.
