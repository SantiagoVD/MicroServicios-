<template>
  <header class="nav">
    <div class="brand" @click="$router.push('/products')">E-COMMERCE</div>
    <nav class="links">
      <router-link to="/products">Productos</router-link>
      <div class="categories" role="navigation" aria-label="Categorías">
        <router-link
          class="cat-link"
          :class="{ active: activeCat === 'Todos' }"
          :to="{ path: '/products' }"
        >Todos</router-link>
        <router-link
          v-for="c in categories"
          :key="c"
          class="cat-link"
          :class="{ active: activeCat === c }"
          :to="{ path: '/products', query: { cat: c } }"
        >{{ c }}</router-link>
      </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const auth = useAuthStore()
const cart = useCartStore()
const products = useProductsStore()
const isAuth = computed(() => auth.isAuthenticated)
const badge = computed(() => cart.totalQty)
const categories = computed(() => products.categories)

const route = useRoute()
const selectedCat = ref('Todos')
const activeCat = computed(() => String(route.query.cat || 'Todos'))

onMounted(async () => {
  if (!products.items.length && !products.loading) await products.fetch()
  selectedCat.value = String(route.query.cat || 'Todos')
})

watch(() => route.query.cat, (v) => { selectedCat.value = String(v || 'Todos') })

function logout() {
  auth.logout()
  window.location.href = '/'
}
</script>

<style scoped>
.nav { display:flex; align-items:center; justify-content:space-between; padding:12px 18px; background:#0f172a; color:#fff; position: sticky; top:0; z-index:10; }
.brand { font-weight: 800; letter-spacing:.5px; cursor: pointer; }
.links { display:flex; align-items:center; gap:14px; min-width:0; }
.links a { color:#cbd5e1; text-decoration:none; }
.links a.router-link-active { color:#fff; }
.categories { display:flex; align-items:center; gap:10px; overflow:auto; max-width: 56vw; padding: 2px 4px; }
.categories::-webkit-scrollbar { display:none; }
.cat-link { white-space:nowrap; color:#cbd5e1; text-decoration:none; padding:4px 8px; border-radius:8px; border:1px solid transparent; }
.cat-link.active { color:#fff; border-color:#334155; background:#111827; }
.actions { display:flex; align-items:center; gap:10px; }
.cart-btn { position: relative; border:none; background:#1e293b; color:#fff; padding:8px 10px; border-radius:8px; cursor:pointer; }
.badge { position:absolute; top:-6px; right:-6px; background:#ef4444; border-radius:999px; font-size:12px; padding:1px 6px; }
.ghost { background:transparent; border:1px solid #334155; color:#e2e8f0; padding:6px 10px; border-radius:8px; cursor:pointer; }

/* Mobile layout */
@media (max-width: 700px){
  .nav { flex-wrap: wrap; padding:10px 12px; gap:8px; }
  .brand { font-size:16px; }
  .links { width: 100%; order: 3; gap:10px; }
  .categories { max-width: 100%; padding-bottom:6px; }
  .actions { margin-left:auto; }
}
</style>
