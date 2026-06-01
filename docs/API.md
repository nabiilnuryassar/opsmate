# OpsMate AI — API Reference

> REST API untuk OpsMate AI. Semua endpoint mengembalikan JSON.
> Base URL (dev): `http://localhost:8000/api` · (prod): `https://<domain>/api`

## 1. Konvensi Umum

### Format
- Request & response: `application/json`.
- Selalu kirim header `Accept: application/json` (tanpa ini, error auth bisa balas 500 alih-alih 401).
- Bahasa pesan error: Indonesia.

### Autentikasi
- Token-based via **Laravel Sanctum** (personal access token).
- Setelah `register`/`login`, sertakan token di setiap request terproteksi:
  ```http
  Authorization: Bearer <token>
  ```
- Token disimpan klien (frontend pakai `localStorage` key `opsmate.token`).

### Multi-tenant
- Setiap user beroperasi dalam satu **business** (dibuat otomatis saat register).
- Semua data (customer, product, order, dst.) **otomatis di-scope** ke business aktif user. Tidak ada parameter `business_id` di request — server yang menentukan. Data bisnis lain tidak pernah bisa diakses (balas `404`).

### Resource wrapper
- Resource tunggal & koleksi dibungkus key `data` (Laravel API Resource).
  - Tunggal: `{ "data": { ... } }`
  - Koleksi paginated: `{ "data": [ ... ], "links": {...}, "meta": {...} }`
- Pengecualian: endpoint agregat (`/dashboard/summary`) dan beberapa endpoint AI mengembalikan objek datar (lihat masing-masing).

### Pagination
- List default **20 item per halaman**.
- Query param: `?page=2`. Metadata di `meta.current_page`, `meta.last_page`, `meta.total`.

### HTTP Status Codes
| Code | Arti |
| ---- | ---- |
| `200` | OK |
| `201` | Created (resource baru dibuat) |
| `204` | No Content (delete sukses) |
| `401` | Belum login / token invalid |
| `404` | Resource tidak ada **atau** milik bisnis lain |
| `422` | Validasi gagal / transisi status tidak valid |
| `429` | Rate limit (khusus AI chat) |

### Format Error Validasi (422)
```json
{
  "message": "Nama customer wajib diisi.",
  "errors": {
    "name": ["Nama customer wajib diisi."]
  }
}
```

---

## 2. Referensi Enum

Nilai-nilai status yang dipakai di seluruh API. Kirim **value** (kolom kiri), bukan label.

### Order Status (`status`)
| Value | Label | Transisi valid berikutnya |
| ----- | ----- | ------------------------- |
| `new` | Baru | confirmed, processing, cancelled |
| `confirmed` | Dikonfirmasi | processing, ready, cancelled |
| `processing` | Diproses | ready, completed, cancelled |
| `ready` | Siap | completed, delivered, cancelled |
| `completed` | Selesai | delivered |
| `delivered` | Dikirim | — (terminal) |
| `cancelled` | Batal | — (terminal) |

Transisi tidak valid → `422`. Saat order masuk `completed`/`delivered`, stok produk otomatis berkurang; saat `cancelled` (dari state yang sudah mengurangi stok), stok dikembalikan.

### Payment Status (`payment_status`)
| Value | Label | Transisi valid |
| ----- | ----- | -------------- |
| `unpaid` | Belum Bayar | partial, paid |
| `partial` | DP | paid |
| `paid` | Lunas | refunded |
| `refunded` | Refund | — (terminal) |

### Customer Type (`customer_type`)
| Value | Label |
| ----- | ----- |
| `new` | Baru |
| `regular` | Langganan |
| `vip` | VIP |
| `inactive` | Tidak Aktif |

### Product Type (`type`)
| Value | Label | Catatan |
| ----- | ----- | ------- |
| `product` | Produk | melacak stok |
| `service` | Layanan | `stock`/`minimum_stock` selalu `null` |

### Business Category (`category`)
`makanan_minuman`, `laundry`, `jasa_service`, `toko_online`, `fashion`, `kesehatan_kecantikan`, `edukasi`, `otomotif`, `lainnya`

### Invoice Status (`status`)
| Value | Label |
| ----- | ----- |
| `draft` | Draft |
| `sent` | Terkirim |
| `paid` | Lunas |
| `overdue` | Jatuh Tempo |
| `cancelled` | Batal |

### Reminder Type / Priority / Status
- **Type:** `unpaid_order`, `overdue_invoice`, `low_stock`, `inactive_customer`, `unfinished_order`, `follow_up`
- **Priority:** `urgent`, `today`, `later`
- **Status:** `pending`, `done`, `snoozed`

### Stock Movement Type (`type`)
| Value | Label | Efek |
| ----- | ----- | ---- |
| `in` | Masuk | tambah stok |
| `out` | Keluar | kurangi stok |
| `adjustment` | Koreksi | set stok ke nilai absolut |

---

## 3. Daftar Endpoint (ringkas)

| Method | Path | Auth | Keterangan |
| ------ | ---- | ---- | ---------- |
| POST | `/register` | — | Daftar + buat bisnis |
| POST | `/login` | — | Login |
| POST | `/forgot-password` | — | Kirim link reset |
| POST | `/reset-password` | — | Reset password |
| POST | `/logout` | ✓ | Revoke token aktif |
| GET | `/me` | ✓ | User + bisnis aktif |
| GET | `/business` | ✓ | Profil bisnis |
| PUT | `/business` | ✓ | Update profil bisnis |
| GET | `/dashboard/summary` | ✓ | Metrik harian + recent orders |
| GET | `/dashboard/ai-summary` | ✓ | Ringkasan AI dashboard |
| GET/POST | `/customers` | ✓ | List / buat customer |
| GET/PUT/DELETE | `/customers/{id}` | ✓ | Detail / update / hapus |
| GET | `/customers/{id}/orders` | ✓ | Riwayat order customer |
| GET/POST | `/products` | ✓ | List / buat produk |
| GET/PUT/DELETE | `/products/{id}` | ✓ | Detail / update / hapus |
| GET | `/products/low-stock` | ✓ | Produk stok rendah |
| GET | `/products/{id}/stock-movements` | ✓ | Riwayat stok |
| POST | `/products/{id}/stock-adjustment` | ✓ | Sesuaikan stok |
| GET/POST | `/orders` | ✓ | List / buat order |
| GET/PUT/DELETE | `/orders/{id}` | ✓ | Detail / update / hapus |
| PATCH | `/orders/{id}/status` | ✓ | Ubah status order |
| PATCH | `/orders/{id}/payment-status` | ✓ | Ubah status bayar |
| GET | `/invoices` | ✓ | List invoice |
| GET | `/invoices/{id}` | ✓ | Detail invoice |
| POST | `/invoices/from-order/{orderId}` | ✓ | Generate invoice dari order |
| GET | `/invoices/{id}/pdf` | ✓ | Download PDF |
| GET | `/invoices/{id}/text` | ✓ | Teks WhatsApp |
| PATCH | `/invoices/{id}/status` | ✓ | Ubah status invoice |
| GET | `/reminders` | ✓ | List reminder aktif |
| PATCH | `/reminders/{id}/done` | ✓ | Tandai selesai |
| PATCH | `/reminders/{id}/snooze` | ✓ | Tunda |
| POST | `/reminders/{id}/generate-message` | ✓ | Draft follow-up |
| GET | `/reports/daily` | ✓ | Laporan hari ini |
| GET | `/reports/daily/{date}` | ✓ | Laporan per tanggal |
| GET | `/reports/daily/{date}/pdf` | ✓ | PDF laporan |
| POST | `/ai/chat` | ✓ | Chat AI (rate-limited) |
| GET | `/ai/messages` | ✓ | Riwayat chat |
| POST | `/ai/generate-follow-up` | ✓ | Draft follow-up AI |
| POST | `/ai/generate-promo-ideas` | ✓ | Ide promo AI |
| POST | `/ai/generate-daily-summary` | ✓ | Ringkasan laporan AI |

Detail tiap grup ada di bagian berikutnya.

---

## 4. Authentication

### POST /register
Buat user + bisnis baru, balas token.

Body:
```json
{
  "name": "Rina",
  "email": "rina@toko.com",
  "password": "password123",
  "password_confirmation": "password123",
  "business_name": "Rina Catering"
}
```
Rules: `name` required · `email` required, unik · `password` min 8, confirmed · `business_name` required.

`201`:
```json
{
  "token": "1|abcdef...",
  "user": {
    "id": 1, "name": "Rina", "email": "rina@toko.com",
    "business": { "id": 1, "name": "Rina Catering", "role": "owner" }
  }
}
```

### POST /login
Body: `{ "email", "password" }`. `200` → `{ "token", "user": {...} }`. Kredensial salah → `422`.

### POST /logout
Header auth wajib. Revoke token yang sedang dipakai. `200` → `{ "message": "Berhasil keluar." }`.

### GET /me
`200` → `{ "data": { "id", "name", "email", "business": { "id", "name", "role" } } }`. Tanpa token → `401`.

### POST /forgot-password
Body: `{ "email" }`. Selalu `200` (tidak membocorkan email mana yang terdaftar).

### POST /reset-password
Body: `{ "token", "email", "password", "password_confirmation" }`. Token kadaluarsa → `422`.

---

## 5. Business Profile

### GET /business
`200`:
```json
{
  "data": {
    "id": 1, "name": "Rina Catering", "category": "makanan_minuman",
    "phone": "08123456789", "address": null, "city": "Bandung",
    "logo_url": null, "description": "Catering rumahan",
    "currency": "IDR", "is_complete": true
  }
}
```
`is_complete` = `true` jika category + phone + city terisi (dipakai untuk menentukan apakah onboarding selesai).

### PUT /business
Body (semua opsional kecuali `name`):
```json
{ "name": "Rina Catering", "category": "makanan_minuman",
  "phone": "08123456789", "address": "Jl. Mawar 1", "city": "Bandung",
  "description": "Catering rumahan", "currency": "IDR" }
```
`category` harus salah satu enum Business Category, jika tidak → `422`.

---

## 6. Dashboard

### GET /dashboard/summary
Objek datar (tanpa wrapper `data`):
```json
{
  "greeting": "Pagi, Rina",
  "business_name": "Rina Catering",
  "metrics": {
    "orders_today": 12,
    "orders_today_trend": "+3",
    "revenue_today": 1450000,
    "revenue_trend_pct": "+12%",
    "unpaid_total": 650000,
    "unpaid_count": 3,
    "processing_count": 5,
    "new_customers": 3,
    "low_stock_count": 2
  },
  "recent_orders": [ /* array OrderResource (5 terbaru) */ ],
  "reminders": [],
  "low_stock_products": [ /* array ProductResource (≤5) */ ]
}
```
Catatan: `revenue_today` tidak menghitung order berstatus `refunded`. `greeting` mengikuti jam (Pagi <11, Siang <15, Sore <18, Malam).

### GET /dashboard/ai-summary
`200` → `{ "summary": "Hari ini ada 12 order ..." }`. Di-cache 15 menit per bisnis. Tanpa OpenAI key, mengembalikan ringkasan template (tetap berbasis data real).

---

## 7. Customers

### GET /customers
Query params: `search` (nama/phone/email), `type` (customer type enum), `sort` (`name`|`last_order_at`|`created_at`), `direction` (`asc`|`desc`), `page`.

`200` (paginated):
```json
{
  "data": [
    {
      "id": 1, "name": "Sinta Permata", "phone": "08123456789",
      "email": null, "address": null, "notes": null,
      "customer_type": "vip", "last_order_at": "2026-05-31T00:00:00+00:00",
      "orders_count": 12, "created_at": "2026-05-01T08:00:00+00:00"
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "total": 1 }
}
```

### POST /customers
Body: `name` (required) · `phone` · `email` · `address` · `notes` · `customer_type` (default `new`). `201` → `{ "data": {...} }`.

### GET /customers/{id}
`200` → `{ "data": {...} }` (termasuk `orders_count`). Milik bisnis lain → `404`.

### PUT /customers/{id}
Body sama dengan store. `200` → `{ "data": {...} }`.

### DELETE /customers/{id}
Soft delete. `204` tanpa body.

### GET /customers/{id}/orders
Riwayat order customer (paginated, terbaru dulu). `200` → koleksi OrderResource.

---

## 8. Products / Services

### GET /products
Query params: `search` (nama) · `type` (`product`|`service`) · `category` · `low_stock` (`1` untuk filter stok rendah) · `is_active` (`1`/`0`) · `sort` (`name`|`price`|`stock`|`created_at`) · `direction` · `page`.

`200` (paginated), tiap item:
```json
{
  "id": 1, "name": "Brownies Coklat", "type": "product",
  "category": "makanan", "price": 45000, "cost_price": 30000,
  "stock": 2, "minimum_stock": 5, "unit": "loyang",
  "description": null, "is_active": true,
  "is_low_stock": true, "margin": 15000,
  "created_at": "2026-05-01T08:00:00+00:00"
}
```
`is_low_stock` = `stock != null && stock <= minimum_stock`. `margin` = `price - cost_price` (null jika cost_price kosong).

### POST /products
Body: `name` (required) · `type` (required, `product`|`service`) · `category` · `price` (required, ≥0) · `cost_price` · `stock` · `minimum_stock` · `unit` · `description` · `is_active` (bool).
Untuk `type=service`, field `stock` & `minimum_stock` otomatis di-null-kan walau dikirim. `201` → `{ "data": {...} }`.

### GET /products/{id} · PUT /products/{id} · DELETE /products/{id}
Detail / update / soft delete. Validasi sama dengan store. Cross-tenant → `404`.

### GET /products/low-stock
`200` → koleksi produk dengan `stock <= minimum_stock` (tidak paginated, diurutkan stok naik).

### GET /products/{id}/stock-movements
Riwayat pergerakan stok (paginated, terbaru dulu):
```json
{
  "data": [
    { "id": 9, "type": "out", "type_label": "Keluar", "quantity": -3,
      "reference_type": "order", "reference_id": 12, "notes": null,
      "created_at": "2026-05-31T10:00:00+00:00" }
  ]
}
```
`quantity` bertanda: positif = masuk, negatif = keluar.

### POST /products/{id}/stock-adjustment
Body:
```json
{ "type": "in", "quantity": 10, "notes": "Restock dari supplier" }
```
- `in`: stok += quantity
- `out`: stok -= quantity (di-clamp minimal 0)
- `adjustment`: stok di-set ke `quantity` (movement mencatat selisihnya)

`quantity` integer ≥0. Produk `service` → `422` ("Produk ini tidak melacak stok."). `200` → ProductResource terbaru.

---

## 9. Orders

Order adalah fitur inti. Total dihitung **server-side** (tidak mempercayai total dari klien). Nama & harga produk di-**snapshot** ke order item saat dibuat, jadi tetap akurat walau produk diubah/dihapus nanti.

### GET /orders
Query params: `search` (order_number / nama customer) · `status` · `payment_status` · `today` (`1`) · `from` & `to` (rentang `order_date`, format `YYYY-MM-DD`) · `sort` (`order_date`|`created_at`|`total`) · `direction` · `page`.

`200` (paginated), tiap item memuat `customer` ringkas + `items_count`.

### POST /orders
Body:
```json
{
  "customer_id": 1,
  "order_date": "2026-05-31",
  "due_date": "2026-06-07",
  "status": "new",
  "payment_status": "unpaid",
  "discount": 5000,
  "notes": "Tanpa pedas",
  "items": [
    { "product_id": 3, "quantity": 2 },
    { "product_id": 5, "quantity": 1, "price": 10000 }
  ]
}
```
Rules: `customer_id` required (harus milik bisnis ini, jika tidak → `422`) · `items` array min 1 · `items.*.product_id` required (harus milik bisnis ini) · `items.*.quantity` int ≥1 · `items.*.price` opsional (default = harga produk saat itu) · `status`/`payment_status` opsional (default `new`/`unpaid`).

`201`:
```json
{
  "data": {
    "id": 1, "order_number": "ORD-0001",
    "order_date": "2026-05-31", "due_date": "2026-06-07",
    "status": "new", "status_label": "Baru",
    "payment_status": "unpaid", "payment_status_label": "Belum Bayar",
    "subtotal": 60000, "discount": 5000, "total": 55000,
    "notes": "Tanpa pedas",
    "customer": { "id": 1, "name": "Sinta Permata", "phone": "0812..." },
    "items": [
      { "id": 1, "product_id": 3, "product_name": "Kopi Susu",
        "quantity": 2, "price": 25000, "total": 50000 }
    ],
    "created_at": "2026-05-31T09:00:00+00:00"
  }
}
```
`order_number` auto-increment per bisnis (`ORD-0001`, `ORD-0002`, ...).

### GET /orders/{id}
`200` → order lengkap dengan `items`, `customer`, dan `activities` (audit log perubahan status).

### PUT /orders/{id}
Body sama dengan store. Mengganti seluruh item & menghitung ulang total secara atomik.

### DELETE /orders/{id}
Soft delete. `204`.

### PATCH /orders/{id}/status
Body: `{ "status": "processing" }`. Transisi divalidasi (lihat tabel Order Status). Transisi tidak valid → `422` dengan pesan, mis. *"Status tidak bisa diubah dari 'Selesai' ke 'Baru'."* Perubahan dicatat ke activity log. Saat masuk `completed`/`delivered`, stok produk otomatis berkurang; saat `cancelled`, stok dikembalikan.

### PATCH /orders/{id}/payment-status
Body: `{ "payment_status": "paid" }`. Transisi divalidasi. Dicatat ke activity log.

---

## 10. Invoices

Tanpa payment gateway. Satu order = satu invoice (idempoten).

### GET /invoices
Query params: `status` (invoice status enum) · `page`. `200` paginated dengan `customer` + `order` ringkas.

### GET /invoices/{id}
`200`:
```json
{
  "data": {
    "id": 1, "invoice_number": "INV-0001", "order_id": 1,
    "issue_date": "2026-05-31", "due_date": "2026-06-07",
    "total": 55000, "status": "draft", "status_label": "Draft",
    "customer": { "id": 1, "name": "Sinta Permata", "phone": "0812..." },
    "order": { "id": 1, "order_number": "ORD-0001" },
    "created_at": "2026-05-31T09:10:00+00:00"
  }
}
```

### POST /invoices/from-order/{orderId}
Generate invoice dari order. **Idempoten**: jika invoice untuk order itu sudah ada, mengembalikan yang lama (status `200`) alih-alih membuat duplikat (`201` hanya saat pertama dibuat). `invoice_number` auto-increment per bisnis. `due_date` default = `due_date` order, atau hari ini + 7 hari.

### GET /invoices/{id}/pdf
Mengembalikan file PDF (`Content-Type: application/pdf`, `inline`). Template Indonesia dengan info bisnis, customer, item, total.

### GET /invoices/{id}/text
`200` → `{ "text": "*Rina Catering*\nInvoice INV-0001\n..." }`. Teks siap tempel ke WhatsApp.

### PATCH /invoices/{id}/status
Body: `{ "status": "sent" }`. `200` → InvoiceResource.

---

## 11. Reminders

Reminder dibuat otomatis oleh scheduler harian (`reminders:generate`, 06:00) untuk: order belum bayar, invoice jatuh tempo, stok rendah, order belum selesai >2 hari, customer tidak order >30 hari.

### GET /reminders
`200` → reminder **aktif** (pending, atau snoozed yang waktunya sudah lewat), diurutkan prioritas (urgent → today → later):
```json
{
  "data": [
    {
      "id": 1, "title": "Sinta Permata belum bayar",
      "description": "Order ORD-0001 sebesar Rp250.000 belum dibayar.",
      "type": "unpaid_order", "type_label": "Belum Bayar",
      "status": "pending", "priority": "urgent",
      "related_type": "order", "related_id": 12,
      "due_at": null, "completed_at": null
    }
  ]
}
```

### PATCH /reminders/{id}/done
Tandai selesai. `200` → ReminderResource (status `done`). Reminder yang `done` tidak muncul lagi di list aktif.

### PATCH /reminders/{id}/snooze
Body: `{ "until": "2026-06-02T08:00:00+00:00" }` (opsional; default +1 hari). `200` → status `snoozed`.

### POST /reminders/{id}/generate-message
`200` → `{ "message": "Halo Kak Sinta, ..." }`. Draft follow-up berbasis template (atau AI jika key OpenAI diisi — lihat §13).

---

## 12. Daily Reports

Laporan agregat per tanggal. Idempoten per (bisnis, tanggal); GET membuat/menyegarkan baris jika belum ada. Scheduler `reports:daily` (23:59) men-generate untuk semua bisnis.

### GET /reports/daily
Laporan hari ini. `200` (objek dibungkus `data`):
```json
{
  "data": {
    "id": 1, "report_date": "2026-05-31",
    "total_orders": 12, "total_revenue": 1450000,
    "total_unpaid": 375000, "total_completed": 8, "new_customers": 3,
    "top_products": [
      { "name": "Paket Hemat", "quantity": 8, "revenue": 144000 }
    ],
    "low_stock": [
      { "name": "Brownies Coklat", "stock": 2, "minimum_stock": 5 }
    ],
    "ai_summary": "Hari ini bisnis kamu mendapatkan 12 order ..."
  }
}
```
`total_revenue` tidak menghitung order `refunded`. `ai_summary` diisi template fallback bila AI belum di-generate.

### GET /reports/daily/{date}
`date` format `YYYY-MM-DD`. Format invalid → `422`. Tanggal tanpa order → semua angka `0`.

### GET /reports/daily/{date}/pdf
File PDF laporan (`application/pdf`, `inline`).

---

## 13. AI Assistant

AI hanya membaca data via **tool terkontrol** yang di-scope ke bisnis aktif — tidak pernah mengakses DB bebas, tidak mengarang angka, dan tidak pernah membocorkan data bisnis lain. **Tanpa `OPENAI_API_KEY`**, semua endpoint AI tetap berfungsi dengan responder deterministik (data real, tanpa "reasoning"). Fitur inti tidak pernah bergantung pada provider eksternal.

### POST /ai/chat
Rate limit: **20 request/jam per user** (configurable). Melebihi → `429`.
Body: `{ "message": "Siapa yang belum bayar?" }` (required, max 2000 char).
`201`:
```json
{
  "data": {
    "id": 2, "role": "assistant",
    "content": "Ada 3 order belum dibayar ...",
    "unpaid": [
      { "order_number": "ORD-0001", "customer": "Sinta",
        "customer_id": 1, "order_id": 12, "total": 250000 }
    ],
    "created_at": "2026-05-31T09:41:00+00:00"
  }
}
```
`unpaid` = data terstruktur untuk UI render kartu aksi.

### GET /ai/messages
`200` → riwayat chat (user + assistant), urut lama→baru, max 100.

### POST /ai/generate-follow-up
Body: `{ "customer_id": 1, "order_id": 12, "type": "payment" }`. `type` ∈ `payment` | `reorder` | `general`. Customer bisnis lain → `404`. `200` → `{ "message": "Halo Kak Sinta, ..." }`.

### POST /ai/generate-promo-ideas
Body: `{ "period": "this_week" }` (`this_week` | `this_month`, default `this_week`). `200` → `{ "ideas": "Karena Paket Hemat paling laku ..." }`.

### POST /ai/generate-daily-summary
Body: `{ "date": "2026-05-31" }` (opsional, default hari ini). Men-generate & menyimpan `ai_summary` di daily report. `200` → `{ "summary": "..." }`.

---

## 14. Catatan Integrasi

- **Same-origin di produksi:** SPA memanggil `/api` lewat nginx (FastCGI ke php-fpm), jadi tidak perlu CORS. Untuk klien lain (mobile/integrasi), set `FRONTEND_URL`/`SANCTUM_STATEFUL_DOMAINS` dan gunakan Bearer token.
- **Idempotensi:** `invoices/from-order` dan auto-reminder aman dipanggil berulang.
- **Konsistensi uang:** semua nominal integer rupiah (tanpa desimal sen di response). Order total selalu dihitung server.
- **Health check:** `GET /up` (di luar `/api`, langsung Laravel) → `200` untuk liveness probe.
