import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
<<<<<<< HEAD

=======
>>>>>>> 30e37d261b6ccb96412709784af17465c862dd27
import App from './App.vue'
import HomePage from './views/HomePage.vue'
import KatalogPage from './views/KatalogPage.vue'
import ArtikelPage from './views/ArtikelPage.vue'
import ArtikelDetailPage from './views/ArtikelDetailPage.vue'
import TentangPage from './views/TentangPage.vue'
import CartPage from './views/CartPage.vue'
import LoginPage from './views/LoginPage.vue'
import RegisterPage from './views/RegisterPage.vue'
import ProductDetailPage from './views/ProductDetailPage.vue'
import BantuanPage from './views/BantuanPage.vue'
import CheckoutPage from './views/CheckoutPage.vue'
import AdminDashboard from './views/admin/AdminDashboard.vue'
import AdminProducts from './views/admin/AdminProducts.vue'
import AdminOrders from './views/admin/AdminOrders.vue'
import AdminUsers from './views/admin/AdminUsers.vue'

import { userStore } from './store.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomePage,
      meta: {
        title: 'e-BuildPC | Beranda',
      },
    },
    {
      path: '/katalog',
      component: KatalogPage,
      meta: {
        title: 'e-BuildPC | Katalog Produk',
      },
    },
    {
      path: '/artikel',
      component: ArtikelPage,
      meta: {
        title: 'e-BuildPC | Artikel',
      },
    },
    {
      path: '/artikel/:id',
      component: ArtikelDetailPage,
      meta: {
        title: 'e-BuildPC | Detail Artikel',
      },
    },
    {
      path: '/tentang',
      component: TentangPage,
      meta: {
        title: 'e-BuildPC | Tentang Kami',
      },
    },
    {
      path: '/bantuan',
      component: BantuanPage,
      meta: {
        title: 'e-BuildPC | Bantuan',
      },
    },
    {
      path: '/cart',
      component: CartPage,
      meta: {
        title: 'e-BuildPC | Keranjang',
        requiresAuth: true,
      },
    },
    {
      path: '/checkout',
      component: CheckoutPage,
      meta: {
        title: 'e-BuildPC | Checkout',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      component: LoginPage,
      meta: {
        title: 'e-BuildPC | Login',
      },
    },
    {
      path: '/register',
      component: RegisterPage,
      meta: {
        title: 'e-BuildPC | Buat Akun',
      },
    },
    {
      path: '/produk/:id',
      component: ProductDetailPage,
      meta: {
        title: 'e-BuildPC | Detail Produk',
      },
    },

    // Admin routes
    {
      path: '/admin',
      component: AdminDashboard,
      meta: {
        title: 'e-BuildPC | Admin Dashboard',
        requiresAuth: true,
        adminOnly: true,
      },
    },
    {
      path: '/admin/produk',
      component: AdminProducts,
      meta: {
        title: 'e-BuildPC | Kelola Produk',
        requiresAuth: true,
        adminOnly: true,
      },
    },
    {
      path: '/admin/pesanan',
      component: AdminOrders,
      meta: {
        title: 'e-BuildPC | Kelola Pesanan',
        requiresAuth: true,
        adminOnly: true,
      },
    },
    {
      path: '/admin/pengguna',
      component: AdminUsers,
      meta: {
        title: 'e-BuildPC | Kelola Pengguna',
        requiresAuth: true,
        adminOnly: true,
      },
    },
  ],

  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = userStore.isLoggedIn
  const isAdmin = userStore.isAdmin

  // Kalau halaman butuh login, tapi belum login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  // Kalau halaman khusus admin, tapi role bukan admin
  if (to.meta.adminOnly && !isAdmin) {
    return next('/')
  }

  // Kalau sudah login tapi buka login/register lagi
  if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    return next(isAdmin ? '/admin' : '/')
  }

  next()
})

router.afterEach((to) => {
  document.title = to.meta.title || 'e-BuildPC'
})

const app = createApp(App)
app.use(router)
app.mount('#app')
