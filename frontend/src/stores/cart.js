import { defineStore } from 'pinia'
import { addItemToCart, getCart, removeItem } from '../services/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [], loading: false }),
  getters: {
    count: (s) => s.items.filter(Boolean).length,
    totalQty: (s) => s.items
      .filter(it => !!(it && (it.producto_id ?? it.product_id ?? it.productoId ?? it.productId)))
      .reduce((acc, it) => acc + (Number(it?.cantidad) || 0), 0),
  },
  actions: {
    async load(userId) {
      if (!userId) { this.items = []; return }
      this.loading = true
      try {
        const res = await getCart(userId)
        const raw = Array.isArray(res.data) ? res.data : []
        // Sanitize: drop items with no product id or quantity <= 0
        this.items = raw.filter(it => {
          if (!it) return false
          const pid = it.producto_id ?? it.product_id ?? it.productoId ?? it.productId
          const qty = Number(it.cantidad)
          return pid != null && pid !== '' && !isNaN(qty) && qty > 0
        })
      } finally {
        this.loading = false
      }
    },
    async add(userId, productId, qty) {
      const current = this.totalQty || 0
      const addQty = Math.max(1, Number(qty) || 1)
      const limit = 10
      if (current >= limit) {
        const err = new Error('Límite de 10 productos en el carrito')
        err.code = 'CART_LIMIT'
        throw err
      }
      const allowed = Math.min(addQty, Math.max(0, limit - current))
      await addItemToCart(userId, productId, allowed)
      await this.load(userId)
    },
    async clear(userId) {
      if (!userId) { this.items = []; return }
      this.loading = true
      try {
        for (const it of this.items) {
          try { await removeItem(it.item_id) } catch {}
        }
        // After clearing remotely, ensure local state is empty
        this.items = []
        await this.load(userId)
      } finally {
        this.loading = false
      }
    },
    async remove(itemId, userId) {
      await removeItem(itemId)
      await this.load(userId)
    }
  }
})

