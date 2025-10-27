<template>
  <Navbar v-if="showChrome" @toggle-cart="drawerOpen = !drawerOpen" />
  <CartDrawer v-if="showChrome" :open="drawerOpen" @close="drawerOpen = false" />
  <router-view />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import CartDrawer from './components/CartDrawer.vue'

const drawerOpen = ref(false)
const route = useRoute()
const showChrome = computed(() => route.name !== 'Login' && route.name !== 'Register')
</script>

<style scoped></style>
