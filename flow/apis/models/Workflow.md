---
title: Workflow Model
verified: "5.0.0-beta.39"
---

# Workflow Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional]  |
| **changelog** | [**ChangeLog**](ChangeLog) |  | [optional]  |
| **concurrency** | [**WorkflowConcurrency**](WorkflowConcurrency) |  | [optional]  |
| **creationDate** | **Date** |  | [optional]  |
| **description** | **String** |  | [optional]  |
| **displayName** | **String** |  | [optional]  |
| **icon** | **String** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **legacyWorkflowStorage** | **Boolean** |  | [optional]  |
| **markdown** | **String** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **params** | **List** of [**AbstractParam**](AbstractParam) |  | [optional]  |
| **retries** | **Long** |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `active`, `inactive`, `deleted`  |
| **tasks** | **List** of [**WorkflowTask**](WorkflowTask) |  | [optional]  |
| **templateRef** | [**WorkflowTemplateRef**](WorkflowTemplateRef) |  | [optional]  |
| **timeout** | **Long** |  | [optional]  |
| **triggers** | [**WorkflowTrigger**](WorkflowTrigger) |  | [optional]  |
| **type** | **String** |  | [optional] Enum: `workflow`, `template`, `starter`  |
| **upgradesAvailable** | **Boolean** |  | [optional]  |
| **version** | **Integer** |  | [optional]  |
| **workspace** | [**WorkflowWorkspace**](WorkflowWorkspace) |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

