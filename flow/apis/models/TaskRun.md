---
title: Task Run Model
---

# Task Run Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional] [default to null] |
| **attempt** | **Integer** |  | [optional] [default to null] |
| **attempts** | **List** of [**RunAttempt**](RunAttempt) |  | [optional] [default to null] |
| **creationDate** | **Date** |  | [optional] [default to null] |
| **duration** | **Long** |  | [optional] [default to null] |
| **foreach** | **Boolean** |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **index** | **Integer** |  | [optional] [default to null] |
| **labels** | **Map** of **String** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional] [default to null] |
| **parentRef** | **String** |  | [optional] [default to null] |
| **phase** | **String** |  | [optional] Enum: `queued`, `pending`, `running`, `completed` [default to null] |
| **results** | **List** of [**RunResult**](RunResult) |  | [optional] [default to null] |
| **reusedFromRef** | **String** |  | [optional] [default to null] |
| **spec** | [**TaskRunSpec**](TaskRunSpec) |  | [optional] [default to null] |
| **startTime** | **Date** |  | [optional] [default to null] |
| **status** | **String** |  | [optional] Enum: `notstarted`, `ready`, `running`, `waiting`, `succeeded`, `failed`, `invalid`, `skipped`, `cancelled`, `timedout` [default to null] |
| **statusMessage** | **String** |  | [optional] [default to null] |
| **statusReason** | **String** |  | [optional] [default to null] |
| **taskRef** | **String** |  | [optional] [default to null] |
| **taskVersion** | **Integer** |  | [optional] [default to null] |
| **timeout** | **Long** |  | [optional] [default to null] |
| **type** | **String** |  | [optional] Enum: `start`, `end`, `template`, `custom`, `generic`, `decision`, `approval`, `setwfproperty`, `manual`, `eventwait`, `acquirelock`, `releaselock`, `runworkflow`, `runscheduledworkflow`, `script`, `ai`, `setwfstatus`, `sleep`, `uploadartifact`, `downloadartifact` [default to null] |
| **workflowName** | **String** |  | [optional] [default to null] |
| **workflowRef** | **String** |  | [optional] [default to null] |
| **workflowRevisionRef** | **String** |  | [optional] [default to null] |
| **workflowRunRef** | **String** |  | [optional] [default to null] |
| **workspace** | [**WorkflowWorkspace**](WorkflowWorkspace) |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

