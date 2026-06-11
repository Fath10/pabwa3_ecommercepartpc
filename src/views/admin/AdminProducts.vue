<template>
  <main class="min-h-screen pt-24 px-6 pb-10 admin-bg">
    <section class="max-w-7xl mx-auto">
      <div class="admin-header mb-7">
        <div>
          <p class="admin-kicker">Inventory</p>
          <h1 class="admin-title">Kelola Produk</h1>
          <p class="admin-user">Halo, {{ userStore.user?.name || 'Admin' }}</p>
        </div>

        <div class="flex gap-3">
          <button @click="loadProducts" class="secondary-btn">
            Refresh Data
          </button>

          <button @click="openCreateModal" class="primary-btn">
            + Tambah Produk
          </button>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 px-4 py-3"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="successMessage"
        class="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 text-green-200 px-4 py-3"
      >
        {{ successMessage }}
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
                    {{ product.badge || '-' }}
                  </span>
                </td>

                <td class="px-5 py-3">
                  <div class="flex justify-end gap-2">
                    <button
                      @click="openEditModal(product)"
                      class="edit-btn"
                    >
                      Edit
                    </button>

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

    <Transition name="modal-fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-sm"
      >
        <div class="modal-card w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-start justify-between gap-4 mb-5">
            <div>
              <p class="admin-kicker">
                {{ isEditing ? 'Edit Produk' : 'Tambah Produk' }}
              </p>

              <h2 class="text-2xl font-black text-white mt-1">
                {{ isEditing ? form.product_name : 'Produk Baru' }}
              </h2>

              <p class="text-sm text-gray-400 mt-1">
                Upload gambar baru hanya jika ingin mengganti gambar lama.
              </p>
            </div>

            <button @click="closeModal" class="close-btn">
              ✕
            </button>
          </div>

          <form @submit.prevent="submitProduct" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Nama Produk</label>
                <input
                  v-model="form.product_name"
                  type="text"
                  class="admin-input"
                  required
                  placeholder="Contoh: ASUS ROG Swift OLED"
                />
              </div>

              <div>
                <label class="form-label">Kategori</label>
                <select
                  v-model="form.category_id"
                  class="admin-input"
                  required
                >
                  <option value="">Pilih kategori</option>
                  <option
                    v-for="category in categoryOptions"
                    :key="category.category_id"
                    :value="category.category_id"
                  >
                    {{ category.category_name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="form-label">Harga</label>
                <input
                  v-model="form.price"
                  type="number"
                  min="1"
                  class="admin-input"
                  required
                  placeholder="14500000"
                />
              </div>

              <div>
                <label class="form-label">Harga Asli</label>
                <input
                  v-model="form.original_price"
                  type="number"
                  min="1"
                  class="admin-input"
                  required
                  placeholder="15000000"
                />
              </div>

              <div>
                <label class="form-label">Stok</label>
                <input
                  v-model="form.stock"
                  type="number"
                  min="0"
                  class="admin-input"
                  required
                  placeholder="10"
                />
              </div>

              <div>
                <label class="form-label">Badge</label>
                <select v-model="selectedBadgeId" class="admin-input">
                  <option value="">Tanpa badge</option>
                  <option
                    v-for="badge in badgeOptions"
                    :key="badge.badge_id || badge.id"
                    :value="badge.badge_id || badge.id"
                  >
                    {{ badge.badge_name || badge.name }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label">Deskripsi</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="admin-input resize-none"
                placeholder="Deskripsi singkat produk..."
              ></textarea>
            </div>

            <div>
              <label class="form-label">Spesifikasi</label>
              <textarea
                v-model="specsText"
                rows="5"
                class="admin-input resize-none font-mono text-xs"
                placeholder='Contoh:
{
  "Panel": "OLED",
  "Refresh Rate": "240Hz"
}'
              ></textarea>

              <p class="text-xs text-gray-500 mt-1">
                Format JSON. Boleh kosong, nanti otomatis menjadi {}.
              </p>
            </div>

            <div>
              <label class="form-label">Gambar Produk</label>

              <input
                type="file"
                multiple
                accept="image/*"
                class="admin-input"
                @change="handleImageChange"
              />

              <p class="text-xs text-gray-500 mt-1">
                Maksimal 5 gambar. Untuk edit, upload gambar baru akan mengganti gambar lama.
              </p>

              <div
                v-if="existingImages.length > 0"
                class="mt-3"
              >
                <p class="text-xs text-gray-400 mb-2">Gambar saat ini:</p>

                <div class="flex flex-wrap gap-3">
                  <img
                    v-for="image in existingImages"
                    :key="image"
                    :src="getImageUrl({ image })"
                    class="preview-img"
                    @error="handleImageError"
                  />
                </div>
              </div>

              <div
                v-if="previewImages.length > 0"
                class="mt-3"
              >
                <p class="text-xs text-gray-400 mb-2">Preview gambar baru:</p>

                <div class="flex flex-wrap gap-3">
                  <img
                    v-for="image in previewImages"
                    :key="image"
                    :src="image"
                    class="preview-img"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="modalError"
              class="rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 px-4 py-3 text-sm"
            >
              {{ modalError }}
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeModal" class="secondary-btn">
                Batal
              </button>

              <button type="submit" class="primary-btn" :disabled="isSaving">
                {{ isSaving ? 'Menyimpan...' : 'Simpan Produk' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatPrice, userStore } from '../../store.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const FALLBACK_IMAGE = '/corsair_ram.png'

const products = ref([])
const categoryOptions = ref([])
const badgeOptions = ref([])

const searchQuery = ref('')
const selectedCategory = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const modalError = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const selectedFiles = ref([])
const previewImages = ref([])
const existingImages = ref([])
const selectedBadgeId = ref('')

const form = ref({
  category_id: '',
  product_name: '',
  description: '',
  price: '',
  original_price: '',
  stock: '',
})

const specsText = ref('{}')

const categories = computed(() => {
  return [...new Set(products.value.map(product => product.category).filter(Boolean))]
})

const totalStock = computed(() => {
  return products.value.reduce((sum, product) => sum + Number(product.stock || 0), 0)
})

const lowStockCount = computed(() => {
  return products.value.filter(product => Number(product.stock || 0) <= 10).length
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
  if (Array.isArray(data?.products)) return data.products
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.result)) return data.result
  if (Array.isArray(data?.rows)) return data.rows
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

  if (!image) return FALLBACK_IMAGE

  if (Array.isArray(image)) {
    const first = image[0]
    if (!first) return FALLBACK_IMAGE

    if (typeof first === 'string') {
      return getImageUrl({ image: first })
    }

    return getImageUrl({
      image: first.image_url || first.url || first.path || first.filename,
    })
  }

  if (typeof image !== 'string') return FALLBACK_IMAGE
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
    originalPrice: Number(product.originalPrice ?? product.original_price ?? 0),
    stock: Number(product.stock ?? product.quantity ?? product.product_stock ?? 0),
    image: getImageUrl(product),
    badge: product.badge ?? product.badge_name ?? product.label ?? '-',
    rating: Number(product.rating ?? product.average_rating ?? product.avg_rating ?? 0),
    reviews: Number(product.reviews ?? product.review_count ?? product.total_reviews ?? 0),
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`,
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

async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`)
    const data = await res.json()

    categoryOptions.value = extractArray(data)
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
}

async function loadBadges() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/badges`)
    const data = await res.json()

    badgeOptions.value = extractArray(data)
  } catch (error) {
    console.error('Gagal mengambil badge:', error)
  }
}

function resetForm() {
  form.value = {
    category_id: '',
    product_name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
  }

  specsText.value = '{}'
  selectedBadgeId.value = ''
  selectedFiles.value = []
  previewImages.value = []
  existingImages.value = []
  modalError.value = ''
  editingId.value = null
  isEditing.value = false
}

function openCreateModal() {
  resetForm()
  showModal.value = true
}

async function openEditModal(product) {
  resetForm()
  isEditing.value = true
  editingId.value = product.id
  modalError.value = ''

  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${product.id}`)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Gagal mengambil detail produk')
    }

    form.value = {
      category_id: data.categoryId || '',
      product_name: data.name || '',
      description: data.description || '',
      price: data.price || '',
      original_price: data.originalPrice || data.price || '',
      stock: data.stock || 0,
    }

    specsText.value = JSON.stringify(data.specs || {}, null, 2)
    existingImages.value = Array.isArray(data.images) ? data.images : []

    const firstBadge = Array.isArray(data.badges) ? data.badges[0] : null
    selectedBadgeId.value = firstBadge?.id || ''
    showModal.value = true
  } catch (error) {
    alert(error.message)
  }
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function handleImageChange(event) {
  const files = Array.from(event.target.files || []).slice(0, 5)

  selectedFiles.value = files
  previewImages.value.forEach(url => URL.revokeObjectURL(url))
  previewImages.value = files.map(file => URL.createObjectURL(file))
}

function buildFormData() {
  let parsedSpecs = {}

  if (specsText.value.trim()) {
    try {
      parsedSpecs = JSON.parse(specsText.value)
    } catch {
      throw new Error('Format spesifikasi harus JSON valid.')
    }
  }

  const fd = new FormData()

  fd.append('category_id', form.value.category_id)
  fd.append('product_name', form.value.product_name)
  fd.append('description', form.value.description || '')
  fd.append('price', form.value.price)
  fd.append('original_price', form.value.original_price || form.value.price)
  fd.append('stock', form.value.stock)
  fd.append('specs', JSON.stringify(parsedSpecs))

  const badgeIds = selectedBadgeId.value ? [Number(selectedBadgeId.value)] : []
  fd.append('badge_ids', JSON.stringify(badgeIds))

  selectedFiles.value.forEach((file) => {
    fd.append('images', file)
  })

  return fd
}

async function submitProduct() {
  modalError.value = ''
  successMessage.value = ''
  isSaving.value = true

  try {
    const fd = buildFormData()

    const url = isEditing.value
      ? `${API_BASE_URL}/api/products/${editingId.value}`
      : `${API_BASE_URL}/api/products`

    const method = isEditing.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: fd,
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'Gagal menyimpan produk')
    }

    successMessage.value = isEditing.value
      ? 'Produk berhasil diperbarui.'
      : 'Produk berhasil ditambahkan.'

    closeModal()
    await loadProducts()
  } catch (error) {
    modalError.value = error.message
  } finally {
    isSaving.value = false
  }
}

async function deleteProduct(productId) {
  const confirmed = confirm('Yakin ingin menghapus produk ini?')
  if (!confirmed) return

  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'Gagal menghapus produk')
    }

    successMessage.value = 'Produk berhasil dihapus.'
    await loadProducts()
  } catch (error) {
    alert(error.message)
  }
}

function handleImageError(event) {
  event.target.src = FALLBACK_IMAGE
}

onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadCategories(),
    loadBadges(),
  ])
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

.primary-btn,
.secondary-btn {
  padding: 10px 16px;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 800;
  transition: 0.2s;
}

.primary-btn {
  background: #4f46e5;
  border: 1px solid rgba(129,140,248,0.6);
  color: white;
}

.primary-btn:hover {
  background: #6366f1;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary-btn {
  background: rgba(99,102,241,0.16);
  border: 1px solid rgba(129,140,248,0.35);
  color: #c7d2fe;
}

.secondary-btn:hover {
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

.panel,
.modal-card {
  border: 1px solid rgba(255,255,255,0.08);
  background: #111827;
  border-radius: 22px;
}

.modal-card {
  padding: 24px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.45);
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

.form-label {
  display: block;
  color: #cbd5e1;
  font-size: 0.78rem;
  font-weight: 800;
  margin-bottom: 7px;
}

.edit-btn,
.danger-btn,
.close-btn {
  padding: 8px 11px;
  border-radius: 11px;
  font-size: 0.75rem;
  font-weight: 800;
  transition: 0.2s;
}

.edit-btn {
  border: 1px solid rgba(129,140,248,0.28);
  color: #c7d2fe;
}

.edit-btn:hover {
  background: rgba(99,102,241,0.16);
}

.danger-btn {
  border: 1px solid rgba(244,63,94,0.25);
  color: #fda4af;
}

.danger-btn:hover {
  background: rgba(244,63,94,0.12);
}

.close-btn {
  color: #94a3b8;
  background: rgba(255,255,255,0.05);
}

.close-btn:hover {
  color: white;
  background: rgba(255,255,255,0.1);
}

.empty-state {
  padding: 32px 10px;
  color: #64748b;
  text-align: center;
}

.preview-img {
  width: 76px;
  height: 76px;
  border-radius: 14px;
  object-fit: cover;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
/* FIX SELECT DROPDOWN ADMIN - DARK MODE */
select.admin-input,
select.action-select {
  color-scheme: dark;
  background-color: rgba(17, 24, 39, 0.98) !important;
  color: #f8fafc !important;
  border-color: rgba(129, 140, 248, 0.45) !important;
}

select.admin-input:focus,
select.action-select:focus {
  border-color: rgba(129, 140, 248, 0.85) !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18) !important;
}

select.admin-input option,
select.admin-input optgroup,
select.action-select option,
select.action-select optgroup {
  background-color: #111827 !important;
  color: #f8fafc !important;
}

select.admin-input option:checked,
select.action-select option:checked {
  background-color: #2563eb !important;
  color: #ffffff !important;
}

select.admin-input option:hover,
select.action-select option:hover {
  background-color: #1d4ed8 !important;
  color: #ffffff !important;
}

</style>