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
        <div class="relative">
          <button
            type="button"
            @click.stop="toggleCategoryDropdown"
            class="dropdown-trigger px-4 py-3 rounded-xl outline-none transition-all cursor-pointer flex items-center gap-2"
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
          </button>

          <div
            v-if="showCategoryDropdown"
            @click.stop
            class="dropdown-menu category-dropdown absolute top-full left-0 mt-2 rounded-xl shadow-lg z-50 min-w-52 py-2"
          >
            <button
              type="button"
              @click="selectCategory(''); showCategoryDropdown = false"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="selectedCategory === '' ? 'dropdown-active' : ''"
            >
              Semua Kategori
            </button>

            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              @click="selectCategory(cat); showCategoryDropdown = false"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="selectedCategory === cat ? 'dropdown-active' : ''"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Sort Button -->
        <div class="relative">
          <button
            type="button"
            @click.stop="toggleSortDropdown"
            class="dropdown-trigger px-4 py-3 rounded-xl outline-none transition-all cursor-pointer flex items-center gap-2"
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
          </button>

          <div
            v-if="showSortDropdown"
            @click.stop
            class="dropdown-menu sort-dropdown absolute top-full right-0 mt-2 rounded-xl shadow-lg z-50 min-w-44 py-2"
          >
            <button
              type="button"
              @click="selectSort('default')"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="sortBy === 'default' ? 'dropdown-active' : ''"
            >
              Default
            </button>

            <button
              type="button"
              @click="selectSort('price-asc')"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="sortBy === 'price-asc' ? 'dropdown-active' : ''"
            >
              Harga Terendah
            </button>

            <button
              type="button"
              @click="selectSort('price-desc')"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="sortBy === 'price-desc' ? 'dropdown-active' : ''"
            >
              Harga Tertinggi
            </button>

            <button
              type="button"
              @click="selectSort('rating')"
              class="dropdown-item w-full text-left px-4 py-2 text-sm"
              :class="sortBy === 'rating' ? 'dropdown-active' : ''"
            >
              Rating Tertinggi
            </button>
          </div>
        </div>
      </div>

      <!-- Results + Category Navigation -->
      <div class="catalog-toolbar flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <p class="page-muted text-sm shrink-0">
          Menampilkan
          <span class="page-title font-semibold">
            {{ filteredProducts.length }}
          </span>
          produk
        </p>

        <!-- Kategori dibuat sama seperti footer -->
        <div class="category-nav">
          <button
            type="button"
            @click="selectCategory('')"
            class="category-pill px-3 py-1 rounded-full text-xs font-medium transition-all"
            :class="selectedCategory === '' ? 'category-pill-active' : ''"
          >
            Semua
          </button>

          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            @click="selectCategory(cat)"
            class="category-pill px-3 py-1 rounded-full text-xs font-medium transition-all"
            :class="selectedCategory === cat ? 'category-pill-active' : ''"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="loader inline-block w-10 h-10 rounded-full"></div>
        <p class="page-muted mt-4 text-sm">Memuat produk...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="empty-state text-center py-20">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="page-title text-xl font-bold mb-2">
          Gagal Memuat Produk
        </h3>
        <p class="page-muted mb-6">
          {{ loadError }}
        </p>
        <button
          type="button"
          @click="productStore.fetchAll(true)"
          class="primary-btn px-6 py-3 rounded-xl text-white font-semibold transition-all"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Product Grid -->
      <div
        v-else-if="filteredProducts.length > 0"
        class="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state text-center py-20">
        <div class="text-6xl mb-4">😔</div>
        <h3 class="page-title text-xl font-bold mb-2">
          Produk Tidak Ditemukan
        </h3>
        <p class="page-muted mb-6">
          Coba ubah filter atau kata kunci pencarian Anda.
        </p>
        <button
          type="button"
          @click="resetFilters"
          class="primary-btn px-6 py-3 rounded-xl text-white font-semibold transition-all"
        >
          Reset Filter
        </button>
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && !loadError && filteredProducts.length > 0 && totalPages > 1"
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

// Kategori dibuat sama seperti footer
const FOOTER_CATEGORIES = [
  'Laptop',
  'Processor',
  'GPU',
  'RAM',
  'Storage',
  'Cooling',
  'PSU',
  'Casing',
  'Motherboard',
  'Monitor'
]

// Ambil data produk dari database/store
const products = computed(() => {
  return Array.isArray(productStore.items) ? productStore.items : []
})

// Kategori yang tampil hanya kategori footer
const categories = computed(() => {
  return FOOTER_CATEGORIES
})

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

// Mapping kategori dari database agar sesuai dengan footer
function displayCategory(category) {
  const value = String(category || '').trim().toLowerCase()

  const aliases = {
    laptop: 'Laptop',
    laptops: 'Laptop',

    processor: 'Processor',
    processors: 'Processor',
    cpu: 'Processor',
    cpus: 'Processor',

    gpu: 'GPU',
    gpus: 'GPU',
    vga: 'GPU',
    graphics: 'GPU',
    graphic: 'GPU',
    kartu_grafis: 'GPU',
    'kartu grafis': 'GPU',

    ram: 'RAM',
    memory: 'RAM',
    memori: 'RAM',

    storage: 'Storage',
    ssd: 'Storage',
    hdd: 'Storage',
    harddisk: 'Storage',
    hardisk: 'Storage',

    cooling: 'Cooling',
    cooler: 'Cooling',
    fan: 'Cooling',
    kipas: 'Cooling',

    psu: 'PSU',
    power: 'PSU',
    power_supply: 'PSU',
    'power supply': 'PSU',

    casing: 'Casing',
    case: 'Casing',

    motherboard: 'Motherboard',
    mainboard: 'Motherboard',
    mobo: 'Motherboard',

    monitor: 'Monitor',
    monitors: 'Monitor'
  }

  return aliases[value] || ''
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

function handleAddToCart(product, event) {
  emit('add-to-cart', product, event)
}

watch(
  () => route.query.category,
  category => {
    selectedCategory.value = normalizeCategory(category)
    currentPage.value = 1
  },
  { immediate: true }
)

watch(
  () => route.query.q,
  q => {
    search.value = typeof q === 'string' ? q : ''
    currentPage.value = 1
  },
  { immediate: true }
)

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (search.value) {
    const keyword = search.value.toLowerCase()

    result = result.filter(product =>
      String(product.name || '').toLowerCase().includes(keyword) ||
      displayCategory(product.category).toLowerCase().includes(keyword)
    )
  }

  if (selectedCategory.value) {
    result = result.filter(product =>
      displayCategory(product.category) === selectedCategory.value
    )
  }

  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
  } else if (sortBy.value === 'rating') {
    result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
  }

  return result
})

watch([search, selectedCategory, sortBy], () => {
  currentPage.value = 1
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / PRODUCTS_PER_PAGE))
)

watch(totalPages, pages => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

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

.category-dropdown {
  left: 0;
}

.sort-dropdown {
  right: 0;
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

.catalog-toolbar {
  width: 100%;
}

.category-nav {
  max-width: 760px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 8px;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.category-nav::-webkit-scrollbar {
  display: none;
}

.category-pill {
  flex: 0 0 auto;
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(129, 140, 248, 0.22);
  white-space: nowrap;
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

.loader {
  border: 4px solid rgba(129, 140, 248, 0.22);
  border-top-color: #818cf8;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

/* Paksa ProductCard ikut tema dark */
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

.product-grid :deep(button) {
  color: #ffffff !important;
}

.product-grid :deep(img) {
  background: transparent !important;
}

@media (max-width: 1024px) {
  .category-nav {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .form-control {
    min-width: 100%;
  }

  .category-nav {
    justify-content: flex-start;
  }
}
</style>