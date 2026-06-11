const API_BASE_URL = 'http://localhost:3000/api'

function getToken() {
  return localStorage.getItem('token')
}

export function getAuthHeaders() {
  const token = getToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function apiGet(path, useAuth = false) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: useAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' },
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengambil data')
  }

  return data
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Gagal menghapus data')
  }

  return data
}

export async function apiPatch(path, body = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Gagal memperbarui data')
  }

  return data
}

export function extractArray(data, possibleKeys = []) {
  if (Array.isArray(data)) return data

  for (const key of possibleKeys) {
    if (Array.isArray(data?.[key])) return data[key]
  }

  return []
}

export function getImageUrl(image) {
  if (!image) return '/corsair_ram.png'

  if (Array.isArray(image)) {
    const firstImage = image[0]
    return getImageUrl(firstImage?.image_url || firstImage?.url || firstImage?.path || firstImage)
  }

  if (typeof image !== 'string') return '/corsair_ram.png'

  if (image.startsWith('http')) return image
  if (image.startsWith('/uploads')) return `http://localhost:3000${image}`
  if (image.startsWith('uploads')) return `http://localhost:3000/${image}`
  if (image.startsWith('/')) return image

  return `http://localhost:3000/uploads/${image}`
}

export function normalizeProduct(product) {
  return {
    raw: product,
    id: product.product_id ?? product.id,
    name: product.name ?? product.product_name ?? product.title ?? 'Produk tanpa nama',
    category:
      product.category_name ??
      product.category ??
      product.category_title ??
      product.category?.name ??
      '-',
    price: Number(product.price ?? product.product_price ?? product.final_price ?? 0),
    originalPrice: Number(product.original_price ?? product.originalPrice ?? product.price ?? 0),
    stock: Number(product.stock ?? product.quantity ?? product.product_stock ?? 0),
    image: getImageUrl(product.image ?? product.image_url ?? product.images),
    badge: product.badge ?? product.badge_name ?? product.label ?? '-',
    rating: Number(product.rating ?? product.average_rating ?? 0),
    reviews: Number(product.reviews ?? product.review_count ?? 0),
  }
}

export function normalizeOrder(order) {
  const id = order.order_id ?? order.id

  const items = order.items ?? order.order_items ?? []
  const firstItem = Array.isArray(items) ? items[0] : null

  const productText = Array.isArray(items) && items.length > 0
    ? items
        .map(item => item.product_name ?? item.name ?? item.product?.name ?? 'Produk')
        .join(', ')
    : order.product_name ?? order.product ?? firstItem?.product_name ?? '-'

  return {
    raw: order,
    id,
    customer:
      order.customer_name ??
      order.name ??
      order.user_name ??
      order.fullname ??
      order.user?.name ??
      'Pelanggan',
    email:
      order.email ??
      order.user_email ??
      order.customer_email ??
      order.user?.email ??
      '-',
    product: productText,
    date:
      order.created_at ??
      order.order_date ??
      order.date ??
      '-',
    total: Number(order.total_amount ?? order.total_price ?? order.total ?? order.grand_total ?? 0),
    status: order.status ?? order.order_status ?? 'pending',
  }
}

export function formatStatus(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'pending' || value === 'menunggu') return 'Menunggu'
  if (value === 'processing' || value === 'process' || value === 'diproses') return 'Diproses'
  if (value === 'shipped' || value === 'dikirim') return 'Dikirim'
  if (value === 'delivered' || value === 'selesai') return 'Selesai'
  if (value === 'cancelled' || value === 'dibatalkan') return 'Dibatalkan'

  return status || '-'
}