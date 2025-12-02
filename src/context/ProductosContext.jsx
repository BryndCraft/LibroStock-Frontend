import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  createProducto,
  searchProductos,
  updateProducto,
  deleteProducto,
  activateProductos,
} from "../apis/productos.api";

const ProductosContext = createContext(null);

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockBajo, setStockBajo] = useState(0);
  const [sinStock, setSinStock] = useState(0);
  const [desactivados, setDesactivados] = useState(0);
  const [productosActivos, setProductosActivos] = useState(0);

  // useCallback memoriza la función para que no se recree en cada render
  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await searchProductos("", 1);
      setProductos(response.data?.Productos?.results || []);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setLoading(false);
    }
  }, []); // no depende de nada externo

  const agregarProducto = useCallback(async (datos) => {
    const response = await createProducto(datos);
    await cargarProductos(); // usamos la versión memorizada
    return response;
  }, [cargarProductos]);

  const editarProducto = useCallback(async (id, datos) => {
    await updateProducto(id, datos);
    await cargarProductos();
  }, [cargarProductos]);

  const eliminarProducto = useCallback(async (id) => {
    await deleteProducto(id);
    await cargarProductos();
  }, [cargarProductos]);

  const activarProducto = useCallback(async (id) => {
    const response = await activateProductos(id);
    await cargarProductos();
    return response;
  }, [cargarProductos]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]); 

 
  useEffect(() => {
    setStockBajo(productos.filter((p) => (p.stock || 0) <= (p.stock_minimo || 0)).length);
    setSinStock(productos.filter((p) => (p.stock || 0) <= 0).length);
    setDesactivados(productos.filter((p) => !p.estado).length);
    setProductosActivos(productos.filter((p) => p.estado).length);
  }, [productos]);

  return (
    <ProductosContext.Provider
      value={{
        productos,
        loading,
        sinStock,
        stockBajo,
        desactivados,
        productosActivos,
        cargarProductos,
        agregarProducto,
        editarProducto,
        eliminarProducto,
        activarProducto,
        setProductos,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
};

export const useProductos = () => {
  return useContext(ProductosContext);
};
