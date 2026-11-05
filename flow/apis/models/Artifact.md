---
title: Artifact Model
---

# Artifact Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **contentType** | **String** |  | [optional] [default to null] |
| **creationDate** | **Date** |  | [optional] [default to null] |
| **expirationDate** | **Date** |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **retentionDays** | **Integer** |  | [optional] [default to null] |
| **scope** | **String** |  | [optional] Enum: `run`, `workflow`, `log` [default to null] |
| **sha256** | **String** |  | [optional] [default to null] |
| **size** | **Long** |  | [optional] [default to null] |
| **status** | **String** |  | [optional] Enum: `uploading`, `available`, `expired` [default to null] |
| **taskRunRef** | **String** |  | [optional] [default to null] |
| **workflowRef** | **String** |  | [optional] [default to null] |
| **workflowRunRef** | **String** |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

