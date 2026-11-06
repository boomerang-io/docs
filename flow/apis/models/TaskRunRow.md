---
title: Task Run Row Model
verified: "5.0.0-beta.39"
---

# Task Run Row Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **attempt** | **Integer** |  | [optional]  |
| **creationDate** | **Date** |  | [optional]  |
| **duration** | **Long** |  | [optional]  |
| **foreach** | **Boolean** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **index** | **Integer** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **phase** | **String** |  | [optional] Enum: `queued`, `pending`, `running`, `completed`  |
| **startTime** | **Date** |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `notstarted`, `ready`, `running`, `waiting`, `succeeded`, `failed`, `invalid`, `skipped`, `cancelled`, `timedout`  |
| **statusReason** | **String** |  | [optional]  |
| **taskRef** | **String** |  | [optional]  |
| **type** | **String** |  | [optional] Enum: `start`, `end`, `template`, `custom`, `generic`, `decision`, `approval`, `setwfproperty`, `manual`, `eventwait`, `acquirelock`, `releaselock`, `runworkflow`, `runscheduledworkflow`, `script`, `ai`, `setwfstatus`, `sleep`, `uploadartifact`, `downloadartifact`  |
| **workflowName** | **String** |  | [optional]  |
| **workflowRef** | **String** |  | [optional]  |
| **workflowRunRef** | **String** |  | [optional]  |
| **workspace** | **String** |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

