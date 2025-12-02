import { createContext, useContext, useState } from "react";
import { createVenta } from "../apis/ventas.api";
import { useProductos } from "./ProductosContext";

const VentasContext = createContext();

// Provider
export const VentasProvider = ({ children }) => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setProductos,cargarProductos } = useProductos();

  // Función para actualizar stock solo de los productos vendidos
  

  // Función para crear una venta
  const agregarVenta = async (venta) => {
    setLoading(true);
    try {
      const response = await createVenta(venta);

      if (response && response.id) { 
        cargarProductos();
      }

      return response;
    } catch (error) {
      console.error("Error creando venta:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <VentasContext.Provider
      value={{
        ventas,
        setVentas,
        agregarVenta,
        loading,
      }}
    >
      {children}
    </VentasContext.Provider>
  );
};

// Hook para usar el contexto
export const useVentas = () => useContext(VentasContext);
