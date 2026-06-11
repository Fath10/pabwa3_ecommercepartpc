<template>
  <main class="min-h-screen pt-24 px-6 pb-10 admin-bg">
    <section class="max-w-7xl mx-auto">
      <div class="admin-header mb-7">
        <div>
          <p class="admin-kicker">Orders</p>
          <h1 class="admin-title">Kelola Pesanan</h1>
          <p class="admin-user">Halo, {{ userStore.user?.name || 'Admin' }}</p>
        </div>

        <button @click="loadOrders" class="primary-btn">
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
          <p class="stat-label">Total Pesanan</p>
          <h2 class="stat-number">{{ orders.length }}</h2>
        </div>

        <div class="stat-card stat-amber">
          <p class="stat-label">Menunggu</p>
          <h2 class="stat-number">{{ countByStatus('Menunggu') }}</h2>
        </div>

        <div class="stat-card stat-purple">
          <p class="stat-label">Diproses</p>
          <h2 class="stat-number">{{ countByStatus('Diproses') }}</h2>
        </div>

        <div class="stat-card stat-green">
          <p class="stat-label">Pendapatan</p>
          <h2 class="stat-number small">{{ formatPrice(totalRevenue) }}</h2>
        </div>
      </div>

      <section class="panel overflow-hidden">
        <div class="p-5 border-b border-white/10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <h2 class="text-white font-black">
            Daftar Pesanan
          </h2>

          <select v-model="selectedStatus" class="admin-input md:w-56">
            <option value="">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Dikirim">Dikirim</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div v-if="isLoading" class="empty-state">
          Memuat pesanan...
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-400 border-b border-white/10">
                <th class="px-5 py-3">ID</th>
                <th class="px-5 py-3">Pelanggan</th>
                <th class="px-5 py-3">Produk</th>
                <th class="px-5 py-3">Tanggal</th>
                <th class="px-5 py-3">Total</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="border-b border-white/5 text-gray-300 hover:bg-white/[0.03]"
              >
                <td class="px-5 py-3 font-bold text-white">
                  #{{ order.id }}
                </td>

                <td class="px-5 py-3">
                  <p class="font-semibold text-white">{{ order.customer }}</p>
                  <p class="text-xs text-gray-500">{{ order.email }}</p>
                </td>

                <td class="px-5 py-3 min-w-[220px]">
                  {{ order.product }}
                </td>

                <td class="px-5 py-3">
                  {{ formatDate(order.date) }}
                </td>

                <td class="px-5 py-3 font-semibold text-indigo-300">
                  {{ formatPrice(order.total) }}
                </td>

                <td class="px-5 py-3">
                  <span class="status-badge" :class="statusClass(order.status)">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>

                <td class="px-5 py-3">
                  <div class="flex justify-end">
                    <select
                      :value="formatStatus(order.status)"
                      @change="updateOrderStatus(order.id, $event.target.value)"
                      class="action-select"
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Dikirim">Dikirim</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredOrders.length === 0">
                <td colspan="7" class="px-5 py-8 text-center text-gray-500">
                  Pesanan tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatPrice, userStore } from '../../store.js'

const API_BASE_URL = 'http://localhost:3000'

const orders = ref([])
const selectedStatus = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const filteredOrders = computed(() => {
  if (!selectedStatus.value) return orders.value
  return orders.value.filter(order => formatStatus(order.status) === selectedStatus.value)
})

const totalRevenue = computed(() => {
  return orders.value
    .filter(order => formatStatus(order.status) === 'Selesai')
    .reduce((sum, order) => sum + order.total, 0)
})

function countByStatus(status) {
  return orders.value.filter(order => formatStatus(order.status) === status).length
}

function extractArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data.orders)) return data.orders
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.result)) return data.result
  if (Array.isArray(data.rows)) return data.rows
  return []
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
    date: order.created_at ?? order.order_date ?? order.date ?? '-',
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

async function loadOrders() {
  isLoading.value = true
  errorMessage.value = ''

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
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    const token = localStorage.getItem('token')
    let endpoint = ''
    let body = null

    if (status === 'Diproses') {
      endpoint = `/api/orders/${orderId}/process`
    } else if (status === 'Dikirim') {
      const receipt = prompt('Masukkan nomor resi pengiriman:')
      if (!receipt) {
        await loadOrders()
        return
      }

      endpoint = `/api/orders/${orderId}/ship`
      body = JSON.stringify({
        shipping_receipt: receipt,
      })
    } else if (status === 'Selesai') {
      endpoint = `/api/orders/${orderId}/deliver`
    } else {
      await loadOrders()
      return
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'Gagal memperbarui status pesanan')
    }

    await loadOrders()
  } catch (error) {
    alert(error.message)
    await loadOrders()
  }
}

function formatDate(date) {
  if (!date || date === '-') return '-'

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.admin-bg {
  background:
    radial-gradient(circle at 12% 10%, rgba(79, 70, 229, 0.12), transparent 28%),
    radial-gradient(circle at 88% 16%, rgba(245, 158, 11, 0.08), transparent 26%),
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
    linear-gradient(135deg, rgba(245,158,11,0.10), rgba(79,70,229,0.06)),
    rgba(255,255,255,0.035);
}

.admin-kicker {
  color: #fbbf24;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.admin-title {
  color: white;
  font-size: 2rem;
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
  background: rgba(245,158,11,0.13);
  border: 1px solid rgba(245,158,11,0.3);
  color: #fde68a;
  font-size: 0.85rem;
  font-weight: 800;
  transition: 0.2s;
}

.primary-btn:hover {
  background: rgba(245,158,11,0.22);
  color: white;
}

.stat-card {
  min-height: 118px;
  padding: 20px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  position: relative;
  overflow: hidden;
}

.stat-card::after {
  content: "";
  position: absolute;
  right: -38px;
  bottom: -52px;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  opacity: 0.16;
}

.stat-blue::after { background: #3b82f6; }
.stat-green::after { background: #22c55e; }
.stat-purple::after { background: #8b5cf6; }
.stat-amber::after { background: #f59e0b; }

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
}

.stat-number.small {
  font-size: 1.45rem;
}

.panel {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  border-radius: 22px;
}

.admin-input {
  padding: 12px 14px;
  border-radius: 14px;
  color: white;
  outline: none;
  background: rgba(255,255,255,0.055);
  border: 1px solid rgba(255,255,255,0.1);
}

.action-select {
  padding: 8px 11px;
  border-radius: 12px;
  color: white;
  outline: none;
  background: rgba(255,255,255,0.055);
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 0.75rem;
}

.status-badge {
  white-space: nowrap;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 900;
}

.status-amber { background: rgba(245,158,11,0.13); color: #fbbf24; }
.status-blue { background: rgba(59,130,246,0.13); color: #93c5fd; }
.status-indigo { background: rgba(99,102,241,0.13); color: #a5b4fc; }
.status-green { background: rgba(34,197,94,0.13); color: #86efac; }
.status-red { background: rgba(244,63,94,0.13); color: #fda4af; }
.status-gray { background: rgba(148,163,184,0.13); color: #cbd5e1; }

.empty-state {
  padding: 32px 10px;
  color: #64748b;
  text-align: center;
}
/* FIX SELECT DROPDOWN ADMIN - DARK MODE */
select.admin-input,
select.action-select {
  color-scheme: dark;
  background-color: rgba(17, 24, 39, 0.98) !important;
  color: #f8fafc !important;
  border-color: rgba(129, 140, 248, 0.45) !important;
}

select.admin-input:focus,
select.action-select:focus {
  border-color: rgba(129, 140, 248, 0.85) !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18) !important;
}

select.admin-input option,
select.admin-input optgroup,
select.action-select option,
select.action-select optgroup {
  background-color: #111827 !important;
  color: #f8fafc !important;
}

select.admin-input option:checked,
select.action-select option:checked {
  background-color: #2563eb !important;
  color: #ffffff !important;
}

select.admin-input option:hover,
select.action-select option:hover {
  background-color: #1d4ed8 !important;
  color: #ffffff !important;
}

</style>