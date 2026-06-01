# TASK-04 — Business Profile & Onboarding

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-03
> Estimasi: 1 hari

---

## Tujuan

Setelah register, user diarahkan ke flow onboarding untuk setup profil bisnis. Profil bisnis ini menjadi konteks utama untuk semua data (multi-tenant isolation).

---

## Scope

### 4.1 Backend

#### Database Migration: `businesses`
```
businesses
├── id (bigint, PK)
├── owner_id (FK → users.id)
├── name (string)
├── category (string, enum)
├── phone (string, nullable)
├── address (text, nullable)
├── city (string, nullable)
├── logo_url (string, nullable)
├── description (text, nullable)
├── currency (string, default: 'IDR')
├── created_at
└── updated_at
```

#### Database Migration: `business_users`
```
business_users
├── id (bigint, PK)
├── business_id (FK → businesses.id)
├── user_id (FK → users.id)
├── role (enum: owner, staff)
├── created_at
└── updated_at
```

#### Kategori Bisnis (PRD §11.2)
```
makanan_minuman, laundry, jasa_service, toko_online,
fashion, kesehatan_kecantikan, edukasi, otomotif, lainnya
```

#### API Endpoints
```http
GET    /api/business          ← get current business profile
PUT    /api/business          ← update business profile
POST   /api/business/logo     ← upload logo (optional)
```

#### Behaviour
- Saat register (TASK-03), business sudah auto-created dengan `name` dari form register
- Onboarding flow melengkapi data: category, phone, city
- Business ID menjadi scope untuk semua data (customers, products, orders, etc.)
- Middleware `EnsureBusiness` — redirect ke onboarding jika profile belum lengkap

---

### 4.2 Frontend — Onboarding Flow

Referensi: DESIGN §14.2

#### Stepper Layout (3 steps)

**Step 1 — Profil Bisnis**
- Nama bisnis (pre-filled dari register)
- Kategori bisnis (dropdown/select)
- Nomor WhatsApp
- Kota

Microcopy: *"Informasi ini membantu AI memahami bisnis kamu."*

**Step 2 — Jenis Layanan**
- Apakah bisnis menjual produk, layanan, atau keduanya? (segmented control)
- Deskripsi singkat bisnis (optional textarea)

**Step 3 — Selesai**
- Tampilkan summary bisnis
- CTA: "Mulai Kelola Bisnis"
- AI welcome message: *"Bisnis kamu sudah siap dicatat. Mulai dari input order pertama. Nanti saya bantu buat laporan harian."*

#### Design
- Full-page stepper, centered
- Progress indicator (step dots / bar)
- CTA: "Lanjut" per step
- Back button untuk kembali ke step sebelumnya
- Mobile-friendly, tidak terlalu banyak field per step

---

### 4.3 Frontend — Settings: Business Profile

Setelah onboarding, user bisa mengedit business profile dari Settings page.

- Halaman: `/settings/business`
- Fields sama dengan onboarding, plus:
  - Logo upload (drag & drop atau file picker)
  - Address (full textarea)
  - Currency selector
- CTA: "Simpan Perubahan"

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `database/migrations/..._create_businesses_table.php` | migration |
| `database/migrations/..._create_business_users_table.php` | migration |
| `app/Models/Business.php` | model + relationships |
| `app/Models/BusinessUser.php` | pivot model |
| `app/Enums/BusinessCategory.php` | enum class |
| `app/Enums/UserRole.php` | owner, staff |
| `app/Http/Controllers/Api/BusinessController.php` | CRUD |
| `app/Http/Middleware/EnsureBusiness.php` | onboarding guard |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/auth/pages/OnboardingPage.tsx` | 3-step wizard |
| `src/features/auth/components/OnboardingStep1.tsx` | profil bisnis |
| `src/features/auth/components/OnboardingStep2.tsx` | jenis layanan |
| `src/features/auth/components/OnboardingStep3.tsx` | selesai / welcome |
| `src/features/settings/pages/BusinessProfilePage.tsx` | edit profile |

---

## Acceptance Criteria (PRD §19)

- [ ] User wajib punya business profile (redirect ke onboarding jika belum)
- [ ] User dapat menyelesaikan onboarding 3-step
- [ ] User dapat mengedit business profile dari settings
- [ ] Kategori bisnis sesuai daftar PRD
- [ ] Business ID menjadi scope filter untuk semua query
- [ ] Multi-tenant: user hanya lihat data bisnisnya sendiri
