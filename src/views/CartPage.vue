<template>
  <div class="cart-page min-h-screen">
    <main class="pt-20 pb-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-10">
          <RouterLink
            to="/katalog"
            class="back-link inline-flex items-center gap-2 text-sm mb-6 transition-all duration-200 hover:-translate-x-1"
          >
            ← Lanjut Belanja
          </RouterLink>

          <div>
            <h1 class="page-title text-3xl font-black mb-1">
              Keranjang <span class="gradient-text">Belanja</span>
            </h1>
            <p class="page-muted text-sm">
              {{ cartStore.totalItems }} item dalam keranjang Anda
            </p>
          </div>
        </div>

        <!-- Empty Cart -->
        <div v-if="cartStore.items.length === 0" class="empty-state text-center py-20">
          <div class="relative inline-block mb-8">
            <div class="empty-icon w-28 h-28 rounded-3xl flex items-center justify-center mx-auto">
              <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>

            <div class="empty-count absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
              0
            </div>
          </div>

          <h2 class="page-title text-2xl font-black mb-3">
            Keranjang Masih Kosong
          </h2>

          <p class="page-muted text-sm mb-8">
            Yuk tambahkan produk favorit Anda ke keranjang!
          </p>

          <RouterLink
            to="/katalog"
            id="browse-products-btn"
            class="primary-btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 hover:-translate-y-1"
          >
            Mulai Belanja
          </RouterLink>
        </div>

        <!-- Cart Content -->
        <div v-else class="grid lg:grid-cols-3 gap-8">
          <!-- Cart Items List -->
          <div class="lg:col-span-2 space-y-3">
            <!-- Select All Bar -->
            <div class="panel-card flex items-center justify-between p-4 rounded-2xl mb-4">
              <label class="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="isAllSelected"
                  class="checkbox-input w-5 h-5 rounded cursor-pointer"
                />
                <span class="text-sm font-semibold page-title">
                  Pilih Semua ({{ cartStore.items.length }} produk)
                </span>
              </label>

              <button
                v-if="selectedItemIds.length > 0"
                @click="removeSelectedItems"
                class="danger-text text-xs font-semibold transition-colors"
              >
                Hapus Terpilih
              </button>
            </div>

            <TransitionGroup name="cart-item">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="cart-item-card group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300"
              >
                <!-- Checkbox -->
                <div class="flex-shrink-0">
                  <input
                    type="checkbox"
                    v-model="selectedItemIds"
                    :value="item.id"
                    class="checkbox-input w-5 h-5 rounded cursor-pointer"
                  />
                </div>

                <!-- Product Image -->
                <div class="cart-image w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-full h-full object-contain p-2"
                  />
                </div>

                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <p class="category-text text-xs font-semibold mb-1">
                    {{ item.category }}
                  </p>

                  <h3 class="page-title font-bold text-sm mb-1 line-clamp-2 leading-snug">
                    {{ item.name }}
                  </h3>

                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="price-text font-black text-base">
                      {{ formatPrice(item.price) }}
                    </p>

                    <p
                      v-if="item.originalPrice"
                      class="old-price text-xs line-through"
                    >
                      {{ formatPrice(item.originalPrice) }}
                    </p>
                  </div>

                  <p class="page-muted text-xs mt-1">
                    Subtotal:
                    <span class="page-title font-bold">
                      {{ formatPrice(item.price * item.quantity) }}
                    </span>
                  </p>
                </div>

                <!-- Qty Control -->
                <div class="flex flex-col items-end justify-center flex-shrink-0">
                  <div class="qty-control flex items-center rounded-xl overflow-hidden">
                    <button
                      @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                      class="qty-btn w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-150"
                    >
                      −
                    </button>

                    <span class="page-title w-9 text-center text-sm font-black">
                      {{ item.quantity }}
                    </span>

                    <button
                      @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                      class="qty-btn w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-150"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <!-- Free Shipping Badge -->
            <div v-if="selectedTotalPrice > 1500000" class="success-card flex items-center gap-3 p-4 rounded-xl">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-2v6m0 0l-2-2m2 2l2-2M3 16h18"
                />
              </svg>

              <p class="text-sm">
                Selamat! Pesanan Anda mendapatkan <strong>gratis ongkir</strong>
              </p>
            </div>

            <!-- Clear Cart -->
            <div class="flex justify-end pt-1">
              <button
                @click="cartStore.clearCart()"
                title="Kosongkan keranjang"
                class="danger-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Kosongkan
              </button>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="summary-card sticky top-24 rounded-2xl overflow-hidden">
              <div class="summary-header px-6 py-5">
                <h2 class="page-title font-black text-lg">
                  Ringkasan Pesanan
                </h2>
              </div>

              <div class="px-6 py-5 space-y-4">
                <div class="flex justify-between text-sm">
                  <span class="page-muted">Subtotal ({{ selectedTotalItems }} item terpilih)</span>
                  <span class="page-title font-semibold">{{ formatPrice(selectedTotalPrice) }}</span>
                </div>

                <div class="flex justify-between text-sm">
                  <span class="page-muted">Ongkos Kirim</span>
                  <span :class="shippingCost === 0 ? 'success-text font-bold' : 'page-title font-semibold'">
                    {{ shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost) }}
                  </span>
                </div>

                <div class="flex justify-between text-sm">
                  <span class="page-muted">Pajak (11%)</span>
                  <span class="page-title font-semibold">{{ formatPrice(selectedTotalPrice * 0.11) }}</span>
                </div>

                <div class="summary-divider pt-4">
                  <div class="flex justify-between items-center">
                    <span class="page-title font-bold">Total</span>
                    <span class="price-text font-black text-xl">
                      {{ formatPrice(cartGrandTotal) }}
                    </span>
                  </div>
                </div>

                <!-- Promo Code -->
                <div class="pt-2">
                  <label class="page-muted block text-xs font-semibold mb-2">
                    Kode Promo
                  </label>

                  <div class="flex gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan kode..."
                      id="promo-input"
                      class="promo-input flex-1 px-3 py-2.5 rounded-xl outline-none text-sm transition-all"
                    />

                    <button class="primary-btn px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200">
                      Pakai
                    </button>
                  </div>
                </div>
              </div>

              <!-- Checkout CTA -->
              <div class="px-6 pb-6">
                <button
                  id="checkout-btn"
                  :disabled="selectedItemIds.length === 0"
                  @click="goToCheckout"
                  class="checkout-btn w-full py-4 rounded-2xl text-white font-black text-base transition-all duration-300 flex items-center justify-center gap-2"
                  :class="selectedItemIds.length > 0 ? 'hover:-translate-y-1' : 'checkout-disabled'"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Checkout ({{ selectedTotalItems }} Item)
                </button>

                <div class="flex justify-center gap-4 mt-4">
                  <div class="trust-badge flex items-center gap-1 text-xs">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Aman
                  </div>

                  <div class="trust-badge flex items-center gap-1 text-xs">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Original
                  </div>

                  <div class="trust-badge flex items-center gap-1 text-xs">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Garansi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Suggested Products -->
    <section class="suggested-section pb-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="suggested-card rounded-2xl overflow-hidden">
          <div class="suggested-header px-6 py-5 flex items-center justify-between">
            <div>
              <h2 class="page-title font-black text-lg">
                Produk yang Mungkin Kamu Suka
              </h2>
              <p class="page-muted text-xs mt-0.5">
                Rekomendasi pilihan terbaik untuk melengkapi kebutuhan PC-mu
              </p>
            </div>

            <RouterLink to="/katalog" class="see-all-link text-xs font-semibold hover:underline">
              Lihat Semua →
            </RouterLink>
          </div>

          <div class="suggested-grid p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ProductCard
              v-for="p in suggestedProducts"
              :key="p.id"
              :product="p"
              mini
              @add-to-cart="(product, event) => $emit('add-to-cart', product, event)"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { cartStore, productStore, formatPrice } from '../store.js'

const router = useRouter()

defineEmits(['add-to-cart'])

const selectedItemIds = ref([])

watch(() => cartStore.items, (newItems) => {
  if (selectedItemIds.value.length === 0 && newItems.length > 0) {
    selectedItemIds.value = newItems.map(item => item.id)
  } else {
    const currentIds = new Set(newItems.map(item => item.id))
    selectedItemIds.value = selectedItemIds.value.filter(id => currentIds.has(id))
  }
}, { immediate: true, deep: true })

const selectedItems = computed(() => {
  return cartStore.items.filter(item => selectedItemIds.value.includes(item.id))
})

const selectedTotalItems = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const selectedTotalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const shippingCost = computed(() => {
  if (selectedTotalPrice.value === 0) return 0
  return selectedTotalPrice.value > 1500000 ? 0 : 10000
})

const cartGrandTotal = computed(() => {
  return selectedTotalPrice.value * 1.11 + shippingCost.value
})

const isAllSelected = computed({
  get() {
    return cartStore.items.length > 0 && selectedItemIds.value.length === cartStore.items.length
  },
  set(value) {
    if (value) {
      selectedItemIds.value = cartStore.items.map(item => item.id)
    } else {
      selectedItemIds.value = []
    }
  }
})

async function removeSelectedItems() {
  if (confirm('Hapus produk yang dipilih dari keranjang?')) {
    for (const id of selectedItemIds.value) {
      await cartStore.removeItem(id)
    }
    selectedItemIds.value = []
  }
}

function goToCheckout() {
  if (selectedItemIds.value.length === 0) return
  localStorage.setItem('selected_checkout_items', JSON.stringify(selectedItemIds.value))
  router.push('/checkout')
}

onMounted(() => {
  cartStore.fetch()
  productStore.fetchAll()
})

const suggestedProducts = computed(() => {
  const all = productStore.items
  const cartIds = new Set(cartStore.items.map(i => i.id))
  const filtered = all.filter(p => !cartIds.has(p.id))
  const pool = filtered.length >= 6 ? filtered : all

  return [...pool]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6)
})
</script>

<style scoped>
.cart-page {
  color: #e5e7eb;
  background:
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 30%),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.08), transparent 28%),
    linear-gradient(180deg, #0b1020 0%, #080b14 48%, #05070d 100%);
}

.back-link,
.page-muted,
.trust-badge {
  color: #94a3b8;
}

.back-link:hover,
.see-all-link {
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
.cart-item-card,
.summary-card,
.suggested-card {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(30, 27, 75, 0.84));
  border: 1px solid rgba(129, 140, 248, 0.22);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.24),
    0 18px 48px rgba(0, 0, 0, 0.24);
}

.cart-item-card:hover {
  border-color: rgba(167, 139, 250, 0.48);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.22),
    0 24px 60px rgba(79, 70, 229, 0.18);
}

.checkbox-input {
  accent-color: #4f46e5;
}

.danger-text {
  color: #fb7185;
}

.danger-text:hover {
  color: #fecdd3;
}

.cart-image,
.qty-control,
.promo-input {
  background: rgba(226, 232, 240, 0.08);
  border: 1px solid rgba(129, 140, 248, 0.18);
}

.category-text,
.price-text {
  color: #a78bfa;
}

.old-price {
  color: #64748b;
}

.qty-btn {
  color: #cbd5e1;
}

.qty-btn:hover {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.24);
}

.success-card {
  color: #86efac;
  background: rgba(6, 78, 59, 0.3);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.success-card svg,
.success-text {
  color: #86efac;
}

.danger-btn {
  color: #fda4af;
  background: rgba(127, 29, 29, 0.28);
  border: 1px solid rgba(244, 63, 94, 0.32);
}

.danger-btn:hover {
  background: rgba(190, 18, 60, 0.26);
}

.summary-header,
.suggested-header {
  border-bottom: 1px solid rgba(129, 140, 248, 0.16);
}

.summary-divider {
  border-top: 1px solid rgba(129, 140, 248, 0.16);
}

.promo-input {
  color: #f8fafc;
  outline: none;
}

.promo-input::placeholder {
  color: #64748b;
}

.promo-input:focus {
  border-color: rgba(167, 139, 250, 0.68);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.14);
}

.primary-btn,
.checkout-btn {
  color: #ffffff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.32);
}

.primary-btn:hover,
.checkout-btn:hover:not(:disabled) {
  box-shadow: 0 16px 38px rgba(124, 58, 237, 0.4);
}

.checkout-disabled {
  cursor: not-allowed;
  background: rgba(100, 116, 139, 0.6);
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

.empty-count {
  color: #fda4af;
  background: rgba(127, 29, 29, 0.92);
  border: 2px solid rgba(15, 23, 42, 0.95);
}

.suggested-section {
  background: transparent;
}

.suggested-grid :deep(.product-card),
.suggested-grid :deep(article),
.suggested-grid :deep([class*="card"]) {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 27, 75, 0.86)) !important;
  border-color: rgba(129, 140, 248, 0.22) !important;
}

.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.35s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>