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
