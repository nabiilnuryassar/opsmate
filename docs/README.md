# OpsMate AI — Dokumentasi

AI Ops Manager untuk UMKM. Indeks seluruh dokumentasi proyek.

## Mulai di sini

| Dokumen | Untuk siapa | Isi |
| ------- | ----------- | --- |
| [GUIDE.md](GUIDE.md) | Owner & staff UMKM | Panduan pakai aplikasi: onboarding, order, invoice, reminder, laporan, AI, FAQ |
| [API.md](API.md) | Integrator / frontend dev | Referensi lengkap REST API: auth, konvensi, enum, tiap endpoint + contoh payload |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Engineer / maintainer | Arsitektur sistem, model data, playbook stabilitas & scaling |
| [RUNBOOK.md](RUNBOOK.md) | DevOps | Setup lokal, testing, deploy produksi (Docker + nginx + php-fpm) |

## Referensi

| Dokumen | Isi |
| ------- | --- |
| [refs/PRD-MVP-Ops.md](refs/PRD-MVP-Ops.md) | Product Requirements & lingkup MVP (sumber asli) |
| [refs/DESIGN-Ops.md](refs/DESIGN-Ops.md) | Design system & spesifikasi UI/UX |
| [plans/00-OVERVIEW.md](plans/00-OVERVIEW.md) | Rencana implementasi modular (16 task) |
| [screens/](screens/) | Mockup UI (PNG + HTML) |

## Riwayat

| Dokumen | Isi |
| ------- | --- |
| [CHANGELOG.md](CHANGELOG.md) | Ringkasan perubahan per rilis |
| [CHANGES/](CHANGES/) | Detail tiap change set (context, impact, test, rollback) |

## Konvensi kontributor

`AGENTS.md` di root repo — aturan kerja untuk kontributor & AI agent (struktur, tenancy, definition of done).

## Status proyek

- 16 task MVP selesai (auth → AI assistant), 109 test backend + 55 test frontend hijau.
- Konfigurasi deploy produksi siap (php-fpm + nginx + SPA, lihat RUNBOOK).
- Belum terpasang (operasional): TLS cert aktif, backup DB terjadwal, error tracking (Sentry).
