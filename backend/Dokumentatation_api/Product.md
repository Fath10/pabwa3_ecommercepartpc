# Products API

Base path: `/api/products`

## List products

- Endpoint: GET `/api/products/` — public
- Response: array of product summaries

## Get product

- Endpoint: GET `/api/products/:id` — public
- Response: detailed product object termasuk `images` dan `badges`

## Create product

- Endpoint: POST `/api/products/` — requires auth + admin
- Content-Type: `multipart/form-data`
- Fields:
  - `category_id` (required)
  - `product_name` (required)
  - `price` (required)
  - `original_price` (required)
  - `stock` (required)
  - `description` (optional)
  - `specs` (optional, JSON string)
  - `badge_ids` (optional, JSON string array)
  - `images` — up to 5 files, allowed types: `image/jpeg, image/png, image/webp`

- Success: 201 with created product

## Update product

- Endpoint: PUT `/api/products/:id` — requires auth + admin
- Supports same multipart fields as create

## Delete product

- Soft delete: DELETE `/api/products/:id` — requires auth + admin
- Permanent delete: DELETE `/api/products/:id/permanent` — requires auth + admin

## File upload notes

- Files are saved to `uploads/products` and served at `/uploads/<filename>`

## Contoh singkat (curl)

```sh
curl -X POST http://localhost:3000/api/products \
	-H "Authorization: Bearer <TOKEN>" \
	-F "category_id=1" \
	-F "product_name=My Product" \
	-F "price=1000" \
	-F "original_price=1200" \
	-F "stock=10" \
	-F "specs={\"cpu\":\"ryzen\"}" \
	-F "images=@path/to/image1.png"
```

## Contoh response sukses (examples)

- List products (200):

```json
[
  {
    "id": 12,
    "name": "Contoh Produk",
    "category": "Processor",
    "price": 150000,
    "originalPrice": 170000,
    "image": "/uploads/1780379230526.png",
    "badge": "Hot",
    "badgeColor": "#ff0000",
    "rating": 4.5,
    "reviews": 10,
    "stock": 10,
    "description": "Deskripsi singkat",
    "specs": { "cpu": "ryzen" }
  }
]
```

- Get product (200):

```json
{
  "id": 12,
  "name": "Contoh Produk",
  "categoryId": 1,
  "category": "Processor",
  "price": 150000,
  "originalPrice": 170000,
  "images": ["/uploads/1780379230526.png"],
  "badges": [{ "id": 1, "name": "Hot", "color": "#ff0000" }],
  "rating": 4.5,
  "reviewCount": 10,
  "reviews": [],
  "stock": 10,
  "description": "Deskripsi lengkap produk",
  "specs": { "cpu": "ryzen" },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  "isActive": true
}
```

- Create product (201):

```json
{
  "message": "Produk berhasil dibuat",
  "product": {
    "product_id": 21,
    "product_name": "Nama Baru",
    "category_id": 1,
    "price": 1000,
    "original_price": 1200,
    "stock": 10,
    "specs": { "cpu": "ryzen" }
  }
}
```

- Update product (200):

```json
{
  "message": "Produk berhasil diupdate",
  "product": {
    "product_id": 21,
    "product_name": "Nama Baru Updated",
    "stock": 8
  }
}
```

- Delete product (200):

```json
{ "message": "Produk dihapus" }
```
