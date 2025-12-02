import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const movApi = axios.create({
  baseURL: `${baseURL}/Movimientos/api/v1` // ✅ Aquí apuntamos a Movimientos
});

// Interceptor para enviar token en cada request
movApi.interceptors.request.use(
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

// Traer todos los movimientos del Movimientos
export const searchMovimientos = (page = 1, producto = "", fechaInicio = "", fechaFin = "") => {
  return movApi.get(`/search/${page}/`, {
    params: {
      search: producto,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    }
  });
};
