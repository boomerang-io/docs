---
title: Task Model
verified: "5.0.0-beta.39"
---

# Task Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional]  |
| **category** | **String** |  | [optional]  |
| **changelog** | [**ChangeLog**](ChangeLog) |  | [optional]  |
| **creationDate** | **Date** |  | [optional]  |
| **description** | **String** |  | [optional]  |
| **displayName** | **String** |  | [optional]  |
| **icon** | **String** |  | [optional]  |
| **id** | **String** |  | [optional]  |
| **labels** | **Map** of **String** |  | [optional]  |
| **name** | **String** |  | [optional]  |
| **spec** | [**TaskSpec**](TaskSpec) |  | [optional]  |
| **status** | **String** |  | [optional] Enum: `active`, `inactive`  |
| **type** | **String** |  | [optional] Enum: `start`, `end`, `template`, `custom`, `generic`, `decision`, `approval`, `setwfproperty`, `manual`, `eventwait`, `acquirelock`, `releaselock`, `runworkflow`, `runscheduledworkflow`, `script`, `ai`, `setwfstatus`, `sleep`, `uploadartifact`, `downloadartifact`  |
| **verified** | **Boolean** |  | [optional]  |
| **version** | **Integer** |  | [optional]  |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

