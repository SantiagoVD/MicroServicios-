import { http } from './http'

const BASE = 'http://localhost:3001/api/users'

export async function login(correo, contrasena) {
  const { data } = await http.post(`${BASE}/login`, { correo, contrasena })
  return data
}

export async function register(nombre, correo, contrasena) {
  const { data } = await http.post(`${BASE}/register`, { nombre, correo, contrasena })
  return data
}

