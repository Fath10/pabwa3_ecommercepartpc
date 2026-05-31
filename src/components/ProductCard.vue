<template>
  <div
    class="group relative overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; cursor: pointer;"
  >
    <!-- Badge -->
    <div class="absolute top-2 left-2 z-10">
      <span
        class="px-2 py-0.5 rounded-full text-white font-semibold"
        style="font-size: 10px;"
        :class="badgeClass"
      >
        {{ product.badge }}
      </span>
    </div>

    <!-- Product Image -->
    <div
      class="flex items-center justify-center overflow-hidden"
      style="background: #f1f5f9; height: 170px; padding: 12px;"
    >
      <img
        :src="product.image"
        :alt="product.name"
        class="h-36 w-full object-contain group-hover:scale-105 transition-transform duration-400"
        loading="lazy"
      />
    </div>

    <!-- Content -->
    <div class="p-3 flex flex-col flex-1">
      <!-- Category -->
      <p
        class="font-medium mb-1"
        style="color: #6366f1; font-size: 0.68rem;"
      >
        {{ product.category }}
      </p>

      <!-- Product name -->
      <h3
        class="font-semibold mb-1.5 line-clamp-2 leading-snug"
        style="color: #111827; font-size: 0.78rem;"
      >
        {{ product.name }}
      </h3>

      <!-- Price -->
      <p class="font-bold mb-1.5" style="color: #111827; font-size: 0.85rem;">
        {{ formatPrice(product.price) }}
      </p>

      <!-- Stock Info -->
      <p
        class="font-semibold mb-3"
        :class="stockClass"
        style="font-size: 0.72rem;"
      >
        {{ stockText }}
      </p>

      <div class="flex-1"></div>

      <!-- Add to cart button -->
      <button
        @click.stop="handleAddToCart"
        :id="`add-to-cart-${product.id}`"
        :disabled="product.stock === 0"
        class="w-full py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 disabled:active:scale-100"
        :style="{
          background: product.stock === 0 ? '#94a3b8' : '#1e293b',
          fontSize: '0.78rem',
          cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
        }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <svg
          class="w-3 h-3 flex-shrink-0"
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

        {{ product.stock === 0 ? 'Stok Habis' : '+ Tambah' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatPrice } from '../store.js'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const badgeMap = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  blue: 'bg-blue-500',
  cyan: 'bg-teal-600',
  yellow: 'bg-yellow-500'
}

const badgeClass = computed(() => {
  return badgeMap[props.product.badgeColor] || 'bg-indigo-600'
})

const stockText = computed(() => {
  if (props.product.stock === 0) {
    return 'Stok Habis'
  }

  if (props.product.stock <= 5) {
    return `Stok Terbatas (${props.product.stock})`
  }

  return `Tersedia (${props.product.stock})`
})

const stockClass = computed(() => {
  if (props.product.stock === 0) {
    return 'text-red-600'
  }

  if (props.product.stock <= 5) {
    return 'text-orange-500'
  }

  return 'text-green-600'
})

function handleAddToCart() {
  if (props.product.stock === 0) return
  emit('add-to-cart', props.product)
}

function handleMouseEnter(event) {
  if (props.product.stock === 0) return
  event.currentTarget.style.background = '#334155'
}

function handleMouseLeave(event) {
  if (props.product.stock === 0) return
  event.currentTarget.style.background = '#1e293b'
}
</script>