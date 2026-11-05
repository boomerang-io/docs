---
title: Workflow Model
---

# Workflow Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional] [default to null] |
| **changelog** | [**ChangeLog**](ChangeLog) |  | [optional] [default to null] |
| **concurrency** | [**WorkflowConcurrency**](WorkflowConcurrency) |  | [optional] [default to null] |
| **creationDate** | **Date** |  | [optional] [default to null] |
| **description** | **String** |  | [optional] [default to null] |
| **displayName** | **String** |  | [optional] [default to null] |
| **icon** | **String** |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **labels** | **Map** of **String** |  | [optional] [default to null] |
| **legacyWorkflowStorage** | **Boolean** |  | [optional] [default to null] |
| **markdown** | **String** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **params** | **List** of [**AbstractParam**](AbstractParam) |  | [optional] [default to null] |
| **retries** | **Long** |  | [optional] [default to null] |
| **status** | **String** |  | [optional] Enum: `active`, `inactive`, `deleted` [default to null] |
| **tasks** | **List** of [**WorkflowTask**](WorkflowTask) |  | [optional] [default to null] |
| **templateRef** | [**WorkflowTemplateRef**](WorkflowTemplateRef) |  | [optional] [default to null] |
| **timeout** | **Long** |  | [optional] [default to null] |
| **triggers** | [**WorkflowTrigger**](WorkflowTrigger) |  | [optional] [default to null] |
| **type** | **String** |  | [optional] Enum: `workflow`, `template`, `starter` [default to null] |
| **upgradesAvailable** | **Boolean** |  | [optional] [default to null] |
| **version** | **Integer** |  | [optional] [default to null] |
| **workspace** | [**WorkflowWorkspace**](WorkflowWorkspace) |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

