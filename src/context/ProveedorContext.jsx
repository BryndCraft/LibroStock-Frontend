import { createContext, useContext, useState, useEffect } from "react";
import {
  searchProveedor,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../apis/proveedores.api";

// 1️⃣ Crear el contexto
const ProveedorContext = createContext();

// 2️⃣ Hook para consumir el contexto
export const useProveedor = () => useContext(ProveedorContext);

// 3️⃣ Provider
export const ProveedorProvider = ({ children }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // 4️⃣ Función para cargar proveedores desde la API
  const fetchProveedores = async (searchTerm = search, pageNumber = page) => {
    setLoading(true);
    try {
      const response = await searchProveedor(searchTerm, pageNumber);
      setProveedores(response.data?.Proveedores?.results || []);
      setTotal(response.data?.Proveedores?.total || 0);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5️⃣ Crear proveedor
  const agregarProveedor = async (data) => {
    const res = await createProveedor(data);
    await fetchProveedores(); // recargar lista
    return res.data;
  };

  // 6️⃣ Actualizar proveedor
  const editarProveedor = async (id, data) => {
    const res = await updateProveedor(id, data);
    await fetchProveedores();
    return res.data;
  };

  // 7️⃣ Eliminar proveedor (soft delete)
  const eliminarProveedor = async (id) => {
    const res = await deleteProveedor(id);
    await fetchProveedores();
    return res.data;
  };

  // 8️⃣ Activar proveedor
  const activarProveedor = async (id) => {
    const res = await fetch(`/api/proveedores/activate/${id}`, {
      method: "POST",
    });
    await fetchProveedores();
    return res.json();
  };

  // 9️⃣ useEffect para cargar proveedores al montar
  useEffect(() => {
    fetchProveedores();
  }, []);

  // 1️⃣0️⃣ Context value
  const value = {
    proveedores,
    total,
    loading,
    search,
    setSearch,
    page,
    setPage,
    fetchProveedores,
    agregarProveedor,
    editarProveedor,
    eliminarProveedor,
    activarProveedor,
  };

  return (
    <ProveedorContext.Provider value={value}>
      {children}
    </ProveedorContext.Provider>
  );
};
