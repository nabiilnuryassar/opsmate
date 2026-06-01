# TASK-05 — Customer Management (CRUD)

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-04
> Estimasi: 1–2 hari

---

## Tujuan

Implementasi CRUD pelanggan lengkap: tambah, edit, hapus, lihat detail, lihat riwayat order, dan pencarian customer.

---

## Scope

### 5.1 Backend

#### Database Migration: `customers`
```
customers
├── id (bigint, PK)
├── business_id (FK → businesses.id)
├── name (string)
├── phone (string, nullable)
├── email (string, nullable)
├── address (text, nullable)
├── notes (text, nullable)
├── customer_type (enum: new, regular, vip, inactive)
├── last_order_at (datetime, nullable)
├── created_at
└── updated_at
```

#### API Endpoints (PRD §15)
```http
GET    /api/customers              ← list + search + filter
POST   /api/customers              ← create
GET    /api/customers/{id}         ← detail
PUT    /api/customers/{id}         ← update
DELETE /api/customers/{id}         ← soft delete
GET    /api/customers/{id}/orders  ← order history
```

#### Query Features
- Search: by name, phone, email
- Filter: by customer_type
- Sort: by name, last_order_at, created_at
- Pagination: 20 per page

---

### 5.2 Frontend — Customer List Page

Halaman: `/customers`

#### Mobile Layout
- Search bar (top)
- Filter chips: Semua, Baru, Regular, VIP, Inactive (horizontal scroll)
- Customer cards (list):
  - Avatar (initials)
  - Name
  - Phone (masked: 0812-xxxx-xxxx)
  - Total order count
  - Last order date
  - Customer type badge
- FAB atau header button: "+ Tambah Customer"
- Empty state jika belum ada customer (DESIGN §12.10):
  > *"Belum ada customer. Tambah customer pertama supaya order bisa dicatat."*
  > CTA: "Tambah Customer Pertama"

#### Desktop Layout
- Search + filter di top bar
- Customer list bisa tampil sebagai cards atau compact list
- Button: "+ Tambah Customer" di header

---

### 5.3 Frontend — Customer Form (Add / Edit)

#### Add Customer
- Halaman: `/customers/new` atau modal/sheet
- Fields:
  - Nama (required)
  - Nomor WhatsApp / HP
  - Email
  - Alamat
  - Catatan
  - Tipe customer (default: new)
- CTA: "Simpan Customer"
- Success toast: *"Customer berhasil ditambahkan."*

#### Edit Customer
- Halaman: `/customers/{id}/edit` atau modal
- Pre-filled fields
- CTA: "Simpan Perubahan"

---

### 5.4 Frontend — Customer Detail Page

Halaman: `/customers/{id}`

Layout:
1. Customer info card (name, phone, email, address, type badge)
2. Quick actions: "Buat Order", "Follow-up WhatsApp"
3. Riwayat Order (list of order cards)
4. Catatan
5. Statistics: total order, total spending

Referensi: DESIGN §12.7
```
Sinta Permata
0812-xxxx-xxxx
12 order · Terakhir order 2 hari lalu
[Repeat Customer]
```

---

### 5.5 Customer Card Component

Komponen: `CustomerCard.tsx` (DESIGN §12.7)

Props:
- name, phone, lastOrder, totalOrders, customerType
- onClick → navigate to detail

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_customers_table.php` | migration |
| `app/Models/Customer.php` | model |
| `app/Enums/CustomerType.php` | enum |
| `app/Http/Controllers/Api/CustomerController.php` | CRUD |
| `app/Http/Requests/CustomerRequest.php` | validation |
| `app/Http/Resources/CustomerResource.php` | API resource |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/customers/pages/CustomerListPage.tsx` | list |
| `src/features/customers/pages/CustomerDetailPage.tsx` | detail |
| `src/features/customers/pages/CustomerFormPage.tsx` | add/edit |
| `src/features/customers/components/CustomerCard.tsx` | card |
| `src/features/customers/hooks/useCustomers.ts` | TanStack Query |
| `src/types/customer.ts` | TypeScript types |

---

## Acceptance Criteria (PRD §19)

- [ ] User dapat tambah customer
- [ ] User dapat melihat daftar customer
- [ ] User dapat melihat detail customer
- [ ] User dapat edit dan hapus customer
- [ ] User dapat melihat riwayat order customer
- [ ] User dapat mencari customer (by name/phone)
- [ ] Customer type badge tampil benar
- [ ] Phone number di-mask di list (privasi)
- [ ] Empty state tampil jika belum ada data
- [ ] Semua data di-scope per business_id
