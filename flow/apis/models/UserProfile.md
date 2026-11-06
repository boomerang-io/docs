---
title: User Profile Model
verified: "5.0.0-beta.39"
---

# User Profile Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **creationDate** | **Date** |  | [optional]  |
| **displayName** | **String** |  | [optional]  |
| **email** | **String** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **lastLoginDate** | **Date** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **permissions** | **List** of [**ResolvedPermissions**](ResolvedPermissions) |  | [optional]  |
| **settings** | [**UserSettings**](UserSettings) |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `active`, `inactive`, `pending_deletion`, `deleted`, `archived`  |
| **type** | **String** |  | [optional] Enum: `user`, `admin`, `operator`, `sponsor`, `auditor`, `author`, `partner`, `advisor`  |
| **workspaceMemberCount** | **Long** |  | [optional]  |
| **workspaces** | **List** of [**WorkspaceSummary**](WorkspaceSummary) |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

