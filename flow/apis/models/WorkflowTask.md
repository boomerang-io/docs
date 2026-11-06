---
title: Workflow Task Model
verified: "5.0.0-beta.39"
---

# Workflow Task Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional]  |
| **dependencies** | **List** of [**WorkflowTaskDependency**](WorkflowTaskDependency) |  | [optional]  |
| **foreach** | [**WorkflowTaskForeach**](WorkflowTaskForeach) |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional]  |
| **results** | **List** of [**ResultSpec**](ResultSpec) |  | [optional]  |
| **retry** | [**WorkflowTaskRetry**](WorkflowTaskRetry) |  | [optional]  |
| **taskRef** | **String** |  | [optional]  |
| **taskVersion** | **Integer** |  | [optional]  |
| **timeout** | **Long** |  | [optional]  |
| **type** | **String** |  | [optional] Enum: `start`, `end`, `template`, `custom`, `generic`, `decision`, `approval`, `setwfproperty`, `manual`, `eventwait`, `acquirelock`, `releaselock`, `runworkflow`, `runscheduledworkflow`, `script`, `ai`, `setwfstatus`, `sleep`, `uploadartifact`, `downloadartifact`  |
| **unknownFields** | **Map** of **Any** |  | [optional]  |
| **upgradesAvailable** | **Boolean** |  | [optional]  |
| **workspace** | **Boolean** |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

