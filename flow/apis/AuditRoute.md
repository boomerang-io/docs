---
title: Audit
---

# Audit

| Name | Method | Endpoint |
| ---- | ------ | -------- |
| [**Query the audit trail**](#query-the-audit-trail) | GET | `/api/v2/audit` |
| [**Count the audit trail by outcome**](#count-the-audit-trail-by-outcome) | GET | `/api/v2/audit/stats` |



## Query the audit trail

`GET /api/v2/audit`

One event per audited attempt, newest first, including failed and denied ones. Without a from date the last 30 days are returned.

Requires the `system/read` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **actor** | **String** | false | Actor id or name, any part of either, ignoring case | Defaults to null. | actor_example |
| **action** | **List** of **String** | false | AuditAction names to filter for | Defaults to null. Enum: [CREATE, READ, UPDATE, DELETE, DUPLICATE, SUBMIT, EXPORT, IMPORT, TOKEN_CREATE, TOKEN_REVOKE] | CREATE,DELETE |
| **outcome** | **List** of **String** | false | AuditOutcome names to filter for | Defaults to null. Enum: [SUCCESS, FAILED, DENIED] | DENIED |
| **level** | **List** of **String** | false | The level the event was captured at | Defaults to null. Enum: [DESTRUCTIVE, WRITE, ALL] | DESTRUCTIVE |
| **resourceType** | **List** of **String** | false | Resource types to filter for | Defaults to null. | workflow |
| **resourceId** | **String** | false | A single resource id | Defaults to null. | resourceId_example |
| **workspaceId** | **List** of **String** | false | Owning workspace ids to filter for | Defaults to null. |  |
| **from** | **Date** | false | ISO-8601 instant; defaults to 30 days ago | Defaults to null. | 2026-09-01T00:00:00Z |
| **to** | **Date** | false | ISO-8601 instant, exclusive | Defaults to null. | 2026-10-01T00:00:00Z |
| **page** | **Integer** | false | Page Number | Defaults to 0. | 0 |
| **limit** | **Integer** | false | Result Size, capped at 100 | Defaults to 25. | 25 |
| **order** | **String** | false | Ascending or Descending (default) by time | Defaults to DESC. Enum: [ASC, DESC] | order_example |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageAuditEvent**](./models/PageAuditEvent)


## Count the audit trail by outcome

`GET /api/v2/audit/stats`

Counts the same filters and window as the listing, alongside the configured capture state, level and retention.

Requires the `system/read` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **actor** | **String** | false |  | Defaults to null. | actor_example |
| **action** | **List** of **String** | false |  | Defaults to null. Enum: [CREATE, READ, UPDATE, DELETE, DUPLICATE, SUBMIT, EXPORT, IMPORT, TOKEN_CREATE, TOKEN_REVOKE] |  |
| **outcome** | **List** of **String** | false |  | Defaults to null. Enum: [SUCCESS, FAILED, DENIED] |  |
| **level** | **List** of **String** | false |  | Defaults to null. Enum: [DESTRUCTIVE, WRITE, ALL] |  |
| **resourceType** | **List** of **String** | false |  | Defaults to null. |  |
| **resourceId** | **String** | false |  | Defaults to null. | resourceId_example |
| **workspaceId** | **List** of **String** | false |  | Defaults to null. |  |
| **from** | **Date** | false |  | Defaults to null. | 2013-10-20T19:20:30+01:00 |
| **to** | **Date** | false |  | Defaults to null. | 2013-10-20T19:20:30+01:00 |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**AuditStats**](./models/AuditStats)

