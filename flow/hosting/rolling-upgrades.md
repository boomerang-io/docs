---
title: Upgrade between v5 releases
sidebarTitle: Rolling upgrades
order: 10
description: Roll out a later Flow v5 release with a rolling update while the previous release keeps serving.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39 (3960b0a79). -->

# Upgrade between v5 releases

This page takes a running Flow v5 install to a later v5 release. It's for operators. To move a v3 install to v5, see [Upgrade from v3](./upgrading) instead: v3 stops first, and the upgrade doesn't roll.

## Roll out a later release

Later v5 releases upgrade with a rolling update. The new release migrates in its first pod while the previous release keeps serving.

1. Read the release's **Upgrading** notes.
2. Back up the database.
3. Deploy all three images at the new tag, with core rolling one pod at a time:

   ```yaml
   strategy:
     type: RollingUpdate
     rollingUpdate:
       maxSurge: 1
       maxUnavailable: 0
   ```

   One new pod runs the migrations while the old pods serve. Once it's ready, the rest replace the old pods one at a time and start against the migrated database without waiting.

## What to watch during the rollout

- **Mixed versions.** During the rollout, the previous release keeps serving against the migrated database: every migration stays compatible with the previous release. That holds between v5 releases only. A v3 upgrade stops v3 first.
  <!-- UNVERIFIED: the compatibility rule is the maintainer's; no source in the product repository states or tests it. -->
- **Startup probe.** The new pod is starting for the whole of its migration. Keep the probe sized for the largest migration the release notes describe.
- **When a migration fails,** the new pod doesn't start, and the rollout stalls with the old pods serving. Read its log with `kubectl logs <new-pod> -n <namespace>`, fix the cause, and delete the pod. The interrupted step runs again on the next start. Never edit `flow_sys_migration_changelog`.
- **Turning migrations off.** `flamingock.enabled=false` (`FLAMINGOCK_ENABLED=false`) starts core without running migrations. Core then runs against whatever shape the database has. Migrations are the only thing that builds indexes and seeds settings, roles and catalogue changes, so a release started this way against a database its migrations haven't reached can fail requests, or run without its indexes. Use it only for a replica of a release whose migrations have already run against this database.
  <!-- UNVERIFIED: when to use flamingock.enabled=false isn't documented in the product; the property is Flamingock's (1.4.4) and named in application.properties' comment. The risk follows from spring.data.mongodb.auto-index-creation=false and seeding by change units. -->

<!-- UNVERIFIED: FLAMINGOCK_ENABLED is Spring's relaxed-binding form of a property that exists at the tag; the variable name doesn't appear verbatim in the repository. -->

## Next steps

- [What's new](../introduction/whats-new): the release notes, with each release's **Upgrading** items.
- [Configure health probes](./configuring#configure-health-probes): core's startup probe and the other probes.
- [Replicas and the migration lock](./upgrading#replicas-and-the-migration-lock): how replicas that start together share the migrations.
- [Configuration reference](./configuration-reference): core, webapp and dispatcher link properties, with their defaults.
- [Upgrade from v3](./upgrading): moving a v3 install to v5.
