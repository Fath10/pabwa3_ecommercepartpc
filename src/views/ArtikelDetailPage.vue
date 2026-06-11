<template>
  <main class="detail-page">
    <div v-if="article" class="detail-shell">
      <RouterLink to="/artikel" class="back-link">
        <span>←</span> Kembali ke Artikel
      </RouterLink>

      <header>
        <span class="category">{{ article.category }}</span>
        <h1>{{ article.title }}</h1>
        <p>{{ article.description }}</p>
        <div class="meta">
          <span>{{ article.date }}</span>
          <span>•</span>
          <span>Tim e-BuildPC</span>
        </div>
      </header>

      <img class="hero-image" :src="article.image" :alt="article.title" />

      <article>
        <p>{{ article.description }}</p>
        <h2>Hal utama yang perlu diperhatikan</h2>
        <p>
          Memilih, merakit, dan merawat PC membutuhkan pertimbangan yang matang
          agar setiap komponen bekerja optimal. Mulailah dari kebutuhan utama,
          tentukan anggaran realistis, lalu periksa kompatibilitas sebelum
          membeli.
        </p>
        <h2>Checklist sebelum mengambil keputusan</h2>
        <ul>
          <li>Tentukan kebutuhan penggunaan dan target performa.</li>
          <li>Bandingkan spesifikasi, harga, garansi, dan ulasan pengguna.</li>
          <li>Pastikan seluruh komponen kompatibel dan memiliki ruang upgrade.</li>
          <li>Gunakan komponen berkualitas untuk menjaga stabilitas jangka panjang.</li>
        </ul>
      </article>

      <section class="related-section">
        <h2>Artikel Terkait</h2>

        <div class="related-grid">
          <RouterLink
            v-for="item in relatedArticles"
            :key="item.id"
            :to="`/artikel/${item.id}`"
            class="related-card"
          >
            <div class="related-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <span class="related-category">{{ item.category }}</span>
            <h3>{{ item.title }}</h3>
            <div class="related-date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="5.5" width="16" height="14" rx="2" stroke-width="1.8" />
                <path d="M8 3v5M16 3v5M4 10h16" stroke-linecap="round" stroke-width="1.8" />
              </svg>
              {{ item.date }}
            </div>
          </RouterLink>
        </div>
      </section>
    </div>

    <div v-else class="not-found">
      <h1>Artikel tidak ditemukan</h1>
      <RouterLink to="/artikel">Lihat semua artikel</RouterLink>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const articles = [
  ['PANDUAN RAKIT PC', 'Panduan Memilih Komponen PC Sesuai Kebutuhan dan Budget', '10 June 2026', 'Sebelum membeli komponen PC, penting untuk memahami kebutuhan utama seperti gaming, desain, editing, atau pekerjaan harian. Artikel ini membahas cara menentukan prosesor, VGA, RAM, storage, motherboard, dan PSU agar sesuai dengan anggaran tanpa salah pilih.'],
  ['REKOMENDASI BUILD', 'Rekomendasi Rakitan PC untuk Mahasiswa, Gaming, dan Produktivitas', '08 June 2026', 'Setiap pengguna memiliki kebutuhan yang berbeda. Artikel ini memberikan gambaran rakitan PC untuk mahasiswa, gamer pemula, content creator, hingga pengguna profesional yang membutuhkan performa stabil untuk multitasking.'],
  ['TIPS KOMPONEN', 'Perbedaan SSD SATA dan NVMe: Mana yang Lebih Cocok untuk PC Kamu?', '07 June 2026', 'SSD menjadi salah satu komponen penting untuk mempercepat proses booting dan membuka aplikasi. Artikel ini menjelaskan perbedaan SSD SATA dan NVMe dari sisi kecepatan, harga, kompatibilitas, dan kebutuhan penggunaan.'],
  ['TIPS KOMPONEN', 'Cara Memilih Power Supply yang Aman untuk Rakitan PC', '05 June 2026', 'Power supply bukan hanya soal besar watt, tetapi juga kualitas, efisiensi, dan keamanan komponen. Artikel ini membahas cara memilih PSU yang tepat agar PC lebih stabil dan tidak berisiko merusak hardware.'],
  ['UPGRADE PC', 'Kapan Waktu yang Tepat untuk Upgrade RAM, SSD, atau VGA?', '03 June 2026', 'PC yang mulai terasa lambat belum tentu harus diganti sepenuhnya. Artikel ini membantu pengguna mengenali tanda-tanda kapan harus upgrade RAM, SSD, atau VGA sesuai masalah performa yang dialami.'],
  ['PERAWATAN PC', 'Tips Merawat PC Gaming agar Tetap Dingin dan Awet', '01 June 2026', 'Debu, suhu tinggi, dan airflow buruk dapat menurunkan performa PC. Artikel ini membahas cara membersihkan PC, mengatur airflow casing, mengecek suhu komponen, dan menjaga performa tetap stabil.'],
  ['PANDUAN BELANJA', 'Hal yang Perlu Dicek Sebelum Membeli Komponen PC Secara Online', '30 May 2026', 'Membeli komponen PC online membutuhkan ketelitian agar tidak salah memilih barang. Artikel ini menjelaskan cara mengecek kompatibilitas, garansi, spesifikasi produk, reputasi toko, dan kelengkapan paket pembelian.'],
  ['TIPS KOMPONEN', 'Mengenal Motherboard: Komponen Utama yang Menentukan Kompatibilitas PC', '28 May 2026', 'Motherboard berperan sebagai pusat penghubung seluruh komponen PC. Artikel ini membahas chipset, socket prosesor, slot RAM, slot SSD, ukuran motherboard, dan hal penting lain sebelum membeli motherboard.'],
  ['TEKNOLOGI PC', 'Kenapa Sistem Pendingin Penting untuk Performa PC?', '25 May 2026', 'Suhu komponen yang terlalu tinggi dapat membuat performa PC menurun. Artikel ini menjelaskan fungsi heatsink, fan casing, thermal paste, air cooler, liquid cooler, serta pengaruh suhu terhadap performa komputer.'],
].map(([category, title, date, description], index) => ({
  id: index + 1,
  category,
  title,
  date,
  description,
  image: `/articles/article-${index + 1}.jpg`,
}))

const index = computed(() => articles.findIndex((item) => item.id === Number(route.params.id)))
const article = computed(() => articles[index.value] || null)
const relatedArticles = computed(() => {
  if (!article.value) return []

  const sameCategory = articles.filter(
    (item) => item.id !== article.value.id && item.category === article.value.category,
  )
  const otherArticles = articles.filter(
    (item) => item.id !== article.value.id && item.category !== article.value.category,
  )

  return [...sameCategory, ...otherArticles].slice(0, 3)
})
</script>

<style scoped>
.detail-page { min-height: 100vh; padding: 120px 24px 100px; background: #070b12; color: #e7edf7; }
.detail-shell { width: min(900px, 100%); margin: 0 auto; }
.back-link { display: inline-flex; gap: 8px; margin-bottom: 48px; color: #718096; font-size: .78rem; font-weight: 700; transition: .2s; }
.back-link:hover { color: #168cff; transform: translateX(-3px); }
header { margin-bottom: 36px; }
.category { display: inline-block; margin-bottom: 18px; color: #ef3340; font-size: .62rem; font-weight: 800; letter-spacing: .08em; }
h1 { margin: 0 0 18px; color: #f4f7fb; font-size: clamp(2.2rem, 5vw, 4.2rem); font-weight: 800; line-height: 1.08; letter-spacing: -.055em; }
header p { max-width: 760px; margin: 0 0 20px; color: #8290a3; font-size: .95rem; line-height: 1.75; }
.meta { display: flex; flex-wrap: wrap; gap: 10px; color: #718096; font-size: .68rem; font-weight: 600; }
.hero-image { width: 100%; max-height: 500px; margin-bottom: 48px; border: 1px solid rgba(255, 255, 255, .075); border-radius: 22px; object-fit: cover; box-shadow: 0 24px 70px rgba(0, 0, 0, .38); }
article { width: 100%; margin: 0; }
article p, article li { color: #8290a3; font-size: .88rem; line-height: 1.9; }
article h2 { margin: 42px 0 14px; color: #eef3f9; font-size: 1.45rem; font-weight: 800; letter-spacing: -.03em; }
article ul { padding-left: 20px; }
.related-section {
  margin-top: 84px;
  padding-top: 44px;
  border-top: 1px solid rgba(255, 255, 255, .08);
}
.related-section > h2 {
  margin: 0 0 32px;
  color: #f4f7fb;
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -.035em;
}
.related-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.related-card { min-width: 0; }
.related-image {
  height: 168px;
  margin-bottom: 17px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .07);
  border-radius: 12px;
  background: #0d131d;
}
.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .5s ease;
}
.related-card:hover .related-image img { transform: scale(1.055); }
.related-category {
  display: block;
  margin-bottom: 10px;
  color: #ef3340;
  font-size: .58rem;
  font-weight: 800;
  letter-spacing: .07em;
}
.related-card h3 {
  display: -webkit-box;
  min-height: 48px;
  margin: 0 0 14px;
  overflow: hidden;
  color: #edf2f8;
  font-size: .94rem;
  font-weight: 800;
  line-height: 1.5;
  letter-spacing: -.02em;
  transition: color .2s ease;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.related-card:hover h3 { color: #48adff; }
.related-date {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #718096;
  font-size: .63rem;
  font-weight: 600;
}
.related-date svg { width: 14px; color: #8290a3; }
.not-found { display: grid; min-height: 60vh; place-content: center; text-align: center; }
.not-found h1 { color: #f4f7fb; }
.not-found a { margin-top: 20px; color: #168cff; font-weight: 700; }
@media (max-width: 760px) {
  .related-grid { grid-template-columns: 1fr; gap: 32px; }
  .related-image { height: 220px; }
}
@media (max-width: 600px) { .detail-page { padding: 100px 16px 70px; } .back-link { margin-bottom: 32px; } .hero-image { border-radius: 14px; } }
</style>
