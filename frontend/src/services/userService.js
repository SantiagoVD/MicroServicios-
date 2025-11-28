
import axios from "axios";


const API = import.meta?.env?.VITE_USERS_API || "http://3.150.168.237:13001/api/users";

export const loginUser = async (correo, contrasena) => {
  try {
    const res = await axios.post(`${API}/login`, { correo, contrasena });
    return res.data; 
  } catch (error) {
    throw error.response?.data || { message: "Error en login" };
  }
};
