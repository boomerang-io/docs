---
title: Task Run Spec Model
---

# Task Run Spec Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **arguments** | **List** of **String** |  | [optional] [default to null] |
| **command** | **List** of **String** |  | [optional] [default to null] |
| **debug** | **Boolean** |  | [optional] [default to null] |
| **deletion** | **String** |  | [optional] Enum: `Never`, `OnSuccess`, `Always` [default to null] |
| **envs** | **List** of [**TaskEnvVar**](TaskEnvVar) |  | [optional] [default to null] |
| **image** | **String** |  | [optional] [default to null] |
| **script** | **String** |  | [optional] [default to null] |
| **timeout** | **Integer** |  | [optional] [default to null] |
| **workingDir** | **String** |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

