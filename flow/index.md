---
title: Welcome
order: 1
description: What Boomerang Flow does, and where to start in these docs whether you build workflows, run Flow or build on it.
verified: "5.0.0-beta.39"
toc: true
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. The page quotes no UI labels; each card's text follows the lede of the page it links to. introduction/flow-in-five-minutes, introduction/troubleshooting and introduction/glossary were being written at the same time as this page: check their card text against them once they land. -->

# Welcome

Boomerang Flow builds and runs workflows: graphs of tasks that run as containers on Kubernetes. Put tasks from the catalogue, or your own containers and scripts, onto a canvas, then run the workflow by hand, on a schedule, or from a webhook, a CloudEvent or a GitHub event.

> [!NOTE]
> Flow 5.0.0 is in pre-release. These docs describe [5.0.0-beta.39](https://github.com/boomerang-io/flow/releases/tag/5.0.0-beta.39) and can change before the release. For Flow 3, choose 3.12.0 in the version menu.

## Build workflows

This is for you if you build, run and fix workflows in the webapp.

<docs-cards>
  <a href="/introduction/flow-in-five-minutes" aria-label="Flow in five minutes">
    <docs-card>
      <h4 class="text-blue-brand">Flow in five minutes</h4>
      <p>A short tour of Flow's main ideas and how they fit together.</p>
    </docs-card>
  </a>
  <a href="/introduction/getting-started" aria-label="Getting started">
    <docs-card>
      <h4 class="text-blue-brand">Getting started</h4>
      <p>Create a workspace, build a workflow with one task and watch it run, in about ten minutes.</p>
    </docs-card>
  </a>
  <a href="/fundamentals/workflows" aria-label="Workflows">
    <docs-card>
      <h4 class="text-blue-brand">Workflows</h4>
      <p>What a workflow is, and how to find, run and manage the workflows in a workspace.</p>
    </docs-card>
  </a>
  <a href="/guides/create" aria-label="Create a workflow">
    <docs-card>
      <h4 class="text-blue-brand">Create a workflow</h4>
      <p>Start a workflow from scratch, from a starter or from a file.</p>
    </docs-card>
  </a>
  <a href="/introduction/troubleshooting" aria-label="Troubleshooting">
    <docs-card>
      <h4 class="text-blue-brand">Troubleshooting</h4>
      <p>Common problems, what causes them and how to fix each one.</p>
    </docs-card>
  </a>
</docs-cards>

## Run Flow

This is for you if you install, configure and upgrade Flow for other people to use.

<docs-cards>
  <a href="/hosting/installing" aria-label="Installing">
    <docs-card>
      <h4 class="text-green-brand">Installing</h4>
      <p>What an install needs, how to try Flow locally with Docker Compose, and how to deploy it to Kubernetes.</p>
    </docs-card>
  </a>
  <a href="/hosting/configuring" aria-label="Configuring">
    <docs-card>
      <h4 class="text-green-brand">Configuring</h4>
      <p>The properties, routes and probes a deployment needs, and how Flow connects to its dispatcher.</p>
    </docs-card>
  </a>
  <a href="/hosting/sign-in" aria-label="Sign-in and the first admin">
    <docs-card>
      <h4 class="text-green-brand">Sign-in and the first admin</h4>
      <p>Choose how people sign in, make the first admin, and decide who else may sign in.</p>
    </docs-card>
  </a>
  <a href="/hosting/upgrading" aria-label="Upgrading from v3">
    <docs-card>
      <h4 class="text-green-brand">Upgrading from v3</h4>
      <p>Upgrade a Flow v3 installation to v5 in place, then roll out each later release.</p>
    </docs-card>
  </a>
  <a href="/hosting/dispatcher" aria-label="Run the dispatcher">
    <docs-card>
      <h4 class="text-green-brand">Run the dispatcher</h4>
      <p>Deploy Flow's Kubernetes dispatcher, choose its executor and grant the permissions it needs.</p>
    </docs-card>
  </a>
</docs-cards>

## Build on Flow

This is for you if you call Flow from another system, write tasks or a dispatcher, or build Flow into your own product.

<docs-cards>
  <a href="/apis/overview" aria-label="API reference">
    <docs-card>
      <h4 class="text-blue-brand">API reference</h4>
      <p>How to authenticate to the REST API under <code>/api/v2</code>, how its errors and paging work, and every route.</p>
    </docs-card>
  </a>
  <a href="/architecture/eventing" aria-label="Webhooks and events">
    <docs-card>
      <h4 class="text-blue-brand">Webhooks and events</h4>
      <p>Start and resume runs from other systems, and receive a CloudEvent when a run's status changes.</p>
    </docs-card>
  </a>
  <a href="/extend/task-contract" aria-label="Task container contract">
    <docs-card>
      <h4 class="text-blue-brand">Task container contract</h4>
      <p>What Flow hands a task's container and what it takes back.</p>
    </docs-card>
  </a>
  <a href="/extend/write-a-dispatcher" aria-label="Write a dispatcher">
    <docs-card>
      <h4 class="text-blue-brand">Write a dispatcher</h4>
      <p>Build your own dispatcher with the Java dispatcher SDK, following the protocol's rules.</p>
    </docs-card>
  </a>
  <a href="/extend/embed-flow" aria-label="Embed Flow">
    <docs-card>
      <h4 class="text-blue-brand">Embed Flow</h4>
      <p>Use Flow as the workflow engine inside your own product, and call it with the <code>flow-sdk</code> client.</p>
    </docs-card>
  </a>
</docs-cards>

## Also useful

[What's new in 5.0](/introduction/whats-new) · [Known issues](/introduction/known-issues) · [Task catalogue](/catalogue/overview) · [Glossary](/introduction/glossary)

Flow is open source under the Apache License 2.0. To get help or report a defect, open an issue in the [Flow issue tracker](https://github.com/boomerang-io/flow/issues).
