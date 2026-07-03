# Day 5 Final Exercise: Add Booking Endpoints to the Mock API — Submission

## What Was Completed

All minimum requirements plus the optional DELETE/cancel endpoint were implemented in `rest-basics/mock-api.js`:

| Endpoint | Status |
|---|---|
| `GET /api/bookings` | Done |
| `GET /api/bookings/{id}` | Done |
| `POST /api/bookings` | Done |
| Invalid booking data returns `400` | Done |
| Unknown event ID returns `404` | Done |
| Not enough seats returns `400` | Done |
| Successful booking returns `201` | Done |
| Available seats reduce after a successful booking | Done |
| Optional: `DELETE /api/bookings/{id}` cancels a booking, restores seats, returns updated booking | Done |
| Extra: cancelling an already-cancelled booking returns `409 Conflict` instead of silently re-cancelling | Done |

## Implementation Notes

- `bookings` is a new in-memory array (`let bookings = [];`), same pattern as `courseOfferings` and `instructors` — resets when the server restarts.
- `validateBooking(payload)` checks `eventId`, `participantName`, `participantEmail` are present and `seats` is a whole number greater than 0, returning a `{ field, message }` error array, consistent with `validateCourseOffering` / `validateInstructor`.
- `POST /api/bookings` validation order matters: structural validation (400) runs first, then event-existence check (404), then seat-availability check (400). This ensures a request with both a missing field and a bad event ID reports the missing field first, since that's the more fundamental problem.
- A successful booking directly mutates the matching object in the `events` array (`event.availableSeats -= payload.seats`), so a follow-up `GET /api/events` or `GET /api/events/{id}` immediately reflects the reduced seat count.
- `DELETE /api/bookings/{id}` does not remove the booking from the array — it sets `status` to `"CANCELLED"` and adds the seats back to the related event, preserving booking history as required.
- CORS `Access-Control-Allow-Methods` header was updated to include `DELETE` since the optional endpoint uses it.

## Test Results

All 6 required test cases from Part I (plus the 2 DELETE cases) were run live against the running server and produced the expected status codes:

1. `GET /api/bookings` (empty) → `200`, `[]`
2. `POST /api/bookings` valid (EV001, 2 seats) → `201`, booking created, EV001 seats dropped from 120 to 118
3. `GET /api/bookings/BK001` → `200`, returns the created booking
4. `POST /api/bookings` missing fields → `400`, 4 validation errors listed
5. `POST /api/bookings` with `eventId: "EV999"` → `404`, `"Event EV999 was not found"`
6. `POST /api/bookings` requesting 100 seats on EV002 (35 available) → `400`, `"Not enough seats available"`
7. `DELETE /api/bookings/BK001` → `200`, status changed to `CANCELLED`, EV001 seats restored to 120
8. `DELETE /api/bookings/BK001` again → `409`, `"Booking BK001 is already cancelled"`

Full request examples are recorded in `rest-basics/requests.http` (entries 7–15).
