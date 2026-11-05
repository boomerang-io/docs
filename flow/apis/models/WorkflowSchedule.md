---
title: Workflow Schedule Model
---

# Workflow Schedule Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **creationDate** | **Date** |  | [optional] [default to null] |
| **cronSchedule** | **String** |  | [optional] [default to null] |
| **dateSchedule** | **Date** |  | [optional] [default to null] |
| **description** | **String** |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **labels** | **Map** of **String** |  | [optional] [default to null] |
| **lastFiredAt** | **Date** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **nextFireAt** | **Date** |  | [optional] [default to null] |
| **nextScheduleDate** | **Date** |  | [optional] [default to null] |
| **params** | **List** of [**RunParam**](RunParam) |  | [optional] [default to null] |
| **retryCount** | **Integer** |  | [optional] [default to null] |
| **schedulerRef** | **String** |  | [optional] [default to null] |
| **status** | **String** |  | [optional] Enum: `active`, `inactive`, `trigger_disabled`, `error`, `completed`, `deleted` [default to null] |
| **timezone** | **String** |  | [optional] [default to null] |
| **type** | **String** |  | [optional] Enum: `runOnce`, `cron`, `advancedCron` [default to null] |
| **workflowRef** | **String** |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

