# TASK-05 — Customer Management (CRUD)

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Fifth task from `docs/plans/05-TASK-customer-management.md`. Full customer CRUD scoped per business, with search, filter, and soft deletes. Order-history coupling is intentionally deferred to TASK-07 (Order model does not exist yet).

## What changed

### Backend
- `App\Enums\CustomerType` (new/regular/vip/inactive + labels).
- Migration `customers` — business_id FK (cascade), soft deletes, `(business_id, name)` index.
- `App\Models\Customer` — HasFactory + SoftDeletes, `forBusiness` scope, CustomerType cast.
- `App\Http\Requests\CustomerRequest` — name required, enum type, email format.
- `App\Http\Resources\CustomerResource` — fields + `orders_count` (whenCounted, populated in TASK-07).
- `App\Http\Controllers\Api\CustomerController` — index (search name/phone/email, filter type, sort, paginate 20), store, show, update, destroy; per-row `authorizeCustomer` tenant guard.
- `routes/api.php` — `apiResource('customers')`.
- Added `HasFactory` to `Business`; `BusinessFactory`, `CustomerFactory`.

### Frontend
- `features/customers/types.ts`, `api/customers-api.ts` (list/detail/create/update/delete hooks).
- `components/CustomerCard.tsx` — avatar initials, masked phone, last-order label, type badge.
- `pages/CustomerListPage.tsx` — search + filter chips + empty state.
- `pages/CustomerFormPage.tsx` — add/edit with Zod validation.
- `pages/CustomerDetailPage.tsx` — info card, quick actions (order/WA follow-up), delete; order history placeholder for TASK-07.
- `App.tsx` — customer routes.

## Impact

- Customers are now manageable end-to-end and strictly business-scoped.
- `orders_count` and the detail order-history list are wired in TASK-07.

## How to test

- Backend: `docker compose exec backend php artisan test --filter=CustomerTest` → 9 passing (list scoping, auth, search name/phone, filter type, store+scope, name required 422, cross-tenant show/update/destroy 404, update, soft delete).
- Frontend: `npx vitest run` → 15 passing incl. `CustomerCard.test.ts` (phone masking).

## Rollback plan

- Drop `customers` migration; delete CustomerType, Customer model, request, resource, controller; remove customer routes; delete `features/customers`; revert `App.tsx`.
