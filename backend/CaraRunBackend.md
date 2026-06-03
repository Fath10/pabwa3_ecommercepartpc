Pastikan ada atau buat file .env
file berisikan
PORT=3000

## Cara Menjalankan Backend (e-BuildPC)

Panduan singkat menjalankan API backend secara lokal.

Persyaratan

- Node.js (v16+) dan npm
- PostgreSQL (database) — pastikan Anda punya akses DATABASE_URL

Langkah 1 — Siapkan environment

1. Duplikasi file `.env.example` jika ada, atau buat file baru `.env` di folder `backend`.
2. Contoh variabel yang wajib diisi:

```
PORT=3000
JWT_SECRET= isi_rahasia_jwt_anda
DATABASE_URL= ''
```

3. DATABASE_URL Minta/Ada diGroup

Langkah 2 — Install dependensi

Buka terminal di folder `backend` lalu jalankan:

```powershell
npm install
```

Langkah 3 — Menjalankan server

- Mode development (dengan nodemon):

```powershell
npm run dev
```

- Mode production:

```powershell
npm start
```

Server berjalan pada `http://localhost:<PORT>` (default 3000). Endpoint utama: `/api/*`.

JANGAN LUPA untuk Membaca Dokumentasi API di folder DOKUMENTATATION_API
