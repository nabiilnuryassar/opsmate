# TASK-04 — Business Profile & Onboarding

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Fourth task from `docs/plans/04-TASK-business-profile.md`. The `businesses`/`business_users` tables and `Business` model were created in TASK-03 (register auto-creates the owner business). This task adds profile editing, the onboarding flow, and the tenancy resolver every later feature depends on.

## What changed

### Backend
- `App\Enums\BusinessCategory` — 9 PRD categories + `label()` + `options()`.
- `App\Support\ActiveBusiness` — single chokepoint resolving the authenticated user's active business (`forUser`, `forUserOrFail`). All tenant-scoped controllers use this.
- `App\Http\Resources\BusinessResource` — profile fields + derived `is_complete` (category+phone+city).
- `App\Http\Requests\UpdateBusinessRequest` — validates name + enum category.
- `App\Http\Controllers\Api\BusinessController` — `show`, `update`.
- `routes/api.php` — `GET/PUT /api/business` in the `auth:sanctum` group.

### Frontend
- `features/business/types.ts` — `BUSINESS_CATEGORIES`, `Business`, payload types.
- `features/business/api/business-api.ts` — `useBusiness`, `useUpdateBusiness` (invalidates `/me`).
- `features/business/pages/OnboardingPage.tsx` — 3-step wizard (profil → layanan → selesai) with per-step validation gating.
- `features/settings/pages/BusinessProfilePage.tsx` — edit profile inside AppShell.
- `App.tsx` — `/onboarding`, `/settings/business` protected routes.

## Impact

- Every tenant-scoped controller from TASK-05 onward resolves its business through `ActiveBusiness`.
- After register, the SPA can route to `/onboarding` to complete the profile; `is_complete` drives that decision.

## How to test

- Backend: `docker compose exec backend php artisan test --filter=BusinessTest` → 6 passing (show, auth, update+complete flag, invalid category 422, name required 422, cross-tenant isolation).
- Frontend: `npx vitest run` → 11 passing incl. `OnboardingPage.test.tsx` (step gating blocks/advances).

## Rollback plan

- Delete BusinessCategory enum, ActiveBusiness, BusinessResource, UpdateBusinessRequest, BusinessController; remove `/api/business` routes; delete `features/business`, `features/settings`; revert `App.tsx`.
