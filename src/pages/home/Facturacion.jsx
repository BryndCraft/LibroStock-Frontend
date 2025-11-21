import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/utils/Sidebar";
import {
  Search,
  Add,
  Remove,
  Delete,
  Receipt,
  Save,
  ClearAll,
  QrCodeScanner,
  Person,
  AttachMoney,
  ShoppingCart,
  Category,
  LocalOffer,
  TrendingUp,
  School,
  Book,
  Create,
  Calculate,
  Palette,
} from "@mui/icons-material";
import { useState } from "react";

export default function Facturacion() {
  const [efectivoRecibido, setEfectivoRecibido] = useState(600);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [busqueda, setBusqueda] = useState("");



  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-blue-50 font-poppins">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-auto ml-80">
        {/* Header moderno */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-poppinsBold text-white mb-2">
                Sistema de Facturación
              </h1>
              <p className="text-blue-100 text-lg font-poppins">
                Gestiona tus ventas de manera rápida y eficiente
              </p>
            </div>

            {/* Información del cliente */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
            >
              <h3 className="font-poppinsBold text-white mb-3 text-sm flex items-center gap-2">
                <Person className="text-white text-lg" />
                Información del Cliente
              </h3>
              <input
                type="text"
                placeholder="Nombre del estudiante o acudiente"
                className="w-80 px-4 py-3 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white bg-white/10 text-white placeholder-white/70 font-poppins"
              />
            </motion.div>
          </div>
        </motion.header>

        <div className="flex-1 flex overflow-hidden">
          {/* Panel principal */}
          <div className="flex-1 flex flex-col">
            {/* Barra de búsqueda y categorías */}
            <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
              <div className="max-w-6xl mx-auto">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar producto por nombre, código o categoría..."
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-poppins text-lg shadow-sm"
                    />
                  </div>
                </div>

                {/* Categorías */}
              </div>
            </div>

            {/* Grid de productos */}
            <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-auto">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence></AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral de pago - Más grande y destacado */}
          <div className="w-120 bg-gradient-to-b from-white to-blue-50 border-l border-gray-200/50 shadow-2xl flex flex-col">
            <div className="p-8 space-y-8 flex-1 overflow-y-auto">
              {/* Header del carrito */}
              <div className="flex items-center justify-between">
                <h3 className="font-poppinsBold text-gray-900 text-2xl flex items-center gap-3">
                  <ShoppingCart className="text-blue-600 text-2xl" />
                  Carrito de Venta
                </h3>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-poppinsBold text-sm">
                  productos
                </span>
              </div>

              {/* Lista de productos en carrito */}
              <div className="space-y-4 max-h-96 overflow-y-auto"></div>

              {/* Resumen de pago expandido */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
                <h3 className="font-poppinsBold text-gray-900 text-xl flex items-center gap-3 mb-6">
                  <AttachMoney className="text-green-600 text-2xl" />
                  Resumen de Pago
                </h3>

                <div className="space-y-6">
                  {/* Método de pago */}
                  <div>
                    <label className="block text-sm font-poppinsBold text-gray-700 mb-3">
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="px-4 py-3 bg-blue-500 text-white rounded-xl font-poppinsBold shadow-md">
                        Efectivo
                      </button>
                      <button className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-poppinsBold hover:bg-gray-200 transition-colors">
                        Tarjeta
                      </button>
                    </div>
                  </div>

                  {/* Efectivo recibido */}
                  <div>
                    <label className="block text-sm font-poppinsBold text-gray-700 mb-3">
                      Efectivo Recibido (C$)
                    </label>
                    <input
                      type="number"
                      value={efectivoRecibido}
                      onChange={(e) =>
                        setEfectivoRecibido(Number(e.target.value))
                      }
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-poppins text-lg text-center font-poppinsBold"
                    />
                  </div>

                  {/* Desglose de montos */}
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <div className="flex justify-between text-gray-600 font-poppins text-lg">
                      <span>Subtotal:</span>
                  
                    </div>

                    <div className="flex justify-between text-gray-600 font-poppins text-lg">
                      <span>Impuestos (15%):</span>
                    </div>

                    <div className="flex justify-between text-gray-600 font-poppins text-lg">
                      <span>Descuento:</span>
                      <span className="text-green-600">-C$0.00</span>
                    </div>

                    <div className="flex justify-between text-gray-600 font-poppins text-lg border-t border-gray-200 pt-3">
                      <span>Efectivo:</span>
                      <span>C${efectivoRecibido}</span>
                    </div>

                    <div className="flex justify-between text-green-600 font-poppinsBold text-xl border-t border-gray-200 pt-4">
                      <span>Cambio:</span>
                    </div>

                    <div className="flex justify-between font-poppinsBold text-2xl border-t border-gray-200 pt-4">
                      <span>Total a Pagar:</span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 flex items-center justify-center gap-3 font-poppinsBold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  >
                    <ClearAll />
                    Limpiar Carrito
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 flex items-center justify-center gap-3 text-xl font-poppinsBold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Receipt className="text-2xl" />
                    Finalizar Venta
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
