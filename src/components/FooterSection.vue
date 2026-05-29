<template>
  <footer style="background: #0d1117; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 56px; padding-bottom: 32px;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        <!-- Brand -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2.5 mb-3">
            <img src="/logo.png" alt="e-BuildPC" class="w-7 h-7 rounded object-cover" />
            <span class="font-bold text-white text-sm">e-BuildPC</span>
          </div>
          <p class="text-xs leading-relaxed mb-5" style="color: #6b7280;">
            Platform terpercaya untuk membangun PC berkualitas tinggi. Rakit PC impian Anda dengan komponen terbaik.
          </p>
        </div>
        <!-- Navigasi -->
        <div>
          <h3 class="font-semibold mb-4 text-xs uppercase tracking-widest" style="color: #4b5563; letter-spacing: 0.1em;">Navigasi</h3>
          <ul class="space-y-2.5">
            <li v-for="link in quickLinks" :key="link.path">
              <RouterLink :to="link.path"
                class="text-xs transition-colors duration-150"
                style="color: #6b7280;"
                @mouseenter="e => e.target.style.color='#d1d5db'"
                @mouseleave="e => e.target.style.color='#6b7280'"
              >{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>
        <!-- Kategori -->
        <div>
          <h3 class="font-semibold mb-4 text-xs uppercase tracking-widest" style="color: #4b5563; letter-spacing: 0.1em;">Kategori</h3>
          <ul class="space-y-2.5">
            <li v-for="cat in categories" :key="cat">
              <a href="#" class="text-xs transition-colors duration-150"
                style="color: #6b7280;"
                @mouseenter="e => e.target.style.color='#d1d5db'"
                @mouseleave="e => e.target.style.color='#6b7280'"
              >{{ cat }}</a>
            </li>
          </ul>
        </div>
        <!-- Kontak -->
        <div>
          <h3 class="font-semibold mb-4 text-xs uppercase tracking-widest" style="color: #4b5563; letter-spacing: 0.1em;">Kontak</h3>
          <ul class="space-y-3">
            <li v-for="c in contacts" :key="c.label" class="flex items-start gap-2.5">
              <span class="text-sm mt-0.5" style="color: #6b7280;">{{ c.icon }}</span>
              <div>
                <p class="text-xs" style="color: #4b5563;">{{ c.label }}</p>
                <p class="text-xs" style="color: #9ca3af;">{{ c.value }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6" style="border-top: 1px solid rgba(255,255,255,0.06);">
        <p class="text-xs" style="color: #4b5563;">© {{ currentYear }} e-BuildPC. All rights reserved.</p>
        <div class="flex gap-5">
          <a v-for="link in legalLinks" :key="link" href="#" class="text-xs transition-colors" style="color: #4b5563;"
            @mouseenter="e => e.target.style.color='#9ca3af'"
            @mouseleave="e => e.target.style.color='#4b5563'"
          >{{ link }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
// Tahun otomatis mengikuti tahun berjalan (saat ini 2026) — tidak perlu update manual tiap tahun.
const currentYear = new Date().getFullYear()
const quickLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Katalog Produk', path: '/katalog' },
  { label: 'Artikel', path: '/artikel' },
  { label: 'Tentang Kami', path: '/tentang' },
]
const categories = ['Processor (CPU)', 'Kartu Grafis (GPU)', 'RAM Memory', 'Motherboard', 'Storage (SSD/HDD)', 'Power Supply']
const contacts = [
  { icon: '📍', label: 'Alamat', value: 'Balikpapan, Kalimantan Timur, Indonesia' },
  { icon: '📧', label: 'Email', value: 'hello@e-buildpc.id' },
  { icon: '📞', label: 'Telepon', value: '+62 812-3456-7890' },
  { icon: '⏰', label: 'Jam', value: 'Senin–Sabtu, 09.00–18.00' },
]
const legalLinks = ['Privacy Policy', 'Terms of Service', 'Sitemap']
</script>