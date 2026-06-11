<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'py-2' : 'py-3'"
    style="background: #111111; border-bottom: 1px solid rgba(255,255,255,0.06);"
  >
    <div class="w-full px-3">
      <div class="flex items-center gap-2">
        <RouterLink
          :to="isAdmin ? '/admin' : '/'"
          class="flex items-center gap-2 group flex-shrink-0"
        >
          <img
            src="/logo.png"
            alt="e-BuildPC logo"
            class="w-8 h-8 rounded object-cover"
          />

          <span class="font-bold text-white text-sm tracking-wide whitespace-nowrap">
            e-BuildPC
          </span>

          <span
            v-if="isAdmin"
            class="hidden sm:inline px-2 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
          >
            ADMIN
          </span>
        </RouterLink>

        <div
          class="hidden md:block w-px h-5 flex-shrink-0"
          style="background: rgba(255,255,255,0.1);"
        ></div>

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

        <div
          v-if="!isAdmin"
          class="hidden md:flex flex-1 relative mx-2"
          ref="searchContainer"
        >
          <div class="relative w-full">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
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

            <Transition name="dropdown">
              <div
                v-if="showSuggestions && filteredSuggestions.length > 0"
                class="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl z-50"
                style="background: #1a1f2e; border: 1px solid rgba(255,255,255,0.1);"
              >
                <div class="px-4 pt-2.5 pb-1">
                  <span class="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    {{ searchQuery.trim() ? 'Produk Ditemukan' : 'Produk Populer' }}
                  </span>
                </div>

                <button
                  v-for="product in filteredSuggestions"
                  :key="product.id"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
                  @mousedown.prevent="selectProduct(product)"
                >
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                    style="background: rgba(255,255,255,0.05);"
                  />

                  <div class="flex-1 min-w-0">
                    <p class="text-white font-medium leading-snug truncate">
                      {{ product.name }}
                    </p>

                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ product.category }} · Stok {{ product.stock }}
                    </p>
                  </div>

                  <span class="text-xs font-bold text-indigo-400 flex-shrink-0">
                    {{ formatPrice(product.price) }}
                  </span>
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <div v-else class="hidden md:flex flex-1"></div>

        <div class="navbar-actions flex items-center gap-1 flex-shrink-0 ml-auto md:ml-0">
          <button
            v-if="!isAdmin || userStore.isLoggedIn"
            @click="openAdminChat"
            title="Chat Admin e-BuildPC"
            class="nav-icon-btn"
            :class="{ 'nav-icon-active': adminChatOpen }"
            aria-label="Chat Admin e-BuildPC"
            :aria-expanded="adminChatOpen"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 18.5 3.5 21v-4.6A8 8 0 1 1 7 18.5Z" />
              <path stroke-linecap="round" d="M8 10h.01M12 10h.01M16 10h.01" stroke-width="2.4" />
            </svg>
          </button>

          <RouterLink
            v-if="!isAdmin"
            to="/cart"
            id="cart-btn"
            title="Keranjang"
            class="nav-icon-btn"
            aria-label="Keranjang"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <Transition name="badge">
              <span
                v-if="cartCount > 0"
                class="absolute -top-1 -left-0.5 w-4 h-4 flex items-center justify-center rounded-full text-white font-bold"
                style="font-size: 9px; background: #ef4444;"
              >
                {{ cartCount > 9 ? '9+' : cartCount }}
              </span>
            </Transition>
          </RouterLink>

          <RouterLink
            v-if="!userStore.isLoggedIn"
            id="account-btn"
            to="/login"
            title="Login / Akun Saya"
            class="flex items-center gap-1.5 px-3 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150 text-sm font-medium"
          >
            <svg
              class="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>

            <span class="hidden sm:inline">Login</span>
          </RouterLink>

          <div v-else class="flex items-center gap-2">
            <RouterLink
              to="/profile"
              class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-all duration-200"
              title="Profil Saya"
            >
              <img
                v-if="userStore.user?.avatar_url"
                :src="assetUrl(userStore.user.avatar_url)"
                :alt="userStore.user?.name || 'User'"
                class="w-8 h-8 rounded-full object-cover border border-gray-600"
              />

              <div
                v-else
                class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 border border-gray-600"
              >
                <svg
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>

              <span class="text-xs font-bold text-white hidden sm:inline max-w-28 truncate">
                {{ userStore.user?.name }}
              </span>
            </RouterLink>

            <span
              v-if="isAdmin"
              class="hidden lg:inline px-2 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            >
              ADMIN
            </span>

            <button
              @click="handleLogout"
              id="logout-btn"
              title="Logout"
              class="flex items-center gap-1.5 px-3 h-9 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-rose-500/20 transition-all duration-150 text-xs font-semibold"
            >
              🚪 <span class="hidden sm:inline">Keluar</span>
            </button>
          </div>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="nav-icon-btn md:hidden"
            aria-label="Buka menu navigasi"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <Transition name="slide-down">
        <div
          v-if="mobileMenuOpen"
          class="md:hidden pt-3 pb-2 border-t mt-3"
          style="border-color: rgba(255,255,255,0.08);"
        >
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2.5 text-sm font-medium rounded-lg mb-0.5 transition-all"
            :class="$route.path === link.path
              ? 'text-white bg-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            {{ link.label }}
          </RouterLink>

          <RouterLink
            v-if="userStore.isLoggedIn"
            to="/profile"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2.5 text-sm font-medium rounded-lg mb-0.5 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Profil Saya
          </RouterLink>

          <RouterLink
            v-if="!userStore.isLoggedIn"
            to="/login"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2.5 text-sm font-medium rounded-lg mb-0.5 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Login
          </RouterLink>

          <button
            v-if="userStore.isLoggedIn"
            @click="handleLogout"
            class="w-full text-left block px-3 py-2.5 text-sm font-medium rounded-lg mb-0.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all"
          >
            Keluar
          </button>
        </div>
      </Transition>

      <Transition name="dropdown">
        <AdminChatPanel v-if="adminChatOpen" @close="adminChatOpen = false" />
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { userStore, productStore, formatPrice } from '../store.js'
import { assetUrl } from '../api/index.js'
import AdminChatPanel from './AdminChatPanel.vue'

defineProps({
  cartCount: {
    type: Number,
    default: 0,
  },
})

const router = useRouter()

const mobileMenuOpen = ref(false)
const isScrolled = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)
const searchContainer = ref(null)
const adminChatOpen = ref(false)

const isAdmin = computed(() => userStore.isAdmin)

const navLinks = computed(() => {
  if (isAdmin.value) {
    return [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Produk', path: '/admin/produk' },
      { label: 'Pesanan', path: '/admin/pesanan' },
      { label: 'Pengguna', path: '/admin/pengguna' },
    ]
  }

  return [
    { label: 'Beranda', path: '/' },
    { label: 'Katalog', path: '/katalog' },
    { label: 'Artikel', path: '/artikel' },
    { label: 'Tentang Kami', path: '/tentang' },
  ]
})

const filteredSuggestions = computed(() => {
  const allProducts = productStore.items || []
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return [...allProducts]
      .sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0))
      .slice(0, 5)
  }

  return allProducts
    .filter((product) => {
      const name = String(product.name || '').toLowerCase()
      const category = String(product.category || '').toLowerCase()

      return name.includes(query) || category.includes(query)
    })
    .slice(0, 6)
})

function onSearchInput() {
  showSuggestions.value = true
}

function selectProduct(product) {
  searchQuery.value = ''
  showSuggestions.value = false
  mobileMenuOpen.value = false
  router.push(`/produk/${product.id}`)
}

function doSearch() {
  const query = searchQuery.value.trim()

  if (!query) return

  showSuggestions.value = false
  router.push({
    path: '/katalog',
    query: {
      q: query,
    },
  })
}

function handleClickOutside(event) {
  if (
    searchContainer.value &&
    !searchContainer.value.contains(event.target)
  ) {
    showSuggestions.value = false
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > 40
}

function handleLogout() {
  userStore.logout()
  mobileMenuOpen.value = false
  router.push('/login')
}

function openAdminChat() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  adminChatOpen.value = !adminChatOpen.value
}

function handleOpenAdminChat() {
  adminChatOpen.value = true
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('admin-chat:open', handleOpenAdminChat)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('admin-chat:open', handleOpenAdminChat)
})
</script>

<style scoped>
.navbar-actions {
  min-height: 36px;
}

.nav-icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 9px;
  color: #9ca3af;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 36px;
  line-height: 1;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.nav-icon-btn > svg {
  display: block;
  width: 19px;
  height: 19px;
  flex-shrink: 0;
}

.nav-icon-btn:hover,
.nav-icon-active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.08);
}

.badge-enter-active {
  animation: badgeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-leave-active {
  animation: badgeOut 0.15s ease;
}

@keyframes badgeIn {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}

@keyframes badgeOut {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(0);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 420px) {
  .navbar-actions {
    gap: 0;
  }

  .nav-icon-btn {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
  }
}
</style>
