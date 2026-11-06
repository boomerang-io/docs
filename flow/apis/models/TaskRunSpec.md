---
title: Task Run Spec Model
verified: "5.0.0-beta.39"
---

# Task Run Spec Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **arguments** | **List** of **String** |  | [optional]  |
| **command** | **List** of **String** |  | [optional]  |
| **debug** | **Boolean** |  | [optional]  |
| **deletion** | **String** |  | [optional] Enum: `Never`, `OnSuccess`, `Always`  |
| **envs** | **List** of [**TaskEnvVar**](TaskEnvVar) |  | [optional]  |
| **image** | **String** |  | [optional]  |
| **script** | **String** |  | [optional]  |
| **timeout** | **Integer** |  | [optional]  |
| **workingDir** | **String** |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

