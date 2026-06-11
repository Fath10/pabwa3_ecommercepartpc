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
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-white tracking-tight">Reset Password</h1>
            <p class="text-sm text-gray-400 mt-2 text-center leading-relaxed">Silakan masukkan password baru untuk akun Anda.</p>
          </div>

          <!-- Success Message -->
          <Transition name="fade">
            <div v-if="successMsg" class="mb-6 p-4 rounded-xl text-sm bg-green-500/10 text-green-400 border border-green-500/20 text-center">
              {{ successMsg }}
              <div class="mt-4">
                <RouterLink
                  to="/login"
                  class="inline-block px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                  style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
                >
                  Masuk Sekarang
                </RouterLink>
              </div>
            </div>
          </Transition>

          <!-- Form Reset Password -->
          <form v-if="!successMsg" @submit.prevent="handleResetPassword" class="space-y-4">
            <!-- Password Baru -->
            <div>
              <label for="password" class="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Password Baru</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Minimal 8 karakter"
                  required
                  minlength="8"
                  class="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50"
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

            <!-- Error message -->
            <Transition name="fade">
              <p v-if="errorMsg" class="text-xs text-red-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errorMsg }}
              </p>
            </Transition>

            <!-- Tombol Simpan -->
            <button
              id="submit-btn"
              type="submit"
              :disabled="isLoading || password.length < 8"
              class="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
              style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
            >
              <span v-if="!isLoading">Simpan Password Baru</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Memproses…
              </span>
            </button>
          </form>

        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { authApi } from '../api/index.js'

const route = useRoute()
const token = route.params.token

const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleResetPassword() {
  if (!password.value || password.value.length < 8) return

  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const res = await authApi.resetPassword({ token, newPassword: password.value })
    successMsg.value = res.message || 'Password berhasil diubah. Silakan masuk dengan password baru Anda.'
  } catch (err) {
    errorMsg.value = err.message || 'Gagal mereset password. Token mungkin sudah kadaluarsa.'
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
