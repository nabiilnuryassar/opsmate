# CHANGELOG

## [2026-05-31] - docs - User Guide, API Reference & Architecture Docs
- Type: docs
- Area: docs
- Summary: Added docs/GUIDE.md (panduan pengguna owner/staff, 13 bagian + FAQ), docs/API.md (referensi REST API lengkap: konvensi, enum, semua endpoint + payload), docs/ARCHITECTURE.md (arsitektur sistem, model data, stability + scaling playbook), and docs/README.md (indeks dokumentasi). Bersumber dari routes/api.php + service/resource aktual.
- Risk: none (dokumentasi saja)
- Docs: docs/README.md (indeks)

## [2026-05-31] - chore - Production Deployment Hardening
- Type: chore
- Area: backend, frontend, devops
- Summary: Replaced dev-server prod config with a real deployable stack — backend php-fpm image (opcache, prod composer install, cache-warming entrypoint), web image that builds the SPA and bakes it into nginx (FastCGI to php-fpm, fixes "frontend 404 in prod"), .env.production template, queue+scheduler services, .dockerignore files. Verified: both images build, php-fpm boots with correct extensions, full stack smoke-tested (SPA 200, /up 200, /api/user 401)
- Risk: low (prod config only; app code unchanged)
- Verification: docker build (both images) + full prod stack boot + HTTP smoke test, then torn down
- Docs: CHANGES/2026-05-31-production-hardening.md

## [2026-05-31] - chore - TASK-16 Polish, Testing & Pilot Prep
- Type: chore
- Area: backend, devops, docs
- Summary: DemoSeeder (Rina Catering: 5 customers, 5 products, 5 orders, derived reminders + daily report), full order-lifecycle integration test, production deploy config (docker-compose.prod.yml + nginx.conf with queue/scheduler), RUNBOOK testing + deployment sections
- Risk: low
- Tests: OrderLifecycleTest.php (1 e2e passing); full suite 109 backend + 55 frontend green
- Docs: CHANGES/2026-05-31-task-16-polish-testing.md

## [2026-05-31] - feat - TASK-15 AI Summary, Follow-up & Promo
- Type: feat
- Area: backend, frontend
- Summary: AISummaryService (cached dashboard summary), AIFollowUpService (payment/reorder/general WA drafts), AIPromoService (top-product promo ideas), AIDailyReportService (persists report ai_summary); all LLM-or-template with graceful fallback. Endpoints: dashboard/ai-summary, ai/generate-follow-up, ai/generate-promo-ideas, ai/generate-daily-summary. Frontend: real AI dashboard summary, PromoIdeasPanel, AIInsightCard inline on order + customer detail with follow-up modal
- Risk: medium (AI generation, degrades to templates)
- Tests: AIFeaturesTest.php (7 passing), AIInsightCard.test.tsx (3 passing)
- Docs: CHANGES/2026-05-31-task-15-ai-features.md

## [2026-05-31] - feat - TASK-14 AI Business Assistant
- Type: feat
- Area: backend, frontend
- Summary: AI chat with controlled business-scoped tools (AIToolService), LlmClient contract (OpenAI impl + deterministic keyless fallback), AIPromptBuilder system prompt + context block, AIAssistantService orchestration with graceful degradation + rate limiting, ai_messages persistence; frontend chat UI (bubbles, embedded unpaid data cards, suggested prompts, typing indicator)
- Risk: medium (external provider, rate limit, tenant data exposure)
- Tests: AIAssistantTest.php (7 passing incl. tenant non-leak + rate limit), ChatBubble.test.tsx (3 passing)
- Docs: CHANGES/2026-05-31-task-14-ai-assistant.md

## [2026-05-31] - feat - TASK-13 Daily Report
- Type: feat
- Area: backend, frontend
- Summary: DailyReport model, ReportService (idempotent per-date aggregation: orders/revenue/unpaid/completed/new-customers/top-products/low-stock + fallback summary), report endpoints + PDF, scheduled reports:daily command; frontend report page with date navigation, metrics, top-products bars, PDF/copy actions
- Risk: low
- Tests: DailyReportTest.php (9 passing), TopProducts.test.tsx (3 passing)
- Docs: CHANGES/2026-05-31-task-13-daily-report.md

## [2026-05-31] - feat - TASK-12 Stock Tracking & Low Stock Alert
- Type: feat
- Area: backend, frontend
- Summary: StockMovement model + enum, StockService (auto-reduce on order finished, reverse on cancel, idempotent per order; manual in/out/adjustment with zero clamp), stock-movements + stock-adjustment endpoints; frontend StockAdjustmentModal + StockMovementHistory in product detail
- Risk: medium (auto stock mutation on order status)
- Tests: StockTest.php (8 passing), StockMovementHistory.test.tsx (4 passing)
- Docs: CHANGES/2026-05-31-task-12-stock-tracking.md

## [2026-05-31] - feat - TASK-11 Reminder & Follow-up System
- Type: feat
- Area: backend, frontend
- Summary: Reminder model + 3 enums, ReminderService auto-generation (unpaid orders, overdue invoices, low stock, unfinished orders, inactive customers) with priority + idempotent dedup, scheduled reminders:generate command, FollowUpMessageService (template-based WA messages), done/snooze endpoints; frontend grouped reminder list, ReminderCard with priority borders, follow-up message modal
- Risk: medium (scheduled job, auto-generation)
- Tests: ReminderTest.php (9 passing), ReminderCard.test.tsx (3 passing)
- Docs: CHANGES/2026-05-31-task-11-reminder.md

## [2026-05-31] - feat - TASK-10 Invoice Sederhana
- Type: feat
- Area: backend, frontend
- Summary: Invoice generation from order (idempotent, INV-XXXX numbering), DomPDF rendering, WhatsApp text export, status updates; frontend invoice list (filter chips), detail page (download PDF, copy text, status controls), InvoiceCard
- Risk: low
- Tests: InvoiceTest.php (9 passing incl. idempotency, PDF, tenant isolation), InvoiceCard.test.tsx (3 passing)
- Docs: CHANGES/2026-05-31-task-10-invoice.md

## [2026-05-31] - feat - TASK-09 Dashboard & Metrics
- Type: feat
- Area: backend, frontend
- Summary: DashboardService (today's orders/revenue/unpaid/processing/new-customers/low-stock with day-over-day trends, time-bucketed greeting, refund-excluded revenue), GET /dashboard/summary; frontend responsive DashboardPage (AI summary hero, quick actions, 4 metric cards, recent orders, low-stock panel)
- Risk: low
- Tests: DashboardTest.php (5 passing incl. tenant isolation + refund exclusion), summary.test.ts (7 passing)
- Docs: CHANGES/2026-05-31-task-09-dashboard.md

## [2026-05-31] - feat - TASK-08 Payment & Order Status Tracking
- Type: feat
- Area: backend, frontend
- Summary: OrderStatusService state machine (valid transitions only, Indonesian rejection messages), order_activities audit log auto-recorded on status/payment change; frontend StatusControl/PaymentStatusControl showing only valid forward transitions + ActivityTimeline in order detail
- Risk: medium (state machine, audit)
- Tests: OrderStatusTransitionTest.php (8 passing), transitions.test.ts (7 passing)
- Docs: CHANGES/2026-05-31-task-08-payment-status.md

## [2026-05-31] - feat - TASK-07 Order Management (CRUD)
- Type: feat
- Area: backend, frontend
- Summary: Orders + order_items with OrderService (atomic create/update, auto ORD-XXXX numbering, server-side totals, product name/price snapshots), OrderStatus/PaymentStatus enums, status + payment-status PATCH endpoints; frontend fast order form (customer/product pickers, qty steppers, segmented status, sticky total), list with filter chips, detail with status controls; wired customer order-history (deferred from TASK-05)
- Risk: medium (core feature, money calc)
- Tests: OrderTest.php (12 passing), CustomerTest.php (9), OrderFormPage.test.tsx (2)
- Docs: CHANGES/2026-05-31-task-07-order-management.md

## [2026-05-31] - feat - TASK-06 Product/Service Management (CRUD)
- Type: feat
- Area: backend, frontend
- Summary: Product/service CRUD with ProductType enum, low-stock detection (stock<=minimum), service stock-nulling, margin calc, search/filter/sort; frontend list (filter chips incl. Stok Rendah), add/edit form (conditional stock fields), detail page, ProductCard
- Risk: low
- Tests: ProductTest.php (9 passing incl. tenant isolation), ProductCard.test.tsx (6 passing)
- Docs: CHANGES/2026-05-31-task-06-product-management.md

## [2026-05-31] - feat - TASK-05 Customer Management (CRUD)
- Type: feat
- Area: backend, frontend
- Summary: Customer CRUD with search/filter/sort/pagination, CustomerType enum, soft deletes, tenant scoping; frontend list (search + filter chips), add/edit form, detail page, CustomerCard with phone masking
- Risk: low
- Tests: CustomerTest.php (9 passing incl. tenant isolation), CustomerCard.test.ts (4 passing)
- Docs: CHANGES/2026-05-31-task-05-customer-management.md

## [2026-05-31] - feat - TASK-04 Business Profile & Onboarding
- Type: feat
- Area: backend, frontend
- Summary: BusinessCategory enum, BusinessController (show/update) with ActiveBusiness tenancy resolver, BusinessResource (is_complete); frontend business API hooks, 3-step onboarding wizard, and settings business-profile page
- Risk: low
- Tests: BusinessTest.php (6 passing incl. tenant isolation), OnboardingPage.test.tsx (2 passing)
- Docs: CHANGES/2026-05-31-task-04-business-profile.md

## [2026-05-31] - feat - TASK-03 Authentication
- Type: feat
- Area: backend, frontend
- Summary: Sanctum token auth (register auto-creates owner business, login, logout, me, forgot/reset password); tenancy foundation (businesses + business_users + BusinessRole enum); frontend auth pages (login/register/forgot), auth store, ProtectedRoute guard
- Risk: medium (security-sensitive)
- Tests: AuthTest.php (8 passing), auth-store.test.ts (3 passing)
- Docs: CHANGES/2026-05-31-task-03-authentication.md

## [2026-05-31] - feat - TASK-02 Design System & Layout Shell
- Type: feat
- Area: frontend
- Summary: Implemented Tailwind v4 design tokens (colors, type scale, radius, shadows, gradients), Google Fonts, UI primitives (Button, Card), shared components (StatusBadge, EmptyState, AIGradientCard), and the responsive AppShell (mobile header + floating bottom nav, desktop sidebar + top bar)
- Risk: low
- Tests: StatusBadge.test.tsx (6 passing)
- Docs: CHANGES/2026-05-31-task-02-design-system.md

## [2026-05-31] - chore - TASK-01 Project Setup & Scaffolding
- Type: chore
- Area: backend, frontend, devops
- Summary: Scaffolded Laravel 13 API backend (Sanctum, DomPDF, predis, Laravel Boost MCP) and React+TS+Vite frontend (TanStack Query, Zustand, RHF+Zod, Router, Tailwind v4); Dockerized backend+postgres+redis; added Makefile and root AGENTS.md
- Risk: low
- Docs: CHANGES/2026-05-31-task-01-project-setup.md

## [2026-05-31] - docs - Create Modular Implementation Plans
- Type: docs
- Area: docs/plans
- Summary: Created 17 modular task documents (00-OVERVIEW + 01–16 TASKs) covering full MVP implementation from project setup to pilot preparation
- Risk: low
- Docs: CHANGES/2026-05-31-implementation-plans.md

## [2026-05-31] - docs - Add Stitch Mockups for OpsMate AI
- Type: chore
- Area: docs
- Summary: Downloaded Stitch mockup HTML and PNG files to `/docs/screens`
- Risk: low
- Docs: CHANGES/2026-05-31-add-mockups.md
