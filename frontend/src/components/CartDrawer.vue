<template>
  <aside class="drawer" :class="{ open }">
    <div class="head">
      <h3>Tu carrito</h3>
      <button class="close" @click="$emit('close')">✕</button>
    </div>
    <div class="body">
      <p v-if="loading" class="muted">Cargando...</p>
      <p v-else-if="items.length===0" class="muted">Sin items</p>
      <ul v-else class="list">
        <li v-for="it in items" :key="it.item_id" class="row">
          <div class="info">
            <div class="name">Producto #{{ it.producto_id }}</div>
            <div class="sub">Cantidad: {{ it.cantidad }}</div>
          </div>
          <button class="remove" @click="remove(it.item_id)">Eliminar</button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

defineProps({ open: Boolean })

const auth = useAuthStore()
const cart = useCartStore()
const items = computed(() => cart.items)
const loading = computed(() => cart.loading)

async function remove(itemId) {
  const userId = auth.user?.id
  await cart.remove(itemId, userId)
}
</script>

<style scoped>
.drawer { position: fixed; top:0; right:-380px; width: 360px; height: 100vh; background:#fff; box-shadow: -8px 0 24px rgba(0,0,0,.08); transition: right .25s ease; z-index: 40; display:flex; flex-direction:column; }
.drawer.open { right: 0; }
.head { display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid #e5e7eb; }
.body { flex:1; overflow:auto; padding: 10px 12px; }
.muted { color:#6b7280; }
.list { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
.row { display:flex; justify-content:space-between; align-items:center; border:1px solid #e5e7eb; border-radius:10px; padding:10px; }
.name { font-weight:600; }
.sub { color:#6b7280; font-size:12px; }
.remove { border:none; background:#ef4444; color:#fff; padding:6px 10px; border-radius:8px; cursor:pointer; }
.close { border:none; background:transparent; font-size:18px; cursor:pointer; }
</style>

