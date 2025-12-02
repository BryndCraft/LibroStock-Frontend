import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const proveedorApi = axios.create({
  baseURL: `${baseURL}/Proveedores/api/v1`
});
proveedorApi.interceptors.request.use(
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

export const searchProveedor = (search, page) => {
    return proveedorApi.get(`/search/${page}/`, {search});
};

export const createProveedor = (Proveedor) => {
    return proveedorApi.post('/create/', Proveedor);
};

export const updateProveedor = (id, Proveedor) => {
    return proveedorApi.patch(`/update/${id}/`, Proveedor);  
}

export const deleteProveedor = (id) => {
    return proveedorApi.post(`/delete/${id}/`);
}

export const activateProveedor = (id) =>{
  return proveedorApi.post(`/activate/${id}/`);
}