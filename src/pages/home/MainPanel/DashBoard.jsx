import { motion } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";
import SellIcon from "@mui/icons-material/Sell";
import SchoolIcon from "@mui/icons-material/School";
import Sidebar from "../../../components/utils/Sidebar";
import Card from "../../../components/utils/Card";
import { useUser } from "../../../context/UserContext";
import { searchProductos, updateProducto, deleteProducto } from "../../../apis/productos.api";
import { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import ModalProductos from "../../../components/utils/ProductosModal";
import { useProductos } from "../../../context/ProductosContext";
import { useCategorias } from "../../../context/CategoriasContext";
import { useNavigate } from "react-router-dom";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const loadingVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

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
    if (stock === 0) return 'bg-red-100 text-red-800 border-red-200';
    if (stock < 10) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
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

  // Datos de ejemplo para las secciones
  const actividadesRecientes = [
    { 
      accion: "Venta realizada - 3 libretas", 
      tipo: "venta",
      detalle: "5 libretas - C$200",
      tiempo: "Hace 2 horas",
      icon: <SellIcon />,
      color: "green"
    },
    { 
      accion: "Stock actualizado", 
      tipo: "inventario",
      detalle: "Lápices - 50 unidades agregadas",
      tiempo: "Hace 5 horas",
      icon: <InventoryIcon />,
      color: "blue"
    },
    { 
      accion: "Nuevo producto", 
      tipo: "producto",
      detalle: "Diccionarios de inglés añadidos",
      tiempo: "Hace 1 día",
      icon: <SchoolIcon />,
      color: "yellow"
    }
  ];

  const productosPopulares = [
    { 
      nombre: "Cuadernos profesionales", 
      vendidos: 45,
      tendencia: "up",
      porcentaje: "+12%",
      icon: <LocalLibraryIcon />,
      color: "blue"
    },
    { 
      nombre: "Lápices HB", 
      vendidos: 38,
      tendencia: "up", 
      porcentaje: "+8%",
      icon: <InventoryIcon />,
      color: "green"
    },
    { 
      nombre: "Calculadoras científicas", 
      vendidos: 22,
      tendencia: "down",
      porcentaje: "-3%",
      icon: <ReceiptLongIcon />,
      color: "yellow"
    }
  ];

  return (
    <motion.div 
      className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 to-green-50 font-poppins"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {cargando && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-[2px]"
          variants={loadingVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CircularProgress size={60} color="primary" />
        </motion.div>
      )}
      
      {/* Sidebar con z-index alto */}
      <motion.div 
        className="relative z-30"
        variants={itemVariants}
      >
        <Sidebar />
      </motion.div>
      
      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-auto relative ml-73">
        {/* Header que se extiende detrás del sidebar */}
        <div className="relative">
          <motion.header 
            className="bg-gradient-to-r pb-20 from-blue-500 to-green-500 px-8 py-6 shadow-md relative z-0 -ml-20 pl-40"
            variants={headerVariants}
          >
            <div className="flex justify-between items-center mt-5">
              <div>
                <motion.h1 
                  className="text-3xl font-poppinsBold text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Dashboard General
                </motion.h1>
                <motion.p 
                  className="text-blue-100 mt-2 font-poppins"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Resumen completo de tu librería escolar
                </motion.p>
              </div>
            </div>
          </motion.header>
        </div>

        {/* Contenido principal con fondo que cubre el header extendido */}
        <motion.main 
          className="flex-1 p-8 ml-5 overflow-auto -mt-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-tl-4xl shadow-inner relative z-10"
          variants={containerVariants}
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
          >
            <motion.div variants={cardVariants} whileHover="hover">
              <Card
                color="green"
                cantidad={productos.length}
                texto="Total de Productos"
                icon={<LocalLibraryIcon className="text-white" />}
                trend="up"
                trendValue="12%"
                onClick={() => {navi('/inventario')}}
              />
            </motion.div>
            <motion.div variants={cardVariants} whileHover="hover">
              <Card
                color="blue"
                cantidad={42}
                texto="Ventas del día"
                icon={<SellIcon className="text-white" />}
                trend="up"
                trendValue="5%"
              />
            </motion.div>
            <motion.div variants={cardVariants} whileHover="hover">
              <Card
                color="yellow"
                cantidad={stockBajo}
                texto="Stock Bajo"
                icon={<WarningIcon className="text-white" />}
                trend="down"
                trendValue="8%"
                onClick={() => handleAbrirModal("stockBajo")}
              />
            </motion.div>
            <motion.div variants={cardVariants} whileHover="hover">
              <Card
                color="red"
                cantidad={sinStock}
                texto="Sin Stock"
                icon={<NotificationsActiveIcon className="text-white" />}
                trend="up"
                trendValue="2%"
                onClick={() => handleAbrirModal("sinStock")}
              />
            </motion.div>
          </motion.div>

          {/* Sección de alertas - Tema Amarillo */}
          <motion.div 
            className="bg-white rounded-2xl p-6 mb-8 shadow-md border border-yellow-200"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-poppinsBold text-yellow-800">
                  Alertas de Inventario
                </h2>
                <p className="text-yellow-600 mt-1 font-poppins">
                  Productos que requieren atención
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button 
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-poppinsBold rounded-xl flex items-center shadow-sm hover:shadow-md"
                  onClick={handleActualizarDashboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshIcon className="mr-2 text-sm" />
                  Actualizar Dashboard
                </motion.button>
                <motion.button 
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 text-white font-poppinsBold rounded-xl flex items-center shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <WarningIcon className="mr-2 text-sm" />
                  Ver Todas las Alertas
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400"
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                    <InventoryIcon />
                  </div>
                  <div>
                    <h3 className="font-poppinsBold text-yellow-800">
                      Matemáticas 5° Grado
                    </h3>
                    <p className="text-yellow-600 text-sm mt-1 font-poppins">Quedan 3 unidades</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-red-50 rounded-xl p-4 border-l-4 border-red-400"
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                    <NotificationsActiveIcon />
                  </div>
                  <div>
                    <h3 className="font-poppinsBold text-red-800">
                      Cuadernos Cuadriculados
                    </h3>
                    <p className="text-red-600 text-sm mt-1 font-poppins">Agotados</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sección de actividad reciente - Tema Verde */}
            <motion.div 
              className="bg-white rounded-2xl shadow-sm border border-green-200 p-6"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-poppinsBold text-green-800">
                  Actividad Reciente
                </h2>
                <button className="text-green-600 hover:text-green-800 text-sm font-poppinsBold">
                  Ver todo
                </button>
              </div>
              <div className="space-y-4">
                {actividadesRecientes.map((actividad, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 ${
                      actividad.color === 'green' ? 'bg-green-500' : 
                      actividad.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}>
                      {actividad.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-poppinsBold text-gray-900">{actividad.accion}</p>
                      <p className="text-gray-600 text-sm font-poppins">
                        {actividad.detalle}
                      </p>
                    </div>
                    <span className="text-gray-500 text-sm font-poppins">
                      {actividad.tiempo}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sección de productos populares - Tema Azul */}
            <motion.div 
              className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-poppinsBold text-blue-800 mb-6">
                Productos Populares
              </h2>
              <div className="space-y-4">
                {productosPopulares.map((producto, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white mr-3 ${
                        producto.color === 'green' ? 'bg-green-500' : 
                        producto.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}>
                        {producto.icon}
                      </div>
                      <div>
                        <p className="font-poppinsBold text-gray-900">{producto.nombre}</p>
                        <p className="text-gray-600 text-sm font-poppins">{producto.vendidos} vendidos</p>
                      </div>
                    </div>
                    <div className={`flex items-center ${
                      producto.tendencia === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {producto.tendencia === "up" ? <TrendingUpIcon className="mr-1" /> : <TrendingDownIcon className="mr-1" />}
                      <span className="text-sm font-poppinsBold">{producto.porcentaje}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.main>
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
    </motion.div>
  );
}