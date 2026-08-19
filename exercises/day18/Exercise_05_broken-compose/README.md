# Day 18 Broken Compose Troubleshooting Lab Files

These files are intentionally broken.

Use them with:

```bash
cp broken-compose/.env.broken.example broken-compose/.env.broken

docker compose -f broken-compose/compose.broken.yml \
  --env-file broken-compose/.env.broken \
  up --build
```

Your task:

1. Run the broken stack.
2. Inspect errors using `docker compose ps` and `docker compose logs`.
3. Create `broken-compose/compose.fixed.yml`.
4. Prove the fixed stack works.
5. Submit a troubleshooting report.

Do not edit the working `compose.yml`.
Do not change Java or React code for this exercise.
