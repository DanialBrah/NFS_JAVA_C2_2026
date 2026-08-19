# Day 17 Security Hardening Evidence (Support Desk API)

Project: `support-desk-api`, run locally with `-Dspring-boot.run.profiles=local`. Full request/response detail for items 1-4 is in `day17-error-tracking-support-desk.md`; this document pulls the security-relevant subset together with items 5-6.

## 1. Authentication evidence

Test performed:

```http
GET /api/v1/tickets without token
```

Expected result:

```text
401 Unauthorized
```

Evidence:

```text
$ curl -i http://localhost:8081/api/v1/tickets
HTTP/1.1 401
```

Log line (via `RequestLoggingFilter`, `@Order(Ordered.HIGHEST_PRECEDENCE)` so it wraps Spring Security too):

```text
requestId=30b9cb2a method=GET path=/api/v1/tickets status=401 durationMs=2
```

## 2. Authorisation evidence

Test performed:

```text
Non-admin (USER role) user tries an admin-only create action.
```

Expected result:

```text
403 Forbidden
```

Evidence:

```http
POST /api/tickets
Authorization: Bearer <USER-role JWT>
Content-Type: application/json

{"title":"Printer broken","description":"Cannot print","category":"Hardware","priority":"HIGH","createdBy":"day17.tester@example.com"}

< HTTP/1.1 403
< {"timestamp":"2026-08-19T13:47:51.708Z","status":403,"error":"Forbidden","message":"Forbidden","path":"/api/tickets"}
```

```text
requestId=85e19b40 method=POST path=/api/tickets status=403 durationMs=52
```

`SecurityConfig` maps `POST /api/tickets` to `hasRole("ADMIN")`; a `USER`-role JWT is correctly rejected before reaching `TicketController`.

## 3. Duplicate protection evidence

Test performed:

```text
Register with an email already used earlier in the same session.
```

Expected result:

```text
409 Conflict
```

Evidence:

```http
POST /api/auth/register
Content-Type: application/json

{"name":"Duplicate Tester","email":"day17.tester@example.com","password":"AnotherPass123"}

< HTTP/1.1 409
< {"message":"Email already exists: day17.tester@example.com"}
```

```text
requestId=56273299 method=POST path=/api/auth/register status=409 durationMs=5
```

## 4. Input validation evidence

Test performed:

```text
Create ticket with all required fields blank.
```

Expected result:

```text
400 Bad Request
```

Evidence:

```http
POST /api/v1/tickets
Authorization: Bearer <USER JWT>
Content-Type: application/json

{"title":"","description":"","category":"","priority":"","createdBy":""}

< HTTP/1.1 400
< {"message":"Validation failed: createdBy: Created by is required, priority: Priority is required, title: Title is required, description: Description is required, category: Category is required"}
```

```text
requestId=8353d263 method=POST path=/api/v1/tickets status=400 durationMs=19
```

## 5. Logging evidence

Confirm logs do not show:

- Passwords
- JWT tokens
- Full Authorization headers
- Secret keys

Code review: every `logger.info(...)` call in `com.example.supportdesk` was checked (`AuthService`, `TicketService`, `RequestLoggingFilter`) — none of them log a password, token, or `Authorization` header. `AuthService` specifically logs only `email` + `role` on register/login, never `passwordHash` or the issued JWT. `RequestLoggingFilter` (Exercise 01) only logs `requestId`, `method`, `path`, `status`, `durationMs` — no headers, no body.

Evidence — actual log lines from a live run (safe fields only):

```text
requestId=30b9cb2a method=GET path=/api/v1/tickets status=401 durationMs=2
requestId=8c52561c method=POST path=/api/auth/login status=200 durationMs=751
requestId=531aed89 method=POST path=/api/auth/register status=201 durationMs=148
requestId=85e19b40 method=POST path=/api/tickets status=403 durationMs=52
requestId=8353d263 method=POST path=/api/v1/tickets status=400 durationMs=19
requestId=a99a6a8b method=GET path=/api/v1/tickets/000000000000000000000000 status=404 durationMs=29
requestId=56273299 method=POST path=/api/auth/register status=409 durationMs=5
```

Note: the `login`/`register` lines above are the ones handling credentials directly, and they carry no password or token — only method, path, status, and duration.

## 6. Docker secret hygiene evidence

Confirm these files are not committed:

- `.env`
- `secrets/`
- private key files

Evidence:

```text
$ git ls-files | grep -i "\.env$"
(no output - no .env file tracked by git)

$ git check-ignore -v support-desk-api/.env
.gitignore:74:*.env    support-desk-api/.env

$ git status --short
(clean - .env correctly excluded from tracking)
```
