import { createContext, useContext, useEffect, useState } from "react";
import { createVenta } from "../apis/ventas.api";
import { useProductos } from "./ProductosContext";
const VentasContext = createContext();

// Provider
export const VentasProvider = ({ children }) => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setProductos} = useProductos();


  const actualizarStock = (productosventa) => {
    setProductos((prevProductos) =>
      prevProductos.map((prod) => {
        const actualizado = productosventa.find(
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
  // Función para crear una venta
  const agregarVenta = async (venta) => {
    try {
      const response = await createVenta(venta);

      
      actualizarStock(venta.productos);

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
        agregarVenta
      }}
    >
      {children}
    </VentasContext.Provider>
  );
};

// Hook para usar el contexto
export const useVentas = () => useContext(VentasContext);
