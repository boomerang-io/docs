---
title: Workflow Run Model
---

# Workflow Run Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional] [default to null] |
| **awaitingApproval** | **Boolean** |  | [optional] [default to null] |
| **creationDate** | **Date** |  | [optional] [default to null] |
| **debug** | **Boolean** |  | [optional] [default to null] |
| **duration** | **Long** |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **initiatedByName** | **String** |  | [optional] [default to null] |
| **initiatedByRef** | **String** |  | [optional] [default to null] |
| **initiatedByWorkflowRunRef** | **String** |  | [optional] [default to null] |
| **labels** | **Map** of **String** |  | [optional] [default to null] |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional] [default to null] |
| **paused** | **Boolean** |  | [optional] [default to null] |
| **phase** | **String** |  | [optional] Enum: `queued`, `pending`, `running`, `completed` [default to null] |
| **results** | **List** of [**RunResult**](RunResult) |  | [optional] [default to null] |
| **retries** | **Long** |  | [optional] [default to null] |
| **retryFrom** | [**RetryFrom**](RetryFrom) |  | [optional] [default to null] |
| **startTime** | **Date** |  | [optional] [default to null] |
| **status** | **String** |  | [optional] Enum: `notstarted`, `ready`, `running`, `waiting`, `succeeded`, `failed`, `invalid`, `skipped`, `cancelled`, `timedout` [default to null] |
| **statusMessage** | **String** |  | [optional] [default to null] |
| **statusReason** | **String** |  | [optional] [default to null] |
| **tasks** | **List** of [**TaskRun**](TaskRun) |  | [optional] [default to null] |
| **timeout** | **Long** |  | [optional] [default to null] |
| **trigger** | **String** |  | [optional] [default to null] |
| **workflowDisplayName** | **String** |  | [optional] [default to null] |
| **workflowName** | **String** |  | [optional] [default to null] |
| **workflowRef** | **String** |  | [optional] [default to null] |
| **workflowRevisionRef** | **String** |  | [optional] [default to null] |
| **workflowVersion** | **Integer** |  | [optional] [default to null] |
| **workspace** | [**WorkflowWorkspace**](WorkflowWorkspace) |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

