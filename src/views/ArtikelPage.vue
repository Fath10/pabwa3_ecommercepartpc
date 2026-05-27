<template>
  <main class="pt-24 pb-16 min-h-screen bg-dark-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-black text-white mb-3">Artikel & <span class="gradient-text">Tips</span></h1>
        <p class="text-gray-400">Panduan merakit PC dan tips komponen terbaik</p>
      </div>

      <!-- Featured Article -->
      <div class="relative rounded-3xl overflow-hidden mb-12 group cursor-pointer">
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
        <img src="/hero_banner.png" alt="Featured" class="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700" />
        <div class="absolute bottom-0 left-0 right-0 p-8 z-20">
          <span class="inline-block px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold text-white mb-3">🔥 Artikel Utama</span>
          <h2 class="text-2xl font-black text-white mb-2">Panduan Lengkap Merakit PC Gaming 2024</h2>
          <p class="text-gray-300 text-sm">Pelajari cara memilih dan merakit komponen PC gaming dengan budget optimal...</p>
        </div>
      </div>

      <!-- Article Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <article
          v-for="article in articles"
          :key="article.id"
          class="group bg-gradient-to-b from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-indigo-500/40 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
        >
          <div class="h-40 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 relative overflow-hidden flex items-center justify-center">
            <span class="text-6xl">{{ article.emoji }}</span>
            <div class="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
          </div>
          <div class="p-5">
            <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              {{ article.category }}
            </span>
            <h3 class="text-white font-bold text-base mb-2 group-hover:text-indigo-300 transition-colors">{{ article.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{{ article.excerpt }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ article.date }}</span>
              <span>{{ article.readTime }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<script setup>
const articles = [
  {
    id: 1,
    emoji: '🖥️',
    category: 'Tutorial',
    title: 'Cara Merakit PC Gaming untuk Pemula',
    excerpt: 'Panduan step-by-step merakit PC gaming dari awal hingga selesai. Cocok untuk pemula yang belum pernah merakit PC sebelumnya.',
    date: '15 November 2024',
    readTime: '8 menit baca',
  },
  {
    id: 2,
    emoji: '🎮',
    category: 'Review',
    title: 'AMD Ryzen 9 7950X vs Intel Core i9-14900K',
    excerpt: 'Perbandingan mendalam antara dua prosesor flagship terbaik 2024. Mana yang lebih worth it untuk kebutuhan Anda?',
    date: '10 November 2024',
    readTime: '12 menit baca',
  },
  {
    id: 3,
    emoji: '💡',
    category: 'Tips',
    title: '5 Tips Memilih GPU Terbaik dengan Budget Terbatas',
    excerpt: 'Tidak perlu budget besar untuk mendapatkan performa gaming yang baik. Temukan tips cerdas memilih GPU yang sesuai kantong.',
    date: '5 November 2024',
    readTime: '6 menit baca',
  },
  {
    id: 4,
    emoji: '❄️',
    category: 'Guide',
    title: 'Panduan Sistem Pendingin PC yang Optimal',
    excerpt: 'Panas berlebih bisa merusak komponen PC Anda. Pelajari cara memilih dan mengkonfigurasi sistem pendingin yang tepat.',
    date: '1 November 2024',
    readTime: '10 menit baca',
  },
]
</script>
