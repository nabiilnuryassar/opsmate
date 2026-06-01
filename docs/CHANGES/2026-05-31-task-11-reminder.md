# TASK-11 — Reminder & Follow-up System

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Eleventh task from `docs/plans/11-TASK-reminder.md`. Auto-generated operational reminders (unpaid orders, overdue invoices, low stock, unfinished orders, inactive customers) with priority grouping, snooze/done, and template-based WhatsApp follow-up messages (AI-enhanced in TASK-15).

## What changed

### Backend
- `App\Enums\ReminderType` (6), `ReminderStatus` (3), `ReminderPriority` (3).
- Migration `reminders` (business FK, dedup index on type+related, status index).
- `App\Models\Reminder` — casts, `forBusiness`, `active` scope (pending or snooze elapsed).
- `App\Services\Business\ReminderService` — `generateForBusiness` covering 5 rule types with priority computation and idempotent `upsert` dedup.
- `App\Services\Business\FollowUpMessageService` — per-type WhatsApp templates (stable interface for TASK-15 AI swap).
- `App\Http\Resources\ReminderResource`, `App\Http\Controllers\Api\ReminderController` (index priority-ordered, done, snooze, generate-message) with tenant guards.
- `App\Console\Commands\GenerateReminders` + daily 06:00 schedule in `routes/console.php`.
- Routes registered; `ReminderFactory`.

### Frontend
- `features/reminders/api/reminders-api.ts` — list/complete/snooze hooks + `generateFollowUp`.
- `components/ReminderCard.tsx` — priority left-border + tone badge + actions.
- `components/FollowUpMessageModal.tsx` — editable message + copy to clipboard.
- `pages/ReminderListPage.tsx` — grouped by priority (Urgent/Hari Ini/Nanti).
- `App.tsx` — `/reminders` route.

## Notable fix

Carbon 3 `diffInDays` returns signed values; wrapped in `abs()` so unpaid-order "urgent after 3 days" classification works.

## How to test

- Backend: `php artisan test --filter=ReminderTest` → 9 passing (unpaid generation, urgent threshold, low stock, idempotency, priority order, done hides, snooze hides, follow-up text, tenant isolation).
- Frontend: `npx vitest run` → 42 passing incl. `ReminderCard.test.tsx`.
- Build: `npm run build` clean.

## Rollback plan

- Drop `reminders` migration; delete reminder enums, model, ReminderService, FollowUpMessageService, ReminderResource, ReminderController, GenerateReminders command, factory; remove reminder routes + schedule; delete `features/reminders`; revert `App.tsx`.
