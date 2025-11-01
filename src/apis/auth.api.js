import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const usuariosApi = axios.create({
  baseURL: `${baseURL}/Auth/api/v1`
});

// 🔹 Iniciar sesión (solo admin)
export const loginAdmin = (credentials) => {
  return usuariosApi.post("/login-admin/", credentials);
};

// 🔹 Cerrar sesión
export const logoutAdmin = () => {
  return usuariosApi.post("/logout/");
};    
