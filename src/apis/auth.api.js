import axios from 'axios';
import { useUser } from '../context/UserContext';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const usuariosApi = axios.create({
  baseURL: `${baseURL}/Auth/api/v1`
});

usuariosApi.interceptors.request.use(
  (config) => {
    try {
      const access = sessionStorage.getItem('token');
      console.log(access);
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    } catch (error) {
      console.log('Error leyendo localStorage:', error);
      
    }
    return config; 
  },
  (error) => Promise.reject(error)
);


export const login = (credentials) => {
  return usuariosApi.post("/login/", credentials);
};

// 🔹 Cerrar sesión
export const logoutApi = () => {
  return usuariosApi.post("/logout/");
};    
export const uploadFoto = async(archivo) => {
  const formData = new FormData();
  formData.append("foto", archivo);

  try {
    const response = await usuariosApi.post("/upload/", formData);
    return response;  
  } catch (error) {
    console.error("Error al subir la foto:", error);
    throw error;
  }
};


export const createUserApi = (data) => {
  return usuariosApi.post("/create/", data);
};

export const updateUserApi = (data) => {
  return usuariosApi.patch(`/update/${data.id}/`, data);
};
export const listUserApi = () => {
  return usuariosApi.get(`/list/`);
};
export const deleteUserApi = (id) => {
  return usuariosApi.delete(`/delete/${id}/`);
};

export const getMediaUrl = (ruta) => {
  if (!ruta) return null;

  const BASE = import.meta.env.VITE_API_BASE_URL;
  return `${BASE}${ruta}`;
};