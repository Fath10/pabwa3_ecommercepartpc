<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'py-2' : 'py-3'"
    style="background: #111111; border-bottom: 1px solid rgba(255,255,255,0.06);"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 group">
          <!-- Logo image -->
          <img
            src="/logo.png"
            alt="e-BuildPC logo"
            class="w-8 h-8 rounded object-cover"
          />
          <span class="font-bold text-white text-sm tracking-wide">e-BuildPC</span>
        </RouterLink>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center gap-0.5">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="px-4 py-2 text-sm font-medium transition-colors duration-150 rounded-md"
            :class="$route.path === link.path
              ? 'text-white bg-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- Right: Account + Cart + Hamburger -->
        <div class="flex items-center gap-1">

          <!-- Account / Login Link -->
          <RouterLink
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
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({ cartCount: { type: Number, default: 0 } })

const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const navLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Katalog', path: '/katalog' },
  { label: 'Artikel', path: '/artikel' },
  { label: 'Tentang Kami', path: '/tentang' },
]

function handleScroll() { isScrolled.value = window.scrollY > 40 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.badge-enter-active { animation: badgeIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.badge-leave-active { animation: badgeOut 0.15s ease; }
@keyframes badgeIn { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes badgeOut { from { transform: scale(1); } to { transform: scale(0); } }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
