import { http } from './http'

const BASE = import.meta?.env?.VITE_PRODUCTS_API || 'http://3.150.168.237:3002/api/products'

export async function listProducts() {
  const { data } = await http.get(BASE)
  return data
}

export async function getProduct(id) {
  const { data } = await http.get(`${BASE}/${id}`)
  return data
}

