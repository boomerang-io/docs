---
title: Welcome
order: 1
description: Boomerang Flow builds and runs workflows, graphs of tasks that run as containers on Kubernetes.
toc: true
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. UI labels checked against the live webapp (build 490ba3894, 2026-11-06): 2 of 5 bolded terms seen live; the rest are states the walk didn't reach or aren't labels, and were verified in client-web source. -->

# Welcome

Boomerang Flow builds and runs workflows: graphs of tasks that run as containers on Kubernetes. Drag tasks from the catalogue onto a canvas, link them, and run the workflow by hand, on a schedule, or from a webhook, a CloudEvent or a GitHub event. When the catalogue doesn't have the task you need, bring your own container or script.

Flow is open source under the Apache License 2.0.

## What Flow does

- **Build visually.** Drag tasks onto the canvas and link them. A task can run once for each item in a list.
- **Put a person in the loop.** An approval or a manual task holds the run until someone decides, and the wait doesn't count against the run's timeout.
- **Start runs your way.** Run a workflow by hand, on a schedule, from a webhook or CloudEvent, or from a GitHub event.
- **See every run.** Activity records each run with its task logs, results and artifacts. Pause a run, cancel it, or retry it from the tasks that failed.
- **Keep work in workspaces.** A workspace holds workflows, members, parameters and quotas.
- **Extend it.** Run your own container with **Run Custom Task**, add tasks in **Task Manager**, or call Flow's REST API under `/api/v2`.

## Get started

<docs-cards>
  <a href="/introduction/getting-started" aria-label="Getting started">
    <docs-card>
      <h4 class="text-blue-brand">New to Flow?</h4>
      <p>Create a workspace, build a workflow with one task, run it and watch it succeed. About ten minutes.</p>
    </docs-card>
  </a>
  <a href="/introduction/whats-new" aria-label="What's new">
    <docs-card>
      <h4 class="text-blue-brand">What's new in 5.0</h4>
      <p>What changed since Flow 3, and what to do when you upgrade.</p>
    </docs-card>
  </a>
  <a href="/introduction/faq" aria-label="Frequently asked questions">
    <docs-card>
      <h4 class="text-blue-brand">FAQ</h4>
      <p>Short answers on tasks, timings, quotas and limits.</p>
    </docs-card>
  </a>
  <a href="/introduction/known-issues" aria-label="Known issues">
    <docs-card>
      <h4 class="text-red-brand">Known issues</h4>
      <p>Defects in 5.0.0 and how to work around them.</p>
    </docs-card>
  </a>
  <a href="/tutorials/manual-approval-output" aria-label="Tutorials">
    <docs-card>
      <h4 class="text-green-brand">Try a tutorial</h4>
      <p>Work through a complete example: pause a workflow for an approval, then email who decided and what they said.</p>
    </docs-card>
  </a>
  <a href="/guides/create" aria-label="Guides">
    <docs-card>
      <h4 class="text-green-brand">Guides</h4>
      <p>Step-by-step tasks: create, edit, configure, run and retry workflows.</p>
    </docs-card>
  </a>
</docs-cards>

## Learn the concepts

The **Fundamentals** cover one part of the webapp or one concept per page.

<docs-cards>
  <a href="/fundamentals/workflows" aria-label="Workflows">
    <docs-card>
      <h4 class="text-blue-brand">Workflows</h4>
      <p>Create, find, run and manage the workflows in a workspace.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/activity" aria-label="Activity">
    <docs-card>
      <h4 class="text-blue-brand">Activity</h4>
      <p>Every run in a workspace, filtered by workflow, status, trigger or date.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/runs" aria-label="Runs">
    <docs-card>
      <h4 class="text-blue-brand">Runs</h4>
      <p>Statuses, pausing, cancelling, retries, timeouts and child workflows.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/actions" aria-label="Actions">
    <docs-card>
      <h4 class="text-blue-brand">Actions</h4>
      <p>Approvals and manual tasks where a person has to decide.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/triggers" aria-label="Triggers">
    <docs-card>
      <h4 class="text-blue-brand">Triggers</h4>
      <p>Start runs by hand, from a webhook, a CloudEvent or GitHub.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/schedules" aria-label="Schedules">
    <docs-card>
      <h4 class="text-blue-brand">Schedules</h4>
      <p>Run a workflow once, hourly, daily, on weekdays, weekly or on a cron expression.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/tasks" aria-label="Tasks and Task Manager">
    <docs-card>
      <h4 class="text-blue-brand">Tasks and Task Manager</h4>
      <p>The catalogue Flow ships, and how to add your own tasks to a workspace in Task Manager.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/parameters" aria-label="Parameters">
    <docs-card>
      <h4 class="text-blue-brand">Parameters</h4>
      <p>Inputs and results that flow between tasks, workflows and workspaces, and secrets.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/artifacts" aria-label="Artifacts and the run workspace">
    <docs-card>
      <h4 class="text-blue-brand">Artifacts</h4>
      <p>Share files between the tasks of a run, and keep files between runs.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/integrations" aria-label="Integrations">
    <docs-card>
      <h4 class="text-blue-brand">Integrations</h4>
      <p>Connect GitHub, Slack, Google or Microsoft to a workspace and share their credentials with tasks.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/insights" aria-label="Insights">
    <docs-card>
      <h4 class="text-blue-brand">Insights</h4>
      <p>Run counts, durations and AI usage for a workspace over time.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/quotas" aria-label="Quotas">
    <docs-card>
      <h4 class="text-blue-brand">Quotas</h4>
      <p>The limits on a workspace's workflows, runs and storage.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/manage" aria-label="Manage workspace">
    <docs-card>
      <h4 class="text-blue-brand">Manage workspace</h4>
      <p>A workspace's members, approver groups, artifacts, quotas, tokens and settings.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/administer" aria-label="Admin">
    <docs-card>
      <h4 class="text-blue-brand">Admin</h4>
      <p>Platform settings, workspaces, users, global parameters, tokens, tasks and the audit trail.</p>
    </docs-card>
  </a>
</docs-cards>

## Run Flow yourself

<docs-cards>
  <a href="/hosting/installing" aria-label="Installing">
    <docs-card>
      <h4 class="text-green-brand">Install</h4>
      <p>What Flow needs and how to install it.</p>
    </docs-card>
  </a>
  <a href="/hosting/configuring" aria-label="Configuring">
    <docs-card>
      <h4 class="text-green-brand">Configure</h4>
      <p>Images, ports, properties, probes and the dispatcher.</p>
    </docs-card>
  </a>
  <a href="/hosting/sign-in" aria-label="Sign-in">
    <docs-card>
      <h4 class="text-green-brand">Sign-in</h4>
      <p>Sign people in with OpenID Connect or a proxy, and activate a new install.</p>
    </docs-card>
  </a>
  <a href="/hosting/upgrading" aria-label="Upgrading">
    <docs-card>
      <h4 class="text-green-brand">Upgrade from v3</h4>
      <p>Move a Flow 3 install to v5 in place, then roll out each later release.</p>
    </docs-card>
  </a>
  <a href="/architecture/security" aria-label="Security">
    <docs-card>
      <h4 class="text-blue-brand">Security</h4>
      <p>How Flow authenticates people and machines, and what each role can do.</p>
    </docs-card>
  </a>
  <a href="/apis/overview" aria-label="API reference">
    <docs-card>
      <h4 class="text-blue-brand">API reference</h4>
      <p>Every route of the REST API under <code>/api/v2</code>.</p>
    </docs-card>
  </a>
</docs-cards>

## Get help

- **Report a defect or request a feature** in the [Flow issue tracker](https://github.com/boomerang-io/flow/issues). Check [Known issues](/introduction/known-issues) first.
- **Read the release notes** for each version on [GitHub](https://github.com/boomerang-io/flow/releases).
- **Read the source:** Flow is developed in the open at [github.com/boomerang-io/flow](https://github.com/boomerang-io/flow).
