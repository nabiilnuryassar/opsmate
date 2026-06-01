# TASK-02 — Design System & Layout Shell

> Fase: Phase 0 — Foundation
> Dependensi: TASK-01
> Estimasi: 2 hari

---

## Tujuan

Implementasi design system lengkap berdasarkan DESIGN.md dan membangun App Shell (layout utama) untuk mobile dan desktop, sesuai mockup dari Stitch.

---

## Scope

### 2.1 Tailwind Theme Configuration

Implementasi seluruh design tokens dari DESIGN §5–§9, §18–§19.

#### Colors (DESIGN §5)
```js
// Primary Palette (Teal)
primary: { 50–900 } // #F0FDFA → #134E4A
// AI Accent (Violet)
ai: { 50–700 } // #F5F3FF → #6D28D9
// Neutral
neutral: { 0–900 } // #FFFFFF → #0F172A
// Semantic
success, warning, danger, info + soft variants
```

#### Typography (DESIGN §6)
- Font: `Plus Jakarta Sans` (headings), `Inter` (body)
- Scale: display(32px), h1(28px), h2(24px), h3(20px), body-lg(18px), body(16px), body-sm(14px), caption(12px), micro(11px)

#### Spacing (DESIGN §7)
- 4px base system: space-1(4) → space-12(48)
- Page padding: mobile 16px, desktop 24px

#### Radius (DESIGN §8)
- sm(8px), md(12px), lg(16px), xl(20px), 2xl(24px), full(999px)

#### Shadows (DESIGN §9)
- xs, sm, md, lg — semua soft shadows

#### Breakpoints (DESIGN §18)
- sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

#### Gradients (DESIGN §5.5)
```css
--gradient-ai-card: linear-gradient(135deg, #0f766e 0%, #14b8a6 45%, #7c3aed 100%);
--gradient-soft-ai: linear-gradient(135deg, #f0fdfa 0%, #f5f3ff 100%);
```

#### Animation (DESIGN §16)
```css
--duration-fast: 120ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

---

### 2.2 Mobile Layout Shell

Referensi: [dashboard-mobile.png](file:///c:/laragon/www/opsmate-ai/docs/screens/dashboard-mobile.png)

Struktur (DESIGN §10.1):
```
Mobile App Shell
├── Top Header (sticky)
│   ├── Avatar + Greeting ("Pagi, Bu Rina")
│   ├── App title ("OpsMate AI")
│   └── Notification bell icon
├── Scrollable Content
│   └── Page content (with pb-24 for nav clearance)
└── Floating Bottom Navigation (fixed)
    ├── Home (icon: home)
    ├── Orders (icon: list_alt)
    ├── Add (+) — circular, raised, primary color
    ├── Reminder (icon: event_note)
    └── AI (icon: psychology/sparkles)
```

Bottom nav spec (DESIGN §11.1):
- Fixed bottom, centered
- Width: calc(100% - 32px), margin 16px
- Height: 72px
- Background: white, border neutral-200, radius 24px, shadow-md
- Middle Add button: circular 56px, primary bg, white icon, raised

Dari mockup mobile dashboard:
- Header: avatar foto + "Pagi, Bu Rina" + "OpsMate AI" + bell icon
- Bottom nav: Home(active/filled) | Orders | Add(+raised) | Reminder | AI
- Active nav item = primary color (teal)
- Inactive = neutral-400

---

### 2.3 Desktop Layout Shell

Referensi: [dashboard-desktop.png](file:///c:/laragon/www/opsmate-ai/docs/screens/dashboard-desktop.png)

Struktur (DESIGN §10.2):
```
Desktop App Shell
├── Sidebar 260px (fixed left)
│   ├── Logo ("OpsMate AI — SME Manager")
│   ├── Navigation items:
│   │   ├── Dashboard ← active: primary-soft bg, primary text
│   │   ├── Orders
│   │   ├── Customers
│   │   ├── Products
│   │   ├── Invoices
│   │   ├── Reminders
│   │   ├── Reports
│   │   ├── AI Assistant
│   │   └── Settings
│   ├── + New Entry button (primary, full width)
│   └── Logout link
├── Main Content Area
│   ├── Top Bar
│   │   ├── Business name ("Rina Catering")
│   │   ├── Greeting ("Pagi, Bu Rina")
│   │   ├── Search bar
│   │   └── User avatar + name + "Owner" badge
│   └── Page Content (scrollable)
```

Dari mockup desktop:
- Sidebar: putih/light, icon + label, active item = green/teal soft background
- Logo area: "OpsMate AI" dengan subtitle "SME Manager"
- "+ New Entry" button: full-width, primary green, rounded
- Main content: header bar with business name, search, user profile
- Content area: grid layout

---

### 2.4 Base UI Components (Shadcn)

Install dan kustomisasi komponen Shadcn sesuai design tokens:

| Component | Kustomisasi |
| --------- | ----------- |
| Button | Primary: #0f766e bg, 12px radius, 44px height, 600 weight |
| Card | White bg, 1px border #E2E8F0, 16px radius, shadow-sm |
| Badge | 24px height, pill shape, 12px font, 600 weight |
| Input | 44px height min, 12px radius, label always visible |
| Select | Bottom sheet picker di mobile |
| Dialog / Sheet | Rounded, untuk modal dan bottom sheet |
| Toast | Untuk success/error messages |
| Skeleton | Untuk loading states |
| Avatar | Rounded-full, for user/customer initials |

---

### 2.5 Shared Components

```
components/shared/
├── StatusBadge.tsx       ← payment & order status badges (DESIGN §12.5)
├── EmptyState.tsx        ← friendly empty states (DESIGN §12.10)
├── PageHeader.tsx        ← page title + subtitle + action
├── SectionHeader.tsx     ← section title + "Lihat Semua" link
├── LoadingSkeleton.tsx   ← skeleton patterns
└── AIGradientCard.tsx    ← AI summary card base (DESIGN §12.3)
```

---

## UI Reference dari Mockup

### Mobile Dashboard Layout Order
1. **Header** — avatar, greeting, title, bell
2. **AI Summary Card** — gradient soft (teal→violet), sparkle icon, summary text, "Tanya AI" button
3. **Quick Actions** — horizontal scroll: "Tambah Order", "Tambah Customer", "Buat Invoice"
4. **Metric Cards** — 2-col grid: Pendapatan, Stok Rendah, Pending, Customer Baru
5. **Perlu Ditindaklanjuti** — reminder cards with urgency indicator
6. **Order Terbaru** — order cards with avatar, name, amount, status badge
7. **Bottom Nav** — floating, 5 items

### Desktop Dashboard Layout Order
1. **Sidebar** — fixed left, nav items, new entry button
2. **Top Bar** — business name, search, user profile
3. **AI Insight Card** — full width, gradient, "Tanya AI" + "Lihat Detail" buttons
4. **Metric Cards** — 4-col grid: Order Hari Ini, Omzet, Belum Bayar, Diproses
5. **Order Terbaru (table)** — columns: Pelanggan, ID Order, Total, Pembayaran, Status
6. **Perlu Ditindaklanjuti** — sidebar panel right
7. **Stok Menipis** — sidebar panel right bottom

---

## Output Files

| Tipe | File |
| ---- | ---- |
| Config | `tailwind.config.ts` (updated with all tokens) |
| CSS | `src/index.css` (CSS variables, gradient classes, utilities) |
| Layout | `src/components/layout/AppShell.tsx` |
| Layout | `src/components/layout/MobileBottomNav.tsx` |
| Layout | `src/components/layout/DesktopSidebar.tsx` |
| Layout | `src/components/layout/TopBar.tsx` |
| Layout | `src/components/layout/MobileHeader.tsx` |
| Shared | `src/components/shared/StatusBadge.tsx` |
| Shared | `src/components/shared/EmptyState.tsx` |
| Shared | `src/components/shared/AIGradientCard.tsx` |

---

## Acceptance Criteria

- [ ] Tailwind theme mengandung semua tokens dari DESIGN.md
- [ ] Mobile layout: header sticky + content scrollable + bottom nav floating
- [ ] Desktop layout: sidebar 260px fixed + main content area
- [ ] Breakpoint behavior: <768px = mobile, ≥1024px = desktop
- [ ] Plus Jakarta Sans + Inter fonts loaded
- [ ] Lucide icons working
- [ ] StatusBadge menampilkan semua payment & order status dengan warna benar
- [ ] EmptyState component tampil ramah
- [ ] AI Summary Card dengan gradient soft benar
- [ ] Layout sesuai mockup screenshots
