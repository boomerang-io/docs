---
title: Task Model
---

# Task Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **annotations** | **Map** of **Any** |  | [optional] [default to null] |
| **category** | **String** |  | [optional] [default to null] |
| **changelog** | [**ChangeLog**](ChangeLog) |  | [optional] [default to null] |
| **creationDate** | **Date** |  | [optional] [default to null] |
| **description** | **String** |  | [optional] [default to null] |
| **displayName** | **String** |  | [optional] [default to null] |
| **icon** | **String** |  | [optional] [default to null] |
| **id** | **String** |  | [optional] [default to null] |
| **labels** | **Map** of **String** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **spec** | [**TaskSpec**](TaskSpec) |  | [optional] [default to null] |
| **status** | **String** |  | [optional] Enum: `active`, `inactive` [default to null] |
| **type** | **String** |  | [optional] Enum: `start`, `end`, `template`, `custom`, `generic`, `decision`, `approval`, `setwfproperty`, `manual`, `eventwait`, `acquirelock`, `releaselock`, `runworkflow`, `runscheduledworkflow`, `script`, `ai`, `setwfstatus`, `sleep`, `uploadartifact`, `downloadartifact` [default to null] |
| **verified** | **Boolean** |  | [optional] [default to null] |
| **version** | **Integer** |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

