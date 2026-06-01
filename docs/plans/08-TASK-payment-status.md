# TASK-08 — Payment & Order Status Tracking

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-07
> Estimasi: 1 hari

---

## Tujuan

Implementasi status tracking yang jelas untuk payment dan order, termasuk status transitions, visual badges, dan activity log.

---

## Scope

### 8.1 Status Definitions

#### Payment Status (PRD §11.6, DESIGN §12.5)

| Status   | Label       | Color   | Badge BG   |
| -------- | ----------- | ------- | ---------- |
| unpaid   | Belum Bayar | danger  | #FEE2E2    |
| partial  | DP          | warning | #FEF3C7    |
| paid     | Lunas       | success | #D1FAE5    |
| refunded | Refund      | neutral | #F1F5F9    |

#### Order Status (PRD §11.6, DESIGN §12.5)

| Status     | Label        | Color   | Badge BG   |
| ---------- | ------------ | ------- | ---------- |
| new        | Baru         | info    | #DBEAFE    |
| confirmed  | Dikonfirmasi | primary | #CCFBF1    |
| processing | Diproses     | warning | #FEF3C7    |
| ready      | Siap         | ai      | #EDE9FE    |
| completed  | Selesai      | success | #D1FAE5    |
| delivered  | Dikirim      | success | #D1FAE5    |
| cancelled  | Batal        | neutral | #F1F5F9    |

### 8.2 Backend — Status Transition Rules

#### Order Status Flow (valid transitions)
```
new → confirmed → processing → ready → completed → delivered
                                    └→ cancelled (dari any state kecuali delivered)
```

#### Payment Status Flow
```
unpaid → partial → paid
unpaid → paid (direct)
paid → refunded
```

#### API (already defined in TASK-07)
```http
PATCH  /api/orders/{id}/status              ← { status: "processing" }
PATCH  /api/orders/{id}/payment-status      ← { payment_status: "paid" }
```

#### Validation
- Status transition harus valid (reject invalid transitions)
- Return error: *"Status tidak bisa diubah dari 'Selesai' ke 'Baru'."*

### 8.3 Backend — Activity Log (Audit)

#### Database Migration: `order_activities` (optional, PRD §12.2)
```
order_activities
├── id (bigint, PK)
├── order_id (FK → orders.id)
├── user_id (FK → users.id)
├── action (string) ← "status_changed", "payment_updated", "item_added"
├── from_value (string, nullable)
├── to_value (string, nullable)
├── notes (text, nullable)
├── created_at
```

Setiap perubahan status → auto-log ke order_activities.

### 8.4 Frontend — Status Update UI

#### In Order Detail Page
- Order status: segmented control atau dropdown
  - Tampilkan hanya transisi valid
  - Confirm dialog sebelum update
- Payment status: segmented control
  - Visual change langsung (badge update)

#### In Order Card (list)
- Badges tampil jelas (DESIGN §12.5):
  - Badge style: height 24px, pill shape, 12px font, 600 weight
  - Unpaid: visually noticeable (left border red atau badge prominent)

#### Quick Status Actions
- Di order list, bisa swipe atau quick-action untuk:
  - "Tandai Lunas" (if unpaid)
  - "Ubah ke Diproses" (if new/confirmed)
  - "Tandai Selesai" (if processing/ready)

### 8.5 Frontend — Activity Timeline

Di order detail page, tampilkan timeline aktivitas:
```
[✓] Order dibuat — 31 Mei 2026, 10:30
[✓] Status diubah: Baru → Diproses — 31 Mei 2026, 11:15
[○] Pembayaran: Belum Bayar → DP — (pending)
```

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_order_activities_table.php` | migration |
| `app/Models/OrderActivity.php` | model |
| `app/Services/Business/OrderStatusService.php` | transition validation |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/orders/components/StatusControl.tsx` | segmented status picker |
| `src/features/orders/components/PaymentStatusControl.tsx` | payment status picker |
| `src/features/orders/components/ActivityTimeline.tsx` | activity log display |
| `src/components/shared/StatusBadge.tsx` | updated with all statuses |

---

## Acceptance Criteria

- [ ] User dapat mengubah status order (valid transitions only)
- [ ] User dapat mengubah status pembayaran
- [ ] Invalid transitions di-reject dengan pesan jelas
- [ ] Badges tampil sesuai color mapping DESIGN.md
- [ ] Activity log tercatat untuk setiap perubahan status
- [ ] Quick actions tersedia di order list
- [ ] Timeline aktivitas tampil di order detail
