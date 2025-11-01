import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { CategoriaForm } from "../../components/Forms/CategoriaForms";
import { ProductoForm } from "../../components/Forms/ProductoForms";
import { searchCategorias, createCategoria, updateCategoria, deleteCategoria } from "../../apis/categorias.api";
import { searchProductos, createProducto, updateProducto, deleteProducto } from "../../apis/productos.api";
import {
  Search,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Visibility,
  Category,
  Inventory2,
  LocalOffer,
  Person,
  Description,
  Archive,
  PlaylistAdd,
} from "@mui/icons-material";
import Swal from "sweetalert2";

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

  const handleEliminarProducto = async (productoId) => {
    const result = await Swal.fire({
      title: `¿Eliminar el producto?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        await deleteProducto(productoId);
        cargarProductos();
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
      } catch (error) {
        console.error("Error deleting categories:", error);
        Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
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
    if (stock === 0) return 'text-red-600 bg-red-50';
    if (stock < 10) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="h-screen w-full flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {vistaActual === 'productos' ? 'Gestión de Inventario' : 'Gestión de Categorías'}
              </h1>
              <p className="text-gray-500">
                {vistaActual === 'productos' 
                  ? 'Administrar productos de la librería escolar' 
                  : 'Administrar categorías de productos'
                }
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setVistaActual(vistaActual === 'productos' ? 'categorias' : 'productos')}
                className="px-4 py-3 bg-purple-600 text-white rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-purple-700 flex items-center gap-2"
              >
                {vistaActual === 'productos' ? <Category /> : <Inventory2 />}
                {vistaActual === 'productos' ? 'Ver Categorías' : 'Ver Productos'}
              </button>

              {vistaActual === 'categorias' && (
                <button
                  onClick={() => {
                    setCategoriaEditando(null);
                    setMostrarFormCategoria(true);
                  }}
                  className="px-4 py-3 bg-green-600 text-white rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-green-700 flex items-center gap-2"
                >
                  <Add />
                  Agregar Categoría
                </button>
              )}

              {vistaActual === 'productos' && (
                <button
                  onClick={() => {
                    setProductoEditando(null);
                    setMostrarFormProducto(true);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:cursor-pointer gap-2"
                >
                  <Add />
                  Agregar Producto
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Filtros - solo mostrar para productos */}
        {vistaActual === 'productos' && (
          <div className="bg-white border-b p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas las categorías</option>
              </select>

              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos los proveedores</option>
              </select>

              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todo el stock</option>
                <option value="con-stock">Con stock</option>
                <option value="sin-stock">Sin stock</option>
                <option value="stock-bajo">Stock bajo</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setVista('tabla')}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-all ${vista === 'tabla'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  Tabla
                </button>
                <button
                  onClick={() => setVista('cards')}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-all ${vista === 'cards'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  Cards
                </button>
              </div>

              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                Limpiar
              </button>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="flex-1 overflow-auto p-6">
          {cargando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : vistaActual === 'productos' ? (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Productos ({productos.length})
                </h2>
                <div className="text-sm text-gray-500">
                  {vista === 'tabla' ? 'Vista de tabla' : 'Vista de tarjetas'}
                </div>
              </div>

              <div className="p-6">
                {vista === 'tabla' ? (
                  <VistaTabla
                    productos={productos}
                    formatearPrecio={formatearPrecio}
                    getColorStock={getColorStock}
                    obtenerNombreCategoria={obtenerNombreCategoria}
                    onEditar={handleEditarProducto}
                    onEliminar={handleEliminarProducto}
                  />
                ) : (
                  <VistaCards
                    productos={productos}
                    formatearPrecio={formatearPrecio}
                    getColorStock={getColorStock}
                    obtenerNombreCategoria={obtenerNombreCategoria}
                    onEditar={handleEditarProducto}
                    onEliminar={handleEliminarProducto}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Categorías ({categorias.length})
                </h2>
                <div className="text-sm text-gray-500">
                  Vista de tarjetas
                </div>
              </div>

              <div className="p-6">
                <VistaCategorias
                  categorias={categorias}
                  onEditar={handleEditarCategoria}
                  onEliminar={handleEliminarCategoria}
                />
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
  );
}

// Componente para vista de tabla - ACTUALIZADO con las props
function VistaTabla({ productos, formatearPrecio, getColorStock, obtenerNombreCategoria, onEditar, onEliminar }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left p-4 font-semibold text-gray-700">Producto</th>
            <th className="text-left p-4 font-semibold text-gray-700">Descripción</th>
            <th className="text-left p-4 font-semibold text-gray-700">Categoría</th>
            <th className="text-left p-4 font-semibold text-gray-700">Precio</th>
            <th className="text-left p-4 font-semibold text-gray-700">Stock</th>
            <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Inventory2 className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{producto.nombre}</div>
                    <div className="text-sm text-gray-500">{producto.codigo_barras}</div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="max-w-xs">
                  <p className="text-gray-700 line-clamp-2">{producto.descripcion}</p>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm">
                  <Category className="w-4 h-4" />
                  {obtenerNombreCategoria(producto.categoria_id)}
                </span>
              </td>
              <td className="p-4">
                <div className="font-bold text-green-600">
                  {formatearPrecio(producto.precio)}
                </div>
              </td>
              <td className="p-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getColorStock(producto.stock)}`}>
                  {producto.stock} unidades
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEditar(producto)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onEliminar(producto.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Delete className="w-4 h-4" />
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

// Componente para vista de cards - ACTUALIZADO con las props
function VistaCards({ productos, formatearPrecio, getColorStock, obtenerNombreCategoria, onEditar, onEliminar }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <div key={producto.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Inventory2 className="text-blue-600" />
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColorStock(producto.stock)}`}>
                {producto.stock} unidades
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{producto.nombre}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{producto.descripcion}</p>

              <div className="flex items-center gap-2 mb-2">
                <Category className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700">
                  {obtenerNombreCategoria(producto.categoria_id)}</span>
              </div>

              <div className="flex items-center gap-2">
                <LocalOffer className="w-4 h-4 text-green-500" />
                <span className="font-bold text-green-600 text-lg">
                  {formatearPrecio(producto.precio)}
                </span>
              </div>
            </div>

            {producto.codigo_barras && (
              <div className="mb-4">
                <span className="text-xs text-gray-500">Código: {producto.codigo_barras}</span>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <button 
                onClick={() => onEditar(producto)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Editar
              </button>
              <button 
                onClick={() => onEliminar(producto.id)}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
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

// Componente para vista de categorías
function VistaCategorias({ categorias, onEditar, onEliminar }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categorias.map((categoria) => (
        <div key={categoria.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Category className="text-green-600" />
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                categoria.activo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
              
              </span> 
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{categoria.nombre || 'Sin nombre'}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {categoria.descripcion || 'Sin descripción'}
              </p>
            </div>

            <div className="mb-4">
              <span className="text-xs text-gray-500">ID: {categoria.id}</span>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => onEditar(categoria)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => onEliminar(categoria.id)}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
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