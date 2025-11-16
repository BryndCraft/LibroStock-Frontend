import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Sidebar from "../../components/utils/Sidebar";
import Card from "../../components/utils/Card";
import { useUser } from "../../context/UserContext";
import { searchProductos, updateProducto, deleteProducto } from "../../apis/productos.api";
import { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import ModalProductos from "../../components/utils/ProductosModal";
import { useProductos } from "../../context/ProductosContext";
import { useCategorias } from "../../context/CategoriasContext";
import { useNavigate } from "react-router-dom";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export default function DashBoard() {
  const { user } = useUser();
  const { productos, cargarProductos, editarProducto, eliminarProducto } = useProductos();
  const { categorias, cargarCategorias, editarCategoria, eliminarCategoria } = useCategorias();
  const [cargando, setCargando] = useState(true);
  const [stockBajo, setStockBajo] = useState(0);
  const [sinStock, setSinStock] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productosModal, setProductosModal] = useState([]);
  const [tituloModal, setTituloModal] = useState("");
  const navi = useNavigate();
  const obtenerNombreCategoria = (categoriaId) => {
    if (!categoriaId) return 'Sin categoría';
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  const cargarDatosIniciales = async () => {
    try {
      setCargando(true);
      await Promise.all([
        cargarProductos(),
        cargarCategorias(),
        minusStock(productos), 
        zeroStock(productos),
      ]);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      await sleep(1300);
      setCargando(false);
    }
  };
  const formatearPrecio = (precio) => {
    return `C$ ${parseFloat(precio).toFixed(2)}`;
  };

  const handleAbrirModal = (tipo) => {
    if (tipo === 'stockBajo') {
      setProductosModal(productos.filter(p => p.stock > 0 && p.stock <= 5));
      setTituloModal("Productos con Stock Bajo");
      setTituloModal("Productos con Stock Bajo");
    } else if (tipo === 'sinStock') {
      setProductosModal(productos.filter(p => p.stock === 0));
      setTituloModal("Productos Sin Stock");
    }
    setModalAbierto(true);
  }
  const handleCerrarModal = () => {
    setModalAbierto(false);
  }
  const getColorStock = (stock) => {
    if (stock === 0) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (stock < 10) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const minusStock = (productos) => {
    const num = productos.filter(p => p.stock > 0 && p.stock <= 5).length;
    setStockBajo(num);
  }
  const zeroStock = (productos) => {
    const num = productos.filter(p => p.stock === 0 || p.stock <= 0).length;
    setSinStock(num);
  }
  const handleActualizarDashboard = async () => {
    await cargarDatosIniciales();
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100">
      {cargando && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-[2px]">
          <CircularProgress size={60} color="primary" />
        </div>
      )}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm px-8 py-6 border-b border-gray-200/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard General
              </h1>
              <p className="text-gray-600 mt-1">Resumen de la librería escolar</p>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </header>

        {/* Estadísticas */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
              color="green"
              cantidad={productos.length}
              texto="Total de Productos"
              icon={<LocalLibraryIcon className="text-white" />}
              trend="up"
              trendValue="12%"
              onClick={() => {navi('/inventario')}}
            />
            <Card
              color="blue"
              cantidad={42}
              texto="Ventas del día"
              icon={<ReceiptLongIcon className="text-white" />}
              trend="up"
              trendValue="5%"
            />
            <Card
              color="amber"
              cantidad={stockBajo}
              texto="Stock Bajo"
              icon={<InventoryIcon className="text-white" />}
              trend="down"
              trendValue="8%"
              onClick={() => handleAbrirModal("stockBajo")}
            />
            <Card
              color="red"
              cantidad={sinStock}
              texto="Sin Stock"
              icon={<NotificationsActiveIcon className="text-white" />}
              trend="up"
              trendValue="2%"
              onClick={() => handleAbrirModal("sinStock")}
            />
          </div>

          {/* Sección de alertas */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-gray-200/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Alertas de Inventario
                </h2>
                <p className="text-gray-600 mt-1">
                  Productos que requieren atención
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-white font-medium rounded-xl flex items-center shadow-sm hover:shadow-md"
                  onClick={handleActualizarDashboard}>
                  <DashboardIcon className="mr-2 text-sm" />
                  Actualizar Dashboard
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-300 text-white font-medium rounded-xl flex items-center shadow-sm hover:shadow-md">
                  <NotificationsActiveIcon className="mr-2 text-sm" />
                  Ver Todas las Alertas
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 border-l-4 border-amber-400">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 mr-3">
                    <InventoryIcon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800">
                      Matemáticas 5° Grado
                    </h3>
                    <p className="text-amber-700 text-sm mt-1">Quedan 3 unidades</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-red-400">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700 mr-3">
                    <NotificationsActiveIcon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Cuadernos Cuadriculados
                    </h3>
                    <p className="text-red-700 text-sm mt-1">Agotados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sección de actividad reciente */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Actividad Reciente
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver todo
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <ReceiptLongIcon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Venta realizada</p>
                    <p className="text-gray-600 text-sm">
                      5 libretas - C$200
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">Hace 2 horas</span>
                </div>

                <div className="flex items-center p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <InventoryIcon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Stock actualizado</p>
                    <p className="text-gray-600 text-sm">
                      Lápices - 50 unidades agregadas
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">Hace 5 horas</span>
                </div>

                <div className="flex items-center p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <LocalLibraryIcon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Nuevo producto</p>
                    <p className="text-gray-600 text-sm">
                      Diccionarios de inglés añadidos
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">Hace 1 día</span>
                </div>
              </div>
            </div>

            {/* Sección de productos populares */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Productos Populares
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <LocalLibraryIcon />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Cuadernos profesionales</p>
                      <p className="text-gray-600 text-sm">45 vendidos</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUpIcon className="mr-1" />
                    <span className="text-sm font-medium">+12%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                      <InventoryIcon />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Lápices HB</p>
                      <p className="text-gray-600 text-sm">38 vendidos</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUpIcon className="mr-1" />
                    <span className="text-sm font-medium">+8%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <ReceiptLongIcon />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Calculadoras científicas</p>
                      <p className="text-gray-600 text-sm">22 vendidos</p>
                    </div>
                  </div>
                  <div className="flex items-center text-red-600">
                    <TrendingDownIcon className="mr-1" />
                    <span className="text-sm font-medium">-3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {modalAbierto && (
        <ModalProductos
          productos={productosModal}
          isOpen={modalAbierto}
          onClose={handleCerrarModal}
          onEliminar={eliminarProducto}
          onEditar={editarProducto}
          formatearPrecio={formatearPrecio}
          getColorStock={getColorStock}
          obtenerNombreCategoria={obtenerNombreCategoria}
          titulo={tituloModal}
        />
      )}
    </div>
  );
}