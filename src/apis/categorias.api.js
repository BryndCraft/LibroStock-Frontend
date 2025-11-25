import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const categoriasApi = axios.create({
  baseURL: `${baseURL}/Categorias/api/v1`
});


categoriasApi.interceptors.request.use(
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

export const searchCategorias = (search, page) => {
    return categoriasApi.get(`/search/${page}/`, {search});
}

export const createCategoria = (categoria) => {
    return categoriasApi.post("/create/", categoria);
};

export const updateCategoria = (id, categoria) => {
    return categoriasApi.patch(`/update/${id}/`, categoria);  
}

export const deleteCategoria = (id) => {
    return categoriasApi.post(`/delete/${id}/`);
}

export const activateCategoria = (id) =>{
  return categoriasApi.post(`/activate/${id}/`)
}

