<template>
  <div class="card" @click="$emit('open')">
    <img :src="imageUrl" :alt="product.nombre" @error="onError" />
    <h4 class="name">{{ product.nombre }}</h4>
    <div class="price">$ {{ product.precio }}</div>
    <button class=" more" @click.stop="$emit('open')">Más info</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getImageForProduct } from '../utils/images'

const props = defineProps({ product: { type: Object, required: true } })

const imageUrl = computed(() => getImageForProduct(props.product) || '')

function onError(e) {
  // Use the utility fallback if direct URL fails
  e.target.src = getImageForProduct(props.product) || ''
}
</script>

<style scoped>
.card { background:#fff; border-radius:10px; box-shadow: 0 6px 16px rgba(0,0,0,.08); padding:12px; text-align:center; display:grid; gap:10px; cursor:pointer; }
.card img { width:100%; height:140px; object-fit:contain; }
.name { font-weight:700; min-height: 40px; }
.price { font-weight:700; color:#111827; }
.more { background:#2563eb; color:#fff; border:none; padding:8px 10px; border-radius:8px; cursor:pointer; }
</style>

