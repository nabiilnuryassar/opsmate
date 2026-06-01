# TASK-16 — Polish, Testing & Pilot Preparation

> Fase: Phase 3 — Polish & Pilot
> Dependensi: ALL previous tasks
> Estimasi: 3–5 hari

---

## Tujuan

Final polish, testing menyeluruh, seed data untuk demo, dan persiapan pilot dengan 5–10 UMKM.

---

## Scope

### 16.1 UX Polish

#### Accessibility (DESIGN §17)
- [ ] Text contrast minimum WCAG AA
- [ ] All buttons have visible focus state (`outline: 2px solid #14b8a6; outline-offset: 2px`)
- [ ] Touch target minimum 44px
- [ ] Status not only represented by color (text label + icon)
- [ ] Icon must have label or aria-label
- [ ] Form error must be readable
- [ ] Loading state clear (skeleton)
- [ ] No text below 12px

#### Animations (DESIGN §16)
- [ ] Page transitions smooth (200ms)
- [ ] Bottom sheet animation
- [ ] Modal open/close animation
- [ ] AI typing indicator animation
- [ ] Toast notification animation
- [ ] Skeleton loading states
- [ ] Status update micro-animation

#### Empty States (DESIGN §12.10)
Semua halaman list harus punya empty state yang ramah:
- [ ] Orders: "Belum ada order. Mulai catat order pertama supaya laporan harian bisa dibuat otomatis."
- [ ] Customers: "Belum ada customer. Tambah customer pertama supaya order bisa dicatat."
- [ ] Products: "Belum ada produk. Tambah produk pertama supaya bisa mulai catat order."
- [ ] Invoices: "Belum ada invoice. Buat invoice dari order yang sudah selesai."
- [ ] Reminders: "Semua sudah beres! Tidak ada yang perlu ditindaklanjuti."
- [ ] Daily Report: "Belum ada data untuk hari ini."
- [ ] AI Chat: "Halo! Saya AI Assistant OpsMate. Silakan tanya apa saja tentang bisnis kamu."

#### Responsive Verification
- [ ] Test semua pages di viewport 375px (iPhone SE)
- [ ] Test semua pages di viewport 390px (iPhone 14)
- [ ] Test semua pages di viewport 768px (iPad)
- [ ] Test semua pages di viewport 1024px (Desktop small)
- [ ] Test semua pages di viewport 1440px (Desktop)
- [ ] Bottom nav hide di ≥768px, sidebar show di ≥1024px

#### UX Copy Review
- [ ] All labels in Bahasa Indonesia
- [ ] All error messages friendly & clear
- [ ] All success messages positive
- [ ] No English technical terms exposed to user

---

### 16.2 Testing

#### Unit Tests (Backend)
- [ ] Auth: register, login, logout, me
- [ ] Business: create, update, onboarding guard
- [ ] Customer: CRUD, search, filter
- [ ] Product: CRUD, low stock query
- [ ] Order: CRUD, status transition validation, auto number
- [ ] Invoice: generate from order, status
- [ ] Reminder: auto-generation, mark done, snooze
- [ ] Stock: auto-reduce, manual adjustment
- [ ] Dashboard: summary aggregation
- [ ] Daily Report: aggregation
- [ ] AI: tool functions, message storage

#### Integration Tests (Backend)
- [ ] Full order flow: create customer → create product → create order → update status → create invoice
- [ ] Stock flow: create product → create order → complete → verify stock reduced
- [ ] Reminder flow: create unpaid order → run scheduler → verify reminder created

#### E2E Tests (Frontend — optional for MVP)
- [ ] Login flow
- [ ] Onboarding flow
- [ ] Create order flow
- [ ] Dashboard loads correctly

---

### 16.3 Seed Data untuk Demo

Create `database/seeders/DemoSeeder.php`:

- Business: "Rina Catering" (berdasarkan DESIGN §21)
- 5 Customers: Sinta Permata, Budi Santoso, Maya Lestari, Arif Rahman, Dinda Putri
- 5 Products: Nasi Box Ayam (Rp25k), Paket Hemat (Rp18k), Brownies Coklat (Rp45k, stok 2), Snack Box (Rp15k), Es Teh Manis (Rp5k)
- 5 Orders: sesuai DESIGN §21 dummy data
- 3 Reminders: unpaid, low stock, follow-up
- 1 Daily Report: today
- 5 AI Messages: sample conversation

---

### 16.4 Performance Verification (PRD §12.1)

- [ ] Dashboard load < 3 detik
- [ ] Order list load < 2 detik (1.000 data)
- [ ] AI response < 10 detik
- [ ] Export PDF < 10 detik
- [ ] All API responses include proper pagination

---

### 16.5 Security Verification (PRD §12.2)

- [ ] Password hashed (bcrypt)
- [ ] Data bisnis terisolasi antar user (business_id scope)
- [ ] Staff hanya bisa akses bisnis yang diundang
- [ ] API menggunakan Sanctum authentication
- [ ] Input validation di semua endpoint
- [ ] Rate limit untuk AI endpoint
- [ ] No PII/secrets in logs
- [ ] CORS configured correctly

---

### 16.6 Deployment Preparation

- [ ] Docker production setup (Dockerfile, docker-compose.prod.yml)
- [ ] Nginx config
- [ ] SSL setup
- [ ] Environment variables documented
- [ ] Database backup strategy
- [ ] Queue worker supervisor config
- [ ] Scheduler cron setup

---

### 16.7 Pilot Preparation

- [ ] Create pilot user accounts (5–10 UMKM)
- [ ] Prepare onboarding guide (simple PDF or page)
- [ ] Prepare feedback form
- [ ] Setup monitoring & error tracking (Sentry or similar)
- [ ] Sales script ready (PRD §22.3)

---

## Output Files

| File | Keterangan |
| ---- | ---------- |
| `database/seeders/DemoSeeder.php` | demo data |
| `tests/Feature/*.php` | backend tests |
| `docs/RUNBOOK.md` | updated with deploy & test steps |
| `docker/Dockerfile` | production container |
| `docker/docker-compose.prod.yml` | production compose |
| `docker/nginx.conf` | nginx config |

---

## Acceptance Criteria

- [ ] All empty states implemented
- [ ] All pages responsive (mobile + desktop)
- [ ] All error/success messages in Bahasa Indonesia
- [ ] Seed data loads correctly for demo
- [ ] Backend unit tests pass (≥80% coverage for services)
- [ ] Performance targets met
- [ ] Security checklist passed
- [ ] Deployment config ready
- [ ] Pilot onboarding materials ready
