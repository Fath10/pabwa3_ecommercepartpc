<template>
  <main class="pt-20 pb-16 min-h-screen" style="background: #f9fafb;">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Page Header -->
      <div class="mb-10">
        <RouterLink to="/cart" class="inline-flex items-center gap-2 text-sm mb-6 transition-all duration-200 hover:-translate-x-1" style="color: #6b7280;">
          ← Kembali ke Keranjang
        </RouterLink>
        <div>
          <h1 class="text-3xl font-black mb-1" style="color: #111827;">
            Konfirmasi <span style="background: linear-gradient(135deg, #4f46e5, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Pesanan</span>
          </h1>
          <p class="text-sm" style="color: #6b7280;">Lengkapi informasi pengiriman dan pembayaran Anda</p>
        </div>
      </div>

      <!-- Empty Cart Guard -->
      <div v-if="cartStore.items.length === 0" class="text-center py-24">
        <div class="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6" style="background: rgba(79,70,229,0.08); border: 2px dashed rgba(79,70,229,0.2);">
          <svg class="w-10 h-10" style="color: #4f46e5;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-black mb-3" style="color: #111827;">Keranjang Anda Kosong</h2>
        <p class="text-sm mb-6" style="color: #6b7280;">Tidak ada produk yang bisa di-checkout.</p>
        <RouterLink to="/katalog" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold" style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">
          Belanja Sekarang
        </RouterLink>
      </div>

      <!-- Checkout Content -->
      <div v-else class="grid lg:grid-cols-5 gap-8">

        <!-- LEFT COLUMN -->
        <div class="lg:col-span-3 space-y-6">

          <!-- ─── DETAIL BARANG ─── -->
          <section class="rounded-2xl bg-white overflow-hidden" style="border: 1px solid #e5e7eb; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
            <div class="px-6 py-4 flex items-center gap-3" style="border-bottom: 1px solid #f3f4f6;">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(79,70,229,0.1);">
                <svg class="w-4 h-4" style="color: #4f46e5;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 class="font-black text-base" style="color: #111827;">Detail Barang</h2>
              <span class="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style="background: #ede9fe; color: #4f46e5;">{{ cartStore.totalItems }} item</span>
            </div>

            <div class="divide-y" style="border-color: #f9fafb;">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div class="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center" style="background: #f1f5f9;">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-contain p-2" />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5" style="background: #ede9fe; color: #6366f1;">{{ item.category }}</span>
                  <h3 class="font-bold text-sm line-clamp-2 leading-snug mb-1" style="color: #111827;">{{ item.name }}</h3>
                  <div v-if="item.specs && item.specs.length" class="flex flex-wrap gap-1 mb-2">
                    <span v-for="spec in item.specs.slice(0, 2)" :key="spec" class="text-xs px-1.5 py-0.5 rounded" style="background: #f1f5f9; color: #6b7280;">{{ spec }}</span>
                  </div>
                  <div class="flex items-center gap-3 flex-wrap">
                    <div>
                      <p class="text-xs" style="color: #9ca3af;">Harga Satuan</p>
                      <p class="font-bold text-sm" style="color: #4f46e5;">{{ formatPrice(item.price) }}</p>
                    </div>
                    <div class="w-px h-8" style="background: #e5e7eb;"></div>
                    <div>
                      <p class="text-xs" style="color: #9ca3af;">Jumlah</p>
                      <p class="font-bold text-sm" style="color: #111827;">{{ item.quantity }} pcs</p>
                    </div>
                    <div class="w-px h-8" style="background: #e5e7eb;"></div>
                    <div>
                      <p class="text-xs" style="color: #9ca3af;">Subtotal</p>
                      <p class="font-bold text-sm" style="color: #111827;">{{ formatPrice(item.price * item.quantity) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ─── PILIHAN KURIR ─── -->
          <section class="rounded-2xl bg-white overflow-hidden" style="border: 1px solid #e5e7eb; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
            <div class="px-6 py-4 flex items-center gap-3" style="border-bottom: 1px solid #f3f4f6;">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(16,185,129,0.1);">
                <svg class="w-4 h-4" style="color: #10b981;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h2 class="font-black text-base" style="color: #111827;">Pilihan Kurir</h2>
              <span v-if="!selectedCourier" class="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style="background: #fef3c7; color: #d97706;">Wajib dipilih</span>
              <span v-else class="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style="background: #d1fae5; color: #059669;">Terpilih</span>
            </div>

            <div class="p-5 grid grid-cols-2 gap-3">
              <label
                v-for="courier in couriers"
                :key="courier.id"
                :id="`courier-${courier.id}`"
                class="relative flex flex-col rounded-xl cursor-pointer transition-all duration-200 select-none overflow-hidden"
                :style="selectedCourier === courier.id
                  ? 'border: 2px solid #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.12);'
                  : 'border: 1.5px solid #e5e7eb;'"
              >
                <input type="radio" v-model="selectedCourier" :value="courier.id" class="hidden" />

                <!-- Logo Header -->
                <div class="flex items-center justify-between px-4 py-3" :style="`background: ${courier.headerBg};`">
                  <!-- SVG Logo -->
                  <div class="h-7 flex items-center" v-html="courier.svgLogo"></div>
                  <!-- Selected checkmark -->
                  <div v-if="selectedCourier === courier.id"
                    class="w-5 h-5 rounded-full flex items-center justify-center"
                    style="background: #4f46e5;">
                    <svg class="w-3 h-3" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div v-else class="w-5 h-5 rounded-full border-2" style="border-color: #d1d5db;"></div>
                </div>

                <!-- Info Footer -->
                <div class="px-4 py-2.5" style="background: #fff;">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-semibold" style="color: #4f46e5;">{{ courier.eta }}</p>
                    <p class="font-black text-sm" :style="courier.price === 0 ? 'color: #10b981;' : 'color: #111827;'">
                      {{ courier.price === 0 ? 'Gratis' : formatPrice(courier.price) }}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </section>

          <!-- ─── METODE PEMBAYARAN ─── -->
          <section class="rounded-2xl bg-white overflow-hidden" style="border: 1px solid #e5e7eb; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
            <div class="px-6 py-4 flex items-center gap-3" style="border-bottom: 1px solid #f3f4f6;">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(245,158,11,0.1);">
                <svg class="w-4 h-4" style="color: #f59e0b;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 class="font-black text-base" style="color: #111827;">Metode Pembayaran</h2>
              <span v-if="!selectedPayment" class="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style="background: #fef3c7; color: #d97706;">Wajib dipilih</span>
              <span v-else class="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style="background: #d1fae5; color: #059669;">Terpilih</span>
            </div>

            <!-- Payment Tabs -->
            <div class="px-5 pt-4">
              <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
                <button
                  v-for="tab in paymentTabs"
                  :key="tab.id"
                  @click="activePaymentTab = tab.id"
                  class="px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                  :style="activePaymentTab === tab.id
                    ? 'background: #4f46e5; color: #fff;'
                    : 'background: #f3f4f6; color: #6b7280;'"
                >
                  {{ tab.label }}
                </button>
              </div>

              <div class="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-5">
                <label
                  v-for="method in filteredPaymentMethods"
                  :key="method.id"
                  :id="`pay-${method.id}`"
                  class="relative flex flex-col items-center rounded-xl cursor-pointer transition-all duration-200 select-none overflow-hidden"
                  :style="selectedPayment === method.id
                    ? 'border: 2px solid #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.12);'
                    : 'border: 1.5px solid #e5e7eb;'"
                >
                  <input type="radio" v-model="selectedPayment" :value="method.id" class="hidden" />

                  <!-- Selected badge -->
                  <div v-if="selectedPayment === method.id"
                    class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center z-10"
                    style="background: #4f46e5;">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>

                  <!-- Logo area -->
                  <div class="w-full flex items-center justify-center py-3 px-2" :style="`background: ${method.bg}; min-height: 60px;`" v-html="method.svgLogo">
                  </div>

                  <!-- Name -->
                  <div class="w-full px-2 py-2 text-center" style="background: #fff;">
                    <p class="text-xs font-bold leading-tight" style="color: #374151;">{{ method.name }}</p>
                  </div>
                </label>
              </div>
            </div>
          </section>

        </div>

        <!-- RIGHT COLUMN — Order Summary Sticky -->
        <div class="lg:col-span-2">
          <div class="sticky top-24 space-y-4">

            <!-- Order Summary Card -->
            <div class="rounded-2xl bg-white overflow-hidden" style="border: 1px solid #e5e7eb; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
              <div class="px-6 py-4" style="border-bottom: 1px solid #f3f4f6;">
                <h2 class="font-black text-base" style="color: #111827;">Ringkasan Pembayaran</h2>
              </div>
              <div class="px-6 py-5 space-y-3">
                <div class="flex justify-between text-sm">
                  <span style="color: #6b7280;">Subtotal ({{ cartStore.totalItems }} item)</span>
                  <span class="font-semibold" style="color: #111827;">{{ formatPrice(cartStore.totalPrice) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span style="color: #6b7280;">Ongkos Kirim</span>
                  <span class="font-bold" :style="selectedCourierData?.price === 0 ? 'color: #10b981;' : 'color: #111827;'">
                    {{ selectedCourierData ? (selectedCourierData.price === 0 ? 'Gratis' : formatPrice(selectedCourierData.price)) : '—' }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span style="color: #6b7280;">Pajak (11%)</span>
                  <span class="font-semibold" style="color: #111827;">{{ formatPrice(cartStore.totalPrice * 0.11) }}</span>
                </div>
                <div class="pt-3" style="border-top: 1px solid #f3f4f6;">
                  <div class="flex justify-between items-center">
                    <span class="font-bold" style="color: #111827;">Total</span>
                    <span class="font-black text-xl" style="color: #4f46e5;">{{ formatPrice(grandTotal) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Checklist Status -->
            <div class="rounded-2xl bg-white px-6 py-4 space-y-3" style="border: 1px solid #e5e7eb;">
              <p class="text-xs font-bold" style="color: #6b7280;">STATUS KELENGKAPAN</p>
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  :style="selectedCourier ? 'background: #10b981;' : 'background: #e5e7eb;'">
                  <svg class="w-3 h-3" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm" :style="selectedCourier ? 'color: #111827; font-weight: 600;' : 'color: #9ca3af;'">Kurir pengiriman</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  :style="selectedPayment ? 'background: #10b981;' : 'background: #e5e7eb;'">
                  <svg class="w-3 h-3" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm" :style="selectedPayment ? 'color: #111827; font-weight: 600;' : 'color: #9ca3af;'">Metode pembayaran</span>
              </div>
            </div>

            <!-- Checkout Button -->
            <div>
              <button
                id="confirm-checkout-btn"
                :disabled="!canCheckout"
                @click="handleConfirmCheckout"
                class="w-full py-4 rounded-2xl text-white font-black text-base transition-all duration-300 flex items-center justify-center gap-2"
                :class="canCheckout ? 'hover:-translate-y-1' : ''"
                :style="canCheckout
                  ? 'background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 8px 32px rgba(79,70,229,0.3); cursor: pointer;'
                  : 'background: #d1d5db; cursor: not-allowed; box-shadow: none;'"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ canCheckout ? 'Konfirmasi Pesanan' : 'Lengkapi Pilihan Terlebih Dahulu' }}
              </button>
              <p v-if="!canCheckout" class="text-center text-xs mt-2" style="color: #9ca3af;">
                Pilih kurir dan metode pembayaran untuk melanjutkan
              </p>
            </div>

            <!-- Trust badges -->
            <div class="flex justify-center gap-6">
              <div class="flex items-center gap-1.5 text-xs" style="color: #9ca3af;">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Aman & Terenkripsi
              </div>
              <div class="flex items-center gap-1.5 text-xs" style="color: #9ca3af;">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Garansi Resmi
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- ─── SUCCESS MODAL ─── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSuccess" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
          <div class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" style="border: 1px solid #e5e7eb;">
            <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style="background: linear-gradient(135deg, #10b981, #059669);">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-black mb-2" style="color: #111827;">Pesanan Dikonfirmasi!</h2>
            <p class="text-sm mb-2" style="color: #6b7280;">Terima kasih telah berbelanja di e-BuildPC.</p>
            <p class="text-sm mb-6" style="color: #6b7280;">Pesanan Anda akan segera diproses dan dikirim melalui <strong style="color: #111827;">{{ selectedCourierData?.name }}</strong> menggunakan <strong style="color: #111827;">{{ selectedPaymentData?.name }}</strong>.</p>
            <div class="p-4 rounded-2xl mb-6" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
              <p class="text-xs" style="color: #6b7280;">Total Pembayaran</p>
              <p class="text-2xl font-black" style="color: #10b981;">{{ formatPrice(grandTotal) }}</p>
            </div>
            <RouterLink to="/" @click="handleSuccessClose"
              class="block w-full py-3 rounded-xl text-white font-bold transition-all duration-200 hover:opacity-90"
              style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
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
import { ref, computed } from 'vue'
import { cartStore, formatPrice } from '../store.js'

// ─── Kurir dengan SVG logo ───
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

// ─── Metode Pembayaran dengan SVG logo ───
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

const filteredPaymentMethods = computed(() => {
  if (activePaymentTab.value === 'all') return paymentMethods
  return paymentMethods.filter(m => m.tab === activePaymentTab.value)
})

const selectedCourierData = computed(() => couriers.find(c => c.id === selectedCourier.value) || null)
const selectedPaymentData = computed(() => paymentMethods.find(m => m.id === selectedPayment.value) || null)

const grandTotal = computed(() => {
  const shippingCost = selectedCourierData.value?.price ?? 0
  return cartStore.totalPrice * 1.11 + shippingCost
})

const canCheckout = computed(() => !!selectedCourier.value && !!selectedPayment.value)

function handleConfirmCheckout() {
  if (!canCheckout.value) return
  showSuccess.value = true
}

function handleSuccessClose() {
  showSuccess.value = false
  cartStore.clearCart()
}
</script>

<style scoped>
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
