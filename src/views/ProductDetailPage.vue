<template>
  <main class="pt-24 pb-20 min-h-screen" style="background: #f8fafc;">

    <!-- Loading state -->
    <div v-if="isLoading" class="max-w-3xl mx-auto px-4 text-center py-32">
      <div class="flex justify-center mb-6">
        <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      <p class="text-gray-400 text-sm">Memuat produk...</p>
    </div>

    <!-- Product not found -->
    <div v-else-if="!product" class="max-w-3xl mx-auto px-4 text-center py-32">
      <div class="text-7xl mb-6">🔍</div>
      <h1 class="text-3xl font-bold mb-3" style="color: #0f172a;">Produk Tidak Ditemukan</h1>
      <p class="mb-8 text-sm" style="color: #64748b;">Produk yang Anda cari tidak tersedia atau telah dihapus.</p>
      <RouterLink
        to="/katalog"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5"
        style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
      >
        ← Kembali ke Katalog
      </RouterLink>
    </div>

    <!-- Product Detail -->
    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm mb-8" style="color: #94a3b8;">
        <RouterLink to="/" class="hover:text-indigo-600 transition-colors">Beranda</RouterLink>
        <span>/</span>
        <RouterLink to="/katalog" class="hover:text-indigo-600 transition-colors">Katalog</RouterLink>
        <span>/</span>
        <span class="font-medium line-clamp-1" style="color: #374151;">{{ product.name }}</span>
      </nav>

      <!-- Main content -->
      <div class="grid lg:grid-cols-2 gap-12 mb-16">

        <!-- ── Left: Image ─────────────────────────────────── -->
        <div class="flex flex-col gap-4">
          <!-- Main image card -->
          <div
            class="rounded-3xl overflow-hidden flex items-center justify-center relative"
            style="background: #f1f5f9; border: 1px solid #e2e8f0; height: 420px;"
          >
            <!-- Badge -->
            <span
              v-if="product.badge"
              class="absolute top-4 left-4 px-3 py-1 rounded-full text-white font-bold text-xs z-10"
              :class="badgeClass"
            >{{ product.badge }}</span>

            <img
              :src="productImage"
              :alt="product.name"
              class="h-72 w-full object-contain p-8 transition-transform duration-500 hover:scale-105"
            />
          </div>

          <!-- Stock info bar -->
          <div
            class="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
            style="background: #fff; border: 1px solid #e2e8f0;"
          >
            <!-- Dot indicator -->
            <span class="w-3 h-3 rounded-full flex-shrink-0" :class="stockDotClass"></span>
            <div class="flex-1">
              <p class="text-sm font-semibold" :class="stockTextClass">{{ stockLabel }}</p>
              <p class="text-xs mt-0.5" style="color: #94a3b8;">
                Stok akan diperbarui secara real-time oleh admin
              </p>
            </div>
            <!-- Stock number pill -->
            <span
              class="px-3 py-1 rounded-full text-xs font-bold"
              :class="product.stock === 0
                ? 'bg-red-50 text-red-600 border border-red-200'
                : product.stock <= 10
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-green-50 text-green-700 border border-green-200'"
            >{{ product.stock }} unit</span>
          </div>
        </div>

        <!-- ── Right: Info ─────────────────────────────────── -->
        <div class="flex flex-col">

          <!-- Category tag -->
          <span
            class="inline-block self-start px-3 py-1 rounded-full text-xs font-bold mb-4"
            style="background: #ede9fe; color: #4f46e5; border: 1px solid #c4b5fd;"
          >{{ product.category }}</span>

          <!-- Product name -->
          <h1 class="text-3xl font-extrabold leading-tight mb-4 tracking-tight" style="color: #0f172a;">
            {{ product.name }}
          </h1>

          <!-- Rating row -->
          <div class="flex items-center gap-3 mb-5">
            <div class="flex items-center gap-1">
              <span
                v-for="i in 5"
                :key="i"
                class="text-base"
                :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'"
              >
                ★
              </span>
            </div>
            <span class="text-sm font-semibold" style="color: #0f172a;">{{ product.rating }}</span>
            <span class="text-sm" style="color: #94a3b8;">({{ product.reviews }} ulasan)</span>
          </div>

          <!-- Price block -->
          <div class="flex items-baseline gap-3 mb-6 p-5 rounded-2xl" style="background: #fff; border: 1px solid #e2e8f0;">
            <span class="text-4xl font-extrabold tracking-tight" style="color: #4f46e5;">
              {{ formatPrice(product.price) }}
            </span>
            <span
              v-if="product.originalPrice && product.originalPrice > product.price"
              class="text-base line-through font-medium"
              style="color: #cbd5e1;"
            >{{ formatPrice(product.originalPrice) }}</span>
            <span
              v-if="product.originalPrice && product.originalPrice > product.price"
              class="ml-1 px-2 py-0.5 rounded-lg text-xs font-bold text-white"
              style="background: #ef4444;"
            >
              -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
            </span>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <h2 class="text-sm font-bold uppercase tracking-wider mb-2" style="color: #94a3b8;">Deskripsi Produk</h2>
            <p class="text-sm leading-relaxed" style="color: #374151;">{{ product.description }}</p>
          </div>

          <!-- Specs -->
          <div v-if="productSpecs.length > 0" class="mb-8">
            <h2 class="text-sm font-bold uppercase tracking-wider mb-3" style="color: #94a3b8;">Spesifikasi Utama</h2>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="(spec, i) in productSpecs"
                :key="i"
                class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
                style="background: #f8fafc; border: 1px solid #e2e8f0; color: #1e293b;"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
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
              class="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300"
              :class="product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'"
              :style="product.stock === 0
                ? 'background: #94a3b8;'
                : 'background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 10px 24px -8px rgba(79,70,229,0.5);'"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ product.stock === 0 ? 'Stok Habis' : 'Tambahkan ke Keranjang' }}
            </button>

            <RouterLink
              to="/katalog"
              class="w-full py-3.5 rounded-2xl text-sm font-semibold text-center transition-all hover:-translate-y-0.5"
              style="background: #f1f5f9; color: #374151; border: 1px solid #e2e8f0;"
            >
              ← Kembali ke Katalog
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- ── Reviews & Rating ──────────────────────────── -->
      <ReviewSection :product="product" />

      <!-- ── Suggested Products ──────────────────────────── -->
      <section class="border-t pt-12" style="border-color: #e2e8f0;">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold tracking-tight" style="color: #0f172a;">Produk Lainnya</h2>
            <p class="text-sm mt-1" style="color: #64748b;">Pilihan lain yang mungkin Anda sukai</p>
          </div>
          <RouterLink
            to="/katalog"
            class="text-sm font-semibold transition-colors hover:text-indigo-700"
            style="color: #4f46e5;"
          >
            Lihat Semua →
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import ReviewSection from '../components/ReviewSection.vue'
import { formatPrice } from '../store.js'

const emit = defineEmits(['add-to-cart'])
const route = useRoute()

// ── State ──────────────────────────────────────────────
const product = ref(null)
const isLoading = ref(true)
const suggestedProducts = ref([])

// ── Fetch produk dari API backend ──────────────────────
async function fetchProduct(id) {
  isLoading.value = true
  product.value = null
  suggestedProducts.value = []

  try {
    const res = await fetch(`http://localhost:3000/api/products/${id}`)
    if (!res.ok) {
      product.value = null
      return
    }
    const data = await res.json()

    // Normalisasi field agar sesuai dengan template
    product.value = {
      id: data.id,
      name: data.name,
      category: data.category,
      price: data.price,
      originalPrice: data.originalPrice,
      // Ambil gambar pertama dari array images, fallback ke placeholder
      image: data.images?.[0] || null,
      // Ambil badge pertama
      badge: data.badges?.[0]?.name || null,
      badgeColor: data.badges?.[0]?.color || null,
      rating: data.rating || 0,
      reviews: data.reviewCount || 0,
      stock: data.stock,
      description: data.description,
      specs: data.specs || {},
    }

    // Fetch produk lain (katalog) untuk saran
    await fetchSuggested(data.id, data.category)
  } catch (err) {
    console.error('Gagal fetch produk:', err)
    product.value = null
  } finally {
    isLoading.value = false
  }
}

async function fetchSuggested(currentId, currentCategory) {
  try {
    const res = await fetch('http://localhost:3000/api/products')
    if (!res.ok) return
    const all = await res.json()

    // Prioritaskan kategori sama, exclude produk saat ini
    const sameCategory = all.filter(p => p.id !== currentId && p.category === currentCategory)
    const others = all.filter(p => p.id !== currentId && p.category !== currentCategory)
    suggestedProducts.value = [...sameCategory, ...others].slice(0, 4)
  } catch (err) {
    console.error('Gagal fetch produk lain:', err)
  }
}

// ── Watch route changes (navigasi antar produk) ─────────
watch(() => route.params.id, (id) => {
  if (id) fetchProduct(id)
})

onMounted(() => {
  fetchProduct(route.params.id)
})

// ── Computed: Gambar produk ─────────────────────────────
const productImage = computed(() => {
  if (!product.value) return ''
  const img = product.value.image
  if (!img) return '/placeholder.jpg'
  // Jika URL relatif dari backend (/uploads/...), tambahkan base URL
  if (img.startsWith('/uploads')) return `http://localhost:3000${img}`
  return img
})

// ── Computed: Specs (dari object atau array) ────────────
const productSpecs = computed(() => {
  if (!product.value?.specs) return []
  const s = product.value.specs
  if (Array.isArray(s)) return s
  // Jika object, ubah jadi array "key: value"
  if (typeof s === 'object') {
    return Object.entries(s).map(([k, v]) => `${k}: ${v}`)
  }
  return []
})

// ── Stock helpers ──────────────────────────────────────
const stockLabel = computed(() => {
  if (!product.value) return ''
  const s = product.value.stock
  if (s === 0) return 'Stok Habis'
  if (s <= 10) return `Stok Menipis — Sisa ${s} Unit`
  return `Stok Tersedia`
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
  if (s === 0) return 'text-red-600'
  if (s <= 10) return 'text-yellow-700'
  return 'text-green-700'
})

// ── Badge color ────────────────────────────────────────
const badgeMap = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  blue: 'bg-blue-500',
  cyan: 'bg-teal-600',
}

const badgeClass = computed(() => badgeMap[product.value?.badgeColor] || 'bg-indigo-600')

// ── Add to cart ────────────────────────────────────────
function addToCart() {
  if (product.value && product.value.stock > 0) {
    emit('add-to-cart', product.value)
  }
}
</script>