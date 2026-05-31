<template>
  <footer class="bg-[#0d1117] border-t border-white/5 pt-16 pb-10 text-gray-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        
        <!-- Brand -->
        <div class="flex flex-col space-y-4">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="e-BuildPC" class="w-8 h-8 rounded object-cover" />
            <span class="font-bold text-white text-base tracking-wide">e-BuildPC</span>
          </div>

          <p class="text-xs text-gray-400 leading-relaxed max-w-xs">
            Platform terpercaya untuk membangun PC berkualitas tinggi. Rakit PC impian Anda dengan komponen terbaik.
          </p>

          <div class="flex gap-3 pt-2">
            <a
              v-for="s in socials"
              :key="s.name"
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
              :title="s.name"
              class="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-200 text-sm"
            >
              {{ s.icon }}
            </a>
          </div>
        </div>

        <!-- Navigasi -->
        <div>
          <h3 class="font-semibold mb-5 text-xs text-gray-200 uppercase tracking-widest">
            Navigasi
          </h3>

          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.path">
              <RouterLink
                :to="link.path"
                class="text-xs text-gray-400 hover:text-white transition-colors duration-200 block"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Kategori -->
        <div>
          <h3 class="font-semibold mb-5 text-xs text-gray-200 uppercase tracking-widest">
            Kategori
          </h3>

          <ul class="space-y-3">
            <li v-for="cat in categories" :key="cat.value">
              <RouterLink 
                :to="{ path: '/katalog', query: { category: cat.value } }" 
                class="text-xs text-gray-400 hover:text-white transition-colors duration-200 block"
              >
                {{ cat.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Kontak -->
        <div>
          <h3 class="font-semibold mb-5 text-xs text-gray-200 uppercase tracking-widest">
            Kontak
          </h3>

          <ul class="space-y-4">
            <li v-for="c in contacts" :key="c.label" class="flex items-start gap-3">
              <span class="text-sm mt-0.5 text-gray-400 bg-white/5 w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
                {{ c.icon }}
              </span>

              <div class="space-y-0.5">
                <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  {{ c.label }}
                </p>
                <p class="text-xs text-gray-300 leading-normal">
                  {{ c.value }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
        <p class="text-xs text-gray-500">
          © {{ currentYear }} e-BuildPC. All rights reserved.
        </p>

        <div class="flex flex-wrap justify-center gap-6">
          <RouterLink
            v-for="link in legalLinks"
            :key="link.path"
            :to="link.path"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()

const socials = [
  { name: 'Instagram', icon: '📸', url: 'https://instagram.com' },
  { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
  { name: 'YouTube', icon: '▶️', url: 'https://youtube.com' },
  { name: 'WhatsApp', icon: '💬', url: 'https://wa.me/6281234567890' },
]

const quickLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Katalog Produk', path: '/katalog' },
  { label: 'Artikel', path: '/artikel' },
  { label: 'Tentang Kami', path: '/tentang' },
]

const categories = [
  { label: 'Laptop', value: 'Laptop' },
  { label: 'Processor', value: 'Processor' },
  { label: 'GPU', value: 'GPU' },
  { label: 'RAM', value: 'RAM' },
  { label: 'Storage', value: 'Storage' },
  { label: 'Cooling', value: 'Cooling' },
  { label: 'Motherboard', value: 'Motherboard' },
  { label: 'Power Supply', value: 'Power Supply' },
  { label: 'Casing', value: 'Casing' },
  { label: 'Peripheral', value: 'Peripheral' },
  { label: 'Monitor', value: 'Monitor' },
]

const contacts = [
  { icon: '📍', label: 'Alamat', value: 'Balikpapan, Kalimantan Timur, Indonesia' },
  { icon: '✉️', label: 'Email', value: 'hello@e-buildpc.id' },
  { icon: '📞', label: 'Telepon', value: '+62 812-3456-7890' },
  { icon: '⏰', label: 'Jam', value: 'Senin–Sabtu, 09.00–18.00' },
]

const legalLinks = [
  { label: 'Privacy Policy', path: '/info/privacy-policy' },
  { label: 'Terms of Service', path: '/info/terms-of-service' },
]
</script>