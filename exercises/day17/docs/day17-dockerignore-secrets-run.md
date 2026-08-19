# Day 17 Exercise 08 — .dockerignore, Secrets and Run (Support Desk API)

## 1. `.dockerignore`

Already created in Exercise 07 (`support-desk-api/.dockerignore`), and already covers every pattern required here plus more:

```dockerignore
.env
.env.*
!.env.example
secrets/
target/
node_modules/
*.log
```

## 2. `.env.example`

`support-desk-api/.env.example` — placeholder values only, safe to commit:

```dockerignore
MONGODB_HOST=host.docker.internal
MONGODB_PORT=27017
MONGODB_DATABASE=support_desk_db
MONGODB_AUTHENTICATION_DATABASE=support_desk_db
MONGODB_USERNAME=your_mongo_user
MONGODB_PASSWORD=your_mongo_password
JWT_SECRET=replace-with-a-real-random-secret-at-least-32-characters-long
```

## 3. Docker run evidence

```bash
docker run --rm -d --name support-desk-api-day17 \
  --env-file .env \
  -e SPRING_PROFILES_ACTIVE=docker \
  -p 8080:8080 \
  support-desk-api:day17
```

```text
$ curl http://localhost:8080/api/health
{"status":"UP","service":"support-desk-api"}                              -> 200

$ curl http://localhost:8080/api/readiness
{"service":"support-desk-api","status":"READY","database":"CONNECTED"}    -> 200

$ docker inspect --format='{{json .State.Health}}' support-desk-api-day17
"Status":"healthy"
```

## 4. Safe log example

From `docker logs support-desk-api-day17` — no passwords, JWTs, or `Authorization` headers:

```text
requestId=37541142 method=GET path=/api/health status=200 durationMs=86
requestId=3a7da5e4 method=GET path=/api/health status=200 durationMs=3
requestId=3ff14722 method=GET path=/api/readiness status=200 durationMs=12
```

One line you'll also see in the raw output — `Using generated security password: <uuid>` — is Spring Security's own harmless startup default for an unused in-memory account. support-desk-api's real authentication goes through the custom JWT filter, not that account, so it's log noise, not a leaked secret.

## 5. Why real secrets are not committed

`.env` holds live MongoDB credentials and the JWT signing secret. Anyone holding the JWT secret can forge a valid auth token for any user or role; anyone holding the Mongo credentials can read or write the database directly. Committing `.env` would make that access permanent and visible to everyone with repository access — including in git history, even after a later commit removes the file. `.gitignore` and `.dockerignore` keep `.env` out of both version control and the Docker build context, while `.env.example` documents which variables are needed, with placeholder values only, so a new developer knows what to configure without ever seeing a real credential.
