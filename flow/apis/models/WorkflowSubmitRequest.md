---
title: Workflow Submit Request Model
---

# Workflow Submit Request Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional] [default to null] |
| **debug** | **Boolean** |  | [optional] [default to null] |
| **labels** | **Map** of **String** |  | [optional] [default to null] |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional] [default to null] |
| **retries** | **Long** |  | [optional] [default to null] |
| **timeout** | **Long** |  | [optional] [default to null] |
| **trigger** | **String** |  | [optional] Enum: `manual`, `schedule`, `webhook`, `event`, `github`, `engine`, `task`, `retry` [default to null] |
| **workflowVersion** | **Integer** |  | [optional] [default to null] |
| **workspace** | [**WorkflowWorkspace**](WorkflowWorkspace) |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

