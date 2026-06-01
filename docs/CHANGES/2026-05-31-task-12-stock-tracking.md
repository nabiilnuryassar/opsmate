# TASK-12 — Stock Tracking & Low Stock Alert

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Twelfth task from `docs/plans/12-TASK-stock-tracking.md`. Stock movements, auto-reduction when orders are fulfilled, reversal on cancel, manual adjustments, and per-product movement history. Low-stock detection + dashboard panel already shipped in TASK-06/09.

## What changed

### Backend
- `App\Enums\StockMovementType` (in/out/adjustment + labels).
- Migration `stock_movements` (business+product FKs, signed quantity, reference_type/id, created_by).
- `App\Models\StockMovement` (HasFactory, casts, `forBusiness`).
- `App\Services\Business\StockService`:
  - `reduceForOrder` — type=out per tracked item, idempotent per order.
  - `reverseForOrder` — type=in, only if reduced and not already reversed.
  - `adjust` — manual in/out (delta) or adjustment (absolute, records delta); zero-clamped; rejects services.
- `ProductController` — `stockMovements`, `stockAdjustment` endpoints (tenant-guarded).
- `OrderController` — on status transition: reduce stock when `isFinished()`, reverse when `cancelled`.
- `StockMovementResource`; routes registered (movements/adjustment before resource); `StockMovementFactory`.

### Frontend
- `products-api.ts` — `useStockMovements`, `useStockAdjustment`, types.
- `components/StockAdjustmentModal.tsx` — masuk/keluar/koreksi form.
- `components/StockMovementHistory.tsx` — signed history with type tone + order source flag.
- `ProductDetailPage` — "Sesuaikan" button, history card, modal.

## How to test

- Backend: `php artisan test --filter=StockTest` → 8 passing (in adds, out clamps at 0, adjustment absolute+delta, service rejected, completing reduces, idempotent across completed→delivered, cancel restores, history tenant-scoped).
- Frontend: `npx vitest run` → 46 passing incl. `StockMovementHistory.test.tsx`.
- Build: `npm run build` clean.

## Rollback plan

- Drop `stock_movements` migration; delete StockMovementType, StockMovement, StockService, StockMovementResource, factory; revert ProductController + OrderController stock wiring + routes; delete the two product components + their wiring in ProductDetailPage; revert products-api additions.
