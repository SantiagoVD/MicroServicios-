<template>
  <header class="nav">
    <div class="brand" @click="$router.push('/products')">E-COMMERCE</div>
    <nav class="links">
      <router-link to="/products">Productos</router-link>
    </nav>
    <div class="actions">
      <button class="cart-btn" @click="$emit('toggle-cart')">
        Carrito
        <span v-if="badge>0" class="badge">{{ badge }}</span>
      </button>
      <button v-if="isAuth" class="ghost" @click="logout">Salir</button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
const isAuth = computed(() => auth.isAuthenticated)
const badge = computed(() => cart.totalQty)

function logout() {
  auth.logout()
  window.location.href = '/'
}
</script>

<style scoped>
.nav { display:flex; align-items:center; justify-content:space-between; padding:12px 18px; background:#0f172a; color:#fff; position: sticky; top:0; z-index:10; }
.brand { font-weight: 800; letter-spacing:.5px; cursor: pointer; }
.links { display:flex; gap:14px; }
.links a { color:#cbd5e1; text-decoration:none; }
.links a.router-link-active { color:#fff; }
.actions { display:flex; align-items:center; gap:10px; }
.cart-btn { position: relative; border:none; background:#1e293b; color:#fff; padding:8px 10px; border-radius:8px; cursor:pointer; }
.badge { position:absolute; top:-6px; right:-6px; background:#ef4444; border-radius:999px; font-size:12px; padding:1px 6px; }
.ghost { background:transparent; border:1px solid #334155; color:#e2e8f0; padding:6px 10px; border-radius:8px; cursor:pointer; }
</style>

