---
title: Artifact Model
verified: "5.0.0-beta.39"
---

# Artifact Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **contentType** | **String** |  | [optional]  |
| **creationDate** | **Date** |  | [optional]  |
| **expirationDate** | **Date** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **retentionDays** | **Integer** |  | [optional]  |
| **scope** | **String** |  | [optional] Enum: `run`, `workflow`, `log`  |
| **sha256** | **String** |  | [optional]  |
| **size** | **Long** |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `uploading`, `available`, `expired`  |
| **taskRunRef** | **String** |  | [optional]  |
| **workflowRef** | **String** |  | [optional]  |
| **workflowRunRef** | **String** |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

