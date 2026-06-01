# TASK-07 — Order Management (CRUD)

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Seventh task from `docs/plans/07-TASK-order-management.md`. Orders are the core feature: fast entry, auto-numbering, server-computed totals, and price snapshots. Depends on TASK-05 (customers) and TASK-06 (products), and unblocks the customer order-history deferred earlier.

## What changed

### Backend
- `App\Enums\OrderStatus` (7 states + `isFinished()`), `App\Enums\PaymentStatus` (4 states).
- Migrations `orders` (per-business unique order_number, status/payment indexes, soft deletes) and `order_items` (product snapshot columns, nullOnDelete product FK).
- `App\Models\Order` (HasFactory, SoftDeletes, relations, casts), `App\Models\OrderItem`.
- `App\Services\Business\OrderService` — atomic `create`/`update` in DB transactions, `ORD-XXXX` numbering per business, server-side subtotal/total, product name+price snapshots, cross-tenant product guard, touches customer `last_order_at`.
- `CreateOrderRequest`, `OrderResource`, `OrderItemResource`.
- `OrderController` — index (search, status/payment/today/date filters, sort), store, show, update, destroy, `updateStatus`, `updatePaymentStatus`; tenant + customer-in-business guards.
- Routes: status PATCH endpoints before `apiResource('orders')`.
- Customer order-history: `Customer::orders()`, `orders_count`, `GET /customers/{id}/orders`.
- `OrderFactory`, `OrderItemFactory`.

### Frontend
- `features/orders/types.ts`, `api/orders-api.ts` (list/detail/create/update/status/payment/delete).
- `components/OrderCard.tsx` — avatar, number/date, dual badges, unpaid emphasis.
- `pages/OrderListPage.tsx` — search + filter chips (Semua/Hari Ini/Belum Bayar/Diproses/Selesai).
- `pages/OrderFormPage.tsx` — customer select + inline-add link, product search/add, qty steppers, segmented payment/order status, notes, sticky-bottom live total + Save (mockup parity).
- `pages/OrderDetailPage.tsx` — items, totals, inline status + payment-status controls, WA follow-up.
- `App.tsx` — order routes.

## How to test

- Backend: `php artisan test --filter="OrderTest|CustomerTest"` → 21 passing (totals, ORD numbering, snapshots, status/payment PATCH, invalid status 422, min-1-item, cross-tenant customer/product 422, tenant isolation, payment filter, soft delete, customer history).
- Frontend: `npx vitest run` → 23 passing incl. `OrderFormPage.test.tsx` (live total recompute, submit gating).

## Rollback plan

- Drop `orders`/`order_items` migrations; delete order enums, models, service, request, resources, controller, factories; revert customer order-history additions and routes; delete `features/orders`; revert `App.tsx`.
