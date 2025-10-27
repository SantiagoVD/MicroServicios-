import { defineStore } from 'pinia'
import { addItemToCart, getCart, removeItem } from '../services/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [], loading: false }),
  getters: {
    count: (s) => s.items.filter(Boolean).length,
    totalQty: (s) => s.items.reduce((acc, it) => acc + (Number(it?.cantidad) || 0), 0),
  },
  actions: {
    async load(userId) {
      if (!userId) { this.items = []; return }
      this.loading = true
      try {
        const res = await getCart(userId)
        this.items = Array.isArray(res.data) ? res.data : []
      } finally {
        this.loading = false
      }
    },
    async add(userId, productId, qty) {
      await addItemToCart(userId, productId, qty)
      await this.load(userId)
    },
    async remove(itemId, userId) {
      await removeItem(itemId)
      await this.load(userId)
    }
  }
})

