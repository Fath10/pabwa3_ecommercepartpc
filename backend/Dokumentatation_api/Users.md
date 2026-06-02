# Users API

Dokumentasi singkat untuk endpoint terkait pengguna: register, login, dan mendapatkan data user saat ini (me).

Base path: `/api/auth`

## Register

- Endpoint: POST `/api/auth/register`
- Content-Type: `application/json`
- Body (example):

```json
{
  "fullname": "Andy Cole",
  "email": "andy@gmail.com",
  "password": "12345678"
}
```

- Validasi/aturan:
  - Semua field wajib diisi.
  - Password minimal 8 karakter.
  - Email harus unik.

- Success Response (201 Created):

```json
{
  "message": "Register berhasil",
  "user": {
    "user_id": 1,
    "name": "Andy Cole",
    "email": "andy@gmail.com",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

- Error responses (examples):
  - 400 Bad Request — jika ada field kosong atau password < 8
  - 409 Conflict — jika email sudah digunakan
  - 500 Server Error — error internal

---

## Login

- Endpoint: POST `/api/auth/login`
- Content-Type: `application/json`
- Body (example):

```json
{
  "email": "andy@gmail.com",
  "password": "12345678"
}
```

- Success Response (200 OK):

```json
{
  "message": "Login berhasil",
  "token": "<JWT_TOKEN>",
  "user": {
    "user_id": 1,
    "name": "Andy Cole",
    "email": "andy@gmail.com",
    "role": "admin"
  }
}
```

- Notes:
  - Simpan `token` (JWT) untuk request ke endpoint yang memerlukan autentikasi.
  - Token kadaluarsa sesuai pengaturan server (lihat `process.env.JWT_SECRET` dan durasi di controller — saat ini 24 jam).

- Error responses (examples):
  - 400 Bad Request — email atau password kosong
  - 401 Unauthorized — email/password salah
  - 500 Server Error — error internal

---

## Get current user (Me)

- Endpoint: GET `/api/auth/me`
- Auth: membutuhkan header `Authorization: Bearer <token>`
- Success Response (200 OK):

```json
{
  "user": {
    "user_id": 1,
    "name": "Andy Cole",
    "email": "andy@gmail.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

- Error responses:
  - 401 Unauthorized — header `Authorization` tidak ditemukan
  - 403 Forbidden — token tidak valid atau expired
  - 404 Not Found — user tidak ditemukan

---

## Header autentikasi

- Semua endpoint yang memerlukan autentikasi harus mengirim header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Contoh singkat menggunakan curl

- Register:

```sh
curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"fullname":"Andy Cole","email":"andy@gmail.com","password":"12345678"}'
```

- Login:

```sh
curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"andy@gmail.com","password":"12345678"}'
```

- Get current user (me):

```sh
curl -X GET http://localhost:3000/api/auth/me \
    -H "Authorization: Bearer <JWT_TOKEN>"
```

---

Jika ingin, saya bisa menambahkan contoh response lengkap untuk error-case, atau membuat versi Postman collection / OpenAPI untuk file ini.
