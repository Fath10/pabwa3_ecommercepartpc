import { reactive } from 'vue'
import { authApi, productApi, cartApi, assetUrl, PLACEHOLDER_IMAGE } from './api/index.js'

// ════════════════════════════════════════════════════════════
// PRODUCT STORE — fetched from the backend (GET /api/products)
// ════════════════════════════════════════════════════════════
export const productStore = reactive({
  items: [],
  loading: false,
  loaded: false,
  error: null,

  async fetchAll(force = false) {
    if (this.loading) return
    if (this.loaded && !force) return

    this.loading = true
    this.error = null

    try {
      const list = await productApi.list()

      this.items.splice(0, this.items.length, ...list)
      this.loaded = true
    } catch (err) {
      this.error = err.message || 'Gagal memuat produk.'
    } finally {
      this.loading = false
    }
  },

  getById(id) {
    return this.items.find((product) => product.id === Number(id)) || null
  },

  get categories() {
    return [...new Set(this.items.map((product) => product.category).filter(Boolean))]
  },
})

// Backward-compatible alias: a stable reference to the reactive product list.
export const products = productStore.items

// ════════════════════════════════════════════════════════════
// USER SESSION STORE
// ════════════════════════════════════════════════════════════
export const userStore = reactive({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  get isLoggedIn() {
    return !!this.user && !!this.token
  },

  get isAdmin() {
    return this.user?.role === 'admin'
  },

  async login(userData, tokenData) {
    this.user = userData
    this.token = tokenData

    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenData)

    await cartStore.syncAfterLogin()
  },

  logout() {
    this.user = null
    this.token = null

    localStorage.removeItem('user')
    localStorage.removeItem('token')

    cartStore.reset()
  },

  async init() {
    if (!this.token) return

    try {
      const res = await authApi.me()

      if (res?.user) {
        this.user = res.user
        localStorage.setItem('user', JSON.stringify(res.user))
      }

      await cartStore.fetch()
    } catch {
      this.logout()
    }
  },
})

// Clear the session whenever any authenticated request returns 401/403.
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    if (userStore.isLoggedIn) {
      userStore.logout()
    }
  })
}

// ════════════════════════════════════════════════════════════
// CART STORE
// Logged-in users  → server cart (source of truth, GET/POST /api/cart)
// Guests           → local cart persisted to localStorage
// Both expose the same shape so the UI is identical.
// ════════════════════════════════════════════════════════════
const GUEST_CART_KEY = 'guest_cart'

function loadGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]')
  } catch {
    return []
  }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

export const cartStore = reactive({
  items: loadGuestCart(),
  loading: false,
  error: null,

  get totalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  get totalPrice() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },

  get isServer() {
    return userStore.isLoggedIn
  },

  _persistGuest() {
    if (!this.isServer) {
      saveGuestCart(this.items)
    }
  },

  _mapServerItem(row) {
    const product = productStore.getById(row.product_id)

    return {
      id: row.product_id,
      cartId: row.cart_id,
      name: row.product_name,
      price: Number(row.price),
      quantity: row.quantity,
      stock: row.stock,
      image: row.image_url ? assetUrl(row.image_url) : product?.image || PLACEHOLDER_IMAGE,
      category: product?.category || '',
      originalPrice: product?.originalPrice || 0,
      specs: product?.specs || [],
    }
  },

  async fetch() {
    if (!this.isServer) {
      this.items.splice(0, this.items.length, ...loadGuestCart())
      return
    }

    this.loading = true
    this.error = null

    try {
      const data = await cartApi.get()
      const mapped = (data.items || []).map((row) => this._mapServerItem(row))

      this.items.splice(0, this.items.length, ...mapped)
    } catch (err) {
      this.error = err.message || 'Gagal memuat keranjang.'
    } finally {
      this.loading = false
    }
  },

  async addItem(product) {
    if (this.isServer) {
      await cartApi.add(product.id)
      await this.fetch()
      return
    }

    const existing = this.items.find((item) => item.id === product.id)

    if (existing) {
      existing.quantity++
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        originalPrice: Number(product.originalPrice || 0),
        image: product.image,
        category: product.category,
        specs: product.specs || [],
        stock: product.stock,
        quantity: 1,
      })
    }

    this._persistGuest()
  },

  async updateQuantity(productId, quantity) {
    const item = this.items.find((cartItem) => cartItem.id === productId)
    if (!item) return

    if (this.isServer) {
      if (quantity <= 0) {
        return this.removeItem(productId)
      }

      const delta = quantity - item.quantity

      try {
        if (delta > 0) {
          for (let n = 0; n < delta; n++) {
            await cartApi.increase(item.cartId)
          }
        } else if (delta < 0) {
          for (let n = 0; n < -delta; n++) {
            await cartApi.decrease(item.cartId)
          }
        }
      } catch (err) {
        this.error = err.message
      }

      await this.fetch()
      return
    }

    if (quantity <= 0) {
      return this.removeItem(productId)
    }

    item.quantity = quantity
    this._persistGuest()
  },

  async removeItem(productId) {
    const item = this.items.find((cartItem) => cartItem.id === productId)
    if (!item) return

    if (this.isServer) {
      try {
        await cartApi.remove(item.cartId)
      } catch (err) {
        this.error = err.message
      }

      await this.fetch()
      return
    }

    const index = this.items.findIndex((cartItem) => cartItem.id === productId)

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    this._persistGuest()
  },

  async clearCart() {
    if (this.isServer) {
      try {
        await cartApi.clear()
      } catch (err) {
        if (err.status !== 404) {
          this.error = err.message
        }
      }

      await this.fetch()
      return
    }

    this.items.splice(0, this.items.length)
    this._persistGuest()
  },

  reset() {
    this.items.splice(0, this.items.length, ...loadGuestCart())
  },

  async syncAfterLogin() {
    const guestItems = loadGuestCart()

    if (guestItems.length > 0) {
      for (const item of guestItems) {
        try {
          await cartApi.add(item.id)

          for (let n = 1; n < item.quantity; n++) {
            const data = await cartApi.get()
            const row = (data.items || []).find((cartRow) => cartRow.product_id === item.id)

            if (row) {
              await cartApi.increase(row.cart_id)
            }
          }
        } catch {
          // Skip items that can't be added, for example out of stock.
        }
      }

      localStorage.removeItem(GUEST_CART_KEY)
    }

    await this.fetch()
  },
})

// ════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════
export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}