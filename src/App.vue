<template>
  <div class="min-h-screen font-sans" style="background: #0d1117;">
    <!-- Navbar -->
    <NavBar :cartCount="cartStore.totalItems" @open-cart="goToCart" />

    <!-- Toast Notifications -->
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
            <span class="text-xl">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
            <span class="text-sm font-medium">{{ toast.message }}</span>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>

    <!-- Router View -->
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" @add-to-cart="handleAddToCart" />
      </Transition>
    </RouterView>

    <!-- Footer -->
    <FooterSection />

    <!-- ════════════════════════════════════════════
         FLOATING AI CHAT BUTTON (Global, fixed)
         Selalu di pojok kanan bawah di semua halaman.
    ════════════════════════════════════════════ -->
    <Teleport to="body">
      <!-- Panel chat (stub, siap diisi backend) -->
      <Transition name="chat-panel">
        <div
          v-if="chatOpen"
          class="fixed right-6 z-[9998] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          :style="{
            top: navbarHeight + 12 + 'px',
            bottom: '24px',
            width: 'min(420px, calc(100vw - 3rem))',
            background: '#161b22',
            border: '1px solid rgba(255,255,255,0.1)',
          }"
        >
          <!-- Header panel -->
          <div class="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
            style="background: #0d1117; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">
                🤖
              </div>
              <div>
                <p class="text-sm font-bold text-white leading-none">Asisten e-BuildPC</p>
                <p class="text-[11px] text-green-400 mt-1">● Online</p>
              </div>
            </div>
            <button @click="chatOpen = false"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all text-lg">
              ×
            </button>
          </div>

          <!-- Area pesan -->
          <div ref="chatBody" class="flex-1 overflow-y-auto p-4 space-y-3">
            <div v-for="(msg, i) in chatMessages" :key="i" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
              <div
                class="px-4 py-2.5 rounded-2xl text-sm max-w-[80%] leading-relaxed"
                :class="msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'text-gray-200 rounded-bl-sm'"
                :style="msg.role === 'user' ? '' : 'background: rgba(255,255,255,0.06);'"
              >{{ msg.text }}</div>
            </div>
            <div v-if="chatLoading" class="flex items-center gap-2 text-xs text-gray-500 italic">
              <span class="animate-pulse">●</span>
              <span class="animate-pulse" style="animation-delay:0.2s">●</span>
              <span class="animate-pulse" style="animation-delay:0.4s">●</span>
              <span class="ml-1">Asisten sedang mengetik…</span>
            </div>
          </div>

          <!-- Input -->
          <div class="p-4 flex gap-2 flex-shrink-0" style="border-top: 1px solid rgba(255,255,255,0.08);">
            <input
              v-model="chatInput"
              @keyup.enter="sendChatMessage"
              type="text"
              placeholder="Tanya soal rakitan PC…"
              class="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm text-white"
              style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);"
            />
            <button @click="sendChatMessage"
              class="px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 flex items-center gap-1"
              style="background: linear-gradient(135deg, #4f46e5, #7c3aed);">
              ➤
            </button>
          </div>
        </div>
      </Transition>

      <!-- Tombol FAB lingkaran -->
      <Transition name="fab">
        <button
          v-if="!chatOpen"
          id="ai-chat-fab"
          @click="toggleChat"
          title="Tanya Asisten AI"
          class="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 animate-pulse-glow"
          style="background: linear-gradient(135deg, #4f46e5, #7c3aed);"
        >
          🤖
        </button>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import FooterSection from './components/FooterSection.vue'
import { cartStore } from './store.js'

const router = useRouter()
const toasts = ref([])
let toastId = 0

function goToCart() {
  router.push('/cart')
}

function showToast(message, type = 'success') {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}

function handleAddToCart(product) {
  cartStore.addItem(product)
  showToast(`${product.name} ditambahkan ke keranjang!`)
}

// ════════════════════════════════════════════
// LOGIKA FLOATING CHAT AI (stub / draf)
// ════════════════════════════════════════════
const chatOpen = ref(false)
const chatInput = ref('')
const chatLoading = ref(false)
const chatBody = ref(null)
const navbarHeight = ref(64) // default fallback
const chatMessages = ref([
  { role: 'assistant', text: 'Halo! 👋 Saya asisten e-BuildPC. Ada yang bisa saya bantu soal rakitan PC Anda?' },
])

// Deteksi tinggi navbar secara dinamis
function updateNavbarHeight() {
  const nav = document.querySelector('nav')
  if (nav) navbarHeight.value = nav.offsetHeight
}
onMounted(() => {
  updateNavbarHeight()
  window.addEventListener('resize', updateNavbarHeight)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateNavbarHeight)
})

function toggleChat() {
  chatOpen.value = !chatOpen.value
  if (chatOpen.value) {
    updateNavbarHeight()
  }
  // Alternatif: jika ingin pindah ke halaman chat khusus, ganti baris di atas dengan:
  // router.push('/chat')
}

async function scrollChatToBottom() {
  await nextTick()
  if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
}

async function sendChatMessage() {
  const text = chatInput.value.trim()
  if (!text || chatLoading.value) return

  // Tampilkan pesan pengguna
  chatMessages.value.push({ role: 'user', text })
  chatInput.value = ''
  chatLoading.value = true
  await scrollChatToBottom()

  try {
    // ──────────────────────────────────────────────
    // TODO (Integrasi Backend Ollama + Express.js):
    // Ganti blok di bawah ini dengan pemanggilan API Anda.
    // Contoh:
    //
    // const res = await fetch('http://localhost:3000/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     model: 'llama3',
    //     messages: chatMessages.value.map(m => ({ role: m.role, content: m.text })),
    //   }),
    // })
    // const data = await res.json()
    // chatMessages.value.push({ role: 'assistant', text: data.reply })
    // ──────────────────────────────────────────────

    // Placeholder respons sementara (hapus saat backend siap):
    await new Promise(r => setTimeout(r, 700))
    chatMessages.value.push({
      role: 'assistant',
      text: 'Fitur AI sedang dalam pengembangan. Backend Ollama + Express.js akan segera terhubung di sini. 🚧',
    })
  } catch (err) {
    chatMessages.value.push({
      role: 'assistant',
      text: '⚠️ Maaf, terjadi kesalahan saat menghubungi server. Coba lagi nanti ya.',
    })
  } finally {
    chatLoading.value = false
    await scrollChatToBottom()
  }
}
</script>

<style scoped>
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

/* Animasi panel chat */
.chat-panel-enter-active,
.chat-panel-leave-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Animasi FAB muncul/hilang */
.fab-enter-active,
.fab-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>