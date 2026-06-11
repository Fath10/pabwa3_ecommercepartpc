<template>
  <RouterLink
    :to="`/produk/${product.id}`"
    class="product-card group relative overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
    :class="mini ? 'product-card-mini' : ''"
  >
    <!-- Badge -->
    <div class="absolute top-2 left-2 z-10">
      <span
        v-if="product.badge"
        class="px-2 py-0.5 rounded-full text-white font-semibold"
        style="font-size: 10px;"
        :class="badgeClass"
      >
        {{ product.badge }}
      </span>
    </div>

    <!-- Product Image -->
    <div
      class="product-image-wrap flex items-center justify-center overflow-hidden"
      :class="mini ? 'product-image-mini' : 'product-image-normal'"
    >
      <img
        v-if="resolvedImage"
        :src="resolvedImage"
        :alt="product.name"
        class="w-full object-contain group-hover:scale-105 transition-transform duration-400"
        :class="mini ? 'h-20' : 'h-36'"
        loading="lazy"
        @error="onImgError"
      />

      <!-- Placeholder jika tidak ada gambar -->
      <div
        v-else
        class="placeholder-box flex flex-col items-center justify-center gap-1"
        :class="mini ? 'h-20' : 'h-36'"
      >
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="text-xs">No Image</span>
      </div>
    </div>

    <!-- Content -->
    <div class="product-content flex flex-col flex-1" :class="mini ? 'p-2' : 'p-3'">
      <!-- Product name -->
      <h3
        class="product-name font-semibold mb-1.5 line-clamp-2 leading-snug"
        :class="mini ? 'product-name-mini' : 'product-name-normal'"
      >
        {{ product.name }}
      </h3>

      <!-- Price -->
      <div class="flex flex-col" :class="mini ? 'mb-1' : 'mb-2'">
        <p
          class="product-price font-bold"
          :class="mini ? 'product-price-mini' : 'product-price-normal'"
        >
          {{ formatPrice(product.price) }}
        </p>

        <span
          v-if="product.overBudget"
          class="over-budget font-bold mt-0.5"
        >
          Melebihi sisa budget
        </span>
      </div>

      <!-- Stock indicator -->
      <div class="flex items-center gap-1.5" :class="mini ? 'mb-2' : 'mb-3'">
        <span
          class="inline-block w-2 h-2 rounded-full flex-shrink-0"
          :class="stockDotClass"
        ></span>

        <span class="text-xs font-medium" :class="stockTextClass">
          {{ stockLabel }}
        </span>
      </div>

      <div class="flex-1"></div>

      <!-- Add button -->
      <button
        @click.prevent.stop="product.stock > 0 && handleAddToCart($event)"
        :id="`add-to-cart-${product.id}`"
        :disabled="product.stock === 0"
        class="add-cart-btn w-full rounded-lg text-white font-semibold flex items-center justify-center gap-1.5 transition-all duration-150"
        :class="[
          product.stock > 0 ? 'active:scale-95' : 'opacity-50 cursor-not-allowed',
          mini ? 'py-1.5 add-cart-mini' : 'py-2 add-cart-normal'
        ]"
      >
        <svg
          v-if="product.stock > 0"
          class="flex-shrink-0"
          :class="mini ? 'w-2.5 h-2.5' : 'w-3 h-3'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        <span v-if="product.stock === 0">Habis</span>
        <span v-else>+ Tambah</span>
      </button>

      <button
        v-if="!mini && !userStore.isAdmin"
        @click.prevent.stop="openAdminChat"
        class="admin-chat-btn w-full mt-2 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all duration-150"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 18.5 3.5 21v-4.6A8 8 0 1 1 7 18.5Z" />
        </svg>
        Chat Admin e-BuildPC
      </button>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { adminChatStore, formatPrice, userStore } from '../store.js'
import { PLACEHOLDER_IMAGE } from '../api/index.js'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  mini: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-to-cart'])
const router = useRouter()

function handleAddToCart(event) {
  emit('add-to-cart', props.product, event)
}

async function openAdminChat() {
  if (!userStore.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: `/produk/${props.product.id}` } })
    return
  }

  await adminChatStore.startProductChat(props.product)
  window.dispatchEvent(new CustomEvent('admin-chat:open'))
}

const API_BASE = 'http://localhost:3000'

const resolvedImage = computed(() => {
  const img = props.product?.image

  if (!img) return null
  if (img.startsWith('/uploads')) return `${API_BASE}${img}`

  return img
})

function onImgError(event) {
  if (event.target.src !== PLACEHOLDER_IMAGE) {
    event.target.src = PLACEHOLDER_IMAGE
  }
}

const badgeMap = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  blue: 'bg-blue-500',
  cyan: 'bg-teal-600',
}

const badgeClass = computed(() => badgeMap[props.product.badgeColor] || 'bg-indigo-600')

const stockLabel = computed(() => {
  const s = props.product.stock ?? 0

  if (s === 0) return 'Stok: 0'

  return `Stok: ${s}`
})

const stockDotClass = computed(() => {
  const s = props.product.stock ?? 0

  if (s === 0) return 'bg-red-500'
  if (s <= 10) return 'bg-yellow-400'

  return 'bg-green-500'
})

const stockTextClass = computed(() => {
  const s = props.product.stock ?? 0

  if (s === 0) return 'text-red-400'
  if (s <= 10) return 'text-yellow-300'

  return 'text-green-300'
})
</script>

<style scoped>
.product-card {
  color: #f8fafc;
  text-decoration: none;
  border-radius: 12px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 27, 75, 0.86));
  border: 1px solid rgba(129, 140, 248, 0.22);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 16px 44px rgba(0, 0, 0, 0.22);
}

.product-card:hover {
  border-color: rgba(167, 139, 250, 0.52);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.28),
    0 24px 62px rgba(79, 70, 229, 0.2);
}

.product-card-mini {
  height: 260px;
  border-radius: 10px;
}

.product-image-wrap {
  background:
    radial-gradient(circle at center, rgba(99, 102, 241, 0.14), transparent 48%),
    rgba(226, 232, 240, 0.08);
  border-bottom: 1px solid rgba(129, 140, 248, 0.14);
}

.product-image-normal {
  height: 170px;
  padding: 12px;
}

.product-image-mini {
  height: 100px;
  padding: 8px;
}

.product-image-wrap img {
  background: transparent;
  filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.22));
}

.placeholder-box {
  color: #64748b;
}

.product-content {
  background: transparent;
}

.product-name {
  color: #f8fafc;
}

.product-name-normal {
  font-size: 0.78rem;
}

.product-name-mini {
  font-size: 0.7rem;
  min-height: 2.4em;
}

.product-price {
  color: #ffffff;
}

.product-price-normal {
  font-size: 0.85rem;
}

.product-price-mini {
  font-size: 0.75rem;
}

.over-budget {
  color: #fb7185;
  font-size: 0.65rem;
  line-height: 1;
}

.add-cart-btn {
  background: linear-gradient(135deg, #1e293b, #312e81);
  border: 1px solid rgba(129, 140, 248, 0.24);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.2);
}

.add-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #334155, #4f46e5);
  border-color: rgba(167, 139, 250, 0.5);
}

.add-cart-btn:disabled {
  background: rgba(100, 116, 139, 0.55);
  border-color: rgba(148, 163, 184, 0.2);
}

.admin-chat-btn {
  color: #c7d2fe;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(129, 140, 248, 0.28);
  font-size: 0.7rem;
}

.admin-chat-btn:hover {
  color: #ffffff;
  background: rgba(79, 70, 229, 0.22);
  border-color: rgba(167, 139, 250, 0.48);
}

.add-cart-normal {
  font-size: 0.78rem;
}

.add-cart-mini {
  font-size: 0.7rem;
}
</style>
