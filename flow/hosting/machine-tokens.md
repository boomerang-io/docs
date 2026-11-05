---
title: Machine tokens
order: 4
description: Give services and dispatchers their own Flow credentials, declare them in configuration, and rotate them without a gap.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. -->
<!-- UI labels are source-verified at the tag (client-web), not seen in a running webapp. -->

# Machine tokens

A machine token lets a service, a script or a dispatcher call Flow without a person signing in. This page is for operators: the bootstrap token, tokens declared in configuration, the dispatcher's token, and rotation.

## Before you start

- You can set environment variables on service-core and its dispatchers, and restart them.
- You have somewhere to keep raw tokens, such as a Kubernetes Secret.
- You have `openssl`, and `sha256sum` (on macOS, `shasum -a 256`).

## Which token kinds are there?

Flow tells token kinds apart by their prefix. It stores only each token's SHA-256 hash, and shows the raw value once, when the token is created.

| Kind | Prefix | For | Permissions come from |
| --- | --- | --- | --- |
| `session` | `bfs_` | A signed-in person | The person's user type and workspace memberships, when the session starts. Only sign-in makes one. |
| `user` | `bfu_` | A person's long-lived personal token | The person's workspace roles, copied when the token is created |
| `key` | `bfk_` | A service, an AI agent or a workflow, on one workspace | The permissions chosen when the token is created, granted on its workspace |
| `global` | `bfg_` | A platform admin, an automation or a dispatcher | One global grant: the permissions chosen when the token is created |

A machine token can also carry an actor kind: `SERVICE`, `AGENT` or `WORKFLOW`. The dispatcher protocol accepts only a `global` token that has one. `POST /api/v2/token` refuses an actor kind that doesn't fit the token kind with `400 TOKEN_INVALID_ACTOR`: a `global` token takes `SERVICE`, `AGENT` or none, a `key` token any of the three or none, and a `user` token none.

Flow refuses a bearer that doesn't start with `bfg_`, `bfk_`, `bfu_` or `bfs_` before it looks anything up, so v3 `bft_` and `bfw_` tokens no longer work. Each instance caches validated tokens for 60 seconds, so a revoked token can keep working on another instance for up to 60 seconds.

**Admin › Tokens** lists global tokens, including the bootstrap token and declared tokens. Its **Actor** column names each token's actor kind, or shows `---` for none. To create a global token there, select **Create token**. Its **Actor** choice offers:

- **Service**, the default: "A system, script or dispatcher";
- **Agent**: "An AI agent";
- **None**: "A person's token", with no actor kind.

## Use the bootstrap token

The bootstrap token, `flow.security.bootstrap-token` (`FLOW_SECURITY_BOOTSTRAP_TOKEN`), is a global `**/**` token with actor kind `SERVICE`, registered at start under the id `bootstrap-token`. It is full admin. Use it for:

- a secured install where no person signs in;
- first setup through the API before anyone signs in: creating workspaces, minting narrower tokens with `POST /api/v2/token`, or [naming the first admin](./sign-in#name-the-first-admin-with-the-bootstrap-token).

It isn't for people: the webapp can't sign in with it. It never counts as a user, so it doesn't activate the install.

1. Generate it. The value must be `bfg_` followed by at least 32 characters:

   ```bash
   BOOTSTRAP="bfg_$(openssl rand -hex 32)"
   ```

2. Store it in a secret and set `FLOW_SECURITY_BOOTSTRAP_TOKEN` from it on service-core.
3. Restart service-core. The log shows `Registered the bootstrap token (new).`
4. Check it. `FLOW_API` is the address your front door routes `/api/v2` to:

   ```bash
   curl -H "Authorization: Bearer $BOOTSTRAP" "$FLOW_API/api/v2/workspace/query"
   ```

The token works when the call answers `200`. If service-core stops at start with `flow.security.bootstrap-token must be bfg_ followed by at least 32 characters.`, fix the value and restart. Flow registers the token whether or not security is on.

**Rotating it:** change the value and restart. The old value stops working at once on the instance that restarted, and on the others within 60 seconds. There's only one bootstrap token, so a client that uses it is refused until it has the new value. Give a client that needs a gapless rotation a declared token instead.

**Retiring it:** clear `FLOW_SECURITY_BOOTSTRAP_TOKEN` on every service-core instance and restart them. At its next start, an instance with the property blank deletes the stored token and logs `Revoked the bootstrap token: flow.security.bootstrap-token is no longer set.` The old value then answers `401 AUTH_REQUIRED` on that instance at once, and on the others within 60 seconds. An instance that starts with the value still set registers it again.

## Declare machine tokens in configuration

`flow.security.tokens.<name>.*` declares narrower global machine tokens, which Flow registers at start. A hosted install then needs no minting step. In environment variables, the name is part of the variable:

| Variable | Required | Meaning |
| --- | --- | --- |
| `FLOW_SECURITY_TOKENS_<NAME>_HASH` | One of `_HASH` or `_VALUE` | The lowercase hex SHA-256 of the raw token. The environment never holds the token itself. |
| `FLOW_SECURITY_TOKENS_<NAME>_VALUE` | One of `_HASH` or `_VALUE` | The raw token: `bfg_` followed by at least 32 characters |
| `FLOW_SECURITY_TOKENS_<NAME>_PERMISSIONS` | No | Comma-separated permissions, such as `workflow/read,workflowrun/action`. Together they form the token's global grant. Without any, the token holds no grant and reaches only the dispatcher protocol. |
| `FLOW_SECURITY_TOKENS_<NAME>_ACTORKIND` | No | `SERVICE` (the default), `AGENT` or `WORKFLOW` |
| `FLOW_SECURITY_TOKENS_<NAME>_DESCRIPTION` | No | Shown in **Admin › Tokens** |
| `FLOW_SECURITY_TOKENS_<NAME>_EXPIRY` | No | An ISO-8601 instant, such as `2027-06-30T00:00:00Z`, or a date, such as `2027-06-30`, meaning the end of that day in UTC |

A name is 1 to 63 lowercase letters and digits. It can't hold a hyphen or an underscore, because an underscore in a variable name becomes a dot. `bootstrap` is reserved. Flow lowercases a name it reads from a variable; in a properties file, write the name in lowercase.

### Declare a token

1. Generate the raw token:

   ```bash
   RAW="bfg_$(openssl rand -hex 32)"
   ```

   The raw token must start with `bfg_`.
2. Hash it:

   ```bash
   printf %s "$RAW" | sha256sum | cut -d' ' -f1
   ```

   Use `printf %s`, not `echo`: a trailing newline changes the hash.
3. Set the entry on service-core:

   ```bash
   FLOW_SECURITY_TOKENS_REPORTING_HASH=<the 64-character hash>
   FLOW_SECURITY_TOKENS_REPORTING_PERMISSIONS=workflow/read,workflowrun/read
   FLOW_SECURITY_TOKENS_REPORTING_DESCRIPTION=Nightly report job
   ```

4. Restart service-core. The log shows `Registered the declared token 'reporting' (new).`
5. Give the client `$RAW`. It sends `Authorization: Bearer <token>`.

The token works when `reporting` appears in **Admin › Tokens** and the client's calls succeed.

### What service-core does with entries

- **A bad entry stops the start**, with a message naming the entry, such as `flow.security.tokens.reporting.permissions must each be <resource>/<action>, for example workspace/read`. Fix the entry and restart.
- **An unchanged entry** writes nothing on restart. A changed hash or grant replaces the stored token, and the old hash stops working.
- **Removing an entry** revokes its token at the next start. The log shows `Revoked the declared token 'reporting': it is no longer configured.`
- **Two entries can be valid at once**, which is how a token rotates without a gap. Two configured tokens holding the same value stop the start, whether both are entries or one is the bootstrap token.
- **A configured token takes over a minted one.** If a token created in **Admin › Tokens** or with `POST /api/v2/token` already holds an entry's value, service-core deletes the minted token at start and logs a warning, such as `flow.security.tokens.reporting took over the value of the token 'nightly' (<id>), which is deleted.` The client keeps working, with the entry's permissions and actor kind. The bootstrap token takes over a value the same way. This is how to move a minted token into configuration without handing out a new one.
- **A value two stored tokens hold** authenticates as neither. A request with it answers `401`, and service-core logs `Refused a token whose value more than one stored token holds.`
- **A past expiry** doesn't stop the start. The token is stored and refused like any expired token.
- **Every instance must carry the same entries.** Each instance revokes, at its start, the declared tokens its own configuration doesn't name.
- **The token API can't delete a declared token.** `DELETE /api/v2/token/declared-token:<name>` answers `409` with `TOKEN_DECLARED`: "This token is declared in flow.security.tokens and cannot be changed through the API. Remove its entry from the configuration to revoke it."

Declared tokens are registered whether or not security is on.

## Write permissions

A permission is `<resource>/<action>`, in lowercase. `**` is a wildcard on either side.

- **Resources:** `system`, `workflow`, `workflowrun`, `workflowtemplate`, `taskrun`, `task`, `action`, `user`, `workspace`, `token`, `parameter`, `schedule`, `insights`, `integration`, `webhook`.
- **Actions:** `read`, `write`, `action`, `delete`.

For example: `workflow/read`, `workflowrun/action`, `workflow/**` and `**/read`.

Declared tokens and `POST /api/v2/token` run the same check. When it fails, the API answers `400 TOKEN_INVALID_PERMISSION`. That error's message describes a three-part format with uppercase actions, which Flow doesn't accept. Write `<resource>/<action>`.

## Give the dispatcher its token

Flow's Kubernetes dispatcher sends `flow.engine.dispatcher.token` (`FLOW_ENGINE_DISPATCHER_TOKEN`) as a bearer token on every call to service-core. service-core accepts it only if it is a stored, unexpired `global` token with an actor kind. The token needs no permissions: the dispatcher protocol doesn't check them.

Declare the dispatcher's token with no permissions. Its actor kind defaults to `SERVICE`:

```bash
# On service-core
FLOW_SECURITY_TOKENS_DISPATCHER_HASH=<the hash of the dispatcher's raw token>
FLOW_SECURITY_TOKENS_DISPATCHER_ACTORKIND=SERVICE

# On the dispatcher
FLOW_ENGINE_DISPATCHER_TOKEN=<the raw token>
```

Without permissions, the token reaches only the dispatcher protocol: a REST API route that needs a permission answers it with `403`.

To create the token in **Admin › Tokens** instead, keep **Actor** at **Service**. The form also asks for permissions; the dispatcher doesn't use them, so choose a narrow one, such as `workspace/read`. Through the API, send `POST /api/v2/token` with `"type": "global"`, `"actorKind": "SERVICE"`, a `name` and `permissions`, using a credential that holds a global grant, such as the bootstrap token. Either way, the raw token is shown once, when it's created.

| Symptom | Cause | Fix |
| --- | --- | --- |
| The dispatcher logs `Dispatcher registration attempt 1 failed, retrying in …` with a `401`, and keeps retrying. No task runs start. | The token is missing, wrong or expired, or has no actor kind, such as a token created with **Actor** **None** | Check `FLOW_ENGINE_DISPATCHER_TOKEN` against the token, then restart the dispatcher |

The dispatcher has its token when its log shows `Dispatcher <name> (<host>) registered as <id> for task types […]`.

`flow.dispatcher.auth.enabled=false` on service-core turns the check off. Use it for local development only.

## Rotate a token without a gap

Declare the new token beside the old one, move the client, then remove the old one. This example rotates the dispatcher's token.

1. Generate a new raw token and its hash, as in [Declare a token](#declare-a-token).
2. Add a second entry with a new name and the same actor kind, and the same permissions if the old entry has any:

   ```bash
   FLOW_SECURITY_TOKENS_DISPATCHER2_HASH=<the new hash>
   FLOW_SECURITY_TOKENS_DISPATCHER2_ACTORKIND=SERVICE
   ```

3. Restart every service-core instance. The log shows `Registered the declared token 'dispatcher2' (new).` Both tokens now work.
4. Set `FLOW_ENGINE_DISPATCHER_TOKEN` to the new raw token and restart the dispatcher. Its log shows `registered as <id>`.
5. Remove the `FLOW_SECURITY_TOKENS_DISPATCHER_*` variables and restart every service-core instance. The log shows `Revoked the declared token 'dispatcher': it is no longer configured.`

The rotation is done when the dispatcher keeps claiming work and the old token is refused with `401`. Next time, rotate back to the name `dispatcher`.

Changing an entry's hash in place also rotates the token, but the old token stops working at the restart, before the client has the new one. For a token created in **Admin › Tokens** or with `POST /api/v2/token`, create the new token, move the client, then delete the old one.

## Next steps

- [Sign-in and the first admin](./sign-in): the activation code, Auto-Create Users and the admin claim.
- [Security](../architecture/security): token kinds, roles and the dispatcher protocol inside Flow.
- [Administer](../fundamentals/administer): **Admin › Tokens** and the other admin pages.
- [Configuring](./configuring): the other properties service-core reads.
