<template>
  <main class="pt-20 pb-20 min-h-screen" style="background: #0d1117;">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Page Header -->
      <div class="mb-10">
        <RouterLink to="/katalog" class="inline-flex items-center gap-2 text-sm mb-6 transition-all duration-200 hover:-translate-x-1" style="color: #64748b;">
          ← Lanjut Belanja
        </RouterLink>
        <div class="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-black text-white mb-1">Keranjang <span style="background: linear-gradient(135deg, #818cf8, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Belanja</span></h1>
            <p class="text-sm" style="color: #64748b;">{{ cartStore.totalItems }} item dalam keranjang Anda</p>
          </div>
          <button v-if="cartStore.items.length > 0" @click="cartStore.clearCart()" class="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:opacity-70" style="color: #ef4444;">
            🗑️ Kosongkan
          </button>
        </div>
      </div>

      <!-- ─── EMPTY CART ─── -->
      <div v-if="cartStore.items.length === 0" class="text-center py-24">
        <div class="relative inline-block mb-8">
          <div class="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto text-5xl" style="background: rgba(79,70,229,0.1); border: 1px solid rgba(79,70,229,0.2);">🛒</div>
          <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg" style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3);">0</div>
        </div>
        <h2 class="text-2xl font-black text-white mb-3">Keranjang Masih Kosong</h2>
        <p class="text-sm mb-8" style="color: #64748b;">Yuk tambahkan produk favorit Anda ke keranjang!</p>
        <RouterLink to="/katalog" id="browse-products-btn"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold transition-all duration-300 hover:-translate-y-1"
          style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 8px 32px rgba(79,70,229,0.3);"
        >
          🛍️ Mulai Belanja
        </RouterLink>
      </div>

      <!-- ─── CART CONTENT ─── -->
      <div v-else class="grid lg:grid-cols-3 gap-8">

        <!-- Cart Items List -->
        <div class="lg:col-span-2 space-y-4">
          <TransitionGroup name="cart-item">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="group flex gap-4 p-5 rounded-2xl transition-all duration-300 hover:border-indigo-500/30"
              style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);"
            >
              <!-- Product Image -->
              <div class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style="background: rgba(255,255,255,0.05);">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-contain p-2" />
              </div>

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold mb-1" style="color: #6366f1;">{{ item.category }}</p>
                <h3 class="font-bold text-sm text-white mb-1 line-clamp-2 leading-snug">{{ item.name }}</h3>
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="font-black text-base" style="color: #818cf8;">{{ formatPrice(item.price) }}</p>
                  <p v-if="item.originalPrice" class="text-xs line-through" style="color: #475569;">{{ formatPrice(item.originalPrice) }}</p>
                </div>
                <p class="text-xs mt-1" style="color: #64748b;">Subtotal: <span class="font-bold text-white">{{ formatPrice(item.price * item.quantity) }}</span></p>
              </div>

              <!-- Qty & Remove -->
              <div class="flex flex-col items-end justify-between gap-3 flex-shrink-0">
                <!-- Remove -->
                <button
                  @click="cartStore.removeItem(item.id)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 opacity-60 hover:opacity-100"
                  style="background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.2);"
                  title="Hapus item"
                >×</button>

                <!-- Quantity -->
                <div class="flex items-center rounded-xl overflow-hidden" style="border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);">
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    class="w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-150 hover:bg-white/10 text-white"
                  >−</button>
                  <span class="w-9 text-center text-sm font-black text-white">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    class="w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-150 hover:bg-white/10 text-white"
                  >+</button>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Recommended badge -->
          <div class="flex items-center gap-3 p-4 rounded-xl" style="background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15);">
            <span class="text-xl">🚚</span>
            <p class="text-sm" style="color: #34d399;">Selamat! Pesanan Anda mendapatkan <strong>gratis ongkir</strong></p>
          </div>
        </div>

        <!-- ─── ORDER SUMMARY ─── -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 rounded-2xl overflow-hidden" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);">

            <!-- Summary Header -->
            <div class="px-6 py-5" style="border-bottom: 1px solid rgba(255,255,255,0.07);">
              <h2 class="font-black text-white text-lg">Ringkasan Pesanan</h2>
            </div>

            <!-- Summary Body -->
            <div class="px-6 py-5 space-y-4">
              <div class="flex justify-between text-sm">
                <span style="color: #64748b;">Subtotal ({{ cartStore.totalItems }} item)</span>
                <span class="font-semibold text-white">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span style="color: #64748b;">Ongkos Kirim</span>
                <span class="font-bold" style="color: #10b981;">Gratis</span>
              </div>
              <div class="flex justify-between text-sm">
                <span style="color: #64748b;">Pajak (11%)</span>
                <span class="font-semibold text-white">{{ formatPrice(cartStore.totalPrice * 0.11) }}</span>
              </div>

              <div class="pt-4" style="border-top: 1px solid rgba(255,255,255,0.08);">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-white">Total</span>
                  <span class="font-black text-xl" style="color: #818cf8;">{{ formatPrice(cartStore.totalPrice * 1.11) }}</span>
                </div>
              </div>

              <!-- Promo Code -->
              <div class="pt-2">
                <label class="block text-xs font-semibold mb-2" style="color: #64748b;">Kode Promo</label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode..."
                    id="promo-input"
                    class="flex-1 px-3 py-2.5 rounded-xl outline-none text-sm transition-all"
                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff;"
                    @focus="e => e.target.style.borderColor = '#4f46e5'"
                    @blur="e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'"
                  />
                  <button class="px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200 hover:opacity-85"
                    style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
                  >Pakai</button>
                </div>
              </div>
            </div>

            <!-- Checkout CTA -->
            <div class="px-6 pb-6">
              <button
                id="checkout-btn"
                class="w-full py-4 rounded-2xl text-white font-black text-base transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 8px 32px rgba(79,70,229,0.4);"
                @click="handleCheckout"
              >
                💳 Checkout Sekarang
              </button>

              <!-- Trust Badges -->
              <div class="flex justify-center gap-4 mt-4">
                <div class="flex items-center gap-1 text-xs" style="color: #475569;">
                  <span>🔒</span> Aman
                </div>
                <div class="flex items-center gap-1 text-xs" style="color: #475569;">
                  <span>✅</span> Original
                </div>
                <div class="flex items-center gap-1 text-xs" style="color: #475569;">
                  <span>🔄</span> Garansi
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
import { cartStore, formatPrice } from '../store.js'

function handleCheckout() {
  alert('🎉 Terima kasih! Fitur checkout akan segera hadir. Silakan hubungi kami via WhatsApp untuk pemesanan.')
}
</script>

<style scoped>
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.4s ease;
}
.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.cart-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
  max-height: 0;
}
</style>
