---
title: Workflow Run Model
---

# Workflow Run Model
## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
| **id** | **String** |  | [optional] [default to null] |
| **creationDate** | **Date** |  | [optional] [default to null] |
| **status** | **String** |  | [optional] [default to null] |
| **phase** | **String** |  | [optional] [default to null] |
| **startTime** | **Date** |  | [optional] [default to null] |
| **duration** | **Long** |  | [optional] [default to null] |
| **statusMessage** | **String** |  | [optional] [default to null] |
| **timeout** | **Long** |  | [optional] [default to null] |
| **retries** | **Long** |  | [optional] [default to null] |
| **workflowRef** | **String** |  | [optional] [default to null] |
| **workflowRevisionRef** | **String** |  | [optional] [default to null] |
| **labels** | **Map** |  | [optional] [default to null] |
| **annotations** | **Map** |  | [optional] [default to null] |
| **params** | [**List**](RunParam) |  | [optional] [default to null] |
| **tasks** | [**List**](TaskRun) |  | [optional] [default to null] |
| **debug** | **Boolean** |  | [optional] [default to null] |
| **workflowName** | **String** |  | [optional] [default to null] |
| **workflowVersion** | **Integer** |  | [optional] [default to null] |
| **trigger** | **String** |  | [optional] [default to null] |
| **initiatedByRef** | **String** |  | [optional] [default to null] |
| **results** | [**List**](RunResult) |  | [optional] [default to null] |
| **workspaces** | [**List**](WorkflowWorkspace) |  | [optional] [default to null] |
| **awaitingApproval** | **Boolean** |  | [optional] [default to null] |

[[Back to Models]](../overview#models) [[Back to Routes]](../overview#routes)

