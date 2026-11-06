---
title: Workflow Canvas Model
verified: "5.0.0-beta.39"
---

# Workflow Canvas Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional]  |
| **changelog** | [**ChangeLog**](ChangeLog) |  | [optional]  |
| **concurrency** | [**WorkflowConcurrency**](WorkflowConcurrency) |  | [optional]  |
| **config** | **List** of [**AbstractParam**](AbstractParam) |  | [optional]  |
| **creationDate** | **Date** |  | [optional]  |
| **description** | **String** |  | [optional]  |
| **displayName** | **String** |  | [optional]  |
| **edges** | **List** of [**CanvasEdge**](CanvasEdge) |  | [optional]  |
| **icon** | **String** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **legacyWorkflowStorage** | **Boolean** |  | [optional]  |
| **markdown** | **String** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **nodes** | **List** of [**CanvasNode**](CanvasNode) |  | [optional]  |
| **retries** | **Long** |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `active`, `inactive`, `deleted`  |
| **timeout** | **Long** |  | [optional]  |
| **triggers** | [**WorkflowTrigger**](WorkflowTrigger) |  | [optional]  |
| **unknownFields** | **Map** of **Any** |  | [optional]  |
| **upgradesAvailable** | **Boolean** |  | [optional]  |
| **version** | **Integer** |  | [optional]  |
| **workspace** | [**WorkflowWorkspace**](WorkflowWorkspace) |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

