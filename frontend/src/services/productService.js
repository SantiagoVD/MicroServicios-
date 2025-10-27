import axios from "axios";

const API_URL = "http://localhost:3002/api/products";

export async function getProducts() {
  try {
    const res = await axios.get(API_URL);
    return res.data; // <- asumiendo que tu backend devuelve un array
  } catch (err) {
    console.error("Error obteniendo productos", err);
    return [];
  }
}
