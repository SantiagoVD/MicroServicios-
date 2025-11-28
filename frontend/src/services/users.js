import { http } from './http'

const BASE = import.meta?.env?.VITE_USERS_API || 'http://3.150.168.237:3001/api/users'

export async function login(correo, contrasena) {
  const { data } = await http.post(`${BASE}/login`, { correo, contrasena })
  return data
}

export async function register(nombre, correo, contrasena) {
  const { data } = await http.post(`${BASE}/register`, { nombre, correo, contrasena })
  return data
}

