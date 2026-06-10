# Cart API

Semua endpoint cart memerlukan autentikasi (header `Authorization: Bearer <JWT_TOKEN>`).

Base path: `/api/cart`

## Get cart

- Endpoint: GET `/api/cart/`
- Response (200):

```json
{
  "items": [
    {
      "cart_id": 1,
      "quantity": 2,
      "product_id": 12,
      "product_name": "Contoh Produk",
      "price": 150000,
      "stock": 10,
      "subtotal": 300000,
      "image_url": "/uploads/abcd.png",
      "out_of_stock": false,
      "exceeds_stock": false
    }
  ],
  "totalItems": 2,
  "totalPrice": 300000,
  "totalTax": 30000,
  "grandTotal": 330000
}
```

## Add to cart

- Endpoint: POST `/api/cart/`
- Body (application/json):

```json
{ "product_id": 12 }
```

- Success: 201 Created — returns cart item or message
- Errors: 400 if product_id missing or stock issues, 404 if product not found

## Increase quantity

- Endpoint: PUT `/api/cart/:id/increase`
- Path param: `id` = `cart_id`
- Success: 200 returns updated cart item
- Errors: 404 item not found, 400 if exceeds stock

## Decrease quantity

- Endpoint: PUT `/api/cart/:id/decrease`
- If quantity becomes 0 the item is removed and returns `{ deleted: true }` or updated item

## Remove item

- Endpoint: DELETE `/api/cart/:id`
- Success: 200 with message `"Produk dihapus"` or 404 if not found

## Clear cart

- Endpoint: DELETE `/api/cart/`
- Action: hapus semua item untuk user yang diautentikasi

## Contoh singkat (curl)

```sh
curl -X POST http://localhost:3000/api/cart \
	-H "Authorization: Bearer <TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"product_id":12}'
```

## Contoh response sukses (examples)

- Get cart (200):

```json
{
  "items": [
    {
      "cart_id": 1,
      "quantity": 2,
      "product_id": 12,
      "product_name": "Contoh Produk",
      "price": 150000,
      "stock": 10,
      "subtotal": 300000,
      "image_url": "/uploads/1780379230526.png",
      "out_of_stock": false,
      "exceeds_stock": false
    }
  ],
  "totalItems": 2,
  "totalPrice": 300000,
  "totalTax": 30000,
  "grandTotal": 330000
}
```

- Add to cart (201):

```json
{
  "message": "Produk ditambahkan ke keranjang",
  "cart": {
    "cart_id": 5,
    "user_id": 2,
    "product_id": 12,
    "quantity": 1
  }
}
```

- Increase quantity (200):

```json
{
  "cart_id": 5,
  "user_id": 2,
  "product_id": 12,
  "quantity": 2
}
```

- Decrease quantity when >1 (200):

```json
{
  "cart_id": 5,
  "user_id": 2,
  "product_id": 12,
  "quantity": 1
}
```

- Decrease quantity when becomes 0 (deleted) (200):

```json
{ "deleted": true }
```

- Remove item (200):

```json
{ "message": "Produk dihapus" }
```

- Clear cart (200):

```json
{
  "message": "Keranjang berhasil dikosongkan",
  "deleted_items": 3
}
```
