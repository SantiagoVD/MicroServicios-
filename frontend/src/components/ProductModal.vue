<template>
  <div v-if="visible" class="modal-backdrop" @click.self="emitClose">
    <div class="modal">
      <div class="modal-left">
        <img :src="imageUrl" :alt="product?.nombre" class="modal-image" />
      </div>
      <div class="modal-right">
        <div class="modal-header">
          <h3 class="modal-title">{{ product?.nombre }}</h3>
          <button class="icon-btn" @click="emitClose">×</button>
        </div>
        <p class="modal-brand">{{ product?.marca }} • {{ product?.categoria }}</p>
        <p class="modal-price">$ {{ product?.precio }}</p>
        <p class="modal-desc" v-if="description">{{ description }}</p>

        <div class="qty-row">
          <label for="qty">Cantidad</label>
          <input id="qty" type="number" v-model.number="qty" :min="1" :max="maxQty" />
          <span class="stock-note" v-if="product">Stock: {{ inStock }}</span>
        </div>

        <button class="primary" @click="handleAdd" :disabled="adding || isOutOfStock">
          {{ isOutOfStock ? 'Agotado' : (adding ? 'Agregando...' : 'Agregar al carrito') }}
        </button>

        <div class="divider"></div>

        <div class="cart-summary">
          <div class="summary-head">
            <h4>Tu carrito</h4>
            <button class="link" @click="reloadCart">Actualizar</button>
          </div>
          <p v-if="loadingCart" class="muted">Cargando carrito...</p>
          <p v-else-if="cartItems.length === 0" class="muted">Aún no hay items.</p>
          <ul v-else class="cart-list">
            <li v-for="(item, idx) in cartItems" :key="idx" class="cart-item">
              <span>#{{ item.producto_id }}</span>
              <span>x{{ item.cantidad }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { getCart } from '../services/cart'
import { getImageForProduct } from '../utils/images'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: { type: Object, default: null },
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'added'])

const qty = ref(1)
const adding = ref(false)
const cartItems = ref([])
const loadingCart = ref(false)
const cart = useCartStore()

const imageUrl = computed(() => (props.product ? (getImageForProduct(props.product) || '') : ''))
const description = computed(() => {
  if (!props.product) return ''
  const d = props.product.descripcion || props.product.descripcion || props.product.description
  if (d && String(d).trim().length > 0) return String(d)
  const marca = props.product.marca || ''
  const cat = props.product.categoria || ''
  return `Producto ${cat ? cat.toLowerCase() : ''} de ${marca || 'marca destacada'}, ideal para uso diario.`
})

const inStock = computed(() => {
  const p = props.product || {}
  const s = Number(p.stock ?? p.existencia ?? p.cantidad ?? 0)
  return isNaN(s) ? 0 : Math.max(0, s)
})
const isOutOfStock = computed(() => inStock.value <= 0)
const currentInCart = computed(() => {
  if (!props.product) return 0
  const pid = props.product.id
  const match = cartItems.value.find(it => String(it?.producto_id) === String(pid) || String(it?.product_id) === String(pid) || String(it?.productoId) === String(pid))
  return Number(match?.cantidad) || 0
})
const maxQty = computed(() => Math.max(1, inStock.value - currentInCart.value))

function getUserId() {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try { return JSON.parse(raw)?.id || null } catch { return null }
}

async function reloadCart() {
  const userId = getUserId()
  if (!userId) { cartItems.value = []; return }
  loadingCart.value = true
  try {
    const res = await getCart(userId)
    cartItems.value = Array.isArray(res.data) ? res.data : []
  } finally {
    loadingCart.value = false
  }
}

async function handleAdd() {
  if (!props.product) return
  const userId = getUserId()
  if (!userId) { alert('Inicia sesión para agregar al carrito'); return }
  if (isOutOfStock.value) { alert('Agotado'); return }
  const requested = Math.max(1, Number(qty.value || 1))
  const available = inStock.value - currentInCart.value
  if (requested > available) {
    alert('No hay suficiente stock disponible')
    return
  }
  adding.value = true
  try {
    await cart.add(userId, props.product.id, requested)
    await reloadCart()
    emit('added')
  } catch (e) {
    console.error('Error agregando al carrito', e)
    const msg = e?.code === 'CART_LIMIT' ? 'Solo puedes tener un máximo de 10 productos en el carrito.' : 'No se pudo agregar. Reintenta.'
    alert(msg)
  } finally {
    adding.value = false
  }
}

function emitClose() { emit('close') }

watch(() => props.visible, (v) => {
  if (v) { qty.value = 1; reloadCart() }
})

onMounted(() => { if (props.visible) reloadCart() })
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index: 50; }
.modal { background: #fff; width: min(1000px, 92vw); max-height: 92vh; border-radius: 14px; overflow: hidden; display: grid; grid-template-columns: 1.1fr 1fr; box-shadow: 0 20px 60px rgba(0,0,0,.25); }
.modal-left { background: #f7f8fa; display:flex; align-items:center; justify-content:center; }
.modal-image { width: 100%; height: 100%; object-fit: contain; max-height: 70vh; }
.modal-right { padding: 20px; display:flex; flex-direction:column; }
.modal-header { display:flex; justify-content: space-between; align-items:center; }
.modal-title { font-size: 20px; margin: 0; }
.icon-btn { border: none; background: transparent; font-size: 18px; cursor: pointer; }
.modal-brand { color:#6b7280; margin: 6px 0 8px; }
.modal-price { font-weight: 700; font-size: 22px; margin: 0 0 16px; }
.modal-desc { color:#334155; margin: 0 0 14px; }
.qty-row { display:flex; align-items:center; gap:10px; margin-bottom: 12px; }
.qty-row input { width: 90px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 8px; }
.stock-note { color:#6b7280; font-size:12px; }
.primary { background:#2563eb; color:#fff; border:none; padding:10px 14px; border-radius: 10px; cursor:pointer; }
.primary:disabled { opacity:.6; cursor: not-allowed; }
.divider { height: 1px; background: #e5e7eb; margin: 18px 0; }
.cart-summary { flex: 1; overflow: auto; }
.summary-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.link { border:none; background:transparent; color:#2563eb; cursor:pointer; }
.muted { color:#6b7280; }
.cart-list { list-style:none; padding:0; margin:0; display:grid; gap:8px; }
.cart-item { display:flex; justify-content:space-between; padding:10px 12px; border:1px solid #f1f5f9; border-radius:10px; background:#fafafa; }
@media (max-width: 820px) { .modal { grid-template-columns: 1fr; } .modal-image { max-height: 40vh; } }
</style>

