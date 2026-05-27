<template>
  <main class="pt-16">

    <!-- ═══════════════════════════════════════════
         HERO SECTION
         Dark background, exactly like reference
    ═══════════════════════════════════════════ -->
    <section
      id="hero"
      class="relative overflow-hidden flex items-center"
      style="background: #0e1524; min-height: calc(100vh - 64px);"
    >
      <!-- Background subtle glow -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="background: radial-gradient(ellipse 60% 50% at 70% 50%, rgba(30,58,138,0.35) 0%, transparent 70%);"
      ></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div class="grid lg:grid-cols-2 gap-12 items-center">

          <!-- Left: Copy -->
          <div>
            <h1
              class="font-extrabold text-white leading-tight mb-4"
              style="font-size: clamp(2.2rem, 4.5vw, 3.6rem); line-height: 1.12; letter-spacing: -0.02em;"
            >
              Wujudkan PC Impian Anda
            </h1>
            <p
              class="mb-8 leading-relaxed"
              style="color: #94a3b8; font-size: 0.9rem; max-width: 440px;"
            >
              Platform terpercaya untuk membangun PC berkualitas tinggi. Rakit PC gaming, workstation, atau PC rumahan dengan komponen pilihan dari brand terbaik.
            </p>

            <div class="flex flex-wrap gap-3">
              <!-- "Katalog" — solid dark button (matches reference) -->
              <RouterLink
                to="/katalog"
                id="hero-katalog-btn"
                class="px-6 py-2.5 rounded-md font-semibold text-white text-sm transition-all duration-200"
                style="background: #1e293b; border: 1px solid #334155;"
                @mouseenter="e => e.target.style.background='#273549'"
                @mouseleave="e => e.target.style.background='#1e293b'"
              >
                Katalog
              </RouterLink>

              <!-- "Bantuan" — ghost/outline button -->
              <RouterLink
                to="/tentang"
                id="hero-bantuan-btn"
                class="px-6 py-2.5 rounded-md font-semibold text-white text-sm transition-all duration-200 hover:bg-white/8"
                style="border: 1px solid rgba(255,255,255,0.25);"
              >
                Bantuan
              </RouterLink>
            </div>
          </div>

          <!-- Right: Hero Image -->
          <div class="flex justify-center">
            <div class="relative w-full max-w-lg animate-float">
              <!-- Glow halo -->
              <div
                class="absolute -inset-4 rounded-3xl pointer-events-none"
                style="background: radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 70%); filter: blur(20px);"
              ></div>
              <img
                src="/hero_banner.png"
                alt="Gaming PC Setup"
                class="relative z-10 w-full rounded-2xl shadow-2xl"
                style="border: 1px solid rgba(255,255,255,0.07);"
              />
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         ABOUT SECTION — "Apa itu e-BuildPC?"
         Pure WHITE, dark text — exactly as reference
    ═══════════════════════════════════════════ -->
    <section id="about" style="background: #ffffff; padding: 72px 0;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center mb-12">
          <h2
            class="font-bold mb-3"
            style="font-size: 1.75rem; color: #111827; letter-spacing: -0.01em;"
          >
            Apa itu e-BuildPC?
          </h2>
          <p
            class="mx-auto leading-relaxed"
            style="color: #6b7280; font-size: 0.875rem; max-width: 640px;"
          >
            e-BuildPC adalah platform e-commerce terpercaya untuk membangun komponen PC berkualitas tinggi.
            Kami menyediakan berbagai komponen dari brand ternama dengan harga kompetitif, membantu Anda
            merakit PC impian dengan mudah dan aman.
          </p>
        </div>

        <!-- Feature cards: white, thin border, small shadow -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="f in features"
            :key="f.title"
            class="p-6 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            style="background: #fff; border: 1px solid #e5e7eb;"
          >
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style="background: #f1f5f9;"
            >
              <span class="text-xl">{{ f.icon }}</span>
            </div>
            <h3 class="font-semibold mb-1.5" style="color: #111827; font-size: 0.9rem;">{{ f.title }}</h3>
            <p class="text-xs leading-relaxed" style="color: #6b7280;">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         PRODUCTS SECTION — "Produk Pilihan"
         White bg, dark text, clean product cards
    ═══════════════════════════════════════════ -->
    <section id="products" style="background: #f8fafc; padding: 72px 0;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header row with nav arrows -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="font-bold" style="font-size: 1.5rem; color: #111827; letter-spacing: -0.01em;">
            Produk Pilihan
          </h2>
          <div class="flex gap-2">
            <button
              class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
              style="background: #fff; border: 1px solid #d1d5db; color: #374151; font-size: 1rem; line-height: 1;"
              @click="prevSlide"
            >‹</button>
            <button
              class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
              style="background: #fff; border: 1px solid #d1d5db; color: #374151; font-size: 1rem; line-height: 1;"
              @click="nextSlide"
            >›</button>
          </div>
        </div>

        <!-- Product grid -->
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="$emit('add-to-cart', $event)"
          />
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         CTA SECTION — "Ingin Mengetahui Tentang Pengembang?"
         Very dark: #111827, white text, white button
    ═══════════════════════════════════════════ -->
    <section id="cta" style="background: #111827; padding: 80px 0;">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="mb-2 text-sm" style="color: #9ca3af;">
          Pelajari lebih lanjut tentang e-BuildPC, siapa kami, dan visi misi platform ini.
        </p>
        <h2
          class="font-bold mb-8 text-white"
          style="font-size: 1.5rem; line-height: 1.4;"
        >
          Ingin Mengetahui Tentang Pengembang?
        </h2>

        <!-- White solid button (matches reference CTA button style) -->
        <RouterLink
          to="/tentang"
          id="cta-tentang-btn"
          class="inline-flex items-center gap-2 px-7 py-3 rounded-md font-semibold text-sm transition-all duration-200 hover:opacity-90"
          style="background: #ffffff; color: #111827;"
        >
          Tentang Kami
        </RouterLink>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { products } from '../store.js'

defineEmits(['add-to-cart'])

const featuredProducts = products.slice(0, 4)

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
.animate-float {
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
