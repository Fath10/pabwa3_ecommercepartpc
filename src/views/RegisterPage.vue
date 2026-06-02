<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-20" style="background: #0d1117;">

    <Transition name="card-pop" appear>
      <div
        class="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style="background: #161b22; border: 1px solid rgba(255,255,255,0.08);"
      >
        <!-- Header gradient strip -->
        <div class="h-1.5 w-full" style="background: linear-gradient(90deg, #7c3aed, #a855f7, #ec4899);"></div>

        <div class="px-8 py-10">
          <!-- Logo & judul -->
          <div class="flex flex-col items-center mb-8">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style="background: linear-gradient(135deg, #7c3aed, #a855f7);"
            >
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-white tracking-tight">Buat Akun Baru</h1>
            <p class="text-sm text-gray-400 mt-1">Bergabung dengan <span class="text-purple-400 font-medium">e-BuildPC</span> sekarang</p>
          </div>

          <!-- Form Registrasi -->
          <form @submit.prevent="handleRegister" class="space-y-4">
            <!-- Nama Lengkap -->
            <div>
              <label for="fullname" class="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  id="fullname"
                  v-model="form.fullname"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  required
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/50"
                  style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="reg-email" class="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="reg-email"
                  v-model="form.email"
                  type="email"
                  placeholder="contoh@email.com"
                  required
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/50"
                  style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="reg-password" class="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="reg-password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Minimal 8 karakter"
                  required
                  minlength="8"
                  class="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/50"
                  style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
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

            <!-- Error / Info message -->
            <Transition name="fade">
              <p
                v-if="message"
                class="text-xs flex items-center gap-1.5"
                :class="isSuccess ? 'text-green-400' : 'text-red-400'"
              >
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="!isSuccess" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ message }}
              </p>
            </Transition>

            <!-- Tombol Daftar -->
            <button
              id="register-submit-btn"
              type="submit"
              :disabled="isLoading"
              class="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
              style="background: linear-gradient(135deg, #7c3aed, #a855f7);"
            >
              <span v-if="!isLoading">Buat Akun</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Memproses…
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px" style="background: rgba(255,255,255,0.08);"></div>
            <span class="text-xs text-gray-500">Sudah punya akun?</span>
            <div class="flex-1 h-px" style="background: rgba(255,255,255,0.08);"></div>
          </div>

          <!-- Kembali ke Login -->
          <RouterLink
            id="back-to-login-btn"
            to="/login"
            class="block w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
            style="border: 1px solid rgba(255,255,255,0.15); color: #c4b5fd;"
          >
            Masuk ke Akun
          </RouterLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({ fullname: '', email: '', password: '' })
const showPassword = ref(false)
const isLoading = ref(false)
const message = ref('')
const isSuccess = ref(false)

async function handleRegister() {
  message.value = ''
  isLoading.value = true

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullname: form.value.fullname,
        email: form.value.email,
        password: form.value.password
      })
    })

    const data = await res.json()

    if (!res.ok) {
      isSuccess.value = false
      message.value = data.message || 'Registrasi gagal.'
      return
    }

    isSuccess.value = true
    message.value = 'Akun berhasil dibuat! Mengalihkan ke halaman login...'
    
    // Reset form
    form.value = { fullname: '', email: '', password: '' }
    
    // Alihkan ke halaman login setelah 2 detik
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (error) {
    console.error('Error saat register:', error)
    isSuccess.value = false
    message.value = 'Tidak dapat terhubung ke server backend. Pastikan server backend Anda menyala.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.card-pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card-pop-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.96);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
