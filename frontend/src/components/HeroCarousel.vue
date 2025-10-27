<template>
  <section class="hero">
    <div class="slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <article v-for="(s, i) in slides" :key="i" class="slide">
        <div class="text">
          <h3 class="tag">{{ s.tag }}</h3>
          <h2 class="title">{{ s.title }}</h2>
          <p class="subtitle">{{ s.subtitle }}</p>
          <div class="price" v-if="s.price">{{ s.price }}</div>
          <button class="cta" @click="$router.push(s.to || '/products')">Ver producto</button>
        </div>
        <img class="image" :src="s.image" :alt="s.title" />
      </article>
    </div>
    <button class="nav prev" @click="prev">‹</button>
    <button class="nav next" @click="next">›</button>
    <div class="dots">
      <button
        v-for="(s, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: i === currentIndex }"
        @click="go(i)"
        aria-label="Ir a slide"
      />
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import macImg from '../assets/img/Laptop Apple MacBook Air M2.jpg'
import rogImg from '../assets/img/Laptop ASUS ROG Zephyrus.jpg'
import monitorImg from '../assets/img/Monitor ASUS TUF Gaming 27.jpg'
import mouseImg from '../assets/img/Mouse Razer DeathAdder V2.jpg'
import dellImg from '../assets/img/Laptop Dell XPS 13.jpg'
const slides = [
  { tag: 'Top ventas', title: 'MacBook Air M2', subtitle: 'Rendimiento y portabilidad para todo el día', price: 'Desde $1,099', image: macImg },
  { tag: 'Gaming', title: 'ASUS ROG Zephyrus', subtitle: 'Potencia de alto nivel para jugar y crear', price: 'Desde $1,499', image: rogImg },
  { tag: 'Ofertas', title: 'Monitor ASUS TUF 27"', subtitle: '165Hz • 1ms • Fluidez total', price: 'Ahora $299', image: monitorImg },
  { tag: 'Periféricos', title: 'Razer DeathAdder V2', subtitle: 'Precisión y ergonomía para gaming', price: 'Solo $49', image: mouseImg },
  { tag: 'Ultrabook', title: 'Dell XPS 13', subtitle: 'Diseño premium y excelente pantalla', price: 'Desde $1,199', image: dellImg },
]
const currentIndex = ref(0)
let timer = null
function next() { currentIndex.value = (currentIndex.value + 1) % slides.length }
function prev() { currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length }
function go(i) { currentIndex.value = i }
onMounted(() => { timer = setInterval(next, 5000) })
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>
<style scoped>
.hero { position: relative; overflow: hidden; background: #f8fafc; border-radius: 14px; }
.slides { display: flex; transition: transform .5s ease; }
.slide { min-width: 100%; display: grid; grid-template-columns: 1.1fr .9fr; align-items: center; gap: 16px; padding: 22px; }
.text { max-width: 680px; }
.tag { display:inline-block; background:#ec4899; color:#fff; padding:4px 10px; border-radius:999px; font-size:12px; margin-bottom:8px; }
.title { font-size: 34px; margin: 4px 0; color:#0f172a; }
.subtitle { color:#334155; margin-bottom: 10px; }
.price { font-weight: 800; color:#0ea5e9; margin-bottom: 12px; }
.cta { background:#0f172a; color:#fff; border:none; padding:10px 14px; border-radius: 10px; cursor:pointer; }
.image { width: 100%; max-height: 280px; object-fit: contain; justify-self: end; }
.nav { position:absolute; top:50%; transform: translateY(-50%); background: rgba(15,23,42,.8); color:#fff; border:none; width:36px; height:36px; border-radius:999px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.prev { left: 10px; }
.next { right: 10px; }
.dots { position:absolute; bottom:10px; left:0; right:0; display:flex; justify-content:center; gap:6px; }
.dot { width:8px; height:8px; border-radius:999px; border:none; background:#cbd5e1; cursor:pointer; opacity:.8; }
.dot.active { background:#0ea5e9; opacity:1; }
@media (max-width: 900px){
  .slide { grid-template-columns: 1fr; text-align:center; }
  .image { justify-self:center; max-height: 240px; }
}
</style>
