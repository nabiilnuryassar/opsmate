# TASK-03 — Authentication

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Third task from `docs/plans/03-TASK-authentication.md`. Full auth: register, login, logout, me, forgot/reset password, route protection. Register auto-creates the user's business, establishing the multi-tenant foundation (AGENTS.md §6).

## What changed

### Backend
- Migrations: `businesses`, `business_users` (unique `business_id+user_id`, cascade deletes).
- `App\Enums\BusinessRole` (owner/staff).
- Models: `Business` (owner, members, `hasMember`, `roleFor`), `User` extended with `HasApiTokens`, `ownedBusinesses`, `businesses`, `currentBusiness`.
- `App\Services\Business\BusinessProvisioner` — transactional create-business-and-attach-owner.
- Requests: `RegisterRequest`, `LoginRequest` (Indonesian validation messages).
- `App\Http\Resources\UserResource` — user + current business summary.
- `AuthController` — register (201 + token), login, logout (revoke current token), me, forgotPassword (no email enumeration), resetPassword.
- `routes/api.php` — public auth routes + `auth:sanctum` group.

### Frontend
- `features/auth/types.ts`, `features/auth/api/auth-api.ts` (useMe/useLogin/useRegister/useLogout via TanStack Query + Zustand).
- Pages: `LoginPage`, `RegisterPage`, `ForgotPasswordPage`; `AuthLayout` (centered card).
- `components/shared/ProtectedRoute.tsx` — guard redirecting to `/login`.
- `features/dashboard/DashboardScreen.tsx` — authed dashboard with logout.
- `App.tsx` — public + protected routes; `.auth-input` utility in `index.css`.

## Impact

- Unauthenticated users cannot reach the dashboard.
- Every new user gets an owner-scoped business — basis for tenancy in later tasks.
- Passwords hashed (bcrypt), verified by test.

## How to test

- Backend: `docker compose exec backend php artisan test --filter=AuthTest` → 8 passing (register/business/token, hash verify, dup email 422, short password 422, login ok/fail, me auth, logout revoke).
- Frontend: `npx vitest run` → 9 passing incl. `auth-store.test.ts` token persistence.
- Manual: register → me → login → dup(422) → bad login(422) all confirmed via curl.

## Rollback plan

- Drop `businesses`/`business_users` migrations; delete AuthController, requests, resource, provisioner, enum, Business model; revert User model; delete `features/auth`, ProtectedRoute, DashboardScreen; restore prior `routes/api.php` and `App.tsx`.
