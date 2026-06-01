# TASK-15 — AI Summary, Follow-up & Promo Features

> Fase: Phase 2 — AI MVP
> Dependensi: TASK-14
> Estimasi: 1–2 hari

---

## Tujuan

Extend AI assistant dengan fitur-fitur spesifik: dashboard AI summary auto-generated, follow-up message generator, promo idea generator, dan daily report AI summary.

---

## Scope

### 15.1 Dashboard AI Summary (auto-generated)

#### Backend
```http
GET /api/dashboard/ai-summary    ← AI-generated dashboard summary
```

Behaviour:
1. Ambil data today's metrics (from dashboard service)
2. Construct prompt: "Buatkan ringkasan bisnis hari ini dalam 2-3 kalimat..."
3. Call AI → generate summary
4. Cache result (Redis, 15 min TTL)
5. Return summary text

#### Output Example (PRD §11.3)
> "Hari ini ada 12 order dengan estimasi pendapatan Rp1.250.000. Ada 3 order belum dibayar dan 2 stok produk hampir habis."

#### Frontend
- AISummaryCard di dashboard menggunakan real AI summary
- Loading state: skeleton while AI generates
- Fallback: template-based summary jika AI gagal (fitur utama tetap jalan — PRD §12.3)

---

### 15.2 Follow-up Message Generator

#### Backend
```http
POST /api/ai/generate-follow-up
Body: { customer_id, order_id?, type: "payment" | "reorder" | "general" }
```

#### AI Context
- Customer info (name, phone, order history)
- Order info (if payment follow-up): order items, total, due date
- Business info: name, category

#### Output Types

**Payment Follow-up:**
> "Halo Kak Sinta, ini kami dari Rina Catering. Mau mengingatkan untuk pembayaran order nasi box tanggal 31 Mei sebesar Rp250.000. Jika sudah transfer, boleh kirim bukti pembayaran ya Kak. Terima kasih."

**Reorder Follow-up:**
> "Halo Kak Arif, sudah lama tidak order di Rina Catering. Minggu ini ada menu baru lho: Nasi Box Special. Mau pesan lagi Kak? Hubungi kami ya."

**After-purchase Follow-up:**
> "Halo Kak Dinda, terima kasih sudah order di Rina Catering. Semoga snack box-nya cocok ya. Kalau ada feedback, boleh langsung chat ke nomor ini. Terima kasih banyak!"

#### Frontend
- Modal/Sheet: tampilkan generated message
- Buttons: "Salin Pesan" (copy to clipboard), "Edit", "Tutup"
- Toast: "Pesan berhasil disalin. Tempel di WhatsApp."

---

### 15.3 Promo Idea Generator

#### Backend
```http
POST /api/ai/generate-promo-ideas
Body: { period: "this_week" | "this_month" }
```

#### AI Context
- Top products (sales data)
- Customer segments
- Seasonal context

#### Output Example (PRD §27.3)
> "Karena Paket Hemat paling sering dibeli minggu ini, kamu bisa membuat promo:
> 'Beli 5 Paket Hemat gratis 1 Es Teh untuk order sebelum jam 12 siang.'
> Promo ini cocok karena mendorong pembelian jumlah banyak dan tidak langsung menurunkan harga utama."

#### Frontend
- Page/modal: tampilkan 2-3 ide promo
- Each idea: title, description, reasoning
- Buttons: "Salin Ide", "Tanya Lebih Lanjut"

---

### 15.4 Daily Report AI Summary

#### Backend
```http
POST /api/ai/generate-daily-summary
Body: { date: "2026-05-31" }
```

Update `daily_reports.ai_summary` field.

#### Output Example (PRD §27.1)
> "Hari ini bisnis kamu mendapatkan 12 order dengan total pendapatan Rp1.450.000.
> Ada 3 order belum dibayar dengan total Rp375.000.
> Produk paling laku hari ini adalah Paket Hemat sebanyak 5 order.
> Stok Brownies Coklat tinggal 2, sedangkan rata-rata terjual 4 per hari. Sebaiknya restock hari ini.
> 
> Saran saya:
> 1. Follow-up 3 customer yang belum bayar.
> 2. Upload promo Paket Hemat karena sedang laku.
> 3. Restock Brownies Coklat sebelum sore."

---

### 15.5 AI Insight dalam Dashboard & Detail Pages

Integrasikan AI insight ke komponen yang sudah ada:

#### Dashboard
- AISummaryCard → real AI summary (bukan hardcoded)
- Metric cards → optional AI-generated trend text

#### Order Detail
- AI suggestion card: "Customer ini belum bayar 2 hari. Mau saya bantu buatkan pesan follow-up?"
- Action: "Buat Pesan" → trigger follow-up generator

#### Customer Detail
- AI insight: "Customer ini sudah 30 hari tidak order. Mau follow-up?"
- Product insight: "Produk ini marginnya rendah (9%). Pertimbangkan naikkan harga."

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `app/Services/AI/AISummaryService.php` | dashboard summary |
| `app/Services/AI/AIFollowUpService.php` | follow-up messages |
| `app/Services/AI/AIPromoService.php` | promo ideas |
| `app/Services/AI/AIDailyReportService.php` | daily report summary |
| `app/Http/Controllers/Api/AIController.php` | updated with new endpoints |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/ai/components/FollowUpMessageModal.tsx` | upgraded with AI |
| `src/features/ai/components/PromoIdeasPanel.tsx` | promo ideas display |
| `src/features/ai/components/AIInsightCard.tsx` | inline AI suggestions |
| `src/features/dashboard/components/AISummaryCard.tsx` | updated with real AI |

---

## Acceptance Criteria (PRD §19)

- [ ] Dashboard AI summary berisi data real bisnis
- [ ] AI follow-up draft bisa langsung dipakai (copy to WhatsApp)
- [ ] AI promo ideas relevan dengan data bisnis
- [ ] Daily report AI summary auto-generated
- [ ] AI insight tampil di order detail & customer detail
- [ ] AI tidak mengarang data yang tidak ada
- [ ] 80% jawaban AI relevan (PRD §20)
- [ ] 70% draft follow-up bisa langsung dipakai (PRD §20)
- [ ] Jika AI gagal, fitur utama tetap berjalan (PRD §12.3)
