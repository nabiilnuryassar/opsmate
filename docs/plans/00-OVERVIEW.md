# OpsMate AI — Master Implementation Plan

> AI Ops Manager untuk UMKM & Bisnis Jasa Kecil

## Dokumen Referensi

- [DESIGN-Ops.md](file:///c:/laragon/www/opsmate-ai/docs/refs/DESIGN-Ops.md) — Design System & UI/UX Spec
- [PRD-MVP-Ops.md](file:///c:/laragon/www/opsmate-ai/docs/refs/PRD-MVP-Ops.md) — Product Requirements & MVP Scope
- [Screen Mockups](file:///c:/laragon/www/opsmate-ai/docs/screens) — Stitch UI/UX Mockups (Mobile + Desktop)

---

## Ringkasan Produk

**OpsMate AI** adalah aplikasi AI Ops Manager untuk UMKM yang membantu owner:
- Mencatat order
- Mengelola customer
- Membuat invoice
- Memantau pembayaran & stok
- Membuat laporan harian otomatis
- Mendapatkan insight bisnis dari AI

**Core Promise:** *Membantu bisnis kecil jadi lebih rapi, tidak lupa follow-up, dan tahu kondisi bisnis setiap hari.*

---

## Tech Stack (dari PRD §13)

| Layer     | Teknologi                                                    |
| --------- | ------------------------------------------------------------ |
| Frontend  | React, TypeScript, Tailwind CSS, Shadcn UI, TanStack Query, Zustand, React Hook Form, Zod, Recharts |
| Backend   | Laravel 12, Sanctum, PostgreSQL, Redis, Queue Worker         |
| AI Layer  | OpenAI-compatible API, Function/Tool Calling, RAG ringan     |
| Deploy    | VPS, Docker, Nginx, SSL                                      |

---

## Task Breakdown — Modular

Setiap task adalah satu dokumen terpisah yang bisa dikerjakan secara independen (setelah dependensi terpenuhi). Task disusun berdasarkan urutan build yang direkomendasikan PRD §32.

| #  | Task ID  | Nama Task                           | Fase       | Dependensi   |
| -- | -------- | ----------------------------------- | ---------- | ------------ |
| 1  | TASK-01  | Project Setup & Scaffolding         | Phase 0    | —            |
| 2  | TASK-02  | Design System & Layout Shell        | Phase 0    | TASK-01      |
| 3  | TASK-03  | Authentication (Register/Login)     | Phase 1    | TASK-01      |
| 4  | TASK-04  | Business Profile & Onboarding       | Phase 1    | TASK-03      |
| 5  | TASK-05  | Customer Management (CRUD)          | Phase 1    | TASK-04      |
| 6  | TASK-06  | Product/Service Management (CRUD)   | Phase 1    | TASK-04      |
| 7  | TASK-07  | Order Management (CRUD)             | Phase 1    | TASK-05, 06  |
| 8  | TASK-08  | Payment & Order Status Tracking     | Phase 1    | TASK-07      |
| 9  | TASK-09  | Dashboard & Metrics                 | Phase 1    | TASK-08      |
| 10 | TASK-10  | Invoice Sederhana                   | Phase 1    | TASK-07      |
| 11 | TASK-11  | Reminder & Follow-up System         | Phase 1    | TASK-08      |
| 12 | TASK-12  | Stock Tracking & Low Stock Alert    | Phase 1    | TASK-06, 07  |
| 13 | TASK-13  | Daily Report                        | Phase 1    | TASK-09      |
| 14 | TASK-14  | AI Business Assistant               | Phase 2    | TASK-09      |
| 15 | TASK-15  | AI Summary, Follow-up & Promo       | Phase 2    | TASK-14      |
| 16 | TASK-16  | Polish, Testing & Pilot Prep        | Phase 3    | ALL          |

---

## Fase Development

### Phase 0 — Foundation (Week 1)
- TASK-01: Scaffold kedua project (frontend + backend)
- TASK-02: Implement design system lengkap, app shell (mobile + desktop)

### Phase 1 — Core MVP (Week 2–4)
- TASK-03 s/d TASK-13: Seluruh fitur CRUD, dashboard, invoice, reminder, stock, report

### Phase 2 — AI MVP (Week 5–6)
- TASK-14 & TASK-15: AI assistant, summary, follow-up, promo ideas

### Phase 3 — Polish & Pilot (Week 7–8)
- TASK-16: Testing, bugfix, UX polish, pilot prep

---

## Urutan Baca Task

Baca task-task berikut secara berurutan:

1. [TASK-01 — Project Setup](file:///c:/laragon/www/opsmate-ai/docs/plans/01-TASK-project-setup.md)
2. [TASK-02 — Design System](file:///c:/laragon/www/opsmate-ai/docs/plans/02-TASK-design-system.md)
3. [TASK-03 — Authentication](file:///c:/laragon/www/opsmate-ai/docs/plans/03-TASK-authentication.md)
4. [TASK-04 — Business Profile](file:///c:/laragon/www/opsmate-ai/docs/plans/04-TASK-business-profile.md)
5. [TASK-05 — Customer CRUD](file:///c:/laragon/www/opsmate-ai/docs/plans/05-TASK-customer-management.md)
6. [TASK-06 — Product CRUD](file:///c:/laragon/www/opsmate-ai/docs/plans/06-TASK-product-management.md)
7. [TASK-07 — Order CRUD](file:///c:/laragon/www/opsmate-ai/docs/plans/07-TASK-order-management.md)
8. [TASK-08 — Payment & Status](file:///c:/laragon/www/opsmate-ai/docs/plans/08-TASK-payment-status.md)
9. [TASK-09 — Dashboard](file:///c:/laragon/www/opsmate-ai/docs/plans/09-TASK-dashboard.md)
10. [TASK-10 — Invoice](file:///c:/laragon/www/opsmate-ai/docs/plans/10-TASK-invoice.md)
11. [TASK-11 — Reminder](file:///c:/laragon/www/opsmate-ai/docs/plans/11-TASK-reminder.md)
12. [TASK-12 — Stock Tracking](file:///c:/laragon/www/opsmate-ai/docs/plans/12-TASK-stock-tracking.md)
13. [TASK-13 — Daily Report](file:///c:/laragon/www/opsmate-ai/docs/plans/13-TASK-daily-report.md)
14. [TASK-14 — AI Assistant](file:///c:/laragon/www/opsmate-ai/docs/plans/14-TASK-ai-assistant.md)
15. [TASK-15 — AI Features](file:///c:/laragon/www/opsmate-ai/docs/plans/15-TASK-ai-features.md)
16. [TASK-16 — Polish & Testing](file:///c:/laragon/www/opsmate-ai/docs/plans/16-TASK-polish-testing.md)

---

## Acceptance Criteria Global (dari PRD §19)

- [ ] Owner bisa register, login, logout
- [ ] Owner bisa membuat & mengelola business profile
- [ ] Owner bisa CRUD customer, product, order
- [ ] Payment & order status bisa di-update
- [ ] Dashboard menampilkan ringkasan harian
- [ ] Invoice PDF bisa di-generate
- [ ] Reminder otomatis untuk unpaid order & low stock
- [ ] Daily report bisa dilihat & di-export
- [ ] AI bisa membuat ringkasan harian
- [ ] AI bisa membuat draft follow-up
- [ ] AI bisa memberi insight produk/customer

---

## UI/UX Reference Screens

| Screen | File | Ukuran |
| ------ | ---- | ------ |
| Dashboard Mobile | [dashboard-mobile.png](file:///c:/laragon/www/opsmate-ai/docs/screens/dashboard-mobile.png) | 780×2812 |
| Tambah Order Mobile | [tambah-order-mobile.png](file:///c:/laragon/www/opsmate-ai/docs/screens/tambah-order-mobile.png) | 780×2348 |
| AI Assistant Mobile | [ai-assistant-mobile.png](file:///c:/laragon/www/opsmate-ai/docs/screens/ai-assistant-mobile.png) | 780×1768 |
| Dashboard Desktop | [dashboard-desktop.png](file:///c:/laragon/www/opsmate-ai/docs/screens/dashboard-desktop.png) | 2560×2392 |

Setiap screen juga memiliki file HTML yang bisa dibuka langsung di browser sebagai referensi interaktif di folder `docs/screens/`.
