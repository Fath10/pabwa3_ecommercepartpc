# Reviews API

Base path: `/api/reviews`

## List product reviews

- Endpoint: GET `/api/reviews/product/:productId` — public
- Response: array of reviews with `review_id, rating, comment, created_at, user_id, name`

## Create review

- Endpoint: POST `/api/reviews/product/:productId` — requires auth
- Body (application/json): `{ "rating": 4, "comment": "Bagus" }` (rating 1-5)
- Validation: rating wajib antara 1-5, user hanya boleh satu review per produk
- Success: 201 returns created review object

## Update review

- Endpoint: PUT `/api/reviews/:id` — requires auth
- Body: `{ "rating": 5, "comment": "Updated" }`
- Success: 200 returns updated review

## Delete review

- Endpoint: DELETE `/api/reviews/:id` — requires auth
- Success: 200 with `{ message: "Review berhasil dihapus" }`

## Contoh singkat (curl)

```sh
curl -X POST http://localhost:3000/api/reviews/product/12 \
	-H "Authorization: Bearer <TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"rating":5,"comment":"Great product"}'
```

## Contoh response sukses (examples)

- List reviews (200):

```json
[
  {
    "review_id": 3,
    "rating": 5,
    "comment": "Great product",
    "created_at": "2024-01-02T00:00:00.000Z",
    "user_id": 2,
    "name": "Andy Cole"
  }
]
```

- Create review (201):

```json
{
  "review_id": 10,
  "product_id": 12,
  "user_id": 2,
  "rating": 5,
  "comment": "Great product",
  "created_at": "2024-06-03T12:00:00.000Z"
}
```

- Update review (200):

```json
{
  "review_id": 10,
  "product_id": 12,
  "user_id": 2,
  "rating": 4,
  "comment": "Updated comment",
  "updated_at": "2024-06-03T12:30:00.000Z"
}
```

- Delete review (200):

```json
{ "message": "Review berhasil dihapus" }
```
