# Day 16 Ticket Refactor — Before/After Rationale

## Summary

Three small, independently-reviewable refactors to the ticket create/update path: extracting
repeated lookup/normalization logic in the backend service, extracting validation out of the
frontend form page into a testable utility, and hardening the tests for that utility. No
endpoint, DTO, or user-visible message changed.

## Files changed

| Commit | File | What changed |
|---|---|---|
| `c7ec9ab` Day 16 - exercise 2 | `support-desk-api/src/main/java/com/example/supportdesk/service/TicketService.java` | Extracted repeated lookup/trim logic into private helpers |
| `f551aeb` Day 16 - exercise 3 | `frontend-support-desk/support-desk-ui/src/pages/TicketFormPage.jsx` | Removed inline validation/payload logic, now imports from the new utility |
| `f551aeb` Day 16 - exercise 3 | `frontend-support-desk/support-desk-ui/src/utils/ticketFormValidation.js` (new) | `validateTicketForm`, `normalizeTicketFormPayload`, `formatTicketFormLabel` |
| `f551aeb` Day 16 - exercise 3 | `frontend-support-desk/support-desk-ui/src/utils/ticketFormValidation.test.js` (new) | Initial unit tests for the utility |
| `06cc795` (labelled "Day 15 - exercise 4" by the commit hook — content is Exercise 4) | `ticketFormValidation.js` / `ticketFormValidation.test.js` | Added priority/status value validation; hardened test names and assertions |

## What behaviour was preserved

- **Endpoint contracts unchanged**: `GET/POST /api/tickets`, `GET/POST/PUT /api/v1/tickets/**` — same
  paths, methods, and status codes (`201` create, `200` update/get, `404` not-found, `400`
  validation).
- **DTO shapes unchanged**: `TicketResponse`, `CreateTicketRequest`, `UpdateTicketRequest` field
  names and types are untouched.
- **Error messages unchanged where they already existed**: the `404` body
  (`"Ticket {id} was not found"`) and the `400` required-field messages
  (`"Title is required"`, etc.) are byte-identical to the pre-refactor versions — verified with
  live HTTP requests and unit tests, not just read by eye.
- **Ticket form appearance unchanged**: `TicketFormWizard.jsx` (the presentational component) was
  never touched — it never held validation logic in the first place, so its rendered output is
  identical before and after.
- **Create/edit flow unchanged**: both still call the same `createTicket`/`updateTicket` API
  functions with the same payload shape (`createdBy` only on create, `status` only on update).

## What logic was extracted

**Backend (`TicketService.java`):**
- `findTicketOrThrow(id)` — the `findById(...).orElseThrow(...)` pattern was duplicated in
  `getTicketById` and `updateTicket`; now one method, same exception type and message.
- `normalizeRequired(value)` — the repeated `.trim()` call for title/description/category/createdBy
  (8 call sites across create and update) is now one helper.
- `normalizeStatus(value)` / `normalizePriority(value)` — split out separately from
  `normalizeRequired` even though they currently do the same trim, because these two fields carry
  business rules (they're constrained to fixed value sets by DTO `@Pattern` annotations) that are
  likely to grow independently of free-text fields like `title`.

**Frontend (`ticketFormValidation.js`):**
- `validateTicketForm(formValues)` — pulled out of `TicketFormPage.jsx`, where it was defined
  inline alongside the component. Now also validates `priority`/`status` against the same allowed
  value sets and exact wording as the backend's `@Pattern` constraints in `UpdateTicketRequest`
  (added in Exercise 4 — this check didn't exist before and was previously undefended in the
  frontend, relying entirely on the `<select>` dropdown to constrain values).
  `formatTicketFormLabel(key)` builds each message from a single label map instead of duplicating
  full message strings.
- `normalizeTicketFormPayload(formValues)` — new; trims all five fields before they're sent to
  `createTicket`/`updateTicket`, mirroring the backend's own trimming so the client doesn't rely
  solely on the server to clean up whitespace.
- `formatTicketFormLabel(key)` — turns a field key into its display label (`"priority"` →
  `"Priority"`), used internally to build validation messages instead of hardcoding one message
  string per field.

## Why the new version is easier to maintain

- **One place to fix a bug**: a bug in "look up a ticket or 404" or "what counts as a valid
  priority" now has exactly one implementation, not two-to-four copies that could silently drift
  apart.
- **Pure functions are unit-testable in isolation**: `validateTicketForm` and
  `normalizeTicketFormPayload` no longer require rendering a React component or mocking `fetch` to
  test — they're plain functions with plain object in/out.
- **Frontend and backend validation wording now share an explicit source of truth in comments**:
  the `INVALID_VALUE_MESSAGES` in `ticketFormValidation.js` are annotated as mirroring
  `UpdateTicketRequest`'s `@Pattern` messages, so a future reader knows to keep them in sync instead
  of discovering the relationship by accident.
- **Smaller, more readable methods**: `TicketService.updateTicket` and `TicketFormPage.handleSubmit`
  both read as a short sequence of named steps instead of inline validation/trim logic mixed with
  I/O.

## Tests and HTTP requests run

**Backend** (no automated test suite exists yet — `support-desk-api/src/test` is empty — so
verification was live HTTP requests against a running instance with real MongoDB):

- `POST /api/tickets` with padded whitespace → `201`, fields returned trimmed.
- `PUT /api/v1/tickets/{id}` with padded whitespace and valid priority/status → `200`, trimmed
  fields persisted.
- `PUT /api/v1/tickets/000000000000000000000000` (unknown id) → `404`, message unchanged.
- `PUT` with a value violating the DTO's `@Pattern` → `400`, unaffected by the refactor.
- `POST` with all fields blank → `400`, lists all five missing fields, unaffected by the refactor.
- `GET /api/v1/tickets/{id}` after update → `200`, confirms persisted state matches the response.
- `mvn -o compile` passed cleanly before running any of the above.

**Frontend** (`npm test` → vitest, `frontend-support-desk/support-desk-ui`):

- Final run: **26 tests passed across 5 files**, including the existing
  `TicketFormWizard.test.jsx` (create/edit flow, inline errors, disabled-while-saving state,
  unaffected by this refactor since that component wasn't touched) and the new/hardened
  `ticketFormValidation.test.js` covering required fields, whitespace-only input, invalid
  priority/status (including case sensitivity and required-vs-invalid precedence), and payload
  normalization.

## Risks that remain

- **No backend automated tests.** All backend verification here was manual HTTP calls against a
  live instance; there's nothing in CI to catch a future regression in `TicketService` — worth
  adding `@SpringBootTest`/`@WebMvcTest` coverage as a follow-up.
- **`CreateTicketRequest.priority` still has no `@Pattern` constraint**, unlike
  `UpdateTicketRequest.priority`. This is pre-existing (not introduced by this refactor) but the
  frontend's new priority/status validation in `ticketFormValidation.js` now partially papers over
  it on the create path — the backend gap itself is still open.
- **Frontend/backend validation messages are duplicated by hand**, not generated from a shared
  source. The comment linking them reduces the chance of silent drift but doesn't prevent it; if
  `UpdateTicketRequest`'s `@Pattern` message wording changes, `ticketFormValidation.js` must be
  updated manually.
- **`getTickets`'s filter-selection bug is untouched.** Documented separately in
  `support-desk-api/NOTES.md` — combining `status`+`priority` query params silently only applies
  one of them. Out of scope for this refactor, but still live.
- **MongoDB credentials in `application-local.properties` remain committed in plain text** — flagged
  in the Exercise 1 safety checklist, not addressed here since it was out of scope for this
  refactor.
