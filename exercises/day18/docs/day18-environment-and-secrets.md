# Day 18 Exercise 04 — Environment and Secrets

## `.env.example` placeholders

Added to the root `.env.example`, in a "Support Desk stack" section (shares the file with the existing Asset Tracker stack; ports are prefixed `SD_` so the two stacks never collide on the same host):

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Signs support-desk-api's auth tokens (must be at least 32 characters) |
| `SD_FRONTEND_PORT` | Host port for the frontend container (default `5174`) |
| `SD_BACKEND_PORT` | Host port for the backend container (default `8082`) |
| `SD_MONGO_HOST_PORT` | Host port for the mongo container (default `27019`) |

The backend and mongo containers also need `MONGO_INITDB_ROOT_USERNAME` / `MONGO_INITDB_ROOT_PASSWORD` — these already existed in `.env.example` from the Asset Tracker section and are reused as-is (the Support Desk mongo container bootstraps a root user with these, and the backend authenticates as that same user against `admin`).

## Why `.env` should not be committed

A real `.env` holds the actual JWT signing secret and the Mongo root credentials. Anyone with the JWT secret can mint a valid auth token for any user or role, without ever needing a password. Anyone with the Mongo root credentials has full read/write access to the database. Committing `.env` would make that access permanent and visible to everyone with repository access — including in git history, even after a later commit deletes the file; the secret would still be recoverable from an old commit.

`.gitignore` keeps the real `.env` out of version control entirely. `.env.example` documents which variables are needed, with placeholder values only, so a new developer knows what to configure without ever seeing a real credential.

Verified with real git commands:

```text
$ git check-ignore -v .env
.gitignore:74:*.env    .env          -> correctly ignored

$ git check-ignore -v .env.example
(no match)                            -> correctly trackable
```
