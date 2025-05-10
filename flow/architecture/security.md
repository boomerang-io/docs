---
title: Security
order: 3
---

# Security Architecture

The following architecture information provides details on security protocols in place and how these are applicable.

## Authentication

The solution relies on **[oauth2_proxy](https://github.com/oauth2-proxy)** to provide user authentication in the form of basic authentication or integrated with a provider such as GitHub<sup>®</sup> or Google.

There are also Tokens for securing API endpoints by either Global, Team, Workflow, or User tokens.

### Tokens

Tokens are used to secure the API endpoints. The format used by our API Tokens is as follows;

| Scope    | Prefix | Access                                                                                                |
| -------- | ------ | ----------------------------------------------------------------------------------------------------- |
| Global   | `bfg_` | Allows you to retrieve information or perform an action on any team, user, or workflow.               |
| Team     | `bft_` | Allows you to retrieve information or perform an action of a specific team or team workflows.         |
| Workflow | `bfw_` | Allows you to retrieve information or perform an action of a specific workflow.                       |
| User     | `bfu_` | Allows you to retrieve information or perform an action of a specific user.                           |
| Session  | `bfs_` | Allows you to retrieve information or perform an action of a specific user. For the specific session. |

> You can learn more about the Token format by reading this [GitHub Blog](https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/) or by [understanding our scoping implementation](https://github.com/boomerang-io/flow.service).

## Authorization

### Permissions

Authorization is based on permissions that are made of actions that can be performed on the resources. Actions are split up into; create, read, write, delete, and action. The resources are all the entities within the system.

- are in the format of `resource/action`. For example, `workflow/create` or `team/read`.
- `**` can be used to repplace the resource or action. For example, `workflow/**` or `**/**`.

### Scope

Once you have a permission, it is then bound by the scope that you apply to it. For example a user can have a permission to `workflow/create` but only on a specific team. This is done by scoping the permission to the team.

### Roles

Roles can be assigned at a global scope or at a team scope and provide a grouping of permissions. The following table provides an overview of the roles and their permissions.

| Type   | Role     | Description                                                                                                                                | Permissions                        |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| global | admin    | Ability to access and manage all teams and system                                                                                          | `**/**`                            |
| global | operator | Ability to access and manage all teams                                                                                                     | `**/read`, `**/write`, `**/action` |
| User   | user     | Ability to view their own profile                                                                                                          | `profile/**`                       |
| team   | owner    | Applied to user at team creation time. Can do create, read, write, delete, action on all resources within the team and on the team itself. | `**/**`                            |
| team   | editor   | Similar to owner, without the delete action.                                                                                               | `**/read`, `**/write`, `**/action` |
| team   | reader   | Read on all resources within the team.                                                                                                     | `**/read`                          |

## Audit

Every action taken within the system is stored in the audit table.

> Note: there is currently no UI to be able to view the audit logs.

## SSL certificates

Expects an SSL certificate for HTTPS ingress. This can be configured as per your Kubernetes<sup>®</sup> configuration.

## Data

Data is stored in the following locations:

- Activity Logs - Kubernetes ephemeral storage and optionally ingested by a chosen logging implementation such as Elastic<sup>®</sup> or Loki
- Audit Logs - MongoDB<sup>®</sup>
- Application Data - MongoDB
- Workflow Cache - Kubernetes Persistent Volumes (PV)

The following table provides an overview of the data management profile:

| Data Entity      | Storage        | PII | Customer Data | Source Code | Encrypted at Rest | Encrypted in Flight |
| ---------------- | -------------- | --- | ------------- | ----------- | ----------------- | ------------------- |
| Activity Logs    | File           | N   | N             | Y           | Y (\*\*)          | Y                   |
| Activity Logs    | Elastic \ Loki | N   | N             | Y           | Y (\*)            | Y                   |
| Audit Logs       | MongoDB        | Y   | N             | N           | Y (\*)            | Y                   |
| Application Data | MongoDB        | Y   | Y             | N           | Y (\*)            | Y (\*)              |
| Workflow Cache   | Kubernetes PV  | N   | N             | Y           | N                 | N                   |

(\*) App-level encryption (\*\*) Disk-level encryption

### Retention

Data is backed up based on a chosen mechanism. We recommend Velero<sup>®</sup> and Restic.

It is retained based on the configurations of the various tools.

## Encryption

Encryption can be implemented at two distinct layers and depends on what is configured at installation time and the underlying Kubernetes.

- Network or in-flight traffic can be encrypted through configuration of the Kubernetes networking layer and the exchange of SSL certificates.
- Data or at-rest components can be encrypted through configuration of the persistence volume layer and a passphrase.

## Kubernetes policies

There are a number of policy types in Kubernetes that help ensure security. We leverage a number of these.

### Pod security policy

Pod Security Policies (PSP) / Security Context Constraints (SCC) enable fine-grained authorization and define a set of conditions that a pod must run with in order to be accepted into the system. From host access to Linux<sup>®</sup> capabilities and privileges. See [Kubernetes Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/) for more information.

By default all pods run under `privileged` policy. You can also define a default policy at the namespace level. Flow takes care of creating the Kubernetes Service Accounts and role bindings to the elevated policy at install time.

### Image Policies

We recommended leveraging cluster-wide image policies with a list of approved containers that can be accessed.

### Roles

The controller is the Kubernetes orchestrator. It needs elevated permissions to be able to communicate with the Kubernetes API. To achieve this, we define a Custom role with the appropriate Service account bound to this role. The controller microservice runs as this Service account.

See the Helm<sup>®</sup> chart for further in-depth detail as to what Resource Groups and Verbs this role utilizes.

### Task

The task is the Tekton TaskRuns that runs and executes the container. It needs some elevated permissions to be created and bound to the `configmap` and Persistent Volume Claim (PVC). To achieve this, we have a Service account and a binding to a predefined role with only the required abilities.

Every Task is a self-contained short-living execution runner. All artifacts and secure values are only pulled into the Task as it is executing. The Task is then removed upon completion or during scheduled cleanups, based on installed properties.
