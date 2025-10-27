<template>
  <div>
    <h2>Carrito</h2>
    <ul>
      <li v-for="item in cart" :key="item.id">
        {{ item.producto_id }} - {{ item.cantidad }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCart } from "../services/cartService";

const cart = ref([]);

onMounted(async () => {
  try {
    const res = await getCart(1); // usuario fijo de prueba
    cart.value = res.data;
  } catch (err) {
    console.error("Error cargando carrito", err);
  }
});
</script>
