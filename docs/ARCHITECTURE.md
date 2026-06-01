# OpsMate AI — Architecture & Scaling Guide

> Untuk engineer yang merawat & menskalakan OpsMate AI.
> Sumber kebenaran: kode di `backend/` & `frontend/`. Dokumen ini menjelaskan *kenapa* dan *bagaimana menskalakan*.

## 1. Gambaran Sistem

Monorepo dengan dua aplikasi terpisah + infra Docker:

```
Browser ── HTTPS ──► nginx ──┬─ static SPA (React build)
                             └─ /api, /sanctum, /up ──► php-fpm (Laravel)
                                                              │
                              ┌───────────────┬───────────────┼───────────────┐
                           PostgreSQL       Redis          Queue worker     Scheduler
                          (data utama)   (cache/session/   (job async)    (cron harian)
                                          queue/rate-limit)
```

- **Frontend** — React + TypeScript + Vite SPA. Di produksi di-build statik dan diserve nginx. Memanggil API same-origin lewat `/api`.
- **Backend** — Laravel 13, API-only. PHP-FPM di produksi (bukan `artisan serve`).
- **PostgreSQL** — penyimpanan utama (single source of truth).
- **Redis** — cache, session, queue, dan rate limiter.
- **Queue worker** — memproses job async (mis. kirim email reset password).
- **Scheduler** — menjalankan `reminders:generate` (06:00) & `reports:daily` (23:59).

### Prinsip desain
1. **API stateless** — token Sanctum, tidak ada server-side session sticky. Backend bisa di-scale horizontal.
2. **Multi-tenant by default** — semua data di-scope `business_id` di satu chokepoint.
3. **AI tidak pernah jadi dependensi keras** — ada fallback deterministik, fitur inti tetap jalan tanpa provider.
4. **Uang dihitung server** — klien tidak pernah menentukan total.
5. **Boring & explicit** — state machine eksplisit, enum berlabel, service layer tipis.

---

## 2. Struktur Kode

### Backend (`backend/app/`)
```
Enums/                  ← BusinessRole, CustomerType, ProductType,
                          OrderStatus, PaymentStatus, InvoiceStatus,
                          ReminderType/Status/Priority, StockMovementType
Models/                 ← Eloquent models + relasi + query scopes
Http/
  Controllers/Api/      ← thin controllers (validasi + delegasi)
  Requests/             ← FormRequest (aturan validasi + pesan ID)
  Resources/            ← bentuk JSON response (tidak pernah return model mentah)
Services/
  Business/             ← OrderService, OrderStatusService, StockService,
                          ReminderService, ReportService, DashboardService,
                          InvoiceService, FollowUpMessageService, BusinessProvisioner
  AI/                   ← AIAssistantService, AIToolService, AIPromptBuilder,
                          AISummaryService, AIFollowUpService, AIPromoService,
                          AIDailyReportService, LlmClient (+ OpenAi/Fallback impl)
Support/
  ActiveBusiness.php    ← chokepoint resolusi tenant
```

Pola tiap request: **Controller (tipis) → FormRequest (validasi) → Service (logika bisnis) → Model → Resource (output)**. Logika tidak boleh bocor ke controller.

### Frontend (`frontend/src/`)
```
features/<domain>/      ← per-domain: api/ (hooks), components/, pages/, types
components/
  ui/                   ← primitif (Button, Card)
  layout/               ← AppShell, Sidebar, BottomNav, TopBar
  shared/               ← StatusBadge, EmptyState, ProtectedRoute, AIGradientCard
lib/                    ← api (axios), utils, constants, status, query-client
stores/                 ← Zustand (hanya auth-session state)
```
Data server **selalu** lewat TanStack Query (tidak ada `useEffect`+fetch, tidak ada duplikasi ke store).

---

## 3. Model Data

### Tabel & relasi
```
users ─┬─< business_users >─┬─ businesses
       │                    │
       └────────────────────┘   (owner_id → users)

businesses ─< customers
businesses ─< products
businesses ─< orders ─< order_items >─ products (snapshot name+price)
            orders ─< order_activities   (audit log status/payment)
businesses ─< invoices ─ orders, customers
businesses ─< stock_movements ─ products
businesses ─< reminders        (polymorphic-ish: related_type+related_id)
businesses ─< daily_reports    (unik per business+report_date)
businesses ─< ai_messages
```

### Keputusan skema penting
- **`business_id` di setiap tabel domain** — fondasi tenancy. Indeks komposit `(business_id, ...)` di kolom yang sering difilter.
- **Soft deletes** di customers/products/orders — riwayat tidak hilang, dan order number tetap konsisten (penomoran menghitung termasuk yang trashed).
- **Snapshot di `order_items`** (`product_name`, `price`) — order historis akurat walau produk berubah/dihapus. FK product `nullOnDelete`.
- **`order_activities` append-only** — audit log; tidak ada `updated_at`.
- **`daily_reports` unik `(business_id, report_date)`** — `updateOrCreate` membuat agregasi idempoten.
- **Uang `decimal(12,2)`** di DB, diserialisasi sebagai number bulat (rupiah) di API.
- **Enum sebagai backed enum PHP** — nilai string konsisten di DB, API, dan frontend.

### Tenancy: satu chokepoint
`App\Support\ActiveBusiness::forUserOrFail($user)` meresolusi bisnis aktif. Setiap controller memakainya, lalu query lewat scope `Model::forBusiness($id)`. Akses lintas-bisnis dijaga di dua lapis: query scope + `abort_unless($row->business_id === $active->id, 404)`. Setiap fitur punya test isolasi tenant.

> Untuk menambah tabel domain baru: WAJIB ada `business_id` + scope `forBusiness` + test isolasi. Tanpa pengecualian.

### State machine (kenapa eksplisit)
`OrderStatusService` memegang peta transisi order & payment di satu tempat. Transisi invalid → `ValidationException` (422). Ini mencegah data tidak konsisten (mis. "Selesai" balik ke "Baru") dan membuat efek samping (pengurangan stok saat selesai, pengembalian saat batal) deterministik & teruji.

---

## 4. Stability Playbook

Hal-hal yang sudah membuat sistem stabil hari ini, dan cara menjaganya.

### Sudah ada
- **Test coverage perilaku** — 109 test backend (tiap fitur: happy path, auth, isolasi tenant, validasi) + 55 test frontend. Jalankan sebelum tiap rilis: `make test-backend` & `npx vitest run`.
- **Transaksi atomik** — pembuatan/penghapusan order + item, penyesuaian stok, dan reversal dibungkus `DB::transaction`. Tidak ada state setengah jadi.
- **Idempotensi** — invoice-from-order & auto-reminder aman dipanggil ulang.
- **Graceful degradation AI** — `LlmClient` dengan `FallbackLlmClient`; kegagalan provider di-`try/catch` + log, tidak pernah menjatuhkan request.
- **Validasi input di tiap write** — FormRequest, pesan bahasa Indonesia.
- **opcache + cache config/route/view** di entrypoint produksi.

### Yang harus dijaga saat menambah fitur
1. Tabel domain baru → `business_id` + `forBusiness` scope + test isolasi.
2. Endpoint write baru → FormRequest + Resource (jangan return model mentah).
3. Logika bisnis → di Service, bukan controller.
4. Perubahan uang/stok → bungkus transaksi, hitung server-side.
5. Tambah test perilaku (bukan test plumbing) untuk cabang & edge case.

### Observability (rekomendasi sebelum trafik tinggi)
- **Error tracking** — pasang Sentry (`sentry/sentry-laravel`) untuk backend + `@sentry/react` untuk frontend. Belum terpasang.
- **Health probe** — `GET /up` untuk liveness; tambahkan readiness yang cek koneksi DB/Redis bila pakai orchestrator.
- **Log terstruktur** — `LOG_LEVEL=warning` di produksi; jangan log PII/secret.
- **Slow query log** PostgreSQL untuk menemukan N+1 / index hilang.

---

## 5. Scaling Playbook

Urutan langkah saat beban naik. Mulai dari yang termurah.

### Tahap 1 — Single VPS (saat ini, cocok untuk pilot)
`docker compose -f docker/docker-compose.prod.yml`. Semua service di satu host. Cukup untuk puluhan bisnis aktif.

### Tahap 2 — Vertikal & tuning (ratusan bisnis)
- Naikkan resource VPS; naikkan `pm.max_children` php-fpm sesuai RAM.
- **Indeks DB** — sudah ada indeks `(business_id, …)` di kolom filter utama. Pantau slow query, tambah indeks sesuai pola query nyata.
- **Cache read berat** — dashboard AI summary sudah di-cache 15 menit. Pertimbangkan cache `dashboard/summary` mentah bila perlu (hati-hati invalidasi saat order berubah).
- Tambah **queue worker** replica untuk job async.

### Tahap 3 — Horizontal (ribuan bisnis)
- **Backend stateless** → jalankan beberapa replica php-fpm di belakang load balancer. Token Sanctum + session di Redis membuat ini aman tanpa sticky session.
- **PostgreSQL** → pisahkan ke instance terkelola (RDS/Cloud SQL); tambah **read replica** untuk query laporan/dashboard yang berat-baca.
- **Redis** → instance terkelola; pisahkan DB index untuk cache vs queue bila perlu.
- **Object storage** (S3-compatible) untuk logo bisnis & arsip PDF bila volume PDF besar (`FILESYSTEM_DISK`).
- **CDN** untuk aset SPA statik.

### Tahap 4 — Hotspot spesifik
- **PDF generation berat** → pindah render PDF (DomPDF) ke **queue job** dan sajikan via link async, bukan inline di request.
- **AI** → sudah berada di belakang `LlmClient`; rate limit per user sudah ada. Untuk skala besar, antrekan panggilan AI atau pakai provider dengan throughput lebih tinggi. Frontend bundle >500KB → aktifkan code-splitting (sudah ada peringatan build).
- **Order/laporan period besar** → semua list sudah paginated (20/hal). Pertahankan; jangan buat endpoint yang mengembalikan koleksi tak terbatas.

### Yang TIDAK boleh dilakukan saat scaling
- Jangan lepaskan scope `business_id` demi "kemudahan query global".
- Jangan pindahkan perhitungan total/stok ke klien.
- Jangan jadikan AI dependensi keras (fallback harus tetap ada).
- Jangan kembali ke `artisan serve` di produksi.

---

## 6. Referensi Cepat

| Kebutuhan | Lihat |
| --------- | ----- |
| Setup & deploy | `docs/RUNBOOK.md` |
| Daftar endpoint & contoh payload | `docs/API.md` |
| Cara pakai (owner/staff) | `docs/GUIDE.md` |
| Konvensi agent/kontributor | `AGENTS.md` (root) |
| Spesifikasi produk asli | `docs/refs/PRD-MVP-Ops.md` |
| Spesifikasi desain | `docs/refs/DESIGN-Ops.md` |
| Rencana per-task | `docs/plans/` |
| Riwayat perubahan | `docs/CHANGELOG.md` + `docs/CHANGES/` |
