<template>
  <div class="container">
    <HeroCarousel @open="openModal" />
    <div class="grid">
      <aside class="panel">
        <h3 style="margin:4px 0 8px;">Filtrar</h3>
        <div style="display:grid; gap:10px;">
          <div>
            <label>Hasta: ${{ priceRange }}</label>
            <input type="range" min="0" max="2500" step="50" v-model="priceRange" />
          </div>
          <div>
            <label>Marcas</label>
            <div v-for="m in brands" :key="m" style="display:flex; align-items:center; gap:6px;">
              <input type="checkbox" :value="m" v-model="selectedBrands" />
              <span>{{ m }}</span>
            </div>
          </div>
        </div>
      </aside>

      <section>
        <div class="products-grid">
          <ProductCard v-for="p in filtered" :key="p.id" :product="p" @open="openModal(p)" />
        </div>
      </section>
    </div>

    <ProductModal :visible="showModal" :product="selectedProduct" @close="closeModal" @added="onAdded" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import ProductCard from '../components/ProductCard.vue'
import ProductModal from '../components/ProductModal.vue'
import HeroCarousel from '../components/HeroCarousel.vue'

const auth = useAuthStore()
const products = useProductsStore()
const cart = useCartStore()

const priceRange = ref(2500)
const selectedBrands = ref([])
const showModal = ref(false)
const selectedProduct = ref(null)
const route = useRoute()
const activeCategory = ref(String(route.query.cat || 'Todos'))

onMounted(async () => {
  await products.fetch()
  if (auth.user?.id) await cart.load(auth.user.id)
})

const brands = computed(() => {
  const cat = activeCategory.value
  const list = products.items
    .filter(p => cat === 'Todos' || p.categoria === cat)
    .map(p => p.marca)
    .filter(Boolean)
  return Array.from(new Set(list))
})
const filtered = computed(() => {
  return products.items.filter(p => {
    const price = parseFloat(String(p.precio ?? '').replace(/[^0-9.]/g, ''))
    const okPrice = (isNaN(price) ? true : price <= priceRange.value)
    const okBrand = selectedBrands.value.length === 0 || selectedBrands.value.includes(p.marca)
    const okCat = activeCategory.value === 'Todos' || p.categoria === activeCategory.value
    return okPrice && okBrand && okCat
  })
})

function openModal(p){ selectedProduct.value = p; showModal.value = true }
function closeModal(){ showModal.value = false }
function onAdded(){ cart.load(auth.user?.id) }

watch(() => route.query.cat, (v) => {
  activeCategory.value = String(v || 'Todos')
  // Reset selected brands when the category changes
  selectedBrands.value = []
})
watch(() => route.query.brand, (v) => {
  activeBrand.value = v ? String(v) : ''
  if (activeBrand.value) {
    selectedBrands.value = [activeBrand.value]
  }
})
</script>

<style scoped>
.container :deep(.hero){ margin-bottom: 18px; margin-left: -32px; margin-right: -32px; }
@media (max-width: 640px){
  .container :deep(.hero){ margin-left: -12px; margin-right: -12px; border-radius: 0; }
}
</style>
