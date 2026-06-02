<template>
  <main class="pt-24 pb-16 min-h-screen bg-dark-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- ════════════════════════════════════════════
           MODE DAFTAR ARTIKEL
      ════════════════════════════════════════════ -->
      <template v-if="!activeArticle">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-black text-white mb-3">Artikel &amp; <span class="gradient-text">Tips</span></h1>
          <p class="text-gray-400">Panduan merakit PC dan tips komponen terbaik</p>
        </div>

        <!-- Featured Article -->
        <div
          class="rounded-3xl overflow-hidden mb-12 group cursor-pointer bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
          @click="openArticle(featuredArticle)"
        >
          <!-- Gambar -->
          <div class="relative overflow-hidden h-64">
            <img :src="featuredArticle.image" alt="Featured" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <span class="absolute top-4 left-4 inline-block px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold text-white">🔥 Artikel Utama</span>
          </div>
          <!-- Teks -->
          <div class="p-7">
            <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">{{ featuredArticle.category }}</span>
            <h2 class="text-2xl font-black text-white mb-2 group-hover:text-indigo-300 transition-colors">{{ featuredArticle.title }}</h2>
            <p class="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">{{ featuredArticle.excerpt }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span>{{ featuredArticle.date }}</span>
                <span>{{ featuredArticle.readTime }}</span>
              </div>
              <button
                type="button"
                id="featured-read-more"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm transition-all duration-200 hover:bg-indigo-500 hover:gap-3"
                @click.stop="openArticle(featuredArticle)"
              >
                Baca Selengkapnya <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Article Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="article in paginatedArticles"
            :key="article.id"
            class="group bg-gradient-to-b from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-indigo-500/40 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
            @click="openArticle(article)"
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
              <button
                type="button"
                class="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-semibold inline-flex items-center gap-1.5 transition-all"
                @click.stop="openArticle(article)"
              >
                Baca Selengkapnya <span>→</span>
              </button>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-12 flex flex-col items-center gap-4">
          <!-- Info -->
          <p class="text-gray-500 text-sm">
            Halaman <span class="text-white font-semibold">{{ currentPage }}</span> dari
            <span class="text-white font-semibold">{{ totalPages }}</span>
            &nbsp;·&nbsp; {{ articles.length }} artikel tersedia
          </p>
          <!-- Controls -->
          <div class="flex items-center gap-2">
            <!-- Prev -->
            <button
              id="pagination-prev"
              type="button"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              class="px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200"
              :class="currentPage === 1
                ? 'border-white/5 text-gray-600 cursor-not-allowed'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:-translate-x-0.5'"
            >
              ← Sebelumnya
            </button>

            <!-- Page numbers -->
            <template v-for="page in totalPages" :key="page">
              <button
                :id="`pagination-page-${page}`"
                type="button"
                @click="goToPage(page)"
                class="w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200"
                :class="page === currentPage
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'"
              >{{ page }}</button>
            </template>

            <!-- Next -->
            <button
              id="pagination-next"
              type="button"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
              class="px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200"
              :class="currentPage === totalPages
                ? 'border-white/5 text-gray-600 cursor-not-allowed'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-0.5'"
            >
              Berikutnya →
            </button>
          </div>
        </div>
      </template>

      <!-- ════════════════════════════════════════════
           MODE DETAIL ARTIKEL (FULL CONTENT)
      ════════════════════════════════════════════ -->
      <template v-else>
        <!-- Tombol Kembali -->
        <button
          type="button"
          id="back-to-articles"
          class="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm font-medium transition-all hover:bg-white/10 hover:text-white hover:-translate-x-0.5"
          @click="closeArticle"
        >
          <span>←</span> Kembali ke Daftar Artikel
        </button>

        <article>
          <!-- Header detail -->
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
            {{ activeArticle.category }}
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">{{ activeArticle.title }}</h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
            <span>📅 {{ activeArticle.date }}</span>
            <span>⏱️ {{ activeArticle.readTime }}</span>
            <span>✍️ Tim Redaksi e-BuildPC</span>
          </div>

          <!-- Cover -->
          <div class="rounded-2xl overflow-hidden mb-10 border border-white/10">
            <img
              v-if="activeArticle.image"
              :src="activeArticle.image"
              :alt="activeArticle.title"
              class="w-full h-64 sm:h-80 object-cover"
            />
            <div v-else class="w-full h-64 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 flex items-center justify-center">
              <span class="text-7xl">{{ activeArticle.emoji }}</span>
            </div>
          </div>

          <!-- Isi konten (dinamis per-section) -->
          <div class="article-body space-y-8">
            <p class="text-lg text-gray-300 leading-relaxed font-light border-l-2 border-indigo-500 pl-5">
              {{ activeArticle.excerpt }}
            </p>

            <section v-for="(block, i) in activeArticle.content" :key="i">
              <h2 class="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-purple-500"></span>
                {{ block.heading }}
              </h2>
              <p
                v-for="(para, j) in block.paragraphs"
                :key="j"
                class="text-gray-400 leading-[1.85] mb-4 text-[0.95rem]"
              >{{ para }}</p>
            </section>
          </div>

          <!-- Footer detail -->
          <div class="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-500">Bagikan artikel ini kepada teman yang sedang merakit PC.</p>
            <button
              type="button"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm font-medium transition-all hover:bg-white/10 hover:text-white"
              @click="closeArticle"
            >
              ← Kembali ke Daftar Artikel
            </button>
          </div>
        </article>
      </template>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// State sederhana di dalam komponen: null = mode daftar, objek = mode detail.
const activeArticle = ref(null)

// ── Pagination state ──────────────────────────────
const currentPage = ref(1)
const ARTICLES_PER_PAGE = 9

function openArticle(article) {
  activeArticle.value = article
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function closeArticle() {
  activeArticle.value = null
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

// ──────────────────────────────────────────────
// ARTIKEL UTAMA (Featured) — konten panjang & mendalam
// ──────────────────────────────────────────────
const featuredArticle = {
  id: 0,
  category: '🔥 Artikel Utama',
  emoji: '🖥️',
  image: '/artikel_hero.png',
  title: 'Panduan Lengkap Merakit PC Gaming 2026',
  excerpt:
    'Dari memilih komponen yang seimbang, memahami bottleneck, hingga proses instalasi dan manajemen kabel yang rapi — panduan menyeluruh untuk merakit PC gaming impian Anda dengan budget yang optimal.',
  date: '20 Mei 2026',
  readTime: '15 menit baca',
  content: [
    {
      heading: 'Menentukan Tujuan dan Anggaran Sebelum Membeli',
      paragraphs: [
        'Sebelum menyentuh satu komponen pun, tentukan dulu untuk apa PC ini akan digunakan. PC untuk gaming kompetitif e-sports seperti Valorant atau CS2 punya kebutuhan yang sangat berbeda dengan PC untuk memainkan game AAA pada resolusi 4K, atau PC yang juga dipakai untuk editing video dan rendering 3D. Kejelasan tujuan inilah yang akan menyelamatkan Anda dari pemborosan pada komponen yang sebenarnya tidak Anda perlukan.',
        'Setelah tujuan jelas, susun anggaran secara proporsional. Aturan praktis yang sering dipakai perakit berpengalaman adalah mengalokasikan porsi terbesar pada kartu grafis (GPU) untuk PC gaming, biasanya sekitar 35–45% dari total budget, lalu prosesor (CPU) sekitar 15–20%, dan sisanya dibagi untuk motherboard, RAM, penyimpanan, power supply, casing, serta pendingin. Jangan pernah mengorbankan power supply demi GPU yang lebih mahal — ini kesalahan klasik yang berujung pada sistem tidak stabil.',
        'Catat juga rencana upgrade ke depan. Memilih motherboard dengan soket dan chipset yang masih akan didukung beberapa tahun ke depan, serta power supply dengan daya berlebih sedikit, akan menghemat banyak biaya saat Anda ingin meningkatkan performa di kemudian hari.',
      ],
    },
    {
      heading: 'Memilih Komponen yang Saling Seimbang',
      paragraphs: [
        'Inti dari PC yang baik bukanlah komponen termahal, melainkan komponen yang saling seimbang. CPU dan GPU adalah dua otak utama yang harus serasi. Untuk gaming pada resolusi 1080p, prosesor kelas menengah seperti seri Ryzen 5 atau Core i5 generasi terbaru sudah lebih dari cukup dan justru lebih bijak dipasangkan dengan GPU kelas menengah-atas.',
        'RAM 16GB masih menjadi titik nyaman untuk mayoritas game di 2026, namun 32GB kini semakin masuk akal jika Anda juga melakukan multitasking berat, streaming, atau membuka banyak tab sambil bermain. Pastikan menggunakan konfigurasi dual-channel (dua keping RAM) karena ini memberikan lonjakan performa nyata dibandingkan satu keping tunggal dengan kapasitas sama.',
        'Untuk penyimpanan, SSD NVMe kini wajib dijadikan drive utama tempat sistem operasi dan game terpasang. Kecepatan baca-tulisnya memangkas waktu booting dan loading secara dramatis. HDD masih relevan, tetapi hanya sebagai gudang penyimpanan data berukuran besar yang jarang diakses, bukan untuk menjalankan game.',
        'Motherboard sering diremehkan, padahal ia menentukan kompatibilitas, jumlah slot, kualitas VRM untuk menyuplai daya ke CPU, serta fitur konektivitas. Pilih motherboard dengan VRM yang memadai untuk prosesor Anda, terutama jika berencana melakukan overclock.',
      ],
    },
    {
      heading: 'Memahami dan Menghindari Bottleneck',
      paragraphs: [
        'Bottleneck terjadi ketika satu komponen membatasi performa komponen lain sehingga potensi penuh sistem tidak tercapai. Contoh paling umum adalah memasangkan GPU sangat kencang dengan CPU yang terlalu lemah: pada resolusi rendah, CPU tidak mampu mengirim instruksi cukup cepat sehingga GPU "menganggur" dan frame rate tidak setinggi yang seharusnya.',
        'Yang menarik, dampak bottleneck CPU justru mengecil seiring naiknya resolusi. Di 4K, beban perhitungan bergeser besar-besaran ke GPU, sehingga selisih antara CPU kelas menengah dan kelas atas menjadi tipis. Karena itu, pemain 4K bisa lebih leluasa mengalokasikan dana ke GPU, sementara pemain 1080p dengan monitor refresh rate tinggi perlu CPU yang lebih kuat agar frame rate tinggi benar-benar tercapai.',
        'Bottleneck tidak selalu buruk dan hampir mustahil dihilangkan total — selalu ada satu komponen yang menjadi pembatas. Tujuan kita bukan menghapusnya, melainkan memastikan pembatas tersebut sesuai dengan skenario penggunaan, sehingga setiap rupiah yang Anda belanjakan benar-benar terpakai. Manfaatkan kalkulator bottleneck hanya sebagai indikasi kasar, bukan kebenaran mutlak.',
      ],
    },
    {
      heading: 'Proses Instalasi Komponen Langkah demi Langkah',
      paragraphs: [
        'Siapkan area kerja yang luas, terang, dan bebas listrik statis. Sentuh permukaan logam yang tersambung ke ground atau gunakan gelang anti-statis sebelum memegang komponen sensitif. Buka semua komponen dan siapkan obeng magnetik kepala Phillips.',
        'Mulailah merakit di luar casing untuk komponen inti. Pasang CPU ke soket motherboard dengan sangat hati-hati — perhatikan tanda segitiga penanda orientasi, dan jangan pernah memaksa. Setelah itu pasang RAM ke slot yang dianjurkan manual motherboard (biasanya slot ke-2 dan ke-4) hingga terdengar bunyi klik di kedua sisi. Pasang juga SSD NVMe ke slot M.2.',
        'Selanjutnya pasang pendingin CPU. Jika cooler belum memiliki thermal paste bawaan, oleskan pasta secukupnya sebesar sebutir kacang di tengah CPU; tekanan heatsink akan meratakannya. Setelah motherboard siap, pasang ke dalam casing menggunakan standoff agar tidak terjadi korsleting, lalu lanjutkan memasang GPU pada slot PCIe teratas dan kencangkan ke bracket casing.',
        'Terakhir, pasang power supply dan hubungkan semua kabel daya: kabel 24-pin ke motherboard, kabel CPU 8-pin di sudut atas, serta kabel PCIe ke GPU. Periksa ulang setiap koneksi sebelum mencoba menyalakan sistem untuk pertama kali.',
      ],
    },
    {
      heading: 'Manajemen Kabel yang Rapi dan Fungsional',
      paragraphs: [
        'Manajemen kabel bukan sekadar soal estetika. Kabel yang tertata rapi meningkatkan aliran udara di dalam casing, menurunkan suhu komponen, dan membuat proses upgrade atau perbaikan di masa depan jauh lebih mudah. Casing modern umumnya menyediakan ruang di balik panel motherboard khusus untuk menyembunyikan kabel.',
        'Manfaatkan lubang grommet karet pada casing untuk menyalurkan kabel dari belakang ke depan tepat di dekat titik koneksinya. Gunakan cable tie atau velcro strap untuk mengikat kabel dalam kelompok yang rapi, dan sisakan sedikit kelonggaran agar tidak menarik konektor. Power supply modular sangat membantu di sini karena Anda hanya memasang kabel yang benar-benar dibutuhkan.',
        'Setelah semua kabel tertata, lakukan pemeriksaan akhir: pastikan tidak ada kabel yang menyentuh kipas, semua konektor terpasang penuh, dan tidak ada sekrup yang tertinggal di dalam casing. Nyalakan sistem, masuk ke BIOS untuk memastikan semua komponen terdeteksi, aktifkan profil XMP/EXPO agar RAM berjalan pada kecepatan penuh, lalu instal sistem operasi beserta driver terbaru.',
        'Selamat, PC gaming rakitan Anda kini siap digunakan. Rakitan pertama mungkin terasa menegangkan, tetapi setiap perakit andal pun pernah memulai dari titik yang sama. Nikmati hasil kerja Anda, dan jangan ragu bereksperimen dengan upgrade berikutnya.',
      ],
    },
  ],
}

// ──────────────────────────────────────────────
// ARTIKEL LAIN (grid) — masing-masing punya konten sendiri
// ──────────────────────────────────────────────
const articles = [
  {
    id: 1,
    emoji: '🖥️',
    category: 'Tutorial',
    title: 'Cara Merakit PC Gaming untuk Pemula',
    excerpt:
      'Panduan step-by-step merakit PC gaming dari awal hingga selesai. Cocok untuk pemula yang belum pernah merakit PC sebelumnya.',
    date: '15 November 2025',
    readTime: '8 menit baca',
    content: [
      {
        heading: 'Persiapan Awal',
        paragraphs: [
          'Merakit PC pertama kali memang terasa menakutkan, tetapi sebenarnya prosesnya sangat logis dan dapat dipelajari siapa saja. Siapkan ruang kerja yang bersih, alas anti-statis, dan obeng kepala Phillips sebelum mulai.',
          'Pastikan semua komponen sudah lengkap dan kompatibel satu sama lain — terutama soket CPU dengan motherboard, serta jenis RAM yang didukung.',
        ],
      },
      {
        heading: 'Urutan Pemasangan',
        paragraphs: [
          'Pasang CPU, RAM, dan SSD M.2 ke motherboard terlebih dahulu di luar casing agar lebih mudah. Setelah itu baru pindahkan ke dalam casing dan lanjutkan dengan power supply serta GPU.',
          'Selalu periksa ulang setiap koneksi sebelum menyalakan sistem untuk pertama kali. Kesabaran adalah kunci utama bagi pemula.',
        ],
      },
    ],
  },
  {
    id: 2,
    emoji: '🎮',
    category: 'Review',
    title: 'AMD Ryzen 9 7950X vs Intel Core i9-14900K',
    excerpt:
      'Perbandingan mendalam antara dua prosesor flagship terbaik. Mana yang lebih worth it untuk kebutuhan Anda?',
    date: '10 November 2025',
    readTime: '12 menit baca',
    content: [
      {
        heading: 'Performa Multi-Core vs Single-Core',
        paragraphs: [
          'Kedua prosesor ini berada di puncak performa konsumen. Ryzen 9 7950X unggul dalam efisiensi daya dan beban kerja multi-thread seperti rendering, sementara Core i9-14900K kerap memimpin tipis pada performa single-core yang relevan untuk gaming.',
        ],
      },
      {
        heading: 'Kesimpulan',
        paragraphs: [
          'Pilihan terbaik bergantung pada kebutuhan: kreator konten cenderung diuntungkan AMD, sedangkan gamer murni yang mengejar frame rate maksimal bisa mempertimbangkan Intel. Faktor harga, motherboard, dan pendingin juga wajib masuk hitungan.',
        ],
      },
    ],
  },
  {
    id: 3,
    emoji: '💡',
    category: 'Tips',
    title: '5 Tips Memilih GPU Terbaik dengan Budget Terbatas',
    excerpt:
      'Tidak perlu budget besar untuk performa gaming yang baik. Temukan tips cerdas memilih GPU yang sesuai kantong.',
    date: '5 November 2025',
    readTime: '6 menit baca',
    content: [
      {
        heading: 'Sesuaikan dengan Resolusi Monitor',
        paragraphs: [
          'Membeli GPU kelas atas untuk monitor 1080p adalah pemborosan. Cocokkan kelas GPU dengan resolusi dan refresh rate monitor Anda agar setiap rupiah terpakai maksimal.',
        ],
      },
      {
        heading: 'Pertimbangkan Pasar Bekas dan Generasi Sebelumnya',
        paragraphs: [
          'GPU generasi sebelumnya sering menawarkan rasio harga-performa yang jauh lebih baik. Periksa kondisi, garansi, dan riwayat pemakaian sebelum membeli unit bekas.',
        ],
      },
    ],
  },
  {
    id: 4,
    emoji: '❄️',
    category: 'Guide',
    title: 'Panduan Sistem Pendingin PC yang Optimal',
    excerpt:
      'Panas berlebih bisa merusak komponen PC Anda. Pelajari cara memilih dan mengkonfigurasi sistem pendingin yang tepat.',
    date: '1 November 2025',
    readTime: '10 menit baca',
    content: [
      {
        heading: 'Air Cooler vs Liquid Cooler',
        paragraphs: [
          'Air cooler andal, terjangkau, dan minim perawatan. Liquid cooler (AIO) menawarkan performa pendinginan lebih tinggi dan estetika bersih, tetapi dengan harga lebih mahal dan sedikit risiko kebocoran jangka panjang.',
        ],
      },
      {
        heading: 'Konfigurasi Airflow',
        paragraphs: [
          'Atur kipas intake di depan dan exhaust di belakang serta atas untuk menciptakan aliran udara terarah. Tekanan udara positif membantu mengurangi penumpukan debu di dalam casing.',
        ],
      },
    ],
  },
  {
    id: 5,
    emoji: '💾',
    category: 'Tips',
    title: 'SSD vs HDD: Mana yang Tepat untuk Anda?',
    excerpt:
      'Perbedaan kecepatan, harga, dan ketahanan antara SSD dan HDD — panduan memilih penyimpanan terbaik sesuai kebutuhan.',
    date: '20 Oktober 2025',
    readTime: '7 menit baca',
    content: [
      {
        heading: 'Kecepatan dan Performa',
        paragraphs: [
          'SSD NVMe modern mampu mencapai kecepatan baca hingga 7.000 MB/s, berbanding jauh dengan HDD yang rata-rata hanya 100–200 MB/s. Perbedaan ini terasa nyata saat booting OS, membuka aplikasi besar, dan loading game.',
          'Untuk drive utama sistem operasi dan game aktif, SSD bukan lagi kemewahan — melainkan keharusan di tahun 2025.',
        ],
      },
      {
        heading: 'Kapasitas dan Harga',
        paragraphs: [
          'HDD masih unggul soal biaya per gigabyte, menjadikannya pilihan ideal untuk penyimpanan arsip, backup, dan file berukuran besar yang tidak perlu diakses cepat. Kombinasi SSD sebagai drive utama dan HDD sebagai penyimpanan sekunder adalah solusi paling cost-effective.',
        ],
      },
    ],
  },
  {
    id: 6,
    emoji: '🔋',
    category: 'Guide',
    title: 'Cara Memilih Power Supply yang Tepat',
    excerpt:
      'PSU adalah jantung PC Anda. Kesalahan memilih watt dan sertifikasi bisa berujung pada kerusakan seluruh sistem.',
    date: '12 Oktober 2025',
    readTime: '9 menit baca',
    content: [
      {
        heading: 'Menghitung Kebutuhan Daya',
        paragraphs: [
          'Gunakan kalkulator PSU online untuk menjumlahkan konsumsi daya semua komponen, lalu tambahkan headroom 20–30%. Jika total sistem Anda 400W, PSU 550W sudah cukup nyaman dan memberi ruang untuk upgrade.',
          'Hindari membeli PSU jauh melebihi kebutuhan — PSU 1000W pada sistem 300W justru bekerja kurang efisien di beban rendah.',
        ],
      },
      {
        heading: 'Sertifikasi 80 Plus',
        paragraphs: [
          'Sertifikasi 80 Plus menjamin PSU mengonversi minimal 80% daya AC menjadi DC yang digunakan komponen. Pilih minimal 80 Plus Bronze untuk PC gaming; Gold atau Platinum jika ingin efisiensi terbaik dan tagihan listrik lebih hemat jangka panjang.',
        ],
      },
    ],
  },
  {
    id: 7,
    emoji: '🖱️',
    category: 'Review',
    title: 'Motherboard B650 vs X670: Mana yang Lebih Worth It?',
    excerpt:
      'Panduan memilih motherboard AMD platform AM5 — perbedaan fitur, harga, dan target pengguna B650 versus X670.',
    date: '5 Oktober 2025',
    readTime: '11 menit baca',
    content: [
      {
        heading: 'Perbedaan Fitur Utama',
        paragraphs: [
          'B650 dirancang untuk pengguna mainstream dengan dukungan PCIe 5.0 pada slot M.2, sementara X670 menambahkan PCIe 5.0 pada slot GPU dan lebih banyak lane untuk konektivitas. Untuk mayoritas pengguna, B650 sudah lebih dari cukup.',
        ],
      },
      {
        heading: 'Nilai Uang',
        paragraphs: [
          'Selisih harga B650 dan X670 cukup signifikan. Jika tidak berencana menggunakan GPU PCIe 5.0 atau membutuhkan banyak perangkat NVMe berkecepatan tinggi secara bersamaan, anggaran lebih baik dialihkan ke CPU atau RAM yang lebih kencang.',
        ],
      },
    ],
  },
  {
    id: 8,
    emoji: '🧠',
    category: 'Tutorial',
    title: 'Cara Overclock RAM dengan Aman Menggunakan XMP/EXPO',
    excerpt:
      'Aktifkan profil XMP atau EXPO di BIOS untuk mendapatkan kecepatan RAM penuh tanpa risiko — panduan lengkap untuk pemula.',
    date: '28 September 2025',
    readTime: '5 menit baca',
    content: [
      {
        heading: 'Apa Itu XMP dan EXPO?',
        paragraphs: [
          'XMP (Intel Extreme Memory Profile) dan EXPO (AMD Extended Profiles for Overclocking) adalah profil preset yang disimpan di chip RAM Anda. Mengaktifkannya di BIOS memungkinkan RAM berjalan pada kecepatan yang tertera di kotak — misalnya DDR5-6000 — bukan hanya kecepatan standar JEDEC yang lebih lambat.',
        ],
      },
      {
        heading: 'Cara Mengaktifkan',
        paragraphs: [
          'Masuk BIOS saat booting (biasanya tekan Del atau F2), cari menu AI Tweaker, Extreme Tweaker, atau OC. Temukan opsi XMP/EXPO, pilih profil yang tersedia, simpan dan restart. Sistem akan otomatis berjalan pada kecepatan RAM yang seharusnya — tanpa risiko sama sekali selama RAM kompatibel dengan motherboard.',
        ],
      },
    ],
  },
  {
    id: 9,
    emoji: '🌐',
    category: 'Tips',
    title: 'Monitor Gaming: Refresh Rate, Panel, dan Resolusi',
    excerpt:
      'Panduan lengkap memilih monitor gaming — perbedaan 60Hz vs 144Hz vs 240Hz, IPS vs VA vs TN, dan 1080p vs 1440p vs 4K.',
    date: '20 September 2025',
    readTime: '8 menit baca',
    content: [
      {
        heading: 'Refresh Rate: Semakin Tinggi Semakin Mulus',
        paragraphs: [
          '144Hz adalah titik masuk yang sangat direkomendasikan untuk gaming kompetitif. Perpindahan dari 60Hz ke 144Hz jauh lebih terasa dibandingkan dari 144Hz ke 240Hz. Pastikan GPU Anda mampu menghasilkan frame rate yang cukup sebelum berinvestasi pada monitor refresh rate sangat tinggi.',
        ],
      },
      {
        heading: 'Jenis Panel',
        paragraphs: [
          'IPS menawarkan warna akurat dan sudut pandang lebar — terbaik untuk konten kreator dan gaming kasual. VA memberikan kontras jauh lebih tinggi, ideal untuk ruangan gelap. TN tercepat dalam respons namun warna kurang akurat. Panel OLED dan QD-OLED kini hadir sebagai opsi premium dengan kualitas gambar terbaik di kelasnya.',
        ],
      },
    ],
  },
  {
    id: 10,
    emoji: '🔌',
    category: 'Guide',
    title: 'Cara Memilih Motherboard yang Tepat untuk Build Anda',
    excerpt:
      'Motherboard adalah tulang punggung PC Anda. Panduan ini membantu Anda memilih chipset, form factor, dan fitur yang sesuai dengan kebutuhan dan budget.',
    date: '15 September 2025',
    readTime: '9 menit baca',
    content: [
      {
        heading: 'Memahami Chipset dan Form Factor',
        paragraphs: [
          'Chipset menentukan fitur yang tersedia: jumlah lane PCIe, port USB, dan kemampuan overclocking. Untuk platform AMD AM5, pilih B650 untuk mainstream atau X670E untuk enthusiast. Platform Intel LGA1700 menawarkan B760 hingga Z790.',
          'Form factor ATX adalah standar umum dengan slot terbanyak. Micro-ATX cocok untuk build kompak, sementara Mini-ITX ideal untuk sistem ultra-kecil meski dengan kompromi slot ekspansi.',
        ],
      },
      {
        heading: 'Fitur yang Wajib Diperhatikan',
        paragraphs: [
          'Periksa jumlah slot RAM (minimal 4 untuk upgrade masa depan), slot M.2 untuk SSD NVMe, kualitas VRM untuk kestabilan daya CPU, serta konektivitas I/O seperti USB-C, audio, dan jaringan.',
        ],
      },
    ],
  },
  {
    id: 11,
    emoji: '⚡',
    category: 'Tips',
    title: 'Mengoptimalkan Performa PC dengan Setting BIOS',
    excerpt:
      'BIOS menyimpan banyak pengaturan tersembunyi yang bisa meningkatkan performa PC Anda secara signifikan tanpa biaya tambahan.',
    date: '10 September 2025',
    readTime: '7 menit baca',
    content: [
      {
        heading: 'Pengaturan Penting di BIOS',
        paragraphs: [
          'Aktifkan XMP/EXPO untuk RAM berjalan pada kecepatan penuh. Pastikan Secure Boot aktif untuk keamanan sistem. Atur urutan boot drive dengan benar agar sistem booting dari SSD, bukan HDD.',
        ],
      },
      {
        heading: 'Overclock CPU dengan Aman',
        paragraphs: [
          'Gunakan fitur Precision Boost Overdrive (PBO) untuk AMD atau Intel Turbo Boost Max untuk meningkatkan frekuensi secara otomatis dalam batas aman. Pantau suhu menggunakan software monitoring setelah perubahan dilakukan.',
        ],
      },
    ],
  },
  {
    id: 12,
    emoji: '🎯',
    category: 'Review',
    title: 'RTX 4070 vs RX 7800 XT: Duel GPU Kelas Menengah 2025',
    excerpt:
      'Perbandingan mendalam dua GPU kelas menengah terpopuler — performa gaming, efisiensi daya, fitur eksklusif, dan nilai uang terbaik.',
    date: '3 September 2025',
    readTime: '13 menit baca',
    content: [
      {
        heading: 'Performa Gaming 1080p dan 1440p',
        paragraphs: [
          'Pada resolusi 1080p, keduanya mampu menghasilkan frame rate sangat tinggi di game modern. RTX 4070 unggul tipis berkat DLSS 3 dengan Frame Generation yang secara efektif melipatgandakan frame rate di game yang mendukungnya.',
          'Di 1440p, RX 7800 XT sering mengejar bahkan menyamai RTX 4070 dalam rasterization murni, menjadikannya pilihan menarik bagi yang tidak terlalu membutuhkan fitur NVIDIA.',
        ],
      },
      {
        heading: 'Nilai Uang dan Ekosistem',
        paragraphs: [
          'RX 7800 XT umumnya ditawarkan dengan harga lebih rendah untuk performa setara, tetapi RTX 4070 menawarkan DLSS 3, NVIDIA Broadcast, dan dukungan ray tracing yang lebih matang. Pilihan akhir bergantung pada game yang Anda mainkan dan fitur apa yang paling Anda hargai.',
        ],
      },
    ],
  },
  {
    id: 13,
    emoji: '🏗️',
    category: 'Tutorial',
    title: 'Cara Instalasi Windows 11 dari USB Bootable',
    excerpt:
      'Panduan lengkap membuat USB bootable dan menginstal Windows 11 yang bersih pada PC rakitan baru Anda — dari awal hingga desktop siap digunakan.',
    date: '28 Agustus 2025',
    readTime: '6 menit baca',
    content: [
      {
        heading: 'Membuat USB Bootable',
        paragraphs: [
          'Unduh Windows 11 ISO dari situs resmi Microsoft, lalu gunakan Rufus (gratis) untuk membuat USB bootable. Pilih skema partisi GPT dan target sistem UEFI agar kompatibel dengan hardware modern.',
        ],
      },
      {
        heading: 'Proses Instalasi',
        paragraphs: [
          'Boot dari USB, pilih "Custom Install", format partisi target, dan biarkan proses instalasi berjalan. Setelah selesai, instal driver chipset motherboard terlebih dahulu sebelum driver komponen lain untuk memastikan stabilitas sistem.',
        ],
      },
    ],
  },
  {
    id: 14,
    emoji: '🌡️',
    category: 'Tips',
    title: 'Cara Mengatasi PC yang Overheat dan Throttling',
    excerpt:
      'PC yang terlalu panas akan menurunkan performa sendiri demi keselamatan komponen. Pelajari penyebab dan cara mengatasinya secara efektif.',
    date: '20 Agustus 2025',
    readTime: '8 menit baca',
    content: [
      {
        heading: 'Penyebab Umum Overheating',
        paragraphs: [
          'Thermal paste yang kering atau tidak merata, kipas yang kotor berdebu, airflow casing yang buruk, dan cooler yang tidak cukup kuat untuk TDP prosesor adalah penyebab paling sering dijumpai.',
        ],
      },
      {
        heading: 'Langkah Penanganan',
        paragraphs: [
          'Bersihkan debu di semua kipas dan heatsink menggunakan udara bertekanan. Ganti thermal paste setiap 2–3 tahun atau jika suhu idle CPU melebihi 50°C. Tambahkan kipas casing jika perlu dan pastikan kabel tidak menghalangi aliran udara.',
        ],
      },
    ],
  },
  {
    id: 15,
    emoji: '🖨️',
    category: 'Guide',
    title: 'Panduan Memilih Monitor untuk Desainer dan Kreator Konten',
    excerpt:
      'Kreator konten membutuhkan monitor dengan akurasi warna tinggi. Pelajari parameter penting seperti color gamut, Delta E, dan bit depth sebelum membeli.',
    date: '12 Agustus 2025',
    readTime: '10 menit baca',
    content: [
      {
        heading: 'Akurasi Warna dan Color Gamut',
        paragraphs: [
          'Untuk desain grafis dan video editing profesional, cari monitor dengan cakupan sRGB ≥ 99% dan Delta E < 2 (semakin kecil semakin akurat). Panel IPS atau OLED adalah pilihan terbaik karena warna konsisten dari berbagai sudut pandang.',
        ],
      },
      {
        heading: 'Resolusi dan Ukuran',
        paragraphs: [
          'Resolusi 2560×1440 (QHD) pada layar 27 inci memberikan ketajaman sangat baik untuk editing detail. Resolusi 4K ideal untuk grading video resolusi tinggi, tetapi membutuhkan GPU yang lebih kuat.',
        ],
      },
    ],
  },
  {
    id: 16,
    emoji: '🔧',
    category: 'Tutorial',
    title: 'Cara Membersihkan dan Merawat PC Agar Awet',
    excerpt:
      'PC yang terawat bersih bekerja lebih dingin, lebih tenang, dan lebih panjang umurnya. Panduan perawatan rutin yang mudah dilakukan sendiri di rumah.',
    date: '5 Agustus 2025',
    readTime: '5 menit baca',
    content: [
      {
        heading: 'Jadwal Perawatan yang Dianjurkan',
        paragraphs: [
          'Bersihkan filter debu casing setiap bulan dan lakukan pembersihan menyeluruh bagian dalam (kipas, heatsink, slot RAM, dan PCIe) setiap 6–12 bulan tergantung lingkungan ruangan.',
        ],
      },
      {
        heading: 'Tips Merawat Komponen',
        paragraphs: [
          'Gunakan udara bertekanan untuk membersihkan debu; hindari penyedot debu yang menghasilkan listrik statis. Pastikan PC berdiri di permukaan yang memiliki sirkulasi udara baik, jauh dari permukaan karpet yang menahan debu.',
        ],
      },
    ],
  },
  {
    id: 17,
    emoji: '📡',
    category: 'Tips',
    title: 'WiFi vs Ethernet: Pilihan Koneksi Terbaik untuk Gaming',
    excerpt:
      'Stabilitas koneksi jaringan sangat berpengaruh pada pengalaman gaming online. Ketahui kapan Ethernet wajib digunakan dan kapan WiFi sudah cukup.',
    date: '28 Juli 2025',
    readTime: '6 menit baca',
    content: [
      {
        heading: 'Keunggulan Ethernet',
        paragraphs: [
          'Ethernet menawarkan latensi lebih rendah dan koneksi yang jauh lebih stabil dibanding WiFi, terutama saat banyak perangkat menggunakan jaringan yang sama. Untuk gaming kompetitif, Ethernet adalah pilihan mutlak.',
        ],
      },
      {
        heading: 'Kapan WiFi Sudah Cukup?',
        paragraphs: [
          'WiFi 6 (802.11ax) modern sudah sangat cepat dan stabil untuk gaming kasual jika router ditempatkan dekat PC dan tidak terlalu banyak gangguan sinyal. Namun untuk turnamen atau sesi ranked yang serius, tetap utamakan Ethernet.',
        ],
      },
    ],
  },
  {
    id: 18,
    emoji: '🎵',
    category: 'Guide',
    title: 'Panduan Memilih Headset dan Speaker untuk PC Gaming',
    excerpt:
      'Audio berkualitas meningkatkan imersi gaming dan membantu mendeteksi arah suara musuh. Panduan memilih headset dan speaker gaming yang tepat sesuai budget.',
    date: '20 Juli 2025',
    readTime: '7 menit baca',
    content: [
      {
        heading: 'Headset vs Speaker: Situasi Penggunaan',
        paragraphs: [
          'Headset dengan surround sound virtual (misalnya DTS Headphone:X atau Dolby Atmos) sangat efektif untuk game kompetitif di mana posisi suara musuh kritis. Speaker lebih cocok untuk pengalaman sinematik dan gaming santai.',
        ],
      },
      {
        heading: 'Fitur yang Perlu Dipertimbangkan',
        paragraphs: [
          'Untuk headset: driver berukuran besar (50mm ke atas) biasanya menghasilkan bass lebih baik; mikrofon dengan noise cancellation penting untuk komunikasi tim. Untuk speaker: sepasang speaker 2.0 stereo berkualitas sering mengalahkan sistem 5.1 murah dalam kejernihan suara.',
        ],
      },
    ],
  },
]

// ── Computed pagination ───────────────────────────
const totalPages = computed(() => Math.ceil(articles.length / ARTICLES_PER_PAGE))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * ARTICLES_PER_PAGE
  return articles.slice(start, start + ARTICLES_PER_PAGE)
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}
</script>