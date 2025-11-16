import { createContext, useContext, useState, useEffect } from "react";
import { createCategoria, searchCategorias, updateCategoria, deleteCategoria } from "../apis/categorias.api";

const CategoriasContext = createContext(null);

export const CategoriasProvider = ({ children }) => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    const cargarCategorias = async () => {
        try {
            setLoading(true);
            const response = await searchCategorias("", 1);
            setCategorias(response.data?.Categorias?.results || []);
            setLoading(false);
        } catch (error) {
            console.error("Error cargando categorías:", error);
            setLoading(false);
        }
    };

    const agregarCategoria = async (datos) => {
    await createCategoria(datos);
    await cargarCategorias();
  };
    const editarCategoria = async (id, datos) => {
    await updateCategoria(id, datos);
    await cargarCategorias();
  };
  const eliminarCategoria = async (id) => {
    await deleteCategoria(id);
    await cargarCategorias();
  };
    useEffect(() => {
    cargarCategorias();
  }, []);
 return (
    <CategoriasContext.Provider
      value={{
        categorias,
        loading,
        cargarCategorias,
        agregarCategoria,
        editarCategoria,
        eliminarCategoria
      }}
    >
      {children}
    </CategoriasContext.Provider>
  );    
};


export const useCategorias = () => {
  return useContext(CategoriasContext);
};
