---
title: Token Model
---

# Token Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **actorKind** | **String** |  | [optional] Enum: `SERVICE`, `AGENT`, `WORKFLOW` [default to null] |
| **createdBy** | **String** |  | [optional] [default to null] |
| **creationDate** | **Date** |  | [optional] [default to null] |
| **description** | **String** |  | [optional] [default to null] |
| **expirationDate** | **Date** |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **lastUsedAt** | **Date** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **permissions** | **List** of [**ResolvedPermissions**](ResolvedPermissions) |  | [optional] [default to null] |
| **principal** | **String** |  | [optional] [default to null] |
| **type** | **String** |  | [optional] Enum: `session`, `user`, `key`, `global` [default to null] |
| **valid** | **Boolean** |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

