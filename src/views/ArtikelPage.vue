<template>
  <main class="pt-24 pb-16 min-h-screen bg-dark-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-black text-white mb-3">Artikel & <span class="gradient-text">Tips</span></h1>
        <p class="text-gray-400">Panduan merakit PC dan tips komponen terbaik</p>
      </div>

      <!-- Featured Article (only on page 1) -->
      <RouterLink
        v-if="currentPage === 1"
        :to="`/artikel/1`"
        class="block rounded-3xl overflow-hidden mb-12 group cursor-pointer transition-all duration-300 hover:-translate-y-2"
        style="background: linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.08)); border: 1px solid rgba(79,70,229,0.3);"
      >
        <!-- Gambar -->
        <div class="relative overflow-hidden">
          <img src="/hero_banner.png" alt="Featured" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <!-- Teks -->
        <div class="p-8">
          <span class="inline-block px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold text-white mb-4">🔥 Artikel Utama</span>
          <h2 class="text-2xl font-black text-white mb-3 group-hover:text-indigo-300 transition-colors">Panduan Lengkap Merakit PC Gaming 2024</h2>
          <p class="text-gray-400 text-sm leading-relaxed mb-6">Pelajari cara memilih dan merakit komponen PC gaming dengan budget optimal. Dari pemilihan prosesor, GPU, RAM, hingga storage — semua dibahas tuntas untuk pemula dan enthusiast.</p>
          <span
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200 group-hover:gap-3"
            style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
          >
            Baca Selengkapnya →
          </span>
        </div>
      </RouterLink>

      <!-- Article Grid -->
      <Transition name="page-slide" mode="out-in">
        <div :key="currentPage" class="grid md:grid-cols-2 gap-6">
          <article
            v-for="article in paginatedArticles"
            :key="article.id"
            class="group bg-gradient-to-b from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-indigo-500/40 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col"
          >
            <div class="h-40 relative overflow-hidden flex items-center justify-center" :style="{ background: article.bgGradient || 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.3))' }">
              <span class="text-6xl z-10">{{ article.emoji }}</span>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div class="p-5 flex flex-col flex-1">
              <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                {{ article.category }}
              </span>
              <h3 class="text-white font-bold text-base mb-2 group-hover:text-indigo-300 transition-colors">{{ article.title }}</h3>
              <p class="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">{{ article.excerpt }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <span>{{ article.date }}</span>
                  <span>·</span>
                  <span>{{ article.readTime }}</span>
                </div>
                <RouterLink
                  :to="`/artikel/${article.id}`"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-200 hover:gap-2.5"
                  style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
                >
                  Baca <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </RouterLink>
              </div>
            </div>
          </article>
        </div>
      </Transition>

      <!-- Pagination -->
      <div class="mt-12 flex flex-col items-center gap-4">
        <!-- Halaman indicator -->
        <p class="text-sm font-medium" style="color: #64748b;">
          Halaman <span style="color: #818cf8;" class="font-bold">{{ currentPage }}</span> / {{ totalPages }}
        </p>
        <!-- Tombol navigasi -->
        <div class="flex items-center gap-3">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-x-0.5"
            style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8;"
          >
            ←
          </button>

          <!-- Page number pills -->
          <div class="flex items-center gap-1.5">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              class="w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200"
              :style="page === currentPage
                ? 'background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; box-shadow: 0 4px 12px rgba(79,70,229,0.4);'
                : 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); color: #64748b;'"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:translate-x-0.5"
            style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff;"
          >
            →
          </button>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const ARTICLES_PER_PAGE = 6
const currentPage = ref(1)

const allArticles = [
  {
    id: 1,
    emoji: '🖥️',
    category: 'Tutorial',
    bgGradient: 'linear-gradient(135deg, rgba(79,70,229,0.35), rgba(124,58,237,0.35))',
    title: 'Cara Merakit PC Gaming untuk Pemula',
    excerpt: 'Panduan step-by-step merakit PC gaming dari awal hingga selesai. Cocok untuk pemula yang belum pernah merakit PC sebelumnya.',
    date: '15 Nov 2024',
    readTime: '8 menit baca',
  },
  {
    id: 2,
    emoji: '🎮',
    category: 'Review',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(185,28,28,0.3))',
    title: 'AMD Ryzen 9 7950X vs Intel Core i9-14900K',
    excerpt: 'Perbandingan mendalam antara dua prosesor flagship terbaik 2024. Mana yang lebih worth it untuk kebutuhan Anda?',
    date: '10 Nov 2024',
    readTime: '12 menit baca',
  },
  {
    id: 3,
    emoji: '💡',
    category: 'Tips',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(217,119,6,0.3))',
    title: '5 Tips Memilih GPU Terbaik dengan Budget Terbatas',
    excerpt: 'Tidak perlu budget besar untuk mendapatkan performa gaming yang baik. Temukan tips cerdas memilih GPU yang sesuai kantong.',
    date: '5 Nov 2024',
    readTime: '6 menit baca',
  },
  {
    id: 4,
    emoji: '❄️',
    category: 'Guide',
    bgGradient: 'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(2,132,199,0.3))',
    title: 'Panduan Sistem Pendingin PC yang Optimal',
    excerpt: 'Panas berlebih bisa merusak komponen PC Anda. Pelajari cara memilih dan mengkonfigurasi sistem pendingin yang tepat.',
    date: '1 Nov 2024',
    readTime: '10 menit baca',
  },
  {
    id: 5,
    emoji: '💾',
    category: 'Comparison',
    bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(5,150,105,0.3))',
    title: 'DDR4 vs DDR5: Mana yang Lebih Worth It di 2024?',
    excerpt: 'Perdebatan DDR4 vs DDR5 masih panas. Kami bedah perbedaan performa, harga, dan kapan sebaiknya upgrade ke DDR5.',
    date: '28 Okt 2024',
    readTime: '9 menit baca',
  },
  {
    id: 6,
    emoji: '⚡',
    category: 'Guide',
    bgGradient: 'linear-gradient(135deg, rgba(234,179,8,0.3), rgba(202,138,4,0.3))',
    title: 'Panduan Memilih PSU yang Tepat untuk Build PC Anda',
    excerpt: 'PSU yang salah bisa merusak seluruh komponen. Pelajari cara menghitung kebutuhan watt dan memilih PSU bergaransi terpercaya.',
    date: '22 Okt 2024',
    readTime: '7 menit baca',
  },
  {
    id: 7,
    emoji: '🔬',
    category: 'Review',
    bgGradient: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(109,40,217,0.3))',
    title: 'Review ASUS ROG Maximus Z790 Hero: Motherboard Enthusiast Terbaik',
    excerpt: 'Kami uji tuntas motherboard flagship ASUS untuk platform Intel LGA1700. Apakah harganya sebanding dengan fitur yang ditawarkan?',
    date: '18 Okt 2024',
    readTime: '15 menit baca',
  },
  {
    id: 8,
    emoji: '📦',
    category: 'Tips',
    bgGradient: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(8,145,178,0.3))',
    title: 'SSD vs HDD: Kapan Sebaiknya Menggunakan Keduanya?',
    excerpt: 'SSD untuk kecepatan, HDD untuk kapasitas — tapi apakah selalu begitu? Kami jelaskan kapan kombinasi keduanya adalah pilihan terbaik.',
    date: '14 Okt 2024',
    readTime: '6 menit baca',
  },
  {
    id: 9,
    emoji: '🚀',
    category: 'Tutorial',
    bgGradient: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(234,88,12,0.3))',
    title: 'Tips Overclocking RAM untuk Pemula: Aman dan Mudah',
    excerpt: 'Aktifkan XMP/EXPO dan raih performa RAM yang sesungguhnya. Panduan overclocking RAM yang aman tanpa risiko kerusakan hardware.',
    date: '10 Okt 2024',
    readTime: '8 menit baca',
  },
  {
    id: 10,
    emoji: '💰',
    category: 'Guide',
    bgGradient: 'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(190,24,93,0.3))',
    title: 'Build PC Budget 5 Jutaan: Masih Bisa Gaming di 2024?',
    excerpt: 'Dengan budget 5 juta, bisa dapat PC gaming yang layak? Kami susun rekomendasi build terbaik dan mana yang harus diprioritaskan.',
    date: '5 Okt 2024',
    readTime: '11 menit baca',
  },
  {
    id: 11,
    emoji: '💧',
    category: 'Tutorial',
    bgGradient: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(37,99,235,0.3))',
    title: 'Cara Memasang Water Cooling AIO dengan Benar',
    excerpt: 'Water cooling AIO menawarkan pendinginan lebih baik dari air cooler biasa. Pelajari cara pasang yang benar agar tidak bocor dan optimal.',
    date: '1 Okt 2024',
    readTime: '9 menit baca',
  },
  {
    id: 12,
    emoji: '🖥️',
    category: 'Comparison',
    bgGradient: 'linear-gradient(135deg, rgba(20,184,166,0.3), rgba(15,118,110,0.3))',
    title: 'Memilih Monitor Gaming: 1080p, 1440p, atau 4K?',
    excerpt: 'Resolusi monitor menentukan kualitas visual dan beban GPU. Panduan lengkap memilih resolusi dan refresh rate yang tepat sesuai budget.',
    date: '25 Sep 2024',
    readTime: '10 menit baca',
  },
]

const totalPages = computed(() => Math.ceil(allArticles.length / ARTICLES_PER_PAGE))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * ARTICLES_PER_PAGE
  return allArticles.slice(start, start + ARTICLES_PER_PAGE)
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #818cf8, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.3s ease;
}
.page-slide-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
