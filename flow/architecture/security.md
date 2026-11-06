---
title: Security
order: 5
description: How Flow authenticates callers, authorises requests, protects secrets, isolates tasks and keeps an audit trail.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->

# Security

This page explains how Flow authenticates callers, authorises requests and protects data; the hosting pages cover configuration.

## Where are the trust boundaries?

The browser talks only to the webapp's server, which calls core (`flow-service-core`) for it. Core's three route prefixes are routing boundaries, not credentials:

- `/api/v2`, the public API. Route it from your front door.
- `/dispatcher/v1`, the dispatcher protocol, which needs a global machine token. Route it only for a dispatcher outside core's network.
- `/internal/v1`, sign-in for the webapp's server. Never route it from outside.

## How do people sign in?

Sign-in has three modes, set up as [Configure sign-in](../hosting/sign-in) describes:

- `oidc`: the webapp's server runs OpenID Connect sign-in, once **OIDC Issuer** and **OIDC Client ID** are set.
- `proxy`: an authenticating proxy forwards the user's identity. Make it core's only way in.
- `none`: security is off.

After sign-in, the browser holds only a 24-hour session token in the httpOnly `flow_session` cookie.

- **The first admin.** On an empty install, the activation code (`flow.activation-code`) makes the first admin. It has no default and must be at least 32 characters. Once a user exists, every code is refused.
- **An admin claim.** `flow.security.admin-claim.*` names an identity-provider claim and the values that make its holder an admin. Each sign-in that reads it promotes or demotes the user and, on an empty install, replaces the activation code.
- **Auto-Create Users.** This setting, on by default, creates an account at first sign-in. Off, a person who isn't a user yet signs in only if an admin has added them to a workspace or the admin claim admits them. Existing users are unaffected.

## Tokens

| Kind | Prefix | For | Grants |
| --- | --- | --- | --- |
| `session` | `bfs_` | A signed-in person | The user's type and workspace roles |
| `user` | `bfu_` | A person, long-lived | The user's workspace roles, copied at creation |
| `key` | `bfk_` | A service, AI agent or workflow | Workspace grants only |
| `global` | `bfg_` | An administrator or a dispatcher | One global grant |

- **The bootstrap token** (`flow.security.bootstrap-token`) is a global `**/**` token for an install where no person signs in. Keep it in a Kubernetes Secret. Rotate it by changing the value and restarting; clearing it revokes the stored token at the next start.
- **Declared tokens** (`flow.security.tokens.<name>.*`) are narrower global machine tokens set in configuration. Every core instance must carry the same entries, because each revokes, at its start, the declared tokens its own configuration doesn't name.
- **The dispatcher protocol** admits only a global token with an actor kind, and checks no permission.

A revoke takes up to 60 seconds to reach every instance. [Machine tokens](../hosting/machine-tokens) covers minting and rotation.

## What can each role do?

A permission is `<resource>/<action>`, with `**` as a wildcard. The actions are `read`, `write`, `action` (run workflows and decide actions) and `delete`.

| Workspace role | Permissions | Within the workspace |
| --- | --- | --- |
| `owner` | `**/**` | Everything, including deletes |
| `editor` | `**/read`, `**/write`, `**/action` | Create, change and run, not delete |
| `reader` | `**/read` | View only |

A platform `admin` holds a global `**/**` grant, and an `operator` holds global `**/read`, `**/write` and `**/action`. Only these two types are admins. Every other type, `auditor` and `author` included, is a plain user: it holds only its own profile and its workspace roles. **Admin › Users** shows `auditor` and `author` as **User**.

Each request is checked twice. The route must admit the token's kind (else `401 AUTH_REQUIRED`) and find a matching permission (else HTTP 403); a route without a rule is denied. Then a caller without a global grant must reach the object through its workspace, or Flow usually answers as if the object were missing.

## What happens with security off?

`flow.security.enabled=false` turns off sign-in and permission checks: every request runs as a built-in admin, audited as `system`. It's only for a headless engine embedded in another application, alongside `flow.workspace.single=true`. Never use it on a shared install: anyone who reaches core is an admin.

## How are secrets protected?

Secured parameters and secured settings are encrypted at rest with AES-256-GCM, under `flow.encrypt.secret` and `flow.encrypt.salt`, required on every install. A set secret reads as `*****`; writing `*****` keeps it and `""` clears it. Secrets never reach a service log, and the audit trail names a changed secret, never its value.

> [!WARNING]
> A secured parameter reaches its task container as a plain environment variable, `PARAM_<NAME>`, and on Tekton it's in the TaskRun too. Anyone who can read pods or TaskRuns in the dispatcher's namespace can read it. The task image is inside your trust boundary: pass secrets only to images you trust.

## How are integrations verified?

Slack and GitHub can't hold a Flow token, so Flow checks their signatures. A Slack command, interaction or event must be signed with the **Slack Signing Secret** and be at most 5 minutes old, and a GitHub App delivery with the **GitHub Webhook Secret**. While a secret is unset, Flow refuses that service's requests.

## How are tasks isolated?

Flow's Kubernetes dispatcher runs each task as its own pod. `dispatcher.tasks.runtimeClassName` sets a RuntimeClass, such as gVisor or Kata Containers, on every task pod a dispatcher runs. For a second isolation tier, run a second dispatcher. Flow's service images run as non-root uid 10001, and the webapp as uid 65532, all in group 0. A task container runs as its image's user.

## What does the audit trail record?

Each audited attempt records the actor, workspace, action, resource and outcome (`SUCCESS`, `FAILED` or `DENIED`), with the source IP address and user agent, never request content. Writes to workspaces, workflows, schedules, tasks, parameters, settings and tokens are audited, as is each run's start and end. Reading **Admin › Audit** needs a global `system/read` grant. **Retention Days** keeps events 365 days by default, at least 60; a change applies within about a minute.

## How long is data kept?

- **Runs:** finished runs older than **Activity Retention (days)** (365 by default, at least 60) are purged hourly with their task runs, actions, run-scoped artifacts and logs. No value turns it off.
- **Artifacts:** run-scoped ones expire after 30 days by default, 90 at most. Workflow-scoped ones stay until replaced or deleted.
- **Task logs:** kept for 7 days by default.

[Runs](../fundamentals/runs) has the detail.

## Report a vulnerability

Report a security problem privately through [GitHub private vulnerability reporting](https://github.com/boomerang-io/flow/security/advisories/new), never in a public issue.

## Next steps

- [Parameters](../fundamentals/parameters): how secured parameters resolve.
- [Administer](../webapp/administer): the audit trail and settings in **Admin**.
