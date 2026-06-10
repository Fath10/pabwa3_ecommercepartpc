<template>
  <RouterLink
    :to="`/produk/${product.id}`"
    class="group relative overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; text-decoration: none;"
  >
    <!-- Badge -->
    <div class="absolute top-2 left-2 z-10">
      <span
        class="px-2 py-0.5 rounded-full text-white font-semibold"
        style="font-size: 10px;"
        :class="badgeClass"
      >{{ product.badge }}</span>
    </div>

    <!-- Product Image — light gray bg -->
    <div
      class="flex items-center justify-center overflow-hidden"
      :style="`background: #f1f5f9; height: ${mini ? '100px' : '170px'}; padding: ${mini ? '8px' : '12px'};`"
    >
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full object-contain group-hover:scale-105 transition-transform duration-400"
        :class="mini ? 'h-20' : 'h-36'"
        loading="lazy"
      />
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1" :class="mini ? 'p-2' : 'p-3'">
      <!-- Product name -->
      <h3
        class="font-semibold mb-1.5 line-clamp-2 leading-snug"
        style="color: #111827;"
        :style="`font-size: ${mini ? '0.7rem' : '0.78rem'};`"
      >{{ product.name }}</h3>

      <!-- Price -->
      <p class="font-bold" :class="mini ? 'mb-1' : 'mb-2'" style="color: #111827;" :style="`font-size: ${mini ? '0.75rem' : '0.85rem'};`">
        {{ formatPrice(product.price) }}
      </p>

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

      <!-- "Tambah" button — disabled when out of stock -->
      <button
        @click.prevent.stop="product.stock > 0 && handleAddToCart($event)"
        :id="`add-to-cart-${product.id}`"
        :disabled="product.stock === 0"
        class="w-full rounded-lg text-white font-semibold flex items-center justify-center gap-1.5 transition-all duration-150"
        :class="[
          product.stock > 0 ? 'active:scale-95' : 'opacity-50 cursor-not-allowed',
          mini ? 'py-1.5' : 'py-2'
        ]"
        :style="product.stock > 0 ? `background: #1e293b; font-size: ${mini ? '0.7rem' : '0.78rem'};` : `background: #6b7280; font-size: ${mini ? '0.7rem' : '0.78rem'};`"
        @mouseenter="e => { if (product.stock > 0) e.currentTarget.style.background='#334155' }"
        @mouseleave="e => { if (product.stock > 0) e.currentTarget.style.background='#1e293b' }"
      >
        <svg v-if="product.stock > 0" class="flex-shrink-0" :class="mini ? 'w-2.5 h-2.5' : 'w-3 h-3'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span v-if="product.stock === 0">Habis</span>
        <span v-else>+ Tambah</span>
      </button>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { formatPrice } from '../store.js'

// Gabungan: mini prop dari remote + handleAddToCart dari fe-1137
const props = defineProps({
  product: { type: Object, required: true },
  mini: { type: Boolean, default: false }
})
const emit = defineEmits(['add-to-cart'])

function handleAddToCart(event) {
  emit('add-to-cart', props.product, event)
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

// Stock computed helpers
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
  if (s === 0) return 'text-red-500'
  if (s <= 10) return 'text-yellow-500'
  return 'text-green-600'
})
</script>
