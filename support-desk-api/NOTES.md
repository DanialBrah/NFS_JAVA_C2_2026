# Day 8 Exercise 4: Notes

## 1. Which query parameters did you implement?

- `GET /api/tickets` — `status`, `priority`, `category` (all optional; only one is applied at a
  time, checked in that order, falling back to `findAll()` when none are supplied).
- `GET /api/tickets/paged` — `page` (default `0`), `size` (default `5`), `sortBy` (default
  `createdAt`), `direction` (default `desc`).

## 2. Which fields did you index?

`category`, `priority`, `status`, `createdBy`, and `createdAt` on the `Ticket` model
(`@Indexed`) — the fields actually used for filtering or sorting. Confirmed with
`db.tickets.getIndexes()` in mongosh:

```js
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { category: 1 }, name: 'category' },
  { v: 2, key: { priority: 1 }, name: 'priority' },
  { v: 2, key: { status: 1 }, name: 'status' },
  { v: 2, key: { createdBy: 1 }, name: 'createdBy' },
  { v: 2, key: { createdAt: 1 }, name: 'createdAt' }
]
```

## 3. Why should an API use pagination?

Returning the whole collection in one response doesn't scale — as the number of tickets grows,
response size, memory use, and client render time grow with it, unbounded. Pagination caps each
response to a predictable size, keeps queries fast (MongoDB can skip/limit at the index level
instead of scanning everything), and matches how clients actually consume lists — page by page,
not all at once.

## 4. What log messages appear when you call the filtering endpoint?

From `TicketService.getTickets`, calling `GET /api/tickets?status=OPEN`:

```
INFO ... c.e.supportdesk.service.TicketService : Fetching tickets with filters - status=OPEN, priority=null, category=null
```

The paged endpoint and ticket creation log similarly:

```
INFO ... c.e.supportdesk.service.TicketService : Fetching paginated tickets - page=0, size=2, sortBy=createdAt, direction=desc
INFO ... c.e.supportdesk.service.TicketService : Created ticket with id=6a51e543489d2da8224f21ab
```

## 5. What endpoint proves your sorting works?

`GET /api/tickets/paged?page=0&size=5&sortBy=priority&direction=asc` compared against
`GET /api/tickets/paged?page=0&size=5&sortBy=createdAt&direction=desc` — the same underlying
tickets come back in a different order depending on `sortBy`/`direction`, which only happens if
the `Sort` built in `TicketService.getTicketsPaged` is actually being applied to the MongoDB
query rather than sorting client-side or ignoring the parameter.

---

## Day 8 Exercise 5: Query Behaviour and Troubleshooting

All six requests below were run against a live instance connected to `support_desk_db`
(7 tickets in the collection at the time of testing).

## Test 1: Invalid status value — `GET /api/tickets?status=INVALID`

**Response:** `200 OK`, body `[ ]` (empty array, no error).

**Log:**

```
Fetching tickets with filters - status=INVALID, priority=null, category=null
```

**Observation:** No crash, no error status. `findByStatusIgnoreCase("INVALID")` is a perfectly
valid MongoDB query — it just matches zero documents, since no ticket has that status. The API
can't distinguish "this status doesn't exist as a concept" from "this status exists but nothing
currently has it" — both look identical: an empty list.

## Test 2: Invalid priority value — `GET /api/tickets?priority=URGENT`

**Response:** `200 OK`, body `[ ]`.

**Log:**

```
Fetching tickets with filters - status=null, priority=URGENT, category=null
```

**Observation:** Same story as Test 1. `priority` is a free-text `String` field with no
enum/validation, so `URGENT` is accepted as a syntactically valid filter value even though it's
not one of the priorities the app actually creates (`HIGH`/`MEDIUM`/`LOW`). The API currently
has no concept of "valid" priority values — it will happily filter on any string.

## Test 3: Page number with no records — `GET /api/tickets/paged?page=99&size=5`

**Response:** `200 OK`, no crash.

**Log:**

```
Fetching paginated tickets - page=99, size=5, sortBy=createdAt, direction=desc
```

**Metadata returned:**

```json
{
  "content": [],
  "empty": true,
  "first": false,
  "last": true,
  "number": 99,
  "numberOfElements": 0,
  "totalElements": 7,
  "totalPages": 2
}
```

**Observation:** Spring Data's `Pageable`/`PageRequest` handles out-of-range pages gracefully —
`content` is just empty, `totalElements`/`totalPages` still correctly report the real dataset
size (7 tickets, 2 pages of 5), and `last: true` tells the client plainly that they've gone past
the end. No error, no exception.

## Test 4: Very large page size — `GET /api/tickets/paged?page=0&size=100`

**Response:** `200 OK` — all 7 tickets returned in `content` (fewer than the requested 100, since
that's all that exists).

**Log:**

```
Fetching paginated tickets - page=0, size=100, sortBy=createdAt, direction=desc
```

**Observation:** The API currently accepts *any* `size` value with no upper bound. With only 7
tickets this is harmless, but nothing stops a client from requesting `size=1000000` — at that
point pagination stops protecting the server at all, defeating the entire purpose of having a
paged endpoint (see reflection Q5 below).

## Test 5: Unknown sort field — `GET /api/tickets/paged?page=0&size=5&sortBy=unknownField&direction=asc`

**Response:** `200 OK`, data returned, no error.

**Log:**

```
Fetching paginated tickets - page=0, size=5, sortBy=unknownField, direction=asc
```

**Observation:** No exception is thrown building `Sort.by("unknownField")` — MongoDB accepts a
sort key on a field that doesn't exist on any document and simply treats every document as
"equal" on that key (since none of them have it), so the returned order isn't a validation
error, but it also isn't meaningfully sorted by anything — it just falls back to whatever order
the documents happen to come back in. This is quietly wrong rather than loudly wrong: a client
could easily believe they're getting sorted data when they aren't.

## Test 6: Combined filters — `GET /api/tickets?status=OPEN&priority=HIGH`

**Response:** `200 OK` — returned **all 7** `OPEN` tickets, including ones with `priority`
`MEDIUM`, `LOW`, and `high` (lowercase) — not just the `HIGH`-priority ones.

**Log:**

```
Fetching tickets with filters - status=OPEN, priority=HIGH, category=null
```

**Observation:** The log line proves both params were received correctly, but
`TicketService.getTickets`'s if/else chain (status → priority → category) only ever applies
**one** filter — whichever is checked first and non-blank. `priority=HIGH` is silently dropped
once `status=OPEN` matches. This is the clearest bug surfaced by this exercise: the API accepts
combined filters syntactically but does not honor them, and gives the client no indication
(no warning, no error) that half their request was ignored.

## Reflection Questions

1. **What happened when you used an invalid status?** No error — `200 OK` with an empty list.
   The API treats "unknown status" and "status with no current matches" identically.
2. **What happened when you used an invalid priority?** Same as above — `200 OK`, empty list.
   `priority` has no validation against a fixed set of allowed values.
3. **What happened when you requested page 99?** No crash — `200 OK`, empty `content`, but
   correct `totalElements`/`totalPages` metadata so the client can tell they've overshot.
4. **What happened when you used an unknown sort field?** No crash — `200 OK`, data comes back,
   but the "sort" is meaningless since no document has that field to sort by.
5. **Why should an API limit page size?** An unbounded `size` lets a client force the server to
   load and serialize the entire collection in one request — as the dataset grows this becomes a
   memory, bandwidth, and response-time problem, and defeats the point of paginating at all. A
   sane API clamps `size` to a sensible max (e.g. 100) regardless of what the client asks for.
6. **Why should an API validate sort fields?** Without validation, a typo'd or nonexistent
   `sortBy` fails silently — the client gets a `200` and data that *looks* sorted but isn't,
   which is worse than an error because it's not obviously wrong. Validating against an allow-list
   of sortable fields turns a silent correctness bug into an honest `400 Bad Request`.
7. **Does your current API support combined filters?** No — despite accepting multiple query
   params at once, `TicketService.getTickets` only ever applies the first non-blank one
   (status, then priority, then category) and silently ignores the rest. Confirmed by Test 6.
8. **What log messages helped you understand what happened?** The `Fetching tickets with
   filters - status=..., priority=..., category=...` line was the key piece of evidence — it
   proved the controller/service correctly *received* both `status` and `priority` in Test 6,
   which is what made it possible to pin the bug on the service's filter-selection logic rather
   than on request parsing.
9. **Which behaviour would you improve in a future version?** Combined filtering (Test 6) is the
   highest-priority fix — silently dropping part of a request is the most likely to genuinely
   mislead an API consumer. After that: cap `size` to a maximum, and validate `sortBy` against
   the known sortable fields (`title`, `category`, `priority`, `status`, `createdBy`,
   `createdAt`) and return `400 Bad Request` for anything else.

## Optional: Future improvements

- Combine filters using MongoDB `Criteria`/`Query` (AND together whichever of
  status/priority/category are present) instead of the current if/else-first-match chain.
- Clamp `size` server-side (e.g. `Math.min(size, 100)`) regardless of what's requested.
- Validate `sortBy` against an allow-list before building the `Sort`, returning `400` on an
  unknown field instead of silently no-op sorting.
- Consider whether `status`/`priority` should become enums instead of free-text strings, so
  invalid values are rejected at the DTO/validation layer instead of just returning empty
  results.
