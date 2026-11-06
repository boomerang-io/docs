---
title: Upgrade from v3
order: 6
description: Upgrade a Flow v3 installation to v5 in place.
---

<!-- Written against flow.service.workflow 5.0.0-beta.39 (3960b0a79). v3 chart facts are from the charts repository: bmrg-flow 4.14.3 (the last v3 chart) and 5.5.4 (the last released chart). The v5 chart facts are from charts#92 (bmrg-flow 6.0.0). -->

# Upgrade from v3

This page takes a Flow v3 installation to v5 in place. It's for operators. The upgrade is forward-only: a failed upgrade is recovered from the backup, not rolled back. To roll out a later v5 release on a v5 install, see [Upgrade between v5 releases](./rolling-upgrades).

A v3 upgrade runs in this order:

1. [Check that v5 can upgrade the database](#check-that-v5-can-upgrade-this-database).
2. [Back up](#back-up) the database and [the v3 encryption pair](#find-your-v3-encryption-pair).
3. [Resolve duplicate emails](#check-for-duplicate-emails).
4. [Stop v3](#stop-v3), every service, and take the final backup.
5. [Configure v5](#configure-v5).
6. [Start v5](#start-v5) at one replica, then scale out.
7. [Verify](#verify), then finish [after the upgrade](#after-the-upgrade).

## Before you start

You need:

- **A v3 install from bmrg-flow 4.13.5 or later** (flow-loader 0.5.9 or later). Upgrade an older v3 install to one of those charts first.
- **Access** to the namespace with `kubectl`, and to the v3 MongoDB database with `mongosh`, `mongodump` and `mongorestore`.
- **The three v5 images at one tag:** `flow-service-core`, `flow-service-dispatcher` and `flow-client-web`. Pin an exact tag, such as `5.0.0-beta.39`. Use 5.0.0-beta.39 or later: 5.0.0-beta.38 refuses a database from the v3 charts 4.13.5 to 4.14.3. [Configuring](./configuring) lists what each needs.
- **A dispatcher plan.** v3 had no dispatcher. v5 runs every task through one, usually Flow's Kubernetes dispatcher: see [Dispatcher](./dispatcher).
- **A maintenance window.** Flow is down from the moment you stop v3 until v5's core reports ready. A 16 MB v3 database migrates in under a minute; a large run history takes longer.

The queries on this page use the default collection prefix, `flow`. If your v3 install used another prefix, replace `flow_` in each collection name.

### Check that v5 can upgrade this database

v5 upgrades exactly two starting points: an empty database and a v3 database built by bmrg-flow 4.13.5 or later. Those charts ship flow-loader 0.5.9, whose last changeset is `111`. v5 refuses an older v3 database, a v4 database, or one a 5.0 beta migrated, before it writes anything, and it refuses again on every start. Run these against the v3 database:

```javascript
db.flow_sys_changelog_flow.countDocuments({ changeId: "111" })  // must not be 0: flow-loader 0.5.9 or later ran
db.flow_sys_changelog_flow.countDocuments({ changeId: "4000" }) // must be 0: never migrated to v4
db.flow_sys_changelog_loader.countDocuments()                    // must be 0: never migrated by a 5.0 beta
```

| Result | Meaning | What to do |
| --- | --- | --- |
| `111` is missing | A v3 install older than bmrg-flow 4.13.5 | Upgrade v3 to bmrg-flow 4.13.5 or later (flow-loader 0.5.9 or later), then run the checks again. |
| `4000` is found | A v4 database | Restore the v3 database it came from. v5 can't upgrade v4. |
| `flow_sys_changelog_loader` has documents | A 5.0 beta migrated it | Restore the v3 database it came from, or start from an empty database. |

### Find the workflows that read CloudEvent inputs

v3 filled a workflow property from a CloudEvent with the property's `jsonPath`, or from a `properties` object in the event's data. v5 does neither: the run receives the event's attributes as its `event` param and its data as `data`. Upgraded, such a workflow runs with its properties' defaults, and no error. List them now:

```javascript
db.flow_workflows.find({"properties.jsonPath": {$nin: [null, ""]}}, {name: 1})
```

After the upgrade, change where each one reads that property to `$(params.data.<path>)`.

## Back up

The upgrade drops each v3 collection once it has migrated it. Back up the database, and the v3 chart's Secret ([next section](#find-your-v3-encryption-pair)). Take the final database backup after you [stop v3](#stop-v3), so it holds every write.

```bash
mongodump --uri="mongodb://<user>:<password>@<host>:27017/<database>" \
  --gzip --archive=flow-v3.archive.gz
```

To restore, empty the database first, then restore into it:

```bash
mongosh "mongodb://<user>:<password>@<host>:27017/<database>" --eval 'db.dropDatabase()'
mongorestore --uri="mongodb://<user>:<password>@<host>:27017/<database>" \
  --gzip --archive=flow-v3.archive.gz
```

`mongorestore --drop` isn't enough on its own. It drops only the collections in the archive, so the ones v5 created survive, its migration log among them, and the next v5 start skips every step that log records.

The archive is also the only full copy of v3's run history. The upgrade doesn't carry v3's task runs over, and v5 purges finished runs older than 365 days within hours of its first start (see [Expect the run purge](#expect-the-run-purge)). Keep the archive for as long as you need that history. For a readable copy of the runs:

```bash
mongoexport --uri="mongodb://<user>:<password>@<host>:27017/<database>" \
  --collection=flow_workflows_activity --out=flow-v3-runs.json
```

## Find your v3 encryption pair

v3 encrypted its secured settings, the Slack and GitHub credentials, with the pair `mongo.encrypt.secret` and `mongo.encrypt.salt`. v5 reads that pair once, on its first start, to decrypt those values and re-encrypt them under its own key.

Since August 2020 the v3 Helm chart generated a random 16-character secret and salt at install. It kept them in the release's Secret as `FLOW_ENCRYPT_SECRET` and `FLOW_ENCRYPT_SALT`, reused them on every upgrade, and passed them to the workflow service as `-Dmongo.encrypt.secret` and `-Dmongo.encrypt.salt`. The Secret is named `<general.namePrefix>-secrets`, which is `bmrg-flow-secrets` by default.

```bash
kubectl get secrets -n <namespace>
kubectl get secret bmrg-flow-secrets -n <namespace> -o jsonpath='{.data.FLOW_ENCRYPT_SECRET}' | base64 -d
kubectl get secret bmrg-flow-secrets -n <namespace> -o jsonpath='{.data.FLOW_ENCRYPT_SALT}' | base64 -d
```

Then back the Secret up:

```bash
kubectl get secret bmrg-flow-secrets -n <namespace> -o yaml > bmrg-flow-secrets.yaml
```

> **Warning:** Back up the Secret before you uninstall v3. `helm uninstall` deletes it, and with it the only copy of the pair. The file holds the key, so store it as you would a password.

- **Not deployed with the chart?** Read `mongo.encrypt.secret` and `mongo.encrypt.salt` from your v3 workflow service's configuration. A v3 install that never set them holds no encrypted values.
- **Secret gone?** Look for it in a cluster backup, such as Velero. If the pair is lost for good, see [Upgrade without v3's pair](#upgrade-without-v3s-pair).

## Check for duplicate emails

Every user needs a distinct email. The upgrade never deletes or merges an account, so two users with exactly the same email stop it: the unique `email_unique` index can't be built, core fails to start, and it fails again on every start until you resolve them.

Two emails that differ only by case, such as `Ada@example.com` and `ada@example.com`, don't stop the upgrade. Flow lower-cases every other email, leaves each such group exactly as it is, and logs it at `ERROR`. Sign-in doesn't find a mixed-case account in a group until you resolve it.

Run both queries against the v3 database. On a clean database, both return nothing.

```javascript
// Exact duplicates: these stop the upgrade
db.flow_users.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 }, ids: { $push: "$_id" } } },
  { $match: { count: { $gt: 1 } } }
])

// Case variants: these upgrade, but sign-in can't find the mixed-case accounts
db.flow_users.aggregate([
  { $match: { email: { $type: "string" } } },
  { $group: { _id: { $toLower: "$email" }, emails: { $addToSet: "$email" }, ids: { $push: "$_id" } } },
  { $match: { "emails.1": { $exists: true } } }
])
```

A group with `_id: null` in the first result is users with no email. They collide too.

### Resolve a duplicate

Flow has no merge tool. Resolve each group in the v3 database, before the upgrade:

1. Pick the account to keep, usually the one with the latest `lastLoginDate`.
2. Copy the other account's team memberships to it. v3 keeps them in the user's `flowTeams` list:

   ```javascript
   db.flow_users.updateOne(
     { _id: <id to keep> },
     { $addToSet: { flowTeams: { $each: [ <team ids from the other account> ] } } }
   )
   ```

3. Give the other account an address that's unique and that nobody signs in with:

   ```javascript
   db.flow_users.updateOne({ _id: <other id> }, { $set: { email: "ada.duplicate@example.invalid" } })
   ```

4. Run both queries again. Resolve until they return nothing.

Use each `_id` exactly as the query printed it. Anything else the re-addressed account owns stays with it.

### When duplicates stop the upgrade

When an exact duplicate stops the upgrade, core logs a warning and then the failure:

```text
1 email value(s) are shared by more than one user; email_unique cannot be built until an operator resolves them
Could not create UNIQUE index email_unique on flow_users — a duplicate survived the dedupe step that must precede this call (<MongoDB error>)
```

Each group that differs only by case, and each exact duplicate before the failure, logs this at `ERROR`:

```text
users.email case collision on 'ada@example.com' — 2 accounts share this address once lower-cased and have therefore been LEFT UNCHANGED (mixed case, and so unreachable by the exact-match lookup) rather than merged or deleted. This unit does not run again: remove or re-address the duplicate account, then lower-case the surviving email by hand. Colliding _id -> email: <id> -> 'Ada@example.com', <id> -> 'ada@example.com'
```

To resolve a case group after the upgrade, re-address the duplicate as in step 3, then lower-case the survivor by hand. The step that lower-cases emails doesn't run again.

```javascript
db.flow_users.updateOne({ _id: <id to keep> }, { $set: { email: "ada@example.com" } })
```

## Stop v3

Stop every v3 service before v5's core starts, and keep them stopped. v3 and v5 never run together. Early in the upgrade, Flow renames `teams` to `workspaces` and drops collections v3 still uses, so a v3 service left running fails mid-request or writes into collections that no longer exist.

1. Let running workflows finish, or cancel them. The upgrade carries no task runs over, so a v3 run cut off part way can't resume in v5.
2. Scale every v3 deployment to zero, including every replica. With the chart's default names:

   ```bash
   kubectl scale deployment -n <namespace> --replicas=0 \
     bmrg-flow-services-workflow bmrg-flow-services-controller \
     bmrg-flow-services-listener bmrg-flow-apps-flow
   kubectl get deployments,pods -n <namespace>
   ```

   Every v3 deployment shows `0/0`, and no v3 pod remains.
3. Take the final [backup](#back-up).
4. Remove the v3 loader Job and the `flow-service-loader` image from your deployment. Don't run `helm upgrade` with the v3 chart again: its pre-upgrade hook runs the v3 loader against the database.

## Configure v5

Configure the three v5 images as [Configuring](./configuring) describes. Then apply these changes. Each row is a v3 (or 5.0 beta) setting and what replaces it.

| Was | Now | What to do |
| --- | --- | --- |
| The `flow-service-loader` Job and image | None: `service-core` migrates the database as it starts | Remove them. One tag builds `flow-service-core`, `flow-service-dispatcher` and `flow-client-web`. |
| `JAVA_OPTS`, and the chart's `sh -c java …` command | `JDK_JAVA_OPTIONS` | Move JVM flags. The Java images have no shell, package manager or `keytool`, and run as uid 10001 in group 0. |
| `keytool -import` at container start | A mounted truststore, named with `-Djavax.net.ssl.trustStore=…` in `JDK_JAVA_OPTIONS` | Mount a truststore that holds your internal CA. |
| `spring.data.mongodb.uri` | `spring.mongodb.uri` (`SPRING_MONGODB_URI`) | Point it at the v3 database. v5 doesn't read the old name. |
| `flow.mongo.collection.prefix` | The same property (`FLOW_MONGO_COLLECTION_PREFIX`), default `flow` | Keep v3's value. The v3 chart derived it from `general.namePrefix`: `bmrg-flow` gives `flow`. |
| `mongo.encrypt.secret`, `mongo.encrypt.salt`: v3's key | v3's pair only, read once by the upgrade. Defaults to `FLOW_ENCRYPT_SECRET` and `FLOW_ENCRYPT_SALT`; `MONGO_ENCRYPT_SECRET` and `MONGO_ENCRYPT_SALT` override it. | See [Set the encryption keys](#set-the-encryption-keys). |
| None | `flow.encrypt.secret`, `flow.encrypt.salt` (`FLOW_ENCRYPT_SECRET`, `FLOW_ENCRYPT_SALT`): v5's key, required on every install | Keep v3's Secret, or set a new pair. |
| `boomerang.otc` (`FLOW_OTC`) | `flow.activation-code` (`FLOW_ACTIVATION_CODE`): at least 32 characters, no default. The built-in `test` default is gone. | Set `FLOW_ACTIVATION_CODE`, or nothing, and remove `FLOW_OTC`. See below. |
| `flow.mode` (`FLOW_MODE`, 5.0 betas) | `flow.security.enabled` (default `true`) and `flow.workspace.single` (default `false`) | Remove `FLOW_MODE` from every deployment. A product install keeps both defaults. |
| None | `flow.security.bootstrap-token` (`FLOW_SECURITY_BOOTSTRAP_TOKEN`) | Optional: a `bfg_` token with at least 32 more characters, registered at start as a global machine token. The dispatcher can use it. Clearing it later revokes the stored token at the next start. |
| None | `flow.security.tokens.<name>.*` | Optional: narrower machine tokens declared in configuration. Give every core instance the same entries: each revokes, at its start, the declared tokens its own configuration doesn't name. See [Machine tokens](./machine-tokens). |
| `flow.uniquenames.enabled` | Gone | Remove it. |
| `max.workflow.storage`, `max.workflowrun.storage` (the `quotas` settings) | `max.workspace.storage`, carried from `max.workflowrun.storage`; per workspace, `maxWorkspaceStorage` | Nothing: the upgrade carries the value. |
| The `slack.installURL` setting | No longer read | Nothing. |
| `flow.engine.service.host` (dispatcher, 5.0 betas) | `flow.engine.url` (`FLOW_ENGINE_URL`), such as `http://service-core:7700`; default `http://localhost:7700` | Set it on the dispatcher, with the scheme and port. |
| None | `flow.engine.dispatcher.token` (`FLOW_ENGINE_DISPATCHER_TOKEN`) on the dispatcher | Set a global machine token, such as the bootstrap token. See [Machine tokens](./machine-tokens). |
| `flow.dispatcher.ai.image` (dispatcher) | `flow.dispatcher.ai.image-prefixes` (default `boomerangio/task-ai`) | Each `ai` revision names its own image, which must start with a listed prefix or the task is refused with `ImageNotAllowed`. `flow.dispatcher.ai.endpoint` and `flow.dispatcher.ai.token` reach every `ai` pod as `OPENAI_BASE_URL` and `OPENAI_API_KEY`. |
| `kube.workflow.storage.*` (dispatcher) | Gone | Remove them. Run workspace defaults are `kube.workspace.storage.*`. |
| The v3 chart's other properties: `controller.service.host`, `kube.worker.*`, `eventing.*`, `boomerang.*`, `swagger.enable` | Not read | Leave them out. |

**The activation code.** An upgraded install already has users, so Flow never asks for the code, and leaving it unset only logs one warning at start. The v3 chart's `FLOW_OTC` is 45 random characters, so carried over it still works, with a deprecation warning. If both `FLOW_OTC` and `FLOW_ACTIVATION_CODE` are set to different values, core doesn't start. See [Sign-in](./sign-in).

**Sign-in.** v5 signs people in with OpenID Connect or through an authenticating proxy, as v3 did. See [Sign-in](./sign-in).

### Set the encryption keys

Both pairs default to `FLOW_ENCRYPT_SECRET` and `FLOW_ENCRYPT_SALT`, the names the v3 chart used. Pass the v3 Secret to core unchanged and nothing else is needed. If you've uninstalled v3, recreate the Secret from the copy you saved first.

```yaml
env:
  - name: FLOW_ENCRYPT_SECRET
    valueFrom: { secretKeyRef: { name: bmrg-flow-secrets, key: FLOW_ENCRYPT_SECRET } }
  - name: FLOW_ENCRYPT_SALT
    valueFrom: { secretKeyRef: { name: bmrg-flow-secrets, key: FLOW_ENCRYPT_SALT } }
```

To rotate at the upgrade, give v3's pair as `MONGO_ENCRYPT_SECRET` and `MONGO_ENCRYPT_SALT`, and a new pair as `FLOW_ENCRYPT_SECRET` and `FLOW_ENCRYPT_SALT`. The upgrade is the only rotation point.

> **Warning:** Keep v5's pair fixed after the first start, in a Kubernetes Secret with a copy outside the cluster. Nothing re-encrypts stored values under a new key, so changing the pair later leaves every secured setting and secret parameter unreadable.

### Connect the dispatcher and task logs

- **Dispatcher.** Set `FLOW_ENGINE_URL` and `FLOW_ENGINE_DISPATCHER_TOKEN`, and bind the dispatcher's Kubernetes Role. See [Configuring](./configuring) and [Dispatcher](./dispatcher).
- **Loki.** If v3 read task logs from Loki, change the log shipper. v5 selects the pod labels as `boomerang_io_taskrun_ref` and `boomerang_io_workflow_ref`, and the task container `task` (the `kube-jobs` executor) or `step-task` (Tekton). A v3 shipper configuration matches no v5 pod. See [Task logs](./task-logs).

## Start v5

Start core at one replica, or with `strategy: { type: Recreate }`, for the upgrade itself. Scale out once that replica reports ready.

1. Size core's startup probe ([below](#size-the-startup-probe)).
2. Start core and follow its log:

   ```bash
   kubectl logs -f deploy/<core-deployment> -n <namespace>
   ```

3. When the pod is ready, scale out to the replicas v3 ran:

   ```bash
   kubectl scale deployment <core-deployment> -n <namespace> --replicas=3
   ```

4. Start the dispatcher and the webapp.

### Size the startup probe

Core serves no HTTP until the migrations finish, so Kubernetes sees it as starting for the whole migration. If the startup probe gives up first, Kubernetes restarts the pod part way through. The interrupted step runs again on the next start, but the upgrade can't finish until the probe allows enough time.

A 16 MB v3 database migrates in under a minute. Time grows with run history and index builds. To estimate a large install, restore the backup into a scratch database, start a v5 core against it with no dispatcher connected, and time it until the pod is ready. Stop it then, and set the probe to at least twice that.

This example allows 30 minutes, the longest a replica waits on the migration lock:

```yaml
# service-core container
startupProbe:
  httpGet: { path: /health/liveness, port: 7700 }
  periodSeconds: 10
  failureThreshold: 180   # 30 minutes
livenessProbe:
  httpGet: { path: /health/liveness, port: 7700 }
readinessProbe:
  httpGet: { path: /health/readiness, port: 7700 }
```

Both paths answer without a token on a secured install.

### Replicas and the migration lock

Replicas that start together take turns on the migration lock, `flow_sys_migration_lock`. The others wait for up to 30 minutes (`flamingock.lock-quit-trying-after-millis=1800000`), then skip what the first replica applied. Their startup probes must cover that wait, which is why the upgrade starts with one replica.

A waiting replica logs the migration library's own lines, such as `Attempting to acquire process lock [timeout=…s]`, and `Lock acquired [lock_key=… owner=… expires_at=…]` once it has the lock.

<!-- UNVERIFIED: the two lock lines are strings in the Flamingock 1.4.4 library (CommunityLock), not product code, and weren't seen in a run. What a replica does once the 30-minute wait runs out is not documented in the product. -->

### What the logs show

A successful upgrade logs these lines, in this order, among others:

```text
Existing installation detected — <n> legacy loader changesets, <n> workflows. Subsequent change units reconcile the live schema in place.
Install generation recorded as V3 in flow_sys_migration_state
users.email normalised to lower case — <n> document(s) rewritten, <n> left untouched as case collisions
Ensured index email_unique on flow_users
<n> indexes ensured
Settings encryption: <n> value(s) re-encrypted from the v3 cipher, <n> plaintext value(s) encrypted, <n> unreadable value(s) reset
Started Application in <n> seconds (process running for <n>)
```

`Started Application` means the migrations are done and core is serving.

## Verify

1. Every core pod is ready: `kubectl get pods -n <namespace>`.
2. The log records a v3 upgrade and no unresolved problems:

   ```bash
   kubectl logs deploy/<core-deployment> -n <namespace> \
     | grep -E "Install generation recorded|case collision|reset to blank|ERROR"
   ```

   You see `Install generation recorded as V3 in flow_sys_migration_state`. Resolve any `case collision` line as in [When duplicates stop the upgrade](#when-duplicates-stop-the-upgrade).
3. Sign in with a v3 admin account. Home lists your workspaces, which were v3's teams.
4. In **Admin › Settings › Integrations**, each credential v3 had set shows the placeholder **Set** and the helper "Set. Type a new value to replace it."
5. Run a workflow. The run appears in **Activity** with status **Succeeded**.

Settings are rebuilt from v5's defaults on the first start, keeping v3's values. v3's user defaults and Workflow storage settings are removed.

## When the upgrade fails

A failed migration step stops core from starting. Nothing is served, and v3 stays stopped. Every step retries on the next start, so once you fix the cause, restart the pod and the upgrade resumes where it stopped. If you can't fix the cause, [restore the backup](#back-up) and start v3 again.

> **Warning:** Never edit or delete `flow_sys_migration_changelog` by hand. It records which steps have run. Edited, it makes core skip or repeat steps against data in an unknown state. Fix the cause and restart, or restore the backup.

| Symptom | Cause | Recovery |
| --- | --- | --- |
| `This database was migrated by a 5.0 beta (flow_sys_changelog_loader exists). Beta databases cannot be upgraded: start from an empty database or restore the v3 database it came from.` | A 5.0 beta migrated the database | Restore the v3 backup, or start from an empty database. |
| `This database was installed by Flow 4, or by a loader this release does not recognise (flow_sys_changelog_flow has no v3 completion marker). Only an empty database or a Flow 3 database can be upgraded in place.` | A v4 database, or a v3 database older than bmrg-flow 4.13.5 (no loader changeset `111`) | Restore the v3 database. If it's older than bmrg-flow 4.13.5, upgrade v3 to that chart first. See [Check that v5 can upgrade this database](#check-that-v5-can-upgrade-this-database). |
| `Could not create UNIQUE index email_unique on flow_users — a duplicate survived the dedupe step that must precede this call (…)` | Two users share an exact email | Re-address one of them in `flow_users` (see [Resolve a duplicate](#resolve-a-duplicate), step 3) and restart. The upgrade resumes at the index step. |
| `setting '<key>' entry '<key>' was encrypted by v3 under a pair other than mongo.encrypt.secret/mongo.encrypt.salt; set v3's pair and start again, or set flow.migration.reset-unreadable-settings=true to blank each value that does not decrypt and enter it again in Settings (…)` | v3's pair is wrong or missing | Set v3's pair and restart. If it's lost, see [Upgrade without v3's pair](#upgrade-without-v3s-pair). |
| `flow.encrypt.secret and flow.encrypt.salt must be set: they are the key secured settings are encrypted with, and nothing is encrypted under a blank one` | v5's key is blank | Set `FLOW_ENCRYPT_SECRET` and `FLOW_ENCRYPT_SALT`, and restart. |
| `flow.activation-code and the retired flow.otc are both set and differ; set flow.activation-code only.` | `FLOW_OTC` is still set beside a different `FLOW_ACTIVATION_CODE` | Remove `FLOW_OTC`. |
| `flow.activation-code must be at least 32 characters.` | The code is too short | Set a longer code, or none. |
| `Fresh database — no legacy loader history and no workflows.` on an upgrade | Core reached the wrong collections: `flow.mongo.collection.prefix` differs from v3's, or `spring.mongodb.uri` names another database | Stop core and fix the prefix or the URI. Drop the collections that start created, under the wrong prefix or in the wrong database, then start again. |
| Core can't connect to MongoDB at `localhost` | `spring.mongodb.uri` is unset, so core uses its built-in sample address. v5 doesn't read v3's `spring.data.mongodb.uri`. | Set `SPRING_MONGODB_URI` and restart. |
| The pod restarts before `Started Application`, with `Startup probe failed` in its events | The startup probe is shorter than the migration | Raise `failureThreshold`. The interrupted step runs again on the next start. |

### Upgrade without v3's pair

By default, a v3 value that doesn't decrypt stops the upgrade, with the message above naming the setting. If the pair is lost for good, set `flow.migration.reset-unreadable-settings=true` (`FLOW_MIGRATION_RESET_UNREADABLE_SETTINGS=true`) and restart. The upgrade then blanks each such value, logs it by setting, and finishes:

```text
setting 'integration' entry 'slack.token' does not decrypt under v3's pair; it is reset to blank - enter it again in Settings
```

Enter each named value again in **Admin › Settings › Integrations**: typically the Slack and GitHub integration secrets. The property only affects the first start.

<!-- UNVERIFIED: FLOW_MIGRATION_RESET_UNREADABLE_SETTINGS and FLAMINGOCK_ENABLED are Spring's relaxed-binding forms of properties that exist at the tag; neither variable name appears verbatim in the repository. -->


> **Warning:** The reset is one-way. The blanked values are gone from the database. If the pair turns up later, restore from the backup and upgrade again with the pair instead.

## After the upgrade

### Re-enter integration secrets

- **Reset values.** Enter each value the reset blanked in **Admin › Settings › Integrations**. The log names each one.
- **Slack Signing Secret** (`slack.signingSecret`). Required: without it, Flow refuses every request on the Slack commands, interactivity and events routes.
- **GitHub Webhook Secret** (`github.webhookSecret`). Required: without it, Flow refuses every GitHub event with `401`.
- **Slack app.** Slack is now a workspace integration, listed on a workspace's Integrations page once `slack.clientId` and `slack.clientSecret` are set. In the Slack app's settings:
  - set the OAuth redirect URL to `<Flow API URL>/api/v2/integration/slack/auth`;
  - add the bot scopes `channels:manage`, `channels:read`, `chat:write`, `commands`, `files:write`, `groups:read`, `groups:write`, `users:read` and `users:read.email`;
  - leave token rotation off, since a rotating token can't be shared with tasks.

  A Slack token stored before v5 stays plaintext until Slack is next linked, so link it again.
- **GitHub App permissions.** The GitHub catalogue tasks act with the App's installation token when a workspace shares it. Between them they need Issues: write, Pull requests: write, Contents: read or write, Commit statuses: write and Actions: write. An organisation approves the App again when its permissions change.
- **Sharing tokens with tasks.** Once GitHub or Slack is connected, a workspace's integration offers **Share the installation token with tasks**. It writes read-only workspace parameters: `github-token`, refreshed every 45 minutes, and `github-url` for GitHub; `slack-token` for Slack. Workspace parameters must be on.
- **Google and Microsoft** can now be connected on a workspace's Integrations page by entering their credentials. The Teams and SharePoint tasks default to the Microsoft integration's parameters, and the Google Drive tasks to the Google integration's. In a workspace that hasn't connected the integration, enter the credentials in the task instead.

See [Integrations](./integrations) for setting up each app.

### Check user types

Only `admin` and `operator` users are admins in v5. A v3 user of type `auditor` or `author` is a plain user: they hold only their own profile and their workspace roles. The upgrade doesn't change a stored type, and **Admin › Users** shows both as **User**. To give one of them admin rights, open them in **Admin › Users**, select **Change role**, choose **Admin** and select **Submit**. A session's permissions are fixed when it starts, so they hold admin from their next sign-in.

### Issue new tokens

v3 tokens don't carry over: the upgrade drops v3's `tokens` collection. Every caller that used one, such as CI jobs, scripts and webhook senders, needs a new v5 token. v5 tokens start with `bfg_`, `bfk_`, `bfu_` or `bfs_`. See [Machine tokens](./machine-tokens).

### Update workflows

- **Workflow storage is removed.** A workflow now has one run workspace per run. A v3 workflow that had Workflow storage is refused at run with `WORKFLOW_STORAGE_REMOVED` until it's saved again. To keep files between runs, add a Download Artifact task with *Scope: Workflow* and *Optional* at the start, and an Upload Artifact task with *Scope: Workflow* at the end, both with the same name and the path you mounted before. Kept artifacts appear under **Configure › Artifacts**. Upgraded workflows keep their mount path, `/workspace/workflowrun` when none was set; new workflows mount at `/workspace`.
- **CloudEvent inputs.** Change each workflow [you listed](#find-the-workflows-that-read-cloudevent-inputs) to read `$(params.data.<path>)`. The trigger's URL can name the workflow: `?workspace=<workspace>&ref=<workflow name>`.
- **Team references.** `$(team.params.x)` still resolves, logs a warning, and goes in the next major version. Change it to `$(workspace.params.x)`.
- **Task image.** Catalogue tasks without an image of their own run on `boomerangio/task-flow:3.3.0` (the `default.image` setting), as do the v3 revisions the upgrade moves off `worker-flow`. An image you set yourself is kept, and no seeded revision pins a `task-flow` version any more. What changes for those tasks:
  - script tasks run on Alpine 3.24 with Node 24, npm 11 at `/usr/local/bin/npm` (`/usr/bin/npm` is gone), GNU tar, OpenSSL 3.5, curl 8.23 and bash 5.3;
  - tasks that exited successfully having done nothing now do their work or fail visibly: Append Data (Sheets), Copy File (Drive), and the Artifactory download and upload;
  - the Artifactory download needs a destination path, relative paths resolve against `/workspace`, and the upload verifies TLS, so a self-signed Artifactory fails until its CA is trusted;
  - the Drive tasks reach shared drives, the mail, ServiceNow and Slack tasks work when `HTTP_PROXY` is set, and JSONPath To Parameter no longer crashes with `module is not defined`;
  - task logs no longer print param values, and Google errors no longer include the request's bearer token.
- **New task revisions.** The upgrade adds a revision of each Slack task that takes its bot token and webhook URL as password fields, and of each GitHub and Slack API task whose token defaults to the integration's shared workspace parameter (`$(workspace.params.github-token)`, `$(workspace.params.slack-token)`). Workflows keep the revision they pin until you upgrade it in the editor. A task moved to the new revision and left on its default fails at admission in a workspace that doesn't share the token; the editor warns at save.
- **Quotas.** In v5 a quota of `0` is unlimited, and an absent quota inherits the platform default. v3 enforced `0` as a limit of zero, so the upgrade drops each v3 `0` and that workspace inherits the default. Check any workspace that relied on a zero limit. Kept artifacts count toward `max.artifact.storage` until they're replaced or deleted. See [Quotas](../webapp/quotas).
- **AI task (5.0 betas).** The seeded `ai` task is removed in favour of `ai-prompt` and `ai-agent`. An upgraded database keeps its `ai` definition, but nothing maintains it: move nodes to `ai-prompt`, whose params have the same names. `temperature` and `maxTokens` have no default.

### Update API clients

- **Settings and global parameters** take `PATCH` with a JSON Merge Patch; their `PUT` routes are gone. An unknown settings group or key is `400 SETTINGS_INVALID_KEY`. A workspace `PATCH` merges quotas field by field instead of replacing the stored set.
- **Secret values follow one rule.** A set secret reads `*****` and an unset one reads `null`. On a write, `*****`, `null` or a missing value keeps the stored secret, and `""` clears it. A client that sends `""` to mean "unchanged" must send `*****` or leave the value out.
- **"Team" names are now "workspace".** `GET /api/v2/profile` returns `workspaces` (was `teams`). The reasons `TEAM_INVALID_REF`, `TEAM_INVALID_REQ`, `TEAM_NON_UNIQUE_NAME`, `TEAM_INVALID_USER_ROLE` and `WORKFLOW_TEAM_INACTIVE` are now `WORKSPACE_INVALID_REF`, `WORKSPACE_INVALID_REQ`, `WORKSPACE_NON_UNIQUE_NAME`, `WORKSPACE_INVALID_USER_ROLE` and `WORKFLOW_WORKSPACE_INACTIVE`, with the same codes.
- **Task references** on the API, the status events and the dispatcher protocol are slug forms: `<slug>` for a global task and `<workspace>/<slug>` for a workspace task. A dispatcher's `task` filter takes the same form, and a bare slug matches only a global task.
- **Workflow saves** ignore unknown top-level fields and no longer echo them back. Every workflow read, the canvas included, masks secrets.
- **Event runs.** A CloudEvent run (`POST /api/v2/event`) gets `event`, the event's attributes, and `data`, its data, instead of one param per data member. The trigger's filters read the event as sent (`type`, `data.tag`). `ref` still takes a workflow ID; add `workspace` to name the workflow instead (`?workspace=<workspace>&ref=<workflow name>`, on `POST /api/v2/webhook` too). Without `ref`, the subject's first segment names the workflow.
- **GitHub events** start the workflows whose GitHub trigger is on, with its Events and Repository filters applied. The run gets `event` as `{type, id}`, beside `data`.
- **Integration sharing.** The share route is `POST /api/v2/integration/{github|slack}/share`. A read-only workspace parameter that an integration manages can't be changed or deleted through the workspace: `409 PARAMS_MANAGED_BY_INTEGRATION`.
- **A dispatcher you wrote against the protocol** must heartbeat every task it holds. A claim carries a 90-second lease (`flow.dispatcher.lease-ms`), so a dispatcher that sends no heartbeat has every claim requeued 90 seconds after it was made.

See the [API reference](../apis/overview).

### Delete the old Workflow storage volumes

Flow no longer manages the volumes v3 created for Workflow storage. Copy out anything you need, check what the label selects, then delete them:

```bash
kubectl get pvc -n <namespace> -l boomerang.io/workspace-type=workflow
kubectl delete pvc -n <namespace> -l boomerang.io/workspace-type=workflow
```

<!-- UNVERIFIED: the label is from CHANGELOG.md at 5.0.0-beta.39. The v3 controller's source isn't available to confirm that v3 volumes carry it; the get step is there so an operator checks first. -->

### Expect the run purge

The upgrade carries v3's workflow runs over as completed runs, without their task runs. v5 then deletes each finished run older than **Activity Retention (days)**, with its task runs, actions, and run-scoped artifacts and logs. The setting is in **Admin › Settings › Run limits**: 365 days by default, and at least 60.

The purge is on from the first start. Its first pass runs within a minute, and each hourly pass removes up to 1,000 runs, so an upgraded install loses its runs older than 365 days within hours, before you can change the setting. No value keeps every run. A run that a retry or a child run still points at is kept until that run goes. Workflows, workflow-scoped artifacts and the audit trail are kept.

Your [backup](#back-up) holds the full v3 history.

## With the Helm chart

<!-- PENDING: bmrg-flow 6.0.1 (charts#92 and #93, appVersion 5.0.0-beta.39) is merged on charts main but not released; the latest release is bmrg-flow-5.5.4. Its dispatcher Role lacks deletecollection (raised with the Flow core session). Re-check values names and the minimum Flow version when 6.0.x is released. -->

No Helm chart for Flow v5 is released yet; bmrg-flow 5.5.4 installs Flow 4.0.0. bmrg-flow 6.0.1 needs Flow 5.0.0-beta.39 or later, and makes the upgrade a `helm upgrade` of the v3 release, after you [stop v3](#stop-v3):

- **The Flow version.** The three images default to the chart's `appVersion`, 5.0.0-beta.39. Don't set `image.tag` below that: 5.0.0-beta.38 and earlier refuse a database from the v3 charts 4.13.5 to 4.14.3.
- **No loader Job.** The pre-upgrade hook is gone.
- **Core's startup probe** allows 30 minutes (`core.startupProbe.periodSeconds: 10`, `core.startupProbe.failureThreshold: 180`), and core rolls with `maxSurge: 1` and `maxUnavailable: 0`. Keep `core.replicaCount` at `1`, its default, for the upgrade, then raise it.
- **The collection prefix** is `global.database.mongodb.collectionPrefix`, `flow` by default. Keep v3's.
- **One Secret** keeps the v3 release's `FLOW_ENCRYPT_SECRET` and `FLOW_ENCRYPT_SALT`, carries `FLOW_OTC` over as `FLOW_ACTIVATION_CODE`, and adds one generated `bfg_` token (`core.security.bootstrapToken`). That token is both core's bootstrap token and the dispatcher's `FLOW_ENGINE_DISPATCHER_TOKEN`.
- **To rotate**, set `core.encrypt.v3.secret` and `core.encrypt.v3.salt` (or `core.encrypt.v3.existingSecret`) to v3's pair, with a new `core.encrypt.secret` and `core.encrypt.salt`.
- **Without v3's pair**, set `core.migration.resetUnreadableSettings: true`.
- **The dispatcher** gets `FLOW_ENGINE_URL` and its own Role. Its executor, `dispatcher.executor`, defaults to `kube-jobs` in the chart.

## Next steps

- [Upgrade between v5 releases](./rolling-upgrades): rolling out each later v5 release.
- [Configuring](./configuring): the properties, routes and probes each image needs.
- [Dispatcher](./dispatcher): running tasks on Kubernetes.
- [Machine tokens](./machine-tokens): tokens for the dispatcher and other callers.
- [Sign-in and the first admin](./sign-in): sign-in modes and the activation code.
- [Task logs](./task-logs): live and stored task logs, including Loki.
- [What's new](../introduction/whats-new): everything else that changed in v5.
