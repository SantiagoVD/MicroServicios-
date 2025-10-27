import { defineStore } from 'pinia'
import { setAuthHeader } from '../services/http'
import { login as apiLogin } from '../services/users'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: JSON.parse(localStorage.getItem('user') || 'null') }),
  getters: { isAuthenticated: (s) => !!s.user },
  actions: {
    async login(correo, contrasena) {
      const data = await apiLogin(correo, contrasena)
      // backend returns { message, user }
      this.user = data.user || null
      localStorage.setItem('user', JSON.stringify(this.user))
      if (this.user?.token) setAuthHeader(this.user.token)
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      setAuthHeader(null)
    }
  }
})

