<template>
  <div class="login-bg">
    <div class="container" style="display:grid; place-items:center; height:100%;">
      <form class="panel" style="width:360px; display:grid; gap:10px; backdrop-filter: blur(2px); background: rgba(255,255,255,.9);" @submit.prevent="onSubmit">
        <h2 style="margin:0;">Iniciar sesion</h2>
        <div>
          <label>Correo</label>
          <input v-model="correo" type="email" required style="width:100%; padding:10px; border:1px solid #e5e7eb; border-radius:8px;" />
        </div>
        <div>
          <label>Contrasena</label>
          <input v-model="contrasena" type="password" required style="width:100%; padding:10px; border:1px solid #e5e7eb; border-radius:8px;" />
        </div>
        <div style="display:flex; gap:8px;">
          <button type="submit" style="flex:1; background:#2563eb; color:#fff; border:none; padding:10px; border-radius:8px;">Ingresar</button>
          <button type="button" @click="goRegister" style="flex:1; background:#0f172a; color:#fff; border:none; padding:10px; border-radius:8px;">Registrarse</button>
        </div>
        <p v-if="error" style="color:#ef4444; margin:0;">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const correo = ref('')
const contrasena = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

async function onSubmit(){
  try {
    await auth.login(correo.value, contrasena.value)
    router.push('/products')
  } catch (e) {
    error.value = e?.response?.data?.error || 'Error al iniciar sesión'
  }
}

function goRegister(){ router.push('/register') }
</script>

<style scoped>
.login-bg { height: 100vh; background: url('/src/assets/img/fondo-login.jpg') no-repeat center center / cover; }
</style>
