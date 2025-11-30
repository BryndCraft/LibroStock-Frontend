import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../../components/utils/Sidebar";
import {
  Search,
  Receipt,
  ClearAll,
  Person,
  AttachMoney,
  ShoppingCart,
} from "@mui/icons-material";
import { useState } from "react";
import { VistaTabla } from "../Inventory/components/VistaTabla";
import { VistaResumenPago } from "./components/VistaResumenPago";
import { useFacturacion } from "./hooks/useFacturacion";
import { useInventario } from "../Inventory/hooks/useInventario";

export default function Facturacion() {
  const [busqueda, setBusqueda] = useState("");
  const{productosFiltrados} = useInventario();
  const {facturacionData, setFacturacionData} = useFacturacion();

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-blue-50 font-poppins">
      <Sidebar />

      {/* CONTENEDOR PRINCIPAL CON ALTURA LIMITADA */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-hidden">
        {/* Header moderno */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex-shrink-0"
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
          </div>
        </motion.header>


        <div className="flex-1 flex overflow-hidden">
          {/* Panel principal */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Barra de búsqueda y categorías */}
            <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 flex-shrink-0">
              <div className="max-w-6xl mx-auto">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Buscar producto por nombre, código o categoría..."
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-poppins text-lg shadow-sm"
                    />
                  </div>
                </div>
                <VistaTabla vista_facturacion={true} setFacturacionData={setFacturacionData} facturacionData={facturacionData} productosFiltrados={productosFiltrados}/>
              </div>
            </div>

            {/* Grid de productos CON SCROLL PROPIO */}
            <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-y-auto">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {/* Aquí van tus productos */}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <VistaResumenPago  facturacionData={facturacionData} setFacturacionData={setFacturacionData} />
        </div>
      </div>
    </div>
  );
}