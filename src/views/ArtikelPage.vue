<template>
  <main class="article-page">
    <section class="article-hero">
      <div class="hero-overlay"></div>
      <div class="hero-glow"></div>

      <div class="hero-content">
        <h1>PC Guide <span>& Artikel</span></h1>
        <p>
          Temukan panduan memilih komponen PC, tips merakit komputer,
          rekomendasi build sesuai kebutuhan, serta informasi seputar upgrade
          dan perawatan perangkat agar performa PC tetap optimal.
        </p>
      </div>

    </section>

    <section class="article-content">
      <div class="content-shell">
        <div class="filter-heading">
          <div>
            <span class="eyebrow">PC KNOWLEDGE</span>
            <h2>Artikel dan panduan terbaru</h2>
          </div>
          <p>{{ filteredArticles.length }} artikel ditemukan</p>
        </div>

        <div class="filter-panel">
          <div class="filter-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M7 12h10M10 18h4" stroke-linecap="round" stroke-width="2" />
            </svg>
            <div>
              <strong>Filter</strong>
              <span>Temukan topik yang kamu butuhkan</span>
            </div>
          </div>

          <div class="filter-controls">
            <label class="search-control">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="6.5" stroke-width="2" />
                <path d="m16 16 4 4" stroke-linecap="round" stroke-width="2" />
              </svg>
              <input v-model="searchQuery" type="search" placeholder="Search article" />
            </label>

            <label class="select-control">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" stroke-linejoin="round" stroke-width="1.8" />
              </svg>
              <select v-model="selectedCategory">
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m8 10 4 4 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </label>
          </div>
        </div>

        <div v-if="filteredArticles.length" class="article-grid">
          <RouterLink
            v-for="article in filteredArticles"
            :key="article.id"
            :to="`/artikel/${article.id}`"
            class="article-card"
          >
            <div class="card-image">
              <img :src="article.image" :alt="article.imageAlt" />
              <div class="read-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14m-5-5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </div>
            </div>

            <div class="card-body">
              <span class="card-category">{{ article.category }}</span>
              <h3>{{ article.title }}</h3>
              <p>{{ article.description }}</p>
              <div class="card-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="4" y="5.5" width="16" height="14" rx="2" stroke-width="1.8" />
                    <path d="M8 3v5M16 3v5M4 10h16" stroke-linecap="round" stroke-width="1.8" />
                  </svg>
                  {{ article.date }}
                </span>
              </div>
            </div>
          </RouterLink>
        </div>

        <div v-else class="empty-state">
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="6.5" stroke-width="1.8" />
              <path d="m16 16 4 4" stroke-linecap="round" stroke-width="1.8" />
            </svg>
          </div>
          <h3>Artikel belum ditemukan</h3>
          <p>Coba gunakan kata kunci lain atau pilih semua artikel.</p>
          <button @click="resetFilters">Reset filter</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('Semua Artikel')

const categories = [
  'Semua Artikel',
  'Panduan Rakit PC',
  'Rekomendasi Build',
  'Tips Komponen',
  'Perawatan PC',
  'Upgrade PC',
  'Teknologi PC',
  'Panduan Belanja',
]

const articles = [
  {
    id: 1,
    category: 'PANDUAN RAKIT PC',
    title: 'Panduan Memilih Komponen PC Sesuai Kebutuhan dan Budget',
    date: '10 June 2026',
    description: 'Sebelum membeli komponen PC, penting untuk memahami kebutuhan utama seperti gaming, desain, editing, atau pekerjaan harian. Artikel ini membahas cara menentukan prosesor, VGA, RAM, storage, motherboard, dan PSU agar sesuai dengan anggaran tanpa salah pilih.',
    image: '/articles/article-1.jpg',
    imageAlt: 'Komponen PC seperti motherboard, RAM, SSD, VGA, dan prosesor di atas meja',
  },
  {
    id: 2,
    category: 'REKOMENDASI BUILD',
    title: 'Rekomendasi Rakitan PC untuk Mahasiswa, Gaming, dan Produktivitas',
    date: '08 June 2026',
    description: 'Setiap pengguna memiliki kebutuhan yang berbeda. Artikel ini memberikan gambaran rakitan PC untuk mahasiswa, gamer pemula, content creator, hingga pengguna profesional yang membutuhkan performa stabil untuk multitasking.',
    image: '/articles/article-2.jpg',
    imageAlt: 'Setup PC modern dengan monitor, keyboard, mouse, dan casing RGB minimalis',
  },
  {
    id: 3,
    category: 'TIPS KOMPONEN',
    title: 'Perbedaan SSD SATA dan NVMe: Mana yang Lebih Cocok untuk PC Kamu?',
    date: '07 June 2026',
    description: 'SSD menjadi salah satu komponen penting untuk mempercepat proses booting dan membuka aplikasi. Artikel ini menjelaskan perbedaan SSD SATA dan NVMe dari sisi kecepatan, harga, kompatibilitas, dan kebutuhan penggunaan.',
    image: '/articles/article-3.jpg',
    imageAlt: 'SSD NVMe dan SSD SATA berdampingan',
  },
  {
    id: 4,
    category: 'TIPS KOMPONEN',
    title: 'Cara Memilih Power Supply yang Aman untuk Rakitan PC',
    date: '05 June 2026',
    description: 'Power supply bukan hanya soal besar watt, tetapi juga kualitas, efisiensi, dan keamanan komponen. Artikel ini membahas cara memilih PSU yang tepat agar PC lebih stabil dan tidak berisiko merusak hardware.',
    image: '/articles/article-4.jpg',
    imageAlt: 'Power supply PC dengan kabel modular',
  },
  {
    id: 5,
    category: 'UPGRADE PC',
    title: 'Kapan Waktu yang Tepat untuk Upgrade RAM, SSD, atau VGA?',
    date: '03 June 2026',
    description: 'PC yang mulai terasa lambat belum tentu harus diganti sepenuhnya. Artikel ini membantu pengguna mengenali tanda-tanda kapan harus upgrade RAM, SSD, atau VGA sesuai masalah performa yang dialami.',
    image: '/articles/article-5.jpg',
    imageAlt: 'Seseorang sedang memasang RAM ke motherboard',
  },
  {
    id: 6,
    category: 'PERAWATAN PC',
    title: 'Tips Merawat PC Gaming agar Tetap Dingin dan Awet',
    date: '01 June 2026',
    description: 'Debu, suhu tinggi, dan airflow buruk dapat menurunkan performa PC. Artikel ini membahas cara membersihkan PC, mengatur airflow casing, mengecek suhu komponen, dan menjaga performa tetap stabil.',
    image: '/articles/article-6.jpg',
    imageAlt: 'Casing PC terbuka dengan fan RGB dan komponen internal',
  },
  {
    id: 7,
    category: 'PANDUAN BELANJA',
    title: 'Hal yang Perlu Dicek Sebelum Membeli Komponen PC Secara Online',
    date: '30 May 2026',
    description: 'Membeli komponen PC online membutuhkan ketelitian agar tidak salah memilih barang. Artikel ini menjelaskan cara mengecek kompatibilitas, garansi, spesifikasi produk, reputasi toko, dan kelengkapan paket pembelian.',
    image: '/articles/article-7.jpg',
    imageAlt: 'Tampilan checkout e-commerce dengan produk komponen PC',
  },
  {
    id: 8,
    category: 'TIPS KOMPONEN',
    title: 'Mengenal Motherboard: Komponen Utama yang Menentukan Kompatibilitas PC',
    date: '28 May 2026',
    description: 'Motherboard berperan sebagai pusat penghubung seluruh komponen PC. Artikel ini membahas chipset, socket prosesor, slot RAM, slot SSD, ukuran motherboard, dan hal penting lain sebelum membeli motherboard.',
    image: '/articles/article-8.jpg',
    imageAlt: 'Close-up motherboard modern',
  },
  {
    id: 9,
    category: 'TEKNOLOGI PC',
    title: 'Kenapa Sistem Pendingin Penting untuk Performa PC?',
    date: '25 May 2026',
    description: 'Suhu komponen yang terlalu tinggi dapat membuat performa PC menurun. Artikel ini menjelaskan fungsi heatsink, fan casing, thermal paste, air cooler, liquid cooler, serta pengaruh suhu terhadap performa komputer.',
    image: '/articles/article-9.jpg',
    imageAlt: 'CPU liquid cooler dan fan casing',
  },
]

const filteredArticles = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const category = selectedCategory.value.toUpperCase()

  return articles.filter((article) => {
    const matchesCategory =
      selectedCategory.value === 'Semua Artikel' || article.category === category
    const matchesQuery =
      !query ||
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)

    return matchesCategory && matchesQuery
  })
})

function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'Semua Artikel'
}
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background: #070b12;
  color: #e7edf7;
}

.article-hero {
  position: relative;
  min-height: 620px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: #07111f url('/artikel_hero.png') center 48% / cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(3, 9, 18, 0.95) 0%, rgba(4, 12, 24, 0.72) 52%, rgba(4, 12, 24, 0.36) 100%),
    linear-gradient(0deg, rgba(3, 9, 18, 0.82) 0%, transparent 55%);
}

.hero-glow {
  position: absolute;
  width: 540px;
  height: 540px;
  left: 24%;
  bottom: -430px;
  border-radius: 50%;
  background: #168cff;
  filter: blur(130px);
  opacity: 0.28;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: min(1240px, calc(100% - 48px));
  margin: 0 auto;
  padding: 160px 0 88px;
}

.hero-content h1 {
  max-width: 720px;
  margin: 0 0 20px;
  color: #fff;
  font-size: clamp(3.4rem, 6vw, 5.8rem);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.065em;
}

.hero-content h1 span { color: #48b7ff; }

.hero-content p {
  max-width: 710px;
  margin: 0;
  color: rgba(230, 240, 252, 0.7);
  font-size: 1rem;
  line-height: 1.8;
}

.article-content { padding: 74px 24px 110px; }
.content-shell { width: min(1240px, 100%); margin: 0 auto; }

.filter-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 26px;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #ef3340;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.filter-heading h2 {
  margin: 0;
  color: #f4f7fb;
  font-size: clamp(1.8rem, 3vw, 2.65rem);
  font-weight: 800;
  letter-spacing: -0.045em;
}

.filter-heading p { margin: 0; color: #718096; font-size: 0.78rem; font-weight: 600; }

.filter-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 38px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: #0d131d;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.18);
}

.filter-label { display: flex; align-items: center; gap: 12px; }
.filter-label > svg { width: 22px; color: #168cff; }
.filter-label strong { display: block; color: #e7edf7; font-size: 0.86rem; }
.filter-label span { display: block; margin-top: 2px; color: #66758a; font-size: 0.67rem; }
.filter-controls { display: flex; gap: 12px; }

.search-control, .select-control {
  position: relative;
  display: flex;
  align-items: center;
  height: 46px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  background: #080d15;
  color: #708096;
  transition: 0.2s ease;
}

.search-control:focus-within, .select-control:focus-within {
  border-color: #168cff;
  background: #0a111c;
  box-shadow: 0 0 0 4px rgba(22, 140, 255, 0.1);
}

.search-control > svg, .select-control > svg:not(.chevron) {
  width: 18px;
  margin-left: 14px;
  flex-shrink: 0;
}

.search-control input {
  width: 290px;
  height: 100%;
  padding: 0 48px 0 10px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #e8eef7;
  font-size: 0.78rem;
}

.search-control input::placeholder { color: #66758a; }

.select-control select {
  width: 210px;
  height: 100%;
  padding: 0 38px 0 10px;
  border: 0;
  outline: 0;
  appearance: none;
  background: transparent;
  color: #d6dfeb;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
}

.select-control option {
  background: #0d131d;
  color: #d6dfeb;
}

.select-control .chevron { position: absolute; right: 12px; width: 16px; pointer-events: none; }

.article-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.article-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 18px;
  background: #0d131d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.article-card:hover {
  transform: translateY(-7px);
  border-color: rgba(22, 140, 255, 0.35);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.38);
}

.card-image { position: relative; height: 220px; overflow: hidden; background: #07111f; }
.card-image::after {
  content: '';
  position: absolute;
  inset: 35% 0 0;
  background: linear-gradient(0deg, rgba(3, 10, 20, 0.52), transparent);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.article-card:hover .card-image img { transform: scale(1.055); }

.read-arrow {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 2;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: rgba(8, 17, 31, 0.52);
  color: #fff;
  opacity: 0;
  transform: translateX(-8px);
  transition: 0.25s ease;
  backdrop-filter: blur(8px);
}

.read-arrow svg { width: 17px; }
.article-card:hover .read-arrow { opacity: 1; transform: translateX(0); }

.card-body { padding: 22px 22px 20px; }

.card-category {
  display: block;
  margin-bottom: 11px;
  color: #168cff;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.card-body h3 {
  display: -webkit-box;
  min-height: 48px;
  margin: 0 0 12px;
  overflow: hidden;
  color: #f1f5fa;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.48;
  letter-spacing: -0.02em;
  transition: color 0.2s ease;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-card:hover h3 { color: #087fe5; }

.card-body > p {
  display: -webkit-box;
  min-height: 64px;
  margin: 0 0 20px;
  overflow: hidden;
  color: #8290a3;
  font-size: 0.72rem;
  line-height: 1.72;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
  color: #718096;
  font-size: 0.63rem;
  font-weight: 600;
}

.card-meta span { display: flex; align-items: center; gap: 6px; }
.card-meta svg { width: 13px; color: #168cff; }

.empty-state {
  display: grid;
  justify-items: center;
  padding: 80px 24px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  background: #0d131d;
  text-align: center;
}

.empty-state div { display: grid; width: 54px; height: 54px; place-items: center; border-radius: 50%; background: rgba(22, 140, 255, 0.12); color: #168cff; }
.empty-state svg { width: 24px; }
.empty-state h3 { margin: 18px 0 6px; color: #edf3fa; font-size: 1.1rem; }
.empty-state p { margin: 0 0 20px; color: #718096; font-size: 0.75rem; }
.empty-state button { padding: 10px 16px; border: 0; border-radius: 9px; background: #168cff; color: #fff; font-size: 0.72rem; font-weight: 700; cursor: pointer; }

@media (max-width: 1100px) {
  .article-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .filter-label { display: none; }
  .filter-controls { width: 100%; }
  .search-control { flex: 1; }
  .search-control input { width: 100%; }
}

@media (max-width: 700px) {
  .article-hero { min-height: 620px; }
  .hero-content { width: calc(100% - 36px); padding: 140px 0 62px; }
  .hero-content h1 { font-size: clamp(3rem, 15vw, 4.4rem); }
  .hero-content p { font-size: 0.85rem; line-height: 1.7; }
  .article-content { padding: 52px 16px 80px; }
  .filter-heading { display: block; }
  .filter-heading p { margin-top: 10px; }
  .filter-panel { padding: 14px; }
  .filter-controls { flex-direction: column; }
  .search-control, .select-control, .select-control select { width: 100%; }
  .article-grid { grid-template-columns: 1fr; gap: 18px; }
  .card-image { height: 225px; }
}
</style>
