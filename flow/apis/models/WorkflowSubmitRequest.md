---
title: Workflow Submit Request Model
verified: "5.0.0-beta.39"
---

# Workflow Submit Request Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional]  |
| **debug** | **Boolean** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional]  |
| **retries** | **Long** |  | [optional]  |
| **timeout** | **Long** |  | [optional]  |
| **trigger** | **String** |  | [optional] Enum: `manual`, `schedule`, `webhook`, `event`, `github`, `engine`, `task`, `retry`  |
| **workflowVersion** | **Integer** |  | [optional]  |
| **workspace** | [**WorkflowWorkspace**](WorkflowWorkspace) |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

