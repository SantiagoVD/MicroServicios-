// src/services/userService.js
import axios from "axios";

const API = "http://localhost:3001/api/users"; // ⚠️ Ajusta el puerto según tu backend

export const loginUser = async (correo, contrasena) => {
  try {
    const res = await axios.post(`${API}/login`, { correo, contrasena });
    return res.data; // devuelve token o datos del usuario
  } catch (error) {
    throw error.response?.data || { message: "Error en login" };
  }
};
