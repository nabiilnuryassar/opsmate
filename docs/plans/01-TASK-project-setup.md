# TASK-01 — Project Setup & Scaffolding

> Fase: Phase 0 — Foundation
> Dependensi: Tidak ada
> Estimasi: 1 hari

---

## Tujuan

Setup project frontend (React + Vite) dan backend (Laravel 12) beserta tooling, konfigurasi, dan koneksi antar keduanya.

---

## Scope

### 1.1 Frontend Setup

- Init project React + TypeScript menggunakan Vite
- Install & konfigurasi dependencies utama:
  - `tailwindcss` (v4) + PostCSS
  - `@shadcn/ui` components
  - `@tanstack/react-query` untuk data fetching
  - `zustand` untuk state management
  - `react-hook-form` + `zod` untuk form validation
  - `react-router-dom` untuk routing
  - `lucide-react` untuk icons
  - `recharts` untuk charts
  - `framer-motion` untuk animations
  - `axios` untuk HTTP client
- Setup folder structure:
  ```
  src/
  ├── assets/
  ├── components/
  │   ├── ui/          ← shadcn components
  │   ├── layout/      ← AppShell, Sidebar, BottomNav
  │   ├── cards/       ← OrderCard, MetricCard, etc.
  │   └── shared/      ← reusable: Badge, EmptyState
  ├── features/
  │   ├── auth/
  │   ├── dashboard/
  │   ├── orders/
  │   ├── customers/
  │   ├── products/
  │   ├── invoices/
  │   ├── reminders/
  │   ├── reports/
  │   ├── ai/
  │   └── settings/
  ├── hooks/
  ├── lib/
  │   ├── api.ts       ← axios instance
  │   ├── utils.ts
  │   └── constants.ts
  ├── stores/
  ├── types/
  ├── App.tsx
  └── main.tsx
  ```
- Setup `.env` untuk API base URL
- Setup ESLint + Prettier

### 1.2 Backend Setup

- Init Laravel 12 project
- Konfigurasi:
  - PostgreSQL connection
  - Redis connection
  - Laravel Sanctum untuk API auth
  - CORS untuk frontend
  - Queue worker setup
  - Scheduler setup
- Setup folder structure (Laravel convention + enhancements):
  ```
  app/
  ├── Models/
  ├── Http/
  │   ├── Controllers/Api/
  │   ├── Requests/
  │   ├── Resources/
  │   └── Middleware/
  ├── Services/
  │   ├── AI/
  │   └── Business/
  ├── Enums/
  └── Policies/
  ```
- Setup `.env.example` dengan semua config keys

### 1.3 DevOps Dasar

- Docker Compose untuk development:
  - PostgreSQL 16
  - Redis 7
  - Mailpit (email testing)
- Setup `Makefile` atau scripts untuk:
  - `dev:frontend` — run Vite dev server
  - `dev:backend` — run Laravel artisan serve
  - `dev:all` — run both
  - `db:migrate` — run migrations
  - `db:seed` — run seeders

---

## Output Files

| Tipe | File |
| ---- | ---- |
| Frontend | `frontend/package.json`, `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json` |
| Backend | `backend/composer.json`, `.env.example`, `config/cors.php`, `config/sanctum.php` |
| DevOps | `docker-compose.yml`, `Makefile` |
| Docs | `docs/RUNBOOK.md` (updated) |

---

## Acceptance Criteria

- [ ] `npm run dev` di folder frontend berhasil — blank React app berjalan
- [ ] `php artisan serve` di folder backend berhasil
- [ ] Database PostgreSQL terkoneksi
- [ ] Redis terkoneksi
- [ ] Frontend bisa hit backend API (CORS OK)
- [ ] Sanctum middleware terkonfigurasi
- [ ] Docker compose up berhasil untuk PostgreSQL + Redis

---

## Notes

- Font **Plus Jakarta Sans** dan **Inter** wajib dimuat dari Google Fonts (DESIGN §6)
- Lucide Icons sebagai icon library utama (DESIGN §15)
- Tailwind theme tokens harus sesuai DESIGN §19 (dikerjakan di TASK-02)
