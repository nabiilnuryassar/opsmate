# TASK-11 — Reminder & Follow-up System

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-08
> Estimasi: 1–2 hari

---

## Tujuan

Implementasi sistem reminder otomatis untuk order belum bayar, invoice overdue, stok rendah, dan customer inactive. User bisa mark done, snooze, dan generate pesan follow-up.

---

## Scope

### 11.1 Backend

#### Database Migration: `reminders`
```
reminders
├── id (bigint, PK)
├── business_id (FK → businesses.id)
├── related_type (string) ← "order", "invoice", "product", "customer"
├── related_id (bigint)
├── title (string)
├── description (text, nullable)
├── type (enum: unpaid_order, overdue_invoice, low_stock, inactive_customer, unfinished_order, follow_up)
├── status (enum: pending, done, snoozed)
├── priority (enum: urgent, today, later)
├── due_at (datetime, nullable)
├── completed_at (datetime, nullable)
├── snoozed_until (datetime, nullable)
├── created_at
└── updated_at
```

#### API Endpoints (PRD §15)
```http
GET    /api/reminders                           ← list, grouped by priority
PATCH  /api/reminders/{id}/done                 ← mark as done
PATCH  /api/reminders/{id}/snooze               ← snooze (body: { until: datetime })
POST   /api/reminders/{id}/generate-message     ← AI follow-up message
```

#### Automatic Reminder Generation (Laravel Scheduler)

Run daily/hourly to auto-create reminders:

1. **Unpaid Order** — orders where payment_status = unpaid AND order_date < today
2. **Overdue Invoice** — invoices where due_date < today AND status != paid
3. **Low Stock** — products where stock ≤ minimum_stock
4. **Unfinished Order** — orders where status NOT IN (completed, delivered, cancelled) AND order_date < today - 2 days
5. **Inactive Customer** — customers where last_order_at < today - 30 days

#### Priority Logic
- **Urgent**: overdue > 3 days, jatuh tempo hari ini
- **Today**: due today, new reminders
- **Later**: everything else

---

### 11.2 Frontend — Reminder Page

Halaman: `/reminders`

Referensi: DESIGN §14.7

#### Layout (grouped by priority)

**Urgent Section** (left border: red)
```
Sinta belum bayar
Invoice ORD-0012 sebesar Rp250.000 belum dibayar.
[Jatuh tempo hari ini]
Actions: [Buat Pesan] [Tandai Selesai]
```

**Hari Ini Section** (left border: warning/orange)
```
Order belum selesai
ORD-0010 untuk Maya Lestari sudah 2 hari belum diproses.
Actions: [Lihat Order] [Tunda]
```

**Nanti Section** (left border: neutral)
```
Customer lama belum order
Arif Rahman belum order sejak 30 hari lalu.
Actions: [Follow-up] [Tandai Selesai]
```

#### Reminder Card Component (DESIGN §12.9)
- Title
- Description
- Type badge
- Due time
- Related customer/order (clickable)
- Action buttons: Buat Pesan, Tandai Selesai, Tunda
- Priority visual: left border color (red/orange/neutral)

---

### 11.3 Follow-up Message Generation

Saat user klik "Buat Pesan" → hit `POST /api/reminders/{id}/generate-message`:
- AI generates WhatsApp-ready message
- Display in modal/sheet
- User can: Copy to clipboard, Edit message, Close
- Contoh output (PRD §10.4):
  > "Halo Kak Sinta, ini kami dari Rina Catering. Mau mengingatkan untuk pembayaran order nasi box tanggal 31 Mei. Jika sudah transfer, boleh kirim bukti pembayaran ya Kak. Terima kasih."

(Full AI integration in TASK-14/15, but basic template-based generation here)

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_reminders_table.php` | migration |
| `app/Models/Reminder.php` | model |
| `app/Enums/ReminderType.php` | enum |
| `app/Enums/ReminderStatus.php` | enum |
| `app/Enums/ReminderPriority.php` | enum |
| `app/Http/Controllers/Api/ReminderController.php` | CRUD |
| `app/Services/Business/ReminderService.php` | auto-generation logic |
| `app/Console/Commands/GenerateReminders.php` | scheduled command |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/reminders/pages/ReminderListPage.tsx` | list, grouped |
| `src/features/reminders/components/ReminderCard.tsx` | card |
| `src/features/reminders/components/FollowUpMessageModal.tsx` | message modal |
| `src/features/reminders/hooks/useReminders.ts` | TanStack Query |

---

## Acceptance Criteria (PRD §19)

- [ ] Sistem membuat reminder untuk order belum bayar
- [ ] Sistem membuat reminder untuk stok rendah
- [ ] Sistem membuat reminder untuk invoice overdue
- [ ] User dapat melihat daftar reminder (grouped by priority)
- [ ] User dapat menandai reminder selesai
- [ ] User dapat snooze reminder
- [ ] User dapat generate pesan follow-up (template-based, AI-enhanced in TASK-15)
- [ ] Reminder card menampilkan priority visual (border color)
- [ ] Pesan follow-up bisa di-copy ke clipboard
