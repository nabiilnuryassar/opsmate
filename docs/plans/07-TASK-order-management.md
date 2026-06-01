# TASK-07 — Order Management (CRUD)

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-05, TASK-06
> Estimasi: 2–3 hari

---

## Tujuan

Implementasi CRUD order lengkap: buat order cepat, daftar order, filter, detail, update status. Order adalah fitur inti produk — form harus bisa diselesaikan dalam kurang dari 1 menit (DESIGN §13.2).

---

## Scope

### 7.1 Backend

#### Database Migration: `orders`
```
orders
├── id (bigint, PK)
├── business_id (FK → businesses.id)
├── customer_id (FK → customers.id)
├── order_number (string, unique per business) ← auto: ORD-0001
├── order_date (date)
├── due_date (date, nullable)
├── status (enum: new, confirmed, processing, ready, completed, delivered, cancelled)
├── payment_status (enum: unpaid, partial, paid, refunded)
├── subtotal (decimal 12,2)
├── discount (decimal 12,2, default: 0)
├── total (decimal 12,2)
├── notes (text, nullable)
├── created_by (FK → users.id)
├── created_at
└── updated_at
```

#### Database Migration: `order_items`
```
order_items
├── id (bigint, PK)
├── order_id (FK → orders.id)
├── product_id (FK → products.id)
├── product_name (string) ← snapshot, jaga jika produk dihapus
├── quantity (integer)
├── price (decimal 12,2) ← snapshot harga saat order
├── total (decimal 12,2) ← qty × price
├── created_at
└── updated_at
```

#### API Endpoints (PRD §15)
```http
GET    /api/orders                          ← list + search + filter
POST   /api/orders                          ← create (with items)
GET    /api/orders/{id}                     ← detail + items + customer
PUT    /api/orders/{id}                     ← update
DELETE /api/orders/{id}                     ← soft delete
PATCH  /api/orders/{id}/status              ← update order status
PATCH  /api/orders/{id}/payment-status      ← update payment status
```

#### Order Number Auto-generation
Format: `ORD-XXXX` → sequential per business, zero-padded.

#### Validation
- customer_id: required, exists
- items: required, array, min:1
- items.*.product_id: required, exists
- items.*.quantity: required, integer, min:1
- items.*.price: required, numeric, min:0
- payment_status: required, in:unpaid,partial,paid,refunded
- status: required, in:new,confirmed,processing,ready,completed,delivered,cancelled

#### Query Features
- Search: by order_number, customer name
- Filter: by status, payment_status, date range
- Sort: by order_date, created_at, total
- Pagination: 20 per page
- Filter shortcuts: "Hari Ini", "Belum Bayar", "Diproses", "Selesai"

---

### 7.2 Frontend — Add Order Screen

Referensi: [tambah-order-mobile.png](file:///c:/laragon/www/opsmate-ai/docs/screens/tambah-order-mobile.png)

Halaman: `/orders/new`

#### Layout (sesuai mockup)

```
┌─────────────────────────────────┐
│ ← Tambah Order Baru    [voice] │ ← header + AI voice hint
├─────────────────────────────────┤
│ § Pelanggan                     │
│ [Pilih Pelanggan Existing   ▾] │
│ + Tambah Baru                  │
├─────────────────────────────────┤
│ § Produk                        │
│ [🔍 Cari atau pilih produk...] │
│ ┌─────────────────────────────┐ │
│ │ Kopi Susu Gula Aren        │ │
│ │ SKU: Kopi-001              │ │
│ │ [-] 1 [+]    Rp25.000     │ │
│ └─────────────────────────────┘ │
│ + Tambah Produk Lain           │
├─────────────────────────────────┤
│ § Status Pembayaran             │
│ [Belum Bayar] [DP] [Lunas]     │ ← segmented control
├─────────────────────────────────┤
│ § Status Order                  │
│ [Baru] [Diproses] [Selesai]    │ ← segmented control
├─────────────────────────────────┤
│ § Catatan (Opsional)            │
│ [textarea placeholder]         │
├─────────────────────────────────┤
│ Total Tagihan         Rp250.000│ ← sticky bottom
│        [Simpan Order ✓]        │ ← primary CTA
└─────────────────────────────────┘
```

Dari mockup spesifik:
- Header: "Tambah Order Baru" + back arrow + voice hint icon
- Customer section: dropdown "Pilih Pelanggan Existing" + "+ Tambah Baru" link
- Product section: search input + product card with quantity stepper ([-] 1 [+]) + price + "Harga Unit" label
- "+ Tambah Produk Lain" button
- Status Pembayaran: segmented control 3 options (Belum Bayar / DP / Lunas)
- Status Order: segmented control 3 options (Baru / Diproses / Selesai)
- Catatan: optional textarea with placeholder
- Sticky bottom: "Total Tagihan Rp250.000" + green "Simpan Order ✓" button

#### Key UX Rules (DESIGN §13.2)
- Customer bisa ditambah langsung dari form (inline modal/sheet)
- Product bisa ditambah langsung dari form
- Total otomatis update saat item berubah
- Jangan membuat user bolak-balik halaman
- Form harus bisa selesai < 1 menit

---

### 7.3 Frontend — Orders List Page

Halaman: `/orders`

Referensi: DESIGN §14.5

#### Mobile Layout
- Search bar
- Filter chips (horizontal scroll): Semua, Hari Ini, Belum Bayar, Diproses, Selesai
- Order cards (DESIGN §12.6):
  ```
  Sinta Permata
  ORD-0012 · Hari ini
  Rp250.000
  [Belum Bayar] [Diproses]
  Button: Follow-up
  ```
- FAB: "+" → Add Order

#### Desktop Layout
- Tabel (lihat mockup desktop): Pelanggan, ID Order, Total, Pembayaran, Status
- Setiap row clickable → detail
- Badges inline: payment status + order status

---

### 7.4 Frontend — Order Detail Page

Halaman: `/orders/{id}`

Referensi: DESIGN §14.6

Sections:
1. Order header: order number, date, status badges
2. Customer info: name, phone, quick follow-up
3. Order items: product name, qty, price, total
4. Payment info: subtotal, discount, total
5. Status controls: update order status, update payment status
6. Notes
7. Actions: Buat Invoice, Follow-up, Edit Order

---

### 7.5 Order Card Component

Komponen: `OrderCard.tsx` (DESIGN §12.6)

Dari mockup mobile dashboard:
- Left: avatar initials (colored circle) + customer name + item count + time
- Right: amount + payment status badge (LUNAS=green, PENDING=orange, BELUM BAYAR=red)
- Unpaid orders visually noticeable

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_orders_table.php` | migration |
| `database/migrations/..._create_order_items_table.php` | migration |
| `app/Models/Order.php` | model + relationships |
| `app/Models/OrderItem.php` | model |
| `app/Enums/OrderStatus.php` | enum |
| `app/Enums/PaymentStatus.php` | enum |
| `app/Http/Controllers/Api/OrderController.php` | CRUD |
| `app/Http/Requests/CreateOrderRequest.php` | validation |
| `app/Http/Resources/OrderResource.php` | API resource |
| `app/Services/Business/OrderService.php` | business logic (auto number, calculate totals) |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/orders/pages/OrderListPage.tsx` | list |
| `src/features/orders/pages/OrderDetailPage.tsx` | detail |
| `src/features/orders/pages/OrderFormPage.tsx` | add/edit form |
| `src/features/orders/components/OrderCard.tsx` | card |
| `src/features/orders/components/OrderItemRow.tsx` | item row in form |
| `src/features/orders/components/CustomerPicker.tsx` | customer selector |
| `src/features/orders/components/ProductPicker.tsx` | product selector |
| `src/features/orders/hooks/useOrders.ts` | TanStack Query |
| `src/types/order.ts` | TypeScript types |

---

## Acceptance Criteria (PRD §19)

- [ ] User dapat membuat order dengan customer + items + status
- [ ] User dapat melihat daftar order dengan filter & search
- [ ] User dapat melihat detail order
- [ ] User dapat mengubah status order
- [ ] User dapat mengubah status pembayaran
- [ ] User dapat menambahkan item ke order
- [ ] Sistem menghitung total order otomatis
- [ ] Order number auto-generated (ORD-XXXX)
- [ ] Product name & price di-snapshot ke order_items
- [ ] Form order bisa diselesaikan < 1 menit
- [ ] Customer bisa ditambah langsung dari form order
- [ ] Product bisa ditambah langsung dari form order
- [ ] Order tampil di dashboard (TASK-09)
- [ ] Sticky bottom: total + save button (sesuai mockup)
