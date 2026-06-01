# TASK-09 — Dashboard & Metrics

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Ninth task from `docs/plans/09-TASK-dashboard.md`. The dashboard answers "Hari ini bisnis saya gimana?" — the most important screen, matching the Stitch mockups (mobile + desktop).

## What changed

### Backend
- `App\Services\Business\DashboardService` — `metrics()` aggregates today's orders, revenue (excludes refunded), unpaid total/count, processing count, new customers, low-stock count, with day-over-day trends; `greeting()` bucketed by hour.
- `App\Http\Controllers\Api\DashboardController` — `GET /dashboard/summary` returns greeting, business name, metrics, 5 recent orders, low-stock products. Reminders array reserved for TASK-11.
- Route registered in the `auth:sanctum` group.

### Frontend
- `features/dashboard/api/dashboard-api.ts` — `useDashboard` hook + types.
- `features/dashboard/summary.ts` — `trendTone` + `buildSummary` (extracted, tested logic).
- Components: `AISummaryCard` (gradient hero), `MetricCard`, `QuickActionGrid`, `RecentOrders`, `LowStockPanel`.
- `pages/DashboardPage.tsx` — responsive layout (2-col metrics mobile / 4-col desktop, recent orders + low-stock side panel).
- `App.tsx` now routes `/` to `DashboardPage`; removed the placeholder `DashboardScreen`.

## Impact

- Live operational dashboard replacing the scaffold placeholder.
- Reminders section will be filled by TASK-11.

## How to test

- Backend: `php artisan test --filter=DashboardTest` → 5 passing (auth, today metrics, tenant exclusion, recent+low-stock, refund-excluded revenue).
- Frontend: `npx vitest run` → 36 passing incl. `summary.test.ts` (7: trend tone up/down/neutral, summary unpaid/paid/empty branches).
- Build: `npm run build` clean.

## Rollback plan

- Delete DashboardService, DashboardController, dashboard route; delete `features/dashboard/{api,components,pages,summary*}`; restore placeholder DashboardScreen and revert `App.tsx`.
