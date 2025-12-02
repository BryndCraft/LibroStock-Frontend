import { useState } from "react";
import { useInventario } from "../Inventory/hooks/useInventario";
import { useFacturacion } from "./hooks/useFacturacion";

import Sidebar from "../../../components/utils/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "@mui/icons-material";
import { VistaResumenPago } from "./components/VistaResumenPago";
import {VistaTabla} from "../Inventory/components/VistaTabla"

export default function Facturacion() {
  const [busqueda, setBusqueda] = useState("");
  const { productos } = useInventario(); // traer todos los productos
  const { facturacionData, setFacturacionData } = useFacturacion();

  // Filtrar productos según búsqueda
  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.toLowerCase();
    const nombre = producto.nombre.toLowerCase();
    const codigo = producto.codigo_barras.toLowerCase();
    const categoria = producto.categoria_nombre?.toLowerCase() || "";

    return nombre.includes(texto) || codigo.includes(texto) || categoria.includes(texto);
  });

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-blue-50 font-poppins">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex-shrink-0"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-poppinsBold text-white mb-2 md:text-xl">
                Sistema de Facturación
              </h1>
              <p className="text-blue-100 text-lg font-poppins">
                Gestiona tus ventas de manera rápida y eficiente
              </p>
            </div>
          </div>
        </motion.header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 flex-shrink-0">
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

                <VistaTabla
                  vista_facturacion={true}
                  setFacturacionData={setFacturacionData}
                  facturacionData={facturacionData}
                  productosFiltrados={productosFiltrados}
                />
              </div>
            </div>
          </div>

          <VistaResumenPago
            facturacionData={facturacionData}
            setFacturacionData={setFacturacionData}
          />
        </div>
      </div>
    </div>
  );
}
