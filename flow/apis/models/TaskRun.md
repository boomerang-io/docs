---
title: Task Run Model
verified: "5.0.0-beta.39"
---

# Task Run Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional]  |
| **attempt** | **Integer** |  | [optional]  |
| **attempts** | **List** of [**RunAttempt**](RunAttempt) |  | [optional]  |
| **creationDate** | **Date** |  | [optional]  |
| **duration** | **Long** |  | [optional]  |
| **foreach** | **Boolean** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **index** | **Integer** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional]  |
| **parentRef** | **String** |  | [optional]  |
| **phase** | **String** |  | [optional] Enum: `queued`, `pending`, `running`, `completed`  |
| **results** | **List** of [**RunResult**](RunResult) |  | [optional]  |
| **reusedFromRef** | **String** |  | [optional]  |
| **spec** | [**TaskRunSpec**](TaskRunSpec) |  | [optional]  |
| **startTime** | **Date** |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `notstarted`, `ready`, `running`, `waiting`, `succeeded`, `failed`, `invalid`, `skipped`, `cancelled`, `timedout`  |
| **statusMessage** | **String** |  | [optional]  |
| **statusReason** | **String** |  | [optional]  |
| **taskRef** | **String** |  | [optional]  |
| **taskVersion** | **Integer** |  | [optional]  |
| **timeout** | **Long** |  | [optional]  |
| **type** | **String** |  | [optional] Enum: `start`, `end`, `template`, `custom`, `generic`, `decision`, `approval`, `setwfproperty`, `manual`, `eventwait`, `acquirelock`, `releaselock`, `runworkflow`, `runscheduledworkflow`, `script`, `ai`, `setwfstatus`, `sleep`, `uploadartifact`, `downloadartifact`  |
| **workflowName** | **String** |  | [optional]  |
| **workflowRef** | **String** |  | [optional]  |
| **workflowRevisionRef** | **String** |  | [optional]  |
| **workflowRunRef** | **String** |  | [optional]  |
| **workspace** | [**WorkflowWorkspace**](WorkflowWorkspace) |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

