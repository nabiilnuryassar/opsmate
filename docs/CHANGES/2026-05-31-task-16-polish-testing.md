# TASK-16 — Polish, Testing & Pilot Preparation

Date: 2026-05-31
Area: backend, devops, docs
Type: chore

## Context

Final task from `docs/plans/16-TASK-polish-testing.md`. Seed data for demos, an end-to-end integration test, production deployment config, and runbook docs to prepare for a pilot.

## What changed

### Seed data
- `database/seeders/DemoSeeder.php` — idempotent "Rina Catering" demo: owner (`rina@opsmate.test`/`password`), 5 customers (incl. VIP + inactive), 5 products (incl. low-stock Brownies), 5 orders via OrderService, then derived reminders + today's daily report.
- Registered in `DatabaseSeeder`; `make fresh` loads it.

### Testing
- `tests/Feature/OrderLifecycleTest.php` — full flow: customer → product → order → status transitions → stock reduction → payment → invoice + PDF → dashboard → daily report → activity log.
- Full backend suite: 109 tests / 350 assertions green.
- Frontend suite: 55 tests across 14 files green; production build clean.

### Deployment
- `docker/docker-compose.prod.yml` — postgres, redis, backend, queue worker, scheduler (`schedule:work`), nginx.
- `docker/nginx.conf` — serves built SPA, proxies `/api`, HTTPS block ready.

### Docs
- `docs/RUNBOOK.md` — Testing + Deployment (Production) sections, production checklist.

## Verification mapping (PRD §12.2 security)

- Password hashing — `AuthTest`.
- Tenant isolation — every feature test has a cross-business case.
- Sanctum auth — `*requires_authentication` tests.
- Input validation — `*requires_*` / `rejects_invalid_*` tests.
- AI rate limit — `AIAssistantTest::chat_is_rate_limited`.
- AI no cross-tenant leak — `AIAssistantTest::chat_does_not_leak_other_business_data`.

## How to test

- `make fresh` → DemoSeeder loads without error.
- `make test-backend` → 109 passing.
- `cd frontend && npx vitest run && npm run build` → 55 passing, clean build.

## Rollback plan

- Delete DemoSeeder + revert DatabaseSeeder; delete OrderLifecycleTest; delete `docker/`; revert RUNBOOK Testing/Deployment sections.
