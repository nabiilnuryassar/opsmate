# OpsMate AI Runbook

AI Ops Manager untuk UMKM. Monorepo: `backend/` (Laravel 13 API) + `frontend/` (React SPA), with a Docker dev stack.

## Prerequisites

- Docker + Docker Compose (the backend, PostgreSQL, and Redis all run in containers — the host PHP does not need the `pgsql` driver)
- Node.js 20+ and npm (for the frontend, which runs natively)

## Setup

```bash
# 1. Backend env (already present after scaffolding; copy if missing)
cp backend/.env.example backend/.env   # then set APP_KEY via: docker compose run --rm backend php artisan key:generate

# 2. Build the backend image and start the stack (postgres, redis, backend, queue)
make build
make up

# 3. Run migrations
make migrate

# 4. Frontend deps + dev server
cd frontend && npm install
npm run dev
```

## Services & Ports

| Service        | URL / Port              | Notes                                  |
| -------------- | ----------------------- | -------------------------------------- |
| Backend API    | http://localhost:8000   | `php artisan serve` in the container   |
| Frontend (Vite)| http://localhost:5173   | proxies `/api` -> backend              |
| PostgreSQL     | container-internal 5432 | not published to host (Laragon owns it)|
| Redis          | container-internal 6379 | not published to host                  |
| Mailpit        | http://localhost:8025   | host (Herd) SMTP on 1025               |

PostgreSQL and Redis are reachable only from inside the compose network (service names `postgres` / `redis`). This avoids clashing with Laragon/Herd services already bound to those host ports.

## Common Commands

```bash
make up            # start the stack
make down          # stop the stack
make ps            # container status
make logs          # tail backend logs
make migrate       # run migrations
make fresh         # migrate:fresh --seed
make test-backend  # backend test suite
make artisan c="route:list"   # arbitrary artisan command
make dev-frontend  # vite dev server
make build-frontend
make test-frontend
```

## Testing

```bash
make test-backend                 # full backend suite (docker compose exec backend php artisan test)
make fresh                        # migrate:fresh --seed (loads DemoSeeder: Rina Catering demo data)
cd frontend && npx vitest run     # frontend unit/component tests
cd frontend && npm run build      # typecheck + production build
```

Demo login after `make fresh`: `rina@opsmate.test` / `password`.

## Deployment (Production)

Production manifests live in `docker/` and `*/Dockerfile.prod`:

- `backend/Dockerfile.prod` — PHP 8.4 **FPM** image (not the dev server) with opcache, prod-optimized composer install, and an entrypoint that runs migrations + caches config/routes/views.
- `frontend/Dockerfile.prod` — multi-stage: builds the SPA and bakes `dist/` into an nginx image (no shared volume).
- `docker/docker-compose.prod.yml` — postgres, redis, backend (php-fpm), queue worker, scheduler, web (nginx serving SPA + FastCGI to backend).
- `docker/nginx.conf` — serves the SPA and routes `/api`, `/sanctum`, `/up` to php-fpm over FastCGI; HTTPS block ready to enable.
- `backend/.env.production` — production env template.

Steps (run from the repo root):

```bash
# 1. Create the server env from the template and fill REQUIRED values
#    (APP_KEY, DB_PASSWORD, FRONTEND_URL, SANCTUM_STATEFUL_DOMAINS, mail, OPENAI_API_KEY).
cp backend/.env.production backend/.env

# 2. Build + start the whole stack (SPA is built inside the web image).
export DB_PASSWORD=your-strong-password
docker compose -f docker/docker-compose.prod.yml up -d --build

# 3. Migrations run automatically via the backend entrypoint. To seed a demo business:
docker compose -f docker/docker-compose.prod.yml exec backend php artisan db:seed --force

# 4. Place TLS certs in docker/certs/ (fullchain.pem, privkey.pem) and enable the
#    HTTPS server block in docker/nginx.conf, then rebuild the web image.
```

The app is served on port 80 (and 443 once TLS is enabled). The SPA calls the API
same-origin under `/api`, so no CORS config is needed in production.

### Production checklist

- APP_DEBUG=false, strong APP_KEY, real DB credentials.
- Daily PostgreSQL backups (`pg_dump` cron against the `postgres` volume).
- Queue worker + scheduler containers running (`docker compose -f docker/docker-compose.prod.yml ps`).
- TLS via the nginx HTTPS block; redirect HTTP→HTTPS.
- Set `OPENAI_API_KEY` to enable the full AI assistant (without it, the deterministic fallback keeps features working).