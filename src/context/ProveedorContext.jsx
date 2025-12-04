// context/ProveedorContext.js
import { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  searchProveedor,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  activateProveedor
} from "../apis/proveedores.api";

const ProveedorContext = createContext();

export const ProveedorProvider = ({ children }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState("");

  // Cargar proveedores
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

  // Filtrar proveedores
  const proveedoresFiltrados = proveedores.filter((proveedor) => {
    const coincideBusqueda =
      proveedor.empresa.toLowerCase().includes(search.toLowerCase()) ||
      proveedor.nombre_contacto?.toLowerCase().includes(search.toLowerCase()) ||
      proveedor.ruc?.includes(search) ||
      proveedor.correo?.toLowerCase().includes(search.toLowerCase());

    const coincideEstado =
      !filtroEstado ||
      (filtroEstado === "activos" && proveedor.activo) ||
      (filtroEstado === "inactivos" && !proveedor.activo);

    return coincideBusqueda && coincideEstado;
  });

  // Crear proveedor
  const agregarProveedor = async (data) => {
    try {
      const res = await createProveedor(data);

      await fetchProveedores();
      Swal.fire("Éxito", "Proveedor creado correctamente", "success");
      return res.data;
    } catch (error) {
      console.error("Error creando proveedor:", error);
      Swal.fire("Error", "Error al crear el proveedor", "error");
      throw error;
    }
  };

  // Actualizar proveedor
  const editarProveedor = async (id, data) => {
    try {
      const res = await updateProveedor(id, data);
      await fetchProveedores();
      Swal.fire("Éxito", "Proveedor actualizado correctamente", "success");
      return res.data;
    } catch (error) {
      console.error("Error actualizando proveedor:", error);
      Swal.fire("Error", "Error al actualizar el proveedor", "error");
      throw error;
    }
  };

  // Eliminar proveedor
  const eliminarProveedor = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este proveedor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteProveedor(id);
        await fetchProveedores();
        Swal.fire("Eliminado", "Proveedor eliminado correctamente", "success");
        return res.data;
      } catch (error) {
        console.error("Error eliminando proveedor:", error);
        Swal.fire("Error", "Error al eliminar el proveedor", "error");
        throw error;
      }
    }
  };

  // Activar proveedor
  const activarProveedor = async (id) => {
    try {
      const res = await activateProveedor(id);
      await fetchProveedores();
      Swal.fire("Éxito", "Proveedor activado correctamente", "success");
      return res;
    } catch (error) {
      console.error("Error activando proveedor:", error);
      Swal.fire("Error", "Error al activar el proveedor", "error");
      throw error;
    }
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setSearch("");
    setFiltroEstado("");
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return (
    <ProveedorContext.Provider
      value={{
        proveedores: proveedoresFiltrados,
        total,
        loading,
        search,
        setSearch,
        filtroEstado,
        setFiltroEstado,
        page,
        setPage,
        fetchProveedores,
        agregarProveedor,
        editarProveedor,
        eliminarProveedor,
        activarProveedor,
        limpiarFiltros,
      }}
    >
      {children}
    </ProveedorContext.Provider>
  );
};

// Hook para consumir el contexto fácilmente
export const useProveedor = () => useContext(ProveedorContext);
