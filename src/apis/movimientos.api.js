
// urlpatterns = [
//     path('api/v1/search/<int:page>/', views.movimiento_buscar, name='search_movimiento'),
//     path('api/v1/create/', views.movimiento_crear, name='create_movimiento'),
//     path('api/v1/update/<int:id>/', views.movimiento_editar, name='update_movimiento'),
//     path('api/v1/delete/<int:id>/', views.movimiento_eliminar, name='delete_movimiento'),
//     path('api/v1/activate/<int:id>/', views.movimiento_activar, name='activate_movimiento'),
// ]

import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const movimientosApi = axios.create({
  baseURL: `${baseURL}/Movimientos/api/v1`
});


movimientosApi.interceptors.request.use(
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

export const searchMovimientos = (search, page) => {
    return movimientosApi.get(`/search/${page}/`, {search});
}

export const createMovimiento = (movimiento) => {
    return movimientosApi.post("/create/", movimiento);
};

export const updateMovimientos = (id, movimientos) => {
    return movimientosApi.patch(`/update/${id}/`, movimientos);  
}

export const deleteMovimientos = (id) => {
    return movimientosApi.post(`/delete/${id}/`);
}

export const activateMovimientos = (id) => {
  return movimientosApi.post(`/activate/${id}`);
}