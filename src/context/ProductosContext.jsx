import { createContext, useContext, useState, useEffect } from "react";
import { createProducto, searchProductos, updateProducto, deleteProducto } from "../apis/productos.api";
import { AirlineSeatReclineExtraSharp } from "@mui/icons-material";
const ProductosContext = createContext(null);

export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const response = await searchProductos("", 1);
            setProductos(response.data?.Productos?.results || []);
            setLoading(false);
        } catch (error) {
            console.error("Error cargando productos:", error);
            setLoading(false);
        }
    };

    const agregarProducto = async (datos) => {
    await createProducto(datos);
    await cargarProductos();
  };
    const editarProducto = async (id, datos) => {
    await updateProducto(id, datos);
    await cargarProductos();
  };
  const eliminarProducto = async (id) => {
    await deleteProducto(id);
    await cargarProductos();
  };
    useEffect(() => {
    cargarProductos();
  }, []);
 return (
    <ProductosContext.Provider
      value={{
        productos, 
        loading, 
        cargarProductos, 
        agregarProducto, 
        editarProducto, 
        eliminarProducto
      }}
    >
      {children}
    </ProductosContext.Provider>
  );    
};


export const useProductos = () => {
  return useContext(ProductosContext);
};
