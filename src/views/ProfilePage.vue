<template>
  <main class="pt-20 pb-16 min-h-screen" style="background: #f9fafb;">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Profile Section Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-black mb-1" style="color: #111827;">
          Profil <span style="background: linear-gradient(135deg, #4f46e5, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Pengguna</span>
        </h1>
        <p class="text-sm" style="color: #6b7280;">Kelola informasi akun dan pengaturan profil Anda</p>
      </div>

      <!-- Profile Main Card -->
      <div class="bg-white rounded-2xl overflow-hidden shadow-sm mb-12" style="border: 1px solid #e5e7eb;">
        <div class="p-6 sm:p-8">
          
          <!-- Error/Success Message -->
          <div v-if="message.text" :class="`mb-6 p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
            {{ message.text }}
          </div>

          <!-- View Profile Summary -->
          <div v-if="!isEditing" class="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="flex flex-col sm:flex-row items-center gap-6">
              <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-50 shadow-md bg-gray-50 flex items-center justify-center flex-shrink-0">
                <img v-if="previewImage" :src="previewImage" alt="Avatar" class="w-full h-full object-cover" />
                <svg v-else class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="text-center sm:text-left">
                <h2 class="text-2xl font-black text-gray-900 mb-1">{{ userStore.user?.name || 'User' }}</h2>
                <div class="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ userStore.user?.email }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex-shrink-0 flex flex-wrap items-center gap-3">
              <button @click="isEditing = true" class="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:text-indigo-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profil
              </button>
              
              <button @click="handleLogout" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors shadow-sm duration-200">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          <!-- Edit Profile Form -->
          <form v-else @submit.prevent="handleSaveProfile" class="space-y-8">
            
            <!-- Avatar Section -->
            <div class="flex flex-col sm:flex-row items-center gap-6">
              <div class="relative group">
                <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <img v-if="previewImage" :src="previewImage" alt="Avatar" class="w-full h-full object-cover" />
                  <svg v-else class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <!-- Overlay for hover -->
                <label class="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-200">
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                </label>
              </div>
              <div class="text-center sm:text-left">
                <h2 class="text-lg font-bold text-gray-900 mb-1">Foto Profil</h2>
                <p class="text-xs text-gray-500 mb-3 max-w-xs">Format yang didukung: JPG, PNG, GIF. Ukuran maksimal 2MB. Klik foto untuk mengubah.</p>
                <label class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  Pilih Foto
                  <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                </label>
              </div>
            </div>

            <hr style="border-color: #f3f4f6;" />

            <!-- Account Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div class="col-span-1 md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input type="text" v-model="form.fullname" class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200" placeholder="Nama Anda" required />
                </div>
              </div>

              <div class="col-span-1 md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input type="email" v-model="form.email" disabled class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                </div>
                <p class="text-xs text-gray-500 mt-1.5">Email tidak dapat diubah karena terhubung dengan pesanan Anda.</p>
              </div>

              <!-- Password -->
              <div class="col-span-1 md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Ganti Password <span class="text-gray-400 font-normal">(opsional)</span></label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input :type="showPassword ? 'text' : 'password'" v-model="form.password" class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors duration-200" placeholder="Biarkan kosong jika tidak ingin mengubah" />
                  <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                    <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Submit & Cancel Buttons -->
            <div class="flex justify-end gap-3 pt-4" style="border-top: 1px solid #f3f4f6;">
              <button type="button" @click="cancelEdit" class="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="submit" :disabled="isSaving" class="px-8 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 4px 14px rgba(79,70,229,0.3);">
                <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>

          </form>
        </div>
      </div>

      <!-- Order History Section -->
      <div id="orders-section">
        <!-- Section Header -->
        <div class="mb-6 flex justify-between items-end">
          <div>
            <h2 class="text-2xl font-black text-gray-900 mb-1">Riwayat Pesanan</h2>
            <p class="text-sm text-gray-500">Pantau status pesanan dan lihat riwayat belanja Anda</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isOrdersLoading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div class="h-10 bg-gray-100 rounded w-full mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="ordersError" class="bg-red-50 p-6 rounded-2xl text-center border border-red-200">
          <p class="text-red-600 font-semibold mb-2">Gagal memuat pesanan</p>
          <p class="text-sm text-red-500 mb-4">{{ ordersError }}</p>
          <button @click="fetchOrders" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">Coba Lagi</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="orders.length === 0" class="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
          <p class="text-sm text-gray-500 mb-6">Anda belum pernah melakukan pemesanan sebelumnya.</p>
          <RouterLink to="/katalog" class="inline-flex px-6 py-2.5 rounded-xl text-white font-bold transition-all duration-200 hover:-translate-y-0.5" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 4px 14px rgba(79,70,229,0.3);">
            Mulai Belanja
          </RouterLink>
        </div>

        <!-- Order List -->
        <div v-else class="space-y-4">
          <div v-for="order in orders" :key="order.order_id" class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200" style="border: 1px solid #e5e7eb;">
            
            <!-- Order Header -->
            <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-4" style="border-bottom: 1px solid #f3f4f6; background: #fdfdfd;">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-0.5">NOMOR PESANAN</p>
                <p class="font-bold text-gray-900">#{{ order.order_id }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-0.5">TANGGAL</p>
                <p class="font-bold text-gray-900">{{ formatDate(order.created_at) }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-0.5">TOTAL BELANJA</p>
                <p class="font-bold text-indigo-600">{{ formatPrice(order.total_amount) }}</p>
              </div>
              <div class="flex-shrink-0 text-right w-full sm:w-auto">
                <span :class="['px-3 py-1 text-xs font-bold rounded-full border', statusConfig[order.status].bg, statusConfig[order.status].text, statusConfig[order.status].border]">
                  {{ statusConfig[order.status].label }}
                </span>
              </div>
            </div>

            <!-- Order Action/Footer -->
            <div class="px-6 py-4 flex items-center justify-between bg-white">
              <p class="text-sm text-gray-500">
                <span v-if="order.status === 'shipped'" class="text-orange-500 font-medium">Pesanan sedang dalam perjalanan</span>
                <span v-else-if="order.status === 'delivered'" class="text-emerald-500 font-medium">Pesanan telah diterima</span>
                <span v-else>Menunggu proses selanjutnya</span>
              </p>
              
              <RouterLink :to="`/orders/${order.order_id}`" class="inline-flex items-center justify-center px-5 py-2 border border-gray-300 shadow-sm text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200">
                Lihat Detail
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userStore, formatPrice } from '../store.js'
import { authApi, orderApi, assetUrl } from '../api/index.js'

const router = useRouter()

function handleLogout() {
  userStore.logout()
  router.push('/login')
}

// --- Profile Section Logic ---
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

// --- Order History Section Logic ---
const orders = ref([])
const isOrdersLoading = ref(true)
const ordersError = ref('')

const statusConfig = {
  pending: {
    label: 'Menunggu',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200'
  },
  processing: {
    label: 'Diproses',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  shipped: {
    label: 'Dikirim',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200'
  },
  delivered: {
    label: 'Selesai',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  }
}

onMounted(() => {
  // Init Profile
  if (userStore.user) {
    form.value.fullname = userStore.user.name || ''
    form.value.email = userStore.user.email || ''
    if (userStore.user.avatar_url) {
      previewImage.value = assetUrl(userStore.user.avatar_url)
    }
  }

  // Init Orders
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

function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // Basic validation
  if (!file.type.startsWith('image/')) {
    message.value = { text: 'File harus berupa gambar (JPG, PNG, GIF).', type: 'error' }
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    message.value = { text: 'Ukuran maksimal file adalah 2MB.', type: 'error' }
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
    
    // Update store and local storage
    if (data.user) {
      userStore.user = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    message.value = { text: 'Profil berhasil diperbarui!', type: 'success' }
    form.value.password = '' // Clear password field after success
    isEditing.value = false // Toggle back to summary view
  } catch (error) {
    message.value = { text: error.message || 'Gagal menyimpan profil. Silakan coba lagi.', type: 'error' }
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
    year: 'numeric'
  })
}
</script>
