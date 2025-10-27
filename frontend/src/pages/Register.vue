<template>
  <div class="login-bg">
    <div class="container" style="display:grid; place-items:center; height:100%;">
      <form class="panel" style="width:380px; display:grid; gap:10px; backdrop-filter: blur(2px); background: rgba(255,255,255,.95);" @submit.prevent="onRegister">
        <h2 style="margin:0;">Crear cuenta</h2>
        <div>
          <label>Nombre</label>
          <input v-model="nombre" type="text" required style="width:100%; padding:10px; border:1px solid #e5e7eb; border-radius:8px;" />
        </div>
        <div>
          <label>Correo</label>
          <input v-model="correo" type="email" required style="width:100%; padding:10px; border:1px solid #e5e7eb; border-radius:8px;" />
        </div>
        <div>
          <label>Contrasena</label>
          <input v-model="contrasena" type="password" required style="width:100%; padding:10px; border:1px solid #e5e7eb; border-radius:8px;" />
        </div>
        <button type="submit" style="background:#0f172a; color:#fff; border:none; padding:10px; border-radius:8px;">Registrarse</button>
        <button type="button" @click="goLogin" class="ghost">Ya tengo cuenta</button>
        <p v-if="error" style="color:#ef4444; margin:0;">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { register as apiRegister } from '../services/users'

const nombre = ref('')
const correo = ref('')
const contrasena = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

async function onRegister(){
  try {
    await apiRegister(nombre.value, correo.value, contrasena.value)
    await auth.login(correo.value, contrasena.value)
    router.push('/products')
  } catch (e) {
    error.value = e?.response?.data?.error || 'Error al registrarse'
  }
}

function goLogin(){ router.push('/login') }
</script>

<style scoped>
.login-bg { height: 100vh; background: url('/src/assets/img/fondo-login.jpg') no-repeat center center / cover; }
.ghost { background:transparent; border:1px solid #334155; color:#0f172a; padding:8px 10px; border-radius:8px; }
</style>

