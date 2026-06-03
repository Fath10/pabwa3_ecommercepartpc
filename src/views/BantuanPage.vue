<template>
  <main class="min-h-screen pt-16" style="background: #0d1117;">
    <section class="relative overflow-hidden py-20" style="background: #0e1524;">
      <div
        class="absolute inset-0 pointer-events-none"
        style="background: radial-gradient(ellipse 55% 45% at 74% 28%, rgba(37,99,235,0.24), transparent 68%), radial-gradient(ellipse 40% 35% at 18% 70%, rgba(16,185,129,0.14), transparent 70%);"
      ></div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div class="text-white pt-4">
            <p class="text-sm font-semibold mb-3" style="color: #60a5fa;">Pusat Bantuan e-BuildPC</p>
            <h1 class="font-extrabold leading-tight mb-4" style="font-size: clamp(2rem, 4vw, 3.25rem);">
              Kami siap membantu kendala Anda
            </h1>
            <p class="leading-relaxed mb-8" style="color: #94a3b8; max-width: 520px;">
              Kirimkan detail keluhan atau pertanyaan Anda melalui formulir ini agar tim kami bisa menindaklanjuti dengan lebih cepat dan jelas.
            </p>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="p-5 rounded-lg" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
                <p class="text-sm font-bold text-white mb-1">Respon cepat</p>
                <p class="text-xs leading-relaxed" style="color: #94a3b8;">Laporan Anda akan dicatat sesuai kategori keluhan.</p>
              </div>
              <div class="p-5 rounded-lg" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
                <p class="text-sm font-bold text-white mb-1">Data lengkap</p>
                <p class="text-xs leading-relaxed" style="color: #94a3b8;">Nama, email, jenis keluhan, dan deskripsi membantu proses pengecekan.</p>
              </div>
            </div>
          </div>

          <form
            class="rounded-xl p-6 sm:p-8 shadow-2xl"
            style="background: #161b22; border: 1px solid rgba(255,255,255,0.1);"
            @submit.prevent="submitComplaint"
          >
            <div class="mb-6">
              <h2 class="text-xl font-bold text-white mb-2">Formulir Bantuan</h2>
              <p class="text-sm" style="color: #94a3b8;">Isi data berikut untuk mengirimkan keluhan atau masukan.</p>
            </div>

            <div class="grid sm:grid-cols-2 gap-4 mb-4">
              <label class="block">
                <span class="block text-sm font-semibold text-white mb-2">Nama</span>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Masukkan nama"
                  class="w-full px-4 py-3 rounded-lg outline-none text-sm text-white transition-all"
                  style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);"
                />
              </label>

              <label class="block">
                <span class="block text-sm font-semibold text-white mb-2">Email</span>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  class="w-full px-4 py-3 rounded-lg outline-none text-sm text-white transition-all"
                  style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);"
                />
              </label>
            </div>

            <label class="block mb-4">
              <span class="block text-sm font-semibold text-white mb-2">Jenis Keluhan</span>
              <div class="relative">
                <select
                  v-model="form.category"
                  required
                  class="w-full appearance-none px-4 py-3 pr-12 rounded-lg outline-none text-sm text-white transition-all cursor-pointer"
                  style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);"
                >
                  <option value="" disabled>Pilih jenis keluhan</option>
                  <option v-for="category in complaintCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
                <svg
                  class="absolute right-4 top-1/2 w-4 h-4 -translate-y-1/2 pointer-events-none"
                  style="color: #94a3b8;"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </label>

            <label class="block mb-6">
              <span class="block text-sm font-semibold text-white mb-2">Deskripsi Keluhan</span>
              <textarea
                v-model="form.description"
                required
                rows="6"
                placeholder="Ceritakan kendala, pertanyaan, atau saran Anda..."
                class="w-full px-4 py-3 rounded-lg outline-none text-sm text-white transition-all resize-none"
                style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);"
              ></textarea>
            </label>

            <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p v-if="submitted" class="text-sm font-medium" style="color: #86efac;">
                Laporan berhasil dikirim. Terima kasih atas masukannya.
              </p>
              <span v-else class="text-xs" style="color: #64748b;">Pastikan email aktif agar mudah dihubungi.</span>

              <button
                type="submit"
                class="px-6 py-3 rounded-lg text-white text-sm font-bold transition-all hover:opacity-90"
                style="background: linear-gradient(135deg, #2563eb, #4f46e5);"
              >
                Kirim Keluhan
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['show-toast'])

const complaintCategories = [
  'Error Fitur',
  'Pertanyaan',
  'Saran',
  'Keluhan Produk',
  'Masalah Akun',
  'Lainnya',
]

const submitted = ref(false)

const form = reactive({
  name: '',
  email: '',
  category: '',
  description: '',
})

function submitComplaint() {
  const complaint = {
    ...form,
    createdAt: new Date().toISOString(),
  }
  const savedComplaints = JSON.parse(localStorage.getItem('supportComplaints') || '[]')

  savedComplaints.push(complaint)
  localStorage.setItem('supportComplaints', JSON.stringify(savedComplaints))

  form.name = ''
  form.email = ''
  form.category = ''
  form.description = ''
  submitted.value = true
  emit('show-toast', 'Keluhan berhasil dikirim!')
}
</script>

<style scoped>
select option {
  background: #ffffff;
  color: #111827;
}

select option:disabled {
  color: #6b7280;
}
</style>
