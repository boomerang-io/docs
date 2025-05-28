---
title: What's New
order: 3
---

# What's new

We have completely rebuilt Boomerang Flow from the ground up to provide a more robust, scalable, and secure platform for building, automating, and optimizing workflows. This release includes a new user interface, new features, and a new architecture that is designed to be more extensible and easier to maintain.

[View the full release notes on GitHub](https://github.com/boomerang-io/community/releases/tag/4.0.0) where you can find what has been added, changed, improved, or deprecated in each release.

## Migrating

The loader can take a while to run when completing the migration from v3 to v4. We recommend to extend the time out or run the loader outside of the Helm chart to ensure that the migration is completed successfully. The loader will run automatically when you upgrade to v4.0.0.

### Workflows

You need to ensure that all team workflows have unique names. This is because names are turned into slugs and need to be unique within a team.

## Deprecations

The following table describes the deprecations, when they are announced, and when they will be fully removed.

| Feature                                   | Announcement Date or Release | Removal Date or Release | Comments                                                                                                                                                                                                                                                     |
| ----------------------------------------- | ---------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| System Tokens                             | 3.12                         | 4.0                     | Replaced by the new API Tokens.                                                                                                                                                                                                                              |
| Embbedded Tekton Helm Chart               | 3.12                         | 3.12                    | Removed as an option with our update to recommending that installation is completed with Tekton 0.29 or above. The CD Foundation Helm Chart no longer supported the latest versions and using the Operator installation method is now recommended by Tekton. |
| Properties Syntax and Terminology         | 3.1                          | 3.4                     | Replaced by Parameters and backwards compatibility supported until 3.4                                                                                                                                                                                       |
| Create Task from JSON                     | 3.2                          | 3.2                     | Replaced by the ability to create from YAML as part of the Tekton Task adoption                                                                                                                                                                              |
| Elasticsearch<sup>®</sup> log integration | 3.3                          | 3.3                     | Removed as an option for log integration.                                                                                                                                                                                                                    |
| Lifecycle Worker                          | 3.3                          | 3.3                     | Removed as an option custom integration or lifecycle watcher.                                                                                                                                                                                                |
