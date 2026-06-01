# TASK-10 — Invoice Sederhana

Date: 2026-05-31
Area: backend, frontend
Type: feat

## Context

Tenth task from `docs/plans/10-TASK-invoice.md`. Generate invoices from orders, render PDF (DomPDF), export WhatsApp text, update status. No payment gateway (PRD §11.7).

## What changed

### Backend
- `App\Enums\InvoiceStatus` (draft/sent/paid/overdue/cancelled + labels).
- Migration `invoices` (per-business unique invoice_number, status index, FKs).
- `App\Models\Invoice` (HasFactory, casts, relations, `forBusiness`).
- `App\Services\Business\InvoiceService` — `fromOrder` (idempotent, INV-XXXX numbering, default 7-day due), `renderPdf` (DomPDF), `toText` (WhatsApp-ready).
- `InvoiceResource`, `InvoiceController` (index+filter, fromOrder, show, pdf, text, updateStatus) with tenant guards.
- `resources/views/pdf/invoice.blade.php` — clean Indonesian template.
- Routes registered (custom endpoints before resource). `OrderItem` gained `HasFactory`; `InvoiceFactory`.

### Frontend
- `features/invoices/api/invoices-api.ts` — hooks + `invoicePdfUrl` + `fetchInvoiceText`.
- `components/InvoiceCard.tsx` — number, customer, amount, due date, status tone.
- `pages/InvoiceListPage.tsx` — status filter chips + empty state.
- `pages/InvoiceDetailPage.tsx` — download PDF, copy text, status controls.
- `App.tsx` — invoice routes.

## How to test

- Backend: `php artisan test --filter=InvoiceTest` → 9 passing (generate, idempotent, INV numbering, cross-tenant order 404, status filter+scope, status update, PDF `%PDF`, text, cross-tenant view/pdf 404).
- Frontend: `npx vitest run` → 39 passing incl. `InvoiceCard.test.tsx` (status tone mapping + render).
- Build: `npm run build` clean.

## Rollback plan

- Drop `invoices` migration; delete InvoiceStatus, Invoice, InvoiceService, InvoiceResource, InvoiceController, blade template, factory; remove invoice routes; delete `features/invoices`; revert `App.tsx`.
