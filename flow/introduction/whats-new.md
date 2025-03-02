---
title: What's New
order: 3
---

# What's new

Get a quick overview of what has been added, changed, improved, or deprecated in version 4.0 (coming soon). 4.0 beta 2 released March 2025.

> If upgrading from a prior version, we recommend running the Loader directly against the Database as the data migration can take up to 30 minutes.

You can find all the associated versions for this release on our [GitHub Release](https://github.com/boomerang-io/community/releases/tag/4.0.0-beta.1) as well as install via our Helm chart

## Workflow

- Resolved issue with setting of output parameters on workflows with multiple set output parameter tasks by refactoring output properties to allow for more reliable saving
- Fixed output parameters being shown without quotes on output

## Tasks & Extensions

- Fixed import task yaml error

## APIs & Events

- Added a new API `workflow/teams/{teamId}/workflows`
- Speed up `/teams` API performance when team list is large in size

## Management & Administration

- Resolved issue with Admins not able to view all workflows

## Installing

- Tekton is no longer tighly coupled with a Boomerang Flow installation. See [Deprecations](../introduction/known-issues-limitations#deprecations). We now recommend Tekton 0.29 or above.

## Stablity and Security

- Fixed issue with not being able to open any pages with flow.client.web versions 3.10.0 and 3.11.0
- Increased a number of minor dependent package versions across all parts of the solution thanks to Snyk and Dependabot.
- Documented how to contribute to the [Flow Loader project](https://github.com/boomerang-io/flow.loader)
