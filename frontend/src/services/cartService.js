import axios from "axios";

// Base endpoint for cart operations
const API = import.meta?.env?.VITE_CART_API || "http://3.150.168.237:13003/api/cart";

export const addToCart = (item) => axios.post(`${API}/add`, item);
export const getCart = (userId) => axios.get(`${API}/${userId}`);

// Ensure a cart exists for the user and return carrito_id
export async function ensureCart(userId) {
  const { data } = await getCart(userId);
  if (Array.isArray(data) && data.length > 0 && data[0]?.carrito_id) {
    return data[0].carrito_id;
  }
  const res = await axios.post(`${API}/create`, { usuario_id: userId });
  return res.data?.id;
}

// Add item given product and quantity; guarantees backend is called
export async function addItemToCart(userId, producto_id, cantidad) {
  const carrito_id = await ensureCart(userId);
  return addToCart({ carrito_id, producto_id, cantidad });
}
