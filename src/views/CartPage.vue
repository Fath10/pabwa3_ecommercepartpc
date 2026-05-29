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
                <!-- Quantity stepper -->
                <div class="qty-stepper flex items-center rounded-full overflow-hidden"
                  style="border: 1px solid #e2e8f0; background: #f8fafc;">
                  <button
                    @click="decreaseQuantity(item)"
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
            class="w-11 h-11 text-xl font-medium flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
            style="color: #ef4444;"
            @mouseenter="e => e.currentTarget.style.color = '#b91c1c'"
            @mouseleave="e => e.currentTarget.style.color = '#ef4444'"
          >
            🗑️
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

      <!-- Product Suggestions -->
      <section class="mt-12">
        <div class="mb-5">
          <h2 class="text-xl font-bold mb-1" style="color: #0f172a;">
            Saran Produk
          </h2>
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm" style="color: #64748b;">
              Pilihan lain yang sering dibeli bersama
            </p>
            <RouterLink
              to="/katalog"
              class="text-sm font-semibold whitespace-nowrap"
              style="color: #4f46e5;"
            >
              Lihat Produk Lain
            </RouterLink>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard
            v-for="product in suggestedProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="addSuggestedProduct"
          />
        </div>
      </section>
    </div>

    <Teleport to="body">
      <Transition name="confirm-modal">
        <div
          v-if="pendingDeleteItem"
          class="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style="background: rgba(15, 23, 42, 0.55);"
        >
          <div
            class="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style="background: #ffffff; border: 1px solid #e5e7eb;"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0"
                style="background: #fef2f2; color: #ef4444;"
              >
                !
              </div>
              <div>
                <h3 class="text-lg font-bold mb-1" style="color: #0f172a;">
                  Hapus produk?
                </h3>
                <p class="text-sm leading-relaxed" style="color: #64748b;">
                  Anda yakin mau menghapus {{ pendingDeleteItem.name }} dari keranjang?
                </p>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                @click="cancelDeleteItem"
                class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                style="background: #f1f5f9; color: #475569;"
              >
                Batal
              </button>
              <button
                @click="confirmDeleteItem"
                class="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer hover:opacity-90"
                style="background: #ef4444;"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { cartStore, formatPrice, products } from '../store.js'
import ProductCard from '../components/ProductCard.vue'
import { computed, ref } from 'vue'

const emit = defineEmits(['add-to-cart', 'show-toast'])
const pendingDeleteItem = ref(null)

const suggestedProducts = computed(() => {
  const cartIds = cartStore.items.map(item => item.id)
  return products
    .filter(product => !cartIds.includes(product.id))
    .slice(0, 4)
})

function handleCheckout() {
  alert('🎉 Terima kasih! Fitur checkout akan segera hadir. Silakan hubungi kami via WhatsApp untuk pemesanan.')
}
function decreaseQuantity(item) {
  if (item.quantity === 1) {
    pendingDeleteItem.value = item
    return
  }

  cartStore.updateQuantity(item.id, item.quantity - 1)
}

function cancelDeleteItem() {
  pendingDeleteItem.value = null
}

function confirmDeleteItem() {
  if (!pendingDeleteItem.value) return

  const itemName = pendingDeleteItem.value.name
  cartStore.removeItem(pendingDeleteItem.value.id)
  pendingDeleteItem.value = null
  emit('show-toast', `${itemName} dihapus dari keranjang`, 'success')
}

function addSuggestedProduct(product){
  emit('add-to-cart', product)
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

.confirm-modal-enter-active,
.confirm-modal-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-modal-enter-from,
.confirm-modal-leave-to {
  opacity: 0;
}
</style>
