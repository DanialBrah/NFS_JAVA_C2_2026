# Day 17 Exercise 04 — Performance and Index Review (Support Desk API)

Collection: `tickets` (and `users` for the uniqueness comparison), database `support_desk_db`.

## 1. Fields used for filtering

| Field | Where | Indexed today? |
|---|---|---|
| `status` | `GET /api/tickets` / `GET /api/v1/tickets?status=` → `TicketRepository.findByStatusIgnoreCase` | Yes |
| `priority` | same endpoints, `?priority=` → `findByPriorityIgnoreCase` | Yes |
| `category` | same endpoints, `?category=` → `findByCategoryIgnoreCase` | Yes |

Note: `TicketService.getTickets` only applies **one** filter at a time (`status`, else `priority`, else `category`, else all) — it's an `if / else if` chain, not a combined query. So today's query shape never needs a *compound* index; three separate single-field indexes match how the app actually queries. If combined filtering (e.g. `status` **and** `priority` together) is added later, that's when a compound index on `{status: 1, priority: 1}` would start to matter — add it then, not preemptively.

## 2. Fields used for sorting

| Field | Where | Indexed today? |
|---|---|---|
| `createdAt` (default) | `GET /api/tickets/paged` / `GET /api/v1/tickets/paged?sortBy=` | Yes |
| *any other field* | same `sortBy` param | Only if it happens to be one of the four `@Indexed` fields below |

**Finding:** `TicketService.getTicketsPaged` passes `sortBy` straight into `Sort.by(sortBy)` with no whitelist or validation. A caller can request `sortBy=title` or `sortBy=description` — both unindexed — which forces MongoDB into an in-memory sort instead of using an index, and at larger collection sizes risks hitting the 32MB in-memory sort limit outright. Worth either validating `sortBy` against an allow-list (`status`, `priority`, `category`, `createdAt`) in the controller/service, or accepting that unindexed sort fields are a known, deliberate trade-off for now.

`createdAt` itself is stored as a plain `String` (`LocalDate.now().toString()`, e.g. `"2026-08-19"`) rather than a `Date`/`Instant`. Sorting still works correctly today only because ISO-8601 date strings happen to sort lexicographically the same as chronologically — but it's day-granularity only (no time component) and won't support range queries (`$gte`/`$lte` on real dates) if that's ever needed.

## 3. Fields that should be unique

| Field | Collection | Unique today? |
|---|---|---|
| `email` | `users` | **Yes** — `@Indexed(unique = true)` on `AppUser.email`, confirmed live below |
| *(ticket number)* | `tickets` | **N/A — doesn't exist** |

The exercise prompt lists "ticket number" as a field to think about, but `Ticket.java` has **no such field**. The only identifier is Mongo's own `_id` (ObjectId) — there's no human-readable, sequential, or externally-referenceable ticket number. If one gets added later (e.g. `TKT-2026-0001` style, matching the `assetTag` pattern in the sibling asset-tracker project), it should get `@Indexed(unique = true)` immediately, the same way `AppUser.email` and `Asset.assetTag` do — otherwise duplicate ticket numbers become possible under concurrent creation.

## 4. Fields used in reports

| Report endpoint | Group-by field | Indexed today? |
|---|---|---|
| `GET /api/v1/reports/tickets-by-status` | `status` | Yes |
| `GET /api/v1/reports/tickets-by-priority` | `priority` | Yes |

`category` is indexed and filterable but **not** currently used by any report — there's no `tickets-by-category` endpoint, unlike the asset-tracker project which has an equivalent `assets-by-category` report. Not a problem, just worth noting the index exists ahead of that use case (or is simply there for the filter, independent of reporting).

`createdBy` is `@Indexed` but isn't used anywhere yet — no controller exposes filtering or reporting by it. It's presumably there for a future "my tickets" view. Until that exists, it's a maintained index with no current query backing it (small write-cost, no read benefit yet).

## 5. Current indexes — mongosh evidence

```text
> db.tickets.getIndexes()
{ v: 2, key: { _id: 1 }, name: '_id_' }
{ v: 2, key: { category: 1 }, name: 'category' }
{ v: 2, key: { priority: 1 }, name: 'priority' }
{ v: 2, key: { status: 1 }, name: 'status' }
{ v: 2, key: { createdBy: 1 }, name: 'createdBy' }
{ v: 2, key: { createdAt: 1 }, name: 'createdAt' }

> db.users.getIndexes()
{ v: 2, key: { _id: 1 }, name: '_id_' }
{ v: 2, key: { email: 1 }, name: 'email', unique: true }
```

This matches the `@Indexed` annotations in `Ticket.java` (`category`, `priority`, `status`, `createdBy`, `createdAt`) and `AppUser.java` (`email`, unique) exactly — `spring.data.mongodb.auto-index-creation=true` is doing its job.

## Summary / recommendations

- Current single-field indexes on `status`, `priority`, `category` correctly match the app's current (single-condition) filter queries — no changes needed there.
- Add an allow-list for the `sortBy` param on the paged endpoints, or accept the documented risk of unindexed in-memory sorts on `title`/`description`.
- If a `ticketNumber` field is ever introduced, index it as `unique = true` from day one.
- `createdBy` index currently has no query backing it — harmless, but keep in mind if reviewing index bloat later.
- Consider whether `createdAt` should become a real `Date`/`Instant` if time-based range queries (e.g. "tickets created in the last 7 days") are ever needed — the current string field can't support that.
