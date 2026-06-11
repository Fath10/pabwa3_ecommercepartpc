<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-20" style="background: #0d1117;">

    <!-- Card container -->
    <Transition name="card-pop" appear>
      <div
        class="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style="background: #161b22; border: 1px solid rgba(255,255,255,0.08);"
      >
        <!-- Header gradient strip -->
        <div class="h-1.5 w-full" style="background: linear-gradient(90deg, #4f46e5, #7c3aed, #a855f7);"></div>

        <div class="px-8 py-10">
          <!-- Logo & judul -->
          <div class="flex flex-col items-center mb-8">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
            >
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-white tracking-tight">Lupa Password</h1>
            <p class="text-sm text-gray-400 mt-2 text-center leading-relaxed">Masukkan email yang terdaftar untuk menerima link reset password akun Anda.</p>
          </div>

          <!-- Success Message -->
          <Transition name="fade">
            <div v-if="successMsg" class="mb-6 p-4 rounded-xl text-sm bg-green-500/10 text-green-400 border border-green-500/20 text-center">
              {{ successMsg }}
            </div>
          </Transition>

          <!-- Form Forgot Password -->
          <form v-if="!successMsg" @submit.prevent="handleForgotPassword" class="space-y-4">
            <!-- Email -->
            <div>
              <label for="email" class="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="contoh@email.com"
                  required
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50"
                  style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);"
                />
              </div>
            </div>

            <!-- Error message -->
            <Transition name="fade">
              <p v-if="errorMsg" class="text-xs text-red-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errorMsg }}
              </p>
            </Transition>

            <!-- Tombol Kirim -->
            <button
              id="submit-btn"
              type="submit"
              :disabled="isLoading"
              class="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
              style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
            >
              <span v-if="!isLoading">Kirim Link Reset</span>
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
            <span class="text-xs text-gray-500">Ingat password Anda?</span>
            <div class="flex-1 h-px" style="background: rgba(255,255,255,0.08);"></div>
          </div>

          <!-- Tombol Kembali ke Login -->
          <RouterLink
            to="/login"
            class="block w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
            style="border: 1px solid rgba(255,255,255,0.15); color: #a5b4fc;"
          >
            Kembali ke Halaman Login
          </RouterLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authApi } from '../api/index.js'

const email = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleForgotPassword() {
  if (!email.value) return

  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const res = await authApi.forgotPassword({ email: email.value })
    successMsg.value = res.message || 'Link reset password telah dikirim ke email Anda.'
  } catch (err) {
    errorMsg.value = err.message || 'Gagal mengirim link reset password. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.card-pop-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card-pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
