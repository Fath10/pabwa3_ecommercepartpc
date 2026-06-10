<template>
  <main class="pt-24 pb-16 min-h-screen" style="background: #f9fafb;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-black mb-3" style="color: #111827;">
          Katalog <span class="text-indigo-600">Produk</span>
        </h1>
        <p class="text-gray-500">Temukan komponen PC terbaik untuk kebutuhan Anda</p>
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <!-- Search -->
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Cari produk..."
            id="search-input"
            class="w-full min-w-[320px] pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
            style="background: #fff; border: 1px solid #d1d5db; color: #111827;"
          />
        </div>

        <!-- Category Filter Button -->
        <button
          @click.stop="toggleCategoryDropdown"
          class="relative px-4 py-3 rounded-xl outline-none transition-all cursor-pointer flex items-center gap-2"
          style="background: #fff; border: 1px solid #d1d5db; color: #111827;"
          title="Filter Kategori"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>

          <span
            v-if="selectedCategory"
            class="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700"
          >
            {{ selectedCategory }}
          </span>

          <div
            v-if="showCategoryDropdown"
            @click.stop
            class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-48 py-2"
          >
            <button
              @click="selectCategory(''); showCategoryDropdown = false"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              :class="selectedCategory === '' ? 'text-indigo-600 font-semibold' : 'text-gray-700'"
            >
              Semua Kategori
            </button>

            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectCategory(cat); showCategoryDropdown = false"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              :class="selectedCategory === cat ? 'text-indigo-600 font-semibold' : 'text-gray-700'"
            >
              {{ cat }}
            </button>
          </div>
        </button>

        <!-- Sort Button -->
        <button
          @click.stop="toggleSortDropdown"
          class="relative px-4 py-3 rounded-xl outline-none transition-all cursor-pointer flex items-center gap-2"
          style="background: #fff; border: 1px solid #d1d5db; color: #111827;"
          title="Urutkan"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>

          <div
            v-if="showSortDropdown"
            @click.stop
            class="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-44 py-2"
          >
            <button
              @click="selectSort('default')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              :class="sortBy === 'default' ? 'text-indigo-600 font-semibold' : 'text-gray-700'"
            >
              Default
            </button>

            <button
              @click="selectSort('price-asc')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              :class="sortBy === 'price-asc' ? 'text-indigo-600 font-semibold' : 'text-gray-700'"
            >
              Harga Terendah
            </button>

            <button
              @click="selectSort('price-desc')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              :class="sortBy === 'price-desc' ? 'text-indigo-600 font-semibold' : 'text-gray-700'"
            >
              Harga Tertinggi
            </button>

            <button
              @click="selectSort('rating')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              :class="sortBy === 'rating' ? 'text-indigo-600 font-semibold' : 'text-gray-700'"
            >
              Rating Tertinggi
            </button>
          </div>
        </button>
      </div>

      <!-- Results count -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-sm" style="color: #6b7280;">
          Menampilkan
          <span class="font-semibold" style="color: #111827;">
            {{ filteredProducts.length }}
          </span>
          produk
        </p>

        <!-- Category pills -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectCategory('')"
            class="px-3 py-1 rounded-full text-xs font-medium transition-all"
            :class="selectedCategory === '' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'"
            style="border: 1px solid #e5e7eb;"
          >
            Semua
          </button>

          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectCategory(cat)"
            class="px-3 py-1 rounded-full text-xs font-medium transition-all"
            :class="selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'"
            style="border: 1px solid #e5e7eb;"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-sm" style="color: #6b7280;">Memuat produk…</p>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="text-center py-20">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-xl font-bold mb-2" style="color: #111827;">Gagal Memuat Produk</h3>
        <p class="text-gray-400 mb-6">{{ loadError }}</p>
        <button
          @click="productStore.fetchAll(true)"
          class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Product Grid -->
      <div
        v-else-if="filteredProducts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="(product, event) => $emit('add-to-cart', product, event)"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">😔</div>
        <h3 class="text-xl font-bold mb-2" style="color: #111827;">Produk Tidak Ditemukan</h3>
        <p class="text-gray-400 mb-6">Coba ubah filter atau kata kunci pencarian Anda.</p>
        <button
          @click="resetFilters"
          class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
        >
          Reset Filter
        </button>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredProducts.length > 0 && totalPages > 1"
        class="mt-10 flex flex-col items-center gap-3"
      >
        <p class="text-sm" style="color: #6b7280;">
          Halaman
          <span class="font-semibold" style="color: #111827;">{{ currentPage }}</span>
          /
          <span class="font-semibold" style="color: #111827;">{{ totalPages }}</span>
        </p>

        <div class="flex items-center gap-2">
          <button
            id="katalog-pagination-prev"
            type="button"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200"
            :style="currentPage === 1
              ? 'border:1px solid #e5e7eb; color:#d1d5db; cursor:not-allowed; background:#fff;'
              : 'border:1px solid #d1d5db; color:#374151; background:#fff; cursor:pointer;'"
          >
            ←
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            :id="`katalog-page-${page}`"
            type="button"
            @click="goToPage(page)"
            class="w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200"
            :style="page === currentPage
              ? 'background:#4f46e5; color:#fff; border:1px solid #4f46e5;'
              : 'background:#fff; color:#374151; border:1px solid #d1d5db; cursor:pointer;'"
          >
            {{ page }}
          </button>

          <button
            id="katalog-pagination-next"
            type="button"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200"
            :style="currentPage === totalPages
              ? 'border:1px solid #e5e7eb; color:#d1d5db; cursor:not-allowed; background:#fff;'
              : 'border:1px solid #d1d5db; color:#374151; background:#fff; cursor:pointer;'"
          >
            →
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { productStore } from '../store.js'

const emit = defineEmits(['add-to-cart'])

const route = useRoute()
const router = useRouter()

const search = ref('')
const selectedCategory = ref('')
const sortBy = ref('default')
const currentPage = ref(1)
const showCategoryDropdown = ref(false)
const showSortDropdown = ref(false)

const PRODUCTS_PER_PAGE = 12

// Catalog data comes from the backend via the shared product store.
const products = computed(() => productStore.items)
const categories = computed(() => productStore.categories)
const loading = computed(() => productStore.loading)
const loadError = computed(() => productStore.error)

function closeDropdowns() {
  showCategoryDropdown.value = false
  showSortDropdown.value = false
}

function toggleCategoryDropdown() {
  showCategoryDropdown.value = !showCategoryDropdown.value
  showSortDropdown.value = false
}

function toggleSortDropdown() {
  showSortDropdown.value = !showSortDropdown.value
  showCategoryDropdown.value = false
}

function normalizeCategory(category) {
  const value = String(category || '').trim()

  const matchedCategory = categories.value.find(
    cat => String(cat).toLowerCase() === value.toLowerCase()
  )

  return matchedCategory || ''
}

function selectCategory(category) {
  selectedCategory.value = normalizeCategory(category)
  currentPage.value = 1

  const query = { ...route.query }

  if (selectedCategory.value) {
    query.category = selectedCategory.value
  } else {
    delete query.category
  }

  router.replace({
    path: '/katalog',
    query
  })
}

function selectSort(value) {
  sortBy.value = value
  showSortDropdown.value = false
  showCategoryDropdown.value = false
}

watch(
  () => route.query.category,
  (category) => {
    selectedCategory.value = normalizeCategory(category)
    currentPage.value = 1
  },
  { immediate: true }
)

// Initialise / track the search term coming from the navbar (?q=...).
watch(
  () => route.query.q,
  (q) => {
    search.value = typeof q === 'string' ? q : ''
    currentPage.value = 1
  },
  { immediate: true }
)

// Re-normalise the category once products (and therefore the category list) load.
watch(categories, () => {
  selectedCategory.value = normalizeCategory(route.query.category)
})

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (search.value) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    result = result.filter(
      p => String(p.category).toLowerCase() === String(selectedCategory.value).toLowerCase()
    )
  }

  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  }

  return result
})

watch([search, selectedCategory, sortBy], () => {
  currentPage.value = 1
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / PRODUCTS_PER_PAGE))
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * PRODUCTS_PER_PAGE
  return filteredProducts.value.slice(start, start + PRODUCTS_PER_PAGE)
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetFilters() {
  search.value = ''
  sortBy.value = 'default'
  currentPage.value = 1
  selectCategory('')
}

onMounted(() => {
  productStore.fetchAll()
  document.addEventListener('click', closeDropdowns)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>