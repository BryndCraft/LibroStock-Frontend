import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { searchCompras, createCompra } from "../apis/compras.api";
import { useProductos } from "./ProductosContext";

const ComprasContext = createContext();

export const ComprasProvider = ({ children }) => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cargarProductos, setProductos } = useProductos(); // Añadido setProductos

  // Función para cargar todas las compras
  const cargarCompras = useCallback(async (producto_id = "") => {
    try {
      setLoading(true);
      const response = await searchCompras(producto_id);
      setCompras(response.data?.Compras || []);
    } catch (error) {
      console.error("Error cargando compras:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para crear una compra
  const agregarCompra = useCallback(async (compra) => {
    setLoading(true);
    try {
      const response = await createCompra(compra);

      if (response && response.id) {
        await cargarProductos();
        
        setProductos([]); 
        setTimeout(async () => {
          await cargarProductos();
        }, 100);
      }

      // Actualizar lista de compras
      await cargarCompras();
      
      return {
        ...response,
        recargado: true // Flag para indicar que se recargaron productos
      };
    } catch (error) {
      console.error("Error creando compra:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [cargarProductos, cargarCompras, setProductos]);

  useEffect(() => {
    cargarCompras();
  }, [cargarCompras]);

  const value = useMemo(() => ({
    compras,
    loading,
    cargarCompras,
    agregarCompra,
  }), [compras, loading, cargarCompras, agregarCompra]);

  return (
    <ComprasContext.Provider value={value}>
      {children}
    </ComprasContext.Provider>
  );
};

export const useCompras = () => useContext(ComprasContext);