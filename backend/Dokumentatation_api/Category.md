# Categories API

Base path: `/api/categories`

## List categories

- Endpoint: GET `/api/categories/` — public
- Response (200):

```json
[
  { "category_id": 1, "category_name": "Processor" },
  { "category_id": 2, "category_name": "GPU" }
]
```

## Get category by id

- Endpoint: GET `/api/categories/:id` — public
- Success (200): returns category object
- Error: 404 if not found

## Create category

- Endpoint: POST `/api/categories/` — requires auth + admin
- Body (application/json): `{ "category_name": "Nama Kategori" }`
- Success: 201 returns created category
- Errors: 400 validation, 409 duplicate

## Update category

- Endpoint: PUT `/api/categories/:id` — requires auth + admin
- Body: `{ "category_name": "Nama Baru" }`
- Success: 200 returns updated category

## Delete category

- Endpoint: DELETE `/api/categories/:id` — requires auth + admin
- Note: server akan menolak (400) jika kategori masih dipakai oleh produk

## Contoh singkat (curl)

```sh
curl -X POST http://localhost:3000/api/categories \
	-H "Authorization: Bearer <TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"category_name":"Storage"}'
```

## Contoh response sukses (examples)

- List categories (200):

```json
[
  { "category_id": 1, "category_name": "Processor" },
  { "category_id": 2, "category_name": "GPU" }
]
```

- Get category by id (200):

```json
{ "category_id": 1, "category_name": "Processor" }
```

- Create category (201):

```json
{
  "message": "Kategori berhasil dibuat",
  "data": { "category_id": 5, "category_name": "Storage" }
}
```

- Update category (200):

```json
{
  "message": "Kategori berhasil diupdate",
  "category": { "category_id": 5, "category_name": "Penyimpanan" }
}
```

- Delete category (200):

```json
{ "message": "Kategori berhasil dihapus" }
```
