---
title: Event Outbox Entity Model
---

# Event Outbox Entity Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **attempts** | **Integer** |  | [optional] [default to null] |
| **deadAt** | **Date** |  | [optional] [default to null] |
| **from** | [**RunState**](RunState) |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **lastError** | **String** |  | [optional] [default to null] |
| **occurredAt** | **Date** |  | [optional] [default to null] |
| **ref** | **String** |  | [optional] [default to null] |
| **refType** | **String** |  | [optional] [default to null] |
| **retry** | [**RunRetry**](RunRetry) |  | [optional] [default to null] |
| **routing** | [**Routing**](Routing) |  | [optional] [default to null] |
| **sentAt** | **Date** |  | [optional] [default to null] |
| **status** | **String** |  | [optional] Enum: `pending`, `sent`, `dead` [default to null] |
| **to** | [**RunState**](RunState) |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

