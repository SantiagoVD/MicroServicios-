import { http } from './http'

// Orders service endpoint (env override; fallback a IP pública docker-mapeada)
const BASE = import.meta?.env?.VITE_ORDERS_API || 'http://3.150.168.237:3004/api/orders'

export async function createOrder(payload) {
  const { data } = await http.post(BASE, payload)
  return data
}

export async function getOrdersByUser(usuario_id) {
  const { data } = await http.get(`${BASE}/${usuario_id}`)
  return data
}
