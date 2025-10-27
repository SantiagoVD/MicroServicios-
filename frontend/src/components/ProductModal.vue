<template>
  <div v-if="visible" class="modal-backdrop" @click.self="emitClose">
    <div class="modal">
      <div class="modal-left">
        <img :src="imageUrl" :alt="product?.nombre" class="modal-image" />
      </div>
      <div class="modal-right">
        <div class="modal-header">
          <h3 class="modal-title">{{ product?.nombre }}</h3>
          <button class="icon-btn" @click="emitClose">✕</button>
        </div>
        <p class="modal-brand">{{ product?.marca }} • {{ product?.categoria }}</p>
        <p class="modal-price">$ {{ product?.precio }}</p>

        <div class="qty-row">
          <label for="qty">Cantidad</label>
          <input id="qty" type="number" v-model.number="qty" min="1" />
        </div>

        <button class="primary" @click="handleAdd" :disabled="adding">
          {{ adding ? 'Agregando...' : 'Agregar al carrito' }}
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
import { addItemToCart, getCart } from '../services/cart'
import { getImageForProduct } from '../utils/images'

const props = defineProps({
  product: { type: Object, default: null },
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'added'])

const qty = ref(1)
const adding = ref(false)
const cartItems = ref([])
const loadingCart = ref(false)

const imageUrl = computed(() => (props.product ? (getImageForProduct(props.product) || '') : ''))

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
  adding.value = true
  try {
    await addItemToCart(userId, props.product.id, Math.max(1, Number(qty.value || 1)))
    await reloadCart()
    emit('added')
  } catch (e) {
    console.error('Error agregando al carrito', e)
    alert('No se pudo agregar. Reintenta.')
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
.qty-row { display:flex; align-items:center; gap:10px; margin-bottom: 12px; }
.qty-row input { width: 90px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 8px; }
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
