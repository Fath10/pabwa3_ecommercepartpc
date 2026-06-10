import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage, meta: { title: 'e-BuildPC | Beranda' } },
    { path: '/katalog', component: KatalogPage, meta: { title: 'e-BuildPC | Katalog Produk' } },
    { path: '/artikel', component: ArtikelPage, meta: { title: 'e-BuildPC | Artikel' } },
    { path: '/artikel/:id', component: ArtikelDetailPage, meta: { title: 'e-BuildPC | Detail Artikel' } },
    { path: '/tentang', component: TentangPage, meta: { title: 'e-BuildPC | Tentang Kami' } },
    { path: '/bantuan', component: BantuanPage, meta: { title: 'e-BuildPC | Bantuan' } },
    { path: '/cart', component: CartPage, meta: { title: 'e-BuildPC | Keranjang' } },
    { path: '/checkout', component: CheckoutPage, meta: { title: 'e-BuildPC | Checkout' } },
    { path: '/login', component: LoginPage, meta: { title: 'e-BuildPC | Login' } },
    { path: '/register', component: RegisterPage, meta: { title: 'e-BuildPC | Buat Akun' } },
    { path: '/produk/:id', component: ProductDetailPage, meta: { title: 'e-BuildPC | Detail Produk' } },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'e-BuildPC'
})

const app = createApp(App)
app.use(router)
app.mount('#app')
