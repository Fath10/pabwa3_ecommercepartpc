<template>
  <div style="background: #f9fafb; min-height: 100vh;">

    <!-- ─── MAIN CART AREA ─── -->
    <main class="pt-20 pb-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Page Header -->
        <div class="mb-10">
          <RouterLink to="/katalog" class="inline-flex items-center gap-2 text-sm mb-6 transition-all duration-200 hover:-translate-x-1" style="color: #6b7280;">
            ← Lanjut Belanja
          </RouterLink>
          <div>
            <h1 class="text-3xl font-black mb-1" style="color: #111827;">Keranjang <span style="background: linear-gradient(135deg, #4f46e5, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Belanja</span></h1>
            <p class="text-sm" style="color: #6b7280;">{{ cartStore.totalItems }} item dalam keranjang Anda</p>
          </div>
        </div>

        <!-- ─── EMPTY CART ─── -->
        <div v-if="cartStore.items.length === 0" class="text-center py-20">
          <div class="relative inline-block mb-8">
            <div class="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto" style="background: rgba(79,70,229,0.08); border: 2px dashed rgba(79,70,229,0.2);">
              <svg class="w-12 h-12" style="color: #4f46e5;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style="background: #fee2e2; border: 2px solid #fff; color: #ef4444;">0</div>
          </div>
          <h2 class="text-2xl font-black mb-3" style="color: #111827;">Keranjang Masih Kosong</h2>
          <p class="text-sm mb-8" style="color: #6b7280;">Yuk tambahkan produk favorit Anda ke keranjang!</p>
          <RouterLink to="/katalog" id="browse-products-btn"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 hover:-translate-y-1"
            style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 8px 32px rgba(79,70,229,0.25);"
          >
            Mulai Belanja
          </RouterLink>
        </div>

        <!-- ─── CART CONTENT ─── -->
        <div v-else class="grid lg:grid-cols-3 gap-8">

          <!-- Cart Items List -->
          <div class="lg:col-span-2 space-y-3">
            <TransitionGroup name="cart-item">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="group flex gap-4 p-5 rounded-2xl bg-white transition-all duration-300"
                style="border: 1px solid #e5e7eb; box-shadow: 0 1px 4px rgba(0,0,0,0.04);"
              >
                <!-- Product Image -->
                <div class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style="background: #f1f5f9;">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-contain p-2" />
                </div>

                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold mb-1" style="color: #6366f1;">{{ item.category }}</p>
                  <h3 class="font-bold text-sm mb-1 line-clamp-2 leading-snug" style="color: #111827;">{{ item.name }}</h3>
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="font-black text-base" style="color: #4f46e5;">{{ formatPrice(item.price) }}</p>
                    <p v-if="item.originalPrice" class="text-xs line-through" style="color: #9ca3af;">{{ formatPrice(item.originalPrice) }}</p>
                  </div>
                  <p class="text-xs mt-1" style="color: #9ca3af;">Subtotal: <span class="font-bold" style="color: #111827;">{{ formatPrice(item.price * item.quantity) }}</span></p>
                </div>

                <!-- Qty control only -->
                <div class="flex flex-col items-end justify-center flex-shrink-0">
                  <div class="flex items-center rounded-xl overflow-hidden" style="border: 1px solid #e5e7eb; background: #f9fafb;">
                    <button
                      @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                      class="w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-150 hover:bg-gray-100"
                      style="color: #374151;"
                    >−</button>
                    <span class="w-9 text-center text-sm font-black" style="color: #111827;">{{ item.quantity }}</span>
                    <button
                      @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                      class="w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-150 hover:bg-gray-100"
                      style="color: #374151;"
                    >+</button>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <!-- Free shipping badge -->
            <div class="flex items-center gap-3 p-4 rounded-xl" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
              <svg class="w-5 h-5 flex-shrink-0" style="color: #16a34a;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-2v6m0 0l-2-2m2 2l2-2M3 16h18" />
              </svg>
              <p class="text-sm" style="color: #16a34a;">Selamat! Pesanan Anda mendapatkan <strong>gratis ongkir</strong></p>
            </div>

            <!-- Tombol Kosongkan -->
            <div class="flex justify-end pt-1">
              <button
                @click="cartStore.clearCart()"
                title="Kosongkan keranjang"
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
                style="background: #fef2f2; border: 1px solid #fecaca; color: #ef4444;"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Kosongkan
              </button>
            </div>
          </div>

          <!-- ─── ORDER SUMMARY ─── -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 rounded-2xl overflow-hidden bg-white" style="border: 1px solid #e5e7eb; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">

              <!-- Summary Header -->
              <div class="px-6 py-5" style="border-bottom: 1px solid #f3f4f6;">
                <h2 class="font-black text-lg" style="color: #111827;">Ringkasan Pesanan</h2>
              </div>

              <!-- Summary Body -->
              <div class="px-6 py-5 space-y-4">
                <div class="flex justify-between text-sm">
                  <span style="color: #6b7280;">Subtotal ({{ cartStore.totalItems }} item)</span>
                  <span class="font-semibold" style="color: #111827;">{{ formatPrice(cartStore.totalPrice) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span style="color: #6b7280;">Ongkos Kirim</span>
                  <span class="font-bold" style="color: #16a34a;">Gratis</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span style="color: #6b7280;">Pajak (11%)</span>
                  <span class="font-semibold" style="color: #111827;">{{ formatPrice(cartStore.totalPrice * 0.11) }}</span>
                </div>

                <div class="pt-4" style="border-top: 1px solid #f3f4f6;">
                  <div class="flex justify-between items-center">
                    <span class="font-bold" style="color: #111827;">Total</span>
                    <span class="font-black text-xl" style="color: #4f46e5;">{{ formatPrice(cartStore.totalPrice * 1.11) }}</span>
                  </div>
                </div>

                <!-- Promo Code -->
                <div class="pt-2">
                  <label class="block text-xs font-semibold mb-2" style="color: #6b7280;">Kode Promo</label>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan kode..."
                      id="promo-input"
                      class="flex-1 px-3 py-2.5 rounded-xl outline-none text-sm transition-all"
                      style="background: #f9fafb; border: 1px solid #e5e7eb; color: #111827;"
                      @focus="e => e.target.style.borderColor = '#4f46e5'"
                      @blur="e => e.target.style.borderColor = '#e5e7eb'"
                    />
                    <button class="px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200 hover:opacity-85"
                      style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
                    >Pakai</button>
                  </div>
                </div>
              </div>

              <!-- Checkout CTA -->
              <div class="px-6 pb-6">
                <RouterLink
                  id="checkout-btn"
                  to="/checkout"
                  class="w-full py-4 rounded-2xl text-white font-black text-base transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                  style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 8px 32px rgba(79,70,229,0.3); display: flex;"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Checkout Sekarang
                </RouterLink>

                <!-- Trust Badges -->
                <div class="flex justify-center gap-4 mt-4">
                  <div class="flex items-center gap-1 text-xs" style="color: #9ca3af;">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Aman
                  </div>
                  <div class="flex items-center gap-1 text-xs" style="color: #9ca3af;">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Original
                  </div>
                  <div class="flex items-center gap-1 text-xs" style="color: #9ca3af;">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Garansi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- ─── SARAN PRODUK ─── -->
    <section class="pb-16" style="background: #f9fafb;">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-2xl overflow-hidden bg-white" style="border: 1px solid #e5e7eb; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div class="px-6 py-5 flex items-center justify-between" style="border-bottom: 1px solid #f3f4f6;">
            <div>
              <h2 class="font-black text-lg" style="color: #111827;">Produk yang Mungkin Kamu Suka</h2>
              <p class="text-xs mt-0.5" style="color: #9ca3af;">Rekomendasi pilihan terbaik untuk melengkapi kebutuhan PC-mu</p>
            </div>
            <RouterLink to="/katalog" class="text-xs font-semibold hover:underline" style="color: #4f46e5;">
              Lihat Semua →
            </RouterLink>
          </div>
          <!-- Product Grid -->
          <div class="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { cartStore, productStore, formatPrice } from '../store.js'

const router = useRouter()

defineEmits(['add-to-cart'])

onMounted(() => {
  // Sync the authoritative server cart (for logged-in users) and the catalog.
  cartStore.fetch()
  productStore.fetchAll()
})

// Saran produk: 6 produk paling populer (rating tertinggi) yang belum ada di keranjang
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
