# Docker Troubleshooting Report

Lab: `exercises/day18/Exercise_05_broken-compose/`. Broken file diagnosed via `docker compose ... ps` / `logs`; fixes applied incrementally into `compose.fixed.yml` (the original `compose.broken.yml` was left untouched).

## Problem 1
**Symptom:** `docker compose ... up --build` refused to start anything at all.
**Command used:**
```
docker compose -f exercises/day18/Exercise_05_broken-compose/compose.broken.yml --env-file exercises/day18/Exercise_05_broken-compose/.env.broken up --build
```
**Log or evidence:**
```
service "frontend" depends on undefined service "api": invalid compose project
```
**Root cause:** `compose.broken.yml`'s `frontend` service has `depends_on: api:`, but no service named `api` exists in the file — the actual backend service is named `backend`.
**Fix:** Changed `depends_on: api:` to `depends_on: backend:` in `compose.fixed.yml`.
**Why the fix works:** Compose validates every `depends_on` reference against the services actually defined in the file before it starts anything. Pointing it at the real service name (`backend`) lets Compose build a valid dependency graph, so `frontend` correctly waits for `backend` to become healthy before starting.

## Problem 2
**Symptom:** Build failed immediately for both `backend` and `frontend`.
**Command used:**
```
docker compose -f exercises/day18/Exercise_05_broken-compose/compose.fixed.yml --env-file exercises/day18/Exercise_05_broken-compose/.env.broken up --build
```
**Log or evidence:**
```
unable to prepare context: path "C:\laragon\www\NFS_JAVA_C2_2026\exercises\day18\frontend" not found
```
**Root cause:** `build.context: ..` (backend) and `build.context: ../frontend` (frontend) assume the compose file sits directly at the repo root — which is how the exercise's own README describes it. In this repo it actually lives three directories deep, at `exercises/day18/Exercise_05_broken-compose/`, so the relative paths resolved to `exercises/day18/` and `exercises/day18/frontend` instead of the real project root.
**Fix:** Changed `context: ..` to `context: ../../..` for `backend`, and `context: ../frontend` to `context: ../../../frontend` for `frontend`.
**Why the fix works:** These now correctly resolve to the actual repo root, where the real `Dockerfile` and `frontend/` directory live.

## Problem 3
**Symptom:** `mongo` and (eventually) `backend` containers stayed up, but `backend` never became healthy, and `frontend` never started at all (it was waiting on `backend`'s healthcheck).
**Command used:**
```
docker compose -f exercises/day18/Exercise_05_broken-compose/compose.fixed.yml --env-file exercises/day18/Exercise_05_broken-compose/.env.broken logs backend
```
**Log or evidence:**
```
Caused by: java.net.ConnectException: Connection refused
...
Waiting for server to become available for operation createIndexes with ID 3. Remaining time: 29994 ms.
Selector: WritableServerSelector, topologydescription: {type=UNKNOWN, servers=[{address=localhost:27017, type=UNKNOWN, state=CONNECTING, exception={com.mongodb.MongoSocketOpenException: Exception opening socket}, caused by {java.net.ConnectException: Connection refused}}]}
```
**Root cause:** `SPRING_MONGODB_URI: mongodb://localhost:27017/asset_tracker_db`. Inside the `backend` container, `localhost` refers to the `backend` container itself, not the `mongo` container — there is no MongoDB server running inside the backend container, so the connection is refused every time.
**Fix:** Changed to `SPRING_MONGODB_URI: mongodb://mongo:27017/asset_tracker_db`.
**Why the fix works:** `mongo` is the Compose service name defined in the same file. Docker Compose runs an internal DNS resolver that maps service names to whatever internal IP that container currently has — that's the only reliable way for one container to reach another inside the same Compose network. This is the same pattern used for the frontend's nginx → backend proxy (`http://backend:8080`) built in Exercise 02.

## Final verification
- [x] Frontend loads
- [x] Login works
- [x] Backend health check works
- [x] Backend readiness check works
- [x] MongoDB container is running
- [x] Backend can connect to MongoDB
- [x] Data can be reset with `down -v`

## Reflection questions

**1. Why should the backend use `mongo:27017` instead of `localhost:27017` inside Compose?**
Because `localhost` inside any container always refers to that same container, never a sibling container. Compose containers only reach each other through service names, resolved via Docker's built-in DNS — matching exactly what caused Problem 3 above.

**2. Why is `APP_JWT_SECRET` required?**
It's the key used to sign and verify JWT auth tokens. If it were allowed to silently fall back to a well-known demo default, anyone who knows that default value could forge a valid token for any user or role without ever needing a real password — which is why `SecurityConfig` actively refuses to start rather than fall back silently.

**3. Why is a health check not the same as "the container is running"?**
A container can show `Up` while the process inside is still starting, stuck, or repeatedly crash-looping under `restart: unless-stopped` — "running" only means the process started, not that it's actually able to serve a request. The health check probes real application behavior (e.g. `GET /api/health`), which is what `depends_on: condition: service_healthy` relies on so dependent services don't start too early against something that isn't really ready — exactly what happened with `frontend` waiting on `backend` in Problem 1/3.

**4. Why should we use `docker compose logs` before randomly changing files?**
The logs show the actual failure — the exact exception, the exact host it tried to connect to, the exact missing variable — instead of guessing. Guessing risks fixing the wrong thing, wasting time, or masking the real problem behind an unrelated change. All three problems above were found by reading logs first, not by trial and error.

**5. Why is this troubleshooting skill useful before Day 19/20 capstone demos?**
Multi-service demos are exactly where these bug classes show up — wrong service names, wrong build context paths, missing or misnamed environment variables — and they tend to surface right when there's the least time to debug them. Being able to quickly read `ps`/`logs` output and pinpoint the actual root cause is the difference between a two-minute fix and a demo grinding to a halt.
