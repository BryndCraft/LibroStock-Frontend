import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  createProducto,
  searchProductos,
  updateProducto,
  deleteProducto,
  activateProductos,
} from "../apis/productos.api";
import { AirlineSeatReclineExtraSharp } from "@mui/icons-material";
const ProductosContext = createContext(null);

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockBajo, setStockBajo] = useState();
  const [sinStock, setSinStock] = useState();
  const [desactivados, setDesactivados] = useState();
  const [productosActivos, setProductosActivos] = useState();
  const hasLoaded = useRef(false);

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
    const response = await createProducto(datos);
    await cargarProductos();
    return response;
  };
  const editarProducto = async (id, datos) => {
    await updateProducto(id, datos);

    await cargarProductos();
  };
  const eliminarProducto = async (id) => {
    await deleteProducto(id);
    await cargarProductos();
  };

  const activarProducto = async (id) => {
    const response = await activateProductos(id);
    await cargarProductos();
    return response;
  };
  useEffect(() => {
    if (!hasLoaded.current){
      hasLoaded.current = true;
      cargarProductos();
    }
  }, []);

  useEffect(() => {
    setStockBajo(
      productos.filter((p) => (p.stock || 0) <= (p.stock_minimo || 0)).length
    );
    setSinStock(productos.filter((p) => (p.stock || 0) <= 0).length);
    setDesactivados(productos.filter((p) => !p.activo).length);
    setProductosActivos(productos.filter((p) => p.activo).length);
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
