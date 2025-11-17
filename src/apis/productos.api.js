import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const productosApi = axios.create({
  baseURL: `${baseURL}/Productos/api/v1`
});


productosApi.interceptors.request.use(
  (config) => {
    try {
      const access = sessionStorage.getItem('token');      
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

export const activateProductos = (id) => {
    return productosApi.post(`/activate/${id}/`);
};

export const searchProductos = (search, page) => {
    return productosApi.get(`/search/${page}/`, {search});
};

export const createProducto = (producto) => {
    return productosApi.post('/create/', producto);
};

export const updateProducto = (id, producto) => {
    return productosApi.put(`/update/${id}/`, producto);  
}

export const deleteProducto = (id) => {
    return productosApi.post(`/delete/${id}/`);
}