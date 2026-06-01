# TASK-15 — AI Summary, Follow-up & Promo Features

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Fifteenth task from `docs/plans/15-TASK-ai-features.md`. Extends the AI layer (TASK-14) with targeted generation: dashboard summary, follow-up messages, promo ideas, daily-report summary, and inline insights. Everything degrades to deterministic templates when no provider key is set (PRD §12.3).

## What changed

### Backend
- `App\Services\AI\AISummaryService` — cached (15 min) dashboard summary, LLM or template.
- `App\Services\AI\AIFollowUpService` — payment/reorder/general WhatsApp drafts.
- `App\Services\AI\AIPromoService` — promo ideas grounded in top products.
- `App\Services\AI\AIDailyReportService` — generates + persists `daily_reports.ai_summary`.
- `AIController` extended: `dashboardSummary`, `generateFollowUp`, `generatePromoIdeas`, `generateDailySummary` (tenant-guarded, validated).
- Routes: `GET /dashboard/ai-summary`, `POST /ai/generate-follow-up|promo-ideas|daily-summary`.

### Frontend
- `ai-api.ts` — `useAISummary`, `generateFollowUp`, `useGeneratePromoIdeas`.
- Dashboard `AISummaryCard` now shows the real AI summary (template fallback while loading).
- `components/PromoIdeasPanel.tsx` — on-demand promo generation + copy.
- `components/AIInsightCard.tsx` — inline suggestion card.
- Order detail: unpaid → AI follow-up nudge + message modal.
- Customer detail: inactive → reorder follow-up nudge + message modal.

## How to test

- Backend: `php artisan test --filter=AIFeaturesTest` → 7 passing (grounded dashboard summary, payment follow-up content, invalid type 422, cross-tenant customer 404, promo top-product, daily summary persisted, auth).
- Frontend: `npx vitest run` → 55 passing incl. `AIInsightCard.test.tsx`.
- Build clean; all generation falls back to templates without an API key.

## Rollback plan

- Delete the four AI service classes; revert AIController extensions + routes; revert dashboard AISummaryCard wiring; delete PromoIdeasPanel + AIInsightCard and their usage in order/customer detail; revert ai-api additions.
