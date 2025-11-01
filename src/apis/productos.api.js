import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const productosApi = axios.create({
  baseURL: `${baseURL}/Productos/api/v1`
});

export const searchProductos = (search, page) => {
    return productosApi.post(`/search/${page}/`, {search});
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