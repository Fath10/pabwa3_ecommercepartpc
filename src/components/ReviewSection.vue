<template>
  <section class="border-t pt-12 mb-12" style="border-color: #e2e8f0;">
    <div
      class="rounded-3xl overflow-hidden"
      style="background: #fff; border: 1px solid #e2e8f0;"
    >
      <!-- Rating Summary -->
      <div class="p-6 sm:p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-extrabold tracking-tight mb-2" style="color: #0f172a;">
            Penilaian Produk
          </h2>
          <p class="text-sm leading-relaxed" style="color: #64748b;">
            Ringkasan rating produk dan ulasan dari pengguna.
          </p>
        </div>

        <div
          class="rounded-3xl p-5 sm:p-6"
          style="background: #f8fafc; border: 1px solid #e2e8f0;"
        >
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="md:w-56 flex-shrink-0">
              <div class="flex items-end gap-2">
                <span class="text-5xl font-extrabold leading-none" style="color: #4f46e5;">
                  {{ displayRating }}
                </span>
                <span class="text-sm mb-1.5" style="color: #64748b;">dari 5</span>
              </div>

              <div class="flex items-center gap-1 mt-2">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-xl"
                  :class="star <= Math.round(averageRating) ? 'text-amber-400' : 'text-gray-200'"
                >
                  ★
                </span>
              </div>
            </div>

            <div class="hidden md:block w-px h-20" style="background: #e2e8f0;"></div>

            <div class="flex-1">
              <p class="text-sm font-semibold mb-1" style="color: #0f172a;">
                Berdasarkan {{ totalReviewCount }} ulasan produk
              </p>
              <p class="text-sm leading-relaxed" style="color: #64748b;">
                Ulasan diambil langsung dari database e-BuildPC dan diperbarui secara otomatis.
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="successMessage"
          class="mt-5 px-4 py-3 rounded-2xl text-sm font-semibold"
          style="background: #ecfdf5; color: #047857; border: 1px solid #bbf7d0;"
        >
          {{ successMessage }}
        </div>

        <div
          v-if="loadError"
          class="mt-5 px-4 py-3 rounded-2xl text-sm font-semibold"
          style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;"
        >
          {{ loadError }}
        </div>
      </div>

      <!-- Review Area -->
      <div class="px-6 sm:px-8 pb-8">
        <div class="pt-6" style="border-top: 1px solid #e2e8f0;">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h3 class="text-xl font-bold" style="color: #0f172a;">
                Ulasan Pembeli
              </h3>
              <p class="text-sm mt-1" style="color: #64748b;">
                Bagikan pengalaman Anda dengan produk ini.
              </p>
            </div>

            <div class="sm:text-right">
              <button
                v-if="isLoggedIn"
                type="button"
                @click="openForm"
                class="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-sm transition-all hover:bg-indigo-50"
                style="color: #4f46e5; border: 1px solid #c7d2fe; background: #fff;"
              >
                Tulis Ulasan
              </button>

              <RouterLink
                v-else
                to="/login"
                class="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-2xl font-bold text-sm transition-all hover:bg-indigo-50"
                style="color: #4f46e5; border: 1px solid #c7d2fe; background: #fff;"
              >
                Login untuk Mengulas
              </RouterLink>
            </div>
          </div>

          <!-- Filter -->
          <div v-if="reviews.length > 0" class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="filter in reviewFilters"
              :key="filter.value"
              type="button"
              @click="activeFilter = filter.value"
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              :class="activeFilter === filter.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'"
              style="border: 1px solid #e2e8f0;"
            >
              {{ filter.label }}
            </button>
          </div>

          <p v-if="reviews.length > 0" class="text-sm mb-5" style="color: #94a3b8;">
            Menampilkan {{ filteredReviews.length }} ulasan
          </p>

          <!-- Loading -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-sm" style="color: #94a3b8;">Memuat ulasan…</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="reviews.length === 0" class="text-center py-12">
            <div class="text-5xl mb-3">💬</div>

            <p class="text-base font-bold" style="color: #0f172a;">
              Belum ada ulasan pengguna
            </p>

            <p class="text-sm mt-2 mb-5 max-w-md mx-auto" style="color: #94a3b8;">
              Jadilah pengguna pertama yang memberi rating dan menulis ulasan untuk produk ini.
            </p>

            <button
              v-if="isLoggedIn"
              type="button"
              @click="openForm"
              class="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl font-bold text-sm transition-all hover:bg-indigo-50"
              style="color: #4f46e5; border: 1px solid #c7d2fe; background: #fff;"
            >
              Tulis Ulasan Pertama
            </button>

            <RouterLink
              v-else
              to="/login"
              class="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl font-bold text-sm transition-all hover:bg-indigo-50"
              style="color: #4f46e5; border: 1px solid #c7d2fe; background: #fff;"
            >
              Login untuk Mengulas
            </RouterLink>
          </div>

          <!-- Empty Filter -->
          <div v-else-if="filteredReviews.length === 0" class="text-center py-10">
            <div class="text-5xl mb-3">🔎</div>
            <p class="text-sm font-semibold" style="color: #334155;">
              Tidak ada ulasan pada filter ini.
            </p>
            <p class="text-sm mt-1" style="color: #94a3b8;">
              Coba pilih filter ulasan lainnya.
            </p>
          </div>

          <!-- Reviews -->
          <div v-else class="space-y-6">
            <article
              v-for="review in filteredReviews"
              :key="review.id"
              class="pb-6 border-b last:border-b-0 last:pb-0"
              style="border-color: #e2e8f0;"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style="background: #ede9fe; color: #4f46e5;"
                >
                  {{ getInitial(review.user) }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                    <div>
                      <p class="font-bold text-sm" style="color: #0f172a;">
                        {{ review.user }}
                      </p>

                      <div class="flex items-center gap-1 mt-1">
                        <span
                          v-for="star in 5"
                          :key="star"
                          class="text-sm"
                          :class="star <= review.rating ? 'text-amber-400' : 'text-gray-200'"
                        >
                          ★
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="text-xs" style="color: #94a3b8;">
                        {{ review.date }}
                      </span>

                      <button
                        v-if="canDeleteReview(review)"
                        type="button"
                        @click="deleteReview(review.id)"
                        class="text-xs font-bold transition-colors hover:text-red-700"
                        style="color: #ef4444;"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <p class="text-sm leading-relaxed mt-3" style="color: #374151;">
                    {{ review.comment }}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div
      v-if="showForm && isLoggedIn"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style="background: rgba(15, 23, 42, 0.45);"
      @click.self="cancelWriting"
    >
      <form
        @submit.prevent="submitReview"
        class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-6 space-y-5"
        style="background: #fff; border: 1px solid #e2e8f0;"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-xl font-bold mb-1" style="color: #0f172a;">
              Tulis Ulasan Anda
            </h3>
            <p class="text-sm leading-relaxed" style="color: #64748b;">
              Beri rating dan tulis pengalaman Anda dengan produk ini.
            </p>
          </div>

          <button
            type="button"
            @click="cancelWriting"
            class="w-9 h-9 rounded-full text-sm font-bold transition-all hover:bg-gray-100"
            style="color: #64748b;"
          >
            ×
          </button>
        </div>

        <div
          v-if="formError"
          class="px-4 py-3 rounded-2xl text-sm font-semibold"
          style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;"
        >
          {{ formError }}
        </div>

        <!-- Rating -->
        <div>
          <label class="block text-sm font-bold mb-2" style="color: #374151;">
            Beri Rating Produk
          </label>

          <div
            class="rounded-3xl p-5 text-center"
            style="background: #f8fafc; border: 1px solid #e2e8f0;"
          >
            <div class="flex items-center justify-center gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="setRating(star)"
                class="text-4xl leading-none transition-transform hover:scale-110"
                :class="star <= reviewForm.rating ? 'text-amber-400' : 'text-gray-300'"
                :aria-label="`Beri rating ${star} bintang`"
              >
                ★
              </button>
            </div>

            <p class="text-sm mt-3" style="color: #64748b;">
              {{ reviewForm.rating ? `${reviewForm.rating} dari 5` : 'Pilih jumlah bintang' }}
            </p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold mb-2" style="color: #374151;">
            Ulasan
          </label>

          <textarea
            v-model="reviewForm.comment"
            rows="4"
            placeholder="Tulis ulasan produk di sini..."
            class="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
            style="border: 1px solid #e2e8f0; color: #0f172a; background: #f8fafc;"
          ></textarea>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            @click="cancelWriting"
            class="w-full py-3.5 rounded-2xl font-bold text-sm transition-all hover:bg-gray-50"
            style="color: #475569; border: 1px solid #e2e8f0; background: #fff;"
          >
            Batal
          </button>

          <button
            type="submit"
            :disabled="submitting"
            class="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
            style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 10px 24px -8px rgba(79,70,229,0.5);"
          >
            {{ submitting ? 'Mengirim…' : 'Kirim Ulasan' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { userStore } from '../store.js'
import { reviewApi } from '../api/index.js'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const reviews = ref([])
const activeFilter = ref('all')
const showForm = ref(false)
const successMessage = ref('')
const formError = ref('')
const loadError = ref('')
const loading = ref(false)
const submitting = ref(false)

const reviewForm = ref({
  rating: 0,
  comment: ''
})

const isLoggedIn = computed(() => userStore.isLoggedIn)
const currentUser = computed(() => userStore.user)

const totalReviewCount = computed(() => reviews.value.length)

const averageRating = computed(() => {
  if (reviews.value.length === 0) {
    // Fall back to the aggregate rating provided by the product endpoint.
    return Number(props.product?.rating || 0)
  }
  const sum = reviews.value.reduce((total, r) => total + Number(r.rating || 0), 0)
  return sum / reviews.value.length
})

const displayRating = computed(() => averageRating.value.toFixed(1))

const reviewFilters = computed(() => [
  { label: `Semua (${reviews.value.length})`, value: 'all' },
  { label: `5 Bintang (${countByRating(5)})`, value: '5' },
  { label: `4 Bintang (${countByRating(4)})`, value: '4' },
  { label: `3 Bintang (${countByRating(3)})`, value: '3' },
  { label: `2 Bintang (${countByRating(2)})`, value: '2' },
  { label: `1 Bintang (${countByRating(1)})`, value: '1' }
])

const filteredReviews = computed(() => {
  if (activeFilter.value === 'all') return reviews.value
  return reviews.value.filter(review => String(review.rating) === activeFilter.value)
})

function countByRating(rating) {
  return reviews.value.filter(review => Number(review.rating) === rating).length
}

function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return ''
  }
}

// Map a backend review row to the shape used by the template.
function mapReview(row) {
  return {
    id: row.review_id,
    userId: row.user_id,
    user: row.name || 'Pengguna e-BuildPC',
    rating: Number(row.rating),
    comment: row.comment,
    date: formatDate(row.created_at)
  }
}

async function loadReviews() {
  if (!props.product?.id) return
  loading.value = true
  loadError.value = ''
  try {
    const rows = await reviewApi.listByProduct(props.product.id)
    reviews.value = (Array.isArray(rows) ? rows : []).map(mapReview)
  } catch (err) {
    loadError.value = err.message || 'Gagal memuat ulasan.'
    reviews.value = []
  } finally {
    loading.value = false
  }
}

function resetReviewForm() {
  reviewForm.value = { rating: 0, comment: '' }
}

function openForm() {
  showForm.value = true
  formError.value = ''
  successMessage.value = ''
}

function cancelWriting() {
  showForm.value = false
  formError.value = ''
  resetReviewForm()
}

function setRating(rating) {
  reviewForm.value.rating = rating
  formError.value = ''
}

async function submitReview() {
  formError.value = ''

  if (!isLoggedIn.value) {
    formError.value = 'Silakan login terlebih dahulu untuk memberi ulasan.'
    return
  }
  if (!reviewForm.value.rating) {
    formError.value = 'Pilih rating terlebih dahulu.'
    return
  }
  if (!reviewForm.value.comment.trim()) {
    formError.value = 'Tulis ulasan terlebih dahulu.'
    return
  }

  submitting.value = true
  try {
    await reviewApi.create(props.product.id, {
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment.trim()
    })
    await loadReviews()
    resetReviewForm()
    showForm.value = false
    activeFilter.value = 'all'
    successMessage.value = 'Ulasan berhasil ditambahkan.'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (err) {
    // 409 = the backend rejects a second review from the same user.
    formError.value = err.message || 'Gagal mengirim ulasan.'
  } finally {
    submitting.value = false
  }
}

function canDeleteReview(review) {
  if (!isLoggedIn.value) return false
  // The backend only authorizes deleting your own review.
  return review.userId === currentUser.value?.user_id
}

async function deleteReview(reviewId) {
  if (!confirm('Hapus ulasan ini?')) return
  try {
    await reviewApi.remove(reviewId)
    await loadReviews()
    if (filteredReviews.value.length === 0) activeFilter.value = 'all'
    successMessage.value = 'Ulasan berhasil dihapus.'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (err) {
    loadError.value = err.message || 'Gagal menghapus ulasan.'
  }
}

function getInitial(name) {
  return String(name || 'U').trim().charAt(0).toUpperCase()
}

watch(
  () => props.product?.id,
  () => {
    resetReviewForm()
    showForm.value = false
    activeFilter.value = 'all'
    successMessage.value = ''
    formError.value = ''
    loadReviews()
  },
  { immediate: true }
)
</script>
