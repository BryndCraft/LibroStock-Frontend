import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const categoriasApi = axios.create({
  baseURL: `${baseURL}/Categorias/api/v1`
});

export const searchCategorias = (search, page) => {
    return categoriasApi.post(`/search/${page}/`, {search});
}

export const createCategoria = (categoria) => {
    return categoriasApi.post("/create/", categoria);
};

export const updateCategoria = (id, categoria) => {
    return categoriasApi.patch(`/update/${id}/`, categoria);  
}

export const deleteCategoria = (id) => {
    return categoriasApi.post(`/delete/${id}`);
}

