import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const usuariosApi = axios.create({
  baseURL: `${baseURL}/Auth/api/v1`
});

usuariosApi.interceptors.request.use(
  (config) => {
    try {
      const access = localStorage.getItem('token');
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

// 🔹 Iniciar sesión (solo admin)
export const login = (credentials) => {
  return usuariosApi.post("/login/", credentials);
};

// 🔹 Cerrar sesión
export const logoutApi = () => {
  return usuariosApi.post("/logout/");
};    

export const uploadFoto = async(archivo) => {
  const formData = new FormData();
  formData.append("foto", archivo);

  try {
    const response = await usuariosApi.post("/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir la foto:", error);
    throw error;
  }
};