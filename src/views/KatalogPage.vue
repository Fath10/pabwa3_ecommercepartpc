<template>
  <main class="pt-24 pb-16 min-h-screen" style="background: #f9fafb;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-black mb-3" style="color: #111827;">Katalog <span class="text-indigo-600">Produk</span></h1>
        <p class="text-gray-500">Temukan komponen PC terbaik untuk kebutuhan Anda</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Cari produk..."
            id="search-input"
            class="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
            style="background: #fff; border: 1px solid #d1d5db; color: #111827;"
          />
        </div>

        <select
          v-model="selectedCategory"
          id="category-filter"
          class="px-4 py-3 rounded-xl outline-none transition-all cursor-pointer"
          style="background: #fff; border: 1px solid #d1d5db; color: #111827;"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select
          v-model="sortBy"
          id="sort-filter"
          class="px-4 py-3 rounded-xl outline-none transition-all cursor-pointer"
          style="background: #fff; border: 1px solid #d1d5db; color: #111827;"
        >
          <option value="default">Urutan Default</option>
          <option value="price-asc">Harga Terendah</option>
          <option value="price-desc">Harga Tertinggi</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>

      <div class="flex items-center justify-between mb-6">
        <p class="text-sm" style="color: #6b7280;">
          Menampilkan <span class="font-semibold" style="color: #111827;">{{ filteredProducts.length }}</span> produk
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedCategory = ''"
            class="px-3 py-1 rounded-full text-xs font-medium transition-all"
            :class="selectedCategory === '' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'"
            style="border: 1px solid #e5e7eb;"
          >Semua</button>
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-3 py-1 rounded-full text-xs font-medium transition-all"
            :class="selectedCategory.toLowerCase().trim() === cat.toLowerCase().trim() ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'"
            style="border: 1px solid #e5e7eb;"
          >{{ cat }}</button>
        </div>
      </div>

      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="$emit('add-to-cart', $event)"
        />
      </div>

      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">😔</div>
        <h3 class="text-white text-xl font-bold mb-2">Produk Tidak Ditemukan</h3>
        <p class="text-gray-400 mb-6">Coba ubah filter atau kata kunci pencarian Anda.</p>
        <button @click="resetFilters" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all">
          Reset Filter
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { products } from '../store.js'

defineEmits(['add-to-cart'])

const route = useRoute()

const search = ref('')
const selectedCategory = ref('')
const sortBy = ref('default')

const categories = [...new Set(products.map(p => p.category.trim()))]

function applyCategoryFromQuery() {
  if (route.query.category) {
    selectedCategory.value = route.query.category
  }
}

onMounted(() => {
  applyCategoryFromQuery()
})

watch(
  () => route.query.category,
  () => {
    applyCategoryFromQuery()
  }
)

const filteredProducts = computed(() => {
  let result = [...products]
  if (search.value) {
    result = result.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
  }
  if (selectedCategory.value) {
    result = result.filter(p => 
      p.category.toLowerCase().trim() === selectedCategory.value.toLowerCase().trim()
    )
  }
  if (sortBy.value === 'price-asc') result.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'price-desc') result.sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'rating') result.sort((a, b) => b.rating - a.rating)
  return result
})

function resetFilters() {
  search.value = ''
  selectedCategory.value = ''
  sortBy.value = 'default'
}
</script>