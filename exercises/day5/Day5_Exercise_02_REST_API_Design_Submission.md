# Day 5 Exercise 5.2: REST API Design — Submission

## Scenario Recap
Designing part of an API for an event booking system. Two resources are involved:

- **event** — something a user can view and book a seat at
- **booking** — a record that links a user to an event, with a status (e.g. `CONFIRMED`, `CANCELLED`)

---

## API Specification Table

| Resource | Method | Endpoint | Purpose | Request Body Needed? | Success Status | Possible Error Status |
|---|---|---|---|---:|---:|---:|
| Event | GET | `/api/events` | View all available events | No | 200 | 500 |
| Event | GET | `/api/events/{eventId}` | View details of one event | No | 200 | 404 |
| Booking | POST | `/api/bookings` | Create a new booking for an event | Yes | 201 | 400, 404, 409 |
| Booking | GET | `/api/bookings` | View all bookings | No | 200 | 500 |
| Booking | GET | `/api/bookings/{bookingId}` | View details of one booking | No | 200 | 404 |
| Booking | PATCH | `/api/bookings/{bookingId}` | Cancel a booking by changing its status | Yes | 200 | 400, 404, 409 |

Six endpoints, four distinct HTTP methods (`GET`, `POST`, `PATCH`), all URLs named after the resource (`events`, `bookings`) rather than an action.

---

## Request and Response Planning

| Endpoint | Request Body Description |
|---|---|
| `POST /api/bookings` | The event being booked (`eventId`), who is booking (`customerName`), and how many seats are wanted (`seatsRequested`). |
| `PATCH /api/bookings/{bookingId}` | The new status to move the booking to, e.g. `{ "status": "CANCELLED" }`. Only the status field is needed — the client is not resending the whole booking. |

---

## Error Planning

| Error Case | Related Endpoint | Suitable Status Code | Explanation |
|---|---|---:|---|
| Required field missing (e.g. `eventId` or `seatsRequested` not sent) | `POST /api/bookings` | 400 | The server cannot create a valid booking without knowing which event and how many seats, so it rejects the request before touching any data. |
| Event does not exist | `GET /api/events/{eventId}` | 404 | The `eventId` in the URL does not match any event in the system, so there is nothing to return. |
| Booking does not exist | `GET /api/bookings/{bookingId}` or `PATCH /api/bookings/{bookingId}` | 404 | The `bookingId` in the URL does not match any booking on record, so the server has no resource to show or update. |
| Event is fully booked | `POST /api/bookings` | 409 | The event exists and the request is well-formed, but there are not enough free seats left to satisfy `seatsRequested`. This is a conflict between the request and the current state of the resource, not a malformed request, so `409 Conflict` fits better than `400`. |
| Booking is already cancelled | `PATCH /api/bookings/{bookingId}` | 409 | The booking exists, but it is already in the `CANCELLED` state, so cancelling it again is a conflicting operation, not a missing resource or bad input. |
| Invalid quantity (`seatsRequested` is 0 or negative) | `POST /api/bookings` | 400 | The field is present but its value doesn't make sense for a booking, so this is a client input error caught by validation. |

---

## Why These Endpoint Names Follow REST Principles

Every URL is named after a **resource** (`events`, `bookings`), never after an action. The HTTP **method** is what expresses the action, not the URL:

- `GET /api/events` and `GET /api/bookings` read a collection.
- `GET /api/events/{eventId}` and `GET /api/bookings/{bookingId}` read one specific item, identified by its ID in the path rather than a query parameter or a differently-named endpoint.
- `POST /api/bookings` creates a new item inside the `bookings` collection — the "create" behaviour comes from the `POST` verb, not from a name like `/createBooking`.
- Cancelling a booking is modelled as `PATCH /api/bookings/{bookingId}` with a body that changes the `status` field, instead of a `/cancelBooking` endpoint. A cancellation is a state change on an existing resource (the booking still exists, just with a different status, preserving history for reporting/auditing), so `PATCH` on the resource's own URL is more accurate than `DELETE` (which implies the record is gone) or an action-named endpoint (which hides the state change behind a verb in the URL).

Because the URL only ever identifies *what* the resource is, and the HTTP method plus body describe *what to do with it*, the same two resource paths (`/api/events`, `/api/bookings`) cover all six required operations without needing any action-style names.
