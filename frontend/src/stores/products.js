import { defineStore } from 'pinia'
import { listProducts } from '../services/products'

export const useProductsStore = defineStore('products', {
  state: () => ({ items: [], loading: false }),
  getters: {
    brands: (s) => Array.from(new Set(s.items.map(p => p.marca))).filter(Boolean),
  },
  actions: {
    async fetch() {
      this.loading = true
      try { this.items = await listProducts() } finally { this.loading = false }
    }
  }
})

