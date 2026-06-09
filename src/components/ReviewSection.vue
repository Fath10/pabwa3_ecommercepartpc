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
                Rating utama mengikuti data produk. Ulasan baru dari pengguna akan tampil di bawah.
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
                Ulasan yang ditambahkan pengguna melalui halaman ini.
              </p>
            </div>

            <div v-if="reviews.length > 0" class="sm:text-right">
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

          <!-- Empty State -->
          <div v-if="reviews.length === 0" class="text-center py-12">
            <div class="text-5xl mb-3">💬</div>

            <p class="text-base font-bold" style="color: #0f172a;">
              Belum ada ulasan pengguna
            </p>

            <p class="text-sm mt-2 mb-5 max-w-md mx-auto" style="color: #94a3b8;">
              Jadilah pengguna pertama yang memberi rating, menulis ulasan, dan menambahkan foto atau video produk.
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

                  <p class="text-sm leading-relaxed mt-3 mb-3" style="color: #374151;">
                    {{ review.comment }}
                  </p>

                  <div v-if="review.media.length" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      v-for="(media, index) in review.media"
                      :key="index"
                      type="button"
                      @click="openMediaViewer(review.media, index)"
                      class="relative rounded-2xl overflow-hidden text-left group"
                      style="border: 1px solid #e2e8f0; background: #f8fafc;"
                    >
                      <img
                        v-if="media.type.startsWith('image')"
                        :src="media.url"
                        class="w-full h-28 object-cover"
                        alt="Media ulasan"
                      />

                      <video
                        v-else
                        :src="media.url"
                        class="w-full h-28 object-cover"
                        muted
                      ></video>

                      <div
                        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style="background: rgba(15, 23, 42, 0.45); color: #fff;"
                      >
                        <span class="text-xs font-bold">
                          Lihat Media
                        </span>
                      </div>
                    </button>
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
              Beri rating, tulis pengalaman Anda, lalu tambahkan foto atau video bila ada.
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

        <div>
          <div class="flex items-center justify-between gap-3 mb-2">
            <label class="block text-sm font-bold" style="color: #374151;">
              Foto / Video Ulasan
            </label>

            <span class="text-xs" style="color: #94a3b8;">
              {{ reviewForm.media.length }}/3 file
            </span>
          </div>

          <input
            id="review-media-upload"
            type="file"
            accept="image/*,video/*"
            multiple
            class="hidden"
            @change="handleMediaUpload"
          />

          <label
            for="review-media-upload"
            class="block rounded-3xl p-5 text-center cursor-pointer transition-all hover:bg-indigo-50"
            style="background: #f8fafc; border: 1.5px dashed #c7d2fe;"
          >
            <div class="text-3xl mb-2">📷</div>
            <p class="text-sm font-bold mb-1" style="color: #4f46e5;">
              Tambahkan foto atau video produk
            </p>
            <p class="text-xs leading-relaxed" style="color: #94a3b8;">
              Klik area ini untuk memilih file. Maksimal 3 file, ukuran maksimal 1MB per file.
            </p>
          </label>
        </div>

        <div v-if="reviewForm.media.length" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="(media, index) in reviewForm.media"
            :key="index"
            class="relative rounded-2xl overflow-hidden"
            style="border: 1px solid #e2e8f0; background: #fff;"
          >
            <img
              v-if="media.type.startsWith('image')"
              :src="media.url"
              class="w-full h-32 object-cover"
              alt="Preview media ulasan"
            />

            <video
              v-else
              :src="media.url"
              controls
              class="w-full h-32 object-cover"
            ></video>

            <button
              type="button"
              @click="removeMedia(index)"
              class="absolute top-2 right-2 w-7 h-7 rounded-full text-white text-xs font-bold"
              style="background: rgba(15, 23, 42, 0.75);"
            >
              ×
            </button>
          </div>
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
            class="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:-translate-y-0.5"
            style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 10px 24px -8px rgba(79,70,229,0.5);"
          >
            Kirim Ulasan
          </button>
        </div>
      </form>
    </div>

    <!-- Media Viewer -->
    <div
      v-if="selectedMedia"
      class="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
      style="background: rgba(15, 23, 42, 0.78);"
      @click.self="closeMediaViewer"
    >
      <div class="w-full max-w-4xl">
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-white">
            Media ulasan {{ selectedMediaIndex + 1 }} / {{ selectedMediaList.length }}
          </p>

          <button
            type="button"
            @click="closeMediaViewer"
            class="w-10 h-10 rounded-full text-white font-bold"
            style="background: rgba(255,255,255,0.12);"
          >
            ×
          </button>
        </div>

        <div class="rounded-3xl overflow-hidden bg-black">
          <img
            v-if="selectedMedia.type.startsWith('image')"
            :src="selectedMedia.url"
            class="w-full max-h-[75vh] object-contain"
            alt="Media ulasan"
          />

          <video
            v-else
            :src="selectedMedia.url"
            controls
            autoplay
            class="w-full max-h-[75vh]"
          ></video>
        </div>

        <div
          v-if="selectedMediaList.length > 1"
          class="flex justify-center gap-3 mt-4"
        >
          <button
            type="button"
            @click="prevMedia"
            class="px-4 py-2 rounded-xl text-sm font-bold text-white"
            style="background: rgba(255,255,255,0.12);"
          >
            ← Sebelumnya
          </button>

          <button
            type="button"
            @click="nextMedia"
            class="px-4 py-2 rounded-xl text-sm font-bold text-white"
            style="background: rgba(255,255,255,0.12);"
          >
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { userStore } from '../store.js'

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

const selectedMediaList = ref([])
const selectedMediaIndex = ref(0)

const reviewForm = ref({
  rating: 0,
  comment: '',
  media: []
})

const selectedMedia = computed(() => {
  return selectedMediaList.value[selectedMediaIndex.value] || null
})

const isLoggedIn = computed(() => {
  if (userStore?.isLoggedIn || userStore?.user || userStore?.token) return true

  const possibleKeys = [
    'user',
    'currentUser',
    'loggedInUser',
    'token',
    'authToken',
    'accessToken',
    'isLoggedIn'
  ]

  return possibleKeys.some((key) => {
    const value = localStorage.getItem(key)
    return value && value !== 'false' && value !== 'null' && value !== 'undefined'
  })
})

const currentUser = computed(() => {
  if (userStore?.user) return userStore.user

  const possibleUserKeys = ['user', 'currentUser', 'loggedInUser']

  for (const key of possibleUserKeys) {
    const value = localStorage.getItem(key)
    if (!value) continue

    try {
      return JSON.parse(value)
    } catch {
      return { name: value }
    }
  }

  return null
})

const currentUserName = computed(() => {
  return (
    currentUser.value?.name ||
    currentUser.value?.username ||
    currentUser.value?.email ||
    'Pengguna e-BuildPC'
  )
})

const currentUserRole = computed(() => {
  return currentUser.value?.role || ''
})

const totalReviewCount = computed(() => {
  return Number(props.product?.reviews || 0) + reviews.value.length
})

const averageRating = computed(() => {
  const baseRating = Number(props.product?.rating || 0)
  const baseReviews = Number(props.product?.reviews || 0)

  const newRatingTotal = reviews.value.reduce(
    (total, review) => total + Number(review.rating || 0),
    0
  )

  const total = baseReviews + reviews.value.length
  if (total === 0) return 0

  return ((baseRating * baseReviews) + newRatingTotal) / total
})

const displayRating = computed(() => averageRating.value.toFixed(1))

const countWithMedia = computed(() => {
  return reviews.value.filter(review => review.media?.length).length
})

const reviewFilters = computed(() => {
  return [
    { label: `Semua (${reviews.value.length})`, value: 'all' },
    { label: `5 Bintang (${countByRating(5)})`, value: '5' },
    { label: `4 Bintang (${countByRating(4)})`, value: '4' },
    { label: `3 Bintang (${countByRating(3)})`, value: '3' },
    { label: `2 Bintang (${countByRating(2)})`, value: '2' },
    { label: `1 Bintang (${countByRating(1)})`, value: '1' },
    { label: `Dengan Media (${countWithMedia.value})`, value: 'media' }
  ]
})

const filteredReviews = computed(() => {
  if (activeFilter.value === 'all') return reviews.value

  if (activeFilter.value === 'media') {
    return reviews.value.filter(review => review.media?.length)
  }

  return reviews.value.filter(review => String(review.rating) === activeFilter.value)
})

function countByRating(rating) {
  return reviews.value.filter(review => Number(review.rating) === rating).length
}

function getReviewStorageKey() {
  return `ebuildpc_reviews_product_${props.product.id}`
}

function loadReviews() {
  try {
    const savedReviews = localStorage.getItem(getReviewStorageKey())
    reviews.value = savedReviews ? JSON.parse(savedReviews) : []
  } catch (error) {
    console.error('Gagal membaca ulasan:', error)
    reviews.value = []
  }
}

function saveReviews() {
  try {
    localStorage.setItem(getReviewStorageKey(), JSON.stringify(reviews.value))
    return true
  } catch (error) {
    console.error('Gagal menyimpan ulasan:', error)
    formError.value = 'Media terlalu besar untuk disimpan permanen di browser. Coba gunakan file yang lebih kecil.'
    return false
  }
}

function resetReviewForm() {
  reviewForm.value = {
    rating: 0,
    comment: '',
    media: []
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
}

function setRating(rating) {
  reviewForm.value.rating = rating
  formError.value = ''
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve({
        name: file.name,
        type: file.type,
        url: reader.result
      })
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handleMediaUpload(event) {
  formError.value = ''

  const files = Array.from(event.target.files || [])
  const remainingSlots = 3 - reviewForm.value.media.length

  if (remainingSlots <= 0) {
    formError.value = 'Maksimal 3 file media.'
    event.target.value = ''
    return
  }

  const validFiles = files
    .filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))
    .filter(file => file.size <= 1024 * 1024)
    .slice(0, remainingSlots)

  if (validFiles.length === 0) {
    formError.value = 'File harus berupa gambar/video dan maksimal 1MB per file.'
    event.target.value = ''
    return
  }

  const mediaFiles = await Promise.all(validFiles.map(readFileAsDataUrl))
  reviewForm.value.media.push(...mediaFiles)

  event.target.value = ''
}

function removeMedia(index) {
  reviewForm.value.media.splice(index, 1)
}

function submitReview() {
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

  const newReview = {
    id: Date.now(),
    user: currentUserName.value,
    userRole: currentUserRole.value,
    rating: reviewForm.value.rating,
    comment: reviewForm.value.comment.trim(),
    media: reviewForm.value.media,
    date: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  reviews.value.unshift(newReview)

  const saved = saveReviews()
  if (!saved) return

  resetReviewForm()
  showForm.value = false
  activeFilter.value = 'all'

  successMessage.value = 'Ulasan berhasil ditambahkan.'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

function canDeleteReview(review) {
  if (!isLoggedIn.value) return false
  if (currentUserRole.value === 'admin') return true
  return review.user === currentUserName.value
}

function deleteReview(reviewId) {
  const confirmDelete = confirm('Hapus ulasan ini?')

  if (!confirmDelete) return

  reviews.value = reviews.value.filter(review => review.id !== reviewId)
  saveReviews()

  if (filteredReviews.value.length === 0) {
    activeFilter.value = 'all'
  }

  successMessage.value = 'Ulasan berhasil dihapus.'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

function openMediaViewer(mediaList, index) {
  selectedMediaList.value = mediaList
  selectedMediaIndex.value = index
}

function closeMediaViewer() {
  selectedMediaList.value = []
  selectedMediaIndex.value = 0
}

function nextMedia() {
  if (!selectedMediaList.value.length) return
  selectedMediaIndex.value = (selectedMediaIndex.value + 1) % selectedMediaList.value.length
}

function prevMedia() {
  if (!selectedMediaList.value.length) return
  selectedMediaIndex.value =
    selectedMediaIndex.value === 0
      ? selectedMediaList.value.length - 1
      : selectedMediaIndex.value - 1
}

function getInitial(name) {
  return String(name || 'U').trim().charAt(0).toUpperCase()
}

watch(
  () => props.product?.id,
  () => {
    loadReviews()
    resetReviewForm()
    closeMediaViewer()
    showForm.value = false
    activeFilter.value = 'all'
    successMessage.value = ''
    formError.value = ''
  },
  { immediate: true }
)
</script>