# OpsMate AI — Panduan Pengguna

> Buku panduan untuk owner & staff UMKM yang memakai OpsMate AI.
> Bahasa sederhana, fokus ke "gimana caranya", bukan istilah teknis.

## Daftar Isi

1. [Apa itu OpsMate AI](#1-apa-itu-opsmate-ai)
2. [Mulai dari Nol (Onboarding)](#2-mulai-dari-nol-onboarding)
3. [Mengenal Dashboard](#3-mengenal-dashboard)
4. [Mengelola Customer](#4-mengelola-customer)
5. [Mengelola Produk & Layanan](#5-mengelola-produk--layanan)
6. [Mencatat Order](#6-mencatat-order)
7. [Status Order & Pembayaran](#7-status-order--pembayaran)
8. [Stok](#8-stok)
9. [Invoice](#9-invoice)
10. [Reminder & Follow-up](#10-reminder--follow-up)
11. [Laporan Harian](#11-laporan-harian)
12. [AI Assistant](#12-ai-assistant)
13. [Tanya Jawab (FAQ)](#13-tanya-jawab-faq)

---

## 1. Apa itu OpsMate AI

OpsMate AI adalah aplikasi pencatatan operasional harian untuk bisnis kecil. Ia membantu kamu:

- mencatat **order** yang masuk (dari WhatsApp, telepon, dll.)
- menyimpan data **customer**
- mengatur **produk/layanan** beserta harga & stok
- membuat **invoice** untuk ditagihkan
- mengingatkan hal yang perlu **ditindaklanjuti** (belum bayar, stok menipis)
- membuat **laporan harian** otomatis
- bertanya ke **AI** soal kondisi bisnis ("hari ini gimana?", "siapa yang belum bayar?")

Tujuannya satu: bisnismu jadi lebih rapi, tidak ada order/pembayaran yang terlewat, dan kamu tahu kondisi bisnis setiap hari.

### Siapa yang pakai
- **Owner** — punya akses penuh: semua data, laporan, pengaturan bisnis.
- **Staff** — bantu input order/customer, update status. Tidak bisa ubah pengaturan billing atau hapus bisnis.

---

## 2. Mulai dari Nol (Onboarding)

### Langkah 1 — Daftar
Buka aplikasi, pilih **Daftar**. Isi:
- Nama lengkap kamu
- Nama bisnis (mis. "Rina Catering")
- Email
- Password (minimal 8 karakter)

Setelah daftar, bisnismu otomatis dibuat dan kamu masuk sebagai **Owner**.

### Langkah 2 — Lengkapi Profil Bisnis
Aplikasi mengajakmu mengisi profil bisnis dalam 3 langkah singkat:

1. **Profil Bisnis** — nama bisnis, kategori (makanan, laundry, jasa, dll.), nomor WhatsApp, kota.
2. **Jenis Layanan** — deskripsi singkat bisnismu (opsional).
3. **Selesai** — ringkasan, lalu tekan "Mulai Kelola Bisnis".

> Mengapa penting: informasi ini membantu AI memahami bisnismu dan dipakai di invoice/laporan.

### Langkah 3 — Isi Data Awal
Supaya aplikasi langsung berguna, isi minimal:
- 1–5 **produk/layanan** yang kamu jual
- 1 **customer** (atau tambahkan langsung saat mencatat order pertama)

Setelah itu kamu siap mencatat order.

---

## 3. Mengenal Dashboard

Dashboard adalah halaman pertama yang menjawab: **"Hari ini bisnis saya gimana?"**

Isinya dari atas ke bawah:

1. **Ringkasan Pintar (AI)** — kartu ungu-hijau berisi rangkuman hari ini dalam 2–3 kalimat, mis. *"Hari ini ada 12 order dengan estimasi omzet Rp1.450.000. Ada 3 order belum dibayar."*
2. **Aksi Cepat** — tombol pintas: Tambah Order, Tambah Customer, Buat Invoice.
3. **Kartu Metrik** — angka kunci hari ini:
   - **Omzet Hari Ini** (dengan tren naik/turun vs kemarin)
   - **Belum Bayar** (total + jumlah order)
   - **Stok Rendah** (jumlah produk menipis)
   - **Customer Baru**
4. **Order Terbaru** — daftar order terakhir, klik untuk lihat detail.
5. **Stok Menipis** — produk yang perlu di-restock.

> Tips: cukup lihat dashboard 5 detik tiap pagi untuk tahu apa yang perlu dikerjakan hari ini.

### Sapaan otomatis
Aplikasi menyapa sesuai waktu: Pagi (sebelum 11), Siang (11–15), Sore (15–18), Malam (setelah 18).

---

## 4. Mengelola Customer

Menu **Customers**.

- **Tambah customer:** tombol "Tambah". Isi nama (wajib), nomor WhatsApp, email, alamat, catatan, dan tipe (Baru/Langganan/VIP/Tidak Aktif).
- **Cari:** ketik nama atau nomor di kotak pencarian.
- **Filter:** chip di atas daftar (Semua / Baru / Langganan / VIP / Tidak Aktif).
- **Detail customer:** klik kartunya. Kamu lihat info kontak, riwayat order, dan tombol cepat "Buat Order" + "Follow-up" (buka WhatsApp).
- **Privasi:** di daftar, nomor HP ditampilkan tersamar (mis. `0812-xxxx-90`). Nomor lengkap ada di detail.
- **Edit/Hapus:** dari halaman detail.

> Customer yang lama tidak order (30+ hari) otomatis ditandai untuk follow-up di menu Reminder.

---

## 5. Mengelola Produk & Layanan

Menu **Products**.

Ada dua tipe:
- **Produk** — barang berstok (mis. Nasi Box, Brownies). Punya stok & stok minimum.
- **Layanan** — jasa tanpa stok (mis. Cuci Kiloan). Field stok otomatis disembunyikan.

Saat menambah, isi:
- Nama (wajib), tipe, kategori
- **Harga jual** (wajib)
- **Harga modal** (opsional — dipakai menghitung margin)
- Stok & stok minimum (khusus produk)
- Satuan (pcs, kg, box, porsi, dll.)

**Penanda stok rendah:** jika stok ≤ stok minimum, produk diberi label merah "Stok Hampir Habis" dan muncul di panel Stok Menipis dashboard.

**Filter "Stok Rendah":** chip di halaman Products untuk melihat semua yang perlu di-restock.

---

## 6. Mencatat Order

Ini fitur paling sering dipakai. Targetnya: **selesai dalam < 1 menit.**

Dari Aksi Cepat dashboard atau menu Orders → "Tambah":

1. **Pilih Pelanggan** — dari dropdown, atau "Tambah Customer Baru" langsung dari sini.
2. **Tambah Produk** — ketik di kotak cari, klik produk untuk menambahkan. Atur jumlah dengan tombol `–` / `+`. Tambah produk lain sebanyak perlu.
3. **Status Pembayaran** — Belum Bayar / DP / Lunas.
4. **Status Order** — Baru / Diproses / Selesai.
5. **Catatan** (opsional).
6. **Total** otomatis terhitung dan tampil di bar bawah. Tekan **"Simpan Order"**.

Sistem memberi **nomor order otomatis** (ORD-0001, ORD-0002, ...). Harga produk "dikunci" saat order dibuat, jadi kalau nanti harga produk berubah, order lama tetap pakai harga lamanya.

---

## 7. Status Order & Pembayaran

Buka detail order untuk mengubah status.

### Status Order (alurnya searah)
`Baru → Diproses → Siap → Selesai → Dikirim`. Bisa **Batal** dari tahap mana pun (kecuali yang sudah Dikirim). Aplikasi hanya menampilkan tombol transisi yang valid — jadi kamu tidak bisa salah mundur ke status sebelumnya.

### Status Pembayaran
`Belum Bayar → DP → Lunas`, dan `Lunas → Refund`.

### Yang terjadi otomatis
- Saat order jadi **Selesai/Dikirim**, **stok produk otomatis berkurang**.
- Saat order **Dibatalkan** (yang sebelumnya sudah mengurangi stok), **stok dikembalikan**.
- Setiap perubahan status tercatat di **riwayat aktivitas** order (siapa & kapan).

---

## 8. Stok

Dikelola dari halaman detail produk.

- **Stok berkurang otomatis** saat order selesai (tidak perlu input manual).
- **Sesuaikan manual** lewat tombol "Sesuaikan":
  - **Masuk** — tambah stok (mis. restock dari supplier).
  - **Keluar** — kurangi stok (mis. barang rusak).
  - **Koreksi** — set stok ke angka pasti (mis. hasil stok opname).
- **Riwayat Stok** — semua pergerakan tercatat: tanggal, jenis, jumlah (+/–), dan asal (manual atau dari order).

---

## 9. Invoice

Menu **Invoices**.

- **Buat invoice** dari halaman detail order (atau menu Invoices). Satu order = satu invoice (tidak akan dobel).
- Nomor otomatis: INV-0001, INV-0002, ...
- Dari detail invoice kamu bisa:
  - **Download PDF** — invoice rapi siap kirim/cetak.
  - **Copy Teks** — versi teks siap tempel ke WhatsApp.
  - **Ubah Status** — Draft / Terkirim / Lunas / Jatuh Tempo / Batal.
- **Filter** invoice berdasarkan status lewat chip di atas daftar.

---

## 10. Reminder & Follow-up

Menu **Reminder** ("Perlu Ditindaklanjuti").

Aplikasi otomatis membuat pengingat setiap pagi untuk:
- Order yang **belum dibayar**
- Invoice yang **lewat jatuh tempo**
- Produk yang **stoknya menipis**
- Order yang **belum selesai** lebih dari 2 hari
- Customer yang **lama tidak order** (30+ hari)

Reminder dikelompokkan berdasarkan prioritas:
- **Urgent** (garis merah) — perlu segera, mis. tagihan lewat 3+ hari.
- **Hari Ini** (garis oranye) — kerjakan hari ini.
- **Nanti** (garis netral) — bisa menyusul.

Tiap reminder punya 3 aksi:
- **Buat Pesan** — aplikasi menyusun draft pesan follow-up (mis. menagih pembayaran) yang bisa kamu **salin dan tempel ke WhatsApp**. Bisa diedit dulu sebelum disalin.
- **Selesai** — tandai beres, reminder hilang dari daftar.
- **Tunda** — sembunyikan sementara (muncul lagi nanti).

---

## 11. Laporan Harian

Menu **Reports**.

Laporan otomatis berisi performa hari itu:
- Total order, omzet, total belum bayar, order selesai, customer baru
- **Produk terlaris** (dengan grafik batang sederhana)
- **Stok rendah**
- **Ringkasan** naratif di atas

Kamu bisa:
- **Pindah tanggal** dengan panah kiri/kanan untuk melihat laporan hari sebelumnya.
- **Export PDF** untuk arsip atau dibagikan.
- **Copy Ringkasan** ke clipboard.

> Laporan dibuat otomatis tiap malam, tapi kamu juga bisa membukanya kapan saja — angkanya selalu dihitung dari data terbaru.

---

## 12. AI Assistant

Menu **AI** (atau tombol "Tanya AI" di dashboard).

AI Assistant menjawab pertanyaan tentang bisnismu **berdasarkan data asli** — bukan mengarang. Contoh yang bisa kamu tanyakan (ada chip pertanyaan cepat):
- "Hari ini gimana?"
- "Siapa yang belum bayar?"
- "Produk apa yang paling laku?"
- "Stok apa yang mau habis?"
- "Buatkan laporan harian"
- "Buat promo minggu ini"

Saat AI menyebut order yang belum bayar, ia menampilkan **kartu data** dengan tombol "Buat Pesan WhatsApp" langsung.

AI juga muncul **menempel di tempat kerja**:
- Di **detail order belum bayar** → saran "Mau saya bantu buatkan pesan follow-up?"
- Di **detail customer tidak aktif** → saran mengajak order lagi.

### Catatan tentang AI
- AI **tidak pernah mengubah data** tanpa kamu. Ia hanya menyarankan; kamu yang memutuskan.
- AI **tidak mengarang angka** — kalau datanya tidak ada, ia tidak menyebutnya.
- Jika layanan AI sedang tidak aktif, aplikasi tetap menampilkan data apa adanya. **Fitur utama tetap jalan** tanpa AI.
- Ada batas pemakaian chat AI (default 20/jam) supaya hemat & adil.

---

## 13. Tanya Jawab (FAQ)

**Q: Dataku aman dari bisnis lain?**
Ya. Setiap bisnis terisolasi total. Kamu hanya pernah melihat data bisnismu sendiri.

**Q: Apa beda Owner dan Staff?**
Owner punya akses penuh termasuk pengaturan & laporan. Staff bisa input/update order & customer, tapi tidak bisa ubah pengaturan billing atau hapus bisnis.

**Q: Kalau salah ubah status order, bisa dibalik?**
Status order mengalir satu arah (mis. tidak bisa dari "Selesai" balik ke "Baru"). Ini sengaja, supaya catatan akurat. Kalau perlu koreksi besar, hubungi admin/owner.

**Q: Stok kok berkurang sendiri?**
Itu normal — stok otomatis berkurang saat order ditandai Selesai/Dikirim. Kalau order dibatalkan, stok dikembalikan. Untuk koreksi manual, pakai "Sesuaikan Stok".

**Q: Hapus customer/produk/order menghilangkan data permanen?**
Tidak. Penghapusan bersifat "soft delete" — data disembunyikan, bukan dimusnahkan, sehingga riwayat tetap aman.

**Q: Harus online terus?**
Ya, aplikasi berbasis web dan butuh koneksi internet untuk menyimpan data ke server.

**Q: Bisa dipakai banyak orang sekaligus?**
Bisa. Owner & staff bisa bekerja bersamaan di bisnis yang sama.

**Q: Lupa password?**
Pakai "Lupa password?" di halaman login untuk menerima link reset via email.
