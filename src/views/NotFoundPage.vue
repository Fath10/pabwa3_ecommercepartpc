<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-20" style="background: #0d1117;">
    <div class="text-center relative max-w-md w-full">
      <!-- Glow effect -->
      <div class="absolute inset-0 pointer-events-none -translate-y-12" style="background: radial-gradient(circle 200px at 50% 50%, rgba(79,70,229,0.15) 0%, transparent 80%);"></div>

      <!-- 404 Text/Illustration -->
      <h1 class="text-9xl font-black text-transparent bg-clip-text mb-4" style="background-image: linear-gradient(135deg, #4f46e5, #c084fc); letter-spacing: -0.05em;">
        404
      </h1>
      
      <h2 class="text-2xl font-bold text-white mb-3">Halaman Tidak Ditemukan</h2>
      <p class="text-sm text-gray-400 mb-8 leading-relaxed">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan ke alamat lain.
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <RouterLink
          to="/"
          class="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
          style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 4px 14px rgba(79,70,229,0.3);"
        >
          Kembali ke Beranda
        </RouterLink>
        <RouterLink
          to="/katalog"
          class="px-6 py-3 rounded-xl text-indigo-300 font-bold text-sm transition-all duration-200 hover:bg-white/5"
          style="border: 1px solid rgba(255,255,255,0.15);"
        >
          Lihat Katalog
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// NotFoundPage does not require complex logic
</script>
