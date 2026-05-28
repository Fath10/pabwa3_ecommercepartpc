<template>
  <main class="pt-20 pb-20 min-h-screen" style="background: #0d1117;">

    <!-- Back Button -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <RouterLink
        to="/artikel"
        class="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:-translate-x-1"
        style="color: #94a3b8;"
      >
        ← Kembali ke Artikel
      </RouterLink>
    </div>

    <!-- Article Not Found -->
    <div v-if="!article" class="max-w-4xl mx-auto px-4 text-center py-24">
      <div class="text-8xl mb-6">📄</div>
      <h2 class="text-2xl font-bold text-white mb-3">Artikel Tidak Ditemukan</h2>
      <RouterLink to="/artikel" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all" style="background: #4f46e5;">
        Lihat Semua Artikel
      </RouterLink>
    </div>

    <!-- Article Content -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Article Header -->
      <div class="mb-10">
        <div class="flex flex-wrap items-center gap-3 mb-5">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold text-white" style="background: #4f46e5;">
            {{ article.category }}
          </span>
          <span class="text-sm" style="color: #64748b;">{{ article.date }}</span>
          <span class="text-sm" style="color: #64748b;">·</span>
          <span class="text-sm" style="color: #64748b;">{{ article.readTime }}</span>
        </div>

        <h1 class="font-black text-white mb-5 leading-tight" style="font-size: clamp(1.8rem, 4vw, 2.8rem);">
          {{ article.title }}
        </h1>

        <p class="text-lg leading-relaxed mb-8" style="color: #94a3b8;">
          {{ article.excerpt }}
        </p>

        <!-- Author -->
        <div class="flex items-center gap-4 pb-8" style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
            :style="{ background: article.authorGradient }"
          >
            {{ article.author[0] }}
          </div>
          <div>
            <p class="font-semibold text-white text-sm">{{ article.author }}</p>
            <p class="text-xs" style="color: #64748b;">{{ article.authorRole }}</p>
          </div>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="relative rounded-3xl overflow-hidden mb-12" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);">
        <div class="flex items-center justify-center py-20">
          <span style="font-size: 6rem;">{{ article.emoji }}</span>
        </div>
        <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(13,17,23,0.6) 0%, transparent 60%);"></div>
      </div>

      <!-- Article Body -->
      <div class="article-body space-y-8">
        <div v-for="(section, i) in article.sections" :key="i">

          <!-- Section Heading -->
          <h2 v-if="section.type === 'heading'" class="font-black text-white" style="font-size: 1.5rem; margin-top: 2rem;">
            {{ section.content }}
          </h2>

          <!-- Paragraph -->
          <p v-else-if="section.type === 'paragraph'" class="leading-relaxed text-base" style="color: #94a3b8;">
            {{ section.content }}
          </p>

          <!-- Highlight Box -->
          <div
            v-else-if="section.type === 'highlight'"
            class="rounded-2xl p-6 border-l-4"
            style="background: rgba(79,70,229,0.1); border-left-color: #4f46e5;"
          >
            <p class="font-medium leading-relaxed" style="color: #c7d2fe;">{{ section.content }}</p>
          </div>

          <!-- Tips List -->
          <div v-else-if="section.type === 'tips'" class="space-y-3">
            <div
              v-for="(tip, ti) in section.items"
              :key="ti"
              class="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);"
            >
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm text-white"
                style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
              >
                {{ ti + 1 }}
              </div>
              <p class="text-sm leading-relaxed pt-1" style="color: #94a3b8;">{{ tip }}</p>
            </div>
          </div>

          <!-- Spec Table -->
          <div v-else-if="section.type === 'table'" class="rounded-2xl overflow-hidden" style="border: 1px solid rgba(255,255,255,0.08);">
            <div class="px-5 py-3" style="background: rgba(79,70,229,0.15);">
              <p class="font-bold text-white text-sm">{{ section.title }}</p>
            </div>
            <div class="divide-y" style="divide-color: rgba(255,255,255,0.05);">
              <div
                v-for="(row, ri) in section.rows"
                :key="ri"
                class="flex justify-between items-center px-5 py-3"
                style="border-top: 1px solid rgba(255,255,255,0.05);"
              >
                <span class="text-sm font-medium" style="color: #64748b;">{{ row.label }}</span>
                <span class="text-sm font-semibold text-white">{{ row.value }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mt-12 pt-8" style="border-top: 1px solid rgba(255,255,255,0.08);">
        <span
          v-for="tag in article.tags"
          :key="tag"
          class="px-3 py-1 rounded-full text-xs font-medium"
          style="background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1);"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Navigation: Prev / Next -->
      <div class="grid sm:grid-cols-2 gap-4 mt-12">
        <RouterLink
          v-if="prevArticle"
          :to="`/artikel/${prevArticle.id}`"
          class="group flex flex-col gap-1 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
          style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);"
        >
          <span class="text-xs" style="color: #64748b;">← Sebelumnya</span>
          <span class="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">{{ prevArticle.title }}</span>
        </RouterLink>
        <div v-else></div>
        <RouterLink
          v-if="nextArticle"
          :to="`/artikel/${nextArticle.id}`"
          class="group flex flex-col gap-1 p-5 rounded-2xl text-right transition-all duration-300 hover:-translate-y-1"
          style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);"
        >
          <span class="text-xs" style="color: #64748b;">Berikutnya →</span>
          <span class="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">{{ nextArticle.title }}</span>
        </RouterLink>
      </div>

      <!-- Back CTA -->
      <div class="text-center mt-16">
        <RouterLink
          to="/artikel"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style="background: linear-gradient(135deg, #4f46e5, #7c3aed); box-shadow: 0 8px 32px rgba(79,70,229,0.3);"
        >
          📚 Lihat Semua Artikel
        </RouterLink>
      </div>
    </div>

  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const allArticles = [
  {
    id: 1,
    emoji: '🖥️',
    category: 'Tutorial',
    title: 'Cara Merakit PC Gaming untuk Pemula',
    excerpt: 'Panduan step-by-step merakit PC gaming dari awal hingga selesai. Cocok untuk pemula yang belum pernah merakit PC sebelumnya.',
    date: '15 November 2024',
    readTime: '8 menit baca',
    author: 'Ahmad Fauzi',
    authorRole: 'PC Enthusiast & Founder',
    authorGradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    tags: ['tutorial', 'gaming', 'PC build', 'pemula', 'hardware'],
    sections: [
      { type: 'paragraph', content: 'Merakit PC gaming sendiri adalah pengalaman yang sangat memuaskan. Selain lebih hemat dibandingkan membeli PC rakitan jadi, Anda juga mendapatkan kepuasan tersendiri ketika melihat PC buatan sendiri hidup pertama kali. Panduan ini akan membawa Anda melalui setiap langkah dari awal hingga PC Anda siap bermain.' },
      { type: 'heading', content: '1. Persiapan Sebelum Merakit' },
      { type: 'paragraph', content: 'Sebelum membeli komponen, tentukan dulu budget dan tujuan penggunaan PC Anda. Apakah untuk gaming ringan, gaming berat 1080p, atau bahkan 4K? Budget menentukan segalanya. Untuk gaming 1080p yang nyaman, budget Rp 8-15 juta sudah cukup baik.' },
      { type: 'highlight', content: '💡 Tips: Selalu alokasikan lebih banyak budget untuk GPU (VGA) karena komponen ini paling berpengaruh terhadap performa gaming Anda.' },
      { type: 'heading', content: '2. Komponen yang Dibutuhkan' },
      { type: 'tips', items: [
        'Processor (CPU) — Otak dari PC Anda. AMD Ryzen dan Intel Core sama-sama bagus.',
        'Motherboard — Papan induk yang menghubungkan semua komponen. Pastikan kompatibel dengan CPU.',
        'RAM — Minimal 16GB DDR4/DDR5 untuk gaming modern.',
        'GPU (VGA Card) — Komponen terpenting untuk gaming. Pilih sesuai resolusi target.',
        'Storage (SSD/HDD) — SSD NVMe sangat disarankan untuk kecepatan loading.',
        'PSU (Power Supply) — Jangan pelit di sini. Pilih PSU bersertifikat 80+ Bronze atau lebih.',
        'Case (Casing) — Pilih casing dengan airflow baik untuk menjaga suhu komponen.',
      ]},
      { type: 'heading', content: '3. Langkah-Langkah Perakitan' },
      { type: 'paragraph', content: 'Mulailah dengan memasang CPU ke motherboard di luar casing dulu. Pasang RAM, lalu pasang cooler CPU. Setelah itu, masukkan motherboard ke casing dan pasang PSU. Sambungkan semua kabel power dan data. Terakhir, pasang GPU ke slot PCIe.' },
      { type: 'table', title: 'Urutan Perakitan yang Disarankan', rows: [
        { label: 'Langkah 1', value: 'Pasang CPU ke Motherboard' },
        { label: 'Langkah 2', value: 'Pasang RAM' },
        { label: 'Langkah 3', value: 'Pasang CPU Cooler' },
        { label: 'Langkah 4', value: 'Pasang Motherboard ke Casing' },
        { label: 'Langkah 5', value: 'Pasang PSU & Storage' },
        { label: 'Langkah 6', value: 'Pasang GPU' },
        { label: 'Langkah 7', value: 'Sambungkan semua kabel' },
        { label: 'Langkah 8', value: 'Power On & Install OS' },
      ]},
      { type: 'heading', content: '4. Tips Anti Gagal' },
      { type: 'tips', items: [
        'Gunakan anti-static wrist strap saat merakit untuk mencegah komponen terkena listrik statis.',
        'Jangan terlalu memaksakan konektor — jika susah masuk, periksa kembali orientasinya.',
        'Baca manual motherboard untuk urutan slot RAM yang benar (dual channel).',
        'Thermal paste tidak perlu banyak — ukuran sebiji beras di tengah CPU sudah cukup.',
        'Test komponen di luar casing dulu (bench test) sebelum memasukkan ke casing.',
      ]},
      { type: 'paragraph', content: 'Dengan mengikuti panduan ini dengan teliti, Anda seharusnya bisa merakit PC gaming pertama Anda tanpa masalah. Jika ada kendala, jangan ragu untuk bertanya di forum komunitas PC Indonesia atau hubungi tim kami!' },
    ],
  },
  {
    id: 2,
    emoji: '🎮',
    category: 'Review',
    title: 'AMD Ryzen 9 7950X vs Intel Core i9-14900K',
    excerpt: 'Perbandingan mendalam antara dua prosesor flagship terbaik 2024. Mana yang lebih worth it untuk kebutuhan Anda?',
    date: '10 November 2024',
    readTime: '12 menit baca',
    author: 'Budi Santoso',
    authorRole: 'Hardware Reviewer',
    authorGradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
    tags: ['review', 'AMD', 'Intel', 'processor', 'benchmark'],
    sections: [
      { type: 'paragraph', content: 'Dua prosesor yang paling banyak diperbincangkan di 2024: AMD Ryzen 9 7950X dengan arsitektur Zen 4 dan Intel Core i9-14900K dengan Core Ultra. Keduanya adalah monster performa, tapi untuk kebutuhan berbeda. Mari kita bandingkan secara komprehensif.' },
      { type: 'heading', content: 'Spesifikasi Utama' },
      { type: 'table', title: 'Perbandingan Spesifikasi', rows: [
        { label: 'Core / Thread', value: 'Ryzen: 16C/32T | i9: 24C/32T' },
        { label: 'Max Boost Clock', value: 'Ryzen: 5.7GHz | i9: 6.0GHz' },
        { label: 'TDP', value: 'Ryzen: 170W | i9: 125W (253W PL2)' },
        { label: 'Cache L3', value: 'Ryzen: 64MB | i9: 36MB' },
        { label: 'Platform', value: 'Ryzen: AM5 | i9: LGA 1700' },
        { label: 'Harga', value: 'Ryzen: ~Rp 8.750.000 | i9: ~Rp 9.200.000' },
      ]},
      { type: 'heading', content: 'Performa Gaming' },
      { type: 'paragraph', content: 'Dalam gaming, Intel i9-14900K unggul tipis berkat clock speed yang lebih tinggi. Perbedaannya sekitar 3-7% di resolusi 1080p. Namun di 1440p dan 4K, perbedaan ini hampir tidak terasa karena GPU menjadi bottleneck.' },
      { type: 'highlight', content: '🎮 Untuk gaming murni di 1080p, i9-14900K sedikit lebih cepat. Tapi perbedaannya tidak signifikan untuk harga yang lebih tinggi.' },
      { type: 'heading', content: 'Performa Produktivitas & Rendering' },
      { type: 'paragraph', content: 'Di sinilah Ryzen 9 7950X benar-benar bersinar. Dengan 16 core yang semuanya adalah P-core (performa), 7950X unggul 15-25% dalam rendering multi-thread seperti Blender, DaVinci Resolve, dan kompilasi kode. Sangat ideal untuk kreator konten dan developer.' },
      { type: 'heading', content: 'Konsumsi Daya & Suhu' },
      { type: 'tips', items: [
        'Ryzen 9 7950X lebih efisien secara daya dengan performa yang sangat kompetitif.',
        'i9-14900K bisa sangat panas dan lapar daya saat di-push full load (bisa 250W+).',
        'Investasi di cooling yang bagus sangat penting untuk i9-14900K.',
        'Ryzen lebih "ramah" untuk sistem compact/small form factor.',
      ]},
      { type: 'heading', content: 'Kesimpulan: Mana yang Harus Dipilih?' },
      { type: 'paragraph', content: 'Pilih Ryzen 9 7950X jika: Anda content creator, 3D artist, developer, atau membutuhkan multitasking berat. Pilih i9-14900K jika: Anda gamer hardcore yang mengutamakan FPS tertinggi dan sudah punya cooling premium.' },
    ],
  },
  {
    id: 3,
    emoji: '💡',
    category: 'Tips',
    title: '5 Tips Memilih GPU Terbaik dengan Budget Terbatas',
    excerpt: 'Tidak perlu budget besar untuk mendapatkan performa gaming yang baik. Temukan tips cerdas memilih GPU yang sesuai kantong.',
    date: '5 November 2024',
    readTime: '6 menit baca',
    author: 'Sari Wulandari',
    authorRole: 'PC Gaming Consultant',
    authorGradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    tags: ['tips', 'GPU', 'budget', 'gaming', 'hemat'],
    sections: [
      { type: 'paragraph', content: 'GPU adalah investasi terbesar dalam build gaming PC. Dengan pasar yang terus berubah, memilih GPU yang tepat dengan budget terbatas bisa menjadi tantangan. Berikut 5 tips yang akan membantu Anda membuat keputusan cerdas.' },
      { type: 'heading', content: 'Tip 1: Tentukan Resolusi Target Terlebih Dahulu' },
      { type: 'paragraph', content: 'Resolusi gaming Anda adalah faktor paling penting. Untuk 1080p, GPU mid-range sudah lebih dari cukup. Untuk 1440p, Anda butuh GPU yang lebih kuat. Jangan beli GPU 4K kalau monitor Anda cuma 1080p.' },
      { type: 'highlight', content: '📺 1080p → RTX 4060 / RX 7600 | 1440p → RTX 4070 / RX 7700 XT | 4K → RTX 4080 / RX 7900 XTX' },
      { type: 'heading', content: 'Tip 2: Pertimbangkan GPU Generasi Sebelumnya' },
      { type: 'paragraph', content: 'RTX 3070/3080 dan RX 6800/6900 XT generasi lalu masih sangat capable untuk gaming modern dan bisa didapat dengan harga yang jauh lebih murah. Cek pasar second hand dengan reputasi penjual yang terpercaya.' },
      { type: 'heading', content: 'Tip 3: Perhatikan VRAM' },
      { type: 'tips', items: [
        'Minimal 8GB VRAM untuk gaming 1080p modern (2024+).',
        '12GB VRAM untuk 1440p dengan setting tinggi.',
        '16GB+ VRAM untuk 4K atau modded games yang berat.',
        'GPU dengan VRAM sedikit tapi cepat lebih baik dari VRAM besar tapi lambat.',
      ]},
      { type: 'heading', content: 'Tip 4: AMD vs NVIDIA — Pilih Sesuai Kebutuhan' },
      { type: 'paragraph', content: 'NVIDIA unggul di ray tracing, DLSS, dan ekosistem software (CUDA). AMD menawarkan performa rasterization yang lebih baik per rupiah. Jika Anda tidak butuh ray tracing atau fitur AI, AMD seringkali lebih worth it.' },
      { type: 'heading', content: 'Tip 5: Cek Benchmark Game Spesifik' },
      { type: 'paragraph', content: 'Jangan hanya melihat benchmark sintetis. Cari benchmark GPU Anda di game yang sering dimainkan. YouTube penuh dengan video benchmark komprehensif. Hardware Unboxed dan Digital Foundry adalah channel yang sangat terpercaya.' },
    ],
  },
  {
    id: 4,
    emoji: '❄️',
    category: 'Guide',
    title: 'Panduan Sistem Pendingin PC yang Optimal',
    excerpt: 'Panas berlebih bisa merusak komponen PC Anda. Pelajari cara memilih dan mengkonfigurasi sistem pendingin yang tepat.',
    date: '1 November 2024',
    readTime: '10 menit baca',
    author: 'Dito Prasetyo',
    authorRole: 'Thermal Solutions Engineer',
    authorGradient: 'linear-gradient(135deg, #10b981, #059669)',
    tags: ['cooling', 'thermal', 'guide', 'hardware', 'maintenance'],
    sections: [
      { type: 'paragraph', content: 'Sistem pendingin yang baik adalah kunci longevity dan performa optimal PC Anda. Komponen yang terlalu panas akan throttle (menurunkan clock speed otomatis) dan pada akhirnya bisa rusak permanen. Panduan ini membahas semua yang perlu Anda tahu.' },
      { type: 'heading', content: 'Mengapa Cooling Sangat Penting?' },
      { type: 'paragraph', content: 'CPU modern seperti i9-14900K bisa menghasilkan panas hingga 250 Watt. Tanpa pendingin yang memadai, suhu bisa melonjak di atas 100°C dalam hitungan detik, menyebabkan thermal throttling atau bahkan kerusakan permanen.' },
      { type: 'highlight', content: '🌡️ Suhu ideal untuk CPU: di bawah 80°C saat load penuh. Untuk GPU: di bawah 85°C. Idle sebaiknya di bawah 45°C.' },
      { type: 'heading', content: 'Jenis-Jenis CPU Cooler' },
      { type: 'tips', items: [
        'Stock Cooler — Gratis bawaan CPU, cukup untuk TDP rendah (<65W). Tidak disarankan untuk overclocking.',
        'Air Cooler Tower — Populer, affordable, dan efektif. Cooler Master Hyper 212 dan Noctua NH-D15 adalah pilihan terbaik.',
        'AIO Liquid Cooler (240mm/280mm/360mm) — Performa lebih baik, estetika premium, tapi lebih mahal dan ada risiko bocor.',
        'Custom Water Cooling — Performa tertinggi, tapi sangat mahal dan kompleks. Untuk enthusiast.',
      ]},
      { type: 'heading', content: 'Airflow Casing: Prinsip Dasar' },
      { type: 'paragraph', content: 'Airflow yang baik sama pentingnya dengan CPU cooler. Prinsip dasarnya: fan depan/bawah sebagai intake (masuk udara segar), fan belakang/atas sebagai exhaust (buang udara panas). Positive pressure (intake lebih banyak) membantu mengurangi debu.' },
      { type: 'table', title: 'Rekomendasi Cooling Berdasarkan CPU', rows: [
        { label: 'TDP <65W (Ryzen 5600)', value: 'Stock atau Air Cooler Budget' },
        { label: 'TDP 65-95W (Ryzen 7700)', value: 'Air Cooler Mid-range (Hyper 212)' },
        { label: 'TDP 95-150W (Ryzen 7900X)', value: 'Air Cooler Premium / AIO 240mm' },
        { label: 'TDP 150W+ (Ryzen 7950X)', value: 'AIO 280-360mm / Custom Loop' },
        { label: 'Intel i9-14900K', value: 'AIO 360mm Wajib / Custom Loop' },
      ]},
      { type: 'heading', content: 'Pasta Termal: Tips Aplikasi' },
      { type: 'tips', items: [
        'Ganti pasta termal setiap 2-3 tahun untuk performa optimal.',
        'Gunakan pasta berkualitas seperti Noctua NT-H1, Thermal Grizzly Kryonaut, atau Arctic MX-6.',
        'Aplikasi pea size di tengah CPU — jangan terlalu banyak, jangan terlalu sedikit.',
        'Hindari pasta berbasis logam cair di dekat motherboard untuk mencegah konsleting.',
      ]},
    ],
  },
]

const articleId = computed(() => parseInt(route.params.id))
const article = computed(() => allArticles.find(a => a.id === articleId.value))
const currentIndex = computed(() => allArticles.findIndex(a => a.id === articleId.value))
const prevArticle = computed(() => currentIndex.value > 0 ? allArticles[currentIndex.value - 1] : null)
const nextArticle = computed(() => currentIndex.value < allArticles.length - 1 ? allArticles[currentIndex.value + 1] : null)
</script>

<style scoped>
.article-body h2 {
  margin-top: 2.5rem;
}
</style>
