<template>
  <main class="min-h-screen pt-24 px-6 pb-10 admin-bg">
    <section class="max-w-7xl mx-auto">
      <div class="admin-header mb-7">
        <div>
          <p class="admin-kicker">Admin Workspace</p>
          <h1 class="admin-title">Dashboard</h1>
          <p class="admin-user">Halo, {{ userStore.user?.name || 'Admin' }}</p>
        </div>

        <button @click="loadDashboardData" class="primary-btn">
          Refresh Data
        </button>
      </div>

      <div
        v-if="errorMessage"
        class="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 px-4 py-3"
      >
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div class="stat-card stat-blue">
          <div>
            <p class="stat-label">Produk</p>
            <h2 class="stat-number">{{ products.length }}</h2>
          </div>
          <div class="stat-icon">📦</div>
        </div>

        <div class="stat-card stat-green">
          <div>
            <p class="stat-label">Total Stok</p>
            <h2 class="stat-number">{{ totalStock }}</h2>
          </div>
          <div class="stat-icon">📊</div>
        </div>

        <div class="stat-card stat-amber">
          <div>
            <p class="stat-label">Pesanan</p>
            <h2 class="stat-number">{{ orders.length }}</h2>
          </div>
          <div class="stat-icon">🧾</div>
        </div>

        <div class="stat-card stat-purple">
          <div>
            <p class="stat-label">Pendapatan</p>
            <h2 class="stat-number small">{{ formatPrice(totalRevenue) }}</h2>
          </div>
          <div class="stat-icon">💰</div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Stok Menipis</h2>
              <p class="panel-sub">{{ lowStockProducts.length }} produk perlu dicek</p>
            </div>

            <RouterLink to="/admin/produk" class="panel-link">
              Kelola
            </RouterLink>
          </div>

          <div v-if="isLoadingProducts" class="empty-state">
            Memuat produk...
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="product in lowStockProducts"
              :key="product.id"
              class="mini-row"
            >
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-10 h-10 rounded-xl object-cover bg-white/5"
                  @error="handleImageError"
                />

                <div class="min-w-0">
                  <p class="text-white font-bold text-sm truncate">
                    {{ product.name }}
                  </p>
                  <p class="text-gray-500 text-xs">
                    {{ product.category }}
                  </p>
                </div>
              </div>

              <span class="stock-badge">
                {{ product.stock }}
              </span>
            </div>

            <div v-if="lowStockProducts.length === 0" class="empty-state">
              Stok aman.
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Pesanan Terbaru</h2>
              <p class="panel-sub">{{ orders.length }} pesanan tercatat</p>
            </div>

            <RouterLink to="/admin/pesanan" class="panel-link">
              Lihat
            </RouterLink>
          </div>

          <div v-if="isLoadingOrders" class="empty-state">
            Memuat pesanan...
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="mini-row"
            >
              <div class="min-w-0">
                <p class="text-white font-bold text-sm">
                  #{{ order.id }}
                </p>
                <p class="text-gray-500 text-xs truncate">
                  {{ order.customer }}
                </p>
              </div>

              <span class="status-badge" :class="statusClass(order.status)">
                {{ formatStatus(order.status) }}
              </span>
            </div>

            <div v-if="recentOrders.length === 0" class="empty-state">
              Belum ada pesanan.
            </div>
          </div>
        </section>

        <section class="panel">
          <h2 class="panel-title mb-4">Aksi Cepat</h2>

          <div class="grid grid-cols-1 gap-3">
            <RouterLink to="/admin/produk" class="action-card">
              <span class="action-icon bg-indigo-500/20">📦</span>
              <span>Kelola Produk</span>
            </RouterLink>

            <RouterLink to="/admin/pesanan" class="action-card">
              <span class="action-icon bg-amber-500/20">🧾</span>
              <span>Kelola Pesanan</span>
            </RouterLink>

            <RouterLink to="/admin/pengguna" class="action-card">
              <span class="action-icon bg-emerald-500/20">👤</span>
              <span>Kelola Pengguna</span>
            </RouterLink>

            <RouterLink to="/katalog" class="action-card">
              <span class="action-icon bg-sky-500/20">🛒</span>
              <span>Lihat Katalog</span>
            </RouterLink>
          </div>
        </section>
      </div>

      <section class="summary-strip">
        <div>
          <p class="summary-label">Kategori</p>
          <p class="summary-value">{{ totalCategories }}</p>
        </div>

        <div>
          <p class="summary-label">Menunggu</p>
          <p class="summary-value text-amber-300">{{ countByStatus('Menunggu') }}</p>
        </div>

        <div>
          <p class="summary-label">Diproses</p>
          <p class="summary-value text-blue-300">{{ countByStatus('Diproses') }}</p>
        </div>

        <div>
          <p class="summary-label">Selesai</p>
          <p class="summary-value text-green-300">{{ countByStatus('Selesai') }}</p>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatPrice, userStore } from '../../store.js'

const API_BASE_URL = 'http://localhost:3000'

const products = ref([])
const orders = ref([])
const isLoadingProducts = ref(false)
const isLoadingOrders = ref(false)
const errorMessage = ref('')

const totalStock = computed(() => {
  return products.value.reduce((sum, product) => sum + product.stock, 0)
})

const totalCategories = computed(() => {
  return new Set(products.value.map(product => product.category).filter(Boolean)).size
})

const lowStockProducts = computed(() => {
  return products.value
    .filter(product => product.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5)
})

const totalRevenue = computed(() => {
  return orders.value
    .filter(order => formatStatus(order.status) === 'Selesai')
    .reduce((sum, order) => sum + order.total, 0)
})

const recentOrders = computed(() => {
  return [...orders.value].slice(0, 5)
})

function countByStatus(status) {
  return orders.value.filter(order => formatStatus(order.status) === status).length
}

function extractArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data.products)) return data.products
  if (Array.isArray(data.orders)) return data.orders
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.result)) return data.result
  if (Array.isArray(data.rows)) return data.rows
  return []
}

function getImageUrl(product) {
  const image =
    product.image ||
    product.image_url ||
    product.thumbnail ||
    product.photo ||
    product.picture ||
    product.images

  if (!image) return '/corsair_ram.png'

  if (Array.isArray(image)) {
    const first = image[0]
    if (!first) return '/corsair_ram.png'

    if (typeof first === 'string') {
      return getImageUrl({ image: first })
    }

    return getImageUrl({
      image: first.image_url || first.url || first.path || first.filename,
    })
  }

  if (typeof image !== 'string') return '/corsair_ram.png'
  if (image.startsWith('http')) return image
  if (image.startsWith('/uploads')) return `${API_BASE_URL}${image}`
  if (image.startsWith('uploads')) return `${API_BASE_URL}/${image}`
  if (image.startsWith('/')) return image

  return `${API_BASE_URL}/uploads/${image}`
}

function normalizeProduct(product) {
  return {
    id: product.product_id ?? product.id,
    name: product.name ?? product.product_name ?? product.title ?? 'Produk tanpa nama',
    category:
      product.category_name ??
      product.category ??
      product.category_title ??
      product.category?.name ??
      '-',
    price: Number(product.price ?? product.product_price ?? product.final_price ?? 0),
    stock: Number(product.stock ?? product.quantity ?? product.product_stock ?? 0),
    image: getImageUrl(product),
  }
}

function normalizeOrder(order) {
  const items = order.items ?? order.order_items ?? []

  const productText = Array.isArray(items) && items.length > 0
    ? items.map(item => item.product_name ?? item.name ?? item.product?.name ?? 'Produk').join(', ')
    : order.product_name ?? order.product ?? '-'

  return {
    id: order.order_id ?? order.id,
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
    total: Number(order.total_amount ?? order.total_price ?? order.total ?? order.grand_total ?? 0),
    status: order.status ?? order.order_status ?? 'pending',
  }
}

function formatStatus(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'pending' || value === 'menunggu') return 'Menunggu'
  if (value === 'processing' || value === 'process' || value === 'diproses') return 'Diproses'
  if (value === 'shipped' || value === 'dikirim') return 'Dikirim'
  if (value === 'delivered' || value === 'selesai') return 'Selesai'
  if (value === 'cancelled' || value === 'dibatalkan') return 'Dibatalkan'

  return status || '-'
}

function statusClass(status) {
  const value = formatStatus(status)

  if (value === 'Menunggu') return 'status-amber'
  if (value === 'Diproses') return 'status-blue'
  if (value === 'Dikirim') return 'status-indigo'
  if (value === 'Selesai') return 'status-green'
  if (value === 'Dibatalkan') return 'status-red'

  return 'status-gray'
}

function handleImageError(event) {
  event.target.src = '/corsair_ram.png'
}

async function loadProducts() {
  isLoadingProducts.value = true
  errorMessage.value = ''

  try {
    const res = await fetch(`${API_BASE_URL}/api/products`)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Gagal mengambil data produk')
    }

    products.value = extractArray(data).map(normalizeProduct)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoadingProducts.value = false
  }
}

async function loadOrders() {
  isLoadingOrders.value = true

  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Gagal mengambil data pesanan')
    }

    orders.value = extractArray(data).map(normalizeOrder)
  } catch (error) {
    orders.value = []
  } finally {
    isLoadingOrders.value = false
  }
}

async function loadDashboardData() {
  await Promise.all([
    loadProducts(),
    loadOrders(),
  ])
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-bg {
  background:
    radial-gradient(circle at 12% 10%, rgba(79, 70, 229, 0.14), transparent 28%),
    radial-gradient(circle at 88% 16%, rgba(14, 165, 233, 0.10), transparent 26%),
    radial-gradient(circle at 80% 90%, rgba(16, 185, 129, 0.08), transparent 26%),
    #0d1117;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px;
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(135deg, rgba(79,70,229,0.12), rgba(14,165,233,0.06)),
    rgba(255,255,255,0.035);
}

.admin-kicker {
  color: #818cf8;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.admin-title {
  color: white;
  font-size: 2.2rem;
  font-weight: 950;
  margin-top: 4px;
}

.admin-user {
  color: #94a3b8;
  margin-top: 4px;
}

.primary-btn {
  padding: 10px 16px;
  border-radius: 14px;
  background: rgba(99,102,241,0.16);
  border: 1px solid rgba(129,140,248,0.35);
  color: #c7d2fe;
  font-size: 0.85rem;
  font-weight: 800;
  transition: 0.2s;
}

.primary-btn:hover {
  background: rgba(99,102,241,0.25);
  color: white;
}

.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 125px;
  padding: 20px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  overflow: hidden;
  position: relative;
}

.stat-card::after {
  content: "";
  position: absolute;
  right: -38px;
  bottom: -52px;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  opacity: 0.18;
}

.stat-blue::after {
  background: #3b82f6;
}

.stat-green::after {
  background: #22c55e;
}

.stat-amber::after {
  background: #f59e0b;
}

.stat-purple::after {
  background: #8b5cf6;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 800;
}

.stat-number {
  color: white;
  font-size: 2rem;
  font-weight: 950;
  margin-top: 7px;
  position: relative;
  z-index: 2;
}

.stat-number.small {
  font-size: 1.45rem;
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  position: relative;
  z-index: 2;
}

.panel {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  border-radius: 22px;
  padding: 18px;
}

.panel-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.panel-title {
  color: white;
  font-size: 1rem;
  font-weight: 900;
}

.panel-sub {
  color: #64748b;
  font-size: 0.78rem;
  margin-top: 3px;
}

.panel-link {
  color: #c7d2fe;
  font-size: 0.78rem;
  font-weight: 900;
  padding: 7px 10px;
  border-radius: 10px;
  background: rgba(99,102,241,0.12);
}

.mini-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255,255,255,0.045);
}

.stock-badge {
  min-width: 34px;
  height: 28px;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.14);
  color: #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 900;
}

.status-badge {
  white-space: nowrap;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 900;
}

.status-amber {
  background: rgba(245,158,11,0.13);
  color: #fbbf24;
}

.status-blue {
  background: rgba(59,130,246,0.13);
  color: #93c5fd;
}

.status-indigo {
  background: rgba(99,102,241,0.13);
  color: #a5b4fc;
}

.status-green {
  background: rgba(34,197,94,0.13);
  color: #86efac;
}

.status-red {
  background: rgba(244,63,94,0.13);
  color: #fda4af;
}

.status-gray {
  background: rgba(148,163,184,0.13);
  color: #cbd5e1;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  border-radius: 16px;
  color: #e5e7eb;
  font-weight: 800;
  background: rgba(255,255,255,0.045);
  transition: 0.2s;
}

.action-card:hover {
  background: rgba(99,102,241,0.16);
  color: white;
  transform: translateX(2px);
}

.action-icon {
  width: 38px;
  height: 38px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  padding: 28px 10px;
  color: #64748b;
  text-align: center;
  font-size: 0.9rem;
}

.summary-strip {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  border-radius: 20px;
  padding: 14px;
}

.summary-label {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
}

.summary-value {
  color: white;
  font-size: 1.25rem;
  font-weight: 950;
  margin-top: 4px;
}

@media (min-width: 768px) {
  .summary-strip {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .admin-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .admin-title {
    font-size: 1.8rem;
  }
}
</style>