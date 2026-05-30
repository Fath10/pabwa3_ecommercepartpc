<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'py-2' : 'py-3'"
    style="background: #111111; border-bottom: 1px solid rgba(255,255,255,0.06);"
  >
    <!-- Gunakan w-full px-3 agar konten hampir menyentuh tepi kiri & kanan -->
    <div class="w-full px-3">
      <div class="flex items-center gap-2">

        <!-- Logo — hampir menyentuh tepi kiri -->
        <RouterLink to="/" class="flex items-center gap-2 group flex-shrink-0">
          <img
            src="/logo.png"
            alt="e-BuildPC logo"
            class="w-8 h-8 rounded object-cover"
          />
          <span class="font-bold text-white text-sm tracking-wide whitespace-nowrap">e-BuildPC</span>
        </RouterLink>

        <!-- Divider visual -->
        <div class="hidden md:block w-px h-5 flex-shrink-0" style="background: rgba(255,255,255,0.1);"></div>

        <!-- Desktop Nav Links (rapat di samping logo) -->
        <div class="hidden md:flex items-center gap-0.5 flex-shrink-0">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-md whitespace-nowrap"
            :class="$route.path === link.path
              ? 'text-white bg-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- Search Bar — mengisi sisa ruang tengah -->
        <div class="hidden md:flex flex-1 relative mx-2" ref="searchContainer">
          <div class="relative w-full">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              v-model="searchQuery"
              @input="onSearchInput"
              @keyup.enter="doSearch"
              @focus="showSuggestions = true"
              type="text"
              placeholder="Cari produk atau kategori..."
              class="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none text-white transition-all duration-200"
              style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);"
            />
            <!-- Suggestions dropdown -->
            <Transition name="dropdown">
              <div
                v-if="showSuggestions && filteredSuggestions.length > 0"
                class="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl z-50"
                style="background: #1a1f2e; border: 1px solid rgba(255,255,255,0.1);"
              >
                <button
                  v-for="s in filteredSuggestions"
                  :key="s.label"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
                  @mousedown.prevent="selectSuggestion(s)"
                >
                  <span class="text-base">{{ s.icon }}</span>
                  <div>
                    <p class="text-white font-medium leading-none">{{ s.label }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ s.type }}</p>
                  </div>
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Right: Account + Cart + Hamburger — hampir menyentuh tepi kanan -->
        <div class="flex items-center gap-1 flex-shrink-0 ml-auto md:ml-0">

          <!-- Account / Login Link -->
          <RouterLink
            v-if="!userStore.isLoggedIn"
            id="account-btn"
            to="/login"
            title="Login / Akun Saya"
            class="flex items-center gap-1.5 px-3 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all duration-150 text-sm font-medium"
          >
            <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="hidden sm:inline">Login</span>
          </RouterLink>

          <!-- User Profile / Logout Button -->
          <div v-else class="flex items-center gap-2">
            <span class="text-xs text-gray-300 hidden lg:inline">Halo, <strong class="text-white">{{ userStore.user.name }}</strong></span>
            <button
              @click="handleLogout"
              id="logout-btn"
              title="Logout"
              class="flex items-center gap-1.5 px-3 h-9 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-rose-500/20 transition-all duration-150 text-xs font-semibold"
            >
              🚪 <span class="hidden sm:inline">Keluar</span>
            </button>
          </div>

          <!-- Cart Icon -->
          <RouterLink
            to="/cart"
            id="cart-btn"
            title="Keranjang"
            class="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all duration-150"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <!-- Badge -->
            <Transition name="badge">
              <span
                v-if="cartCount > 0"
                class="absolute -top-1 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full text-white font-bold"
                style="font-size: 9px; background: #ef4444;"
              >{{ cartCount > 9 ? '9+' : cartCount }}</span>
            </Transition>
          </RouterLink>

          <!-- Mobile hamburger -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all"
          >
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden pt-3 pb-2 border-t mt-3" style="border-color: rgba(255,255,255,0.08);">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2.5 text-sm font-medium rounded-lg mb-0.5 transition-all"
            :class="$route.path === link.path ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { userStore } from '../store.js'

const props = defineProps({ cartCount: { type: Number, default: 0 } })
const router = useRouter()
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)
const searchContainer = ref(null)

const navLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Katalog', path: '/katalog' },
  { label: 'Artikel', path: '/artikel' },
  { label: 'Tentang Kami', path: '/tentang' },
]

// Daftar saran pencarian (kategori + produk populer)
const allSuggestions = [
  { label: 'Processor (CPU)', icon: '🧠', type: 'Kategori', query: 'processor' },
  { label: 'Kartu Grafis (GPU)', icon: '🎮', type: 'Kategori', query: 'gpu' },
  { label: 'RAM Memory', icon: '💾', type: 'Kategori', query: 'ram' },
  { label: 'Motherboard', icon: '🖱️', type: 'Kategori', query: 'motherboard' },
  { label: 'Storage SSD', icon: '📲', type: 'Kategori', query: 'ssd' },
  { label: 'Power Supply', icon: '🔋', type: 'Kategori', query: 'psu' },
  { label: 'Casing PC', icon: '🖥️', type: 'Kategori', query: 'casing' },
  { label: 'Pendingin (Cooler)', icon: '❄️', type: 'Kategori', query: 'cooler' },
]

const filteredSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return allSuggestions.slice(0, 5)
  const q = searchQuery.value.toLowerCase()
  return allSuggestions.filter(s =>
    s.label.toLowerCase().includes(q) || s.query.toLowerCase().includes(q)
  ).slice(0, 6)
})

function onSearchInput() {
  showSuggestions.value = true
}

function selectSuggestion(s) {
  searchQuery.value = s.label
  showSuggestions.value = false
  router.push({ path: '/katalog', query: { q: s.query } })
}

function doSearch() {
  if (!searchQuery.value.trim()) return
  showSuggestions.value = false
  router.push({ path: '/katalog', query: { q: searchQuery.value.trim() } })
}

// Tutup dropdown saat klik di luar
function handleClickOutside(e) {
  if (searchContainer.value && !searchContainer.value.contains(e.target)) {
    showSuggestions.value = false
  }
}

function handleScroll() { isScrolled.value = window.scrollY > 40 }

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.badge-enter-active { animation: badgeIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.badge-leave-active { animation: badgeOut 0.15s ease; }
@keyframes badgeIn { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes badgeOut { from { transform: scale(1); } to { transform: scale(0); } }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
