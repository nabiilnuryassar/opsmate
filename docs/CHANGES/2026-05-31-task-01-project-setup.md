# TASK-01 — Project Setup & Scaffolding

Date: 2026-05-31
Area: backend, frontend, devops
Type: chore

## Context

First implementation task from `docs/plans/01-TASK-project-setup.md`. Stand up the monorepo: a Laravel 13 API backend, a React + TypeScript + Vite frontend, and a Docker dev stack, with Laravel Boost installed for backend MCP support.

## What changed

### Root
- `AGENTS.md` — repo-wide AI working guide (conventions, tenancy rules, build order, Boost notes).
- `docker-compose.yml` — `postgres:16`, `redis:7`, `backend` (PHP 8.4 image), `queue` worker. DB/Redis ports are not published to the host to avoid clashing with Laragon/Herd.
- `Makefile` — dev shortcuts wrapping `docker compose` + frontend npm scripts.

### Backend (`backend/`)
- Laravel 13.12 via `composer create-project`.
- Packages: `laravel/sanctum`, `barryvdh/laravel-dompdf`, `predis/predis`, `laravel/boost` (dev).
- `php artisan install:api` — API routing + Sanctum.
- `php artisan boost:install` — MCP server + AI guidelines/skills.
- `Dockerfile` — PHP 8.4-alpine with `pdo_pgsql`, `pgsql`, `intl`, `bcmath`, `zip`, `pcntl` (host herd-lite PHP lacks the pgsql driver, so the backend runs in Docker).
- `.env` / `.env.example` — pgsql, redis (predis), Mailpit, Sanctum stateful domain, OpenAI keys.
- `config/cors.php` — allow the frontend origin.
- Folder structure: `app/Enums`, `app/Services/{AI,Business}`, `app/Policies`, `app/Http/{Resources,Requests,Controllers/Api}`.

### Frontend (`frontend/`)
- Vite + React 19 + TypeScript.
- Runtime: TanStack Query, Zustand, React Hook Form + Zod, React Router, Recharts, framer-motion, axios, lucide-react, clsx/tailwind-merge/cva.
- Tailwind CSS v4 via `@tailwindcss/vite`.
- `@/*` path alias, Vitest + Testing Library, Vite `/api` proxy to the backend.
- `src/lib/{api,utils,constants,query-client}.ts`, `src/stores/auth-store.ts`, providers wired in `main.tsx`.

## Impact

- New monorepo structure; no prior code to break.
- Backend reachable at `:8000`, frontend at `:5173`.

## How to test

- `make up` → stack healthy (`docker compose ps`).
- `make migrate` → migrations run on PostgreSQL.
- `curl /up` → 200; `curl /api/user` (JSON) → 401 Unauthenticated.
- `docker compose exec backend php artisan tinker` cache put/get via Redis → `pong`.
- `cd frontend && npm run build` → builds clean.

## Rollback plan

- `docker compose down -v`; delete `backend/`, `frontend/`, `docker-compose.yml`, `Makefile`, `AGENTS.md`.
