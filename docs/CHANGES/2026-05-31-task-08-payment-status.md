# TASK-08 — Payment & Order Status Tracking

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Eighth task from `docs/plans/08-TASK-payment-status.md`. The status PATCH endpoints existed since TASK-07, but accepted any value. This task adds a transition state machine, an audit log, and UI that only offers valid transitions.

## What changed

### Backend
- `App\Services\Business\OrderStatusService` — order + payment transition maps, `canTransition*`/`assertTransition*` (throws 422 with Indonesian messages). `cancelled` reachable from any non-terminal order state; `delivered`/`cancelled`/`refunded` terminal.
- Migration `order_activities` (append-only: action, from/to, user) + `App\Models\OrderActivity`.
- `Order::activities()` relation.
- `OrderController` — injects `OrderStatusService`; `updateStatus`/`updatePaymentStatus` now validate the transition and log an activity row (skipping no-op self-transitions).
- `OrderResource` — exposes `activities` when loaded.

### Frontend
- `features/orders/transitions.ts` — `ORDER_TRANSITIONS`/`PAYMENT_TRANSITIONS` mirroring the backend, `allowedOrderTargets`/`allowedPaymentTargets`.
- `components/StatusControl.tsx`, `components/PaymentStatusControl.tsx` — show current + only valid forward transitions.
- `components/ActivityTimeline.tsx` — renders the audit log with Indonesian labels.
- `OrderDetailPage` — replaced the old all-buttons pickers with the transition-aware controls + an Aktivitas timeline.
- `Order` type gains `activities`.

## Impact

- Invalid status jumps (e.g. completed → new) are rejected both in the UI (not offered) and the API (422).
- Every status/payment change is auditable via `order_activities`.

## How to test

- Backend: `php artisan test --filter=OrderStatusTransitionTest` → 8 passing (valid+logged, invalid rejected+no log, cancel from processing, delivered terminal, payment valid/invalid, paid→refunded, self no-op).
- Frontend: `npx vitest run` → 30 passing incl. `transitions.test.ts` (7: forward-only, terminal states, no backward-to-new).

## Rollback plan

- Drop `order_activities` migration; delete OrderStatusService, OrderActivity, `Order::activities`; revert OrderController status methods to plain update; revert OrderResource; delete the three order components + `transitions.ts`; revert OrderDetailPage status cards.
