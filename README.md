# 🖥️ E-BuildPC — Website E-Commerce Komponen PC

**E-BuildPC** adalah website toko online yang menjual berbagai komponen/part untuk merakit PC (Personal Computer). Website ini dibuat sebagai proyek kuliah Pemrograman Aplikasi Berbasis Web (PABW) dan ditujukan untuk memudahkan pengguna dalam mencari, melihat, dan membeli komponen PC secara online.

---

## 📌 Fitur Utama

| Halaman | Deskripsi |
|---|---|
| 🏠 **Home** | Halaman utama berisi banner promosi dan produk unggulan |
| 🛒 **Katalog** | Daftar lengkap produk komponen PC yang tersedia |
| 🛍️ **Keranjang** | Melihat dan mengelola produk yang ingin dibeli |
| 📰 **Artikel** | Kumpulan artikel seputar dunia PC dan teknologi |
| ℹ️ **Tentang Kami** | Informasi mengenai tim dan tujuan E-BuildPC |

---

## 🛠️ Teknologi yang Digunakan

- **[Vue 3](https://vuejs.org/)** — Framework JavaScript untuk membangun antarmuka pengguna
- **[Vite](https://vitejs.dev/)** — Build tool yang cepat untuk development
- **[Vue Router](https://router.vuejs.org/)** — Untuk navigasi antar halaman
- **[Tailwind CSS](https://tailwindcss.com/)** — Framework CSS untuk styling tampilan

---

## ⚙️ Cara Menjalankan Website

### Prasyarat
Pastikan komputer kamu sudah menginstal:
- **[Node.js](https://nodejs.org/)** versi 18 ke atas
- **npm** (sudah otomatis terinstal bersama Node.js)

Cek apakah Node.js sudah terinstal dengan membuka terminal dan ketik:
```bash
node -v
npm -v
```

---

### Langkah-langkah

**1. Clone repository ini**
```bash
git clone https://github.com/Fath10/pabwa3_ecommercepartpc.git
```

**2. Masuk ke folder project**
```bash
cd pabwa3_ecommercepartpc
```

**3. Install semua dependensi yang dibutuhkan**
```bash
npm install
```
> Perintah ini hanya perlu dijalankan sekali, atau setiap kali ada perubahan pada `package.json`.

**4. Jalankan website di mode development**
```bash
npm run dev
```

**5. Buka browser dan akses:**
```
http://localhost:5173
```

Website sudah bisa digunakan! 🎉

---

## 📦 Perintah Lainnya

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan website di mode development (untuk pengembangan) |
| `npm run build` | Membuat versi production-ready dari website |
| `npm run preview` | Melihat preview hasil build sebelum di-deploy |

---

## 🌿 Struktur Branch

| Branch | Keterangan |
|---|---|
| `main` | Branch utama yang stabil |
| `frontend-feature` | Pengembangan fitur frontend tahap 1 |
| `frontend-feature.v.2` | Pengembangan fitur frontend tahap 2 |

---

## 👥 Tim Pengembang

Proyek ini dikerjakan sebagai tugas kelompok mata kuliah **Pemrograman Aplikasi Berbasis Web (PABW)**.

---

> 💡 **Tips:** Jika port `5173` sudah dipakai, Vite akan otomatis menggunakan port berikutnya (misalnya `5174`, `5175`, dst).
