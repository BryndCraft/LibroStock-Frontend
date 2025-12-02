import { AnimatedContainer } from "../../../../animations/animations";
import { AnimatePresence } from "framer-motion";
import { Category, Add } from "@mui/icons-material";
import { useState } from "react";
import ComprasForm from "../forms/ComprasCabecera";
import ModalCompra from "./ModalCompra";
import { VistaComprasTabla } from "./VistaComprasTabla";

export default function VistaCompras() {
  const [abrirFormulario, setAbrirFormulario] = useState(false);

  return (
    <AnimatedContainer className="h-screen w-full ml-75 bg-gray-50 overflow-hidden flex flex-col">

      {/* Header */}
      <div className="w-full h-40 p-12 bg-amber-500 sticky top-0 z-20">
        <div className="flex justify-between w-full">
          <div>
            <div className="font-bold text-white text-3xl">
              Gestión de Compras
            </div>
            <div className="font-light text-white text-2xl">
              Administra y organiza las Compras de la librería
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 flex items-center gap-3 font-semibold border border-purple-200/30 cursor-pointer"
              onClick={() => setAbrirFormulario(true)}
            >
              <Add />
              <span>Nueva Compra</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-5 pt-5 flex-1 overflow-hidden">
        <div className="bg-white rounded-3xl shadow-lg p-8 h-full overflow-hidden flex flex-col">

          <div className="flex justify-between items-center mb-8">
            <h1 className="font-bold text-3xl text-gray-800">Compras Realizadas</h1>
          </div>

          {/* Tabla */}
          <div className="flex-1 border border-gray-200 rounded-2xl overflow-auto">
            <VistaComprasTabla />
          </div>

        </div>
      </div>

      <AnimatePresence>
        {abrirFormulario && (
          <div className="fixed inset-0 w-full bg-black/70 z-50">
            <ModalCompra setAbrirFormulario={setAbrirFormulario} />
          </div>
        )}
      </AnimatePresence>
    </AnimatedContainer>
  );
}
