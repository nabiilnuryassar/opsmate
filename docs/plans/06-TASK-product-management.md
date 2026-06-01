# TASK-06 — Product / Service Management (CRUD)

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-04
> Estimasi: 1–2 hari

---

## Tujuan

Implementasi CRUD produk/layanan: tambah, edit, hapus, set harga, set stok, kategori, dan alert stok rendah.

---

## Scope

### 6.1 Backend

#### Database Migration: `products`
```
products
├── id (bigint, PK)
├── business_id (FK → businesses.id)
├── name (string)
├── type (enum: product, service)
├── category (string, nullable)
├── price (decimal 12,2)
├── cost_price (decimal 12,2, nullable)
├── stock (integer, nullable) ← null untuk service
├── minimum_stock (integer, nullable)
├── unit (string, nullable) ← "pcs", "kg", "meter", etc.
├── description (text, nullable)
├── is_active (boolean, default: true)
├── created_at
└── updated_at
```

#### API Endpoints (PRD §15)
```http
GET    /api/products              ← list + search + filter
POST   /api/products              ← create
GET    /api/products/{id}         ← detail
PUT    /api/products/{id}         ← update
DELETE /api/products/{id}         ← soft delete
GET    /api/products/low-stock    ← products below minimum_stock
```

#### Query Features
- Search: by name
- Filter: by type (product/service), category, is_active, low_stock
- Sort: by name, price, stock, created_at
- Pagination: 20 per page

#### Low Stock Logic
```
low_stock = stock IS NOT NULL AND stock <= minimum_stock
```

---

### 6.2 Frontend — Product List Page

Halaman: `/products`

#### Layout
- Search bar
- Filter chips: Semua, Produk, Layanan, Stok Rendah
- Product cards (DESIGN §12.8):
  ```
  Brownies Coklat
  Rp45.000
  Stok 2 tersisa
  [Stok Hampir Habis]
  ```
- Button: "+ Tambah Produk"
- Empty state: *"Belum ada produk. Tambah produk pertama supaya bisa mulai catat order."*

---

### 6.3 Frontend — Product Form (Add / Edit)

Fields:
- Nama produk/layanan (required)
- Tipe: Produk / Layanan (segmented control)
- Kategori (text atau select)
- Harga jual (required, number)
- Harga modal (optional, number)
- Stok (number, hidden jika tipe = service)
- Stok minimum (number, hidden jika tipe = service)
- Satuan (text: pcs, kg, porsi, dll)
- Deskripsi (optional textarea)
- Status: Aktif / Nonaktif (toggle)

CTA: "Simpan Produk"

---

### 6.4 Frontend — Product Detail Page

Halaman: `/products/{id}`

Sections:
1. Product info (name, category, type, price, description)
2. Stock info (current stock, minimum, unit, low stock warning)
3. Margin info (if cost_price set): `margin = price - cost_price`
4. Order history for this product
5. Quick actions: Edit, Adjust Stock

---

### 6.5 Product Card Component

Komponen: `ProductCard.tsx`

Props:
- name, category, price, stock, minimumStock, isActive, type
- Low stock badge: tampil jika stock ≤ minimum_stock
- Inactive badge jika is_active = false

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_products_table.php` | migration |
| `app/Models/Product.php` | model |
| `app/Enums/ProductType.php` | product, service |
| `app/Http/Controllers/Api/ProductController.php` | CRUD |
| `app/Http/Requests/ProductRequest.php` | validation |
| `app/Http/Resources/ProductResource.php` | API resource |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/products/pages/ProductListPage.tsx` | list |
| `src/features/products/pages/ProductDetailPage.tsx` | detail |
| `src/features/products/pages/ProductFormPage.tsx` | add/edit |
| `src/features/products/components/ProductCard.tsx` | card |
| `src/features/products/hooks/useProducts.ts` | TanStack Query |
| `src/types/product.ts` | TypeScript types |

---

## Acceptance Criteria (PRD §19)

- [ ] User dapat tambah produk/layanan
- [ ] User dapat mengatur harga (jual & modal)
- [ ] User dapat mengatur stok (hanya produk, bukan layanan)
- [ ] Sistem dapat menandai stok rendah (stock ≤ minimum_stock)
- [ ] User dapat edit dan hapus produk
- [ ] Low stock badge tampil di product card
- [ ] Filter "Stok Rendah" bekerja
- [ ] Produk service tidak memiliki field stok
- [ ] Semua data di-scope per business_id
