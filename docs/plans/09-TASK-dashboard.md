# TASK-09 — Dashboard & Metrics

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-08
> Estimasi: 2 hari

---

## Tujuan

Implementasi dashboard utama yang menjawab pertanyaan: *"Hari ini bisnis saya gimana?"* — sesuai dengan mockup Stitch (mobile + desktop). Dashboard adalah screen paling penting di aplikasi.

---

## Scope

### 9.1 Backend

#### API Endpoints (PRD §15)
```http
GET /api/dashboard/summary    ← metrics + recent orders + reminders + low stock
```

#### Response Structure
```json
{
  "greeting": "Pagi, Bu Rina",
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
  "recent_orders": [ /* OrderResource[] */ ],
  "reminders": [ /* ReminderResource[] */ ],
  "low_stock_products": [ /* ProductResource[] */ ]
}
```

#### Greeting Logic
- 00:00–11:00 → "Pagi"
- 11:00–15:00 → "Siang"
- 15:00–18:00 → "Sore"
- 18:00–24:00 → "Malam"

---

### 9.2 Frontend — Mobile Dashboard

Referensi: [dashboard-mobile.png](file:///c:/laragon/www/opsmate-ai/docs/screens/dashboard-mobile.png)

#### Layout Order (sesuai mockup persis):

**1. Header (sticky)**
```
[Avatar foto] Pagi, Bu Rina
              OpsMate AI        [🔔]
```

**2. AI Summary Card (hero)**
- Gradient background: `linear-gradient(135deg, #CCFBF1 0%, #EDE9FE 100%)`
- Purple bot icon + "Ringkasan Pintar" title
- Summary text: "Hari ini ada **12 order** dengan estimasi omzet **Rp1.450.000**. Ada 3 order belum dibayar yang perlu dicek ya, Bu."
- Button: "Tanya AI" (purple bg, white text, sparkle icon)
- Decorative blur blob di kanan atas

**3. Quick Actions (horizontal scroll)**
- "Tambah Order" (icon: add_shopping_cart)
- "Tambah Customer" (icon: person_add)
- "Buat Invoice" (icon: description)
- Cards: white bg, border, rounded-2xl, horizontal scroll no-scrollbar

**4. Metric Cards (2-col grid)**
| Card | Icon | BG | Value | Trend |
| ---- | ---- | -- | ----- | ----- |
| Pendapatan | payments | primary-soft | Rp4.2M | +12% (green) |
| Stok Rendah | inventory_2 | ai-soft/10 | 18 Item | -2% (red) |
| Pending | pending_actions | orange-100 | 5 Order | — |
| Customer Baru | group | blue-100 | 24 | — |

Card layout: icon top-left, trend badge top-right, label muted, value bold h3

**5. Perlu Ditindaklanjuti (reminders)**
- Section header: "Perlu Ditindaklanjuti" + "Lihat Semua"
- Reminder cards:
  - Urgent: red icon bg + "URGENT" badge → "Kirim Tagihan: UD Jaya"
  - Warning: orange icon bg → "Restock: Beras Premium 5kg"
- Card: left icon (color-coded) + title + description

**6. Order Terbaru (recent orders)**
- Section header: "Order Terbaru" + "Lihat Laporan"
- Order cards:
  - Avatar (initials or photo) + name + item count + time
  - Right: amount + payment badge (LUNAS/PENDING)
  - Each card: white bg, border, rounded-2xl

**7. Bottom Navigation (fixed)**
- Home (active, teal, filled icon) | Orders | Add(+) | Reminder | AI

---

### 9.3 Frontend — Desktop Dashboard

Referensi: [dashboard-desktop.png](file:///c:/laragon/www/opsmate-ai/docs/screens/dashboard-desktop.png)

#### Layout (sesuai mockup):

**Sidebar** (handled by TASK-02 App Shell)

**Top Bar:**
```
Rina Catering                  [🔍 Cari order atau produk...]     [Bu Rina - Owner]
Pagi, Bu Rina
```

**Content Grid:**

**Row 1: AI Insight Card (full width)**
- Green/teal left accent icon → "AI INSIGHT" badge + "Baru saja diperbarui"
- Summary: "Hari ini ada 12 order dengan estimasi omzet **Rp1.450.000**. Ada 3 order belum dibayar dengan total Rp650.000. Produk **Paket Hemat** paling laku hari ini, dan stok **Brownies Coklat** hampir habis."
- Buttons: "Tanya AI" (primary green) + "Lihat Detail" (text link)

**Row 2: Metric Cards (4 columns)**
| Order Hari Ini | Omzet Hari Ini | Belum Bayar | Diproses |
| 12 (+12%) | Rp1.450k (+8%) | Rp650k (Penting) | 5 |

Each card: colored icon bg, value, trend, rounded card with pastel background

**Row 3: Two-column layout**

**Left (2/3): Order Terbaru**
- Table: Pelanggan (avatar+name), ID Order, Total, Pembayaran (badge), Status (badge)
- Header: "Order Terbaru" + "Lihat Semua" link
- Rows: clickable, badges inline

**Right (1/3): Sidebar panels**

**Panel 1: Perlu Ditindaklanjuti**
- Numbered list with urgency colors
- "12 Kirim Tagihan — Pelanggan belum bayar > 24 jam"
- "03 Konfirmasi Pickup — Order siap dikirim sore ini"

**Panel 2: Stok Menipis**
- Product image/icon + name + "Tersisa 2 Box"
- Button: "Atur Inventori"

---

### 9.4 Components

| Component | Keterangan |
| --------- | ---------- |
| `MetricCard.tsx` | icon, label, value, trend, bg color |
| `AISummaryCard.tsx` | gradient card with summary + CTAs |
| `QuickActionGrid.tsx` | horizontal scroll action buttons |
| `ReminderCard.tsx` | reminder with priority indicator |
| `OrderCard.tsx` | from TASK-07, reused here |
| `DashboardPage.tsx` | responsive: mobile/desktop layouts |

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `app/Http/Controllers/Api/DashboardController.php` | summary endpoint |
| `app/Services/Business/DashboardService.php` | aggregate metrics |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/dashboard/pages/DashboardPage.tsx` | main page |
| `src/features/dashboard/components/AISummaryCard.tsx` | AI hero card |
| `src/features/dashboard/components/MetricCard.tsx` | metric card |
| `src/features/dashboard/components/QuickActionGrid.tsx` | quick actions |
| `src/features/dashboard/components/RecentOrders.tsx` | order list/table |
| `src/features/dashboard/components/ReminderSection.tsx` | reminders |
| `src/features/dashboard/components/LowStockPanel.tsx` | low stock (desktop) |
| `src/features/dashboard/hooks/useDashboard.ts` | TanStack Query |

---

## Acceptance Criteria (PRD §19 + DESIGN §14.3)

- [ ] Dashboard menampilkan ringkasan operasional harian
- [ ] AI Summary Card tampil di top dengan gradient soft
- [ ] Metric cards: order hari ini, omzet, belum bayar, diproses
- [ ] Quick actions: Tambah Order, Customer, Invoice, Tanya AI
- [ ] Reminder section: "Perlu Ditindaklanjuti" dengan priority indicators
- [ ] Recent orders: cards (mobile) / table (desktop)
- [ ] Low stock alert tampil
- [ ] Greeting sesuai waktu hari
- [ ] Mobile layout sesuai mockup dashboard-mobile.png
- [ ] Desktop layout sesuai mockup dashboard-desktop.png
- [ ] Dashboard load < 3 detik (PRD §12.1)
- [ ] Dalam 5 detik pertama, owner tahu kondisi bisnis hari ini (DESIGN §28)
