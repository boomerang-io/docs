---
title: Workflow Task Model
---

# Workflow Task Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional] [default to null] |
| **dependencies** | **List** of [**WorkflowTaskDependency**](WorkflowTaskDependency) |  | [optional] [default to null] |
| **foreach** | [**WorkflowTaskForeach**](WorkflowTaskForeach) |  | [optional] [default to null] |
| **labels** | **Map** of **String** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional] [default to null] |
| **results** | **List** of [**ResultSpec**](ResultSpec) |  | [optional] [default to null] |
| **retry** | [**WorkflowTaskRetry**](WorkflowTaskRetry) |  | [optional] [default to null] |
| **taskRef** | **String** |  | [optional] [default to null] |
| **taskVersion** | **Integer** |  | [optional] [default to null] |
| **timeout** | **Long** |  | [optional] [default to null] |
| **type** | **String** |  | [optional] Enum: `start`, `end`, `template`, `custom`, `generic`, `decision`, `approval`, `setwfproperty`, `manual`, `eventwait`, `acquirelock`, `releaselock`, `runworkflow`, `runscheduledworkflow`, `script`, `ai`, `setwfstatus`, `sleep`, `uploadartifact`, `downloadartifact` [default to null] |
| **unknownFields** | **Map** of **Any** |  | [optional] [default to null] |
| **upgradesAvailable** | **Boolean** |  | [optional] [default to null] |
| **workspace** | **Boolean** |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

