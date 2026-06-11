<template>
  <main class="profile-page min-h-screen pt-28 pb-20">
    <div class="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <section class="mb-7">
        <div class="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-600">
          <span>👤</span>
          Akun Pengguna
        </div>

        <h1 class="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
          Profil <span class="gradient-text">Pengguna</span>
        </h1>

        <p class="mt-2 text-sm sm:text-base text-slate-500">
          Kelola informasi akun, foto profil, dan pantau riwayat pesanan Anda.
        </p>
      </section>

      <!-- Alert -->
      <Transition name="fade">
        <div
          v-if="message.text"
          :class="[
            'mb-5 rounded-2xl border px-5 py-4 text-sm font-semibold shadow-sm',
            message.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          ]"
        >
          {{ message.text }}
        </div>
      </Transition>

      <!-- Profile Card -->
      <section class="profile-card mb-10">
        <!-- Summary Mode -->
        <div v-if="!isEditing" class="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div class="avatar-ring">
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="Avatar"
                class="h-full w-full object-cover"
              />

              <svg
                v-else
                class="h-12 w-12 text-slate-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>

            <div>
              <h2 class="text-2xl font-black text-slate-950">
                {{ userStore.user?.name || 'User' }}
              </h2>

              <div class="mt-2 flex items-center justify-center gap-2 text-sm text-slate-500 sm:justify-start">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{{ userStore.user?.email }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              @click="startEdit"
              class="btn-soft"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profil
            </button>

            <button
              @click="handleLogout"
              class="btn-danger"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="handleSaveProfile" class="p-6 sm:p-8">
          <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div class="relative group mx-auto sm:mx-0">
              <div class="avatar-ring avatar-large">
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt="Avatar"
                  class="h-full w-full object-cover"
                />

                <svg
                  v-else
                  class="h-14 w-14 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>

              <label class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
              </label>
            </div>

            <div class="flex-1 text-center sm:text-left">
              <h2 class="text-xl font-black text-slate-950">
                Foto Profil
              </h2>

              <p class="mt-1 max-w-md text-sm leading-relaxed text-slate-500">
                Gunakan gambar JPG, PNG, atau GIF dengan ukuran maksimal 2MB.
                Foto akan tampil di profil dan navbar.
              </p>

              <label class="mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                Pilih Foto
                <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
              </label>
            </div>
          </div>

          <div class="my-8 h-px bg-slate-100"></div>

          <div class="space-y-5">
            <div>
              <label class="field-label">Nama Lengkap</label>

              <div class="input-wrap">
                <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>

                <input
                  v-model="form.fullname"
                  type="text"
                  class="form-input"
                  placeholder="Nama Anda"
                  required
                />
              </div>
            </div>

            <div>
              <label class="field-label">Email</label>

              <div class="input-wrap">
                <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>

                <input
                  v-model="form.email"
                  type="email"
                  disabled
                  class="form-input disabled-input"
                />
              </div>

              <p class="mt-1.5 text-xs text-slate-500">
                Email tidak dapat diubah karena terhubung dengan data akun dan pesanan.
              </p>
            </div>

            <div>
              <label class="field-label">
                Ganti Password <span class="font-normal text-slate-400">(opsional)</span>
              </label>

              <div class="input-wrap">
                <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>

                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input pr-11"
                  placeholder="Biarkan kosong jika tidak ingin mengubah"
                />

                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-600"
                >
                  <svg v-if="!showPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>

                  <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              @click="cancelEdit"
              class="btn-soft justify-center"
            >
              Batal
            </button>

            <button
              type="submit"
              :disabled="isSaving"
              class="btn-primary justify-center"
            >
              <svg v-if="isSaving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>

              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>

              {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </section>

      <!-- Order History -->
      <section id="orders-section" class="scroll-mt-28">
        <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold text-slate-500 shadow-sm">
              🧾 Riwayat Belanja
            </div>

            <h2 class="mt-3 text-2xl sm:text-3xl font-black text-slate-950">
              Riwayat Pesanan
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              Pantau status pesanan dan lihat detail pembelian Anda.
            </p>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isOrdersLoading" class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div class="animate-pulse space-y-4">
              <div class="h-4 w-1/4 rounded bg-slate-200"></div>
              <div class="h-10 w-full rounded bg-slate-100"></div>
              <div class="h-4 w-1/3 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div
          v-else-if="ordersError"
          class="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center"
        >
          <p class="font-bold text-rose-700">Gagal memuat pesanan</p>
          <p class="mt-2 text-sm text-rose-500">{{ ordersError }}</p>

          <button
            @click="fetchOrders"
            class="mt-5 rounded-xl bg-rose-100 px-5 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-200"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Empty -->
        <div
          v-else-if="orders.length === 0"
          class="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
        >
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-200 bg-slate-50">
            <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>

          <h3 class="text-lg font-black text-slate-950">
            Belum Ada Pesanan
          </h3>

          <p class="mt-2 text-sm text-slate-500">
            Anda belum pernah melakukan pemesanan sebelumnya.
          </p>

          <RouterLink
            to="/katalog"
            class="btn-primary mx-auto mt-6 justify-center"
          >
            Mulai Belanja
          </RouterLink>
        </div>

        <!-- List -->
        <div v-else class="space-y-4">
          <article
            v-for="order in orders"
            :key="order.order_id"
            class="order-card"
          >
            <div class="grid gap-5 border-b border-slate-100 bg-slate-50/60 px-5 py-5 sm:grid-cols-4 sm:px-6">
              <div>
                <p class="order-label">Nomor Pesanan</p>
                <p class="order-value">#{{ order.order_id }}</p>
              </div>

              <div>
                <p class="order-label">Tanggal</p>
                <p class="order-value">{{ formatDate(order.created_at) }}</p>
              </div>

              <div>
                <p class="order-label">Total Belanja</p>
                <p class="order-value text-indigo-600">
                  {{ formatPrice(order.total_amount) }}
                </p>
              </div>

              <div class="sm:text-right">
                <span
                  :class="[
                    'inline-flex rounded-full border px-3 py-1 text-xs font-extrabold',
                    getStatusConfig(order.status).bg,
                    getStatusConfig(order.status).text,
                    getStatusConfig(order.status).border
                  ]"
                >
                  {{ getStatusConfig(order.status).label }}
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p class="text-sm text-slate-500">
                <span v-if="order.status === 'shipped'" class="font-semibold text-orange-500">
                  Pesanan sedang dalam perjalanan
                </span>

                <span v-else-if="order.status === 'delivered'" class="font-semibold text-emerald-500">
                  Pesanan telah diterima
                </span>

                <span v-else>
                  Menunggu proses selanjutnya
                </span>
              </p>

              <RouterLink
                :to="`/orders/${order.order_id}`"
                class="btn-soft justify-center"
              >
                Lihat Detail
              </RouterLink>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userStore, formatPrice } from '../store.js'
import { authApi, orderApi, assetUrl } from '../api/index.js'

const router = useRouter()

const form = ref({
  fullname: '',
  email: '',
  password: '',
})

const selectedFile = ref(null)
const previewImage = ref(null)
const showPassword = ref(false)
const isSaving = ref(false)
const message = ref({ text: '', type: '' })
const isEditing = ref(false)

const orders = ref([])
const isOrdersLoading = ref(true)
const ordersError = ref('')

const statusConfig = {
  pending: {
    label: 'Menunggu',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  processing: {
    label: 'Diproses',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  shipped: {
    label: 'Dikirim',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  delivered: {
    label: 'Selesai',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
}

const fallbackStatus = {
  label: 'Status Tidak Diketahui',
  bg: 'bg-slate-50',
  text: 'text-slate-600',
  border: 'border-slate-200',
}

onMounted(() => {
  initProfile()

  fetchOrders().then(() => {
    if (window.location.hash === '#orders-section') {
      const el = document.getElementById('orders-section')
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    }
  })
})

function initProfile() {
  if (!userStore.user) return

  form.value.fullname = userStore.user.name || ''
  form.value.email = userStore.user.email || ''

  if (userStore.user.avatar_url) {
    previewImage.value = assetUrl(userStore.user.avatar_url)
  }
}

function startEdit() {
  message.value = { text: '', type: '' }
  isEditing.value = true
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}

function getStatusConfig(status) {
  return statusConfig[status] || fallbackStatus
}

function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    message.value = {
      text: 'File harus berupa gambar (JPG, PNG, atau GIF).',
      type: 'error',
    }
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    message.value = {
      text: 'Ukuran maksimal file adalah 2MB.',
      type: 'error',
    }
    return
  }

  selectedFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function cancelEdit() {
  isEditing.value = false
  message.value = { text: '', type: '' }

  if (userStore.user) {
    form.value.fullname = userStore.user.name || ''
    form.value.email = userStore.user.email || ''
    form.value.password = ''

    if (userStore.user.avatar_url) {
      previewImage.value = assetUrl(userStore.user.avatar_url)
    } else {
      previewImage.value = null
    }
  }

  selectedFile.value = null
}

async function handleSaveProfile() {
  isSaving.value = true
  message.value = { text: '', type: '' }

  try {
    const formData = new FormData()

    formData.append('fullname', form.value.fullname)

    if (form.value.password) {
      formData.append('password', form.value.password)
    }

    if (selectedFile.value) {
      formData.append('avatar', selectedFile.value)
    }

    const data = await authApi.updateProfile(formData)

    if (data.user) {
      userStore.user = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    form.value.password = ''
    isEditing.value = false
    selectedFile.value = null

    message.value = {
      text: 'Profil berhasil diperbarui.',
      type: 'success',
    }
  } catch (error) {
    message.value = {
      text: error.message || 'Gagal menyimpan profil. Silakan coba lagi.',
      type: 'error',
    }
  } finally {
    isSaving.value = false
  }
}

async function fetchOrders() {
  isOrdersLoading.value = true
  ordersError.value = ''

  try {
    const data = await orderApi.list()
    orders.value = data || []
  } catch (err) {
    ordersError.value = err.message || 'Terjadi kesalahan'
  } finally {
    isOrdersLoading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'

  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<style scoped>
.profile-page {
  color: #e5e7eb;
  background:
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.22), transparent 30%),
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 32%),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.08), transparent 28%),
    linear-gradient(180deg, #0b1020 0%, #080b14 48%, #05070d 100%);
}

.profile-page .text-slate-950 {
  color: #ffffff !important;
}

.profile-page .text-slate-700,
.profile-page .text-slate-600 {
  color: #dbeafe !important;
}

.profile-page .text-slate-500,
.profile-page .text-slate-400 {
  color: #94a3b8 !important;
}

.profile-page .text-indigo-600 {
  color: #a78bfa !important;
}

.gradient-text {
  background: linear-gradient(135deg, #818cf8, #a855f7, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-page .bg-indigo-50,
.profile-page .bg-white {
  background: rgba(30, 41, 59, 0.72) !important;
}

.profile-page .border-indigo-100,
.profile-page .border-slate-200 {
  border-color: rgba(129, 140, 248, 0.24) !important;
}

.profile-card,
.order-card {
  overflow: hidden;
  border: 1px solid rgba(129, 140, 248, 0.22);
  border-radius: 1.5rem;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 27, 75, 0.86));
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.25),
    0 24px 70px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(14px);
}

.order-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.order-card:hover {
  transform: translateY(-3px);
  border-color: rgba(167, 139, 250, 0.48);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 28px 80px rgba(79, 70, 229, 0.18);
}

.profile-page .bg-slate-50\/60 {
  background: rgba(15, 23, 42, 0.62) !important;
}

.profile-page .border-slate-100 {
  border-color: rgba(148, 163, 184, 0.16) !important;
}

.avatar-ring {
  display: flex;
  width: 6rem;
  height: 6rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  border: 4px solid rgba(129, 140, 248, 0.28);
  background: linear-gradient(135deg, #111827, #312e81);
  box-shadow:
    0 0 0 6px rgba(99, 102, 241, 0.08),
    0 18px 40px rgba(0, 0, 0, 0.35);
}

.avatar-large {
  width: 8rem;
  height: 8rem;
  border-color: rgba(255, 255, 255, 0.18);
}

.btn-primary,
.btn-soft,
.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  border-radius: 0.9rem;
  padding: 0.7rem 1.15rem;
  font-size: 0.875rem;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.btn-primary {
  border: 1px solid rgba(129, 140, 248, 0.6);
  color: white;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 14px 34px rgba(79, 70, 229, 0.32);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 42px rgba(124, 58, 237, 0.38);
}

.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  transform: none;
}

.btn-soft {
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #e0e7ff !important;
  background: rgba(15, 23, 42, 0.72) !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
}

.btn-soft:hover {
  transform: translateY(-1px);
  border-color: rgba(129, 140, 248, 0.58);
  color: #ffffff !important;
  background: rgba(79, 70, 229, 0.22) !important;
}

.btn-danger {
  border: 1px solid rgba(244, 63, 94, 0.28);
  color: #fb7185 !important;
  background: rgba(127, 29, 29, 0.22) !important;
}

.btn-danger:hover {
  transform: translateY(-1px);
  color: #fecdd3 !important;
  background: rgba(190, 18, 60, 0.26) !important;
}

.field-label {
  display: block;
  margin-bottom: 0.45rem;
  color: #dbeafe;
  font-size: 0.875rem;
  font-weight: 800;
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 0.9rem;
  width: 1rem;
  height: 1rem;
  color: #818cf8;
  transform: translateY(-50%);
}

.form-input {
  display: block;
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 0.95rem;
  padding: 0.8rem 0.9rem 0.8rem 2.55rem;
  color: #f8fafc;
  font-size: 0.925rem;
  outline: none;
  background: rgba(15, 23, 42, 0.78);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-input::placeholder {
  color: #64748b;
}

.form-input:focus {
  border-color: #818cf8;
  background: rgba(15, 23, 42, 0.96);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.16);
}

.disabled-input {
  cursor: not-allowed;
  color: #94a3b8;
  background: rgba(15, 23, 42, 0.48);
}

.order-label {
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.order-value {
  margin-top: 0.25rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 900;
}

.profile-page .bg-yellow-50 {
  background: rgba(234, 179, 8, 0.13) !important;
}

.profile-page .text-yellow-700 {
  color: #fde68a !important;
}

.profile-page .border-yellow-200 {
  border-color: rgba(234, 179, 8, 0.35) !important;
}

.profile-page .bg-blue-50 {
  background: rgba(59, 130, 246, 0.14) !important;
}

.profile-page .text-blue-700 {
  color: #93c5fd !important;
}

.profile-page .border-blue-200 {
  border-color: rgba(59, 130, 246, 0.36) !important;
}

.profile-page .bg-orange-50 {
  background: rgba(249, 115, 22, 0.14) !important;
}

.profile-page .text-orange-700,
.profile-page .text-orange-500 {
  color: #fdba74 !important;
}

.profile-page .border-orange-200 {
  border-color: rgba(249, 115, 22, 0.36) !important;
}

.profile-page .bg-emerald-50 {
  background: rgba(16, 185, 129, 0.14) !important;
}

.profile-page .text-emerald-700,
.profile-page .text-emerald-500 {
  color: #6ee7b7 !important;
}

.profile-page .border-emerald-200 {
  border-color: rgba(16, 185, 129, 0.36) !important;
}

.profile-page .bg-slate-200,
.profile-page .bg-slate-100 {
  background: rgba(148, 163, 184, 0.16) !important;
}

.profile-page .bg-slate-50 {
  background: rgba(15, 23, 42, 0.55) !important;
}

.profile-page .border-dashed {
  border-color: rgba(129, 140, 248, 0.35) !important;
}

.profile-page .bg-rose-50 {
  background: rgba(127, 29, 29, 0.28) !important;
}

.profile-page .border-rose-200 {
  border-color: rgba(251, 113, 133, 0.32) !important;
}

.profile-page .text-rose-700,
.profile-page .text-rose-500 {
  color: #fda4af !important;
}

.profile-page .bg-emerald-50 {
  background: rgba(6, 78, 59, 0.3) !important;
}

.profile-page .text-emerald-700 {
  color: #86efac !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>