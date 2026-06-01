# TASK-10 — Invoice Sederhana

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-07
> Estimasi: 1–2 hari

---

## Tujuan

Implementasi invoice sederhana: generate dari order, lihat, download PDF, copy text, update status. Tanpa payment gateway (PRD §11.7).

---

## Scope

### 10.1 Backend

#### Database Migration: `invoices`
```
invoices
├── id (bigint, PK)
├── business_id (FK → businesses.id)
├── order_id (FK → orders.id)
├── customer_id (FK → customers.id)
├── invoice_number (string, unique per business) ← auto: INV-0001
├── issue_date (date)
├── due_date (date)
├── total (decimal 12,2)
├── status (enum: draft, sent, paid, overdue, cancelled)
├── created_at
└── updated_at
```

#### API Endpoints (PRD §15)
```http
GET    /api/invoices                        ← list + filter
POST   /api/invoices/from-order/{orderId}   ← generate from order
GET    /api/invoices/{id}                   ← detail
GET    /api/invoices/{id}/pdf               ← download PDF
PATCH  /api/invoices/{id}/status            ← update status
```

#### Invoice Number Auto-generation
Format: `INV-XXXX` → sequential per business.

#### PDF Generation
- Library: DomPDF (atau Browsershot)
- Template: clean, include business logo, business info, customer info, items, totals
- Bahasa: Indonesia

---

### 10.2 Frontend — Invoice List Page

Halaman: `/invoices`

Layout:
- Filter chips: Semua, Draft, Terkirim, Lunas, Overdue
- Invoice cards:
  ```
  INV-0012
  Sinta Permata · Rp250.000
  Jatuh tempo: 5 Juni 2026
  [Draft]
  ```
- Button: "Buat Invoice dari Order"

---

### 10.3 Frontend — Invoice Detail Page

Halaman: `/invoices/{id}`

Sections:
1. Invoice header: number, date, status badge
2. Business info: name, address, phone
3. Customer info: name, address, phone
4. Items table: product, qty, price, total
5. Totals: subtotal, discount, total
6. Actions: Download PDF, Copy Text, Update Status, Send (WhatsApp copy)

---

### 10.4 Frontend — Invoice PDF Preview

Tampilkan preview PDF di modal sebelum download.

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_invoices_table.php` | migration |
| `app/Models/Invoice.php` | model |
| `app/Enums/InvoiceStatus.php` | enum |
| `app/Http/Controllers/Api/InvoiceController.php` | CRUD |
| `app/Services/Business/InvoiceService.php` | generate from order, PDF |
| `resources/views/pdf/invoice.blade.php` | PDF template |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/invoices/pages/InvoiceListPage.tsx` | list |
| `src/features/invoices/pages/InvoiceDetailPage.tsx` | detail |
| `src/features/invoices/components/InvoiceCard.tsx` | card |
| `src/features/invoices/hooks/useInvoices.ts` | TanStack Query |

---

## Acceptance Criteria (PRD §19)

- [ ] User dapat membuat invoice dari order
- [ ] User dapat melihat daftar & detail invoice
- [ ] User dapat download invoice sebagai PDF
- [ ] User dapat copy invoice text (untuk WhatsApp)
- [ ] User dapat mengubah status invoice
- [ ] Invoice number auto-generated (INV-XXXX)
- [ ] PDF template bersih dan profesional
- [ ] Export PDF maksimal 10 detik (PRD §12.1)
