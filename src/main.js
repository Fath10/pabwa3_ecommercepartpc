import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import HomePage from './views/HomePage.vue'
import KatalogPage from './views/KatalogPage.vue'
import ArtikelPage from './views/ArtikelPage.vue'
import TentangPage from './views/TentangPage.vue'
import CartPage from './views/CartPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage, meta: { title: 'e-BuildPC | Beranda' } },
    { path: '/katalog', component: KatalogPage, meta: { title: 'e-BuildPC | Katalog Produk' } },
    { path: '/artikel', component: ArtikelPage, meta: { title: 'e-BuildPC | Artikel' } },
    { path: '/tentang', component: TentangPage, meta: { title: 'e-BuildPC | Tentang Kami' } },
    { path: '/cart', component: CartPage, meta: { title: 'e-BuildPC | Keranjang' } },
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
