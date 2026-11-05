---
title: Workspace Model
---

# Workspace Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **approverGroups** | **List** of [**ApproverGroup**](ApproverGroup) |  | [optional] [default to null] |
| **creationDate** | **Date** |  | [optional] [default to null] |
| **displayName** | **String** |  | [optional] [default to null] |
| **externalRef** | **String** |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **labels** | **Map** of **String** |  | [optional] [default to null] |
| **members** | **List** of [**WorkspaceMember**](WorkspaceMember) |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **parameters** | **List** of [**AbstractParam**](AbstractParam) |  | [optional] [default to null] |
| **quotas** | [**CurrentQuotas**](CurrentQuotas) |  | [optional] [default to null] |
| **status** | **String** |  | [optional] Enum: `active`, `inactive` [default to null] |
| **type** | **String** |  | [optional] Enum: `personal`, `hobby`, `pro`, `enterprise`, `system` [default to null] |
| **workflows** | **List** of [**WorkflowSummary**](WorkflowSummary) |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

