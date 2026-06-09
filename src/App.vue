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

    <!-- Fly-to-cart particle -->
    <Teleport to="body">
      <div
        v-for="p in flyParticles"
        :key="p.id"
        class="fly-particle"
        :style="p.style"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
    </Teleport>

    <!-- ─── FLOATING AI CHAT BUTTON ─── -->
    <Teleport to="body">
      <div class="ai-fab-wrapper">
        <!-- Chat Panel: diposisikan absolute menutupi FAB -->
        <Transition name="chat-panel">
          <div v-if="chatOpen" class="ai-chat-panel">
            <!-- Panel Header -->
            <div class="ai-chat-header">
              <div class="flex items-center gap-3">
                <div class="ai-avatar-sm">🤖</div>
                <div>
                  <p class="font-black text-white text-sm">e-BuildPC AI</p>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-green-400 inline-block ai-pulse"></span>
                    <span class="text-xs" style="color: #86efac;">Online sekarang</span>
                  </div>
                </div>
              </div>
              <button @click="chatOpen = false" class="ai-close-btn">✕</button>
            </div>

            <!-- Chat Messages -->
            <div class="ai-messages" ref="messagesContainer">
              <div
                v-for="(msg, i) in messages"
                :key="i"
                class="ai-message"
                :class="msg.role === 'user' ? 'ai-message-user' : 'ai-message-bot'"
              >
                <div v-if="msg.role === 'bot'" class="ai-bot-avatar">🤖</div>
                <div class="ai-bubble" :class="msg.role === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'">
                  {{ msg.content }}
                </div>
              </div>

              <!-- Typing indicator -->
              <div v-if="isTyping" class="ai-message ai-message-bot">
                <div class="ai-bot-avatar">🤖</div>
                <div class="ai-bubble ai-bubble-bot ai-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>

            <!-- Quick Replies -->
            <div class="ai-quick-replies" v-if="messages.length <= 1">
              <button v-for="q in quickReplies" :key="q" @click="sendQuickReply(q)" class="ai-quick-btn">
                {{ q }}
              </button>
            </div>

            <!-- Input -->
            <div class="ai-input-area">
              <input
                v-model="userInput"
                @keydown.enter="sendMessage"
                type="text"
                placeholder="Tanya tentang komponen PC..."
                class="ai-input"
              />
              <button @click="sendMessage" class="ai-send-btn" :disabled="!userInput.trim()">
                ➤
              </button>
            </div>
          </div>
        </Transition>

        <!-- FAB Button: dihapus dari DOM saat panel terbuka (v-if, bukan v-show) -->
        <Transition name="fab-toggle">
          <button
            v-if="!chatOpen"
            id="ai-chat-fab"
            @click="toggleChat"
            class="ai-fab"
            title="Chat dengan AI"
          >
            <span class="fab-icon">🤖</span>
            <!-- Notification dot -->
            <span v-if="hasNotification" class="ai-notif-dot"></span>
          </button>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import FooterSection from './components/FooterSection.vue'
import { cartStore } from './store.js'

const router = useRouter()
const toasts = ref([])
let toastId = 0

// Fly-to-cart animation
const flyParticles = ref([])
let particleId = 0

// ─── AI Chat State ───
const chatOpen = ref(false)
const userInput = ref('')
const isTyping = ref(false)
const hasNotification = ref(true)
const messagesContainer = ref(null)

const messages = ref([
  {
    role: 'bot',
    content: 'Halo! 👋 Saya e-BuildPC AI. Saya bisa membantu Anda memilih komponen PC yang tepat. Ada yang ingin ditanyakan?'
  }
])

const quickReplies = [
  '💻 Rekomendasi PC Gaming',
  '🔧 Tips Merakit PC',
  '💰 Budget 10 Jutaan',
  '❓ Cara Order',
]

const botResponses = {
  'rekomendasi pc gaming': 'Untuk PC gaming 1080p dengan budget terjangkau, saya rekomendasikan: CPU AMD Ryzen 5 7600X + GPU RTX 4060 + RAM 16GB DDR5. Kombinasi ini sangat worth it! Cek katalog kami untuk produk tersedia. 🎮',
  'tips merakit': 'Tips merakit PC: (1) Pasang CPU dulu sebelum masuk casing, (2) Cek kompatibilitas semua komponen, (3) Thermal paste jangan terlalu banyak, (4) Test di luar casing sebelum dipasang. Ada yang ingin ditanyakan lebih lanjut? 🔧',
  'budget 10': 'Dengan budget 10 jutaan, bisa dapat PC gaming 1080p yang solid! Rekomendasi: Ryzen 5 7600 (2.5jt) + RTX 4060 (5jt) + 16GB RAM (700rb) + SSD 500GB (400rb) + Motherboard B650 (1.5jt). Total sekitar 10.1jt. Mantap! 💪',
  'cara order': 'Cara order di e-BuildPC sangat mudah: (1) Pilih produk di Katalog, (2) Klik "Tambah ke Keranjang", (3) Buka halaman Keranjang, (4) Klik Checkout. Bisa juga hubungi kami via WhatsApp untuk pemesanan langsung! 😊',
  default: 'Terima kasih atas pertanyaan Anda! Tim kami akan segera membantu. Sementara itu, Anda bisa cek katalog produk kami atau baca artikel tips di halaman Artikel. Ada pertanyaan lain? 😊'
}

function getBotReply(input) {
  const lower = input.toLowerCase()
  if (lower.includes('gaming') || lower.includes('rekomendasi')) return botResponses['rekomendasi pc gaming']
  if (lower.includes('rakit') || lower.includes('tips')) return botResponses['tips merakit']
  if (lower.includes('budget') || lower.includes('10 juta') || lower.includes('harga')) return botResponses['budget 10']
  if (lower.includes('order') || lower.includes('beli') || lower.includes('cara')) return botResponses['cara order']
  return botResponses.default
}

async function sendMessage() {
  if (!userInput.value.trim()) return
  const text = userInput.value.trim()
  userInput.value = ''
  messages.value.push({ role: 'user', content: text })
  await scrollToBottom()
  isTyping.value = true
  await scrollToBottom()
  setTimeout(async () => {
    isTyping.value = false
    messages.value.push({ role: 'bot', content: getBotReply(text) })
    await scrollToBottom()
  }, 1200)
}

async function sendQuickReply(text) {
  userInput.value = text
  await sendMessage()
}

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function toggleChat() {
  chatOpen.value = !chatOpen.value
  if (chatOpen.value) {
    hasNotification.value = false
    nextTick(() => scrollToBottom())
  }
}

// ─── Existing Fns ───
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

function handleAddToCart(product, event) {
  cartStore.addItem(product)

  // Cari posisi ikon keranjang
  const cartBtn = document.getElementById('cart-btn')
  if (!cartBtn || !event) return

  const cartRect = cartBtn.getBoundingClientRect()
  const sourceRect = event.currentTarget
    ? event.currentTarget.getBoundingClientRect()
    : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 }

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
    }
  })

  // Hapus partikel setelah animasi selesai
  setTimeout(() => {
    flyParticles.value = flyParticles.value.filter(p => p.id !== id)
  }, 700)
}
</script>

<style scoped>
/* ─── Fly-to-cart particle ─── */
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

/* ─── Page Transitions ─── */
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

/* ─── AI FAB Wrapper ─── */
.ai-fab-wrapper {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9000;
  /* Positioning context untuk panel absolute */
}

/* ─── FAB Button ─── */
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
.ai-fab-close {
  animation: none !important;
  background: linear-gradient(135deg, #374151, #1f2937) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
}
@keyframes fab-pulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(79,70,229,0.5), 0 0 0 0 rgba(79,70,229,0.4); }
  50% { box-shadow: 0 8px 32px rgba(79,70,229,0.5), 0 0 0 10px rgba(79,70,229,0); }
}

.fab-icon {
  display: block;
  line-height: 1;
}

/* FAB toggle transition */
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

/* Notification dot */
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
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* ─── Chat Panel ─── */
.ai-chat-panel {
  position: absolute;
  bottom: 0;       /* Rata dengan bawah wrapper = menutupi FAB */
  right: 0;
  width: 460px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07);
  background: #111827;
  /* Tinggi: viewport - navbar (64px) - bottom offset (28px) - sedikit margin (16px) */
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

/* Header */
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
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Messages */
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

/* Typing dots */
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
.ai-typing span:nth-child(2) { animation-delay: 0.2s; }
.ai-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* Quick replies */
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

/* Input area */
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

/* Responsive */
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
