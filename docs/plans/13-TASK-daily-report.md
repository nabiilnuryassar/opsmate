# TASK-13 — Daily Report

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-09
> Estimasi: 1 hari

---

## Tujuan

Implementasi laporan harian otomatis yang merangkum performa bisnis hari ini: total order, omzet, belum bayar, produk terlaris, stok rendah, customer baru, dan rekomendasi tindakan.

---

## Scope

### 13.1 Backend

#### Database Migration: `daily_reports`
```
daily_reports
├── id (bigint, PK)
├── business_id (FK → businesses.id)
├── report_date (date)
├── total_orders (integer)
├── total_revenue (decimal 12,2)
├── total_unpaid (decimal 12,2)
├── total_completed (integer)
├── new_customers (integer)
├── top_products_json (json) ← [{ name, quantity, revenue }]
├── low_stock_json (json) ← [{ name, stock, minimum_stock }]
├── ai_summary (text, nullable) ← AI-generated in TASK-15
├── created_at
└── updated_at
```

#### API Endpoints (PRD §15)
```http
GET /api/reports/daily             ← today's report
GET /api/reports/daily/{date}      ← specific date
GET /api/reports/daily/{date}/pdf  ← export PDF
```

#### Auto Report Generation (Scheduler)
- Run daily at 23:59 (or on-demand)
- Aggregate data for the day
- Create daily_reports record
- Trigger AI summary generation (TASK-15)

#### Report Data Aggregation
```sql
-- Total orders & revenue
SELECT COUNT(*), SUM(total) FROM orders 
WHERE business_id = ? AND order_date = ?

-- Unpaid
SELECT SUM(total) FROM orders 
WHERE business_id = ? AND payment_status = 'unpaid' AND order_date = ?

-- Top products
SELECT product_name, SUM(quantity), SUM(total) FROM order_items 
JOIN orders ON ... WHERE order_date = ? 
GROUP BY product_name ORDER BY SUM(quantity) DESC LIMIT 5

-- Low stock
SELECT name, stock, minimum_stock FROM products 
WHERE stock <= minimum_stock AND stock IS NOT NULL

-- New customers
SELECT COUNT(*) FROM customers WHERE DATE(created_at) = ?
```

---

### 13.2 Frontend — Daily Report Page

Halaman: `/reports/daily`

Referensi: DESIGN §14.9

#### Layout

**1. AI Summary (top)**
- Card with AI-generated summary text
- (Empty state jika AI belum di-setup: template-based summary)

**2. Metrics Grid**
- Total Order hari ini
- Total Omzet
- Total Belum Bayar
- Order Selesai
- Customer Baru

**3. Produk Terlaris**
- List: product name, quantity, revenue
- Simple bar or list format

**4. Stok Rendah**
- List: product name, current stock, minimum stock

**5. Rekomendasi Tindakan**
- AI-generated action items (TASK-15)
- Fallback: system-generated based on data:
  - "Ada {n} order belum dibayar, follow-up segera."
  - "Stok {product} hampir habis, restock sebelum sore."

**6. Actions**
- Export PDF
- Copy Summary (clipboard)
- Tanya AI (navigate to AI assistant)

**7. Date Navigation**
- Date picker to view past reports
- Prev / Next day arrows

---

### 13.3 PDF Export

- Template: clean report with business branding
- Sections mirror the UI: metrics, top products, low stock, summary
- Use DomPDF blade template

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_daily_reports_table.php` | migration |
| `app/Models/DailyReport.php` | model |
| `app/Http/Controllers/Api/ReportController.php` | endpoints |
| `app/Services/Business/ReportService.php` | aggregation logic |
| `app/Console/Commands/GenerateDailyReport.php` | scheduled command |
| `resources/views/pdf/daily-report.blade.php` | PDF template |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/reports/pages/DailyReportPage.tsx` | report page |
| `src/features/reports/components/ReportMetrics.tsx` | metric cards |
| `src/features/reports/components/TopProducts.tsx` | product ranking |
| `src/features/reports/components/ReportActions.tsx` | export/copy buttons |
| `src/features/reports/hooks/useDailyReport.ts` | TanStack Query |

---

## Acceptance Criteria (PRD §19)

- [ ] Sistem menampilkan laporan harian
- [ ] Laporan berisi: total order, revenue, unpaid, top product, low stock
- [ ] User dapat lihat laporan hari ini dan hari-hari sebelumnya
- [ ] User dapat export PDF laporan
- [ ] User dapat copy summary ke clipboard
- [ ] Laporan auto-generated setiap hari
- [ ] AI summary slot tersedia (diisi di TASK-15)
- [ ] Export PDF maksimal 10 detik
