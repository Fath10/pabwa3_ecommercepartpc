<template>
  <div class="chat-panel">
    <header class="chat-header">
      <div>
        <strong>{{ adminChatStore.activeThread ? chatTitle : 'Chat Admin e-BuildPC' }}</strong>
        <span>{{ adminChatStore.activeThread ? chatSubtitle : 'Riwayat percakapan produk' }}</span>
      </div>
      <button @click="$emit('close')" title="Tutup" aria-label="Tutup chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" stroke-width="2" />
        </svg>
      </button>
    </header>

    <template v-if="!userStore.isLoggedIn">
      <div class="chat-empty">
        <strong>Login untuk menggunakan chat admin</strong>
        <RouterLink to="/login" @click="$emit('close')">Login Sekarang</RouterLink>
      </div>
    </template>

    <template v-else-if="!adminChatStore.activeThread">
      <div class="thread-list">
        <div
          v-for="thread in adminChatStore.threads"
          :key="thread.thread_id"
          class="thread-row"
          role="button"
          tabindex="0"
          @click="adminChatStore.openThread(thread.thread_id)"
          @keydown.enter="adminChatStore.openThread(thread.thread_id)"
        >
          <img :src="thread.product_image || '/logo.png'" :alt="thread.product_name || 'Produk'" />
          <span class="thread-copy">
            <strong>{{ userStore.isAdmin ? thread.customer_name : thread.product_name }}</strong>
            <small v-if="userStore.isAdmin">{{ thread.product_name }}</small>
            <small>{{ thread.last_message || 'Belum ada pesan' }}</small>
          </span>
          <button class="delete-btn" title="Hapus riwayat" @click.stop="removeThread(thread.thread_id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 7h16m-10 4v6m4-6v6M9 7l1-3h4l1 3m3 0-1 13H7L6 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
            </svg>
          </button>
        </div>

        <div v-if="!adminChatStore.threads.length" class="chat-empty">
          <strong>Belum ada riwayat chat</strong>
          <span v-if="!userStore.isAdmin">Buka produk lalu pilih Chat Admin e-BuildPC.</span>
          <span v-else>Percakapan pelanggan akan muncul di sini.</span>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="conversation-toolbar">
        <button @click="backToThreads">← Riwayat</button>
        <button class="danger" @click="removeThread(adminChatStore.activeThread.thread_id)">Hapus Chat</button>
      </div>

      <div ref="messageBox" class="message-list">
        <div v-if="!adminChatStore.messages.length" class="chat-empty compact">
          <strong>Mulai percakapan</strong>
          <span>Tanyakan stok, spesifikasi, atau informasi produk kepada admin.</span>
        </div>
        <div
          v-for="message in adminChatStore.messages"
          :key="message.message_id"
          class="message-row"
          :class="isOwnMessage(message) ? 'own' : 'other'"
        >
          <div class="message-bubble">
            <span>{{ message.message }}</span>
            <small>{{ formatTime(message.created_at) }}</small>
          </div>
        </div>
      </div>

      <form class="message-form" @submit.prevent="send">
        <input v-model="message" placeholder="Tulis pesan kepada admin..." maxlength="1000" />
        <button :disabled="!message.trim() || adminChatStore.sending" title="Kirim pesan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
          </svg>
        </button>
      </form>
    </template>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { adminChatStore, userStore } from '../store.js'

defineEmits(['close'])

const message = ref('')
const messageBox = ref(null)
let pollTimer

const chatTitle = computed(() =>
  userStore.isAdmin
    ? adminChatStore.activeThread?.customer_name || 'Pelanggan'
    : 'Admin e-BuildPC'
)
const chatSubtitle = computed(() => adminChatStore.activeThread?.product_name || 'Percakapan produk')

function isOwnMessage(item) {
  return item.sender_role === (userStore.isAdmin ? 'admin' : 'user')
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function backToThreads() {
  adminChatStore.activeThread = null
  adminChatStore.messages.splice(0)
  adminChatStore.fetchThreads()
}

async function send() {
  const value = message.value
  message.value = ''
  await adminChatStore.sendMessage(value)
  await scrollBottom()
}

async function removeThread(threadId) {
  if (!window.confirm('Hapus seluruh riwayat percakapan ini?')) return
  await adminChatStore.deleteThread(threadId)
}

async function scrollBottom() {
  await nextTick()
  if (messageBox.value) messageBox.value.scrollTop = messageBox.value.scrollHeight
}

watch(() => adminChatStore.messages.length, scrollBottom)

onMounted(async () => {
  await adminChatStore.fetchThreads()
  await scrollBottom()
  pollTimer = setInterval(async () => {
    if (adminChatStore.activeThread) {
      await adminChatStore.openThread(adminChatStore.activeThread.thread_id)
    } else {
      await adminChatStore.fetchThreads()
    }
  }, 5000)
})

onUnmounted(() => clearInterval(pollTimer))
</script>

<style scoped>
.chat-panel { position: fixed; z-index: 80; top: 64px; right: 12px; width: min(420px, calc(100vw - 24px)); height: min(620px, calc(100dvh - 80px)); display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(255,255,255,.1); border-radius: 18px; background: #101621; box-shadow: 0 26px 80px rgba(0,0,0,.55); }
.chat-header { min-height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.08); background: linear-gradient(135deg, rgba(79,70,229,.22), rgba(15,23,42,.4)); }
.chat-header > div { min-width: 0; }.chat-header strong,.chat-header span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.chat-header strong { color: #fff; font-size: .86rem; }.chat-header span { margin-top: 2px; color: #8290a3; font-size: .66rem; }.chat-header button { width: 34px; height: 34px; display: grid; place-items: center; flex-shrink: 0; border-radius: 9px; color: #94a3b8; background: rgba(255,255,255,.06); cursor: pointer; }.chat-header button:hover { color: #fff; background: rgba(255,255,255,.11); }.chat-header button svg { width: 17px; height: 17px; }
.thread-list,.message-list { flex: 1; overflow-y: auto; padding: 10px; }
.thread-row { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 13px; color: #fff; text-align: left; transition: .2s; }.thread-row:hover { background: rgba(255,255,255,.055); }.thread-row img { width: 46px; height: 46px; flex-shrink: 0; border-radius: 10px; object-fit: cover; background: rgba(255,255,255,.05); }
.thread-copy { min-width: 0; flex: 1; }.thread-copy strong,.thread-copy small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.thread-copy strong { font-size: .75rem; }.thread-copy small { margin-top: 2px; color: #718096; font-size: .62rem; }.delete-btn { width: 30px; height: 30px; display: grid; place-items: center; flex-shrink: 0; border-radius: 8px; color: #fb7185; opacity: .55; }.delete-btn:hover { opacity: 1; background: rgba(244,63,94,.1); }.delete-btn svg { width: 15px; }
.conversation-toolbar { display: flex; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,.07); }.conversation-toolbar button { color: #94a3b8; font-size: .65rem; font-weight: 700; }.conversation-toolbar .danger { color: #fb7185; }
.message-list { display: flex; flex-direction: column; gap: 8px; padding: 14px; }.message-row { display: flex; }.message-row.own { justify-content: flex-end; }.message-bubble { max-width: 82%; padding: 9px 11px; border-radius: 13px; background: rgba(255,255,255,.07); color: #dce5f1; font-size: .72rem; line-height: 1.5; }.own .message-bubble { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; }.message-bubble small { display: block; margin-top: 4px; color: rgba(255,255,255,.45); font-size: .52rem; text-align: right; }
.message-form { display: flex; gap: 8px; padding: 12px; padding-bottom: max(12px, env(safe-area-inset-bottom)); border-top: 1px solid rgba(255,255,255,.08); background: #0c111a; }.message-form input { min-width: 0; flex: 1; padding: 10px 12px; border: 1px solid rgba(255,255,255,.1); border-radius: 11px; outline: none; background: rgba(255,255,255,.05); color: #fff; font-size: .72rem; }.message-form input:focus { border-color: #6366f1; }.message-form button { width: 38px; min-width: 38px; display: grid; place-items: center; border-radius: 11px; background: #4f46e5; color: #fff; }.message-form button:disabled { opacity: .4; }.message-form svg { width: 17px; }
.chat-empty { flex: 1; display: grid; place-content: center; justify-items: center; gap: 7px; padding: 30px; color: #718096; text-align: center; }.chat-empty.compact { flex: none; margin: auto; }.chat-empty strong { color: #dce5f1; font-size: .78rem; }.chat-empty span { font-size: .66rem; }.chat-empty a { margin-top: 8px; padding: 8px 12px; border-radius: 9px; background: #4f46e5; color: #fff; font-size: .7rem; font-weight: 700; }

@media (max-width: 768px) {
  .chat-panel {
    top: 58px;
    right: 8px;
    width: min(460px, calc(100vw - 16px));
    height: calc(100dvh - 66px);
    border-radius: 16px;
  }
}

@media (max-width: 540px) {
  .chat-panel {
    inset: 0;
    width: 100vw;
    height: 100dvh;
    max-width: none;
    border: 0;
    border-radius: 0;
  }

  .chat-header {
    min-height: 62px;
    padding-top: max(14px, env(safe-area-inset-top));
  }

  .thread-list {
    padding: 8px;
  }

  .thread-row {
    gap: 11px;
    padding: 11px 9px;
  }

  .thread-row img {
    width: 50px;
    height: 50px;
  }

  .thread-copy strong {
    font-size: .8rem;
  }

  .thread-copy small,
  .conversation-toolbar button {
    font-size: .68rem;
  }

  .message-list {
    padding: 12px 10px;
  }

  .message-bubble {
    max-width: 88%;
    font-size: .78rem;
  }

  .message-form input {
    font-size: 16px;
  }
}
</style>
