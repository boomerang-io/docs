---
title: Workflow Schedule Model
verified: "5.0.0-beta.39"
---

# Workflow Schedule Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **creationDate** | **Date** |  | [optional]  |
| **cronSchedule** | **String** |  | [optional]  |
| **dateSchedule** | **Date** |  | [optional]  |
| **description** | **String** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **lastFiredAt** | **Date** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **nextFireAt** | **Date** |  | [optional]  |
| **nextScheduleDate** | **Date** |  | [optional]  |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional]  |
| **retryCount** | **Integer** |  | [optional]  |
| **schedulerRef** | **String** |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `active`, `inactive`, `trigger_disabled`, `error`, `completed`, `deleted`  |
| **timezone** | **String** |  | [optional]  |
| **type** | **String** |  | [optional] Enum: `runOnce`, `cron`, `advancedCron`  |
| **workflowRef** | **String** |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

