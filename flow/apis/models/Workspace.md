---
title: Workspace Model
verified: "5.0.0-beta.39"
---

# Workspace Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **approverGroups** | **List** of [**ApproverGroup**](ApproverGroup) |  | [optional]  |
| **creationDate** | **Date** |  | [optional]  |
| **displayName** | **String** |  | [optional]  |
| **externalRef** | **String** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **members** | **List** of [**WorkspaceMember**](WorkspaceMember) |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **parameters** | **List** of [**AbstractParam**](AbstractParam) |  | [optional]  |
| **quotas** | [**CurrentQuotas**](CurrentQuotas) |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `active`, `inactive`  |
| **type** | **String** |  | [optional] Enum: `personal`, `hobby`, `pro`, `enterprise`, `system`  |
| **workflows** | **List** of [**WorkflowSummary**](WorkflowSummary) |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

