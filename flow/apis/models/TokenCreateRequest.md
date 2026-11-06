---
title: Token Create Request Model
verified: "5.0.0-beta.39"
---

# Token Create Request Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **actorKind** | **String** |  | [optional] Enum: `SERVICE`, `AGENT`, `WORKFLOW`  |
| **description** | **String** |  | [optional]  |
| **expirationDate** | **Date** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **permissions** | **List** of **String** |  | [optional]  |
| **principal** | **String** |  | [optional]  |
| **role** | **String** |  | [optional]  |
| **type** | **String** |  | [optional] Enum: `session`, `user`, `key`, `global`  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

