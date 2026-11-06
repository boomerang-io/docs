---
title: Audit
description: "Operations for Audit: Query the security audit trail: who did what, when, and with what outcome."
verified: "5.0.0-beta.39"
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
| **actor** | **String** | false | Actor id or name, any part of either, ignoring case |  |  |
| **action** | **List** of **String** | false | AuditAction names to filter for |  Enum: [CREATE, READ, UPDATE, DELETE, DUPLICATE, SUBMIT, EXPORT, IMPORT, TOKEN_CREATE, TOKEN_REVOKE] | `CREATE,DELETE` |
| **outcome** | **List** of **String** | false | AuditOutcome names to filter for |  Enum: [SUCCESS, FAILED, DENIED] | `DENIED` |
| **level** | **List** of **String** | false | The level the event was captured at |  Enum: [DESTRUCTIVE, WRITE, ALL] | `DESTRUCTIVE` |
| **resourceType** | **List** of **String** | false | Resource types to filter for |  | `workflow` |
| **resourceId** | **String** | false | A single resource id |  |  |
| **workspaceId** | **List** of **String** | false | Owning workspace ids to filter for |  |  |
| **from** | **Date** | false | ISO-8601 instant; defaults to 30 days ago |  | `2026-09-01T00:00:00Z` |
| **to** | **Date** | false | ISO-8601 instant, exclusive |  | `2026-10-01T00:00:00Z` |
| **page** | **Integer** | false | Page Number | Defaults to `0`. | `0` |
| **limit** | **Integer** | false | Result Size, capped at 100 | Defaults to `25`. | `25` |
| **order** | **String** | false | Ascending or Descending (default) by time | Defaults to `DESC`. Enum: [ASC, DESC] |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**PageAuditEvent**](./models/PageAuditEvent)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/audit" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/audit -->
<!-- api-examples:end -->


## Count the audit trail by outcome

`GET /api/v2/audit/stats`

Counts the same filters and window as the listing, alongside the configured capture state, level and retention.

Requires the `system/read` permission, from a session, user, global token.

#### Request parameters


| Name | Type | Required | Description | Notes | Example |
| ---- | ---- | -------- | ----------- | ----- | ------- |
| **actor** | **String** | false |  |  |  |
| **action** | **List** of **String** | false |  |  Enum: [CREATE, READ, UPDATE, DELETE, DUPLICATE, SUBMIT, EXPORT, IMPORT, TOKEN_CREATE, TOKEN_REVOKE] |  |
| **outcome** | **List** of **String** | false |  |  Enum: [SUCCESS, FAILED, DENIED] |  |
| **level** | **List** of **String** | false |  |  Enum: [DESTRUCTIVE, WRITE, ALL] |  |
| **resourceType** | **List** of **String** | false |  |  |  |
| **resourceId** | **String** | false |  |  |  |
| **workspaceId** | **List** of **String** | false |  |  |  |
| **from** | **Date** | false |  |  |  |
| **to** | **Date** | false |  |  |  |


#### Request body
This endpoint does not require a request body.

#### Authorization

One of [BearerAuth](./overview#bearerauth), [x-access-token](./overview#x-access-token)

#### Request headers

- **Content-Type**: `Not defined`
- **Accept**: `*/*`

#### Response

[**AuditStats**](./models/AuditStats)

#### Example request

```bash
curl -X GET "$FLOW_URL/api/v2/audit/stats" \
  -H "Authorization: Bearer $FLOW_TOKEN"
```

<!-- api-examples:start GET /api/v2/audit/stats -->
<!-- api-examples:end -->

