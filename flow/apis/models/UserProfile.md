---
title: User Profile Model
---

# User Profile Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **creationDate** | **Date** |  | [optional] [default to null] |
| **displayName** | **String** |  | [optional] [default to null] |
| **email** | **String** |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **labels** | **Map** of **String** |  | [optional] [default to null] |
| **lastLoginDate** | **Date** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **permissions** | **List** of [**ResolvedPermissions**](ResolvedPermissions) |  | [optional] [default to null] |
| **settings** | [**UserSettings**](UserSettings) |  | [optional] [default to null] |
| **status** | **String** |  | [optional] Enum: `active`, `inactive`, `pending_deletion`, `deleted`, `archived` [default to null] |
| **type** | **String** |  | [optional] Enum: `user`, `admin`, `operator`, `sponsor`, `auditor`, `author`, `partner`, `advisor` [default to null] |
| **workspaceMemberCount** | **Long** |  | [optional] [default to null] |
| **workspaces** | **List** of [**WorkspaceSummary**](WorkspaceSummary) |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

