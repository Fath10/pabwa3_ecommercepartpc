<template>
  <main class="checkout-page pt-20 pb-16 min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-10">
        <RouterLink
          to="/cart"
          class="back-link inline-flex items-center gap-2 text-sm mb-6 transition-all duration-200 hover:-translate-x-1"
        >
          ← Kembali ke Keranjang
        </RouterLink>

        <div>
          <h1 class="page-title text-3xl font-black mb-1">
            Konfirmasi <span class="gradient-text">Pesanan</span>
          </h1>
          <p class="page-muted text-sm">
            Lengkapi informasi pengiriman dan pembayaran Anda
          </p>
        </div>
      </div>

      <!-- Empty Cart Guard -->
      <div v-if="checkoutItems.length === 0" class="empty-state text-center py-24">
        <div class="empty-icon w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        <h2 class="page-title text-xl font-black mb-3">
          Keranjang Anda Kosong
        </h2>

        <p class="page-muted text-sm mb-6">
          Tidak ada produk yang bisa di-checkout.
        </p>

        <RouterLink
          to="/katalog"
          class="primary-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold"
        >
          Belanja Sekarang
        </RouterLink>
      </div>

      <!-- Checkout Content -->
      <div v-else class="grid lg:grid-cols-5 gap-8">
        <!-- LEFT COLUMN -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Detail Barang -->
          <section class="panel-card rounded-2xl overflow-hidden">
            <div class="panel-header px-6 py-4 flex items-center gap-3">
              <div class="icon-box icon-purple w-8 h-8 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>

              <h2 class="page-title font-black text-base">
                Detail Barang
              </h2>

              <span class="status-pill status-purple ml-auto text-xs px-2 py-0.5 rounded-full font-semibold">
                {{ checkoutTotalItems }} item
              </span>
            </div>

            <div class="divide-y checkout-divide">
              <div
                v-for="item in checkoutItems"
                :key="item.id"
                class="checkout-item flex gap-4 px-6 py-4 transition-colors duration-150"
              >
                <div class="item-image w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-contain p-2" />
                </div>

                <div class="flex-1 min-w-0">
                  <span class="status-pill status-purple inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5">
                    {{ item.category }}
                  </span>

                  <h3 class="page-title font-bold text-sm line-clamp-2 leading-snug mb-1">
                    {{ item.name }}
                  </h3>

                  <div v-if="item.specs && item.specs.length" class="flex flex-wrap gap-1 mb-2">
                    <span
                      v-for="spec in item.specs.slice(0, 2)"
                      :key="spec"
                      class="spec-chip text-xs px-1.5 py-0.5 rounded"
                    >
                      {{ spec }}
                    </span>
                  </div>

                  <div class="flex items-center gap-3 flex-wrap">
                    <div>
                      <p class="page-muted text-xs">Harga Satuan</p>
                      <p class="price-text font-bold text-sm">{{ formatPrice(item.price) }}</p>
                    </div>

                    <div class="mini-divider w-px h-8"></div>

                    <div>
                      <p class="page-muted text-xs">Jumlah</p>
                      <p class="page-title font-bold text-sm">{{ item.quantity }} pcs</p>
                    </div>

                    <div class="mini-divider w-px h-8"></div>

                    <div>
                      <p class="page-muted text-xs">Subtotal</p>
                      <p class="page-title font-bold text-sm">{{ formatPrice(item.price * item.quantity) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Pilihan Kurir -->
          <section class="panel-card rounded-2xl overflow-hidden">
            <div class="panel-header px-6 py-4 flex items-center gap-3">
              <div class="icon-box icon-green w-8 h-8 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              </div>

              <h2 class="page-title font-black text-base">
                Pilihan Kurir
              </h2>

              <span
                v-if="!selectedCourier"
                class="status-pill status-warning ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
              >
                Wajib dipilih
              </span>

              <span
                v-else
                class="status-pill status-success ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
              >
                Terpilih
              </span>
            </div>

            <div class="p-5 grid grid-cols-2 gap-3">
              <label
                v-for="courier in couriers"
                :key="courier.id"
                :id="`courier-${courier.id}`"
                class="option-card relative flex flex-col rounded-xl cursor-pointer transition-all duration-200 select-none overflow-hidden"
                :class="selectedCourier === courier.id ? 'option-selected' : ''"
              >
                <input type="radio" v-model="selectedCourier" :value="courier.id" class="hidden" />

                <div class="flex items-center justify-between px-4 py-3 courier-logo-area" :style="`background: ${courier.headerBg};`">
                  <div class="h-7 flex items-center" v-html="courier.svgLogo"></div>

                  <div
                    v-if="selectedCourier === courier.id"
                    class="selected-dot w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>

                  <div v-else class="empty-dot w-5 h-5 rounded-full border-2"></div>
                </div>

                <div class="option-footer px-4 py-2.5">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-semibold option-subtitle">{{ courier.eta }}</p>
                    <p class="font-black text-sm" :class="courier.price === 0 ? 'success-text' : 'page-title'">
                      {{ courier.price === 0 ? 'Gratis' : formatPrice(courier.price) }}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </section>

          <!-- Metode Pembayaran -->
          <section class="panel-card rounded-2xl overflow-hidden">
            <div class="panel-header px-6 py-4 flex items-center gap-3">
              <div class="icon-box icon-orange w-8 h-8 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>

              <h2 class="page-title font-black text-base">
                Metode Pembayaran
              </h2>

              <span
                v-if="!selectedPayment"
                class="status-pill status-warning ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
              >
                Wajib dipilih
              </span>

              <span
                v-else
                class="status-pill status-success ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
              >
                Terpilih
              </span>
            </div>

            <div class="px-5 pt-4">
              <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
                <button
                  v-for="tab in paymentTabs"
                  :key="tab.id"
                  @click="activePaymentTab = tab.id"
                  class="payment-tab px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                  :class="activePaymentTab === tab.id ? 'payment-tab-active' : ''"
                >
                  {{ tab.label }}
                </button>
              </div>

              <div class="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-5">
                <label
                  v-for="method in filteredPaymentMethods"
                  :key="method.id"
                  :id="`pay-${method.id}`"
                  class="option-card relative flex flex-col items-center rounded-xl cursor-pointer transition-all duration-200 select-none overflow-hidden"
                  :class="selectedPayment === method.id ? 'option-selected' : ''"
                >
                  <input type="radio" v-model="selectedPayment" :value="method.id" class="hidden" />

                  <div
                    v-if="selectedPayment === method.id"
                    class="selected-dot absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center z-10"
                  >
                    <svg class="w-2.5 h-2.5" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>

                  <div
                    class="w-full flex items-center justify-center py-3 px-2 payment-logo-area"
                    :style="`background: ${method.bg}; min-height: 60px;`"
                    v-html="method.svgLogo"
                  ></div>

                  <div class="option-footer w-full px-2 py-2 text-center">
                    <p class="page-title text-xs font-bold leading-tight">
                      {{ method.name }}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="lg:col-span-2">
          <div class="sticky top-24 space-y-4">
            <!-- Order Summary -->
            <div class="panel-card rounded-2xl overflow-hidden">
              <div class="panel-header px-6 py-4">
                <h2 class="page-title font-black text-base">
                  Ringkasan Pembayaran
                </h2>
              </div>

              <div class="px-6 py-5 space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="page-muted">Subtotal ({{ checkoutTotalItems }} item)</span>
                  <span class="page-title font-semibold">{{ formatPrice(checkoutTotalPrice) }}</span>
                </div>

                <div class="flex justify-between text-sm">
                  <span class="page-muted">Ongkos Kirim</span>
                  <span class="font-bold" :class="selectedCourierData?.price === 0 ? 'success-text' : 'page-title'">
                    {{ selectedCourierData ? (selectedCourierData.price === 0 ? 'Gratis' : formatPrice(selectedCourierData.price)) : '—' }}
                  </span>
                </div>

                <div class="flex justify-between text-sm">
                  <span class="page-muted">Pajak (11%)</span>
                  <span class="page-title font-semibold">{{ formatPrice(checkoutTotalPrice * 0.11) }}</span>
                </div>

                <div class="summary-divider pt-3">
                  <div class="flex justify-between items-center">
                    <span class="page-title font-bold">Total</span>
                    <span class="price-text font-black text-xl">{{ formatPrice(grandTotal) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Checklist Status -->
            <div class="panel-card rounded-2xl px-6 py-4 space-y-3">
              <p class="page-muted text-xs font-bold">
                STATUS KELENGKAPAN
              </p>

              <div class="flex items-center gap-3">
                <div
                  class="check-dot w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  :class="selectedCourier ? 'check-dot-active' : ''"
                >
                  <svg class="w-3 h-3" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <span class="text-sm" :class="selectedCourier ? 'page-title font-semibold' : 'page-muted'">
                  Kurir pengiriman
                </span>
              </div>

              <div class="flex items-center gap-3">
                <div
                  class="check-dot w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  :class="selectedPayment ? 'check-dot-active' : ''"
                >
                  <svg class="w-3 h-3" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <span class="text-sm" :class="selectedPayment ? 'page-title font-semibold' : 'page-muted'">
                  Metode pembayaran
                </span>
              </div>
            </div>

            <!-- Checkout Button -->
            <div>
              <div
                v-if="checkoutError"
                class="error-alert mb-3 px-4 py-3 rounded-xl text-sm font-semibold"
              >
                {{ checkoutError }}
              </div>

              <button
                id="confirm-checkout-btn"
                :disabled="!canCheckout"
                @click="handleConfirmCheckout"
                class="confirm-btn w-full py-4 rounded-2xl text-white font-black text-base transition-all duration-300 flex items-center justify-center gap-2"
                :class="canCheckout ? 'hover:-translate-y-1' : 'confirm-disabled'"
              >
                <svg v-if="isProcessing" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>

                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>

                {{ isProcessing
                  ? 'Memproses Pesanan…'
                  : (selectedCourier && selectedPayment ? 'Konfirmasi Pesanan' : 'Lengkapi Pilihan Terlebih Dahulu') }}
              </button>

              <p v-if="!selectedCourier || !selectedPayment" class="page-muted text-center text-xs mt-2">
                Pilih kurir dan metode pembayaran untuk melanjutkan
              </p>
            </div>

            <!-- Trust badges -->
            <div class="flex justify-center gap-6">
              <div class="trust-badge flex items-center gap-1.5 text-xs">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Aman & Terenkripsi
              </div>

              <div class="trust-badge flex items-center gap-1.5 text-xs">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Garansi Resmi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSuccess" class="modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="modal-card rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div class="success-icon w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 class="page-title text-2xl font-black mb-2">
              Pesanan Dikonfirmasi!
            </h2>

            <p class="page-muted text-sm mb-2">
              Terima kasih telah berbelanja di e-BuildPC.
            </p>

            <p class="page-muted text-sm mb-6">
              Pesanan Anda akan segera diproses dan dikirim melalui
              <strong class="page-title">{{ selectedCourierData?.name }}</strong>
              menggunakan
              <strong class="page-title">{{ selectedPaymentData?.name }}</strong>.
            </p>

            <div class="success-summary p-4 rounded-2xl mb-6">
              <p v-if="placedOrder" class="page-muted text-xs mb-1">
                Nomor Pesanan:
                <strong class="page-title">#{{ placedOrder.order_id }}</strong>
              </p>

              <p class="page-muted text-xs">
                Total Pembayaran
              </p>

              <p class="success-text text-2xl font-black">
                {{ formatPrice(grandTotal) }}
              </p>
            </div>

            <RouterLink
              to="/"
              @click="handleSuccessClose"
              class="primary-btn block w-full py-3 rounded-xl text-white font-bold transition-all duration-200"
            >
              Kembali ke Beranda
            </RouterLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { cartStore, formatPrice } from '../store.js'
import { orderApi } from '../api/index.js'

const selectedCheckoutIds = ref([])

const checkoutItems = computed(() => {
  if (selectedCheckoutIds.value.length === 0) {
    return cartStore.items
  }

  return cartStore.items.filter(item => selectedCheckoutIds.value.includes(item.id))
})

const checkoutTotalItems = computed(() => {
  return checkoutItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const checkoutTotalPrice = computed(() => {
  return checkoutItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

onMounted(() => {
  const saved = localStorage.getItem('selected_checkout_items')

  if (saved) {
    try {
      selectedCheckoutIds.value = JSON.parse(saved)
    } catch {
      selectedCheckoutIds.value = []
    }
  }

  cartStore.fetch()
})

const couriers = [
  {
    id: 'jne',
    name: 'JNE Regular',
    eta: 'Estimasi 3–5 hari kerja',
    price: 0,
    headerBg: '#fff7ed',
    svgLogo: `<svg viewBox="0 0 120 36" height="28" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="36" rx="6" fill="#ff6600"/>
      <text x="10" y="26" font-family="Arial Black,Arial" font-weight="900" font-size="22" fill="#fff" letter-spacing="1">JNE</text>
      <text x="70" y="26" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="#ffe0c0">express</text>
    </svg>`,
  },
  {
    id: 'jnt',
    name: 'J&T Express',
    eta: 'Estimasi 2–4 hari kerja',
    price: 0,
    headerBg: '#fef2f2',
    svgLogo: `<svg viewBox="0 0 120 36" height="28" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="36" rx="6" fill="#e30613"/>
      <text x="8" y="26" font-family="Arial Black,Arial" font-weight="900" font-size="20" fill="#fff" letter-spacing="0.5">J&amp;T</text>
      <text x="62" y="26" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="#ffb3b3">Express</text>
    </svg>`,
  },
  {
    id: 'sicepat',
    name: 'SiCepat',
    eta: 'Estimasi 1–2 hari kerja',
    price: 15000,
    headerBg: '#fffbeb',
    svgLogo: `<svg viewBox="0 0 120 36" height="28" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="36" rx="6" fill="#f97316"/>
      <circle cx="18" cy="18" r="12" fill="#fff"/>
      <text x="13" y="23" font-family="Arial Black,Arial" font-weight="900" font-size="13" fill="#f97316">Si</text>
      <text x="34" y="26" font-family="Arial Black,Arial" font-weight="900" font-size="18" fill="#fff">Cepat</text>
    </svg>`,
  },
  {
    id: 'gosend',
    name: 'GoSend',
    eta: 'Hari yang sama',
    price: 25000,
    headerBg: '#ecfdf5',
    svgLogo: `<svg viewBox="0 0 120 36" height="28" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="36" rx="6" fill="#00aa5b"/>
      <circle cx="18" cy="18" r="13" fill="#fff" opacity="0.15"/>
      <text x="8" y="25" font-family="Arial Black,Arial" font-weight="900" font-size="18" fill="#fff">Go</text>
      <text x="38" y="25" font-family="Arial,sans-serif" font-weight="700" font-size="15" fill="#d4f7e7">Send</text>
    </svg>`,
  },
]

const paymentTabs = [
  { id: 'all', label: 'Semua' },
  { id: 'transfer', label: 'Transfer Bank' },
  { id: 'ewallet', label: 'E-Wallet' },
  { id: 'qris', label: 'QRIS' },
]

const paymentMethods = [
  {
    id: 'bca',
    name: 'BCA',
    tab: 'transfer',
    bg: '#005bab',
    svgLogo: `<svg viewBox="0 0 90 40" width="80" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="30" font-family="Arial Black,Arial" font-weight="900" font-size="26" fill="#fff" letter-spacing="-1">BCA</text>
    </svg>`,
  },
  {
    id: 'mandiri',
    name: 'Mandiri',
    tab: 'transfer',
    bg: '#003d80',
    svgLogo: `<svg viewBox="0 0 90 40" width="80" xmlns="http://www.w3.org/2000/svg">
      <text x="2" y="22" font-family="Arial Black,Arial" font-weight="900" font-size="13" fill="#ffc300" letter-spacing="0.5">BANK</text>
      <text x="2" y="38" font-family="Arial Black,Arial" font-weight="900" font-size="15" fill="#fff" letter-spacing="0">MANDIRI</text>
    </svg>`,
  },
  {
    id: 'bri',
    name: 'BRI',
    tab: 'transfer',
    bg: '#003399',
    svgLogo: `<svg viewBox="0 0 90 40" width="80" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="30" font-family="Arial Black,Arial" font-weight="900" font-size="28" fill="#f3c813" letter-spacing="2">BRI</text>
    </svg>`,
  },
  {
    id: 'bni',
    name: 'BNI',
    tab: 'transfer',
    bg: '#f37021',
    svgLogo: `<svg viewBox="0 0 90 40" width="80" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="30" font-family="Arial Black,Arial" font-weight="900" font-size="28" fill="#fff" letter-spacing="2">BNI</text>
    </svg>`,
  },
  {
    id: 'gopay',
    name: 'GoPay',
    tab: 'ewallet',
    bg: '#00aa5b',
    svgLogo: `<svg viewBox="0 0 90 40" width="80" xmlns="http://www.w3.org/2000/svg">
      <text x="3" y="18" font-family="Arial Black,Arial" font-weight="900" font-size="13" fill="#d4f7e7">Go</text>
      <text x="3" y="36" font-family="Arial Black,Arial" font-weight="900" font-size="16" fill="#fff">Pay</text>
      <circle cx="70" cy="20" r="14" fill="#fff" opacity="0.15"/>
      <text x="61" y="26" font-family="Arial Black,Arial" font-weight="900" font-size="18" fill="#fff">G</text>
    </svg>`,
  },
  {
    id: 'ovo',
    name: 'OVO',
    tab: 'ewallet',
    bg: '#4c3494',
    svgLogo: `<svg viewBox="0 0 90 40" width="80" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="30" font-family="Arial Black,Arial" font-weight="900" font-size="26" fill="#fff" letter-spacing="1">OVO</text>
    </svg>`,
  },
  {
    id: 'dana',
    name: 'DANA',
    tab: 'ewallet',
    bg: '#118af4',
    svgLogo: `<svg viewBox="0 0 90 40" width="80" xmlns="http://www.w3.org/2000/svg">
      <text x="3" y="30" font-family="Arial Black,Arial" font-weight="900" font-size="24" fill="#fff" letter-spacing="1">DANA</text>
    </svg>`,
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    tab: 'ewallet',
    bg: '#ee4d2d',
    svgLogo: `<svg viewBox="0 0 90 40" width="80" xmlns="http://www.w3.org/2000/svg">
      <text x="2" y="20" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="#ffcfc5">Shopee</text>
      <text x="2" y="36" font-family="Arial Black,Arial" font-weight="900" font-size="15" fill="#fff">Pay</text>
      <circle cx="76" cy="20" r="12" fill="#fff" opacity="0.15"/>
      <text x="70" y="25" font-family="Arial Black,Arial" font-weight="900" font-size="14" fill="#fff">S</text>
    </svg>`,
  },
  {
    id: 'qris',
    name: 'QRIS',
    tab: 'qris',
    bg: '#1a1a2e',
    svgLogo: `<svg viewBox="0 0 90 40" width="80" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="12" height="12" rx="2" fill="none" stroke="#fff" stroke-width="2"/>
      <rect x="7" y="9" width="6" height="6" rx="1" fill="#fff"/>
      <rect x="4" y="22" width="12" height="12" rx="2" fill="none" stroke="#fff" stroke-width="2"/>
      <rect x="7" y="25" width="6" height="6" rx="1" fill="#fff"/>
      <rect x="20" y="6" width="12" height="12" rx="2" fill="none" stroke="#fff" stroke-width="2"/>
      <rect x="23" y="9" width="6" height="6" rx="1" fill="#fff"/>
      <line x1="20" y1="22" x2="32" y2="22" stroke="#fff" stroke-width="2"/>
      <line x1="20" y1="28" x2="26" y2="28" stroke="#fff" stroke-width="2"/>
      <line x1="26" y1="28" x2="26" y2="34" stroke="#fff" stroke-width="2"/>
      <line x1="26" y1="34" x2="32" y2="34" stroke="#fff" stroke-width="2"/>
      <line x1="32" y1="22" x2="32" y2="34" stroke="#fff" stroke-width="2"/>
      <text x="38" y="28" font-family="Arial Black,Arial" font-weight="900" font-size="13" fill="#fff" letter-spacing="1">QRIS</text>
      <text x="38" y="38" font-family="Arial,sans-serif" font-size="8" fill="#9ca3af">Scan &amp; Pay</text>
    </svg>`,
  },
]

const activePaymentTab = ref('all')
const selectedCourier = ref('')
const selectedPayment = ref('')
const showSuccess = ref(false)
const isProcessing = ref(false)
const checkoutError = ref('')
const placedOrder = ref(null)

const filteredPaymentMethods = computed(() => {
  if (activePaymentTab.value === 'all') return paymentMethods

  return paymentMethods.filter(m => m.tab === activePaymentTab.value)
})

const selectedCourierData = computed(() => couriers.find(c => c.id === selectedCourier.value) || null)
const selectedPaymentData = computed(() => paymentMethods.find(m => m.id === selectedPayment.value) || null)

const grandTotal = computed(() => {
  const shippingCost = selectedCourierData.value?.price ?? 0

  return checkoutTotalPrice.value * 1.11 + shippingCost
})

const canCheckout = computed(
  () => !!selectedCourier.value && !!selectedPayment.value && !isProcessing.value
)

async function handleConfirmCheckout() {
  if (!canCheckout.value) return

  checkoutError.value = ''
  isProcessing.value = true

  try {
    const result = await orderApi.checkout(selectedCheckoutIds.value)
    placedOrder.value = result?.order || null
    localStorage.removeItem('selected_checkout_items')
    await cartStore.fetch()
    showSuccess.value = true
  } catch (err) {
    checkoutError.value = err.message || 'Checkout gagal. Silakan coba lagi.'
  } finally {
    isProcessing.value = false
  }
}

function handleSuccessClose() {
  showSuccess.value = false
}
</script>

<style scoped>
.checkout-page {
  color: #e5e7eb;
  background:
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 30%),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.08), transparent 28%),
    linear-gradient(180deg, #0b1020 0%, #080b14 48%, #05070d 100%);
}

.back-link,
.page-muted,
.trust-badge,
.option-subtitle {
  color: #94a3b8;
}

.back-link:hover {
  color: #c4b5fd;
}

.page-title {
  color: #f8fafc;
}

.gradient-text {
  background: linear-gradient(135deg, #818cf8, #a855f7, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.panel-card,
.modal-card {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.86));
  border: 1px solid rgba(129, 140, 248, 0.22);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.24),
    0 18px 48px rgba(0, 0, 0, 0.24);
}

.panel-header {
  border-bottom: 1px solid rgba(129, 140, 248, 0.16);
}

.icon-box {
  border: 1px solid rgba(129, 140, 248, 0.18);
}

.icon-purple {
  color: #c4b5fd;
  background: rgba(79, 70, 229, 0.18);
}

.icon-green {
  color: #6ee7b7;
  background: rgba(16, 185, 129, 0.14);
}

.icon-orange {
  color: #fdba74;
  background: rgba(249, 115, 22, 0.14);
}

.status-pill {
  border: 1px solid;
}

.status-purple {
  color: #c4b5fd;
  background: rgba(79, 70, 229, 0.18);
  border-color: rgba(167, 139, 250, 0.34);
}

.status-warning {
  color: #fde68a;
  background: rgba(234, 179, 8, 0.14);
  border-color: rgba(234, 179, 8, 0.36);
}

.status-success {
  color: #6ee7b7;
  background: rgba(16, 185, 129, 0.14);
  border-color: rgba(16, 185, 129, 0.36);
}

.checkout-divide > :not([hidden]) ~ :not([hidden]) {
  border-color: rgba(129, 140, 248, 0.14);
}

.checkout-item:hover {
  background: rgba(79, 70, 229, 0.08);
}

.item-image,
.spec-chip {
  background: rgba(226, 232, 240, 0.08);
  border: 1px solid rgba(129, 140, 248, 0.14);
}

.spec-chip {
  color: #94a3b8;
}

.price-text {
  color: #a78bfa;
}

.success-text {
  color: #6ee7b7;
}

.mini-divider {
  background: rgba(129, 140, 248, 0.18);
}

.option-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1.5px solid rgba(129, 140, 248, 0.2);
}

.option-card:hover {
  transform: translateY(-1px);
  border-color: rgba(167, 139, 250, 0.45);
}

.option-selected {
  border: 2px solid #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.16);
}

.option-footer {
  background: rgba(15, 23, 42, 0.88);
  border-top: 1px solid rgba(129, 140, 248, 0.14);
}

.courier-logo-area,
.payment-logo-area {
  min-height: 56px;
}

.selected-dot {
  background: #7c3aed;
}

.empty-dot {
  border-color: rgba(203, 213, 225, 0.45);
}

.payment-tab {
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(129, 140, 248, 0.18);
}

.payment-tab:hover {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.22);
}

.payment-tab-active {
  color: #ffffff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-color: rgba(167, 139, 250, 0.5);
}

.summary-divider {
  border-top: 1px solid rgba(129, 140, 248, 0.16);
}

.check-dot {
  background: rgba(148, 163, 184, 0.26);
}

.check-dot-active {
  background: #10b981;
}

.error-alert {
  color: #fda4af;
  background: rgba(127, 29, 29, 0.35);
  border: 1px solid rgba(251, 113, 133, 0.35);
}

.primary-btn,
.confirm-btn {
  color: #ffffff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.32);
}

.primary-btn:hover,
.confirm-btn:hover:not(:disabled) {
  box-shadow: 0 16px 38px rgba(124, 58, 237, 0.4);
}

.confirm-disabled {
  cursor: not-allowed;
  color: #e2e8f0;
  background: rgba(100, 116, 139, 0.55);
  box-shadow: none;
}

.empty-state {
  background: rgba(15, 23, 42, 0.52);
  border: 1px solid rgba(129, 140, 248, 0.16);
  border-radius: 1.5rem;
}

.empty-icon {
  color: #a78bfa;
  background: rgba(79, 70, 229, 0.12);
  border: 2px dashed rgba(129, 140, 248, 0.32);
}

.modal-backdrop {
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(5px);
}

.success-icon {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 16px 38px rgba(16, 185, 129, 0.24);
}

.success-summary {
  background: rgba(6, 78, 59, 0.32);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>