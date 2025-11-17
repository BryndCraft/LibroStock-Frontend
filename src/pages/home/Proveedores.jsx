import { useState, useEffect } from "react";
import { Add, Search, FilterList, TableChart, Dashboard, Clear, Business } from "@mui/icons-material";
import Sidebar from "../../components/utils/Sidebar";
import VistaCardsProveedores from "../../components/utils/VistaCardsProveedores";
import VistaTablaProveedores from "../../components/utils/VistaTablaProveedores";
import { ProveedorForm } from "../../components/Forms/ProveedorForm";
import CustomSelect from "../../components/utils/CustomSelect";
import {createProveedor, searchProveedor, deleteProveedor, updateProveedor } from "../../apis/proveedores.api";

import Swal from "sweetalert2";
export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [mostrarFormProveedor, setMostrarFormProveedor] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState('tabla'); // 'tabla' o 'cards'
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Cargar proveedores al iniciar
  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async (query = "") => {
    try {
      setCargando(true);
      const response = await searchProveedor(query, 1);
      setProveedores(response.data?.Proveedores?.results || []);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      setProveedores([]);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar proveedores
  const proveedoresFiltrados = proveedores.filter(proveedor => {
    const coincideBusqueda = 
      proveedor.empresa.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      proveedor.nombre_contacto?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      proveedor.ruc?.includes(filtroBusqueda) ||
      proveedor.correo?.toLowerCase().includes(filtroBusqueda.toLowerCase());

    const coincideEstado = 
      !filtroEstado || 
      (filtroEstado === 'activos' && proveedor.activo) ||
      (filtroEstado === 'inactivos' && !proveedor.activo);

    return coincideBusqueda && coincideEstado;
  });

  // Handlers
  const handleEditarProveedor = (proveedor) => {
    setProveedorEditando(proveedor);
    setMostrarFormProveedor(true);
  };

  const handleEliminarProveedor = async (id) => {
    const result = await Swal.fire({
  title: '¿Estás seguro?',
  text: '¿Deseas eliminar este proveedor?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6',
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'Cancelar'
});
    if (result.isConfirmed) {
      try {
        await deleteProveedor(id);
        fetchProveedores(); 
      } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        Swal.fire('Error', "Error al eliminar el proveedor", "error");
      }
    }else{
        return;
    }
  };

  const handleSaveProveedor = async (proveedorData) => {

    try {
      if (proveedorEditando) {
        await updateProveedor(proveedorEditando.id, proveedorData);
      } else {
        await createProveedor(proveedorData);
      }
      setMostrarFormProveedor(false);
      setProveedorEditando(null);
      fetchProveedores(); 
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      Swal.fire('Error', 'Error al guardar el proveedor', 'error');
    }
  };

  const limpiarFiltros = () => {
    setFiltroBusqueda('');
    setFiltroEstado('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/20">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 py-5 pb-2">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-orange-700 bg-clip-text text-transparent">
                  Gestión de Proveedores
                </h1>
                <p className="text-slate-600 mt-2 font-light">
                  Administra y organiza los proveedores de la librería
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setProveedorEditando(null);
                    setMostrarFormProveedor(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 font-semibold border border-emerald-200/30"
                >
                  <Add className="text-lg" />
                  Nuevo Proveedor
                </button>
              </div>
            </div>
          </header>

          {/* Filtros */}
          <div className="bg-white/50 backdrop-blur-lg border-b border-slate-200/40 p-3 pt-3 pb-[0.01rem]">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Barra de búsqueda - ocupa 4 columnas */}
                <div className="md:col-span-4 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={filtroBusqueda}
                    onChange={(e) => setFiltroBusqueda(e.target.value)}
                    placeholder="Buscar proveedores, contacto, RUC o email..."
                    className="w-full pl-12 pr-4 py-3 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                {/* Filtro por estado - ocupa 2 columnas */}
                <div className="md:col-span-2">
                  <CustomSelect
                    label="Estado"
                    options={[
                      { value: '', label: 'Todos los estados' },
                      { value: 'activos', label: 'Activos' },
                      { value: 'inactivos', label: 'Inactivos' },
                    ]}
                    value={filtroEstado}
                    onChange={setFiltroEstado}
                    width="100%"
                    margin={0}
                    required={false}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderColor: 'rgba(203, 213, 225, 0.8)'
                        }
                      }
                    }}
                  />
                </div>

                {/* Botones de vista - ocupa 3 columnas */}
                <div className="md:col-span-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setVista('tabla')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all ${
                        vista === 'tabla'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-500 shadow-lg'
                          : 'bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300 backdrop-blur-sm'
                      }`}
                    >
                      <TableChart className="text-lg" />
                      Tabla
                    </button>
                    <button
                      onClick={() => setVista('cards')}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all ${
                        vista === 'cards'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-500 shadow-lg'
                          : 'bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300 backdrop-blur-sm'
                      }`}
                    >
                      <Dashboard className="text-lg" />
                      Cards
                    </button>
                    <button
                      onClick={limpiarFiltros}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium border border-slate-500/20"
                    >
                      <Clear className="text-lg" />
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>

              {/* Etiquetas de filtros activos */}
              {(filtroBusqueda || filtroEstado) && (
                <div className="md:col-span-12 flex flex-wrap gap-2 mt-2">
                  {filtroBusqueda && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      Búsqueda: "{filtroBusqueda}"
                      <button onClick={() => setFiltroBusqueda("")} className="text-orange-600 hover:text-orange-800">
                        ×
                      </button>
                    </span>
                  )}
                  {filtroEstado && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      Estado: {filtroEstado === 'activos' ? 'Activos' : 'Inactivos'}
                      <button onClick={() => setFiltroEstado("")} className="text-orange-600 hover:text-orange-800">
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1 overflow-auto p-6 pt-2">
            {cargando ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-sm border border-slate-200/40 overflow-hidden">
                  <div className="p-8 pt-[1rem] pb-[0.6rem] border-b border-slate-200/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        Proveedores <span className="text-orange-600">({proveedoresFiltrados.length})</span>
                      </h2>
                      <p className="text-slate-600 mt-1 font-light">
                        {filtroBusqueda ? `Filtrado por: "${filtroBusqueda}"` : 'Todos los proveedores registrados'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <FilterList className="text-lg" />
                      <span className="text-sm font-medium">
                        {vista === 'tabla' ? 'Vista de tabla' : 'Vista de tarjetas'}
                      </span>
                    </div>
                  </div>

                  <div className="px-8 pb-6">
                    {vista === 'tabla' ? (
                      <VistaTablaProveedores
                        proveedores={proveedoresFiltrados}
                        onEditar={handleEditarProveedor}
                        onEliminar={handleEliminarProveedor}
                      />
                    ) : (
                      <VistaCardsProveedores
                        proveedores={proveedoresFiltrados}
                        onEditar={handleEditarProveedor}
                        onEliminar={handleEliminarProveedor}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal del Formulario */}
          {mostrarFormProveedor && (
            <ProveedorForm
              proveedor={proveedorEditando}
              onSave={handleSaveProveedor}
              onCancel={() => {
                setMostrarFormProveedor(false);
                setProveedorEditando(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}