<template>
  <main class="pt-24 pb-20" style="background: #f8fafc; min-height: 100vh;">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Heading -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight" style="color: #0f172a;">Keranjang Belanja</h1>
        <p class="mt-1 text-sm" style="color: #64748b;">{{ cartStore.totalItems }} item dalam keranjang Anda</p>
      </div>

      <!-- ════════ Empty Cart ════════ -->
      <div v-if="cartStore.items.length === 0" class="text-center py-24 rounded-2xl"
        style="background: #fff; border: 1px solid #e5e7eb;">
        <div class="text-7xl mb-6">🛒</div>
        <h2 class="text-2xl font-bold mb-2" style="color: #0f172a;">Keranjang Masih Kosong</h2>
        <p class="mb-8 text-sm" style="color: #64748b;">Yuk tambahkan produk favorit Anda ke keranjang!</p>
        <RouterLink to="/katalog" id="browse-products-btn"
          class="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
          style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
        >
          🛍️ Mulai Belanja
        </RouterLink>
      </div>

      <!-- ════════ Cart Items + Summary ════════ -->
      <div v-else class="grid lg:grid-cols-3 gap-8 items-start">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <TransitionGroup name="cart-item">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="cart-row group flex gap-4 p-4 rounded-2xl transition-all duration-200"
              style="background: #fff; border: 1px solid #e5e7eb;"
            >
              <!-- Image -->
              <div class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                style="background: #f1f5f9;">
                <img :src="item.image" :alt="item.name"
                  class="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
              </div>

              <!-- Details -->
              <div class="flex-1 min-w-0 flex flex-col">
                <p class="text-xs font-medium mb-0.5" style="color: #6366f1;">{{ item.category }}</p>
                <h3 class="font-semibold text-sm leading-snug mb-1 line-clamp-2" style="color: #0f172a;">{{ item.name }}</h3>
                <p class="text-xs" style="color: #94a3b8;">{{ formatPrice(item.price) }} / unit</p>
                <div class="flex-1"></div>
                <p class="font-bold text-base mt-2" style="color: #0f172a;">
                  {{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>

              <!-- Controls -->
              <div class="flex flex-col items-end justify-between">
                <!-- Remove -->
                <button
                  @click="cartStore.removeItem(item.id)"
                  title="Hapus item"
                  class="remove-btn w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none transition-all duration-150"
                >
                  ×
                </button>
                <!-- Quantity stepper -->
                <div class="qty-stepper flex items-center rounded-full overflow-hidden"
                  style="border: 1px solid #e2e8f0; background: #f8fafc;">
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    class="qty-btn w-8 h-8 flex items-center justify-center text-base font-semibold transition-colors"
                  >−</button>
                  <span class="w-9 text-center text-sm font-bold select-none" style="color: #0f172a;">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    class="qty-btn w-8 h-8 flex items-center justify-center text-base font-semibold transition-colors"
                  >+</button>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Clear Cart -->
          <button
            @click="cartStore.clearCart()"
            class="text-sm font-medium flex items-center gap-2 transition-colors"
            style="color: #ef4444;"
            @mouseenter="e => e.currentTarget.style.color = '#b91c1c'"
            @mouseleave="e => e.currentTarget.style.color = '#ef4444'"
          >
            🗑️ Kosongkan Keranjang
          </button>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="summary-card sticky top-24 p-6 rounded-2xl"
            style="background: #ffffff; border: 1px solid #e5e7eb;">
            <h2 class="font-bold text-lg mb-5 tracking-tight" style="color: #0f172a;">Ringkasan Pesanan</h2>

            <div class="space-y-3.5 mb-5">
              <div class="flex justify-between items-center">
                <span class="text-sm" style="color: #64748b;">Subtotal ({{ cartStore.totalItems }} item)</span>
                <span class="text-sm font-semibold" style="color: #0f172a;">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm" style="color: #64748b;">Ongkos Kirim</span>
                <span class="text-sm font-semibold" style="color: #16a34a;">Gratis</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm" style="color: #64748b;">Pajak (11%)</span>
                <span class="text-sm font-semibold" style="color: #0f172a;">{{ formatPrice(cartStore.totalPrice * 0.11) }}</span>
              </div>
            </div>

            <div class="pt-4 mb-5" style="border-top: 1px dashed #e2e8f0;">
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-base" style="color: #0f172a;">Total</span>
                <span class="font-extrabold text-2xl tracking-tight" style="color: #4f46e5;">
                  {{ formatPrice(cartStore.totalPrice * 1.11) }}
                </span>
              </div>
              <p class="text-[11px] mt-1 text-right" style="color: #94a3b8;">Sudah termasuk pajak 11%</p>
            </div>

            <!-- Promo Code -->
            <div class="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Kode Promo"
                id="promo-input"
                class="flex-1 px-3.5 py-2.5 rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-indigo-500/30"
                style="background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a;"
              />
              <button class="px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                style="background: #0f172a;">
                Pakai
              </button>
            </div>

            <!-- Checkout -->
            <button id="checkout-btn"
              class="checkout-btn w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300"
              style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
              @click="handleCheckout"
            >
              💳 Checkout Sekarang
            </button>

            <RouterLink to="/katalog"
              class="block text-center text-sm mt-4 transition-colors"
              style="color: #64748b;"
              @mouseenter="e => e.currentTarget.style.color = '#4f46e5'"
              @mouseleave="e => e.currentTarget.style.color = '#64748b'"
            >
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
/* Hover halus pada baris produk */
.cart-row:hover {
  border-color: #c7d2fe;
  box-shadow: 0 8px 24px -8px rgba(79, 70, 229, 0.18);
  transform: translateY(-2px);
}

/* Tombol kuantitas */
.qty-btn {
  color: #475569;
}
.qty-btn:hover {
  background: #4f46e5;
  color: #fff;
}
.qty-btn:active {
  transform: scale(0.9);
}

/* Tombol hapus (silang) */
.remove-btn {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
}
.remove-btn:hover {
  background: #ef4444;
  color: #fff;
  transform: rotate(90deg);
}
.remove-btn:active {
  transform: rotate(90deg) scale(0.9);
}

/* Kartu ringkasan — shadow tipis elegan */
.summary-card {
  box-shadow: 0 10px 30px -12px rgba(15, 23, 42, 0.12);
}

/* Tombol checkout */
.checkout-btn {
  box-shadow: 0 10px 24px -8px rgba(79, 70, 229, 0.5);
}
.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px -8px rgba(79, 70, 229, 0.6);
}
.checkout-btn:active {
  transform: translateY(0);
}

/* Animasi item keranjang */
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
}
</style>