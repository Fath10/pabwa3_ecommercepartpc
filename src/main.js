import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'

import App from './App.vue'
import { userStore, productStore } from './store.js'

import HomePage from './views/HomePage.vue'
import KatalogPage from './views/KatalogPage.vue'
import ArtikelPage from './views/ArtikelPage.vue'
import ArtikelDetailPage from './views/ArtikelDetailPage.vue'
import TentangPage from './views/TentangPage.vue'
import BantuanPage from './views/BantuanPage.vue'
import CartPage from './views/CartPage.vue'
import CheckoutPage from './views/CheckoutPage.vue'
import LoginPage from './views/LoginPage.vue'
import RegisterPage from './views/RegisterPage.vue'
import ProductDetailPage from './views/ProductDetailPage.vue'
import ProfilePage from './views/ProfilePage.vue'
import OrderDetailPage from './views/OrderDetailPage.vue'
import ForgotPasswordPage from './views/ForgotPasswordPage.vue'
import ResetPasswordPage from './views/ResetPasswordPage.vue'
import NotFoundPage from './views/NotFoundPage.vue'

import AdminDashboard from './views/admin/AdminDashboard.vue'
import AdminProducts from './views/admin/AdminProducts.vue'
import AdminOrders from './views/admin/AdminOrders.vue'
import AdminUsers from './views/admin/AdminUsers.vue'

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
      path: '/forgot-password',
      component: ForgotPasswordPage,
      meta: {
        title: 'e-BuildPC | Lupa Password',
      },
    },
    {
      path: '/reset-password/:token',
      component: ResetPasswordPage,
      meta: {
        title: 'e-BuildPC | Reset Password',
      },
    },
    {
      path: '/produk/:id',
      component: ProductDetailPage,
      meta: {
        title: 'e-BuildPC | Detail Produk',
      },
    },
    {
      path: '/profile',
      component: ProfilePage,
      meta: {
        title: 'e-BuildPC | Profil Saya',
        requiresAuth: true,
      },
    },
    {
      path: '/orders',
      redirect: '/profile',
    },
    {
      path: '/orders/:id',
      component: OrderDetailPage,
      meta: {
        title: 'e-BuildPC | Detail Pesanan',
        requiresAuth: true,
      },
    },

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

    {
      path: '/:pathMatch(.*)*',
      component: NotFoundPage,
      meta: {
        title: 'e-BuildPC | Halaman Tidak Ditemukan',
      },
    },
  ],

  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const isLoggedIn = userStore.isLoggedIn
  const isAdmin = userStore.isAdmin

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.adminOnly && !isAdmin) {
    return '/'
  }

  if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    return isAdmin ? '/admin' : '/'
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.title || 'e-BuildPC'
})

const app = createApp(App)

app.use(router)
app.mount('#app')

userStore.init()
productStore.fetchAll()