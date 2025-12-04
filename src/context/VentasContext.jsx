import { createContext, useContext, useEffect, useState } from "react";
import { createVenta, listVentas } from "../apis/ventas.api";
import { useProductos } from "./ProductosContext";

const VentasContext = createContext();

// Provider
export const VentasProvider = ({ children }) => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cargarProductos } = useProductos();


  const agregarVenta = async (venta) => {
    setLoading(true);
    try {
      const response = await createVenta(venta);

      await cargarProductos();

      return response.data;
    } catch (error) {
      console.error("Error creando venta:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

 
  const cargarVentas = async (factura_id) => {
    setLoading(true);
    try {
      const response = await listVentas(factura_id);
      setVentas(response.data.Ventas || []);
    } catch (error) {
      console.error("Error cargando ventas:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

useEffect(() =>{
  cargarVentas()
}, [])

  
  return (
    <VentasContext.Provider
      value={{
        ventas,
        setVentas,
        agregarVenta,
        cargarVentas,
        loading,
      }}
    >
      {children}
    </VentasContext.Provider>
  );
};

// Hook para usar el contexto
export const useVentas = () => useContext(VentasContext);
