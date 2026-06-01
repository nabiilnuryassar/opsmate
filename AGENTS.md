# OpsMate AI — Agent Working Guide

> AI Ops Manager untuk UMKM & bisnis jasa kecil.
> This file tells any AI agent how to work in this repo correctly. Read it fully before touching code.

## 0. Golden Rules

1. **Read before you write.** Inspect existing files, conventions, and the relevant plan in `docs/plans/` before changing anything.
2. **Follow the plans.** Work is defined in `docs/plans/00-OVERVIEW.md` and `docs/plans/NN-TASK-*.md`. Do the task that is next in dependency order unless told otherwise.
3. **Specs are source of truth.** `docs/refs/PRD-MVP-Ops.md` (product + data model + API) and `docs/refs/DESIGN-Ops.md` (design system) override assumptions. UI must match `docs/screens/`.
4. **Multi-tenant isolation is sacred.** Every business-owned row is scoped by `business_id`. Never return or mutate data across businesses. See §6.
5. **Keep diffs minimal and reviewable.** No drive-by refactors, no new libraries without justification, no dead code.
6. **Verify before yielding.** Run the relevant tests/build for what you changed. State what you ran.
7. **Bahasa Indonesia** for all user-facing copy (labels, messages, AI output). Code, comments, and identifiers in English.

---

## 1. Project Shape

Monorepo with two apps plus a Docker dev stack:

```
opsmate-ai/
├── backend/            ← Laravel 13 API (PHP 8.3+), Sanctum, PostgreSQL, Redis
├── frontend/           ← React + TypeScript + Vite SPA
├── docker-compose.yml  ← postgres, redis, mailpit (dev infra)
├── Makefile            ← dev shortcuts
├── docs/
│   ├── refs/           ← PRD-MVP-Ops.md, DESIGN-Ops.md (source of truth)
│   ├── plans/          ← 00-OVERVIEW + 16 task docs (the build order)
│   ├── screens/        ← Stitch UI mockups (PNG + HTML) — match these
│   ├── CHANGES/        ← one markdown file per change set
│   └── CHANGELOG.md    ← rolling summary
└── AGENTS.md           ← this file
```

The backend is an API-only Laravel app. The frontend is a separate SPA that talks to it over `/api` using Sanctum token auth. They are deployed separately but developed together.

---

## 2. Tech Stack (locked)

| Layer    | Choice                                                                                       |
| -------- | -------------------------------------------------------------------------------------------- |
| Frontend | React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, TanStack Query, Zustand, React Hook Form, Zod, React Router, Recharts, lucide-react, axios |
| Backend  | Laravel 13, PHP 8.3+, Sanctum, PostgreSQL 16, Redis 7, Queue Worker, Scheduler, DomPDF       |
| AI       | OpenAI-compatible API via a service layer with controlled "tools" (no raw DB access for the model) |
| Dev      | Docker Compose (postgres, redis, mailpit), Makefile                                          |

Do **not** swap these out. If a dependency seems missing, check `composer.json` / `package.json` before adding.

---

## 3. Environment & Commands

Local toolchain present on the dev machine: PHP 8.4, Composer 2.8, Node 22, npm 10, Docker 29 + Compose v5. PostgreSQL/Redis run **in Docker**, not natively.

Common commands (prefer the Makefile targets):

```bash
make up            # docker compose up -d (postgres, redis, mailpit)
make down          # stop infra
make dev-backend   # php artisan serve (backend/)
make dev-frontend  # vite dev server (frontend/)
make migrate       # php artisan migrate
make seed          # php artisan db:seed
make fresh         # migrate:fresh --seed
make test-backend  # php artisan test
make test-frontend # vitest run (frontend/)
```

Backend runs at `http://localhost:8000`, frontend at `http://localhost:5173`, Mailpit UI at `http://localhost:8025`.

---

## 4. Build Order (do not skip dependencies)

Tasks live in `docs/plans/`. Follow this order; each task lists its own dependencies and acceptance criteria.

| Phase | Tasks | Theme |
| ----- | ----- | ----- |
| 0 Foundation | 01 setup, 02 design system | scaffolding + shell |
| 1 Core MVP | 03 auth, 04 business profile, 05 customers, 06 products, 07 orders, 08 payment/status, 09 dashboard, 10 invoice, 11 reminder, 12 stock, 13 daily report | CRUD + ops |
| 2 AI MVP | 14 AI assistant, 15 AI summary/follow-up/promo | AI layer |
| 3 Polish | 16 testing + pilot prep | hardening |

Before starting a task: open its `NN-TASK-*.md`, confirm dependencies are done, then implement backend → frontend → tests.

---

## 5. Backend Conventions (Laravel)

- **API only.** All routes under `routes/api.php`, prefix `/api`. No Blade views except the invoice/report PDF templates.
- **Layering:** Controller (thin) → FormRequest (validation) → Service (`app/Services/`) → Model. Business logic lives in services, not controllers.
- **Resources:** every API response goes through an `App\Http\Resources\*Resource`. Never return raw models.
- **Enums:** order status, payment status, customer type, reminder type/status, stock movement type, roles → PHP backed enums in `app/Enums/`. Match the exact string values in PRD §11 and §14.
- **Auth:** Sanctum personal access tokens. `auth:sanctum` middleware on all app routes.
- **Tenancy:** a `business_id` scope on every business-owned model (see §6). Resolve the active business from the authenticated user's membership.
- **Money:** store as integer minor units or `decimal` consistently; never float. Compute order totals server-side, never trust client totals.
- **Migrations:** one table per migration, match the schema draft in PRD §14. Use foreign keys with `cascadeOnDelete` where the PRD implies ownership.
- **Validation:** every write endpoint has a FormRequest. Reject unknown/cross-tenant ids.
- **Tests:** Pest/PHPUnit feature tests per endpoint group. Cover happy path + auth failure + tenant isolation + validation failure. Use factories, never hand-built fixtures.

### Naming
- Controllers: `App\Http\Controllers\Api\{Resource}Controller`
- Requests: `Store{Resource}Request`, `Update{Resource}Request`
- Resources: `{Resource}Resource`, `{Resource}Collection`
- Services: `{Domain}Service` (e.g. `OrderService`, `ReminderService`, `DailyReportService`)
- Enums: `OrderStatus`, `PaymentStatus`, etc.

---

## 6. Multi-Tenant Isolation (non-negotiable)

The data model is multi-tenant: one `user` can belong to one or more `businesses` via `business_users`. Every domain row (customers, products, orders, invoices, reminders, reports, ai_messages, stock_movements) belongs to exactly one `business_id`.

Rules:
- Resolve the active `business_id` from the authenticated user on every request. Never accept it from the client body as authority.
- Apply a global or explicit query scope so queries only ever see the active business's rows.
- Authorization: owner vs staff per PRD §11.1. Staff cannot touch billing/settings/business deletion. Enforce with Policies.
- Every feature test MUST include a "user from business B cannot read/write business A's data" case.

If you add a new business-owned table, it MUST have `business_id` + the scope + a tenancy test. No exceptions.

---

## 7. Frontend Conventions (React)

- **Structure:** feature-first under `src/features/{domain}/` (components, hooks, api). Shared UI in `src/components/` (`ui/` = shadcn, `layout/`, `shared/`). Cross-cutting in `src/lib/`, `src/hooks/`, `src/stores/`, `src/types/`.
- **Data fetching:** TanStack Query only. No `useEffect` + fetch. One query hook per resource in `src/features/{domain}/api/`. Mutations invalidate the right query keys.
- **HTTP:** single axios instance in `src/lib/api.ts` with the Sanctum token interceptor and base URL from `import.meta.env.VITE_API_URL`.
- **Forms:** React Hook Form + Zod resolver. Define the Zod schema once; infer the TS type from it. Mirror backend validation.
- **Client state:** Zustand for ephemeral/UI/auth-session state only. Server data stays in TanStack Query, never duplicated into a store.
- **Styling:** Tailwind v4 utilities + design tokens from `DESIGN-Ops.md`. Use shadcn components; do not hand-roll primitives that shadcn provides. Match `docs/screens/` mockups.
- **Mobile-first:** every screen works at mobile width first; bottom nav on mobile, sidebar on desktop (DESIGN §10). Touch targets ≥44px.
- **Tests:** Vitest + Testing Library for component logic and hooks. Test behavior (states, branches), not markup.

---

## 8. AI Layer Conventions

- The model never queries the DB directly. It calls **controlled tools** implemented server-side (PRD §13.3, §16.2): `get_today_summary`, `get_unpaid_orders`, `get_low_stock_products`, `get_top_products`, `get_inactive_customers`, `generate_follow_up_message`, `generate_promo_ideas`.
- Each tool is scoped to the active `business_id`. The AI cannot reach another business's data.
- The model must not invent numbers. If a figure is not in tool output, it does not state it (system prompt, PRD §16.1).
- AI never mutates data, never claims a message was sent, never makes absolute financial promises (PRD §11.11 limits).
- If the AI provider fails, core features keep working — degrade gracefully, surface a friendly error (PRD §12.3).
- Rate-limit AI endpoints (PRD §12.2). Persist conversation turns in `ai_messages` scoped by business + user.

---

## 9. Docs & Change Discipline

After any meaningful change:
1. Add a dated entry to `docs/CHANGELOG.md` (type, area, summary, risk).
2. For non-trivial change sets, add `docs/CHANGES/YYYY-MM-DD-<slug>.md` (context, what changed, impact, how to test, rollback).
3. Update `docs/RUNBOOK.md` when setup/deploy steps change.
4. Keep the relevant `docs/plans/NN-TASK-*.md` acceptance criteria honest — only check items that are actually done and verified.

Never invent test results or command output. Run it, then report it.

---

## 10. Laravel Boost (backend MCP)

The backend uses [Laravel Boost](https://laravel.com/docs/13.x/boost) to give AI agents live access to the app (schema, queries, logs, docs search).

- Installed in `backend/` as a dev dependency: `composer require laravel/boost --dev` then `php artisan boost:install`.
- Boost generates its own guideline/skill files **inside `backend/`** (e.g. `backend/AGENTS.md`, `.ai/`, `boost.json`) and an `.mcp.json` entry for the `laravel-boost` server. Those are regenerated by `boost:install` / `boost:update` — treat them as generated, do not hand-edit.
- This root `AGENTS.md` is the human-authored, repo-wide guide and is the one to maintain by hand. Boost's `backend/AGENTS.md` is package-generated Laravel guidance; keep them distinct.
- Use Boost's MCP tools (Application Info, Database Schema, Database Query, Search Docs, Last Error, Read Log Entries) when working in the backend instead of guessing framework APIs or schema.
- Run `php artisan boost:update` after adding ecosystem packages so guidelines/skills stay current.

---

## 11. Definition of Done (per task)

- Backend: migrations + models + enums + services + FormRequests + Resources + routes + Policies, all tenant-scoped.
- Frontend: pages + query/mutation hooks + forms wired to the API, matching the mockups.
- Tests: feature tests (happy path, auth, tenant isolation, validation) green; relevant frontend tests green.
- The task's acceptance criteria in its plan file are met.
- Build/lint/test run clean for the changed scope; results stated, not assumed.
- CHANGELOG + CHANGES updated.
