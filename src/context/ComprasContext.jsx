import { createContext, useContext, useEffect, useState, useRef } from "react";
import { searchCompras, createCompra } from "../apis/compras.api";
import { useProductos } from "./ProductosContext";
// Creamos el contexto
const ComprasContext = createContext();


// Provider
export const ComprasProvider = ({ children }) => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);

  const { setProductos } = useProductos();

  // Función para cargar compras, opcionalmente filtradas por producto_id
  const cargarCompras = async (producto_id = "") => {
    try {
      setLoading(true);
      const response = await searchCompras(producto_id);
      setCompras(response.data?.Compras || []);
    } catch (error) {
      console.error("Error cargando compras:", error);
    } finally {
      setLoading(false);
    }
  };
  const actualizarStock = (productosCompra) => {
    setProductos((prevProductos) =>
      prevProductos.map((prod) => {
        const actualizado = productosCompra.find(
          (p) => p.producto_id === prod.id
        );
        if (actualizado) {
          return {
            ...prod,
            stock: (prod.stock || 0) + (actualizado.cantidad || 0),
          };
        }
        return prod;
      })
    );
  };
  // Función para crear una compra
  const agregarCompra = async (compra) => {
    try {
      setLoading(true);
      const response = await createCompra(compra);

      // Actualizamos solo los productos de la compra
      actualizarStock(compra.productos);

      return response;
    } catch (error) {
      console.error("Error creando compra:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current){
      hasLoaded.current = true;
      cargarCompras();
    }
  }, []);
  
  return (
    <ComprasContext.Provider
      value={{
        compras,
        cargarCompras,
        agregarCompra,
      }}
    >
      {children}
    </ComprasContext.Provider>
  );
};

// Hook para usar el contexto
export const useCompras = () => useContext(ComprasContext);
