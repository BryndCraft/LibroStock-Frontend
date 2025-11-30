// src/context/KardexContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { searchKardex } from "../apis/kardex.api";
import axios from "axios";

const KardexContext = createContext();

export const KardexProvider = ({ children }) => {
  const [kardex, setKardex] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para traer todos los movimientos o por producto
  const fetchKardex = async (productoId = "") => {
    try {
      const response = await searchKardex(productoId);
      setKardex(response.data || []);
    } catch (error) {
      console.error("Error al obtener Kardex:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKardex();
  }, []);
   return (
    <KardexContext.Provider
      value={{
        kardex, setKardex
      }}
    >
      {children}
    </KardexContext.Provider>
  );
};

// Hook para usar el context
export const useKardex = () => useContext(KardexContext);
