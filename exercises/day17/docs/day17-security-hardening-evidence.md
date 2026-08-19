# Day 17 Security Hardening Evidence (Asset Tracker API)

Project: `asset-tracker-api` (root project), run locally with `-Dspring.profiles.active=local`. Full request/response detail for items 1-4 is in `day17-error-tracking-asset-tracker.md`; this document pulls the security-relevant subset together with items 5-6.

## 1. Authentication evidence

Test performed:

```http
GET /api/v1/assets without token
```

Expected result:

```text
401 Unauthorized
```

Evidence:

```text
$ curl -i http://localhost:8087/api/v1/assets
HTTP/1.1 401
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
POST /api/v1/assets
Authorization: Bearer <USER-role JWT>
Content-Type: application/json

{"assetTag":"TST-2026-0001","name":"Test Laptop","category":"Laptop","serialNumber":"SN-TST-0001","location":"HQ Level 1"}

< HTTP/1.1 403
```

`SecurityConfig` maps `POST /api/v1/assets` to `hasRole("ADMIN")`; a `USER`-role JWT is correctly rejected at the authorization layer before reaching `AssetController`.

## 3. Duplicate protection evidence

Test performed:

```text
Create asset using an existing assetTag (LAP-2026-4721, seeded by AssetDataSeeder).
```

Expected result:

```text
409 Conflict
```

Evidence:

```http
POST /api/v1/assets
Authorization: Bearer <ADMIN JWT>
Content-Type: application/json

{"assetTag":"LAP-2026-4721","name":"Duplicate Laptop","category":"Laptop","serialNumber":"SN-DUPLICATE-DAY17","location":"Security Lab"}

< HTTP/1.1 409
< {"message":"Asset tag already exists: LAP-2026-4721","status":409,"errors":[]}
```

## 4. Input validation evidence

Test performed:

```text
Create asset with all required fields blank.
```

Expected result:

```text
400 Bad Request
```

Evidence:

```http
POST /api/v1/assets
Authorization: Bearer <ADMIN JWT>
Content-Type: application/json

{"assetTag":"","name":"","category":"","serialNumber":"","location":""}

< HTTP/1.1 400
< {"message":"Validation failed","status":400,"errors":[
<   {"field":"category","message":"Category is required"},
<   {"field":"location","message":"Location is required"},
<   {"field":"assetTag","message":"Asset tag is required"},
<   {"field":"name","message":"Asset name is required"},
<   {"field":"serialNumber","message":"Serial number is required"}
< ]}
```

## 5. Logging evidence

Confirm logs do not show:

- Passwords
- JWT tokens
- Full Authorization headers
- Secret keys

Code review: every `logger.info(...)` call in `com.example.assettracker` was checked (`AuthService`, `AssetService`, `AssetReportService`, `AssetDataSeeder`, `UserDataSeeder`, `RequestTimingFilter`) — none of them log a password, token, or `Authorization` header. `AuthService` specifically logs only `email` + `role`, never `passwordHash` or the issued JWT.

Evidence — actual log lines from a live run (safe fields only):

```text
requestId=cabe2874 method=GET path=/api/health status=200 durationMs=1
requestId=8b5907e8 method=POST path=/api/auth/login status=200 durationMs=416
requestId=05478a80 method=POST path=/api/auth/register status=201 durationMs=137
requestId=5c0a5d51 method=POST path=/api/v1/assets status=400 durationMs=21
requestId=a598c30b method=GET path=/api/v1/assets/000000000000000000000000 status=404 durationMs=21
requestId=1a94016e method=POST path=/api/v1/assets status=409 durationMs=3
```

Note: the `login`/`register` lines above are the ones handling credentials directly, and they carry no password or token — only method, path, status, and duration, confirming `RequestTimingFilter` doesn't log request bodies or headers at all.

## 6. Docker secret hygiene evidence

Confirm these files are not committed:

- `.env`
- `secrets/`
- private key files

Evidence:

```text
$ git ls-files | grep -i "\.env$"
(no output - no .env file tracked by git)

$ git check-ignore -v .env
.gitignore:74:*.env    .env

$ git status --short
(clean - .env correctly excluded from tracking)
```
