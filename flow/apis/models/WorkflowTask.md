---
title: Workflow Task Model
---

# Workflow Task Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **name** | **String** |  | [optional] [default to null] |
| **type** | **String** |  | [optional] [default to null] |
| **timeout** | **Long** |  | [optional] [default to null] |
| **dependencies** | [**List**](WorkflowTaskDependency) |  | [optional] [default to null] |
| **taskRef** | **String** |  | [optional] [default to null] |
| **taskVersion** | **Integer** |  | [optional] [default to null] |
| **upgradesAvailable** | **Boolean** |  | [optional] [default to null] |
| **labels** | **Map** |  | [optional] [default to null] |
| **annotations** | **Map** |  | [optional] [default to null] |
| **params** | [**List**](RunParam) |  | [optional] [default to null] |
| **results** | [**List**](ResultSpec) |  | [optional] [default to null] |
| **workspaces** | [**List**](TaskWorkspace) |  | [optional] [default to null] |
| **unknownFields** | **Map** |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

