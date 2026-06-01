# TASK-13 — Daily Report

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Thirteenth task from `docs/plans/13-TASK-daily-report.md`. Auto-generated daily report summarizing the day's performance: orders, revenue, unpaid, top products, low stock, new customers, plus a fallback summary (AI summary filled in TASK-15).

## What changed

### Backend
- Migration `daily_reports` (unique business+date, JSON top-products/low-stock, ai_summary slot).
- `App\Models\DailyReport` (casts incl. array, `forBusiness`).
- `App\Services\Business\ReportService` — `generate` (idempotent `updateOrCreate` per business+date, refund-excluded revenue, top-5 products via order_items aggregation, low-stock list); `fallbackSummary` (template, branch on orders/unpaid/low-stock).
- `App\Http\Resources\DailyReportResource`.
- `App\Http\Controllers\Api\ReportController` — `daily`, `dailyForDate`, `pdf`; explicit 200 status; invalid-date 422.
- `resources/views/pdf/daily-report.blade.php`.
- `App\Console\Commands\GenerateDailyReport` + 23:59 schedule.
- Routes registered (specific before `{date}` catch-all).

### Frontend
- `features/reports/api/reports-api.ts` — `useDailyReport` + `reportPdfUrl`.
- Components: `ReportMetrics`, `TopProducts` (bar ranking), `ReportActions` (PDF/copy/Tanya AI).
- `pages/DailyReportPage.tsx` — date navigation (prev/next, today-capped), summary card, metrics, top products, low stock.
- `App.tsx` — `/reports` + `/reports/daily` routes.

## How to test

- Backend: `php artisan test --filter=DailyReportTest` → 9 passing (auth, aggregation, top-products ranking, low-stock, fallback summary, persistence+scope, empty past date, invalid date 422, PDF).
- Frontend: `npx vitest run` → 49 passing incl. `TopProducts.test.tsx` (empty, render, bar scaling).
- Build: `npm run build` clean.

## Rollback plan

- Drop `daily_reports` migration; delete DailyReport, ReportService, DailyReportResource, ReportController, blade template, GenerateDailyReport command + schedule, routes; delete `features/reports`; revert `App.tsx`.
