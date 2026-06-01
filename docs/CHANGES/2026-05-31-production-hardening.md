# Production Deployment Hardening

Date: 2026-05-31
Area: backend, frontend, devops
Type: chore

## Context

The MVP code was stable (109 backend + 55 frontend tests green) but the production deploy config had four blockers that would fail a real deploy:

1. Backend prod ran on `php artisan serve` (dev server).
2. The SPA was never placed where nginx serves it → 404 in production.
3. The backend image was a dev image (dev deps, no opcache, no caches).
4. Prod compose pointed at the local `.env` (`APP_DEBUG=true`).

## What changed

### Backend production image
- `backend/Dockerfile.prod` — `php:8.4-fpm-alpine` with opcache + required extensions (pdo_pgsql, pgsql, mbstring, bcmath, pcntl, zip, intl), `composer install --no-dev --optimize-autoloader`, and a cache-warming entrypoint.
- `backend/docker/php/opcache.ini` — opcache tuned (`validate_timestamps=0`).
- `backend/docker/php/php.ini` — `display_errors=Off`, `expose_php=0`, memory/upload limits, timezone.
- `backend/docker/php/entrypoint.sh` — key:generate (if absent) → migrate (gated by `RUN_MIGRATIONS`) → config/route/view/event cache → `php-fpm`.
- `backend/.env.production` — production env template (APP_ENV=production, APP_DEBUG=false, service-name hosts, placeholders for secrets).
- `backend/.dockerignore` — keeps stale `bootstrap/cache`, vendor, `.env`, tests out of the image (fixed a `package:discover` failure caused by a stale dev provider cache).

### Web tier (fixes the SPA-404 blocker)
- `frontend/Dockerfile.prod` — multi-stage: `npm ci` + `npm run build`, then bakes `dist/` into `nginx:1.27-alpine`. No shared volume.
- `docker/nginx.conf` — serves the SPA with history-mode fallback and routes `^/(api/|sanctum/|up$)` to php-fpm over **FastCGI** (port 9000). Long-cache for hashed assets. HTTPS block ready to enable.
- `.dockerignore` (root) — lean build context for the root-context web build.

### Orchestration
- `docker/docker-compose.prod.yml` — postgres, redis (both healthchecked), backend (php-fpm, healthcheck, storage volume), queue worker, scheduler (`schedule:work`, `RUN_MIGRATIONS=0`), web (nginx, ports 80/443). `web` build context is the repo root.
- `docs/RUNBOOK.md` — deployment section rewritten for the new architecture.

## How it was verified

- `docker build -f backend/Dockerfile.prod` → image builds; `php -m` shows opcache/pdo_pgsql/pgsql/intl/bcmath; `opcache.validate_timestamps => Off`; `php-fpm -t` passes; entrypoint caches config/routes/views.
- `docker build -f frontend/Dockerfile.prod` → SPA builds and is baked into nginx.
- Full stack booted (`docker compose -p opsmateprod -f docker/docker-compose.prod.yml up -d`): all services healthy; `GET /` (SPA) = 200 with `<title>OpsMate AI</title>`; `GET /up` = 200; `GET /api/user` = 401 — confirming nginx serves the SPA and proxies the API to php-fpm. Test stack torn down with `down -v`.

## Remaining (operational, not code blockers)

- TLS certs + enabling the HTTPS block (commented, ready).
- DB backup cron and error tracking (Sentry) — documented in the runbook checklist, not yet implemented.

## Rollback plan

- Delete `backend/Dockerfile.prod`, `backend/docker/php/*`, `backend/.env.production`, `backend/.dockerignore`, `frontend/Dockerfile.prod`, root `.dockerignore`; revert `docker/nginx.conf`, `docker/docker-compose.prod.yml`, and the RUNBOOK deployment section.
