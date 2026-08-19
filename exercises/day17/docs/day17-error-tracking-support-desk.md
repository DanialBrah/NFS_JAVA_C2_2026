# Day 17 Exercise 03 — Error Tracking (Support Desk API)

Project: `support-desk-api`, run locally with `-Dspring-boot.run.profiles=local`, port 8081.

## Completed table

| Error | Request made | Why it happened | Where you saw it in logs |
|---|---|---|---|
| **401 Unauthorized** | `GET /api/v1/tickets` with no `Authorization` header | `SecurityConfig` requires authentication for `/api/v1/tickets/**`; with no token, `HttpStatusEntryPoint(UNAUTHORIZED)` rejects the request before it reaches the controller | `requestId=30b9cb2a method=GET path=/api/v1/tickets status=401 durationMs=2` |
| **403 Forbidden** | `POST /api/tickets` with a valid JWT for a `USER`-role account (not `ADMIN`) | `SecurityConfig` restricts `POST /api/tickets` to `hasRole("ADMIN")`; the authenticated user lacks that role, so `AccessDeniedHandlerImpl` returns 403 | `requestId=85e19b40 method=POST path=/api/tickets status=403 durationMs=52` |
| **400 Bad Request** | `POST /api/v1/tickets` with `title`, `description`, `category`, `priority`, `createdBy` all blank | `@Valid @NotBlank` constraints on `CreateTicketRequest` fail → `MethodArgumentNotValidException` → `GlobalExceptionHandler` maps it to 400 with a combined per-field message | `requestId=8353d263 method=POST path=/api/v1/tickets status=400 durationMs=19` |
| **404 Not Found** | `GET /api/v1/tickets/000000000000000000000000` (well-formed but non-existent id) | `TicketService.getTicketById` finds no matching ticket and throws `ResourceNotFoundException`, mapped to 404 by `GlobalExceptionHandler` | `requestId=a99a6a8b method=GET path=/api/v1/tickets/000000000000000000000000 status=404 durationMs=29` |
| **409 Conflict** | `POST /api/auth/register` with an email already registered earlier in the same session | `AuthService.register` calls `appUserRepository.existsByEmailIgnoreCase(...)` and throws `DuplicateEmailException`, mapped to 409 by `GlobalExceptionHandler` | `requestId=56273299 method=POST path=/api/auth/register status=409 durationMs=5` |

## Notable finding: all five errors *do* show up in the timing log

Unlike the sibling `asset-tracker-api` project, every error here — including 401 and 403 — has a matching `RequestLoggingFilter` line. That's because `support-desk-api`'s filter (`com.example.supportdesk.security.RequestLoggingFilter`, built in Exercise 01) is explicitly annotated `@Order(Ordered.HIGHEST_PRECEDENCE)`, so it wraps the *entire* filter chain, including Spring Security. Security rejections still pass back through it on the way out, so the timing log captures them too. (`asset-tracker-api`'s `RequestTimingFilter` has no explicit order and sits after Spring Security by default, so its 401/403 cases are invisible to the log — see `day17-error-tracking-asset-tracker.md`.)

## Evidence — raw requests and responses

Seeded `ADMIN` account (`admin@example.com` / `Admin@12345`) and a freshly registered `USER` account (`day17.tester@example.com`) were used to obtain JWTs.

```http
### 1. 401 Unauthorized
GET http://localhost:8081/api/v1/tickets

< HTTP/1.1 401
```

```http
### 2. 403 Forbidden (Authorization header present but omitted from this record)
POST http://localhost:8081/api/tickets
Content-Type: application/json

{"title":"Printer broken","description":"Cannot print","category":"Hardware","priority":"HIGH","createdBy":"day17.tester@example.com"}

< HTTP/1.1 403
< {"timestamp":"2026-08-19T13:47:51.708Z","status":403,"error":"Forbidden","message":"Forbidden","path":"/api/tickets"}
```

```http
### 3. 400 Bad Request (Authorization header present but omitted from this record)
POST http://localhost:8081/api/v1/tickets
Content-Type: application/json

{"title":"","description":"","category":"","priority":"","createdBy":""}

< HTTP/1.1 400
< {"message":"Validation failed: createdBy: Created by is required, priority: Priority is required, title: Title is required, description: Description is required, category: Category is required"}
```

```http
### 4. 404 Not Found (Authorization header present but omitted from this record)
GET http://localhost:8081/api/v1/tickets/000000000000000000000000

< HTTP/1.1 404
< {"message":"Ticket 000000000000000000000000 was not found"}
```

```http
### 5. 409 Conflict
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{"name":"Duplicate Tester","email":"day17.tester@example.com","password":"AnotherPass123"}

< HTTP/1.1 409
< {"message":"Email already exists: day17.tester@example.com"}
```

## Log excerpt (safe — no passwords, tokens, or Authorization headers)

```text
requestId=30b9cb2a method=GET path=/api/v1/tickets status=401 durationMs=2
requestId=85e19b40 method=POST path=/api/tickets status=403 durationMs=52
requestId=8353d263 method=POST path=/api/v1/tickets status=400 durationMs=19
requestId=a99a6a8b method=GET path=/api/v1/tickets/000000000000000000000000 status=404 durationMs=29
requestId=56273299 method=POST path=/api/auth/register status=409 durationMs=5
```
