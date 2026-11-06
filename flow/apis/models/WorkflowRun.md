---
title: Workflow Run Model
verified: "5.0.0-beta.39"
---

# Workflow Run Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional]  |
| **awaitingApproval** | **Boolean** |  | [optional]  |
| **creationDate** | **Date** |  | [optional]  |
| **debug** | **Boolean** |  | [optional]  |
| **duration** | **Long** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **initiatedByName** | **String** |  | [optional]  |
| **initiatedByRef** | **String** |  | [optional]  |
| **initiatedByWorkflowRunRef** | **String** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional]  |
| **paused** | **Boolean** |  | [optional]  |
| **phase** | **String** |  | [optional] Enum: `queued`, `pending`, `running`, `completed`  |
| **results** | **List** of [**RunResult**](RunResult) |  | [optional]  |
| **retries** | **Long** |  | [optional]  |
| **retryFrom** | [**RetryFrom**](RetryFrom) |  | [optional]  |
| **startTime** | **Date** |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `notstarted`, `ready`, `running`, `waiting`, `succeeded`, `failed`, `invalid`, `skipped`, `cancelled`, `timedout`  |
| **statusMessage** | **String** |  | [optional]  |
| **statusReason** | **String** |  | [optional]  |
| **tasks** | **List** of [**TaskRun**](TaskRun) |  | [optional]  |
| **timeout** | **Long** |  | [optional]  |
| **trigger** | **String** |  | [optional]  |
| **workflowDisplayName** | **String** |  | [optional]  |
| **workflowName** | **String** |  | [optional]  |
| **workflowRef** | **String** |  | [optional]  |
| **workflowRevisionRef** | **String** |  | [optional]  |
| **workflowVersion** | **Integer** |  | [optional]  |
| **workspace** | [**WorkflowWorkspace**](WorkflowWorkspace) |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

