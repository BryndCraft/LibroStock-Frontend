import { useState, useEffect } from "react";
import Sidebar from "../../components/utils/Sidebar";
import { CategoriaForm } from "../../components/Forms/CategoriaForms";
import { ProductoForm } from "../../components/Forms/ProductoForms";
import { KeyboardArrowDown, Check } from "@mui/icons-material";
import { searchCategorias, createCategoria, updateCategoria, deleteCategoria } from "../../apis/categorias.api";
import { searchProductos, createProducto, updateProducto, deleteProducto, activateProductos } from "../../apis/productos.api";
import { ToggleOn, ToggleOff } from "@mui/icons-material";
import {
  Search,
  Add,
  Edit,
  Delete,
  Category,
  Inventory2,
  LocalOffer,
  TableChart,
  Dashboard,
  Clear,
  FilterList,
  Inventory

} from "@mui/icons-material";
import { Warning, TaskAlt } from "@mui/icons-material";

import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Menu, MenuItem, Button } from "@mui/material";
import Swal from "sweetalert2";
import CustomSelect from "../../components/utils/CustomSelect";



export default function Inventario() {
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [mostrarFormCategoria, setMostrarFormCategoria] = useState(false);
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState('cards');
  const [vistaActual, setVistaActual] = useState('productos');
  const [cargando, setCargando] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroStock, setFiltroStock] = useState("");

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setCargando(true);
      await Promise.all([
        cargarProductos(),
        cargarCategorias()
      ]);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await searchCategorias("", 1);
      setCategorias(response.data?.Categorias?.results || []);
      console.log(response.data);
    } catch (error) {
      console.log('Error cargando categorías:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await searchProductos("", 1);
      setProductos(response.data.Productos.results || []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const obtenerNombreCategoria = (categoriaId) => {
    if (!categoriaId) return 'Sin categoría';
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  const handleEditarProducto = (producto) => {
    setProductoEditando(producto);
    setMostrarFormProducto(true);
  };
  const activarProducto = async (productoId) => {
    const result = await Swal.fire({
      title: `¿Activar el producto?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        const response = await activateProductos(productoId);
        if (response.status === 200) {
          cargarProductos();
          Swal.fire("Activado!", "El producto ha sido activado", "sucess");
        } else {
          Swal.fire("Error", "Hubo un error al activar el producto", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Hubo un error al activar el producto", "error");
      }
    }
  }
  const handleEliminarProducto = async (productoId) => {
    const result = await Swal.fire({
      title: `¿Desactivar el producto?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        await deleteProducto(productoId);
        cargarProductos();
        Swal.fire('¡Desactivado!', 'El producto ha sido desactivado.', 'success');
      } catch (error) {
        console.error("Error deleting categories:", error);
        Swal.fire('Error', 'No se pudo desactivar el producto', 'error');
      }
    }
  };

  const handleEditarCategoria = (categoria) => {
    setCategoriaEditando(categoria);
    setMostrarFormCategoria(true);
  };

  const handleEliminarCategoria = async (categoriaId) => {
    const result = await Swal.fire({
      title: `¿Eliminar la categoria?`,
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        await deleteCategoria(categoriaId);
        cargarCategorias();
        Swal.fire('¡Eliminadas!', 'Las categorías han sido eliminadas.', 'success');
      } catch (error) {
        console.error("Error deleting categories:", error);
        Swal.fire('Error', 'No se pudieron eliminar las categorías', 'error');
      }
    }
  };

  const handleSaveProducto = async (datos) => {
    try {
      if (productoEditando) {
        await updateProducto(productoEditando.id, datos);
      } else {
        await createProducto(datos);
      }
      setMostrarFormProducto(false);
      setProductoEditando(null);
      cargarProductos();
    } catch (error) {
      console.error('Error guardando producto:', error);
    }
  };

  const handleSaveCategoria = async (datos) => {
    try {
      if (categoriaEditando) {
        await updateCategoria(categoriaEditando.id, datos);
      } else {
        await createCategoria(datos);
      }
      setMostrarFormCategoria(false);
      setCategoriaEditando(null);
      cargarCategorias();
    } catch (error) {
      console.error('Error guardando categoría:', error);
    }
  };

  const formatearPrecio = (precio) => {
    return `C$ ${parseFloat(precio).toFixed(2)}`;
  };

  const getColorStock = (stock) => {
    if (stock === 0) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (stock < 10) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda =
      producto.nombre?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      producto.codigo_barras?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      obtenerNombreCategoria(producto.categoria_id)?.toLowerCase().includes(filtroBusqueda.toLowerCase());

    const coincideCategoria =
      !filtroCategoria || producto.categoria_id === parseInt(filtroCategoria);

    const coincideStock = (() => {
      switch (filtroStock) {
        case 'con-stock':
          return producto.stock > 0;
        case 'sin-stock':
          return producto.stock === 0;
        case 'stock-bajo':
          return producto.stock > 0 && producto.stock < 10;
        default:
          return true;
      }
    })();

    return coincideBusqueda && coincideCategoria && coincideStock;
  });
  const limpiarFiltros = () => {
    setFiltroBusqueda("");
    setFiltroCategoria("");
    setFiltroStock("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 py-5 pb-2">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                  {vistaActual === 'productos' ? 'Gestión de Inventario' : 'Gestión de Categorías'}
                </h1>
                <p className="text-slate-600 mt-2 font-light">
                  {vistaActual === 'productos'
                    ? 'Administra y organiza los productos de la librería'
                    : 'Gestiona las categorías de productos'
                  }
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setVistaActual(vistaActual === 'productos' ? 'categorias' : 'productos')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 font-semibold border border-purple-200/30"
                >
                  {vistaActual === 'productos' ?
                    <><Category className="text-lg" /> Ver Categorías</> :
                    <><Inventory2 className="text-lg" /> Ver Productos</>
                  }
                </button>

                {vistaActual === 'categorias' && (
                  <button
                    onClick={() => {
                      setCategoriaEditando(null);
                      setMostrarFormCategoria(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 font-semibold border border-emerald-200/30"
                  >
                    <Add className="text-lg" />
                    Nueva Categoría
                  </button>
                )}

                {vistaActual === 'productos' && (
                  <button
                    onClick={() => {
                      setProductoEditando(null);
                      setMostrarFormProducto(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 font-semibold border border-blue-200/30"
                  >
                    <Add className="text-lg" />
                    Nuevo Producto
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Filtros - solo mostrar para productos */}
          {vistaActual === 'productos' && (
            <div className="bg-white/50 backdrop-blur-lg border-b border-slate-200/40 p-3  pt-3 pb-[0.01rem]">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 ">
                  {/* Barra de búsqueda - ocupa 5 columnas */}
                  <div className="md:col-span-4 relative ">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={filtroBusqueda}
                      onChange={(e) => setFiltroBusqueda(e.target.value)}
                      placeholder="Buscar productos, código o categoría..."
                      className="w-full pl-12 pr-4 py-3 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    />
                  </div>


                  <div className="md:col-span-2">
                    <CustomSelect
                      label="Categorías"
                      options={[
                        { value: '', label: 'Todas las categorías' },
                        ...categorias.map(cat => ({
                          value: cat.id.toString(),
                          label: cat.nombre
                        }))
                      ]}
                      value={filtroCategoria}
                      onChange={setFiltroCategoria}
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
                  <div className="md:col-span-2">
                    <CustomSelect
                      label="Estado de stock"
                      options={[
                        { value: '', label: 'Estado de stock' },
                        { value: 'con-stock', label: 'Con stock' },
                        { value: 'sin-stock', label: 'Sin stock' },
                        { value: 'stock-bajo', label: 'Stock bajo' },
                      ]}
                      value={filtroStock}
                      onChange={setFiltroStock}
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


                  {/* Botones de vista - ocupa 2 columnas */}
                  <div className="md:col-span-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setVista('tabla')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all ${vista === 'tabla'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-500 shadow-lg'
                          : 'bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300 backdrop-blur-sm'
                          }`}
                      >
                        <TableChart className="text-lg" />
                        Tabla
                      </button>
                      <button
                        onClick={() => setVista('cards')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all ${vista === 'cards'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-500 shadow-lg'
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
                  {/* Después de los filtros, antes del cierre del div de filtros */}
                  {(filtroBusqueda || filtroCategoria || filtroStock) && (
                    <div className="md:col-span-12 flex flex-wrap gap-2 mt-2">
                      {filtroBusqueda && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          Búsqueda: "{filtroBusqueda}"
                          <button onClick={() => setFiltroBusqueda("")} className="text-blue-600 hover:text-blue-800">
                            ×
                          </button>
                        </span>
                      )}
                      {filtroCategoria && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Categoría: {categorias.find(c => c.id.toString() === filtroCategoria)?.nombre}
                          <button onClick={() => setFiltroCategoria("")} className="text-green-600 hover:text-green-800">
                            ×
                          </button>
                        </span>
                      )}
                      {filtroStock && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          Stock: {filtroStock === 'con-stock' ? 'Con stock' : filtroStock === 'sin-stock' ? 'Sin stock' : 'Stock bajo'}
                          <button onClick={() => setFiltroStock("")} className="text-orange-600 hover:text-orange-800">
                            ×
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* el pt que esta ahi controla el aumento vertical entre la barra de busqueda y la tabla */}
          <div className="flex-1 overflow-auto p-6 pt-2">
            {cargando ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : vistaActual === 'productos' ? (
              <div className="max-w-7xl mx-auto">
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-sm border border-slate-200/40 overflow-hidden">
                  <div className="p-8 pt-[1rem] pb-[0.6rem] border-b border-slate-200/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        Productos <span className="text-blue-600">({productosFiltrados.length})</span>
                      </h2>
                      <p className="text-slate-600 mt-1 font-light">
                        {filtroBusqueda ? `Filtrado por: "${filtroBusqueda}"` : 'Todos los productos disponibles'}
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
                      <VistaTabla
                        productos={productosFiltrados}
                        formatearPrecio={formatearPrecio}
                        getColorStock={getColorStock}
                        obtenerNombreCategoria={obtenerNombreCategoria}
                        onEditar={handleEditarProducto}
                        onEliminar={handleEliminarProducto}
                      />
                    ) : (
                      <VistaCards
                        productos={productosFiltrados}
                        formatearPrecio={formatearPrecio}
                        getColorStock={getColorStock}
                        obtenerNombreCategoria={obtenerNombreCategoria}
                        onEditar={handleEditarProducto}
                        onEliminar={handleEliminarProducto}
                        onActivar={activarProducto}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-sm border border-slate-200/40 overflow-hidden">
                  <div className="p-8 border-b border-slate-200/40 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        Categorías <span className="text-purple-600">({categorias.length})</span>
                      </h2>
                      <p className="text-slate-600 mt-1 font-light">Organiza tus productos por categorías</p>
                    </div>
                  </div>

                  <div className="p-8">
                    <VistaCategorias
                      categorias={categorias}
                      onEditar={handleEditarCategoria}
                      onEliminar={handleEliminarCategoria}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modales */}
          {mostrarFormProducto && (
            <ProductoForm
              producto={productoEditando}
              onSave={handleSaveProducto}
              onCancel={() => {
                setMostrarFormProducto(false);
                setProductoEditando(null);
              }}
            />
          )}

          {mostrarFormCategoria && (
            <CategoriaForm
              categoria={categoriaEditando}
              onSave={handleSaveCategoria}
              onCancel={() => {
                setMostrarFormCategoria(false);
                setCategoriaEditando(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function VistaTabla({ productos, formatearPrecio, getColorStock, obtenerNombreCategoria, onEditar, onEliminar }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/40">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50/80 to-blue-50/50 border-b border-slate-200/40">
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Producto</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Categoría</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Precio</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Stock</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className="border-b border-slate-200/40 hover:bg-blue-50/20 transition-colors duration-200 group">
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Inventory2 className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-lg">{producto.nombre}</div>
                    <div className="text-slate-500 text-sm mt-1 font-mono">{producto.codigo_barras}</div>
                    {producto.descripcion && (
                      <div className="text-slate-600 text-sm mt-2 max-w-md line-clamp-2 font-light">{producto.descripcion}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="p-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50/80 text-purple-700 text-sm font-medium border border-purple-200/60 backdrop-blur-sm">
                  <Category className="w-4 h-4" />
                  {obtenerNombreCategoria(producto.categoria_id)}
                </span>
              </td>
              <td className="p-6">
                <div className="flex items-center gap-2">
                  <LocalOffer className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-emerald-600 text-lg">
                    {formatearPrecio(producto.precio)}
                  </span>
                </div>
              </td>
              <td className="p-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm ${getColorStock(producto.stock)}`}>
                  {producto.stock} unidades
                </span>
              </td>
              <td className="p-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditar(producto)}
                    className="p-3 text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-200 hover:scale-105 border border-blue-200/60 backdrop-blur-sm hover:border-blue-300"
                    title="Editar producto"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onEliminar(producto.id)}
                    className="p-3 text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all duration-200 hover:scale-105 border border-rose-200/60 backdrop-blur-sm hover:border-rose-300"
                    title="Eliminar producto"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VistaCards({ productos, formatearPrecio, getColorStock, obtenerNombreCategoria, onEditar, onEliminar, onActivar }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {productos.map((producto) => (
        <div key={producto.id} className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-sm hover:shadow-2xl border border-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:border-slate-300/60 flex flex-col min-h-[280px]">
          <div className="p-5 flex-1 flex flex-col">
            {/* Header con icono y stock */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Inventory2 className="text-white text-xl" />
              </div>            
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xl font-medium border backdrop-blur-sm ${getColorStock(producto.stock)}`}>
                {producto.stock} unidades
              </span>
            </div>

            {/* Contenedor principal */}
            <div className="space-y-3 flex-1">
              <h3 className="font-bold text-slate-800 text-2xl line-clamp-2 group-hover:text-slate-900 transition-colors leading-tight">
                {producto.nombre}
              </h3>

              {producto.descripcion && (
                <p className="text-slate-600 text-lg line-clamp-2 leading-relaxed font-light">
                  {producto.descripcion}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {/* Columna izquierda - Categoría */}
                <div className="flex items-start gap-2 min-w-0">
                  <div className="w-6 h-6 bg-purple-100/80 rounded-lg flex items-center justify-center border border-purple-200/60 flex-shrink-0 mt-0.5">
                    <Category className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-xs text-slate-700 font-medium break-words line-clamp-2 min-w-0">
                    {obtenerNombreCategoria(producto.categoria_id)}
                  </span>
                </div>

                {/* Columna derecha - Precio */}
                <div className="flex items-start gap-2 min-w-0">
                  <div className="w-6 h-6 bg-emerald-100/80 rounded-lg flex items-center justify-center border border-emerald-200/60 flex-shrink-0 mt-0.5">
                    <LocalOffer className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="font-bold text-emerald-600 text-sm break-words min-w-0">
                    {formatearPrecio(producto.precio)}
                  </span>
                </div>
              </div>

              {/* Código de barras */}
              {producto.codigo_barras && (
                <div className="p-2 bg-slate-100/50 rounded-lg border border-slate-200/40 backdrop-blur-sm mt-3">
                  <span className="text-xs text-slate-500 font-mono truncate block">
                    Cód: {producto.codigo_barras}
                  </span>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4 mt-4 border-t border-slate-200/40">
              <button
                onClick={() => onEditar(producto)}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-blue-400/30 flex items-center justify-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Editar
              </button>
              {producto.activo ? (
                            <button
                onClick={() => onEliminar(producto.id)}
                className="flex-1 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-rose-400/30 flex items-center justify-center gap-1"
              >
                <ToggleOff className="w-3 h-3" />
                Desactivar
              </button>
  
              ) : (
                <button
                onClick={() => onActivar(producto.id)}
                className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-rose-400/30 flex items-center justify-center gap-1"
              >
                <ToggleOn className="w-3 h-3" />
                Activar
              </button>
  
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
// Componente para vista de categorías - ACTUALIZADO con bordes aesthetic
function VistaCategorias({ categorias, onEditar, onEliminar }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categorias.map((categoria) => (
        <div key={categoria.id} className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-sm hover:shadow-2xl border border-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:border-slate-300/60">
          <div className="p-6">
            {/* Header con icono */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Category className="text-white text-2xl" />
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${categoria.activo ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                {categoria.activo ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            {/* Información de la categoría */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-800 text-xl mb-3 group-hover:text-slate-900 transition-colors">{categoria.nombre || 'Sin nombre'}</h3>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 font-light">
                {categoria.descripcion || 'Sin descripción disponible'}
              </p>
            </div>

            {/* ID de la categoría */}
            <div className="mb-6 p-3 bg-slate-100/50 rounded-xl border border-slate-200/40 backdrop-blur-sm">
              <span className="text-xs text-slate-500 font-mono">ID: {categoria.id}</span>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-slate-200/40">
              <button
                onClick={() => onEditar(categoria)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-sm border border-blue-400/30"
              >
                Editar
              </button>
              <button
                onClick={() => onEliminar(categoria.id)}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-sm border border-rose-400/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 