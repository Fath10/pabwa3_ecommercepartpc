<template>
  <section class="review-section border-t pt-12 mb-12">
    <div class="review-card rounded-3xl overflow-hidden">
      <!-- Rating Summary -->
      <div class="p-6 sm:p-8">
        <div class="mb-6">
          <h2 class="review-title text-2xl font-extrabold tracking-tight mb-2">
            Penilaian Produk
          </h2>
          <p class="review-subtitle text-sm leading-relaxed">
            Ringkasan rating produk dan ulasan dari pengguna.
          </p>
        </div>

        <div class="summary-box rounded-3xl p-5 sm:p-6">
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="md:w-56 flex-shrink-0">
              <div class="flex items-end gap-2">
                <span class="rating-number text-5xl font-extrabold leading-none">
                  {{ displayRating }}
                </span>
                <span class="review-muted text-sm mb-1.5">dari 5</span>
              </div>

              <div class="flex items-center gap-1 mt-2">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-xl"
                  :class="star <= Math.round(averageRating) ? 'text-amber-400' : 'text-gray-600'"
                >
                  ★
                </span>
              </div>
            </div>

            <div class="hidden md:block divider-vertical w-px h-20"></div>

            <div class="flex-1">
              <p class="review-title text-sm font-semibold mb-1">
                Berdasarkan {{ totalReviewCount }} ulasan produk
              </p>
              <p class="review-subtitle text-sm leading-relaxed">
                Ulasan diambil langsung dari database e-BuildPC dan diperbarui secara otomatis.
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="successMessage"
          class="mt-5 px-4 py-3 rounded-2xl text-sm font-semibold success-alert"
        >
          {{ successMessage }}
        </div>

        <div
          v-if="loadError"
          class="mt-5 px-4 py-3 rounded-2xl text-sm font-semibold error-alert"
        >
          {{ loadError }}
        </div>
      </div>

      <!-- Review Area -->
      <div class="px-6 sm:px-8 pb-8">
        <div class="pt-6 section-divider">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h3 class="review-title text-xl font-bold">
                Ulasan Pembeli
              </h3>
              <p class="review-subtitle text-sm mt-1">
                Bagikan pengalaman Anda dengan produk ini.
              </p>
            </div>

            <div class="sm:text-right">
              <button
                v-if="isLoggedIn"
                type="button"
                @click="openForm"
                class="outline-btn w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-sm transition-all"
              >
                Tulis Ulasan
              </button>

              <RouterLink
                v-else
                to="/login"
                class="outline-btn w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-2xl font-bold text-sm transition-all"
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
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
              :class="activeFilter === filter.value
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'filter-btn'"
            >
              {{ filter.label }}
            </button>
          </div>

          <p v-if="reviews.length > 0" class="review-muted text-sm mb-5">
            Menampilkan {{ filteredReviews.length }} ulasan
          </p>

          <!-- Loading -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p class="review-muted mt-3 text-sm">Memuat ulasan…</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="reviews.length === 0" class="text-center py-12">
            <div class="text-5xl mb-3">💬</div>

            <p class="review-title text-base font-bold">
              Belum ada ulasan pengguna
            </p>

            <p class="review-muted text-sm mt-2 mb-5 max-w-md mx-auto">
              Jadilah pengguna pertama yang memberi rating dan menulis ulasan untuk produk ini.
            </p>

            <button
              v-if="isLoggedIn"
              type="button"
              @click="openForm"
              class="outline-btn inline-flex items-center justify-center px-5 py-2.5 rounded-2xl font-bold text-sm transition-all"
            >
              Tulis Ulasan Pertama
            </button>

            <RouterLink
              v-else
              to="/login"
              class="outline-btn inline-flex items-center justify-center px-5 py-2.5 rounded-2xl font-bold text-sm transition-all"
            >
              Login untuk Mengulas
            </RouterLink>
          </div>

          <!-- Empty Filter -->
          <div v-else-if="filteredReviews.length === 0" class="text-center py-10">
            <div class="text-5xl mb-3">🔎</div>
            <p class="review-title text-sm font-semibold">
              Tidak ada ulasan pada filter ini.
            </p>
            <p class="review-muted text-sm mt-1">
              Coba pilih filter ulasan lainnya.
            </p>
          </div>

          <!-- Reviews -->
          <div v-else class="space-y-6">
            <article
              v-for="review in filteredReviews"
              :key="review.id"
              class="pb-6 border-b last:border-b-0 last:pb-0 review-item"
            >
              <div class="flex items-start gap-4">
                <div class="avatar-initial w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {{ getInitial(review.user) }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                    <div>
                      <p class="review-title font-bold text-sm">
                        {{ review.user }}
                      </p>

                      <div class="flex items-center gap-1 mt-1">
                        <span
                          v-for="star in 5"
                          :key="star"
                          class="text-sm"
                          :class="star <= review.rating ? 'text-amber-400' : 'text-gray-600'"
                        >
                          ★
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="review-muted text-xs">
                        {{ review.date }}
                      </span>

                      <button
                        v-if="canDeleteReview(review)"
                        type="button"
                        @click="deleteReview(review.id)"
                        class="text-xs font-bold transition-colors text-red-400 hover:text-red-300"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <p class="review-body text-sm leading-relaxed mt-3">
                    {{ review.comment }}
                  </p>

                  <!-- Review Media -->
                  <div
                    v-if="review.media && review.media.length > 0"
                    class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3"
                  >
                    <div
                      v-for="(media, index) in review.media"
                      :key="`${review.id}-media-${index}`"
                      class="media-card rounded-2xl overflow-hidden"
                    >
                      <img
                        v-if="media.type === 'image'"
                        :src="media.url"
                        :alt="media.name || 'Media ulasan'"
                        class="w-full h-32 object-cover"
                      />

                      <video
                        v-else-if="media.type === 'video'"
                        :src="media.url"
                        controls
                        class="w-full h-32 object-cover bg-black"
                      ></video>

                      <a
                        v-else
                        :href="media.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex h-32 items-center justify-center px-3 text-center text-sm font-semibold text-indigo-300"
                      >
                        Lihat Lampiran
                      </a>
                    </div>
                  </div>
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
      class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 modal-backdrop"
      @click.self="cancelWriting"
    >
      <form
        @submit.prevent="submitReview"
        class="modal-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-6 space-y-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="review-title text-xl font-bold mb-1">
              Tulis Ulasan Anda
            </h3>
            <p class="review-subtitle text-sm leading-relaxed">
              Beri rating, tulis pengalaman, dan tambahkan foto atau video produk.
            </p>
          </div>

          <button
            type="button"
            @click="cancelWriting"
            class="close-btn w-9 h-9 rounded-full text-sm font-bold transition-all"
          >
            ×
          </button>
        </div>

        <div
          v-if="formError"
          class="px-4 py-3 rounded-2xl text-sm font-semibold error-alert"
        >
          {{ formError }}
        </div>

        <!-- Rating -->
        <div>
          <label class="review-label block text-sm font-bold mb-2">
            Beri Rating Produk
          </label>

          <div class="input-panel rounded-3xl p-5 text-center">
            <div class="flex items-center justify-center gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="setRating(star)"
                class="text-4xl leading-none transition-transform hover:scale-110"
                :class="star <= reviewForm.rating ? 'text-amber-400' : 'text-gray-600'"
                :aria-label="`Beri rating ${star} bintang`"
              >
                ★
              </button>
            </div>

            <p class="review-muted text-sm mt-3">
              {{ reviewForm.rating ? `${reviewForm.rating} dari 5` : 'Pilih jumlah bintang' }}
            </p>
          </div>
        </div>

        <!-- Comment -->
        <div>
          <label class="review-label block text-sm font-bold mb-2">
            Ulasan
          </label>

          <textarea
            v-model="reviewForm.comment"
            rows="4"
            placeholder="Tulis ulasan produk di sini..."
            class="review-textarea w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
          ></textarea>
        </div>

        <!-- Upload Media -->
        <div>
          <label class="review-label block text-sm font-bold mb-2">
            Foto / Video Produk <span class="font-normal review-muted">(opsional)</span>
          </label>

          <div class="upload-box rounded-3xl p-5">
            <input
              ref="mediaInput"
              type="file"
              accept="image/*,video/*"
              multiple
              class="hidden"
              @change="handleMediaChange"
            />

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p class="review-title text-sm font-semibold">
                  Tambahkan bukti foto atau video produk
                </p>
                <p class="review-subtitle text-xs mt-1 leading-relaxed">
                  Maksimal {{ MAX_FILES }} file. Gambar maksimal 5MB, video maksimal 50MB.
                </p>
              </div>

              <button
                type="button"
                @click="mediaInput?.click()"
                class="outline-btn inline-flex items-center justify-center px-4 py-2.5 rounded-2xl text-sm font-bold transition-all"
              >
                Pilih File
              </button>
            </div>

            <!-- Selected Preview -->
            <div
              v-if="selectedMedia.length > 0"
              class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <div
                v-for="(item, index) in selectedMedia"
                :key="item.previewUrl"
                class="preview-card relative rounded-2xl overflow-hidden"
              >
                <img
                  v-if="item.type === 'image'"
                  :src="item.previewUrl"
                  :alt="item.name"
                  class="w-full h-36 object-cover"
                />

                <video
                  v-else-if="item.type === 'video'"
                  :src="item.previewUrl"
                  controls
                  class="w-full h-36 object-cover bg-black"
                ></video>

                <div class="px-3 py-2">
                  <p class="review-title text-xs font-bold truncate">
                    {{ item.name }}
                  </p>
                  <p class="review-muted text-xs mt-0.5">
                    {{ item.sizeText }}
                  </p>
                </div>

                <button
                  type="button"
                  @click="removeSelectedMedia(index)"
                  class="absolute top-2 right-2 w-8 h-8 rounded-full text-sm font-bold shadow-sm transition hover:scale-105 remove-media-btn"
                  aria-label="Hapus media"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            @click="cancelWriting"
            class="cancel-btn w-full py-3.5 rounded-2xl font-bold text-sm transition-all"
          >
            Batal
          </button>

          <button
            type="submit"
            :disabled="submitting"
            class="submit-btn w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
          >
            {{ submitting ? 'Mengirim…' : 'Kirim Ulasan' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { userStore } from '../store.js'
import { reviewApi, assetUrl } from '../api/index.js'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const MAX_FILES = 4
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 50 * 1024 * 1024

const reviews = ref([])
const activeFilter = ref('all')
const showForm = ref(false)
const successMessage = ref('')
const formError = ref('')
const loadError = ref('')
const loading = ref(false)
const submitting = ref(false)
const mediaInput = ref(null)
const selectedMedia = ref([])

const reviewForm = ref({
  rating: 0,
  comment: ''
})

const isLoggedIn = computed(() => userStore.isLoggedIn)
const currentUser = computed(() => userStore.user)

const totalReviewCount = computed(() => reviews.value.length)

const averageRating = computed(() => {
  if (reviews.value.length === 0) {
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

function parseMediaInput(raw) {
  if (!raw) return []

  if (Array.isArray(raw)) return raw

  if (typeof raw === 'string') {
    const value = raw.trim()

    if (!value) return []

    if (value.startsWith('[')) {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return [value]
      }
    }

    return [value]
  }

  if (typeof raw === 'object') return [raw]

  return []
}

function inferMediaType(source) {
  const value = String(source || '').toLowerCase()

  if (
    value.startsWith('image/') ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|#|$)/i.test(value)
  ) {
    return 'image'
  }

  if (
    value.startsWith('video/') ||
    /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?|#|$)/i.test(value)
  ) {
    return 'video'
  }

  return 'file'
}

function normalizeReviewMedia(row) {
  const raw =
    row.media_urls ??
    row.mediaUrls ??
    row.media ??
    row.medias ??
    row.review_media ??
    row.reviewMedia ??
    row.attachments ??
    row.files

  return parseMediaInput(raw)
    .map((item, index) => {
      if (!item) return null

      let url = ''
      let type = ''
      let name = `Media ${index + 1}`

      if (typeof item === 'string') {
        url = item
        type = inferMediaType(item)
      } else {
        url =
          item.url ||
          item.media_url ||
          item.file_url ||
          item.path ||
          item.file_path ||
          item.src ||
          ''

        type =
          item.type ||
          item.mime_type ||
          item.mime ||
          item.media_type ||
          inferMediaType(url)

        name =
          item.name ||
          item.filename ||
          item.originalname ||
          name
      }

      if (!url) return null

      return {
        url: url.startsWith('blob:') ? url : assetUrl(url),
        type: inferMediaType(type || url),
        name
      }
    })
    .filter(Boolean)
}

function mapReview(row) {
  return {
    id: row.review_id,
    userId: row.user_id,
    user: row.name || 'Pengguna e-BuildPC',
    rating: Number(row.rating),
    comment: row.comment,
    date: formatDate(row.created_at),
    media: normalizeReviewMedia(row)
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
  reviewForm.value = {
    rating: 0,
    comment: ''
  }
}

function resetSelectedMedia() {
  selectedMedia.value.forEach(item => {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl)
    }
  })

  selectedMedia.value = []

  if (mediaInput.value) {
    mediaInput.value.value = ''
  }
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
  resetSelectedMedia()
}

function setRating(rating) {
  reviewForm.value.rating = rating
  formError.value = ''
}

function getFileType(file) {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  return 'file'
}

function formatFileSize(size) {
  if (!size) return '0 KB'

  const mb = size / (1024 * 1024)

  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`
  }

  return `${Math.ceil(size / 1024)} KB`
}

function validateMediaFile(file) {
  const type = getFileType(file)

  if (type !== 'image' && type !== 'video') {
    return 'File harus berupa gambar atau video.'
  }

  if (type === 'image' && file.size > MAX_IMAGE_SIZE) {
    return `Ukuran gambar ${file.name} maksimal 5MB.`
  }

  if (type === 'video' && file.size > MAX_VIDEO_SIZE) {
    return `Ukuran video ${file.name} maksimal 50MB.`
  }

  return ''
}

function handleMediaChange(event) {
  formError.value = ''

  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  if (selectedMedia.value.length + files.length > MAX_FILES) {
    formError.value = `Maksimal ${MAX_FILES} file untuk satu ulasan.`
    if (mediaInput.value) mediaInput.value.value = ''
    return
  }

  for (const file of files) {
    const errorMessage = validateMediaFile(file)

    if (errorMessage) {
      formError.value = errorMessage
      if (mediaInput.value) mediaInput.value.value = ''
      return
    }
  }

  const newItems = files.map(file => ({
    file,
    type: getFileType(file),
    name: file.name,
    sizeText: formatFileSize(file.size),
    previewUrl: URL.createObjectURL(file)
  }))

  selectedMedia.value = [...selectedMedia.value, ...newItems]

  if (mediaInput.value) {
    mediaInput.value.value = ''
  }
}

function removeSelectedMedia(index) {
  const item = selectedMedia.value[index]

  if (item?.previewUrl) {
    URL.revokeObjectURL(item.previewUrl)
  }

  selectedMedia.value.splice(index, 1)
}

function buildReviewPayload() {
  const rating = reviewForm.value.rating
  const comment = reviewForm.value.comment.trim()

  if (selectedMedia.value.length === 0) {
    return { rating, comment }
  }

  const formData = new FormData()
  formData.append('rating', String(rating))
  formData.append('comment', comment)

  selectedMedia.value.forEach(item => {
    formData.append('media', item.file)
  })

  return formData
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
    await reviewApi.create(props.product.id, buildReviewPayload())

    await loadReviews()

    resetReviewForm()
    resetSelectedMedia()

    showForm.value = false
    activeFilter.value = 'all'
    successMessage.value = 'Ulasan berhasil ditambahkan.'

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    formError.value = err.message || 'Gagal mengirim ulasan.'
  } finally {
    submitting.value = false
  }
}

function canDeleteReview(review) {
  if (!isLoggedIn.value) return false

  return (
    review.userId === currentUser.value?.user_id ||
    review.userId === currentUser.value?.id
  )
}

async function deleteReview(reviewId) {
  if (!confirm('Hapus ulasan ini?')) return

  try {
    await reviewApi.remove(reviewId)
    await loadReviews()

    if (filteredReviews.value.length === 0) activeFilter.value = 'all'

    successMessage.value = 'Ulasan berhasil dihapus.'

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
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
    resetSelectedMedia()
    showForm.value = false
    activeFilter.value = 'all'
    successMessage.value = ''
    formError.value = ''
    loadReviews()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  resetSelectedMedia()
})
</script>

<style scoped>
.review-section {
  border-color: rgba(129, 140, 248, 0.18);
}

.review-card {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 27, 75, 0.92));
  border: 1px solid rgba(129, 140, 248, 0.22);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 24px 70px rgba(0, 0, 0, 0.32);
}

.summary-box,
.input-panel,
.upload-box {
  background: rgba(15, 23, 42, 0.68);
  border: 1px solid rgba(129, 140, 248, 0.22);
}

.upload-box {
  border-style: dashed;
  border-color: rgba(167, 139, 250, 0.42);
}

.review-title,
.review-label {
  color: #f8fafc;
}

.review-subtitle,
.review-muted {
  color: #94a3b8;
}

.review-body {
  color: #cbd5e1;
}

.rating-number {
  color: #8b5cf6;
}

.divider-vertical,
.section-divider {
  border-color: rgba(129, 140, 248, 0.2);
}

.section-divider {
  border-top: 1px solid rgba(129, 140, 248, 0.2);
}

.filter-btn {
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.72);
  border-color: rgba(148, 163, 184, 0.2);
}

.filter-btn:hover {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.24);
  border-color: rgba(129, 140, 248, 0.42);
}

.outline-btn {
  color: #c4b5fd;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(129, 140, 248, 0.34);
}

.outline-btn:hover {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.25);
  border-color: rgba(167, 139, 250, 0.55);
  transform: translateY(-1px);
}

.avatar-initial {
  color: #c4b5fd;
  background: rgba(79, 70, 229, 0.2);
  border: 1px solid rgba(129, 140, 248, 0.25);
}

.review-item {
  border-color: rgba(129, 140, 248, 0.16);
}

.media-card,
.preview-card {
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(129, 140, 248, 0.22);
}

.success-alert {
  background: rgba(6, 78, 59, 0.35);
  color: #86efac;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.error-alert {
  background: rgba(127, 29, 29, 0.35);
  color: #fda4af;
  border: 1px solid rgba(251, 113, 133, 0.35);
}

.modal-backdrop {
  background: rgba(2, 6, 23, 0.68);
  backdrop-filter: blur(3px);
}

.modal-card {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 27, 75, 0.96));
  border: 1px solid rgba(129, 140, 248, 0.3);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.48);
}

.close-btn {
  color: #94a3b8;
}

.close-btn:hover {
  color: #ffffff;
  background: rgba(148, 163, 184, 0.14);
}

.review-textarea {
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(129, 140, 248, 0.28);
}

.review-textarea::placeholder {
  color: #64748b;
}

.review-textarea:focus {
  border-color: rgba(167, 139, 250, 0.65);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.16);
}

.cancel-btn {
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.cancel-btn:hover {
  color: #ffffff;
  background: rgba(148, 163, 184, 0.12);
}

.submit-btn {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.32);
}

.submit-btn:hover {
  box-shadow: 0 16px 38px rgba(124, 58, 237, 0.4);
}

.remove-media-btn {
  color: #ffffff;
  background: rgba(15, 23, 42, 0.78);
}

.remove-media-btn:hover {
  background: rgba(225, 29, 72, 0.85);
}

img,
video {
  background: rgba(15, 23, 42, 0.9);
}
</style>