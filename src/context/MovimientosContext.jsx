// src/context/KardexContext.js
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { searchMovimientos } from "../apis/movimientos.api";
import axios from "axios";

const MovimientosContext = createContext();

export const MovimientoProvider = ({ children }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);
  // Función para traer todos los movimientos o por producto del registro contable
  const fetchMovimientos = async (page=1, producto = "", fechaInicio = "", fechaFin = "") => {
    try {
      const response = await searchMovimientos(page=1, producto, fechaInicio, fechaFin);
      setMovimientos(response.data.results || []);
      console.log("hoal");
    } catch (error) {
      console.error("Error al obtener Kardex:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchMovimientos();
  }, []);
   return (
    <MovimientosContext.Provider
      value={{
        movimientos, setMovimientos, fetchMovimientos
      }}
    >
      {children}
    </MovimientosContext.Provider>
  );
};

// Hook para usar el context
export const useMovimientos = () => useContext(MovimientosContext);
