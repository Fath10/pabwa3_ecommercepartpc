<template>
  <main class="catalog-page pt-24 pb-16 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="page-title text-4xl font-black mb-3">
          Katalog <span class="gradient-text">Produk</span>
        </h1>
        <p class="page-muted">
          Temukan komponen PC terbaik untuk kebutuhan Anda
        </p>
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <!-- Search -->
        <div class="relative flex-1">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            v-model="search"
            type="text"
            placeholder="Cari produk..."
            id="search-input"
            class="form-control w-full min-w-[320px] pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
          />
        </div>

        <!-- Category Filter Button -->
        <button
          @click.stop="toggleCategoryDropdown"
          class="dropdown-trigger relative px-4 py-3 rounded-xl outline-none transition-all cursor-pointer flex items-center gap-2"
          title="Filter Kategori"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>

          <span
            v-if="selectedCategory"
            class="selected-badge px-2 py-0.5 rounded-full text-xs font-semibold"
          >
            {{ selectedCategory }}
          </span>

          <div
            v-if="showCategoryDropdown"
            @click.stop
            class="dropdown-menu absolute top-full left-0 mt-2 rounded-xl shadow-lg z-20 min-w-48 py-2"
          >
            <button
              @click="selectCategory(''); showCategoryDropdown = false"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="selectedCategory === '' ? 'dropdown-active' : ''"
            >
              Semua Kategori
            </button>

            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectCategory(cat); showCategoryDropdown = false"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="selectedCategory === cat ? 'dropdown-active' : ''"
            >
              {{ cat }}
            </button>
          </div>
        </button>

        <!-- Sort Button -->
        <button
          @click.stop="toggleSortDropdown"
          class="dropdown-trigger relative px-4 py-3 rounded-xl outline-none transition-all cursor-pointer flex items-center gap-2"
          title="Urutkan"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>

          <div
            v-if="showSortDropdown"
            @click.stop
            class="dropdown-menu absolute top-full right-0 mt-2 rounded-xl shadow-lg z-20 min-w-44 py-2"
          >
            <button
              @click="selectSort('default')"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="sortBy === 'default' ? 'dropdown-active' : ''"
            >
              Default
            </button>

            <button
              @click="selectSort('price-asc')"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="sortBy === 'price-asc' ? 'dropdown-active' : ''"
            >
              Harga Terendah
            </button>

            <button
              @click="selectSort('price-desc')"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="sortBy === 'price-desc' ? 'dropdown-active' : ''"
            >
              Harga Tertinggi
            </button>

            <button
              @click="selectSort('rating')"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="sortBy === 'rating' ? 'dropdown-active' : ''"
            >
              Rating Tertinggi
            </button>
          </div>
        </button>
      </div>

      <!-- Results count -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <p class="page-muted text-sm">
          Menampilkan
          <span class="page-title font-semibold">
            {{ filteredProducts.length }}
          </span>
          produk
        </p>

        <!-- Category pills -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectCategory('')"
            class="category-pill px-3 py-1 rounded-full text-xs font-medium transition-all"
            :class="selectedCategory === '' ? 'category-pill-active' : ''"
          >
            Semua
          </button>

          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectCategory(cat)"
            class="category-pill px-3 py-1 rounded-full text-xs font-medium transition-all"
            :class="selectedCategory === cat ? 'category-pill-active' : ''"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Product Grid -->
      <div
        v-if="filteredProducts.length > 0"
        class="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="(product, event) => $emit('add-to-cart', product, event)"
        />
      </div>

      <!-- Empty state -->
      <div v-if="filteredProducts.length === 0" class="empty-state text-center py-20">
        <div class="text-6xl mb-4">😔</div>
        <h3 class="page-title text-xl font-bold mb-2">
          Produk Tidak Ditemukan
        </h3>
        <p class="page-muted mb-6">
          Coba ubah filter atau kata kunci pencarian Anda.
        </p>
        <button
          @click="resetFilters"
          class="primary-btn px-6 py-3 rounded-xl text-white font-semibold transition-all"
        >
          Reset Filter
        </button>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredProducts.length > 0 && totalPages > 1"
        class="mt-10 flex flex-col items-center gap-3"
      >
        <p class="page-muted text-sm">
          Halaman
          <span class="page-title font-semibold">{{ currentPage }}</span>
          /
          <span class="page-title font-semibold">{{ totalPages }}</span>
        </p>

        <div class="flex items-center gap-2">
          <button
            id="katalog-pagination-prev"
            type="button"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            class="pagination-btn w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200"
            :class="currentPage === 1 ? 'pagination-disabled' : ''"
          >
            ←
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            :id="`katalog-page-${page}`"
            type="button"
            @click="goToPage(page)"
            class="pagination-btn w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="page === currentPage ? 'pagination-active' : ''"
          >
            {{ page }}
          </button>

          <button
            id="katalog-pagination-next"
            type="button"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="pagination-btn w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200"
            :class="currentPage === totalPages ? 'pagination-disabled' : ''"
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
import { products } from '../store.js'

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
const categories = [...new Set(products.map(p => p.category))]

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

  const matchedCategory = categories.find(
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

const filteredProducts = computed(() => {
  let result = [...products]

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
  document.addEventListener('click', closeDropdowns)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<style scoped>
.catalog-page {
  color: #e5e7eb;
  background:
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 30%),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.08), transparent 28%),
    linear-gradient(180deg, #0b1020 0%, #080b14 48%, #05070d 100%);
}

.page-title {
  color: #f8fafc;
}

.page-muted {
  color: #94a3b8;
}

.gradient-text {
  background: linear-gradient(135deg, #818cf8, #a855f7, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-icon {
  color: #94a3b8;
}

.form-control,
.dropdown-trigger {
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(129, 140, 248, 0.28);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
}

.form-control::placeholder {
  color: #64748b;
}

.form-control:focus,
.dropdown-trigger:hover {
  border-color: rgba(167, 139, 250, 0.65);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.14);
}

.selected-badge {
  color: #c4b5fd;
  background: rgba(79, 70, 229, 0.2);
}

.dropdown-menu {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 27, 75, 0.94));
  border: 1px solid rgba(129, 140, 248, 0.28);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.36);
  overflow: hidden;
}

.dropdown-item {
  color: #cbd5e1;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.24);
}

.dropdown-active {
  color: #c4b5fd;
  background: rgba(79, 70, 229, 0.18);
  font-weight: 800;
}

.category-pill {
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(129, 140, 248, 0.22);
}

.category-pill:hover {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.24);
  border-color: rgba(167, 139, 250, 0.42);
}

.category-pill-active {
  color: #ffffff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-color: rgba(167, 139, 250, 0.55);
}

.empty-state {
  background: rgba(15, 23, 42, 0.54);
  border: 1px solid rgba(129, 140, 248, 0.18);
  border-radius: 1.5rem;
}

.primary-btn {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.32);
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 38px rgba(124, 58, 237, 0.4);
}

.pagination-btn {
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(129, 140, 248, 0.24);
}

.pagination-btn:hover:not(:disabled) {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.24);
  border-color: rgba(167, 139, 250, 0.45);
}

.pagination-active {
  color: #ffffff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-color: rgba(167, 139, 250, 0.55);
}

.pagination-disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

/* Force ProductCard inside catalog to follow dark theme */
.product-grid :deep(article),
.product-grid :deep(.product-card),
.product-grid :deep(.card),
.product-grid :deep([class*="card"]) {
  color: #f8fafc !important;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(30, 27, 75, 0.84)) !important;
  border-color: rgba(129, 140, 248, 0.22) !important;
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.24) !important;
}

.product-grid :deep(article:hover),
.product-grid :deep(.product-card:hover),
.product-grid :deep(.card:hover),
.product-grid :deep([class*="card"]:hover) {
  border-color: rgba(167, 139, 250, 0.48) !important;
  box-shadow: 0 24px 60px rgba(79, 70, 229, 0.18) !important;
}

.product-grid :deep([style*="background: #fff"]),
.product-grid :deep([style*="background:#fff"]),
.product-grid :deep([style*="background: #f8fafc"]),
.product-grid :deep([style*="background:#f8fafc"]),
.product-grid :deep([style*="background: #f1f5f9"]),
.product-grid :deep([style*="background:#f1f5f9"]) {
  background: rgba(226, 232, 240, 0.08) !important;
}

.product-grid :deep([style*="color: #0f172a"]),
.product-grid :deep([style*="color:#0f172a"]),
.product-grid :deep([style*="color: #111827"]),
.product-grid :deep([style*="color:#111827"]),
.product-grid :deep([style*="color: #1e293b"]),
.product-grid :deep([style*="color:#1e293b"]),
.product-grid :deep([style*="color: #334155"]),
.product-grid :deep([style*="color:#334155"]),
.product-grid :deep([style*="color: #374151"]),
.product-grid :deep([style*="color:#374151"]) {
  color: #f8fafc !important;
}

.product-grid :deep([style*="color: #64748b"]),
.product-grid :deep([style*="color:#64748b"]),
.product-grid :deep([style*="color: #94a3b8"]),
.product-grid :deep([style*="color:#94a3b8"]),
.product-grid :deep(.text-gray-500),
.product-grid :deep(.text-slate-500) {
  color: #94a3b8 !important;
}

.product-grid :deep([style*="color: #4f46e5"]),
.product-grid :deep([style*="color:#4f46e5"]) {
  color: #a78bfa !important;
}

.product-grid :deep(button) {
  color: #ffffff !important;
}

.product-grid :deep(img) {
  background: transparent !important;
}
</style>