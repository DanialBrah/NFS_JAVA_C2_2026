# Day 16 Exercise 7 — AI Regression Check

Regression review of the Support Desk Ticket refactor across commits `c7ec9ab` (backend
`TicketService`), `f551aeb` and `06cc795` (frontend `TicketFormPage` + `ticketFormValidation.js`).

## AI prompt used

```text
Review this refactor as a regression risk.

Compare the old and new behaviour. List anything that might have changed accidentally, especially route paths, request payloads, auth headers, validation, error handling and UI states.

Do not rewrite the code yet. First produce a risk checklist.
```

## Regression checklist

| # | Area | Check | Result |
|---|---|---|---|
| 1 | Login | `POST /api/auth/login` unchanged; `SecurityConfig.java` / `AuthContext.jsx` untouched by the diff | ✅ verified via `git diff` — zero changes |
| 2 | Protected ticket list | `GET /api/tickets`, `GET /api/v1/tickets` — route, role requirements (`hasAnyRole("USER","ADMIN")`) unchanged | ✅ untouched |
| 3 | Create ticket form | `TicketFormWizard.jsx` (rendering) untouched; `TicketFormPage.jsx` now calls `normalizeTicketFormPayload` before `createTicket` | ✅ payload shape identical, values now trimmed |
| 4 | Edit ticket form | Same as above, plus a new priority/status enum check on submit | ⚠️ see risk below |
| 5 | API request headers | `Authorization: Bearer <token>` built in `httpClient.js` — untouched | ✅ verified via `git diff` — zero changes |
| 6 | Validation rules | Required-field messages byte-identical; **new** priority/status value validation added that didn't exist before | ⚠️ new behaviour, needs scrutiny |
| 7 | 401 handling | `ProtectedRoute.jsx` (redirect to `/login`), `SecurityConfig`'s `HttpStatusEntryPoint(UNAUTHORIZED)` — untouched | ✅ untouched |
| 8 | 403 handling | `AccessDeniedHandlerImpl` in `SecurityConfig` — untouched | ✅ untouched |
| 9 | Unit tests | `TicketFormWizard.test.jsx` (pre-existing) + `ticketFormValidation.test.js` (new/hardened) | ✅ 26/26 passing |
| 10 | Smoke test | Manual: login → list → create → edit → invalid input → unknown id | ✅ done this session (live HTTP + live DB check) |

## AI risk review

Running the prompt above against the actual diff surfaced:

- Route paths, request payload field names, and error status codes: unchanged.
- Auth headers, 401/403 paths: unchanged — confirmed no file in that path was touched by any of
  the three refactor commits.
- Two **new, not-purely-extracted** behaviours were flagged as risk, since a regression check
  cares about anything that isn't a pure relocation of existing logic:
  1. `normalizeTicketFormPayload` now trims form values before sending — a behaviour addition, not
     a pure move.
  2. `validateTicketForm` now rejects a priority/status value that isn't exactly `LOW`/`MEDIUM`/`HIGH`
     or `OPEN`/`IN_PROGRESS`/`CLOSED` — this check **did not exist before**, so it's new
     client-side rejection logic, not a relocation of existing logic.

## Example risk AI identified

> The new priority/status validation in `ticketFormValidation.js` uses a case-sensitive
> `.includes()` check. If a ticket in the database has `priority: "high"` (lowercase) instead of
> `"HIGH"`, opening it in the edit form could now show a validation error that never existed
> pre-refactor, blocking a save that used to work.

## Check used to confirm behaviour

Rather than accept that risk as a guess, it was verified against live data:

1. Started the backend, logged in as admin, and pulled all 35 tickets from `GET /api/tickets`.
2. Found a real ticket in the database — `id=6a506467f676e8df60509af3`,
   *"Login page throws 500 error"* — with `priority: "high"`, `status: "open"` (lowercase),
   confirming the risk isn't hypothetical.
3. Ran the **actual** `validateTicketForm` function (not a re-implementation) against two
   scenarios:
   - Simulating the real `TicketFormPage.jsx` load path, which already calls `.toUpperCase()` on
     `priority`/`status` before storing form state →
     **`{}` — no errors.** The ticket edits fine.
   - Feeding the same raw lowercase values directly into `validateTicketForm`, bypassing that
     uppercase step →
     **`{ priority: 'Priority must be LOW, MEDIUM or HIGH', status: 'Status must be OPEN, IN_PROGRESS or CLOSED' }`.**
