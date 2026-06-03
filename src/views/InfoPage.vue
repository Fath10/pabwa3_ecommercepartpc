<template>
  <main class="pt-28 pb-20 min-h-screen" style="background: #070a13;">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 mb-10 text-sm font-semibold"
      >
        ← Kembali ke Beranda
      </RouterLink>

      <!-- Header -->
      <section class="mb-10">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 text-sm font-semibold mb-6">
          {{ page.badge }}
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
          {{ page.title }}
        </h1>

        <p class="text-gray-400 text-lg leading-relaxed max-w-3xl">
          {{ page.subtitle }}
        </p>
      </section>

      <!-- Content Card -->
      <section class="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-lg">
        <div class="p-6 sm:p-8 lg:p-10">
          <div
            v-for="section in page.sections"
            :key="section.heading"
            class="pb-8 mb-8 border-b border-white/10 last:border-b-0 last:pb-0 last:mb-0"
          >
            <div class="flex items-start gap-4">
              <div class="w-1.5 h-8 rounded-full bg-indigo-500 flex-shrink-0 mt-1"></div>

              <div>
                <h2 class="text-2xl font-bold text-white mb-4">
                  {{ section.heading }}
                </h2>

                <p class="text-gray-400 leading-8 text-base">
                  {{ section.body }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Note -->
      <div class="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p class="text-gray-400 leading-relaxed">
          Jika memiliki pertanyaan lebih lanjut, pengguna dapat menghubungi e-BuildPC melalui email
          <span class="text-white font-semibold">hello@e-buildpc.id</span>.
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pages = {
  'privacy-policy': {
    badge: 'Kebijakan Privasi',
    title: 'Privacy Policy',
    subtitle: 'Kebijakan privasi ini menjelaskan bagaimana e-BuildPC mengelola informasi pengguna saat menggunakan website.',
    sections: [
      {
        heading: 'Pengumpulan Informasi',
        body: 'e-BuildPC dapat mengumpulkan informasi dasar seperti nama, email, data akun, serta aktivitas pengguna saat mengakses katalog, keranjang, dan fitur lain yang tersedia di website.'
      },
      {
        heading: 'Penggunaan Informasi',
        body: 'Informasi pengguna digunakan untuk mendukung pengalaman penggunaan website, seperti proses login, pengelolaan keranjang, peningkatan layanan, serta kebutuhan komunikasi yang berkaitan dengan aktivitas pengguna.'
      },
      {
        heading: 'Keamanan Data',
        body: 'e-BuildPC berupaya menjaga keamanan informasi pengguna dengan membatasi akses data dan menggunakan informasi hanya untuk kebutuhan layanan website.'
      },
      {
        heading: 'Perubahan Kebijakan',
        body: 'Kebijakan privasi dapat diperbarui apabila terdapat perubahan fitur, kebutuhan layanan, atau pengembangan sistem pada website e-BuildPC.'
      }
    ]
  },

  'terms-of-service': {
    badge: 'Syarat Layanan',
    title: 'Terms of Service',
    subtitle: 'Syarat dan ketentuan ini mengatur penggunaan website e-BuildPC oleh pengguna.',
    sections: [
      {
        heading: 'Penggunaan Website',
        body: 'Pengguna dapat menggunakan e-BuildPC untuk melihat katalog produk, mencari komponen PC, membaca artikel, membuat akun, dan menambahkan produk ke keranjang.'
      },
      {
        heading: 'Informasi Produk',
        body: 'Informasi produk seperti harga, stok, kategori, tag, spesifikasi, dan deskripsi ditampilkan untuk membantu pengguna memilih komponen PC yang sesuai dengan kebutuhan.'
      },
      {
        heading: 'Akun Pengguna',
        body: 'Pengguna bertanggung jawab menjaga keamanan akun masing-masing, termasuk data login yang digunakan untuk mengakses fitur tertentu pada website.'
      },
      {
        heading: 'Perubahan Layanan',
        body: 'e-BuildPC dapat melakukan pembaruan pada tampilan, informasi produk, fitur, maupun ketentuan layanan untuk meningkatkan kualitas website.'
      }
    ]
  }
}

const page = computed(() => {
  return pages[route.params.slug] || {
    badge: 'Informasi',
    title: 'Halaman Tidak Ditemukan',
    subtitle: 'Informasi yang Anda cari belum tersedia.',
    sections: [
      {
        heading: 'Tidak Ada Konten',
        body: 'Silakan kembali ke halaman utama atau pilih link lain yang tersedia di website.'
      }
    ]
  }
})

watchEffect(() => {
  document.title = `e-BuildPC | ${page.value.title}`
})
</script>