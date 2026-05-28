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
          class="relative rounded-3xl overflow-hidden mb-12 group cursor-pointer"
          @click="openArticle(featuredArticle)"
        >
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
          <img :src="featuredArticle.image" alt="Featured" class="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute bottom-0 left-0 right-0 p-8 z-20">
            <span class="inline-block px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold text-white mb-3">🔥 Artikel Utama</span>
            <h2 class="text-2xl font-black text-white mb-2">{{ featuredArticle.title }}</h2>
            <p class="text-gray-300 text-sm mb-4 line-clamp-2">{{ featuredArticle.excerpt }}</p>
            <button
              type="button"
              id="featured-read-more"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-sm transition-all duration-200 hover:gap-3 hover:shadow-lg hover:shadow-white/10"
              @click.stop="openArticle(featuredArticle)"
            >
              Baca Selengkapnya
              <span class="transition-transform">→</span>
            </button>
          </div>
        </div>

        <!-- Article Grid -->
        <div class="grid md:grid-cols-2 gap-6">
          <article
            v-for="article in articles"
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
import { ref, nextTick } from 'vue'

// State sederhana di dalam komponen: null = mode daftar, objek = mode detail.
const activeArticle = ref(null)

function openArticle(article) {
  activeArticle.value = article
  // Scroll ke atas saat membuka detail.
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
  image: '/hero_banner.png',
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
    date: '15 November 2024',
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
    date: '10 November 2024',
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
    date: '5 November 2024',
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
    date: '1 November 2024',
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
]
</script>