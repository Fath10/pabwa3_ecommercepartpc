# Orders API

Semua endpoint order memerlukan autentikasi (header `Authorization: Bearer <JWT_TOKEN>`). Beberapa action memerlukan role `admin`.

Base path: `/api/orders`

## Checkout

- Endpoint: POST `/api/orders/checkout` — auth required
- Action: buat order dari isi cart, mengurangi stok produk, lalu mengosongkan cart
- Success (201):

```json
{
  "message": "Checkout berhasil",
  "order": {
    "order_id": 10,
    "total_amount": 450000,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

- Errors: 400 jika cart kosong atau item melebihi stok

## Get user's orders

- Endpoint: GET `/api/orders/` — auth required
- Success: array of orders

## Get order by id

- Endpoint: GET `/api/orders/:id` — auth required (user harus pemilik order)
- Success: 200 dengan detail order dan items

## Admin actions (requires admin role)

- Process order: PATCH `/api/orders/:id/process` — ubah status ke `processing`
- Ship order: PATCH `/api/orders/:id/ship`
- Deliver order: PATCH `/api/orders/:id/deliver`

## Contoh singkat (curl)

```sh
curl -X POST http://localhost:3000/api/orders/checkout \
	-H "Authorization: Bearer <TOKEN>"
```

## Contoh response sukses (examples)

- Checkout (201):

```json
{
  "message": "Checkout berhasil",
  "order": {
    "order_id": 10,
    "total_amount": 450000,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

- Get user's orders (200):

```json
[
  {
    "order_id": 10,
    "user_id": 2,
    "total_amount": 450000,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

- Get order by id (200):

```json
{
  "order": {
    "order_id": 10,
    "user_id": 2,
    "total_amount": 450000,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "items": [
    {
      "order_item_id": 1,
      "product_id": 12,
      "product_name": "Contoh Produk",
      "quantity": 2,
      "price": 150000,
      "image_url": "/uploads/1780379230526.png"
    }
  ]
}
```

- Process/order status change (200):

```json
{
  "message": "Order berhasil diproses",
  "order": { "order_id": 10, "status": "processing" }
}
```
