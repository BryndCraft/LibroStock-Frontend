import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const ventasApi = axios.create({
  baseURL: `${baseURL}/Ventas/api/v1`
});

// Interceptor para enviar el token
ventasApi.interceptors.request.use(
  (config) => {
    const access = sessionStorage.getItem('token');
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const createVenta = (compra) => {
  return ventasApi.post("/create/", compra);
};
