<template>
  <aside class="drawer" :class="{ open }">
    <div class="head">
      <h3>Tu carrito</h3>
      <button class="close" @click="$emit('close')">×</button>
    </div>
    <div class="body">
      <p v-if="loading" class="muted">Cargando...</p>
      <p v-else-if="visibleItems.length===0" class="muted">No hay productos seleccionados</p>
      <ul v-else class="list">
        <li v-for="it in visibleItems" :key="it.item_id" class="row">
          <div class="info">
            <div class="name">{{ productName(pid(it)) || (pid(it) ? ('Producto #' + pid(it)) : 'Producto') }}</div>
            <div class="sub">x{{ it.cantidad }} • ${{ priceOf(pid(it)) }}</div>
          </div>
          <button class="remove" @click="remove(it.item_id)">Eliminar</button>
        </li>
      </ul>
    </div>
    <div class="foot" v-if="visibleItems.length > 0">
      <div class="totals">
        <span>Total</span>
        <strong>$ {{ total.toFixed(2) }}</strong>
      </div>
      <div class="foot-actions" v-if="items.length > 0">
        <button class="clear" :disabled="loading" @click="clearAll">Vaciar carrito</button>
        <button class="pay primary" :disabled="processing || loading" @click="payOrder">
          {{ processing ? 'Procesando...' : 'Pagar' }}
        </button>
        <button class="pay secondary" @click="payWhatsapp">Pagar por WhatsApp</button>
      </div>
      <p class="limit-note">Máximo 10 productos por carrito.</p>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'
import { createOrder } from '../services/orders'

defineProps({ open: Boolean })

const auth = useAuthStore()
const cart = useCartStore()
const products = useProductsStore()
const processing = ref(false)
const items = computed(() => cart.items)
const loading = computed(() => cart.loading)
const visibleItems = computed(() => items.value.filter(it => !!(it && (it.producto_id ?? it.product_id ?? it.productoId ?? it.productId) && Number(it.cantidad) > 0)))

async function remove(itemId) {
  const userId = auth.user?.id
  await cart.remove(itemId, userId)
}

// Ensure products are available for names/prices in the drawer
if (!products.items?.length) {
  try { products.fetch && products.fetch() } catch {}
}

function pid(item){
  return item?.producto_id ?? item?.product_id ?? item?.productoId ?? item?.productId ?? null
}

function priceOf(productId){
  const p = products.items.find(x => String(x.id) === String(productId))
  const n = Number(String(p?.precio ?? '').toString().replace(/[^0-9.]/g,''))
  return isNaN(n) ? 0 : n
}

function productName(productId){
  return products.items.find(x => String(x.id) === String(productId))?.nombre || ''
}

const total = computed(() => visibleItems.value.reduce((sum, it) => sum + priceOf(pid(it)) * (Number(it.cantidad)||0), 0))

async function payOrder(){
  if (!auth.user?.id) { alert('Inicia sesión para pagar'); return }
  if (visibleItems.value.length === 0) { alert('Agrega productos al carrito'); return }

  const orderItems = visibleItems.value.map(it => {
    const productId = pid(it)
    const qty = Number(it.cantidad) || 0
    const price = priceOf(productId) || 0
    return { producto_id: productId, cantidad: qty, precio_unitario: price }
  }).filter(it => it.producto_id && it.cantidad > 0)

  const totalValue = Number(total.value.toFixed(2))
  if (!totalValue || orderItems.length === 0) { alert('Total inválido'); return }

  processing.value = true
  try {
    const order = await createOrder({ usuario_id: auth.user.id, total: totalValue, items: orderItems })
    console.log('[orders][frontend] created order', order)
    await cart.clear(auth.user.id)
    const orderId = order?.orderId || order?.id || '(desconocido)'
    alert(`Pedido creado correctamente.\nID de compra: ${orderId}\nUsuario: ${auth.user.id}`)
  } catch (e) {
    console.error('Error creando pedido', e)
    alert(e?.response?.data?.error || 'No se pudo procesar el pago. Intenta de nuevo.')
  } finally {
    processing.value = false
  }
}

function payWhatsapp(){
  const lines = items.value.map(it => {
    const id = pid(it)
    const name = productName(id) || `Producto #${id}`
    const qty = Number(it.cantidad)||0
    const price = priceOf(id)
    const sub = (qty * price).toFixed(2)
    return `• ${name} x${qty} - $${sub}`
  })
  const message = `Hola, quiero pagar mi pedido:\n\n${lines.join('\n')}\n\nTotal: $${total.value.toFixed(2)}`
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(url,'_blank')
}

async function clearAll(){
  const userId = auth.user?.id
  await cart.clear(userId)
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
.foot { border-top:1px solid #e5e7eb; padding:12px; display:grid; gap:8px; background:#fff; }
.totals { display:flex; align-items:center; justify-content:space-between; }
.foot-actions { display:flex; gap:8px; flex-wrap:wrap; }
.pay { color:#fff; border:none; padding:10px 12px; border-radius:10px; cursor:pointer; }
.pay.primary { background:#2563eb; }
.pay.secondary { background:#22c55e; }
.pay:disabled { opacity:.6; cursor:not-allowed; }
.clear { background:transparent; border:1px solid #e5e7eb; color:#334155; padding:10px 12px; border-radius:10px; cursor:pointer; }
.limit-note { color:#6b7280; font-size:12px; margin: 0; text-align:center; }

@media (max-width: 540px){
  .drawer { right: -100vw; width: 100vw; }
  .drawer.open { right: 0; }
}
</style>
