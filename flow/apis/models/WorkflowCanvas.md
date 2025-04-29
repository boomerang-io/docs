---
title: Workflow Canvas Model
---

# Workflow Canvas Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **id** | **String** |  | [optional] [default to null] |
| **name** | **String** |  | [optional] [default to null] |
| **status** | **String** |  | [optional] [default to null] |
| **version** | **Integer** |  | [optional] [default to null] |
| **creationDate** | **Date** |  | [optional] [default to null] |
| **changelog** | [**ChangeLog**](ChangeLog) |  | [optional] [default to null] |
| **icon** | **String** |  | [optional] [default to null] |
| **description** | **String** |  | [optional] [default to null] |
| **markdown** | **String** |  | [optional] [default to null] |
| **labels** | **Map** |  | [optional] [default to null] |
| **annotations** | **Map** |  | [optional] [default to null] |
| **timeout** | **Long** |  | [optional] [default to null] |
| **retries** | **Long** |  | [optional] [default to null] |
| **upgradesAvailable** | **Boolean** |  | [optional] [default to null] |
| **triggers** | [**WorkflowTrigger**](WorkflowTrigger) |  | [optional] [default to null] |
| **workspaces** | [**List**](WorkflowWorkspace) |  | [optional] [default to null] |
| **config** | [**List**](AbstractParam) |  | [optional] [default to null] |
| **unknownFields** | **Map** |  | [optional] [default to null] |
| **nodes** | [**List**](CanvasNode) |  | [optional] [default to null] |
| **edges** | [**List**](CanvasEdge) |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

