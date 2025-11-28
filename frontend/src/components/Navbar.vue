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
      <button v-if="isAuth" class="ghost" @click="openProfile">Perfil</button>
      <button v-if="isAuth" class="ghost" @click="logout">Salir</button>
    </div>
  </header>
  <div v-if="showProfile" class="modal-backdrop" @click.self="closeProfile">
    <div class="modal">
      <div class="modal-head">
        <h3>Perfil</h3>
        <button class="close" @click="closeProfile">×</button>
      </div>
      <div class="profile-body">
        <div class="panel">
          <h4>Datos</h4>
          <p><strong>Nombre:</strong> {{ userInfo.nombre || '—' }}</p>
          <p><strong>Correo:</strong> {{ userInfo.correo || '—' }}</p>
          <p><strong>Rol:</strong> {{ userInfo.rol || 'usuario' }}</p>
          <p><strong>ID usuario:</strong> {{ userInfo.id || '—' }}</p>
        </div>
        <div class="panel">
          <div class="panel-head">
            <h4>Compras</h4>
            <button class="ghost" :disabled="loadingProfile" @click="fetchOrders">Actualizar</button>
          </div>
          <p v-if="loadingProfile" class="muted">Cargando compras...</p>
          <p v-else-if="groupedOrders.length === 0" class="muted">Aún no hay compras.</p>
          <div v-else class="orders">
            <div v-for="order in groupedOrders" :key="order.pedido_id" class="order-card">
              <div class="order-head">
                <div>
                  <div class="order-id">Pedido #{{ order.pedido_id }}</div>
                  <div class="order-meta">Estado: {{ order.estado || 'pendiente' }} · {{ formatDate(order.fecha_creacion) }}</div>
                </div>
                <div class="order-total">${{ formatMoney(order.total) }}</div>
              </div>
              <ul class="order-items">
                <li v-for="item in order.items" :key="item.item_id">
                  <span>Prod #{{ item.producto_id }} · x{{ item.cantidad }}</span>
                  <span>${{ formatMoney(item.precio_unitario) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'
import { getOrdersByUser } from '../services/orders'

const auth = useAuthStore()
const cart = useCartStore()
const products = useProductsStore()
const isAuth = computed(() => auth.isAuthenticated)
const badge = computed(() => cart.totalQty)
const categories = computed(() => products.categories)
const userInfo = computed(() => auth.user || {})

const route = useRoute()
const selectedCat = ref('Todos')
const activeCat = computed(() => String(route.query.cat || 'Todos'))
const showProfile = ref(false)
const orders = ref([])
const loadingProfile = ref(false)

onMounted(async () => {
  if (!products.items.length && !products.loading) await products.fetch()
  selectedCat.value = String(route.query.cat || 'Todos')
})

watch(() => route.query.cat, (v) => { selectedCat.value = String(v || 'Todos') })

function logout() {
  auth.logout()
  window.location.href = '/'
}

function closeProfile(){ showProfile.value = false }

async function fetchOrders(){
  if (!auth.user?.id) return
  loadingProfile.value = true
  try {
    orders.value = await getOrdersByUser(auth.user.id)
  } catch (e) {
    console.error('Error cargando compras', e)
    orders.value = []
  } finally {
    loadingProfile.value = false
  }
}

function openProfile(){
  showProfile.value = true
  fetchOrders()
}

const groupedOrders = computed(() => {
  const map = new Map()
  for (const row of orders.value || []) {
    const id = row.pedido_id || row.id || row.order_id
    if (!id) continue
    if (!map.has(id)) {
      map.set(id, {
        pedido_id: id,
        estado: row.estado || 'pendiente',
        total: row.total || 0,
        fecha_creacion: row.fecha_creacion,
        items: []
      })
    }
    map.get(id).items.push({
      item_id: row.item_id || `${id}-${map.get(id).items.length}`,
      producto_id: row.producto_id,
      cantidad: row.cantidad,
      precio_unitario: row.precio_unitario
    })
  }
  return Array.from(map.values())
})

function formatMoney(val){
  const n = Number(val) || 0
  return n.toFixed(2)
}
function formatDate(val){
  if (!val) return ''
  const d = new Date(val)
  return d.toLocaleDateString()
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
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:50; }
.modal { background:#fff; color:#0f172a; width: min(900px, 94vw); max-height: 90vh; overflow:auto; border-radius:14px; padding:16px; box-shadow:0 20px 60px rgba(0,0,0,.25); display:grid; gap:12px; }
.modal-head { display:flex; justify-content:space-between; align-items:center; }
.profile-body { display:grid; gap:12px; }
.panel { border:1px solid #e5e7eb; border-radius:12px; padding:12px; background:#f8fafc; }
.panel-head { display:flex; justify-content:space-between; align-items:center; }
.orders { display:grid; gap:10px; }
.order-card { border:1px solid #e2e8f0; border-radius:10px; padding:10px; background:#fff; }
.order-head { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
.order-id { font-weight:700; }
.order-meta { color:#475569; font-size:12px; }
.order-total { font-weight:700; }
.order-items { list-style:none; padding:0; margin:8px 0 0; display:grid; gap:6px; }
.order-items li { display:flex; justify-content:space-between; font-size:14px; color:#0f172a; }
.muted { color:#64748b; }

/* Mobile layout */
@media (max-width: 700px){
  .nav { flex-wrap: wrap; padding:10px 12px; gap:8px; }
  .brand { font-size:16px; }
  .links { width: 100%; order: 3; gap:10px; }
  .categories { max-width: 100%; padding-bottom:6px; }
  .actions { margin-left:auto; }
}
</style>
