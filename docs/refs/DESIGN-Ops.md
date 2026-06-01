# DESIGN.md — OpsMate AI

## 1. Product Identity

### Product Name

**OpsMate AI**

### Product Description

OpsMate AI adalah aplikasi **AI Ops Manager untuk UMKM dan bisnis jasa kecil** yang membantu owner mencatat order, mengelola customer, membuat invoice, memantau pembayaran, memantau stok, membuat laporan harian, dan mendapatkan insight bisnis otomatis dari AI.

Produk ini ditujukan untuk bisnis kecil yang masih mengelola operasional lewat WhatsApp, catatan manual, Excel, atau ingatan pribadi.

### Core Promise

> Membantu bisnis kecil jadi lebih rapi, tidak lupa follow-up, dan tahu kondisi bisnis setiap hari.

### Product Personality

OpsMate AI harus terasa seperti:

- manager digital
- asisten bisnis harian
- teman operasional yang rapi
- helper yang tidak menghakimi
- sistem yang simpel tapi powerful

Bukan seperti:

- ERP berat
- software accounting kompleks
- dashboard enterprise
- chatbot gimmick
- aplikasi kasir yang kaku

---

# 2. Target User

## Primary User

Owner UMKM / bisnis jasa kecil.

Contoh:

- service AC
- laundry
- jasa jahit
- catering rumahan
- cleaning service
- bengkel kecil
- toko online kecil
- florist
- printing
- hampers

## User Characteristics

User biasanya:

- sibuk
- sering pakai HP
- order banyak masuk dari WhatsApp
- tidak suka form panjang
- tidak suka istilah teknis
- butuh laporan sederhana
- ingin tahu apa yang harus dilakukan hari ini
- sering lupa follow-up
- tidak punya sistem operasional rapi
- ingin aplikasi yang langsung bisa dipakai

## Main User Need

User tidak butuh dashboard yang terlihat canggih. User butuh jawaban cepat:

1. Hari ini bisnis saya gimana?
2. Order mana yang belum selesai?
3. Siapa yang belum bayar?
4. Customer mana yang perlu dihubungi?
5. Stok apa yang hampir habis?
6. Apa yang harus saya lakukan sekarang?

---

# 3. Design Principles

## 3.1 Mobile First

Sebagian besar owner UMKM akan memakai aplikasi dari HP. Semua screen wajib nyaman digunakan di mobile.

Rules:

- touch target minimal 44px
- form tidak terlalu panjang
- CTA utama mudah dijangkau jempol
- bottom navigation di mobile
- list menggunakan card, bukan table
- sticky action untuk aksi penting

## 3.2 Action Over Analytics

Dashboard tidak boleh terlalu banyak grafik.

Prioritaskan:

- ringkasan hari ini
- reminder
- unpaid order
- quick action
- order terbaru
- AI insight

Chart boleh ada, tapi bukan fokus utama.

## 3.3 Calm, Clear, Helpful

UI harus terasa tenang dan jelas.

Hindari:

- warna terlalu ramai
- teks terlalu banyak
- card terlalu padat
- istilah teknis
- grafik kompleks
- terlalu banyak badge

## 3.4 AI Must Be Actionable

AI tidak boleh hanya menjadi chat bubble.

AI harus muncul sebagai:

- summary card
- suggestion card
- follow-up generator
- daily report helper
- reminder assistant
- promo idea helper

Setiap insight AI sebaiknya punya aksi lanjutan.

Contoh:

> “Ada 3 order belum dibayar.”

CTA:

- “Buat Pesan Follow-up”
- “Lihat Order”

## 3.5 One Screen, One Main Goal

Setiap screen harus punya satu tujuan utama.

Contoh:

- Dashboard: mengetahui kondisi bisnis hari ini
- Add Order: mencatat order secepat mungkin
- Reminder: menyelesaikan hal yang perlu ditindaklanjuti
- AI Assistant: bertanya dan mendapatkan insight
- Daily Report: memahami performa hari ini

---

# 4. Visual Direction

## Design Style

Gunakan style:

> Clean SaaS + Friendly UMKM + AI Copilot

Visual harus terasa:

- modern
- profesional
- ringan
- rounded
- friendly
- tidak intimidating
- sedikit futuristik karena AI
- tetap familiar untuk user non-teknis

## References Direction

Gunakan prinsip dari:

- mobile banking clarity
- Shopify admin simplicity
- Notion calm interface
- Linear clean spacing
- WhatsApp familiarity for follow-up action
- modern AI copilot cards

Jangan meniru mentah-mentah. Ambil prinsip clarity dan hierarchy-nya.

---

# 5. Color System

## 5.1 Primary Palette

Primary color digunakan untuk CTA utama, active navigation, link penting, dan highlight utama.

| Token         |       Hex | Usage                  |
| ------------- | --------: | ---------------------- |
| `primary-50`  | `#F0FDFA` | soft background        |
| `primary-100` | `#CCFBF1` | subtle card background |
| `primary-200` | `#99F6E4` | hover soft             |
| `primary-300` | `#5EEAD4` | decorative             |
| `primary-400` | `#2DD4BF` | accent                 |
| `primary-500` | `#14B8A6` | secondary CTA          |
| `primary-600` | `#0D9488` | main CTA               |
| `primary-700` | `#0F766E` | main brand             |
| `primary-800` | `#115E59` | pressed state          |
| `primary-900` | `#134E4A` | strong text            |

Recommended primary:

```css
--color-primary: #0f766e;
--color-primary-hover: #115e59;
--color-primary-soft: #ccfbf1;
```

## 5.2 AI Accent Palette

AI accent digunakan untuk AI summary, AI assistant, sparkle icon, smart suggestion, dan generated content.

| Token    |       Hex | Usage              |
| -------- | --------: | ------------------ |
| `ai-50`  | `#F5F3FF` | AI soft background |
| `ai-100` | `#EDE9FE` | AI card background |
| `ai-500` | `#8B5CF6` | AI accent          |
| `ai-600` | `#7C3AED` | AI primary         |
| `ai-700` | `#6D28D9` | AI hover           |

```css
--color-ai: #7c3aed;
--color-ai-soft: #ede9fe;
```

## 5.3 Neutral Palette

| Token         |       Hex | Usage           |
| ------------- | --------: | --------------- |
| `neutral-0`   | `#FFFFFF` | card            |
| `neutral-50`  | `#F8FAFC` | app background  |
| `neutral-100` | `#F1F5F9` | soft section    |
| `neutral-200` | `#E2E8F0` | border          |
| `neutral-300` | `#CBD5E1` | disabled border |
| `neutral-400` | `#94A3B8` | muted text      |
| `neutral-500` | `#64748B` | secondary text  |
| `neutral-700` | `#334155` | body text       |
| `neutral-900` | `#0F172A` | heading         |

```css
--color-background: #f8fafc;
--color-card: #ffffff;
--color-border: #e2e8f0;
--color-text: #0f172a;
--color-text-secondary: #64748b;
--color-text-muted: #94a3b8;
```

## 5.4 Semantic Colors

| Token          |       Hex | Usage                   |
| -------------- | --------: | ----------------------- |
| `success`      | `#10B981` | paid, completed, safe   |
| `success-soft` | `#D1FAE5` | success badge bg        |
| `warning`      | `#F59E0B` | DP, low stock, pending  |
| `warning-soft` | `#FEF3C7` | warning badge bg        |
| `danger`       | `#EF4444` | overdue, error, urgent  |
| `danger-soft`  | `#FEE2E2` | danger badge bg         |
| `info`         | `#3B82F6` | processing, information |
| `info-soft`    | `#DBEAFE` | info badge bg           |

## 5.5 Gradient

Gunakan gradient lembut untuk AI Summary Card.

```css
--gradient-ai-card: linear-gradient(
  135deg,
  #0f766e 0%,
  #14b8a6 45%,
  #7c3aed 100%
);
--gradient-soft-ai: linear-gradient(135deg, #f0fdfa 0%, #f5f3ff 100%);
```

Rules:

- Jangan terlalu banyak gradient.
- Gradient hanya untuk hero card, AI card, atau onboarding.
- Card lain tetap putih agar bersih.

---

# 6. Typography

## Font Family

Recommended:

```css
--font-sans: "Plus Jakarta Sans", "Inter", system-ui, sans-serif;
```

Fallback:

- Inter
- Geist
- Manrope
- system-ui

## Type Scale

| Token     | Size | Line Height | Weight | Usage                       |
| --------- | ---: | ----------: | -----: | --------------------------- |
| `display` | 32px |        40px |    700 | landing/onboarding headline |
| `h1`      | 28px |        36px |    700 | desktop page title          |
| `h2`      | 24px |        32px |    700 | section title               |
| `h3`      | 20px |        28px |    600 | card title                  |
| `body-lg` | 18px |        28px |    400 | important body              |
| `body`    | 16px |        24px |    400 | default text                |
| `body-sm` | 14px |        22px |    400 | secondary text              |
| `caption` | 12px |        18px |    500 | badges, labels              |
| `micro`   | 11px |        16px |    500 | metadata                    |

## Font Weight

| Weight | Usage              |
| ------ | ------------------ |
| 400    | body               |
| 500    | label, nav         |
| 600    | button, card title |
| 700    | headline           |

## Copy Style

Gunakan bahasa Indonesia yang ramah, jelas, dan tidak terlalu formal.

Recommended copy:

- “Hari ini bisnis kamu cukup ramai.”
- “Ada 3 order yang belum dibayar.”
- “Mau saya bantu buatkan pesan follow-up?”
- “Stok ini hampir habis.”
- “Yuk catat order pertama.”

Avoid:

- “Revenue meningkat”
- “Pipeline tertahan”
- “Overdue invoice”
- “Customer retention rendah”
- “Operational bottleneck detected”

Use instead:

- “Omzet naik”
- “Order belum selesai”
- “Tagihan lewat jatuh tempo”
- “Customer lama belum order”
- “Ada pekerjaan yang perlu ditindaklanjuti”

---

# 7. Spacing System

Gunakan spacing berbasis 4px.

| Token      | Value | Usage           |
| ---------- | ----: | --------------- |
| `space-1`  |   4px | micro gap       |
| `space-2`  |   8px | small gap       |
| `space-3`  |  12px | form gap        |
| `space-4`  |  16px | default spacing |
| `space-5`  |  20px | card inner      |
| `space-6`  |  24px | section spacing |
| `space-8`  |  32px | large section   |
| `space-10` |  40px | page spacing    |
| `space-12` |  48px | hero spacing    |

Mobile page padding:

```css
--page-padding-mobile: 16px;
```

Desktop page padding:

```css
--page-padding-desktop: 24px;
```

Card padding:

```css
--card-padding: 16px;
```

---

# 8. Radius System

OpsMate AI harus terasa rounded dan friendly.

| Token         | Value | Usage                      |
| ------------- | ----: | -------------------------- |
| `radius-sm`   |   8px | badge, small input         |
| `radius-md`   |  12px | input, button              |
| `radius-lg`   |  16px | card                       |
| `radius-xl`   |  20px | large card                 |
| `radius-2xl`  |  24px | dashboard hero, bottom nav |
| `radius-full` | 999px | avatar, pill, FAB          |

Recommended:

```css
--radius-button: 12px;
--radius-card: 16px;
--radius-hero: 24px;
--radius-bottom-nav: 24px;
```

---

# 9. Shadow System

Gunakan shadow lembut, jangan terlalu berat.

| Token       | Value                                | Usage               |
| ----------- | ------------------------------------ | ------------------- |
| `shadow-xs` | `0 1px 2px rgba(15, 23, 42, 0.05)`   | small card          |
| `shadow-sm` | `0 4px 12px rgba(15, 23, 42, 0.06)`  | default card        |
| `shadow-md` | `0 8px 24px rgba(15, 23, 42, 0.08)`  | floating nav, modal |
| `shadow-lg` | `0 16px 40px rgba(15, 23, 42, 0.12)` | bottom sheet        |

Avoid harsh shadows.

---

# 10. Layout System

## 10.1 Mobile Layout

Viewport utama: 375px–430px width.

Rules:

- page padding 16px
- bottom nav fixed
- content bottom padding minimal 96px
- primary CTA sticky jika screen form/detail
- list menggunakan card
- table tidak dipakai di mobile
- filters menggunakan horizontal scroll chips

Mobile app structure:

```text
Mobile App Shell
├── Top Header
├── Scrollable Content
├── Floating Bottom Navigation
└── Optional Sticky CTA
```

## 10.2 Desktop Layout

Desktop memakai sidebar.

Minimum desktop width: 1024px.

Structure:

```text
Desktop App Shell
├── Sidebar 260px
├── Main Content
│   ├── Top Bar
│   └── Page Content
└── Optional Right Panel
```

Desktop dashboard grid:

```text
Main Content
├── AI Summary Card full width
├── Metrics grid 4 columns
├── Recent Orders 2/3 width
└── Reminders / Low Stock 1/3 width
```

---

# 11. Navigation

## 11.1 Mobile Bottom Navigation

Floating bottom navigation.

Items:

1. Home
2. Orders
3. Add
4. Reminder
5. AI

Design:

- fixed bottom
- centered
- width: calc(100% - 32px)
- margin: 16px
- height: 72px
- background: white
- border: 1px solid neutral-200
- radius: 24px
- shadow-md

Middle Add button:

- circular
- 56px
- primary background
- white icon
- raised slightly
- label optional

Behavior:

- active item uses primary color
- inactive uses neutral-400
- Add opens quick action sheet

Quick action sheet:

- Tambah Order
- Tambah Customer
- Tambah Produk
- Buat Invoice

## 11.2 Desktop Sidebar

Width: 260px.

Sidebar sections:

- Logo
- Main navigation
- Business switcher
- Upgrade card / AI quota
- User profile

Active nav:

- primary soft background
- primary text
- left indicator or icon background

---

# 12. Components

## 12.1 Button

### Primary Button

Usage:

- main CTA
- save order
- add order
- continue onboarding

Style:

```css
background: #0f766e;
color: #ffffff;
height: 44px;
border-radius: 12px;
font-weight: 600;
padding: 0 16px;
```

States:

- hover: `#115E59`
- disabled: neutral-300
- loading: spinner + text

### Secondary Button

Style:

```css
background: #ffffff;
color: #0f172a;
border: 1px solid #e2e8f0;
height: 44px;
border-radius: 12px;
font-weight: 600;
```

### Ghost Button

Use for low-priority action.

### Danger Button

Only for delete/cancel destructive action.

---

## 12.2 Card

Default Card:

```css
background: #ffffff;
border: 1px solid #e2e8f0;
border-radius: 16px;
padding: 16px;
box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
```

Card should include:

- title
- supporting text
- optional icon
- optional CTA
- optional badge

Avoid putting too many actions in one card.

---

## 12.3 AI Summary Card

AI Summary Card adalah komponen paling penting di dashboard.

Placement:

- top of dashboard
- below greeting/header

Visual:

- gradient soft or primary gradient
- icon sparkle/bot
- concise summary
- actionable CTA

Example content:

```text
Hari ini ada 12 order dengan estimasi omzet Rp1.450.000. Ada 3 order belum dibayar dan 2 stok hampir habis.
```

CTA:

- Tanya AI
- Lihat Detail

Rules:

- maksimal 2–3 kalimat
- jangan terlalu panjang
- highlight angka penting
- jangan pakai bahasa teknis

---

## 12.4 Metric Card

Metric card untuk angka utama.

Fields:

- label
- value
- subtext
- icon
- optional trend

Example:

```text
Order Hari Ini
12
+3 dari kemarin
```

Mobile layout:

- 2 columns

Desktop layout:

- 4 columns

---

## 12.5 Status Badge

Badge harus mudah dipahami.

### Payment Badge

| Status   | Label       | Color   |
| -------- | ----------- | ------- |
| unpaid   | Belum Bayar | danger  |
| partial  | DP          | warning |
| paid     | Lunas       | success |
| refunded | Refund      | neutral |

### Order Status Badge

| Status     | Label        | Color   |
| ---------- | ------------ | ------- |
| new        | Baru         | info    |
| confirmed  | Dikonfirmasi | primary |
| processing | Diproses     | warning |
| ready      | Siap         | ai      |
| completed  | Selesai      | success |
| delivered  | Dikirim      | success |
| cancelled  | Batal        | neutral |

Badge style:

```css
height: 24px;
padding: 0 8px;
border-radius: 999px;
font-size: 12px;
font-weight: 600;
```

---

## 12.6 Order Card

Used in order list and dashboard recent orders.

Content:

- customer name
- order number
- total amount
- date
- payment status badge
- order status badge
- quick action

Example:

```text
Sinta Permata
ORD-0012 · Hari ini
Rp250.000

[Belum Bayar] [Diproses]
Button: Follow-up
```

Rules:

- unpaid order should be visually noticeable
- quick action should be easy
- do not overload card

---

## 12.7 Customer Card

Content:

- customer name
- phone number
- last order
- total order
- customer type badge
- quick action follow-up

Example:

```text
Sinta Permata
0812-xxxx-xxxx
12 order · Terakhir order 2 hari lalu
[Repeat Customer]
```

---

## 12.8 Product Card

Content:

- product name
- category
- price
- stock
- minimum stock
- low stock warning
- active/inactive status

Low stock example:

```text
Brownies Coklat
Rp45.000
Stok 2 tersisa
[Stok Hampir Habis]
```

---

## 12.9 Reminder Card

Content:

- title
- description
- type badge
- due time
- related customer/order
- action buttons

Example:

```text
Sinta belum bayar
Invoice ORD-0012 sebesar Rp250.000 belum dibayar.
[Jatuh tempo hari ini]

Actions:
- Buat Pesan
- Tandai Selesai
```

Priority visual:

- urgent: left border danger
- today: left border warning
- normal: left border neutral

---

## 12.10 Empty State

Empty state harus ramah dan mengarahkan aksi.

Example for order:

```text
Belum ada order
Mulai catat order pertama supaya laporan harian bisa dibuat otomatis.

[Tambah Order Pertama]
```

Rules:

- gunakan ilustrasi sederhana
- jangan menyalahkan user
- CTA harus jelas
- berikan alasan kenapa perlu action

---

## 12.11 AI Chat Bubble

AI bubble:

- assistant bubble background: `#F5F3FF`
- user bubble background: `#0F766E`
- assistant text: `#0F172A`
- user text: white

Suggested prompt chips:

- rounded full
- border neutral
- active/hover primary soft

Example prompt chips:

- Hari ini gimana?
- Siapa yang belum bayar?
- Stok apa yang mau habis?
- Buatkan laporan harian
- Buat promo minggu ini

---

# 13. Forms

## 13.1 General Form Rules

- Label selalu terlihat
- Placeholder membantu, bukan menggantikan label
- Error message jelas
- Required field ditandai sederhana
- Group field berdasarkan konteks
- Mobile input height minimal 44px
- Gunakan bottom sheet untuk picker di mobile

## 13.2 Add Order Form

Goal:

> User bisa input order dalam kurang dari 1 menit.

Required fields:

- customer
- product/service
- quantity
- price
- payment status
- order status

Optional fields:

- discount
- due date
- notes

Layout:

1. Customer section
2. Item section
3. Payment section
4. Status section
5. Notes section
6. Sticky total + save button

Sticky bottom:

```text
Total: Rp250.000
[Simpan Order]
```

Rules:

- customer bisa ditambah langsung
- product bisa ditambah langsung
- total otomatis update
- jangan membuat user bolak-balik halaman

---

# 14. Screen Specifications

## 14.1 Onboarding Screen

Purpose:

Membuat user paham value produk dalam 5 detik.

Content:

- Logo OpsMate AI
- Headline
- Subheadline
- Visual/illustration
- CTA primary
- CTA secondary

Copy:

```text
Manager digital untuk bantu bisnis kecil lebih rapi.

Catat order, pantau pembayaran, buat invoice, dan dapatkan laporan harian otomatis dengan bantuan AI.
```

Primary CTA:

```text
Mulai Kelola Bisnis
```

Secondary CTA:

```text
Lihat Demo
```

---

## 14.2 Business Setup Screen

Purpose:

Mengumpulkan data bisnis awal tanpa membuat user overwhelmed.

Fields:

- nama bisnis
- kategori bisnis
- nomor WhatsApp
- kota

Use stepper:

1. Profil Bisnis
2. Jenis Layanan
3. Selesai

Microcopy:

```text
Informasi ini membantu AI memahami bisnis kamu.
```

CTA:

```text
Lanjut
```

---

## 14.3 Dashboard Screen

Purpose:

Menjawab pertanyaan:

> Hari ini bisnis saya gimana?

Layout order:

1. Header greeting
2. AI summary card
3. Metric cards
4. Quick actions
5. Reminder section
6. Recent orders
7. Low stock alert

Header example:

```text
Pagi, Bu Rina
Rina Catering
```

AI summary example:

```text
Hari ini ada 12 order dengan estimasi omzet Rp1.450.000. Ada 3 order belum dibayar dan stok Brownies Coklat hampir habis.
```

Quick actions:

- Tambah Order
- Tambah Customer
- Buat Invoice
- Tanya AI

---

## 14.4 Add Order Screen

Purpose:

Mencatat order cepat.

Must include:

- customer picker
- product/service picker
- quantity input
- price input
- payment status segmented control
- order status segmented control
- notes
- sticky total

CTA:

```text
Simpan Order
```

Success toast:

```text
Order berhasil dicatat.
```

Optional next action:

```text
Buat Invoice
```

---

## 14.5 Orders List Screen

Purpose:

Melihat dan mengelola semua order.

Top elements:

- search bar
- filter chips
- add order button

Filter chips:

- Semua
- Hari Ini
- Belum Bayar
- Diproses
- Selesai

Order card quick actions:

- Follow-up
- Ubah Status

---

## 14.6 Order Detail Screen

Purpose:

Melihat detail order dan melakukan action cepat.

Sections:

1. Customer
2. Order items
3. Payment
4. Status
5. Invoice
6. AI suggestion
7. Activity

AI suggestion:

```text
Customer ini belum bayar 2 hari. Mau saya bantu buatkan pesan follow-up?
```

CTA:

- Buat Pesan
- Tandai Lunas
- Buat Invoice
- Ubah Status

---

## 14.7 Reminder Screen

Purpose:

Menjadi task list harian owner.

Group:

- Urgent
- Hari Ini
- Nanti

Reminder types:

- Belum bayar
- Stok rendah
- Order belum selesai
- Customer lama belum order

CTA:

- Buat Pesan
- Tandai Selesai
- Tunda

---

## 14.8 AI Assistant Screen

Purpose:

Memberi akses chat dan insight berbasis data bisnis.

Top section:

- AI assistant header
- business context summary
- suggested prompt chips

Suggested prompts:

- Hari ini gimana?
- Siapa yang belum bayar?
- Produk apa yang paling laku?
- Stok apa yang mau habis?
- Buatkan laporan harian
- Buat promo minggu ini

AI response should include action buttons when possible.

Example:

```text
Ada 3 order belum dibayar dengan total Rp650.000. Saya sarankan follow-up hari ini.

[Generate Pesan] [Lihat Order]
```

---

## 14.9 Daily Report Screen

Purpose:

Menyajikan laporan harian sederhana.

Sections:

1. AI summary
2. Total order
3. Total omzet
4. Total belum bayar
5. Produk terlaris
6. Customer baru
7. Stok rendah
8. Rekomendasi tindakan

CTA:

- Export PDF
- Copy Summary
- Tanya AI

---

# 15. Icons

Use icon style:

- outline
- rounded
- 1.5–2px stroke
- consistent size

Recommended icon library:

- Lucide Icons

Icon mapping:

| Feature   | Icon            |
| --------- | --------------- |
| Dashboard | LayoutDashboard |
| Orders    | ClipboardList   |
| Add       | Plus            |
| Reminder  | Bell            |
| AI        | Sparkles / Bot  |
| Customer  | Users           |
| Product   | Package         |
| Invoice   | FileText        |
| Report    | BarChart3       |
| Settings  | Settings        |
| Payment   | Wallet          |
| Stock     | Boxes           |
| Follow-up | MessageCircle   |

---

# 16. Motion & Interaction

Motion should be subtle.

Use motion for:

- page transition
- bottom sheet
- modal
- AI typing indicator
- status update
- toast notification
- skeleton loading

Animation duration:

```css
--duration-fast: 120ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

Easing:

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

Avoid:

- excessive bouncing
- distracting animation
- animation that slows down form input

---

# 17. Accessibility

Requirements:

- text contrast minimum WCAG AA
- all buttons have visible focus state
- touch target minimum 44px
- status not only represented by color
- icon must have label or aria-label
- form error must be readable
- loading state must be clear
- avoid very small text below 12px

Focus ring:

```css
outline: 2px solid #14b8a6;
outline-offset: 2px;
```

---

# 18. Responsive Breakpoints

Recommended breakpoints:

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

Behavior:

- `< 768px`: mobile bottom nav
- `768px - 1023px`: tablet layout, optional side nav drawer
- `>= 1024px`: desktop sidebar

---

# 19. Tailwind Theme Token Suggestion

```js
export const theme = {
  colors: {
    background: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E2E8F0",
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      muted: "#94A3B8",
    },
    primary: {
      50: "#F0FDFA",
      100: "#CCFBF1",
      200: "#99F6E4",
      300: "#5EEAD4",
      400: "#2DD4BF",
      500: "#14B8A6",
      600: "#0D9488",
      700: "#0F766E",
      800: "#115E59",
      900: "#134E4A",
    },
    ai: {
      50: "#F5F3FF",
      100: "#EDE9FE",
      500: "#8B5CF6",
      600: "#7C3AED",
      700: "#6D28D9",
    },
    success: {
      DEFAULT: "#10B981",
      soft: "#D1FAE5",
    },
    warning: {
      DEFAULT: "#F59E0B",
      soft: "#FEF3C7",
    },
    danger: {
      DEFAULT: "#EF4444",
      soft: "#FEE2E2",
    },
    info: {
      DEFAULT: "#3B82F6",
      soft: "#DBEAFE",
    },
  },
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
  },
  boxShadow: {
    xs: "0 1px 2px rgba(15, 23, 42, 0.05)",
    sm: "0 4px 12px rgba(15, 23, 42, 0.06)",
    md: "0 8px 24px rgba(15, 23, 42, 0.08)",
    lg: "0 16px 40px rgba(15, 23, 42, 0.12)",
  },
};
```

---

# 20. Example Page Structure

## Mobile Dashboard Wireframe

```text
┌─────────────────────────────┐
│ Pagi, Bu Rina       [Bell]  │
│ Rina Catering               │
├─────────────────────────────┤
│ AI Summary Card             │
│ "Hari ini ada 12 order..."  │
│ [Tanya AI] [Lihat Detail]   │
├─────────────────────────────┤
│ [Order Hari Ini] [Omzet]    │
│ [Belum Bayar]   [Diproses] │
├─────────────────────────────┤
│ Quick Actions               │
│ [Tambah Order] [Customer]   │
│ [Invoice]      [Tanya AI]   │
├─────────────────────────────┤
│ Perlu Ditindaklanjuti       │
│ - 3 order belum bayar       │
│ - 2 stok hampir habis       │
├─────────────────────────────┤
│ Order Terbaru               │
│ Card Order                  │
│ Card Order                  │
├─────────────────────────────┤
│ Floating Bottom Navigation  │
└─────────────────────────────┘
```

## Desktop Dashboard Wireframe

```text
┌──────────────┬────────────────────────────────────────┐
│ Sidebar      │ Header                                 │
│              ├────────────────────────────────────────┤
│ Dashboard    │ AI Summary Card                        │
│ Orders       ├─────────┬─────────┬─────────┬─────────┤
│ Customers    │ Metric  │ Metric  │ Metric  │ Metric  │
│ Products     ├───────────────────────────┬────────────┤
│ Invoices     │ Recent Orders             │ Reminders  │
│ Reports      │                           │ Low Stock  │
│ AI Assistant │                           │            │
└──────────────┴───────────────────────────┴────────────┘
```

---

# 21. Dummy Data for Design

Use this dummy data for mockups.

## Business

```text
Nama bisnis: Rina Catering
Kategori: Catering Rumahan
Kota: Tangerang
Owner: Bu Rina
```

## Metrics

```text
Order hari ini: 12
Omzet hari ini: Rp1.450.000
Belum bayar: Rp650.000
Diproses: 5 order
Customer baru: 3
Stok rendah: 2 produk
```

## Customers

```text
Sinta Permata
Budi Santoso
Maya Lestari
Arif Rahman
Dinda Putri
```

## Products

```text
Nasi Box Ayam — Rp25.000 — Stok 24
Paket Hemat — Rp18.000 — Stok 12
Brownies Coklat — Rp45.000 — Stok 2
Snack Box — Rp15.000 — Stok 30
Es Teh Manis — Rp5.000 — Stok 50
```

## Orders

```text
ORD-0012 — Sinta Permata — Rp250.000 — Belum Bayar — Diproses
ORD-0011 — Budi Santoso — Rp180.000 — Lunas — Selesai
ORD-0010 — Maya Lestari — Rp450.000 — DP — Diproses
ORD-0009 — Arif Rahman — Rp125.000 — Belum Bayar — Baru
ORD-0008 — Dinda Putri — Rp320.000 — Lunas — Dikirim
```

## AI Summary

```text
Hari ini ada 12 order dengan estimasi omzet Rp1.450.000. Ada 3 order belum dibayar dengan total Rp650.000. Produk Paket Hemat paling laku hari ini, dan stok Brownies Coklat hampir habis.
```

---

# 22. UX Writing Guidelines

## Tone

- ramah
- jelas
- praktis
- tidak menggurui
- tidak terlalu formal
- tidak terlalu casual berlebihan

## Good UX Copy

```text
Hari ini bisnis kamu cukup ramai.
Ada 3 order yang belum dibayar.
Stok Brownies Coklat hampir habis.
Mau saya bantu buatkan pesan follow-up?
Belum ada order. Yuk catat order pertama.
```

## Bad UX Copy

```text
Revenue pipeline has unresolved overdue transactions.
Your inventory threshold has been breached.
Customer retention opportunity detected.
```

## Error Message

Bad:

```text
Invalid input.
```

Good:

```text
Nomor WhatsApp belum diisi.
```

Bad:

```text
Request failed.
```

Good:

```text
Data belum berhasil disimpan. Coba lagi sebentar.
```

## Success Message

```text
Order berhasil dicatat.
Invoice berhasil dibuat.
Pesan follow-up berhasil dibuat.
Status pembayaran diperbarui.
```

---

# 23. Page-Level CTA Rules

| Page            | Primary CTA                |
| --------------- | -------------------------- |
| Dashboard       | Tambah Order               |
| Orders List     | Tambah Order               |
| Order Detail    | Ubah Status / Buat Invoice |
| Customer Detail | Buat Order                 |
| Product List    | Tambah Produk              |
| Reminder        | Selesaikan Reminder        |
| AI Assistant    | Kirim Pertanyaan           |
| Daily Report    | Export PDF / Copy Summary  |

Rules:

- setiap page hanya punya satu primary CTA utama
- secondary CTA boleh maksimal 2–3
- destructive action tidak boleh sejajar dengan primary CTA

---

# 24. Data Visualization

Chart tidak menjadi fokus utama MVP.

Allowed charts:

- small line chart omzet 7 hari
- bar chart produk terlaris
- donut kecil status order

Rules:

- chart harus sederhana
- jangan gunakan lebih dari 2 chart di dashboard mobile
- prioritaskan card insight daripada chart
- chart harus punya summary text

Example:

```text
Omzet 7 hari terakhir naik 18%.
```

---

# 25. Dark Mode Optional

MVP utama menggunakan light mode.

Jika dark mode dibuat, gunakan token berikut:

```css
--dark-background: #020617;
--dark-card: #0f172a;
--dark-border: #1e293b;
--dark-text: #f8fafc;
--dark-text-secondary: #cbd5e1;
--dark-primary: #2dd4bf;
--dark-ai: #a78bfa;
```

Dark mode rules:

- jangan pure black untuk card
- tetap gunakan border halus
- badge harus readable
- AI card tetap punya highlight lembut

---

# 26. Development Notes for React + Tailwind + Shadcn UI

Recommended base components:

- Button
- Card
- Badge
- Input
- Textarea
- Select
- Dialog
- Sheet
- Tabs
- Dropdown Menu
- Toast
- Avatar
- Skeleton
- ScrollArea
- Separator

Recommended libraries:

- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucide React
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Framer Motion

Component naming:

```text
AppShell
MobileBottomNav
DesktopSidebar
DashboardSummaryCard
AISummaryCard
MetricCard
OrderCard
CustomerCard
ProductCard
ReminderCard
StatusBadge
PaymentBadge
EmptyState
QuickActionGrid
AIChatPanel
DailyReportCard
```

---

# 27. Do and Don’t

## Do

- desain mobile-first
- tampilkan AI summary di atas dashboard
- gunakan bahasa Indonesia sederhana
- buat CTA jelas
- gunakan card dan badge
- buat input order cepat
- tampilkan reminder sebagai task list
- gunakan warna merah hanya untuk urgent/error
- buat AI selalu actionable

## Don’t

- jangan buat dashboard terlalu penuh
- jangan mulai dengan grafik besar
- jangan gunakan istilah enterprise
- jangan buat form terlalu panjang
- jangan sembunyikan CTA
- jangan membuat AI hanya sebagai chatbot kosong
- jangan gunakan terlalu banyak warna
- jangan pakai table kompleks di mobile
- jangan membuat user merasa dia harus belajar sistem baru

---

# 28. Final Design Goal

Desain OpsMate AI harus membuat user merasa:

> “Akhirnya bisnis saya ada yang bantu pantau.”

Bukan hanya:

> “Ini aplikasi buat catat order.”

Produk ini harus terasa seperti **manager operasional digital** yang:

- mengingatkan
- merangkum
- memberi saran
- membantu follow-up
- membuat laporan
- menjaga bisnis tetap rapi

Prioritas utama desain:

1. Clarity
2. Speed
3. Trust
4. Actionability
5. Mobile usability
6. Friendly AI assistance

Final experience yang harus dicapai:

> Dalam 5 detik pertama di dashboard, owner langsung tahu kondisi bisnis hari ini dan apa yang harus dilakukan berikutnya.
