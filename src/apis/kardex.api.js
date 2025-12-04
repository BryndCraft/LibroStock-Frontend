import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const kardexApi = axios.create({
  baseURL: `${baseURL}/Kardex/api/v1` 
});

// Interceptor para enviar token en cada request
kardexApi.interceptors.request.use(
  (config) => {
    try {
      const access = sessionStorage.getItem('token');
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    } catch (error) {
      console.log('Error leyendo sessionStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Traer todos los movimientos del Kardex
export const searchKardex = (producto_id = "") => {
  return kardexApi.post("/list/", { producto_id });
};