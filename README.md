<div align="center">

# OpsMate

**Ops Manager untuk UMKM & bisnis jasa kecil.**

Catat order, kelola customer & stok, buat invoice, kirim reminder, dan dapatkan ringkasan bisnis harian dari AI — semua dalam satu aplikasi yang ringan dan mobile-first.

![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1)
![Tests](https://img.shields.io/badge/tests-109%20backend%20%2B%2055%20frontend-success)

</div>

---

## Apa ini?

Banyak UMKM gagal bukan karena produknya jelek, tapi karena **operasionalnya berantakan** — order lupa dicatat, pembayaran tidak terpantau, stok habis mendadak, tidak ada laporan harian.

OpsMate membantu owner bisnis kecil supaya bisnisnya **lebih rapi, tidak ada yang terlewat, dan tahu kondisi bisnis setiap hari**. Dibangun untuk yang masih mengandalkan WhatsApp, catatan manual, atau Excel.

## Fitur

- 🔐 **Autentikasi** — register, login, multi-tenant (tiap bisnis terisolasi total)
- 🏪 **Profil bisnis & onboarding** 3 langkah
- 👥 **Customer** — CRUD, pencarian, riwayat order, tipe (Baru/Langganan/VIP/Tidak Aktif)
- 📦 **Produk & layanan** — harga, stok, margin, alert stok rendah
- 🧾 **Order** — entri cepat (<1 menit), nomor otomatis, total dihitung server, snapshot harga
- 🔄 **State machine status** order & pembayaran (transisi valid saja, dengan audit log)
- 📊 **Dashboard** — metrik harian, omzet, belum bayar, stok menipis
- 🧮 **Invoice** — generate dari order, PDF, teks WhatsApp
- ⏰ **Reminder otomatis** — belum bayar, jatuh tempo, stok rendah, customer tidak aktif
- 📈 **Stok** — auto-kurang saat order seles, riwayat pergerakan
- 📅 **Laporan harian** otomatis + export PDF
- 🤖 ** Assistant** — tanya kondisi bisnis, draft follow-up, ide promo — **berbasis data asli, tidak mengarang**

## Tech Stack

| Layer | Teknologi |
| ----- | --------- |
| Frontend | React 19, TypeScript, Vite, Tlwind CSS v4, TanStack Query, Zustand, React Hook Form + Zod, React Router, Recharts |
| Backend | Laravel 13 (API-only), Sanctum, PHP 8.4, DomPDF |
| Data | PostgreSQL 16, Redis 7 (cache/session/queue/rate-limit) |
| AI | OpenAI-compatible API via controlled tools + **fallback deterministik** (jalan tanpa API key) |
| Infra | Docker Compose (dev & prod), nginx + php-fpm (prod) |

## Quick Start

> Prasyarat: **Docker** + **Docker Compose**, dan **Node.js 20+** (frontend jalan native saat dev).
> Backend, PostgreSQL, dan Redis semuanya jalan di Docker — host tidak perlu PHP/pgsql.

```bash
# 1. Clone
git clone <repo-url> opsmate-ai && cd opsmate-ai

# 2. Siapkan env backend
cp backend/.env.example backend/.env

# 3. Build + jalankan stack (backend, postgres, redis, queue, frontend)
make up

# 4. Migrasi + data demo
make fresh

# 5. Buka aplikasi
#    Frontend : http://localhost:5174
#    API      : http://localhost:8000
```

Login demo (setelah `make fresh`):

```
Email    : rina@opsmate.test
Password : password
```

### Perintah berguna

```bash
make up            # nyalakan seluruh stack
make down          # matikan
make ps            # status container
make migrate       # jalankan migrasi
make fresh         # reset DB + seed data demo
make test-backend  # test backend (Pest/PHPUnit)
make logs          # tail log backend
```

Frontend test & build:

```bash
cd frontend
npx vitest run     # 55 test
npm run build      # typecheck + build produksi
```

## Struktur Proyek

```
opsmate-ai/
├── backend/            # Laravel 13 API (Sanctum, services, enums, tests)
├── frontend/           # React + TS + Vite SPA (feature-first)
├── docker/             # konfigurasi produksi (compose, nginx)
├── docs/               # dokumentasi (lihat di bawah)
├── docker-compose.yml  # stack dev
├── Makefile            # shortcut dev
└── AGENTS.md           # konvensi kontributor & AI agent
```

## Dokumentasi

| Dokumen | Untuk |
| ------- | ----- |
| [docs/GUIDE.md](docs/GUIDE.md) | **Panduan pengguna** (owner & staff) |
| [docs/API.md](docs/API.md) | **Referensi REST API** lengkap + contoh payload |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | **Arsitektur**, model data, playbook scaling |
| [docs/RUNBOOK.md](docs/RUNBOOK.md) | **Setup & deploy** produksi |
| [docs/README.md](docs/README.md) | Indeks seluruh dokumentasi |

## Deployment

Manifest produksi ada di `docker/` (php-fpm + opcache backend, SPA di-build & di-serve nginx via FastCGI):

```bash
cp backend/.env.production backend/.env   # isi nilai REQUIRED
export DB_PASSWORD=your-strong-password
docker compose -f docker/docker-compose.prod.yml up -d --build
```

Detail lengkap (TLS, scheduler, queue) di [docs/RUNBOOK.md](docs/RUNBOOK.md).

## Testing

- **Backend:** 109 test (tiap fitur menguji happy path, auth, isolasi tenant, validasi).
- **Frontend:** 55 test (komponen + logika).

```bash
make test-backend
cd frontend && npx vitest run
```

## Kontribusi

1. Baca [`AGENTS.md`](AGENTS.md) — konvensi wajib (struktur, aturan multi-tenant, definition of done).
2. Setiap tabel domain baru **wajib** `business_id` + query scope + test isolasi tenant.
3. Logika bisnis di service layer, validasi di FormRequest, response lewat Resource.
4. Tambahkan test perilaku untuk perubahan, jalankan gate sebelum PR.

## Status

MVP lengkap (16 modul: auth → AI assistant). Siap untuk **pilot**. Sebelum produksi skala besar, lihat catatan operasional (TLS, backup DB, error tracking) di [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §4.

## Lisensi

Belum ditetapkan. Untuk rilis open-source, tambahkan file `LICENSE` (rekomendasi: **MIT**) lalu perbarui bagian ini.
