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
      >{{ product.badge }}</span>
    </div>

    <!-- Product Image — light gray bg -->
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
      <!-- Product name -->
      <h3
        class="font-semibold mb-1.5 line-clamp-2 leading-snug"
        style="color: #111827; font-size: 0.78rem;"
      >{{ product.name }}</h3>

      <!-- Price -->
      <p class="font-bold mb-3" style="color: #111827; font-size: 0.85rem;">
        {{ formatPrice(product.price) }}
      </p>

      <div class="flex-1"></div>

      <!-- "Tambah" button — dark charcoal to match reference -->
      <button
        @click.stop="$emit('add-to-cart', product)"
        :id="`add-to-cart-${product.id}`"
        class="w-full py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95"
        style="background: #1e293b; font-size: 0.78rem;"
        @mouseenter="e => e.currentTarget.style.background='#334155'"
        @mouseleave="e => e.currentTarget.style.background='#1e293b'"
      >
        <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        + Tambah
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatPrice } from '../store.js'

const props = defineProps({ product: { type: Object, required: true } })
defineEmits(['add-to-cart'])

const badgeMap = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  blue: 'bg-blue-500',
  cyan: 'bg-teal-600',
}
const badgeClass = computed(() => badgeMap[props.product.badgeColor] || 'bg-indigo-600')
</script>
