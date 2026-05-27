<template>
  <main class="pt-16 pb-16" style="background: #f8fafc; min-height: 100vh;">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-1" style="color: #111827;">Keranjang Belanja</h1>
      <p class="mb-8 text-sm" style="color: #6b7280;">{{ cartStore.totalItems }} item dalam keranjang Anda</p>

      <!-- Empty Cart -->
      <div v-if="cartStore.items.length === 0" class="text-center py-24">
        <div class="text-8xl mb-6">🛒</div>
        <h2 class="text-2xl font-bold text-white mb-3">Keranjang Masih Kosong</h2>
        <p class="text-gray-400 mb-8">Yuk tambahkan produk favorit Anda ke keranjang!</p>
        <RouterLink to="/katalog" id="browse-products-btn"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
        >
          🛍️ Mulai Belanja
        </RouterLink>
      </div>

      <!-- Cart Items + Summary -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <TransitionGroup name="cart-item">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex gap-4 p-4 rounded-xl transition-all"
            style="background: #fff; border: 1px solid #e5e7eb;"
            >
              <!-- Image -->
              <div class="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-contain p-2" />
              </div>

              <!-- Details -->
              <div class="flex-1 min-w-0">
                <p class="text-xs mb-0.5" style="color: #6366f1;">{{ item.category }}</p>
                <h3 class="font-semibold text-sm mb-1 line-clamp-2" style="color: #111827;">{{ item.name }}</h3>
                <p class="font-bold text-sm" style="color: #111827;">{{ formatPrice(item.price) }}</p>
              </div>

              <!-- Quantity & Remove -->
              <div class="flex flex-col items-end justify-between">
                <button
                  @click="cartStore.removeItem(item.id)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm font-bold"
                style="background: #fee2e2; color: #ef4444;"
                >
                  ×
                </button>
                <div class="flex items-center gap-2">
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center transition-all text-sm"
                  style="background: #f1f5f9; color: #374151; border: 1px solid #e5e7eb;"
                  >−</button>
                  <span class="font-semibold w-7 text-center text-sm" style="color: #111827;">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center transition-all text-sm"
                  style="background: #f1f5f9; color: #374151; border: 1px solid #e5e7eb;"
                  >+</button>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Clear Cart -->
          <button
            @click="cartStore.clearCart()"
            class="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            🗑️ Kosongkan Keranjang
          </button>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 p-5 rounded-xl"
          style="background: #fff; border: 1px solid #e5e7eb;">
            <h2 class="font-bold text-lg mb-5" style="color: #111827;">Ringkasan Pesanan</h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-sm" style="color: #6b7280;">Subtotal ({{ cartStore.totalItems }} item)</span>
                <span class="text-sm font-medium" style="color: #111827;">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-sm" style="color: #6b7280;">Ongkos Kirim</span>
                <span class="text-green-600 font-medium">Gratis</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-sm" style="color: #6b7280;">Pajak (11%)</span>
                <span class="text-sm" style="color: #111827;">{{ formatPrice(cartStore.totalPrice * 0.11) }}</span>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4 mb-6">
              <div class="flex justify-between">
                <span class="font-bold" style="color: #111827;">Total</span>
              <span class="font-black text-lg" style="color: #4f46e5;">{{ formatPrice(cartStore.totalPrice * 1.11) }}</span>
              </div>
            </div>

            <!-- Promo Code -->
            <div class="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Kode Promo"
                id="promo-input"
                class="flex-1 px-3 py-2 rounded-lg outline-none text-sm"
              style="background: #f1f5f9; border: 1px solid #d1d5db; color: #111827;"
              />
              <button class="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all"
              style="background: #4f46e5;">
                Pakai
              </button>
            </div>

            <button id="checkout-btn"
              class="btn-primary w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-3"
              @click="handleCheckout"
            >
              💳 Checkout Sekarang
            </button>

            <RouterLink to="/katalog" class="block text-center text-gray-400 hover:text-indigo-400 text-sm mt-4 transition-colors">
              ← Lanjut Belanja
            </RouterLink>
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
