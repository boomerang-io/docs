---
title: Event Outbox Entity Model
verified: "5.0.0-beta.39"
---

# Event Outbox Entity Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **attempts** | **Integer** |  | [optional]  |
| **deadAt** | **Date** |  | [optional]  |
| **from** | [**RunState**](RunState) |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **lastError** | **String** |  | [optional]  |
| **occurredAt** | **Date** |  | [optional]  |
| **ref** | **String** |  | [optional]  |
| **refType** | **String** |  | [optional]  |
| **retry** | [**RunRetry**](RunRetry) |  | [optional]  |
| **routing** | [**Routing**](Routing) |  | [optional]  |
| **sentAt** | **Date** |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `pending`, `sent`, `dead`  |
| **to** | [**RunState**](RunState) |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

