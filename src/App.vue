<template>
  <div class="min-h-screen font-sans" style="background: #0d1117;">
    <NavBar :cartCount="cartStore.totalItems" @open-cart="goToCart" />

    <Teleport to="body">
      <div class="fixed top-24 right-4 z-[9999] flex flex-col gap-3">
        <TransitionGroup name="toast">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            class="flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border max-w-xs"
            :class="toast.type === 'success'
              ? 'bg-gradient-to-r from-green-900/90 to-emerald-900/90 border-green-500/30 text-green-100'
              : 'bg-gradient-to-r from-red-900/90 to-rose-900/90 border-red-500/30 text-red-100'"
            style="backdrop-filter: blur(12px);"
          >
            <span class="text-xl">
              {{ toast.type === 'success' ? '✅' : '❌' }}
            </span>

            <span class="text-sm font-medium">
              {{ toast.message }}
            </span>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>

    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" @add-to-cart="handleAddToCart" />
      </Transition>
    </RouterView>

    <FooterSection v-if="!isAdminRoute" />

    <Teleport v-if="!isAdminRoute" to="body">
      <div
        v-for="p in flyParticles"
        :key="p.id"
        class="fly-particle"
        :style="p.style"
      >
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
    </Teleport>

    <Teleport v-if="!isAdminRoute" to="body">
      <div class="ai-fab-wrapper">
        <Transition name="chat-panel">
          <div v-if="chatOpen" class="ai-chat-panel">
            <div class="ai-chat-header">
              <div class="flex items-center gap-3">
                <div class="ai-avatar-sm">🤖</div>

                <div>
                  <p class="font-black text-white text-sm">
                    e-BuildPC AI
                  </p>

                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-green-400 inline-block ai-pulse"></span>
                    <span class="text-xs" style="color: #86efac;">
                      Online sekarang
                    </span>
                  </div>
                </div>
              </div>

              <button @click="chatOpen = false" class="ai-close-btn">
                ✕
              </button>
            </div>

            <div class="ai-messages" ref="messagesContainer">
              <template v-for="(msg, i) in messages" :key="i">
                <div
                  class="ai-message"
                  :class="msg.role === 'user' ? 'ai-message-user' : 'ai-message-bot'"
                >
                  <div v-if="msg.role === 'bot'" class="ai-bot-avatar">
                    🤖
                  </div>

                  <div
                    class="ai-bubble"
                    :class="msg.role === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'"
                  >
                    {{ msg.role === 'bot' ? stripMarkdown(msg.content) : msg.content }}
                  </div>
                </div>

                <div
                  v-if="msg.products && msg.products.length > 0"
                  class="flex items-stretch gap-2 overflow-x-auto py-2 px-1 w-full snap-x snap-mandatory scrollbar-hide flex-shrink-0"
                  style="max-width: 100%;"
                >
                  <div
                    v-for="(prod, idx) in msg.products"
                    :key="prod.id"
                    class="flex-shrink-0 snap-center product-card-animate"
                    style="width: 176px;"
                    :style="{ '--card-delay': `${idx * 80}ms` }"
                  >
                    <ProductCard
                      :product="prod"
                      mini
                      @add-to-cart="handleAddToCart"
                    />
                  </div>
                </div>

              </template>

              <div v-if="isTyping" class="ai-message ai-message-bot">
                <div class="ai-bot-avatar">🤖</div>

                <div class="ai-bubble ai-bubble-bot ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <div class="ai-quick-replies" v-if="messages.length <= 1">
              <button
                v-for="q in quickReplies"
                :key="q"
                @click="sendQuickReply(q)"
                class="ai-quick-btn"
              >
                {{ q }}
              </button>
            </div>

            <div class="ai-input-area">
              <input
                v-model="userInput"
                @keydown.enter="sendMessage"
                type="text"
                placeholder="Tanya tentang komponen PC..."
                class="ai-input"
              />

              <button
                @click="sendMessage"
                class="ai-send-btn"
                :disabled="!userInput.trim()"
              >
                ➤
              </button>
            </div>
          </div>
        </Transition>

        <Transition name="fab-toggle">
          <button
            v-if="!chatOpen"
            id="ai-chat-fab"
            @click="toggleChat"
            class="ai-fab"
            title="Chat dengan AI"
          >
            <span class="fab-icon">🤖</span>
            <span v-if="hasNotification" class="ai-notif-dot"></span>
          </button>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import FooterSection from './components/FooterSection.vue'
import ProductCard from './components/ProductCard.vue'
import { cartStore } from './store.js'
import { API_BASE } from './api/client.js'

const router = useRouter()
const route = useRoute()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const toasts = ref([])
let toastId = 0

function stripMarkdown(text) {
  if (!text) return ''

  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/^[-*]{3,}\s*$/gm, '')
    .replace(/`[^`]+`/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const flyParticles = ref([])
let particleId = 0

const chatOpen = ref(false)
const userInput = ref('')
const isTyping = ref(false)
const hasNotification = ref(true)
const messagesContainer = ref(null)

const confirmingEmptyCart = ref(false)

const messages = ref([
  {
    role: 'bot',
    content: 'Halo! 👋 Saya e-BuildPC AI. Saya bisa membantu Anda memilih komponen PC yang tepat. Ada yang ingin ditanyakan?',
  },
])

// Simpan produk terakhir yang direkomendasikan AI
const lastRecommendedProducts = ref([])

const quickReplies = [
  '🖥️ Rakit PC Gaming 10 Juta',
  '🖥️ Rakit PC Gaming 20 Juta',
  '💻 Rekomendasi PC Gaming',
  '💰 Budget 5 Jutaan',
]

// ─────────────────────────────────────────────────────────────────────────────
// Pola intent "tambah ke keranjang" atau "checkout + rekomendasi"
// Dideteksi di CLIENT sebelum request ke backend
// ─────────────────────────────────────────────────────────────────────────────
const ADD_TO_CART_PATTERNS = [

    // Masukkan / tambahkan ke keranjang (kata kunci keranjang atau ekivalen)
    /\b(masukkan|masukin|tambahkan|tambahin|add|masukin\s+ke|masuk\s+ke)\b.{0,20}\b(keranjang|cart|troli)\b/i,
    /\b(ke\s+keranjang|ke\s+cart|ke\s+troli)\b/i,
    /\b(bawa\s+ke\s+keranjang|bawa\s+ke\s+cart)\b/i,
    // Bisa juga hanya: "masukkan ke keranjang" tanpa menyebut produk apapun
    /\b(masukkan|masukin|tambahkan|tambahin)\b\s*\bke\s*(keranjang|cart|troli)\b/i,
    // Checkout + rekomendasi (jika ada produk terakhir)
    /\b(checkout|chekout|cekout|bayar|pesan)\s*(kan|dong|deh|nih|yuk|aja|sekarang|semua|semuanya)?\b/i,
    // Checklist: beli semua yang direkomendasikan
    /\b(beli\s+semua|beli\s+semuanya|beli\s+semua\s+yang\s+direkomendasikan|order\s+semua|pesan\s+semua)\b/i,
  ]


function isAddToCartIntent(message) {
  const lower = message.toLowerCase().trim()
  return ADD_TO_CART_PATTERNS.some(p => p.test(lower))
}

// ─────────────────────────────────────────────────────────────────────────────
// Deteksi pilih SATU produk spesifik dari rekomendasi
// ─────────────────────────────────────────────────────────────────────────────
// Trigger: pesan harus mengandung kata "tambah/masukkan/beli/order"
const SINGLE_ADD_TRIGGER = /\b(masukkan|masukin|tambahkan|tambahin|beli|add|order|pesan|ambil|mau)\b/i

// Ordinal → index
const ORDINAL_MAP = [
  { pattern: /\b(pertama|pertma|prtama|1\s*st|no\.?\s*1|nomor\s*1|yang\s+1|ke[- ]?1|#1)\b/i, index: 0 },
  { pattern: /\b(kedua|kdua|2\s*nd|no\.?\s*2|nomor\s*2|yang\s+2|ke[- ]?2|#2)\b/i, index: 1 },
  { pattern: /\b(ketiga|ktiga|3\s*rd|no\.?\s*3|nomor\s*3|yang\s+3|ke[- ]?3|#3)\b/i, index: 2 },
  { pattern: /\b(keempat|4\s*th|no\.?\s*4|nomor\s*4|yang\s+4|ke[- ]?4|#4)\b/i, index: 3 },
  { pattern: /\b(kelima|5\s*th|no\.?\s*5|nomor\s*5|yang\s+5|ke[- ]?5|#5)\b/i, index: 4 },
  { pattern: /\b(keenam|6\s*th|no\.?\s*6|nomor\s*6|yang\s+6|ke[- ]?6|#6)\b/i, index: 5 },
]

// Stop words yang diabaikan saat pencarian keyword
const STOP_WORDS = new Set([
  'yang', 'ke', 'di', 'dari', 'untuk', 'dengan', 'dan', 'atau',
  'masukkan', 'masukin', 'tambahkan', 'tambahin', 'beli', 'add',
  'order', 'pesan', 'ambil', 'mau', 'keranjang', 'cart', 'troli',
  'saja', 'aja', 'dong', 'deh', 'nih', 'nya', 'ini', 'itu', 'ada',
  'produk', 'barang', 'item', 'pilih', 'pilihan', 'rekomendasi',
])

function detectSelectedProducts(message, products) {
  if (!products || products.length === 0) return []
  const lower = message.toLowerCase().trim()

  // Harus ada kata trigger "tambah/masukkan/beli/..."
  if (!SINGLE_ADD_TRIGGER.test(lower)) return []

  const selected = new Set()

  // 1. Cek berdasarkan ordinal (pertama, kedua, nomor 1, ...)
  for (const { pattern, index } of ORDINAL_MAP) {
    if (pattern.test(lower) && products[index]) {
      selected.add(products[index])
    }
  }

  // Sinonim untuk komponen PC yang umum
  const SYNONYMS = {
    'case': ['casing', 'chassis', 'kesing'],
    'vga': ['gpu', 'grafis', 'graphic', 'rtx', 'gtx', 'rx', 'radeon', 'geforce'],
    'mobo': ['motherboard', 'mainboard', 'papan'],
    'ram': ['memory', 'memori'],
    'cpu': ['processor', 'prosesor', 'intel', 'amd', 'ryzen', 'core'],
    'psu': ['power supply', 'power'],
    'cooler': ['pendingin', 'heatsink', 'fan', 'aio', 'liquid'],
    'hdd': ['harddisk', 'hardisk', 'storage'],
    'ssd': ['nvme', 'sata', 'storage']
  }

  // 2. Cek berdasarkan keyword yang cocok dengan nama, kategori, atau deskripsi
  const words = lower.split(/\s+/).filter(w => !STOP_WORDS.has(w) && w.length >= 2)
  if (words.length > 0) {
    for (const product of products) {
      const name = (product.name || '').toLowerCase()
      const category = (product.category || '').toLowerCase()
      const desc = (product.description || '').toLowerCase()
      const brand = (product.brand || '').toLowerCase()
      
      let score = 0
      for (let word of words) {
        // Hapus akhiran -nya, -ku, -mu agar "ramnya" jadi "ram"
        word = word.replace(/(nya|ku|mu)$/i, '')
        
        // Kumpulkan semua sinonim untuk kata ini
        let searchTerms = [word]
        for (const [key, aliases] of Object.entries(SYNONYMS)) {
          if (word === key || aliases.includes(word)) {
            searchTerms.push(key, ...aliases)
          }
        }
        
        // Cek ke nama, kategori, deskripsi, atau brand dengan sinonim
        let wordMatched = false
        for (const term of searchTerms) {
          // Pengecualian khusus: Cegah "cpu" cocok dengan "cpu cooler" jika user tidak meminta cooler
          if (['cpu', 'processor', 'prosesor'].includes(term)) {
            const isCoolerProduct = name.includes('cooler') || category.includes('cooler') || desc.includes('cooler') || category.includes('cooling')
            const userWantsCooler = words.some(w => ['cooler', 'fan', 'heatsink', 'aio', 'liquid', 'pendingin'].includes(w.replace(/(nya|ku|mu)$/i, '')))
            if (isCoolerProduct && !userWantsCooler) {
              continue // Lewati produk ini
            }
          }

          if (name.includes(term) || category.includes(term) || desc.includes(term) || (brand && brand.includes(term))) {
            wordMatched = true
            break
          }
        }
        if (wordMatched) score++
      }
      if (score > 0) {
        selected.add(product)
      }
    }
  }

  return Array.from(selected)
}

async function sendMessage() {
  if (!userInput.value.trim() || isTyping.value) return

  const userMsg = userInput.value.trim()
  const lowerMsg = userMsg.toLowerCase()

  // ── Konfirmasi Kosongkan Keranjang ──
  if (confirmingEmptyCart.value) {
    userInput.value = ''
    messages.value.push({ role: 'user', content: userMsg })
    
    confirmingEmptyCart.value = false
    if (/\b(ya|iya|iyah|y|yes|yoi|benar|betul|ok|oke|setuju)\b/i.test(lowerMsg)) {
      cartStore.clearCart()
      messages.value.push({ role: 'bot', content: '✅ Keranjang belanjamu telah dikosongkan.', products: [] })
    } else {
      messages.value.push({ role: 'bot', content: 'Baik, keranjangmu tidak jadi dikosongkan. 😊', products: [] })
    }
    await nextTick()
    await scrollToBottom()
    return
  }

  // ── Kosongkan Keranjang Intent ──
  if (/\b(kosongkan|hapus\s+semua|bersihkan)\b.{0,20}\b(keranjang|cart|troli)\b/i.test(lowerMsg)) {
    userInput.value = ''
    messages.value.push({ role: 'user', content: userMsg })
    
    if (cartStore.items.length === 0) {
      messages.value.push({ role: 'bot', content: 'Keranjang kamu memang sudah kosong kok. 😊', products: [] })
    } else {
      confirmingEmptyCart.value = true
      messages.value.push({ role: 'bot', content: '⚠️ Apakah kamu yakin ingin mengosongkan semua barang di keranjang? (Ketik "Ya" atau "Tidak")', products: [] })
    }
    await nextTick()
    await scrollToBottom()
    return
  }

  // ── Cek Status Keranjang Intent ──
  if (/\b(cek|lihat|apa\s+isi|berapa\s+total|total)\b.{0,20}\b(keranjang|cart|troli|belanjaanku|belanjaan)\b/i.test(lowerMsg)) {
    userInput.value = ''
    messages.value.push({ role: 'user', content: userMsg })

    if (cartStore.items.length === 0) {
      messages.value.push({ role: 'bot', content: 'Keranjang belanjamu saat ini kosong. Mau lihat katalog produk?', products: [] })
    } else {
      const itemsList = cartStore.items.map(item => `- ${item.name} (${item.quantity}x)`).join('\n')
      const totalFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cartStore.totalPrice)
      messages.value.push({
        role: 'bot',
        content: `🛒 **Isi Keranjangmu Saat Ini:**\n${itemsList}\n\n**Total: ${totalFormatted}**\n\nMau lanjut ke halaman checkout sekarang?`,
        products: []
      })
    }
    await nextTick()
    await scrollToBottom()
    return
  }

  // ── Hapus Produk Spesifik dari Keranjang ──
  if (/\b(hapus|buang|remove|keluarkan)\b/i.test(lowerMsg) && !/\b(semua|kosongkan)\b/i.test(lowerMsg)) {
    const words = lowerMsg.split(/\s+/).filter(w => !STOP_WORDS.has(w) && !['hapus', 'buang', 'remove', 'keluarkan'].includes(w) && w.length > 2)
    if (words.length > 0 && cartStore.items.length > 0) {
      let bestItem = null
      let bestScore = 0

      for (const item of cartStore.items) {
        const name = item.name.toLowerCase()
        let score = 0
        for (const word of words) {
          if (name.includes(word)) score++
        }
        if (score > bestScore) {
          bestScore = score
          bestItem = item
        }
      }

      if (bestItem) {
        userInput.value = ''
        messages.value.push({ role: 'user', content: userMsg })
        
        cartStore.removeItem(bestItem.id)
        messages.value.push({ role: 'bot', content: `🗑️ **${bestItem.name}** berhasil dihapus dari keranjang.`, products: [] })
        
        await nextTick()
        await scrollToBottom()
        return
      }
    }
  }

  // ── Prioritas 1: Pilih BEBERAPA produk spesifik dari rekomendasi ──
  if (lastRecommendedProducts.value.length > 0) {
    const pickedProducts = detectSelectedProducts(userMsg, lastRecommendedProducts.value)
    if (pickedProducts.length > 0) {
      userInput.value = ''
      messages.value.push({ role: 'user', content: userMsg })

      isTyping.value = true
      await scrollToBottom(true)
      await new Promise(r => setTimeout(r, 400))
      isTyping.value = false

      // 1. Bubble awal — loading state
      const streamMsg = {
        role: 'bot',
        content: 'Sedang menambahkan produk ke keranjang... 🛒',
        products: [],
      }
      messages.value.push(streamMsg)
      await nextTick()
      await scrollToBottom(true)

      // 2. Tambahkan tiap produk yang dipilih
      const addedNames = []
      const failedNames = []

      for (const product of pickedProducts) {
        const dots = ['⏳', '⌛']
        let dotIdx = 0
        const dotInterval = setInterval(() => {
          const checklist = addedNames.map(n => `✅ ${n}`).join('\n')
          const failed = failedNames.map(n => `❌ ${n}`).join('\n')
          const current = `${dots[dotIdx % 2]} Menambahkan ${product.name}...`
          streamMsg.content = `Sedang menambahkan produk ke keranjang... 🛒\n\n${[checklist, failed, current].filter(Boolean).join('\n')}`
          dotIdx++
        }, 300)

        try {
          await cartStore.addItem(product)
          clearInterval(dotInterval)
          addedNames.push(product.name)
        } catch {
          clearInterval(dotInterval)
          failedNames.push(product.name)
        }

        const checklist = addedNames.map(n => `✅ ${n}`).join('\n')
        const failed = failedNames.map(n => `❌ ${n} (gagal)`).join('\n')
        streamMsg.content = `Sedang menambahkan produk ke keranjang... 🛒\n\n${[checklist, failed].filter(Boolean).join('\n')}`
        await nextTick()
        await scrollToBottom()
        await new Promise(r => setTimeout(r, 150))
      }

      const isCheckoutIntent = /\b(checkout|chekout|cekout|bayar|pesan)\b/i.test(lowerMsg)
      const targetUrl = isCheckoutIntent ? '/checkout' : '/cart'
      const targetLabel = isCheckoutIntent ? 'halaman Checkout' : 'halaman Keranjang'

      // 3. Pesan akhir
      const total = addedNames.length
      const checklist = addedNames.map(n => `✅ ${n}`).join('\n')
      const failed = failedNames.map(n => `❌ ${n} (stok habis)`).join('\n')

      streamMsg.content = `${[checklist, failed].filter(Boolean).join('\n')}\n\n${
        total > 0
          ? `🎉 ${total} produk berhasil ditambahkan!\n\n⏳ Mengarahkan ke ${targetLabel}...`
          : '⚠️ Tidak ada produk yang berhasil ditambahkan.'
      }`

      await nextTick()
      await scrollToBottom()
      
      if (total > 0) {
        await new Promise(r => setTimeout(r, 2000))
        chatOpen.value = false
        await router.push(targetUrl)
      }
      return
    }
  }

  // ── Prioritas 2: Tambah SEMUA produk rekomendasi ke keranjang ──
  if (lastRecommendedProducts.value.length > 0 && isAddToCartIntent(userMsg)) {
    userInput.value = ''

    messages.value.push({ role: 'user', content: userMsg })

    const eligible = lastRecommendedProducts.value.filter(p => p.stock > 0)

    isTyping.value = true
    await scrollToBottom(true)
    await new Promise(r => setTimeout(r, 400))
    isTyping.value = false

    // 1. Bubble awal — loading state
    const streamMsg = {
      role: 'bot',
      content: 'Sedang menambahkan produk ke keranjang... 🛒',
      products: [],
    }

    if (eligible.length === 0) {
      streamMsg.content = 'Maaf, semua produk yang saya rekomendasikan sedang habis stok. Coba cari produk lain ya! 😊'
      messages.value.push(streamMsg)
      await nextTick()
      await scrollToBottom()
      lastRecommendedProducts.value = []
      return
    }

    messages.value.push(streamMsg)
    await nextTick()
    await scrollToBottom(true)

    // 2. Tambahkan tiap produk satu per satu & update bubble secara live
    const addedNames = []
    const failedNames = []

    for (const product of eligible) {
      // Animasi loading dots saat menambahkan produk ini
      const dots = ['⏳', '⌛']
      let dotIdx = 0
      const dotInterval = setInterval(() => {
        const checklist = addedNames.map(n => `✅ ${n}`).join('\n')
        const failed = failedNames.map(n => `❌ ${n}`).join('\n')
        const current = `${dots[dotIdx % 2]} Menambahkan ${product.name}...`
        streamMsg.content = `Sedang menambahkan produk ke keranjang... 🛒\n\n${[checklist, failed, current].filter(Boolean).join('\n')}`
        dotIdx++
      }, 300)

      try {
        await cartStore.addItem(product)
        clearInterval(dotInterval)
        addedNames.push(product.name)
      } catch {
        clearInterval(dotInterval)
        failedNames.push(product.name)
      }

      // Update bubble setelah produk ini selesai
      const checklist = addedNames.map(n => `✅ ${n}`).join('\n')
      const failed = failedNames.map(n => `❌ ${n} (gagal)`).join('\n')
      streamMsg.content = `Sedang menambahkan produk ke keranjang... 🛒\n\n${[checklist, failed].filter(Boolean).join('\n')}`
      await nextTick()
      await scrollToBottom()
      await new Promise(r => setTimeout(r, 150))
    }

    // 3. Pesan akhir — ringkasan hasil
    const isCheckoutIntent = /\b(checkout|chekout|cekout|bayar|pesan)\b/i.test(lowerMsg)
    const targetUrl = isCheckoutIntent ? '/checkout' : '/cart'
    const targetLabel = isCheckoutIntent ? 'halaman Checkout' : 'halaman Keranjang'

    const total = addedNames.length
    const checklist = addedNames.map(n => `✅ ${n}`).join('\n')
    const failed = failedNames.map(n => `❌ ${n} (stok habis)`).join('\n')

    streamMsg.content = `${[checklist, failed].filter(Boolean).join('\n')}\n\n${
      total > 0
        ? `🎉 ${total} produk berhasil ditambahkan!\n\n⏳ Mengarahkan ke ${targetLabel}...`
        : '⚠️ Tidak ada produk yang berhasil ditambahkan.'
    }`

    await nextTick()
    await scrollToBottom()
    lastRecommendedProducts.value = []

    if (total > 0) {
      await new Promise(r => setTimeout(r, 2000))
      chatOpen.value = false
      await router.push(targetUrl)
    }

    return
  }

  userInput.value = ''

  messages.value.push({
    role: 'user',
    content: userMsg,
  })

  let aiMsg = null

  isTyping.value = true
  await scrollToBottom(true)

  try {
    const response = await fetch(`${API_BASE}/api/chat-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMsg,
        history: messages.value
          .slice(-6)
          .filter((_, i) => i < messages.value.length - 1)
          .map((msg) => ({
            role: msg.role,
            text: msg.content,
          })),
      }),
    })

    if (!response.ok) {
      throw new Error('Gagal menghubungi server AI.')
    }

    // ── Deteksi response non-streaming (JSON) — greeting, navigate, blocked ──
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const json = await response.json()
      isTyping.value = false

      aiMsg = {
        role: 'bot',
        content: json.reply || '⚠️ Tidak ada respons.',
        isStreaming: false,
        products: [],
        isNavigating: json.action === 'navigate',
      }
      messages.value.push(aiMsg)
      await scrollToBottom()

      // Jika ada action navigate, tampilkan pesan dulu → tunggu user baca → redirect
      if (json.action === 'navigate' && json.url) {
        // Pastikan Vue render pesan dulu
        await nextTick()
        await scrollToBottom()
        // Tunggu user baca (4 detik), baru redirect
        await new Promise(r => setTimeout(r, 4000))
        chatOpen.value = false
        await router.push(json.url)
      }
      return
    }

    // ── Streaming SSE response (Ollama) ──
    if (!response.body) {
      throw new Error('Browser tidak mendukung stream response.')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    let buffer = ''
    let fullTextBuffer = ''
    let productsBuffer = []

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, {
        stream: true,
      })

      const lines = buffer.split('\n\n')
      buffer = lines.pop()

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue

        let json

        try {
          json = JSON.parse(line.slice(6))
        } catch {
          continue
        }

        if (json.token) {
          fullTextBuffer += json.token
        } else if (json.type === 'products') {
          productsBuffer = json.products || []
        } else if (json.reply) {
          fullTextBuffer += json.reply
        }
      }
    }

    isTyping.value = false

    aiMsg = {
      role: 'bot',
      content: fullTextBuffer || '⚠️ Tidak ada respons dari server.',
      isStreaming: false,
      products: [],
    }

    messages.value.push(aiMsg)

    await scrollToBottom()

    if (productsBuffer && productsBuffer.length > 0) {
      lastRecommendedProducts.value = productsBuffer
      setTimeout(async () => {
        const lastMsg = messages.value[messages.value.length - 1]

        if (lastMsg && lastMsg.role === 'bot') {
          lastMsg.products = productsBuffer
          await nextTick()
          await scrollToBottom()
        }
      }, 700)
    }
  } catch (err) {
    console.error('Stream error:', err)

    if (!aiMsg) {
      messages.value.push({
        role: 'bot',
        content:
          err.message ||
          '⚠️ Gagal menghubungi server.',
        isStreaming: false,
        products: [],
      })
    } else {
      aiMsg.content = '⚠️ Gagal menghubungi server.'
      aiMsg.isStreaming = false
    }
  } finally {
    isTyping.value = false
    await scrollToBottom()
  }
}


async function addAllToCart(products) {
  // Cari pesan yang punya produk ini dan set loading state
  const targetMsg = messages.value.find(m => m.products === products)
  if (targetMsg) targetMsg._addingAll = true

  const eligible = products.filter(p => p.stock > 0)
  let addedCount = 0

  for (const product of eligible) {
    try {
      await cartStore.addItem(product)
      addedCount++
    } catch (err) {
      // skip produk yang gagal
    }
  }

  if (targetMsg) targetMsg._addingAll = false

  if (addedCount > 0) {
    showToast(`${addedCount} produk berhasil ditambahkan ke keranjang 🛒`, 'success')
    lastRecommendedProducts.value = []
  } else {
    showToast('Gagal menambahkan produk ke keranjang', 'error')
  }
}

async function sendQuickReply(text) {
  userInput.value = text
  await sendMessage()
}

async function scrollToBottom(force = false) {
  await nextTick()

  if (messagesContainer.value) {
    const element = messagesContainer.value
    const distanceFromBottom =
      element.scrollHeight -
      element.scrollTop -
      element.clientHeight

    if (force || distanceFromBottom < 50) {
      element.scrollTop = element.scrollHeight
    }
  }
}

function toggleChat() {
  chatOpen.value = !chatOpen.value

  if (chatOpen.value) {
    hasNotification.value = false
    nextTick(() => scrollToBottom(true))
  }
}

function goToCart() {
  router.push('/cart')
}

function showToast(message, type = 'success') {
  const id = ++toastId

  toasts.value.push({
    id,
    message,
    type,
  })

  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }, 3000)
}

async function handleAddToCart(product, event) {
  try {
    await cartStore.addItem(product)
    showToast(`${product.name} ditambahkan ke keranjang`, 'success')
  } catch (err) {
    showToast(err.message || 'Gagal menambahkan produk ke keranjang', 'error')
    return
  }

  const cartBtn = document.getElementById('cart-btn')

  if (!cartBtn || !event) return

  const cartRect = cartBtn.getBoundingClientRect()
  const sourceRect = event.currentTarget
    ? event.currentTarget.getBoundingClientRect()
    : {
        left: window.innerWidth / 2,
        top: window.innerHeight / 2,
        width: 0,
        height: 0,
      }

  const startX = sourceRect.left + sourceRect.width / 2
  const startY = sourceRect.top + sourceRect.height / 2
  const endX = cartRect.left + cartRect.width / 2
  const endY = cartRect.top + cartRect.height / 2

  const id = ++particleId

  flyParticles.value.push({
    id,
    style: {
      '--start-x': `${startX}px`,
      '--start-y': `${startY}px`,
      '--end-x': `${endX}px`,
      '--end-y': `${endY}px`,
    },
  })

  setTimeout(() => {
    flyParticles.value = flyParticles.value.filter((particle) => particle.id !== id)
  }, 700)
}
</script>

<style scoped>
.fly-particle {
  position: fixed;
  left: var(--start-x);
  top: var(--start-y);
  z-index: 99999;
  pointer-events: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  animation: fly-to-cart 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes fly-to-cart {
  0% {
    left: var(--start-x);
    top: var(--start-y);
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  60% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.85);
  }

  100% {
    left: var(--end-x);
    top: var(--end-y);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.ai-fab-wrapper {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9000;
}

.ai-fab {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.5), 0 0 0 0 rgba(79,70,229,0.4);
  animation: fab-pulse 2.5s infinite;
}

.ai-fab:hover {
  transform: scale(1.12);
  box-shadow: 0 12px 40px rgba(79, 70, 229, 0.7);
}

@keyframes fab-pulse {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(79,70,229,0.5), 0 0 0 0 rgba(79,70,229,0.4);
  }

  50% {
    box-shadow: 0 8px 32px rgba(79,70,229,0.5), 0 0 0 10px rgba(79,70,229,0);
  }
}

.fab-icon {
  display: block;
  line-height: 1;
}

.fab-toggle-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fab-toggle-leave-active {
  transition: all 0.2s ease;
  position: absolute;
  bottom: 0;
  right: 0;
}

.fab-toggle-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-45deg);
}

.fab-toggle-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(45deg);
}

.ai-notif-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #0d1117;
  animation: notif-bounce 1s infinite;
}

@keyframes notif-bounce {
  0%, 100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

.ai-chat-panel {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 460px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07);
  background: #111827;
  max-height: calc(100vh - 64px - 28px - 16px);
  height: calc(100vh - 64px - 28px - 16px);
}

.chat-panel-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-panel-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.chat-panel-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.9);
  transform-origin: bottom right;
}

.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.92);
  transform-origin: bottom right;
}

.ai-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.ai-avatar-sm {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(99,102,241,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.ai-close-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.08);
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.ai-close-btn:hover {
  background: rgba(255,255,255,0.15);
  color: #fff;
}

.ai-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

.ai-message {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  animation: messageSlideIn 0.4s ease-out forwards;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-message-user {
  flex-direction: row-reverse;
}

.ai-bot-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(99,102,241,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.ai-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.82rem;
  line-height: 1.5;
}

.ai-bubble-user {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.ai-bubble-bot {
  background: rgba(255,255,255,0.06);
  color: #e2e8f0;
  border: 1px solid rgba(255,255,255,0.08);
  border-bottom-left-radius: 4px;
}

.ai-typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
}

.ai-typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6366f1;
  animation: typing 1.2s infinite ease-in-out;
}

.ai-typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.ai-typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.product-card-animate {
  animation: cardSlideIn 0.5s ease-out forwards;
  animation-delay: var(--card-delay, 0ms);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(16px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.ai-quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 16px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.ai-quick-btn {
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px solid rgba(99,102,241,0.35);
  background: rgba(79,70,229,0.1);
  color: #a5b4fc;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.ai-quick-btn:hover {
  background: rgba(79,70,229,0.25);
  border-color: rgba(99,102,241,0.6);
  color: #fff;
}

.ai-input-area {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid rgba(255,255,255,0.07);
  background: #0d1117;
}

.ai-input {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 9px 14px;
  color: #fff;
  font-size: 0.82rem;
  outline: none;
  transition: border-color 0.2s;
}

.ai-input:focus {
  border-color: #4f46e5;
}

.ai-input::placeholder {
  color: #475569;
}

.ai-send-btn {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-send-btn:hover:not(:disabled) {
  transform: scale(1.08);
}

.ai-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 540px) {
  .ai-fab-wrapper {
    bottom: 18px;
    right: 16px;
  }

  .ai-chat-panel {
    width: calc(100vw - 32px);
    max-height: 480px;
  }
}
</style>

