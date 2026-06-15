<template>
  <main class="product-detail-page pt-24 pb-20 min-h-screen">
    <!-- Loading -->
    <div v-if="loading" class="max-w-3xl mx-auto px-4 text-center py-32">
      <div class="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p class="mt-4 text-sm page-muted">Memuat produk…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-3xl mx-auto px-4 text-center py-32">
      <div class="text-7xl mb-6">⚠️</div>
      <h1 class="text-2xl font-bold mb-3 page-title">Gagal Memuat Produk</h1>
      <p class="mb-8 text-sm page-muted">{{ error }}</p>
      <button
        @click="loadProduct(route.params.id)"
        class="primary-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Product not found -->
    <div v-else-if="!product" class="max-w-3xl mx-auto px-4 text-center py-32">
      <div class="text-7xl mb-6">🔍</div>
      <h1 class="text-3xl font-bold mb-3 page-title">Produk Tidak Ditemukan</h1>
      <p class="mb-8 text-sm page-muted">Produk yang Anda cari tidak tersedia atau telah dihapus.</p>
      <RouterLink
        to="/katalog"
        class="primary-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5"
      >
        ← Kembali ke Katalog
      </RouterLink>
    </div>

    <!-- Product Detail -->
    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="breadcrumb flex items-center gap-2 text-sm mb-8">
        <RouterLink to="/" class="breadcrumb-link transition-colors">Beranda</RouterLink>
        <span>/</span>
        <RouterLink to="/katalog" class="breadcrumb-link transition-colors">Katalog</RouterLink>
        <span>/</span>
        <span class="breadcrumb-current font-medium line-clamp-1">{{ product.name }}</span>
      </nav>

      <!-- Main content -->
      <div class="grid lg:grid-cols-2 gap-12 mb-16">
        <!-- Left: Image -->
        <div class="flex flex-col gap-4">
          <!-- Main image card -->
          <div class="product-image-card rounded-3xl overflow-hidden flex items-center justify-center relative">
            <span
              v-if="product.badge"
              class="absolute top-4 left-4 px-3 py-1 rounded-full text-white font-bold text-xs z-10"
              :class="badgeClass"
            >
              {{ product.badge }}
            </span>

            <img
              :src="productImage"
              :alt="product.name"
              class="h-72 w-full object-contain p-8 transition-transform duration-500 hover:scale-105"
            />
          </div>

          <!-- Stock info bar -->
          <div class="stock-card flex items-center gap-3 px-5 py-3.5 rounded-2xl">
            <span class="w-3 h-3 rounded-full flex-shrink-0" :class="stockDotClass"></span>

            <div class="flex-1">
              <p class="text-sm font-semibold" :class="stockTextClass">
                {{ stockLabel }}
              </p>
              <p class="text-xs mt-0.5 page-muted">
                Stok akan diperbarui secara real-time oleh admin
              </p>
            </div>

            <span
              class="stock-pill px-3 py-1 rounded-full text-xs font-bold"
              :class="product.stock === 0
                ? 'stock-empty'
                : product.stock <= 10
                  ? 'stock-low'
                  : 'stock-ready'"
            >
              {{ product.stock }} unit
            </span>
          </div>
        </div>

        <!-- Right: Info -->
        <div class="product-info flex flex-col">
          <!-- Category tag -->
          <span class="category-tag inline-block self-start px-3 py-1 rounded-full text-xs font-bold mb-4">
            {{ product.category }}
          </span>

          <!-- Product name -->
          <h1 class="page-title text-3xl font-extrabold leading-tight mb-4 tracking-tight">
            {{ product.name }}
          </h1>

          <!-- Rating row -->
          <div class="flex items-center gap-3 mb-5">
            <div class="flex items-center gap-1">
              <span
                v-for="i in 5"
                :key="i"
                class="text-base"
                :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-600'"
              >
                ★
              </span>
            </div>

            <span class="text-sm font-semibold page-title">
              {{ product.rating }}
            </span>

            <span class="text-sm page-muted">
              ({{ product.reviews }} ulasan)
            </span>
          </div>

          <!-- Price block -->
          <div class="price-card flex flex-wrap items-baseline gap-3 mb-6 p-5 rounded-2xl">
            <span class="price-text text-4xl font-extrabold tracking-tight">
              {{ formatPrice(product.price) }}
            </span>

            <span
              v-if="product.originalPrice && product.originalPrice > product.price"
              class="text-base line-through font-medium old-price"
            >
              {{ formatPrice(product.originalPrice) }}
            </span>

            <span
              v-if="product.originalPrice && product.originalPrice > product.price"
              class="discount-badge ml-1 px-2 py-0.5 rounded-lg text-xs font-bold text-white"
            >
              -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
            </span>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <h2 class="section-label text-sm font-bold uppercase tracking-wider mb-2">
              Deskripsi Produk
            </h2>
            <p class="description-text text-sm leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Specs -->
          <div v-if="productSpecs.length > 0" class="mb-8">
            <h2 class="section-label text-sm font-bold uppercase tracking-wider mb-3">
              Spesifikasi Utama
            </h2>

            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="(spec, i) in productSpecs"
                :key="i"
                class="spec-item flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                {{ spec }}
              </div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col gap-3 mt-auto">
            <button
              id="detail-add-to-cart"
              @click="addToCart"
              :disabled="product.stock === 0"
              class="primary-btn w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300"
              :class="product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {{ product.stock === 0 ? 'Stok Habis' : 'Tambahkan ke Keranjang' }}
            </button>

            <button
              v-if="!userStore.isAdmin"
              @click="openAdminChat"
              class="secondary-btn w-full py-3.5 rounded-2xl text-sm font-semibold text-center flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 18.5 3.5 21v-4.6A8 8 0 1 1 7 18.5Z" />
              </svg>
              Chat Admin e-BuildPC
            </button>

            <RouterLink
              to="/katalog"
              class="secondary-btn w-full py-3.5 rounded-2xl text-sm font-semibold text-center transition-all hover:-translate-y-0.5"
            >
              ← Kembali ke Katalog
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Reviews & Rating -->
      <ReviewSection :product="product" />

      <!-- Suggested Products -->
      <section class="suggested-section border-t pt-12">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="page-title text-xl font-bold tracking-tight">
              Produk Lainnya
            </h2>
            <p class="page-muted text-sm mt-1">
              Pilihan lain yang mungkin Anda sukai
            </p>
          </div>

          <RouterLink
            to="/katalog"
            class="see-all-link text-sm font-semibold transition-colors"
          >
            Lihat Semua →
          </RouterLink>
        </div>

        <div class="suggested-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ProductCard
            v-for="p in suggestedProducts"
            :key="p.id"
            :product="p"
            @add-to-cart="$emit('add-to-cart', $event)"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import ReviewSection from '../components/ReviewSection.vue'
import { adminChatStore, productStore, formatPrice, userStore, autopilotStore, cartStore } from '../store.js'
import { productApi } from '../api/index.js'

const emit = defineEmits(['add-to-cart'])
const route = useRoute()
const router = useRouter()

const product = ref(null)
const loading = ref(true)
const error = ref(null)

async function openAdminChat() {
  if (!userStore.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  await adminChatStore.startProductChat(product.value)
  window.dispatchEvent(new CustomEvent('admin-chat:open'))
}

async function loadProduct(id) {
  loading.value = true
  error.value = null
  product.value = null

  try {
    product.value = await productApi.get(id)
  } catch (err) {
    if (err.status === 404) {
      product.value = null
    } else {
      error.value = err.message || 'Gagal memuat produk.'
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (id) loadProduct(id)
  },
  { immediate: true }
)

onMounted(() => productStore.fetchAll())

const suggestedProducts = computed(() => {
  if (!product.value) return []

  const all = productStore.items

  const sameCategory = all.filter(
    p => p.id !== product.value.id && p.category === product.value.category
  )

  const others = all.filter(
    p => p.id !== product.value.id && p.category !== product.value.category
  )

  return [...sameCategory, ...others].slice(0, 4)
})

const productImage = computed(() => {
  if (!product.value) return ''

  const img = product.value.image

  if (!img) return '/placeholder.jpg'
  if (img.startsWith('/uploads')) return `http://localhost:3000${img}`

  return img
})

const productSpecs = computed(() => {
  if (!product.value?.specs) return []

  const s = product.value.specs

  if (Array.isArray(s)) return s

  if (typeof s === 'object') {
    return Object.entries(s).map(([k, v]) => `${k}: ${v}`)
  }

  return []
})

const stockLabel = computed(() => {
  if (!product.value) return ''

  const s = product.value.stock

  if (s === 0) return 'Stok Habis'
  if (s <= 10) return `Stok Menipis — Sisa ${s} Unit`

  return 'Stok Tersedia'
})

const stockDotClass = computed(() => {
  if (!product.value) return ''

  const s = product.value.stock

  if (s === 0) return 'bg-red-500'
  if (s <= 10) return 'bg-yellow-400'

  return 'bg-green-500'
})

const stockTextClass = computed(() => {
  if (!product.value) return ''

  const s = product.value.stock

  if (s === 0) return 'text-red-400'
  if (s <= 10) return 'text-yellow-300'

  return 'text-green-300'
})

const badgeMap = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  blue: 'bg-blue-500',
  cyan: 'bg-teal-600',
}

const badgeClass = computed(() => badgeMap[product.value?.badgeColor] || 'bg-indigo-600')

function addToCart() {
  if (product.value && product.value.stock > 0) {
    emit('add-to-cart', product.value)
  }
}

async function runProductDetailAutopilot() {
  const { product: targetProduct } = autopilotStore.data || {}
  if (!targetProduct || !product.value) return

  await new Promise(r => setTimeout(r, 800))

  const intent = autopilotStore.data?.intent || 'checkout'

  if (intent === 'cart' || intent === 'checkout') {
    // Highlight tombol "Tambahkan ke Keranjang"
    const btn = document.getElementById('detail-add-to-cart')
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' })
      await new Promise(r => setTimeout(r, 600))
      btn.style.transition = 'all 0.5s ease'
      btn.style.boxShadow = '0 0 0 4px #10b981'
      btn.style.transform = 'scale(1.05)'
      await new Promise(r => setTimeout(r, 800))
      
      // Panggil fungsi tambah ke keranjang
      addToCart()
      
      btn.style.transform = ''
      btn.style.boxShadow = ''
    } else {
      addToCart()
    }
  } else {
    // Jika hanya pencarian ('detail'), scroll ke nama produk untuk dibaca
    const titleEl = document.querySelector('.product-info h1')
    if (titleEl) {
      titleEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      titleEl.style.transition = 'all 0.5s ease'
      titleEl.style.textShadow = '0 0 10px rgba(99, 102, 241, 0.6)'
      await new Promise(r => setTimeout(r, 1200))
      titleEl.style.textShadow = ''
    }
  }

  if (intent === 'checkout') {
    const addedIds = [product.value.id]
    localStorage.setItem('selected_checkout_items', JSON.stringify(addedIds))
    await new Promise(r => setTimeout(r, 800))
    autopilotStore.nextStep() // Langkah 3 (Halaman Checkout)
    router.push('/checkout')
  } else {
    await new Promise(r => setTimeout(r, 800))
    autopilotStore.stop()
  }
}

watch(
  () => [autopilotStore.isActive, autopilotStore.step, loading.value],
  ([active, step, isLoading]) => {
    if (active && step === 2 && !isLoading) {
      runProductDetailAutopilot()
    }
  }
)

onMounted(() => {
  if (autopilotStore.isActive && autopilotStore.step === 2 && !loading.value) {
    runProductDetailAutopilot()
  }
})
</script>

<style scoped>
.product-detail-page {
  color: #e5e7eb;
  background:
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 30%),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.08), transparent 26%),
    linear-gradient(180deg, #0b1020 0%, #080b14 48%, #05070d 100%);
}

.page-title {
  color: #f8fafc;
}

.page-muted {
  color: #94a3b8;
}

.breadcrumb {
  color: #94a3b8;
}

.breadcrumb-link {
  color: #93c5fd;
}

.breadcrumb-link:hover,
.see-all-link:hover {
  color: #c4b5fd;
}

.breadcrumb-current {
  color: #f8fafc;
}

.product-image-card {
  min-height: 420px;
  background:
    radial-gradient(circle at center, rgba(79, 70, 229, 0.15), transparent 45%),
    rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(129, 140, 248, 0.24);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.25),
    0 24px 70px rgba(0, 0, 0, 0.28);
}

.product-image-card img {
  filter: drop-shadow(0 24px 36px rgba(0, 0, 0, 0.24));
}

.stock-card,
.price-card,
.spec-item {
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(129, 140, 248, 0.24);
}

.category-tag {
  color: #c4b5fd;
  background: rgba(79, 70, 229, 0.18);
  border: 1px solid rgba(167, 139, 250, 0.34);
}

.price-text {
  color: #a78bfa;
}

.old-price {
  color: #64748b;
}

.discount-badge {
  background: #ef4444;
}

.section-label {
  color: #94a3b8;
}

.description-text,
.spec-item {
  color: #cbd5e1;
}

.stock-pill {
  border: 1px solid;
}

.stock-empty {
  color: #fda4af;
  background: rgba(244, 63, 94, 0.14);
  border-color: rgba(244, 63, 94, 0.36);
}

.stock-low {
  color: #fde68a;
  background: rgba(234, 179, 8, 0.14);
  border-color: rgba(234, 179, 8, 0.36);
}

.stock-ready {
  color: #6ee7b7;
  background: rgba(16, 185, 129, 0.14);
  border-color: rgba(16, 185, 129, 0.36);
}

.primary-btn {
  color: #ffffff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.32);
}

.primary-btn:hover {
  box-shadow: 0 16px 38px rgba(124, 58, 237, 0.4);
}

.primary-btn:disabled {
  background: rgba(100, 116, 139, 0.8);
  box-shadow: none;
}

.secondary-btn {
  color: #e0e7ff;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(129, 140, 248, 0.26);
}

.secondary-btn:hover {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.24);
  border-color: rgba(167, 139, 250, 0.44);
}

.suggested-section {
  border-color: rgba(129, 140, 248, 0.18);
}

.see-all-link {
  color: #a78bfa;
}

/* Paksa ProductCard di bagian Produk Lainnya ikut dark */
.suggested-grid :deep(.product-card),
.suggested-grid :deep(article),
.suggested-grid :deep(.card),
.suggested-grid :deep([class*="card"]) {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(30, 27, 75, 0.84)) !important;
  border-color: rgba(129, 140, 248, 0.22) !important;
  color: #f8fafc !important;
}

.suggested-grid :deep([style*="background: #fff"]),
.suggested-grid :deep([style*="background:#fff"]),
.suggested-grid :deep([style*="background: #f8fafc"]),
.suggested-grid :deep([style*="background:#f8fafc"]),
.suggested-grid :deep([style*="background: #f1f5f9"]),
.suggested-grid :deep([style*="background:#f1f5f9"]) {
  background: rgba(15, 23, 42, 0.72) !important;
}

.suggested-grid :deep([style*="color: #0f172a"]),
.suggested-grid :deep([style*="color:#0f172a"]),
.suggested-grid :deep([style*="color: #111827"]),
.suggested-grid :deep([style*="color:#111827"]),
.suggested-grid :deep([style*="color: #1e293b"]),
.suggested-grid :deep([style*="color:#1e293b"]),
.suggested-grid :deep([style*="color: #334155"]),
.suggested-grid :deep([style*="color:#334155"]),
.suggested-grid :deep([style*="color: #374151"]),
.suggested-grid :deep([style*="color:#374151"]) {
  color: #f8fafc !important;
}

.suggested-grid :deep([style*="color: #64748b"]),
.suggested-grid :deep([style*="color:#64748b"]),
.suggested-grid :deep([style*="color: #94a3b8"]),
.suggested-grid :deep([style*="color:#94a3b8"]) {
  color: #94a3b8 !important;
}

.suggested-grid :deep(button) {
  color: #ffffff !important;
}
</style>
