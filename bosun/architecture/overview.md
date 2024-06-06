---
title: Application Architecture
index: 0
---

# Application architecture

The following architecture depicts the components and dependencies that make up the appplication and their relationships.

## Components

| Component       | Type         | Technology         | Internal to Internal | External Ingress | Internal Dependency      | External Dependency | Optional Sidecars |
| --------------- | ------------ | ------------------ | -------------------- | ---------------- | ------------------------ | ------------------- | ----------------- |
| Bosun           | Front End    | React + Node.js    | Bosun MS             | true             |                          |                     |                   |
| Policy          | Microservice | Spring Boot (Java) | Repository MS        | true             | MongoDB, OpenPolicyAgent |                     | New Relic APM     |
| Repository      | Microservice | Spring Boot (Java) |                      | false            | SonarQube, JFrog XRay    |                     | New Relic APM     |
| OpenPolicyAgent | Middleware   | Go                 |                      | false            |                          |                     |                   |

_Notes:_

1. Optional sidecars are what is known at the application layer. This does not include any DaemonSets defined at the Infrastructure and Orchestrator layer.
2. Repository microservice is not required to be integrated to the dependencies. This is required only if you used the predefined integrations, as opposed to passing in an already retrieved payload.
3. [OpenPolicyAgent](https://openpolicyagent.org/) is a third-party open source component that Bosun wraps.
