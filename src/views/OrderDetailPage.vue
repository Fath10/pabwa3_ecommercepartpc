<template>
  <main class="pt-20 pb-16 min-h-screen" style="background: #f9fafb;">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Back to Profile Link -->
      <div class="mb-6">
        <RouterLink to="/profile#orders-section" class="inline-flex items-center gap-2 text-sm transition-all duration-200 hover:-translate-x-1" style="color: #6b7280;">
          ← Kembali ke Profil
        </RouterLink>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <svg class="w-8 h-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 p-6 rounded-2xl text-center border border-red-200">
        <p class="text-red-600 font-semibold mb-2">Gagal memuat detail pesanan</p>
        <p class="text-sm text-red-500 mb-4">{{ error }}</p>
        <button @click="fetchOrderDetail" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">Coba Lagi</button>
      </div>

      <!-- Content -->
      <div v-else-if="order" class="space-y-6">
        
        <!-- Header Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-gray-900 mb-1">Pesanan #{{ order.order_id }}</h1>
            <p class="text-sm text-gray-500">Dibuat pada {{ formatDate(order.created_at) }}</p>
          </div>
          <div>
            <span :class="['px-4 py-1.5 text-sm font-bold rounded-full border', statusConfig[order.status].bg, statusConfig[order.status].text, statusConfig[order.status].border]">
              {{ statusConfig[order.status].label }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left Column: Timeline & Action -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Timeline Status -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 class="text-lg font-bold text-gray-900 mb-6">Status Pengiriman</h2>
              
              <div class="relative">
                <!-- Vertical Line -->
                <div class="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                <!-- Timeline Items -->
                <div class="space-y-8 relative">
                  
                  <!-- Pending -->
                  <div class="flex gap-4">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10', stepIndex >= 0 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-100 text-gray-400']">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p :class="['text-sm font-bold', stepIndex >= 0 ? 'text-gray-900' : 'text-gray-500']">Pesanan Dibuat</p>
                      <p class="text-xs text-gray-500 mt-1">{{ formatDate(order.created_at, true) }}</p>
                    </div>
                  </div>

                  <!-- Processing -->
                  <div class="flex gap-4">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10', stepIndex >= 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-100 text-gray-400']">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <div>
                      <p :class="['text-sm font-bold', stepIndex >= 1 ? 'text-gray-900' : 'text-gray-500']">Sedang Diproses</p>
                      <p v-if="stepIndex >= 1" class="text-xs text-gray-500 mt-1">Penjual sedang menyiapkan pesanan Anda</p>
                    </div>
                  </div>

                  <!-- Shipped -->
                  <div class="flex gap-4">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10', stepIndex >= 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-100 text-gray-400']">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8n-2 2h-2m-6-12h2a2 2 0 012 2v2" /><path d="M13 16l-4-4m0 0l4-4m-4 4h12" /></svg>
                    </div>
                    <div>
                      <p :class="['text-sm font-bold', stepIndex >= 2 ? 'text-gray-900' : 'text-gray-500']">Dikirim</p>
                      <div v-if="stepIndex >= 2" class="mt-1">
                        <p class="text-xs text-gray-500">{{ formatDate(order.shipped_at, true) }}</p>
                        <p class="text-xs font-semibold text-indigo-600 mt-1 bg-indigo-50 px-2 py-1 rounded inline-block">Resi: {{ order.shipping_receipt || 'Tidak ada info resi' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Delivered -->
                  <div class="flex gap-4">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10', stepIndex >= 3 ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-gray-100 text-gray-400']">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p :class="['text-sm font-bold', stepIndex >= 3 ? 'text-emerald-600' : 'text-gray-500']">Pesanan Selesai</p>
                      <p v-if="stepIndex >= 3" class="text-xs text-gray-500 mt-1">{{ formatDate(order.delivered_at, true) }}</p>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Confirm Received Action -->
              <div v-if="order.status === 'shipped'" class="mt-8 pt-6 border-t border-gray-100 text-center">
                <p class="text-sm text-gray-600 mb-4">Apakah pesanan Anda sudah sampai dengan aman?</p>
                <button 
                  @click="confirmDelivery" 
                  :disabled="isConfirming"
                  class="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 flex justify-center items-center gap-2 mx-auto hover:-translate-y-0.5" 
                  style="background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 14px rgba(16,185,129,0.3);"
                >
                  <svg v-if="isConfirming" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Ya, Pesanan Diterima
                </button>
                <p v-if="confirmError" class="text-xs text-red-500 mt-2">{{ confirmError }}</p>
              </div>

            </div>

            <!-- Items List -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Produk yang Dibeli</h2>
              </div>
              <div class="divide-y divide-gray-100">
                <div v-for="item in items" :key="item.order_item_id" class="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                  <div class="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <img :src="item.image_url ? assetUrl(item.image_url) : PLACEHOLDER" :alt="item.product_name" class="w-16 h-16 object-contain" />
                  </div>
                  <div class="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 class="font-bold text-sm text-gray-900 line-clamp-2 mb-1">{{ item.product_name }}</h3>
                    <p class="text-xs text-gray-500 mb-2">{{ item.quantity }} pcs x {{ formatPrice(item.price) }}</p>
                    <p class="font-bold text-indigo-600 text-sm">{{ formatPrice(item.quantity * item.price) }}</p>
                  </div>
                  <!-- Optional: Write Review Button if delivered -->
                  <div v-if="order.status === 'delivered'" class="flex-shrink-0 flex items-center">
                    <RouterLink :to="`/produk/${item.product_id}`" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors">
                      Beri Ulasan
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Column: Summary -->
          <div class="lg:col-span-1 space-y-6">
            
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
              <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-4 border-b border-gray-100">Rincian Pembayaran</h2>
              
              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Total Harga ({{ totalItems }} barang)</span>
                  <span class="font-medium text-gray-900">{{ formatPrice(subtotal) }}</span>
                </div>
                <!-- Estimating shipping/tax from total_amount vs subtotal since backend only saves total_amount -->
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Biaya Lainnya (Pajak/Kurir)</span>
                  <span class="font-medium text-gray-900">{{ formatPrice(order.total_amount - subtotal) }}</span>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-900">Total Belanja</span>
                  <span class="font-black text-lg text-indigo-600">{{ formatPrice(order.total_amount) }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { orderApi, assetUrl, PLACEHOLDER_IMAGE } from '../api/index.js'
import { formatPrice } from '../store.js'

const route = useRoute()
const orderId = route.params.id

const order = ref(null)
const items = ref([])
const isLoading = ref(true)
const error = ref('')
const isConfirming = ref(false)
const confirmError = ref('')
const PLACEHOLDER = PLACEHOLDER_IMAGE

const statusConfig = {
  pending: { label: 'Menunggu diproses', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  processing: { label: 'Sedang Diproses', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  shipped: { label: 'Sedang Dikirim', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  delivered: { label: 'Pesanan Selesai', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
}

const statusOrder = ['pending', 'processing', 'shipped', 'delivered']

const stepIndex = computed(() => {
  if (!order.value) return -1
  return statusOrder.indexOf(order.value.status)
})

const subtotal = computed(() => {
  return items.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
})

const totalItems = computed(() => {
  return items.value.reduce((sum, item) => sum + item.quantity, 0)
})

async function fetchOrderDetail() {
  isLoading.value = true
  error.value = ''
  try {
    const data = await orderApi.get(orderId)
    order.value = data.order
    items.value = data.items || []
  } catch (err) {
    error.value = err.message || 'Gagal memuat detail pesanan'
  } finally {
    isLoading.value = false
  }
}

async function confirmDelivery() {
  isConfirming.value = true
  confirmError.value = ''
  try {
    const data = await orderApi.deliver(orderId)
    order.value = data.order
  } catch (err) {
    confirmError.value = err.message || 'Gagal mengonfirmasi pesanan'
  } finally {
    isConfirming.value = false
  }
}

function formatDate(dateString, includeTime = false) {
  if (!dateString) return '-'
  const opts = { day: 'numeric', month: 'short', year: 'numeric' }
  if (includeTime) {
    opts.hour = '2-digit'
    opts.minute = '2-digit'
  }
  return new Date(dateString).toLocaleDateString('id-ID', opts)
}

onMounted(() => {
  fetchOrderDetail()
})
</script>
