# PRD & MVP — AI Ops Manager untuk UMKM

## 1. Nama Produk

**OpsMate AI**
Alternatif nama: **KelolaAI**, **WarungPilot**, **UMKM Copilot**, **BisnisMate**, **Operata AI**

## 2. Ringkasan Produk

**OpsMate AI** adalah aplikasi manajemen operasional berbasis AI untuk UMKM yang membantu pemilik bisnis mengelola order, pelanggan, stok, invoice, follow-up, laporan harian, dan rekomendasi bisnis secara otomatis.

Produk ini ditujukan untuk UMKM yang belum punya sistem operasional rapi, masih mengandalkan WhatsApp, catatan manual, Excel, atau ingatan pribadi.

Value utama produk:

> “AI Manager harian untuk bisnis kecil: bantu ingetin, nyatet, ngitung, ngasih saran, dan bantu owner ambil keputusan.”

---

# 3. Problem Statement

Banyak UMKM tidak gagal karena produknya buruk, tetapi karena operasionalnya berantakan.

Masalah umum UMKM:

1. Order masuk dari banyak channel dan sering lupa dicatat.
2. Follow-up customer sering kelewat.
3. Stok tidak terpantau.
4. Owner tidak tahu produk mana yang paling laku.
5. Tidak tahu margin laba bersih.
6. Invoice masih manual.
7. Laporan harian tidak konsisten.
8. Customer lama jarang dihubungi ulang.
9. Promosi dibuat asal-asalan.
10. Owner terlalu sibuk di operasional kecil, bukan strategi bisnis.

Contoh real:

> “Ada 20 order masuk dari WhatsApp, 5 belum dibayar, 3 belum dikirim, 2 customer belum difollow-up, stok produk A tinggal 2, tapi owner baru sadar besoknya.”

---

# 4. Product Vision

Menjadi **AI Operating System untuk UMKM Indonesia**, dimulai dari fungsi paling sederhana:

- catat order
- pantau pelanggan
- pantau stok
- buat invoice
- laporan harian
- rekomendasi AI
- reminder operasional

Dalam jangka panjang, produk ini bisa menjadi:

> “AI COO untuk bisnis kecil.”

---

# 5. Target User

## 5.1 Primary User

### Owner UMKM kecil

Contoh:

- penjual makanan rumahan
- laundry
- toko online kecil
- jasa service AC
- jasa jahit
- jasa printing
- skincare reseller
- toko frozen food
- toko baju
- bisnis hampers
- florist
- bengkel kecil
- studio foto kecil

Karakteristik:

- bisnis sudah berjalan
- order mulai banyak
- masih manual
- belum siap pakai ERP mahal
- butuh aplikasi simpel
- sering pakai WhatsApp
- butuh dibantu, bukan diajari sistem rumit

## 5.2 Secondary User

### Admin / Staff

Tugas:

- input order
- update status order
- cek stok
- follow-up customer
- buat invoice

### Freelancer / Agency

Bisa memakai produk ini untuk dijual ulang ke UMKM sebagai jasa digitalisasi operasional.

---

# 6. Core Value Proposition

## 6.1 Untuk Owner UMKM

> “Tidak perlu bingung ngatur order, stok, customer, dan laporan. AI bantu pantau bisnis harian kamu.”

## 6.2 Untuk Staff

> “Semua order, invoice, dan customer jadi rapi dalam satu dashboard.”

## 6.3 Untuk Agency/Freelancer

> “Jual solusi operasional UMKM dengan sistem siap pakai dan AI assistant.”

---

# 7. MVP Goal

Tujuan MVP adalah membuktikan bahwa UMKM mau memakai aplikasi ini untuk mengelola operasional harian dan merasa AI benar-benar membantu.

MVP tidak perlu langsung kompleks. Fokus utama MVP:

1. Owner bisa mencatat order.
2. Owner bisa mencatat customer.
3. Owner bisa mencatat produk/layanan.
4. Owner bisa memantau status pembayaran/order.
5. Owner bisa mendapat laporan harian.
6. AI bisa memberi insight sederhana.
7. Sistem bisa memberi reminder follow-up.

---

# 8. MVP Scope

## 8.1 Modul yang Masuk MVP

1. Authentication
2. Business Profile
3. Dashboard
4. Customer Management
5. Product/Service Management
6. Order Management
7. Invoice sederhana
8. Payment Status Tracking
9. Stock Tracking sederhana
10. Daily Report
11. AI Business Assistant
12. Reminder & Follow-up
13. Basic Settings

## 8.2 Modul yang Belum Masuk MVP

Tidak masuk MVP awal:

1. Integrasi WhatsApp API resmi
2. Payment gateway
3. Multi-branch
4. Accounting lengkap
5. Payroll
6. Marketplace
7. POS kasir kompleks
8. Barcode scanner
9. Integrasi ekspedisi otomatis
10. Mobile app native
11. AI voice assistant
12. Inventory multi-gudang
13. CRM automation kompleks

---

# 9. User Persona

## Persona 1 — Owner Makanan Rumahan

Nama: Bu Rina
Bisnis: Catering rumahan
Masalah:

- order masuk dari WhatsApp
- sering lupa siapa yang sudah bayar
- stok bahan sering kurang
- laporan harian tidak ada

Kebutuhan:

- catat order cepat
- tahu order hari ini
- tahu yang belum bayar
- tahu customer yang perlu difollow-up
- laporan penjualan harian

## Persona 2 — Pemilik Laundry

Nama: Pak Dimas
Bisnis: Laundry kiloan
Masalah:

- status cucian sering tertukar
- customer tanya terus “sudah selesai belum?”
- pembayaran kadang belum dicatat

Kebutuhan:

- status order
- invoice
- customer database
- reminder order selesai

## Persona 3 — Jasa Service AC

Nama: Budi
Bisnis: Service AC panggilan
Masalah:

- jadwal teknisi tidak rapi
- customer lama jarang difollow-up
- invoice manual

Kebutuhan:

- data customer
- riwayat layanan
- reminder service berkala
- invoice cepat

---

# 10. Main User Flow

## 10.1 First Time User Flow

1. User register/login.
2. User mengisi profil bisnis:
   - nama bisnis
   - jenis bisnis
   - nomor WhatsApp
   - alamat
   - kategori bisnis

3. User masuk dashboard.
4. User diminta menambahkan produk/layanan pertama.
5. User diminta menambahkan customer/order pertama.
6. AI memberikan ringkasan awal:
   - “Bisnis kamu sudah siap dicatat.”
   - “Mulai dari input order pertama.”
   - “Nanti saya bantu buat laporan harian.”

## 10.2 Order Flow

1. User klik “Tambah Order”.
2. Pilih customer atau buat customer baru.
3. Pilih produk/layanan.
4. Input jumlah.
5. Input harga.
6. Pilih status pembayaran:
   - belum bayar
   - DP
   - lunas

7. Pilih status order:
   - baru
   - diproses
   - selesai
   - dikirim
   - dibatalkan

8. Sistem menyimpan order.
9. Dashboard diperbarui.
10. AI bisa memberi catatan:

- “Ada 3 order belum dibayar.”
- “Produk X paling banyak dipesan hari ini.”

## 10.3 Daily Report Flow

1. User buka dashboard.
2. Sistem menampilkan:
   - total order hari ini
   - total pendapatan
   - order belum bayar
   - order selesai
   - produk terlaris
   - customer baru

3. AI membuat ringkasan:
   - “Hari ini penjualan naik 20% dari kemarin.”
   - “Ada 2 customer belum bayar.”
   - “Stok produk A hampir habis.”

## 10.4 Follow-up Flow

1. Sistem mendeteksi customer belum bayar atau belum dihubungi.
2. Sistem menampilkan reminder.
3. User klik reminder.
4. AI membuat draft pesan follow-up.
5. User copy pesan ke WhatsApp secara manual.

Contoh draft:

> “Halo Kak Sinta, ini kami dari Rina Catering. Mau mengingatkan untuk pembayaran order nasi box tanggal 31 Mei. Jika sudah transfer, boleh kirim bukti pembayaran ya Kak. Terima kasih.”

---

# 11. Functional Requirements

## 11.1 Authentication

User dapat:

- register
- login
- logout
- reset password

Field register:

- name
- email
- password
- business name

Role MVP:

- owner
- staff

Permission MVP:

Owner bisa:

- mengelola semua data
- melihat laporan
- mengundang staff
- mengubah setting bisnis

Staff bisa:

- input order
- input customer
- update order
- lihat produk
- lihat customer

Staff tidak bisa:

- melihat setting billing
- menghapus bisnis
- mengubah owner

---

## 11.2 Business Profile

User dapat mengatur profil bisnis.

Field:

- business_name
- business_category
- phone_number
- address
- city
- logo
- currency
- business_description

Kategori bisnis:

- makanan/minuman
- laundry
- jasa service
- toko online
- fashion
- kesehatan/kecantikan
- edukasi
- otomotif
- lainnya

---

## 11.3 Dashboard

Dashboard menampilkan ringkasan operasional.

Cards utama:

1. Total order hari ini
2. Total pendapatan hari ini
3. Order belum bayar
4. Order sedang diproses
5. Produk/layanan terlaris
6. Customer baru
7. Reminder follow-up
8. Stok hampir habis

AI Summary Card:

> “Hari ini ada 12 order dengan estimasi pendapatan Rp1.250.000. Ada 3 order belum dibayar dan 2 stok produk hampir habis.”

---

## 11.4 Customer Management

User dapat:

- tambah customer
- edit customer
- hapus customer
- lihat detail customer
- lihat riwayat order customer
- cari customer

Field customer:

- name
- phone
- email
- address
- notes
- customer_type
- last_order_at

Customer type:

- new
- regular
- VIP
- inactive

AI insight customer:

- customer paling sering order
- customer lama tidak order
- customer belum bayar
- customer potensial untuk promo

---

## 11.5 Product / Service Management

User dapat:

- tambah produk/layanan
- edit produk/layanan
- hapus produk/layanan
- set harga
- set stok
- set kategori

Field:

- name
- type: product/service
- category
- price
- cost_price
- stock
- minimum_stock
- unit
- description
- is_active

Untuk service, stok boleh kosong.

AI insight produk:

- produk paling laku
- produk margin rendah
- produk jarang laku
- stok hampir habis

Contoh insight:

> “Produk Paket Hemat laku 18 kali minggu ini, tapi margin hanya 9%. Pertimbangkan naikkan harga Rp2.000 atau bundling dengan produk lain.”

---

## 11.6 Order Management

User dapat:

- membuat order
- melihat daftar order
- filter order
- edit order
- ubah status order
- ubah status pembayaran
- hapus order
- lihat detail order

Field order:

- order_number
- customer_id
- order_date
- due_date
- status
- payment_status
- subtotal
- discount
- total
- notes

Order status:

- new
- confirmed
- processing
- ready
- completed
- delivered
- cancelled

Payment status:

- unpaid
- partial
- paid
- refunded

Order item:

- product_id
- quantity
- price
- total

AI order insight:

- order belum selesai
- order belum bayar
- order terlambat
- order dengan nominal besar
- customer repeat order

---

## 11.7 Invoice Sederhana

User dapat:

- generate invoice dari order
- melihat invoice
- download invoice sebagai PDF
- copy invoice text
- mengubah status invoice

Field invoice:

- invoice_number
- order_id
- customer_id
- issue_date
- due_date
- total
- status

Invoice status:

- draft
- sent
- paid
- overdue
- cancelled

MVP invoice tidak perlu payment gateway.

---

## 11.8 Stock Tracking

User dapat:

- melihat stok produk
- update stok manual
- stok otomatis berkurang saat order selesai
- melihat produk stok rendah

Field stock movement:

- product_id
- type: in/out/adjustment
- quantity
- notes
- created_by

AI stock insight:

> “Stok Kopi Susu tinggal 3. Rata-rata penjualan 5 per hari. Kemungkinan habis hari ini.”

---

## 11.9 Reminder & Follow-up

Sistem menampilkan reminder:

1. Order belum dibayar
2. Invoice overdue
3. Order belum selesai
4. Customer lama tidak order
5. Stok hampir habis
6. Follow-up customer setelah pembelian

User dapat:

- melihat daftar reminder
- mark as done
- snooze
- generate pesan follow-up dengan AI

Contoh reminder:

> “Customer Sinta belum bayar invoice INV-0012 sebesar Rp250.000.”

Contoh AI follow-up:

> “Halo Kak Sinta, kami ingin mengingatkan pembayaran invoice INV-0012 sebesar Rp250.000. Jika sudah melakukan pembayaran, boleh kirim bukti transfer ya Kak. Terima kasih.”

---

## 11.10 Daily Report

Sistem membuat laporan harian otomatis.

Isi laporan:

- total order
- total pendapatan
- total belum bayar
- produk terlaris
- customer baru
- order selesai
- stok rendah
- catatan AI

Contoh:

> “Hari ini bisnis kamu mendapatkan 15 order dengan total Rp2.450.000. Produk terlaris adalah Paket A sebanyak 8 order. Ada 4 order belum dibayar dengan total Rp650.000. Stok Es Kopi Susu tinggal 3 dan perlu restock.”

User dapat:

- lihat laporan hari ini
- lihat laporan kemarin
- filter per tanggal
- copy laporan
- export PDF

---

## 11.11 AI Business Assistant

AI Assistant menjadi fitur pembeda utama.

User bisa bertanya:

- “Hari ini gimana?”
- “Produk apa yang paling laku?”
- “Siapa customer yang belum bayar?”
- “Stok apa yang mau habis?”
- “Buatkan pesan follow-up untuk customer yang belum bayar.”
- “Kasih saran promo buat minggu ini.”
- “Produk mana yang marginnya rendah?”
- “Customer mana yang harus saya hubungi lagi?”

Kemampuan AI MVP:

1. Ringkasan dashboard
2. Insight order
3. Insight customer
4. Insight stok
5. Generate pesan follow-up
6. Generate ide promo sederhana
7. Generate laporan harian
8. Menjawab berdasarkan data bisnis user

Batasan AI MVP:

- tidak boleh membuat keputusan finansial mutlak
- tidak boleh mengubah data tanpa konfirmasi
- tidak boleh mengirim pesan otomatis
- tidak boleh membuat klaim berlebihan

---

# 12. Non-Functional Requirements

## 12.1 Performance

- Dashboard load maksimal 3 detik.
- List order load maksimal 2 detik untuk 1.000 data.
- AI response maksimal 10 detik.
- Export PDF maksimal 10 detik.

## 12.2 Security

- Password harus di-hash.
- Data bisnis antar user harus terisolasi.
- Staff hanya bisa akses bisnis tempat dia diundang.
- API harus memakai authentication token/session.
- Validasi input wajib.
- Rate limit untuk AI endpoint.
- Audit log untuk perubahan penting.

## 12.3 Reliability

- Data order tidak boleh hilang.
- Setiap transaksi order harus atomic.
- Jika AI gagal, fitur utama tetap bisa berjalan.
- Backup database harian untuk production.

## 12.4 Usability

- UI mobile-first.
- Form order harus cepat.
- Bahasa utama Indonesia.
- Tidak boleh terlalu teknis.
- CTA harus jelas.
- Owner UMKM harus bisa pakai tanpa training panjang.

## 12.5 Scalability

MVP harus siap untuk:

- multi-tenant business
- banyak user per bisnis
- modular feature
- integrasi WhatsApp di masa depan
- integrasi payment gateway di masa depan

---

# 13. Suggested Tech Stack

## 13.1 Frontend

Rekomendasi:

- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Recharts

## 13.2 Backend

Pilihan kuat:

- Laravel 13
- Laravel Sanctum
- PostgreSQL
- Redis
- Queue Worker
- Laravel Scheduler
- DomPDF / Browsershot untuk PDF

## 13.3 AI Layer

Pilihan:

- OpenAI-compatible API
- LangChain / custom service layer
- RAG ringan berdasarkan data bisnis user
- Function calling / tool calling untuk query data

AI tidak langsung akses database secara bebas. Lebih aman pakai controlled tools.

Contoh AI tools:

- get_today_summary
- get_unpaid_orders
- get_low_stock_products
- get_top_products
- get_inactive_customers
- generate_follow_up_message
- generate_promo_ideas

## 13.4 Deployment

Untuk MVP:

- VPS
- Docker
- Nginx
- PostgreSQL
- Redis
- Laravel Queue Worker
- SSL
- Object storage optional

---

# 14. Database Schema Draft

## 14.1 users

- id
- name
- email
- password
- created_at
- updated_at

## 14.2 businesses

- id
- owner_id
- name
- category
- phone
- address
- city
- logo_url
- description
- currency
- created_at
- updated_at

## 14.3 business_users

- id
- business_id
- user_id
- role
- created_at
- updated_at

Role:

- owner
- staff

## 14.4 customers

- id
- business_id
- name
- phone
- email
- address
- notes
- customer_type
- last_order_at
- created_at
- updated_at

## 14.5 products

- id
- business_id
- name
- type
- category
- price
- cost_price
- stock
- minimum_stock
- unit
- description
- is_active
- created_at
- updated_at

## 14.6 orders

- id
- business_id
- customer_id
- order_number
- order_date
- due_date
- status
- payment_status
- subtotal
- discount
- total
- notes
- created_by
- created_at
- updated_at

## 14.7 order_items

- id
- order_id
- product_id
- product_name
- quantity
- price
- total
- created_at
- updated_at

## 14.8 invoices

- id
- business_id
- order_id
- customer_id
- invoice_number
- issue_date
- due_date
- total
- status
- created_at
- updated_at

## 14.9 stock_movements

- id
- business_id
- product_id
- type
- quantity
- notes
- created_by
- created_at
- updated_at

Type:

- in
- out
- adjustment

## 14.10 reminders

- id
- business_id
- related_type
- related_id
- title
- description
- type
- status
- due_at
- completed_at
- created_at
- updated_at

Reminder type:

- unpaid_order
- overdue_invoice
- low_stock
- inactive_customer
- unfinished_order
- follow_up

Reminder status:

- pending
- done
- snoozed

## 14.11 daily_reports

- id
- business_id
- report_date
- total_orders
- total_revenue
- total_unpaid
- top_products_json
- low_stock_json
- ai_summary
- created_at
- updated_at

## 14.12 ai_messages

- id
- business_id
- user_id
- role
- content
- metadata_json
- created_at
- updated_at

Role:

- user
- assistant
- system

---

# 15. API Endpoint Draft

## Auth

```http
POST /api/register
POST /api/login
POST /api/logout
GET /api/me
```

## Business

```http
GET /api/business
PUT /api/business
```

## Dashboard

```http
GET /api/dashboard/summary
GET /api/dashboard/ai-summary
```

## Customers

```http
GET /api/customers
POST /api/customers
GET /api/customers/{id}
PUT /api/customers/{id}
DELETE /api/customers/{id}
GET /api/customers/{id}/orders
```

## Products

```http
GET /api/products
POST /api/products
GET /api/products/{id}
PUT /api/products/{id}
DELETE /api/products/{id}
GET /api/products/low-stock
```

## Orders

```http
GET /api/orders
POST /api/orders
GET /api/orders/{id}
PUT /api/orders/{id}
DELETE /api/orders/{id}
PATCH /api/orders/{id}/status
PATCH /api/orders/{id}/payment-status
```

## Invoices

```http
GET /api/invoices
POST /api/invoices/from-order/{orderId}
GET /api/invoices/{id}
GET /api/invoices/{id}/pdf
PATCH /api/invoices/{id}/status
```

## Reminders

```http
GET /api/reminders
PATCH /api/reminders/{id}/done
PATCH /api/reminders/{id}/snooze
POST /api/reminders/{id}/generate-message
```

## Reports

```http
GET /api/reports/daily
GET /api/reports/daily/{date}
GET /api/reports/daily/{date}/pdf
```

## AI Assistant

```http
POST /api/ai/chat
POST /api/ai/generate-follow-up
POST /api/ai/generate-promo-ideas
POST /api/ai/generate-daily-summary
```

---

# 16. AI Assistant Design

## 16.1 System Prompt Draft

```text
Kamu adalah AI Ops Manager untuk UMKM Indonesia.
Tugas kamu membantu pemilik bisnis memahami kondisi operasional hariannya.

Kamu boleh:
- merangkum data order
- memberi insight customer
- memberi insight stok
- membuat draft pesan follow-up
- membuat ide promo
- menjelaskan laporan harian

Kamu tidak boleh:
- mengarang data yang tidak tersedia
- mengubah data tanpa persetujuan user
- membuat janji bahwa pesan sudah dikirim
- memberi saran finansial mutlak
- menyebut angka jika tidak ada di data

Gunakan bahasa Indonesia yang ramah, jelas, dan praktis.
Prioritaskan jawaban singkat, actionable, dan cocok untuk owner UMKM.
```

## 16.2 AI Tool Functions

### get_today_summary

Mengambil data:

- total order hari ini
- revenue hari ini
- unpaid order
- completed order
- low stock

### get_unpaid_orders

Mengambil daftar order belum bayar.

### get_low_stock_products

Mengambil produk dengan stok <= minimum_stock.

### get_top_products

Mengambil produk terlaris berdasarkan periode.

### get_inactive_customers

Mengambil customer yang tidak order dalam periode tertentu.

### generate_follow_up_message

Membuat draft pesan WhatsApp berdasarkan customer/order.

---

# 17. UI/UX Requirements

## 17.1 Design Principle

UI harus terasa:

- simpel
- cepat
- ramah UMKM
- mobile-first
- tidak intimidating
- seperti “asisten bisnis”, bukan ERP berat

## 17.2 Navigation

Sidebar desktop:

1. Dashboard
2. Orders
3. Customers
4. Products
5. Invoices
6. Reminders
7. Reports
8. AI Assistant
9. Settings

Bottom navigation mobile:

1. Home
2. Orders
3. Add
4. Reminder
5. AI

## 17.3 Dashboard Layout

Bagian dashboard:

1. Greeting
2. AI summary card
3. Metric cards
4. Reminder list
5. Recent orders
6. Low stock alert
7. Top products

## 17.4 Main CTA

CTA utama:

- Tambah Order
- Tambah Customer
- Tanya AI
- Buat Laporan

## 17.5 Empty State

Contoh empty state:

> “Belum ada order. Mulai catat order pertama kamu supaya AI bisa bantu bikin laporan harian.”

Button:

> “Tambah Order Pertama”

---

# 18. MVP Pages

## 18.1 Auth Pages

- Login
- Register
- Forgot Password

## 18.2 Onboarding Pages

- Setup Business Profile
- Add First Product/Service
- Add First Customer/Order

## 18.3 App Pages

1. Dashboard
2. Orders List
3. Order Detail
4. Create/Edit Order
5. Customers List
6. Customer Detail
7. Create/Edit Customer
8. Products List
9. Product Detail
10. Create/Edit Product
11. Invoices List
12. Invoice Detail
13. Reminders List
14. Reports Daily
15. AI Assistant Chat
16. Settings

---

# 19. MVP Acceptance Criteria

## Authentication

- User dapat register.
- User dapat login.
- User dapat logout.
- User tidak bisa akses dashboard tanpa login.

## Business Profile

- User wajib punya business profile.
- User dapat mengedit business profile.

## Customer

- User dapat tambah customer.
- User dapat melihat daftar customer.
- User dapat melihat riwayat order customer.
- User dapat mencari customer.

## Product

- User dapat tambah produk/layanan.
- User dapat mengatur harga.
- User dapat mengatur stok.
- Sistem dapat menandai stok rendah.

## Order

- User dapat membuat order.
- User dapat menambahkan item ke order.
- Sistem menghitung total order.
- User dapat mengubah status order.
- User dapat mengubah status pembayaran.
- Order tampil di dashboard.

## Invoice

- User dapat membuat invoice dari order.
- User dapat melihat invoice.
- User dapat download PDF invoice.

## Reminder

- Sistem membuat reminder untuk order belum bayar.
- Sistem membuat reminder untuk stok rendah.
- User dapat menandai reminder selesai.
- User dapat generate pesan follow-up.

## Report

- Sistem menampilkan laporan harian.
- Laporan berisi total order, revenue, unpaid, top product, low stock.
- AI dapat membuat ringkasan laporan.

## AI Assistant

- User dapat bertanya tentang kondisi bisnis.
- AI dapat menjawab berdasarkan data bisnis.
- AI dapat membuat draft follow-up.
- AI dapat memberi ide promo sederhana.
- AI tidak boleh mengarang data.

---

# 20. MVP Success Metrics

## Activation Metrics

- 70% user menyelesaikan onboarding.
- 60% user membuat minimal 1 produk.
- 60% user membuat minimal 1 order.
- 40% user memakai AI assistant dalam 24 jam pertama.

## Engagement Metrics

- User aktif minimal 3 hari dalam 7 hari pertama.
- Rata-rata user membuat 10 order dalam minggu pertama.
- 50% user membuka daily report.
- 30% user memakai reminder.

## Business Metrics

- 5–10 UMKM pilot user.
- 3 user bersedia membayar setelah 14 hari.
- Minimal 1 use case bisnis terbukti sangat cocok.
- User merasa AI summary membantu.

## AI Quality Metrics

- 80% jawaban AI relevan dengan data.
- 90% AI tidak mengarang angka.
- 70% user merasa draft follow-up bisa langsung dipakai.

---

# 21. Pricing Draft

## Free Trial

Rp0 / 14 hari

Fitur:

- 1 bisnis
- 1 user
- 50 order
- 50 customer
- 20 AI message

## Starter

Rp49.000 / bulan

Untuk UMKM kecil.

Fitur:

- 1 bisnis
- 2 user
- 500 order/bulan
- unlimited customer
- 200 AI message/bulan
- invoice PDF
- daily report

## Pro

Rp99.000 / bulan

Untuk bisnis yang mulai ramai.

Fitur:

- 1 bisnis
- 5 user
- unlimited order
- unlimited customer
- 1.000 AI message/bulan
- advanced report
- reminder
- export PDF

## Agency / White Label

Rp299.000+ / bulan

Untuk freelancer/agency.

Fitur:

- multi bisnis
- custom branding
- client management
- template bisnis
- priority support

---

# 22. Go-To-Market MVP

## 22.1 Target Awal

Jangan langsung semua UMKM. Pilih niche awal.

Rekomendasi niche pertama:

1. jasa service AC
2. laundry
3. catering/makanan rumahan
4. jasa jahit
5. toko online kecil

Yang paling cocok untuk MVP:

> **Jasa service AC atau laundry**

Alasannya:

- punya order berulang
- butuh follow-up
- butuh status order
- butuh invoice
- operasional sering manual
- customer bisa repeat

## 22.2 Strategi Validasi

Cari 5–10 UMKM.

Tawarkan:

> “Saya bantu rapikan order, customer, invoice, dan laporan harian bisnis Anda selama 14 hari.”

Jangan jual AI dulu. Jual hasil:

- order lebih rapi
- customer tidak lupa difollow-up
- tahu pendapatan harian
- tahu yang belum bayar

## 22.3 Sales Script

```text
Halo Kak, saya sedang membuat aplikasi sederhana untuk bantu UMKM mengelola order, customer, invoice, dan laporan harian.

Biasanya banyak bisnis kecil masih catat order dari WhatsApp secara manual, jadi kadang lupa follow-up, lupa pembayaran, atau tidak punya laporan harian.

Saya ingin bantu setup gratis selama 14 hari. Nanti sistemnya bisa bantu:
- catat order
- lihat customer
- buat invoice
- ingetin yang belum bayar
- bikin laporan harian otomatis
- kasih ringkasan AI

Kalau cocok, nanti bisa lanjut pakai versi berbayar.
```

---

# 23. Development Roadmap

## Phase 0 — Validation

Durasi: 1 minggu

Output:

- landing page
- form waitlist
- interview 5 UMKM
- validasi problem
- pilih niche awal

## Phase 1 — Core MVP

Durasi: 3–4 minggu

Fitur:

- auth
- business profile
- customer
- product/service
- order
- dashboard
- invoice
- reminder basic

## Phase 2 — AI MVP

Durasi: 2 minggu

Fitur:

- AI daily summary
- AI chat
- AI follow-up message
- AI promo idea
- AI insight produk/customer

## Phase 3 — Pilot

Durasi: 2–4 minggu

Aktivitas:

- onboarding 5–10 UMKM
- catat feedback
- perbaiki flow order
- ukur retention
- validasi pricing

## Phase 4 — Paid Beta

Durasi: 1 bulan

Fitur tambahan:

- export PDF lebih rapi
- role staff
- laporan mingguan
- template follow-up
- billing sederhana

---

# 24. MVP Development Priority

## Must Have

1. Register/login
2. Business profile
3. Customer CRUD
4. Product/service CRUD
5. Order CRUD
6. Payment status
7. Order status
8. Dashboard summary
9. Reminder unpaid order
10. Low stock alert
11. Daily report
12. AI summary
13. AI follow-up draft

## Should Have

1. Invoice PDF
2. Staff role
3. Export report
4. AI promo idea
5. Customer inactive reminder

## Could Have

1. Theme customization
2. Logo invoice
3. Product category analytics
4. Weekly report
5. Copy WhatsApp message

## Won’t Have for MVP

1. WhatsApp API integration
2. Payment gateway
3. Accounting full
4. Mobile native
5. Marketplace
6. Multi-branch
7. Advanced CRM

---

# 25. Risks

## 25.1 User Tidak Mau Input Manual

Risiko:

UMKM malas input order.

Solusi:

- form order harus super cepat
- bisa tambah customer langsung dari form order
- template order
- mobile-first
- later: WhatsApp import

## 25.2 AI Dianggap Gimmick

Risiko:

AI tidak terasa berguna.

Solusi:

- AI harus menjawab data real bisnis
- jangan sekadar chatbot
- tampilkan insight otomatis
- fokus pada reminder dan laporan

## 25.3 Market Terlalu Luas

Risiko:

Produk jadi terlalu umum.

Solusi:

- mulai dari 1 niche
- contoh: service AC
- buat wording dan template sesuai niche

## 25.4 UMKM Sensitif Harga

Risiko:

User tidak mau bayar subscription.

Solusi:

- mulai harga rendah
- jual setup service
- tawarkan paket agency
- fokus ke value: hemat waktu dan cegah order lupa

---

# 26. Competitive Advantage

Pembeda dari aplikasi kasir/inventory biasa:

1. Fokus ke operasional harian, bukan kasir saja.
2. AI memberi insight dari data bisnis.
3. Bisa generate pesan follow-up.
4. Bisa kasih rekomendasi promo.
5. Bahasa Indonesia UMKM.
6. Mobile-first.
7. Ringan, tidak serumit ERP.
8. Bisa dijadikan produk agency untuk digitalisasi UMKM.

Positioning:

> “Bukan cuma aplikasi catatan order. Ini manager digital untuk bisnis kecil.”

---

# 27. Example AI Outputs

## 27.1 Daily Summary

```text
Hari ini bisnis kamu mendapatkan 12 order dengan total pendapatan Rp1.450.000.

Ada 3 order belum dibayar dengan total Rp375.000.
Produk paling laku hari ini adalah Paket Hemat sebanyak 5 order.

Stok Brownies Coklat tinggal 2, sedangkan rata-rata terjual 4 per hari. Sebaiknya restock hari ini.

Saran saya:
1. Follow-up 3 customer yang belum bayar.
2. Upload promo Paket Hemat karena sedang laku.
3. Restock Brownies Coklat sebelum sore.
```

## 27.2 Follow-up Payment

```text
Halo Kak Sinta, kami dari Rina Catering ingin mengingatkan pembayaran untuk order nasi box tanggal 31 Mei sebesar Rp250.000.

Jika sudah transfer, boleh kirim bukti pembayaran ya Kak.
Terima kasih banyak.
```

## 27.3 Promo Idea

```text
Karena Paket Hemat paling sering dibeli minggu ini, kamu bisa membuat promo:

“Beli 5 Paket Hemat gratis 1 Es Teh untuk order sebelum jam 12 siang.”

Promo ini cocok karena mendorong pembelian jumlah banyak dan tidak langsung menurunkan harga utama.
```

---

# 28. Recommended MVP Niche

Untuk versi pertama, jangan sebut produk ini untuk semua UMKM.

Lebih tajam kalau mulai dari:

## Option A — AI Ops Manager untuk Jasa Service AC

Fitur spesifik:

- customer
- jadwal service
- invoice
- reminder service ulang
- teknisi
- status pekerjaan
- follow-up customer lama

Positioning:

> “Aplikasi AI untuk bantu bisnis service AC mengelola order, customer, invoice, dan follow-up service berkala.”

## Option B — AI Ops Manager untuk Laundry

Fitur spesifik:

- order laundry
- status cucian
- customer
- invoice
- reminder pengambilan
- laporan harian
- paket kiloan/satuan

Positioning:

> “Aplikasi AI untuk bantu laundry kecil mengelola order, status cucian, pembayaran, dan laporan harian.”

## Option C — AI Ops Manager untuk Catering Rumahan

Fitur spesifik:

- order makanan
- jadwal pengiriman
- customer
- invoice
- stok bahan
- laporan penjualan
- repeat order

Positioning:

> “Aplikasi AI untuk bantu catering rumahan mengelola order, pembayaran, customer, dan laporan harian.”

Rekomendasi final:

> Mulai dari **service AC** atau **laundry**, karena pain operasionalnya jelas dan repeat order-nya kuat.

---

# 29. Final MVP Definition

MVP pertama dianggap selesai jika:

1. Owner bisa membuat akun dan profil bisnis.
2. Owner bisa menambahkan customer.
3. Owner bisa menambahkan produk/layanan.
4. Owner bisa membuat order.
5. Owner bisa mengubah status order dan pembayaran.
6. Sistem bisa menampilkan dashboard harian.
7. Sistem bisa membuat reminder order belum bayar.
8. Sistem bisa mendeteksi stok rendah.
9. Sistem bisa membuat invoice sederhana.
10. AI bisa membuat ringkasan harian.
11. AI bisa membuat draft follow-up.
12. AI bisa memberi insight produk/customer sederhana.

MVP tidak harus sempurna. Yang penting user merasakan:

> “Bisnis gue jadi lebih rapi dan gue nggak perlu mikirin semuanya sendiri.”

---

# 30. One-Liner Pitch

**OpsMate AI adalah AI manager harian untuk UMKM yang membantu mencatat order, memantau customer, mengingatkan pembayaran, membuat invoice, memantau stok, dan memberi laporan bisnis otomatis.**

---

# 31. Elevator Pitch

Banyak UMKM masih mengelola order, customer, stok, dan pembayaran secara manual lewat WhatsApp, catatan, atau Excel. Akibatnya, order sering lupa, pembayaran tidak terpantau, stok habis mendadak, dan owner tidak punya laporan harian.

OpsMate AI hadir sebagai AI Ops Manager untuk UMKM. Aplikasi ini membantu pemilik bisnis mencatat order, mengelola customer, membuat invoice, memantau stok, memberi reminder follow-up, dan membuat laporan harian otomatis dengan bantuan AI.

Tujuannya sederhana:

> Membuat bisnis kecil terasa punya manager operasional sendiri.

---

# 32. Suggested First Build Order

Urutan pengerjaan paling realistis:

1. Setup project
2. Auth
3. Business profile
4. Layout dashboard
5. Customer CRUD
6. Product/service CRUD
7. Order CRUD
8. Payment/order status
9. Dashboard metrics
10. Reminder unpaid order
11. Low stock alert
12. Invoice PDF
13. Daily report
14. AI summary
15. AI follow-up generator
16. Pilot testing

---

# 33. Final Recommendation

Bangun MVP ini sebagai **SaaS mobile-first untuk satu niche dulu**, bukan langsung semua UMKM.

Rekomendasi terbaik:

> **OpsMate AI for Service Business**

Niche awal:

- service AC
- laundry
- jasa jahit
- cleaning service
- bengkel kecil

Karena bisnis jasa punya kebutuhan kuat:

- order
- status pengerjaan
- customer
- invoice
- follow-up
- repeat service

Setelah MVP valid, baru perluas ke UMKM lain seperti makanan, toko online, dan retail kecil.
