<template>
  <main class="min-h-screen pt-24 px-6 pb-10 admin-bg">
    <section class="max-w-7xl mx-auto">
      <div class="admin-header mb-7">
        <div>
          <p class="admin-kicker">Inventory</p>
          <h1 class="admin-title">Kelola Produk</h1>
          <p class="admin-user">Halo, {{ userStore.user?.name || 'Admin' }}</p>
        </div>

        <button @click="loadProducts" class="primary-btn">
          Refresh Data
        </button>
      </div>

      <div
        v-if="errorMessage"
        class="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 px-4 py-3"
      >
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div class="stat-card stat-blue">
          <p class="stat-label">Total Produk</p>
          <h2 class="stat-number">{{ products.length }}</h2>
        </div>

        <div class="stat-card stat-green">
          <p class="stat-label">Total Stok</p>
          <h2 class="stat-number">{{ totalStock }}</h2>
        </div>

        <div class="stat-card stat-purple">
          <p class="stat-label">Kategori</p>
          <h2 class="stat-number">{{ categories.length }}</h2>
        </div>

        <div class="stat-card stat-amber">
          <p class="stat-label">Stok Menipis</p>
          <h2 class="stat-number text-amber-300">{{ lowStockCount }}</h2>
        </div>
      </div>

      <section class="panel overflow-hidden">
        <div class="p-5 border-b border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama produk..."
            class="admin-input md:col-span-2"
          />

          <select v-model="selectedCategory" class="admin-input">
            <option value="">Semua Kategori</option>
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <div v-if="isLoading" class="empty-state">
          Memuat produk...
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-gray-400 border-b border-white/10">
                <th class="px-5 py-3">Produk</th>
                <th class="px-5 py-3">Kategori</th>
                <th class="px-5 py-3">Harga</th>
                <th class="px-5 py-3">Stok</th>
                <th class="px-5 py-3">Badge</th>
                <th class="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="border-b border-white/5 text-gray-300 hover:bg-white/[0.03]"
              >
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3 min-w-[280px]">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="w-11 h-11 rounded-xl object-cover bg-white/5"
                      @error="handleImageError"
                    />

                    <div>
                      <p class="font-bold text-white">
                        {{ product.name }}
                      </p>

                      <p class="text-xs text-gray-500">
                        Rating {{ product.rating }} · {{ product.reviews }} ulasan
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-3">
                  {{ product.category }}
                </td>

                <td class="px-5 py-3 font-semibold text-indigo-300">
                  {{ formatPrice(product.price) }}
                </td>

                <td class="px-5 py-3">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-bold"
                    :class="product.stock <= 10
                      ? 'bg-amber-500/10 text-amber-300'
                      : 'bg-green-500/10 text-green-300'"
                  >
                    {{ product.stock }}
                  </span>
                </td>

                <td class="px-5 py-3">
                  <span class="px-2 py-1 rounded-full bg-white/5 text-gray-300 text-xs">
                    {{ product.badge }}
                  </span>
                </td>

                <td class="px-5 py-3">
                  <div class="flex justify-end">
                    <button
                      @click="deleteProduct(product.id)"
                      class="danger-btn"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredProducts.length === 0">
                <td colspan="6" class="px-5 py-8 text-center text-gray-500">
                  Produk tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatPrice, userStore } from '../../store.js'

const API_BASE_URL = 'http://localhost:3000'

const products = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const categories = computed(() => {
  return [...new Set(products.value.map(product => product.category).filter(Boolean))]
})

const totalStock = computed(() => {
  return products.value.reduce((sum, product) => sum + product.stock, 0)
})

const lowStockCount = computed(() => {
  return products.value.filter(product => product.stock <= 10).length
})

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return products.value.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(query)
    const matchCategory = selectedCategory.value
      ? product.category === selectedCategory.value
      : true

    return matchSearch && matchCategory
  })
})

function extractArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data.products)) return data.products
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.result)) return data.result
  if (Array.isArray(data.rows)) return data.rows
  return []
}

function getImageUrl(product) {
  const image =
    product.image ||
    product.image_url ||
    product.thumbnail ||
    product.photo ||
    product.picture ||
    product.images

  if (!image) return '/corsair_ram.png'

  if (Array.isArray(image)) {
    const first = image[0]
    if (!first) return '/corsair_ram.png'

    if (typeof first === 'string') {
      return getImageUrl({ image: first })
    }

    return getImageUrl({
      image: first.image_url || first.url || first.path || first.filename,
    })
  }

  if (typeof image !== 'string') return '/corsair_ram.png'
  if (image.startsWith('http')) return image
  if (image.startsWith('/uploads')) return `${API_BASE_URL}${image}`
  if (image.startsWith('uploads')) return `${API_BASE_URL}/${image}`
  if (image.startsWith('/')) return image

  return `${API_BASE_URL}/uploads/${image}`
}

function normalizeProduct(product) {
  return {
    id: product.product_id ?? product.id,
    name: product.name ?? product.product_name ?? product.title ?? 'Produk tanpa nama',
    category:
      product.category_name ??
      product.category ??
      product.category_title ??
      product.category?.name ??
      '-',
    price: Number(product.price ?? product.product_price ?? product.final_price ?? product.selling_price ?? 0),
    stock: Number(product.stock ?? product.quantity ?? product.product_stock ?? 0),
    image: getImageUrl(product),
    badge: product.badge ?? product.badge_name ?? product.label ?? '-',
    rating: Number(product.rating ?? product.average_rating ?? product.avg_rating ?? 0),
    reviews: Number(product.reviews ?? product.review_count ?? product.total_reviews ?? 0),
  }
}

async function loadProducts() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await fetch(`${API_BASE_URL}/api/products`)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Gagal mengambil data produk')
    }

    products.value = extractArray(data).map(normalizeProduct)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function deleteProduct(productId) {
  const confirmed = confirm('Yakin ingin menghapus produk ini?')
  if (!confirmed) return

  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'Gagal menghapus produk')
    }

    await loadProducts()
  } catch (error) {
    alert(error.message)
  }
}

function handleImageError(event) {
  event.target.src = '/corsair_ram.png'
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.admin-bg {
  background:
    radial-gradient(circle at 12% 10%, rgba(79, 70, 229, 0.12), transparent 28%),
    radial-gradient(circle at 88% 16%, rgba(14, 165, 233, 0.08), transparent 26%),
    #0d1117;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px;
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(135deg, rgba(79,70,229,0.12), rgba(14,165,233,0.05)),
    rgba(255,255,255,0.035);
}

.admin-kicker {
  color: #818cf8;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.admin-title {
  color: white;
  font-size: 2rem;
  font-weight: 950;
  margin-top: 4px;
}

.admin-user {
  color: #94a3b8;
  margin-top: 4px;
}

.primary-btn {
  padding: 10px 16px;
  border-radius: 14px;
  background: rgba(99,102,241,0.16);
  border: 1px solid rgba(129,140,248,0.35);
  color: #c7d2fe;
  font-size: 0.85rem;
  font-weight: 800;
  transition: 0.2s;
}

.primary-btn:hover {
  background: rgba(99,102,241,0.25);
  color: white;
}

.stat-card {
  min-height: 118px;
  padding: 20px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  position: relative;
  overflow: hidden;
}

.stat-card::after {
  content: "";
  position: absolute;
  right: -38px;
  bottom: -52px;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  opacity: 0.16;
}

.stat-blue::after { background: #3b82f6; }
.stat-green::after { background: #22c55e; }
.stat-purple::after { background: #8b5cf6; }
.stat-amber::after { background: #f59e0b; }

.stat-label {
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 800;
}

.stat-number {
  color: white;
  font-size: 2rem;
  font-weight: 950;
  margin-top: 7px;
}

.panel {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  border-radius: 22px;
}

.admin-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  color: white;
  outline: none;
  background: rgba(255,255,255,0.055);
  border: 1px solid rgba(255,255,255,0.1);
}

.admin-input:focus {
  border-color: rgba(129,140,248,0.7);
}

.danger-btn {
  padding: 8px 11px;
  border-radius: 11px;
  border: 1px solid rgba(244,63,94,0.25);
  color: #fda4af;
  font-size: 0.75rem;
  font-weight: 800;
  transition: 0.2s;
}

.danger-btn:hover {
  background: rgba(244,63,94,0.12);
}

.empty-state {
  padding: 32px 10px;
  color: #64748b;
  text-align: center;
}
</style>