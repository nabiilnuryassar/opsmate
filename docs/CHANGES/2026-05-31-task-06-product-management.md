# TASK-06 — Product / Service Management (CRUD)

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Sixth task from `docs/plans/06-TASK-product-management.md`. Product/service CRUD with stock tracking, low-stock detection, and margin, all scoped per business. Order-history coupling is deferred to TASK-07.

## What changed

### Backend
- `App\Enums\ProductType` (product/service + labels).
- Migration `products` — business_id FK (cascade), nullable stock/minimum_stock (null for services), soft deletes, indexes on `(business_id, name)` and `(business_id, type)`.
- `App\Models\Product` — HasFactory + SoftDeletes, `forBusiness`/`lowStock` scopes, `isLowStock()`, casts.
- `App\Http\Requests\ProductRequest` — name+price required, enum type; `prepareForValidation` nulls stock for services.
- `App\Http\Resources\ProductResource` — fields + derived `is_low_stock` + `margin`.
- `App\Http\Controllers\Api\ProductController` — index (search, filter type/category/low_stock/is_active, sort, paginate), lowStock, store, show, update, destroy; per-row tenant guard.
- `routes/api.php` — `/products/low-stock` before `apiResource('products')`.
- `ProductFactory` (+ `service()`, `lowStock()` states).

### Frontend
- `features/products/types.ts`, `api/products-api.ts` (list/detail/create/update/delete).
- `components/ProductCard.tsx` — price, stock/service label, low-stock + inactive badges.
- `pages/ProductListPage.tsx` — search + filter chips (Semua/Produk/Layanan/Stok Rendah) + empty state.
- `pages/ProductFormPage.tsx` — add/edit, stock fields hidden for services.
- `pages/ProductDetailPage.tsx` — info, stock, margin cards.
- `App.tsx` — product routes.

## Impact

- Products/services manageable end-to-end, business-scoped, with low-stock signalling that TASK-12 (stock tracking) and TASK-09 (dashboard) build on.

## How to test

- Backend: `docker compose exec backend php artisan test --filter=ProductTest` → 9 passing (own-products scoping, store+margin, service stock-nulling, name/price required 422, low-stock endpoint + filter, type filter, cross-tenant 404, soft delete).
- Frontend: `npx vitest run` → 21 passing incl. `ProductCard.test.tsx` (6: low-stock/inactive badges, service vs stock label, rupiah, onClick).

## Rollback plan

- Drop `products` migration; delete ProductType, Product model, request, resource, controller, factory; remove product routes; delete `features/products`; revert `App.tsx`.
