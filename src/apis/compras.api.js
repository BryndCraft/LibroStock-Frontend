import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const comprasApi = axios.create({
  baseURL: `${baseURL}/Compras/api/v1`
});

// Interceptor para enviar el token
comprasApi.interceptors.request.use(
  (config) => {
    const access = sessionStorage.getItem('token');
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const searchCompras = (producto_id = "") => {
  return comprasApi.post("/list/", { producto_id });
};

export const createCompra = (compra) => {
  return comprasApi.post("/create/", compra);
};
