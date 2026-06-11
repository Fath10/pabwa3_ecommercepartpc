<template>
  <main class="home-page pt-16">
    <!-- HERO SECTION -->
    <section id="hero" class="hero-section relative overflow-hidden flex items-center">
      <div class="hero-glow absolute inset-0 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left: Copy -->
          <div>
            <h1 class="hero-title font-extrabold text-white leading-tight mb-4">
              Wujudkan PC Impian Anda
            </h1>

            <p class="hero-desc mb-8 leading-relaxed">
              Platform terpercaya untuk membangun PC berkualitas tinggi. Rakit PC gaming,
              workstation, atau PC rumahan dengan komponen pilihan dari brand terbaik.
            </p>

            <div class="flex flex-wrap gap-3">
              <RouterLink
                to="/katalog"
                id="hero-katalog-btn"
                class="hero-btn-primary px-6 py-2.5 rounded-md font-semibold text-white text-sm transition-all duration-200"
              >
                Katalog
              </RouterLink>

              <RouterLink
                to="/bantuan"
                id="hero-bantuan-btn"
                class="hero-btn-secondary px-6 py-2.5 rounded-md font-semibold text-white text-sm transition-all duration-200"
              >
                Bantuan
              </RouterLink>
            </div>
          </div>

          <!-- Right: Hero Image -->
          <div class="flex justify-center">
            <div class="relative w-full max-w-lg animate-float">
              <div class="image-glow absolute -inset-4 rounded-3xl pointer-events-none"></div>

              <img
                src="/hero_banner.png"
                alt="Gaming PC Setup"
                class="relative z-10 w-full rounded-2xl shadow-2xl hero-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section id="about" class="about-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="section-title font-bold mb-3">
            Apa itu e-BuildPC?
          </h2>

          <p class="section-desc mx-auto leading-relaxed">
            e-BuildPC adalah platform e-commerce terpercaya untuk membangun komponen PC berkualitas tinggi.
            Kami menyediakan berbagai komponen dari brand ternama dengan harga kompetitif, membantu Anda
            merakit PC impian dengan mudah dan aman.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="f in features"
            :key="f.title"
            class="feature-card p-6 rounded-xl text-center transition-all duration-200 hover:-translate-y-1"
          >
            <div class="feature-icon w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl">{{ f.icon }}</span>
            </div>

            <h3 class="feature-title font-semibold mb-1.5">
              {{ f.title }}
            </h3>

            <p class="feature-desc text-xs leading-relaxed">
              {{ f.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCTS SECTION -->
    <section id="products" class="products-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="section-title font-bold">
              Produk Pilihan
            </h2>
            <p class="section-desc mt-1">
              Rekomendasi komponen terbaik untuk Anda
            </p>
          </div>

          <div class="flex gap-2">
            <button
              class="slider-btn w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
              @click="prevSlide"
            >
              ‹
            </button>

            <button
              class="slider-btn w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
              @click="nextSlide"
            >
              ›
            </button>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="i in 4"
            :key="i"
            class="skeleton-card rounded-xl overflow-hidden animate-pulse p-4"
          >
            <div class="skeleton-img h-40 rounded-lg mb-3"></div>
            <div class="skeleton-line h-4 rounded w-3/4 mb-2"></div>
            <div class="skeleton-line h-3 rounded w-1/2 mb-4"></div>
            <div class="skeleton-line h-8 rounded w-full"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="error-box max-w-md mx-auto text-center py-8 px-6 rounded-2xl">
          <div class="error-icon w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 class="text-base font-bold mb-1">
            Gagal Memuat Produk
          </h3>

          <p class="text-xs mb-4">
            {{ loadError || 'Pastikan server backend berjalan.' }}
          </p>

          <button
            @click="productStore.fetchAll(true)"
            class="error-btn px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Product grid -->
        <div v-else class="home-product-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="(product, event) => $emit('add-to-cart', product, event)"
          />
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section id="cta" class="cta-section">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="cta-desc mb-2 text-sm">
          Pelajari lebih lanjut tentang e-BuildPC, siapa kami, dan visi misi platform ini.
        </p>

        <h2 class="cta-title font-bold mb-8 text-white">
          Ingin Mengetahui Tentang Pengembang?
        </h2>

        <RouterLink
          to="/tentang"
          id="cta-tentang-btn"
          class="cta-btn inline-flex items-center gap-2 px-7 py-3 rounded-md font-semibold text-sm transition-all duration-200"
        >
          Tentang Kami
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { productStore } from '../store.js'

defineEmits(['add-to-cart'])

onMounted(() => productStore.fetchAll())

const featuredProducts = computed(() => productStore.items.slice(0, 4))
const isLoading = computed(() => productStore.loading)
const isError = computed(() => !!productStore.error)
const loadError = computed(() => productStore.error)

function prevSlide() {}
function nextSlide() {}

const features = [
  {
    icon: '🖥️',
    title: 'Produk Original',
    desc: 'Semua produk dijamin original dan didistribusi dari brand resminya.',
  },
  {
    icon: '🛡️',
    title: 'Garansi Resmi',
    desc: 'Setiap pembelian dilengkapi dengan garansi resmi yang berlaku penuh.',
  },
  {
    icon: '🚚',
    title: 'Gratis Ongkir',
    desc: 'Gratis ongkir untuk setiap pembelian di atas Rp 1.500.000.',
  },
  {
    icon: '🎧',
    title: 'Bantuan 24/7',
    desc: 'Tim customer service siap membantu Anda kapan pun dibutuhkan.',
  },
]
</script>

<style scoped>
.home-page {
  color: #e5e7eb;
  background:
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 30%),
    linear-gradient(180deg, #0b1020 0%, #080b14 48%, #05070d 100%);
}

/* HERO */
.hero-section {
  background: #0e1524;
  min-height: calc(100vh - 64px);
}

.hero-glow {
  background:
    radial-gradient(ellipse 60% 50% at 70% 50%, rgba(30, 58, 138, 0.35) 0%, transparent 70%),
    radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.18), transparent 28%);
}

.hero-title {
  font-size: clamp(2.2rem, 4.5vw, 3.6rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
}

.hero-desc {
  color: #94a3b8;
  font-size: 0.9rem;
  max-width: 440px;
}

.hero-btn-primary {
  background: #1e293b;
  border: 1px solid #334155;
}

.hero-btn-primary:hover {
  background: #273549;
  transform: translateY(-1px);
}

.hero-btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.hero-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.image-glow {
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  filter: blur(20px);
}

.hero-image {
  border: 1px solid rgba(255, 255, 255, 0.07);
}

/* ABOUT */
.about-section {
  padding: 72px 0;
  background:
    radial-gradient(circle at center, rgba(79, 70, 229, 0.08), transparent 36%),
    linear-gradient(180deg, #080d18 0%, #0b1020 100%);
}

.section-title {
  font-size: 1.75rem;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

.section-desc {
  color: #94a3b8;
  font-size: 0.875rem;
  max-width: 640px;
}

.feature-card {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(30, 27, 75, 0.82));
  border: 1px solid rgba(129, 140, 248, 0.22);
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.18);
}

.feature-card:hover {
  border-color: rgba(167, 139, 250, 0.48);
  box-shadow: 0 24px 56px rgba(79, 70, 229, 0.18);
}

.feature-icon {
  background: rgba(79, 70, 229, 0.18);
  border: 1px solid rgba(129, 140, 248, 0.22);
}

.feature-title {
  color: #f8fafc;
  font-size: 0.9rem;
}

.feature-desc {
  color: #94a3b8;
}

/* PRODUCTS */
.products-section {
  padding: 72px 0;
  background:
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), transparent 28%),
    linear-gradient(180deg, #0b1020 0%, #060a12 100%);
}

.products-section .section-title {
  font-size: 1.5rem;
}

.slider-btn {
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(129, 140, 248, 0.24);
}

.slider-btn:hover {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.24);
  border-color: rgba(167, 139, 250, 0.48);
}

/* Skeleton */
.skeleton-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(129, 140, 248, 0.18);
}

.skeleton-img,
.skeleton-line {
  background: rgba(148, 163, 184, 0.16);
}

/* Error */
.error-box {
  color: #fda4af;
  background: rgba(127, 29, 29, 0.25);
  border: 1px solid rgba(244, 63, 94, 0.28);
}

.error-icon {
  color: #fda4af;
  background: rgba(244, 63, 94, 0.16);
}

.error-btn {
  color: #ffffff;
  background: #dc2626;
}

.error-btn:hover {
  background: #b91c1c;
}

/* ProductCard force dark khusus home */
.home-product-grid :deep(.product-card),
.home-product-grid :deep(article),
.home-product-grid :deep([class*="card"]) {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 27, 75, 0.86)) !important;
  border-color: rgba(129, 140, 248, 0.22) !important;
  color: #f8fafc !important;
}

.home-product-grid :deep([style*="background:#fff"]),
.home-product-grid :deep([style*="background: #fff"]),
.home-product-grid :deep([style*="background:#f1f5f9"]),
.home-product-grid :deep([style*="background: #f1f5f9"]) {
  background: rgba(226, 232, 240, 0.08) !important;
}

.home-product-grid :deep([style*="color: #111827"]),
.home-product-grid :deep([style*="color:#111827"]),
.home-product-grid :deep([style*="color: #0f172a"]),
.home-product-grid :deep([style*="color:#0f172a"]) {
  color: #f8fafc !important;
}

/* CTA */
.cta-section {
  padding: 80px 0;
  background:
    radial-gradient(circle at center, rgba(79, 70, 229, 0.16), transparent 34%),
    #080d16;
  border-top: 1px solid rgba(129, 140, 248, 0.14);
}

.cta-desc {
  color: #9ca3af;
}

.cta-title {
  font-size: 1.5rem;
  line-height: 1.4;
}

.cta-btn {
  color: #ffffff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 14px 32px rgba(79, 70, 229, 0.32);
}

.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 42px rgba(124, 58, 237, 0.4);
}

/* Animation */
.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>