// ─────────────────────────────────────────────────────────────
// e-BuildPC API — typed resource functions for every backend route.
// UI code should import from here rather than calling fetch directly.
// ─────────────────────────────────────────────────────────────
import { http, assetUrl } from './client.js'

// Neutral placeholder shown when a product has no uploaded image.
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="#f1f5f9"/>
      <g fill="none" stroke="#cbd5e1" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="120" y="120" width="160" height="160" rx="16"/>
        <path d="M120 250l45-45 35 35 50-55 30 30"/>
      </g>
      <text x="200" y="330" font-family="Arial, sans-serif" font-size="22" fill="#94a3b8" text-anchor="middle">e-BuildPC</text>
    </svg>`
  )

/** Convert a specs value (jsonb object or array) into a string array for display. */
function normalizeSpecs(specs) {
  if (!specs) return []
  if (Array.isArray(specs)) return specs
  if (typeof specs === 'object') {
    return Object.entries(specs).map(([key, value]) =>
      // Render as "Key: Value" when the spec is a key/value pair.
      /^\d+$/.test(key) ? String(value) : `${key}: ${value}`
    )
  }
  return [String(specs)]
}

/** Normalize a product from the list endpoint into the shape the UI expects. */
export function normalizeProduct(p) {
  return {
    ...p,
    image: p.image ? assetUrl(p.image) : PLACEHOLDER_IMAGE,
    specs: normalizeSpecs(p.specs),
    rating: Number(p.rating || 0),
    reviews: Number(p.reviews || 0),
    stock: Number(p.stock || 0),
    price: Number(p.price || 0),
    originalPrice: Number(p.originalPrice || 0),
  }
}

/** Normalize the richer product-detail payload. */
export function normalizeProductDetail(p) {
  const images = (p.images || []).map(assetUrl)
  const firstBadge = (p.badges && p.badges[0]) || null
  return {
    ...p,
    images,
    image: images[0] || PLACEHOLDER_IMAGE,
    badge: firstBadge?.name || null,
    badgeColor: firstBadge?.color || null,
    specs: normalizeSpecs(p.specs),
    rating: Number(p.rating || 0),
    reviews: Number(p.reviewCount || 0),
    stock: Number(p.stock || 0),
    price: Number(p.price || 0),
    originalPrice: Number(p.originalPrice || 0),
  }
}

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  register: (payload) => http.post('/api/auth/register', payload),
  login: (payload) => http.post('/api/auth/login', payload),
  googleLogin: (token) => http.post('/api/auth/google', { token }),
  me: () => http.get('/api/auth/me', { auth: true }),
  updateProfile: (formData) => http.put('/api/auth/profile', formData, { auth: true }),
  forgotPassword: (payload) => http.post('/api/auth/forgot-password', payload),
  resetPassword: (payload) => http.post('/api/auth/reset-password', payload),
}

// ── Products ──────────────────────────────────────────
export const productApi = {
  async list() {
    const data = await http.get('/api/products')
    return (Array.isArray(data) ? data : []).map(normalizeProduct)
  },
  async get(id) {
    const data = await http.get(`/api/products/${id}`)
    return normalizeProductDetail(data)
  },
  // Admin (multipart/form-data). Exposed for completeness / admin tooling.
  create: (formData) => http.post('/api/products', formData, { auth: true }),
  update: (id, formData) => http.put(`/api/products/${id}`, formData, { auth: true }),
  remove: (id) => http.delete(`/api/products/${id}`, { auth: true }),
  removePermanent: (id) => http.delete(`/api/products/${id}/permanent`, { auth: true }),
}

// ── Categories ────────────────────────────────────────
export const categoryApi = {
  async list() {
    const res = await http.get('/api/categories')
    return res?.data || []
  },
  get: (id) => http.get(`/api/categories/${id}`),
  create: (payload) => http.post('/api/categories', payload, { auth: true }),
  update: (id, payload) => http.put(`/api/categories/${id}`, payload, { auth: true }),
  remove: (id) => http.delete(`/api/categories/${id}`, { auth: true }),
}

// ── Badges ────────────────────────────────────────────
export const badgeApi = {
  list: () => http.get('/api/badges'),
  get: (id) => http.get(`/api/badges/${id}`),
  create: (payload) => http.post('/api/badges', payload, { auth: true }),
  update: (id, payload) => http.put(`/api/badges/${id}`, payload, { auth: true }),
  remove: (id) => http.delete(`/api/badges/${id}`, { auth: true }),
}

// ── Cart (all require auth) ───────────────────────────
export const cartApi = {
  get: () => http.get('/api/cart', { auth: true }),
  add: (productId) => http.post('/api/cart', { product_id: productId }, { auth: true }),
  increase: (cartId) => http.put(`/api/cart/${cartId}/increase`, {}, { auth: true }),
  decrease: (cartId) => http.put(`/api/cart/${cartId}/decrease`, {}, { auth: true }),
  remove: (cartId) => http.delete(`/api/cart/${cartId}`, { auth: true }),
  clear: () => http.delete('/api/cart', { auth: true }),
}

// ── Orders ────────────────────────────────────────────
export const orderApi = {
  checkout: (productIds) => http.post('/api/orders/checkout', { product_ids: productIds }, { auth: true }),
  list: () => http.get('/api/orders', { auth: true }),
  get: (id) => http.get(`/api/orders/${id}`, { auth: true }),
  // Admin order status transitions.
  process: (id) => http.patch(`/api/orders/${id}/process`, {}, { auth: true }),
  ship: (id, shipping_receipt) =>
    http.patch(`/api/orders/${id}/ship`, { shipping_receipt }, { auth: true }),
  deliver: (id) => http.patch(`/api/orders/${id}/deliver`, {}, { auth: true }),
}

// ── Reviews ───────────────────────────────────────────
export const reviewApi = {
  listByProduct: (productId) => http.get(`/api/reviews/product/${productId}`),
  create: (productId, payload) =>
    http.post(`/api/reviews/product/${productId}`, payload, { auth: true }),
  update: (reviewId, payload) => http.put(`/api/reviews/${reviewId}`, payload, { auth: true }),
  remove: (reviewId) => http.delete(`/api/reviews/${reviewId}`, { auth: true }),
}

// ── AI Chat ───────────────────────────────────────────
export const chatApi = {
  send: (message, history) => http.post('/api/chat-ai', { message, history }),
}

// ── Admin Chat ───────────────────────────────────────────────────────────────
export const adminChatApi = {
  list: () => http.get('/api/admin-chats', { auth: true }),
  create: (productId) => http.post('/api/admin-chats', { product_id: productId }, { auth: true }),
  get: (threadId) => http.get(`/api/admin-chats/${threadId}`, { auth: true }),
  send: (threadId, message) =>
    http.post(`/api/admin-chats/${threadId}/messages`, { message }, { auth: true }),
  remove: (threadId) => http.delete(`/api/admin-chats/${threadId}`, { auth: true }),
}

export { assetUrl }
