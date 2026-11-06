---
title: Token Model
verified: "5.0.0-beta.39"
---

# Token Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **actorKind** | **String** |  | [optional] Enum: `SERVICE`, `AGENT`, `WORKFLOW`  |
| **createdBy** | **String** |  | [optional]  |
| **creationDate** | **Date** |  | [optional]  |
| **description** | **String** |  | [optional]  |
| **expirationDate** | **Date** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **lastUsedAt** | **Date** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **permissions** | **List** of [**ResolvedPermissions**](ResolvedPermissions) |  | [optional]  |
| **principal** | **String** |  | [optional]  |
| **type** | **String** |  | [optional] Enum: `session`, `user`, `key`, `global`  |
| **valid** | **Boolean** |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

