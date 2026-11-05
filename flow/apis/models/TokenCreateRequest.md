---
title: Token Create Request Model
---

# Token Create Request Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **actorKind** | **String** |  | [optional] Enum: `SERVICE`, `AGENT`, `WORKFLOW` [default to null] |
| **description** | **String** |  | [optional] [default to null] |
| **expirationDate** | **Date** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **permissions** | **List** of **String** |  | [optional] [default to null] |
| **principal** | **String** |  | [optional] [default to null] |
| **role** | **String** |  | [optional] [default to null] |
| **type** | **String** |  | [optional] Enum: `session`, `user`, `key`, `global` [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

