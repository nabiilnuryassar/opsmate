# TASK-12 — Stock Tracking & Low Stock Alert

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-06, TASK-07
> Estimasi: 1 hari

---

## Tujuan

Implementasi stock tracking: stok otomatis berkurang saat order, update stok manual, riwayat pergerakan stok, dan alert produk stok rendah.

---

## Scope

### 12.1 Backend

#### Database Migration: `stock_movements`
```
stock_movements
├── id (bigint, PK)
├── business_id (FK → businesses.id)
├── product_id (FK → products.id)
├── type (enum: in, out, adjustment)
├── quantity (integer) ← positive for in, negative for out
├── reference_type (string, nullable) ← "order", "manual"
├── reference_id (bigint, nullable) ← order_id if from order
├── notes (text, nullable)
├── created_by (FK → users.id)
├── created_at
└── updated_at
```

#### Auto Stock Reduction
Saat order dibuat atau status berubah ke "completed":
1. Loop setiap order_item
2. Jika product.type = "product" dan product.stock IS NOT NULL:
   - Create stock_movement (type: out, qty: -item.quantity)
   - Update product.stock -= item.quantity
3. Jika order dibatalkan (cancelled): reverse stock (type: in)

#### API Endpoints
```http
GET    /api/products/{id}/stock-movements   ← stock movement history
POST   /api/products/{id}/stock-adjustment  ← manual adjustment
GET    /api/products/low-stock              ← already in TASK-06
```

#### Manual Stock Adjustment
```json
POST /api/products/{id}/stock-adjustment
{
  "type": "in" | "out" | "adjustment",
  "quantity": 10,
  "notes": "Restock dari supplier"
}
```

Behaviour:
- `in`: add to stock
- `out`: subtract from stock
- `adjustment`: set stock to absolute value

---

### 12.2 Frontend — Stock Management

#### In Product Detail Page
- Current stock display: "{stock} {unit} tersedia"
- Minimum stock info: "Minimum: {min_stock} {unit}"
- Low stock warning badge: "⚠ Stok Hampir Habis" (if stock ≤ minimum)
- Button: "Sesuaikan Stok" → modal:
  - Type: Masuk / Keluar / Koreksi
  - Quantity
  - Notes
  - CTA: "Simpan"

#### Stock Movement History
- List of movements with:
  - Date
  - Type badge (Masuk/Keluar/Koreksi)
  - Quantity (+5 atau -3)
  - Notes
  - Reference (link to order if applicable)

#### In Dashboard — Low Stock Panel (desktop)
- Referensi: mockup desktop, bottom-right panel "Stok Menipis"
- Product name + "Tersisa X {unit}"
- Button: "Atur Inventori"

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_stock_movements_table.php` | migration |
| `app/Models/StockMovement.php` | model |
| `app/Services/Business/StockService.php` | auto-reduce, adjustment logic |
| `app/Listeners/OrderCompletedListener.php` | auto stock reduction on order complete |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/products/components/StockAdjustmentModal.tsx` | adjustment form |
| `src/features/products/components/StockMovementHistory.tsx` | movement list |
| `src/features/dashboard/components/LowStockPanel.tsx` | dashboard panel |

---

## Acceptance Criteria (PRD §19)

- [ ] User dapat melihat stok produk
- [ ] User dapat update stok manual (masuk/keluar/koreksi)
- [ ] Stok otomatis berkurang saat order completed
- [ ] Stok otomatis kembali saat order cancelled
- [ ] User dapat melihat produk stok rendah
- [ ] Low stock warning tampil di product card & dashboard
- [ ] Stock movement history tersedia per produk
- [ ] Service (type=service) tidak memiliki stok tracking
