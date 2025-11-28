import { http } from './http'

// Cart service endpoint (env override, fallback a IP pública docker-mapeada)
const BASE = import.meta?.env?.VITE_CART_API || 'http://3.150.168.237:13003/api/cart'

export const getCart = (userId) => http.get(`${BASE}/${userId}`)
export const createCart = (usuario_id) => http.post(`${BASE}/create`, { usuario_id })
export const addToCart = (payload) => http.post(`${BASE}/add`, payload)
export const removeItem = (item_id) => http.delete(`${BASE}/item/${item_id}`)

export async function ensureCart(userId) {
  const { data } = await getCart(userId)
  if (Array.isArray(data) && data.length > 0 && data[0]?.carrito_id) return data[0].carrito_id
  const res = await createCart(userId)
  return res.data?.id
}

export async function addItemToCart(userId, producto_id, cantidad) {
  const carrito_id = await ensureCart(userId)
  return addToCart({ carrito_id, producto_id, cantidad })
}

