import { AnimatedContainer } from "../../../../animations/animations";
import { AnimatePresence } from "framer-motion";
import { Category, Add } from "@mui/icons-material";
import { useState } from "react";
import ComprasForm from "../forms/ComprasForm";
export default function VistaCompras() {
  const [mostrarFormCompras, setMostrarFormCompras] = useState(false);

  return (
    <AnimatedContainer className="min-h-screen w-full ml-75">
      {/*Header*/}
      <div className="w-full h-40 p-12 bg-amber-500">
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
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 flex items-center gap-3 font-semibold border border-purple-200/30 cursor-pointer" onClick={() => setMostrarFormCompras(true)}>
              <Add/>
              <span>Nueva Compra</span>
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-tl-3xl ml-5 relative -my-5 bg-white p-10">
        <div className="font-bold text-3xl mb-4">
          Numero de Compras{" "}
          <span className="text-blue-400">0</span>
        </div>
        <div className="bg-white/50 border border-slate-200/40 rounded-2xl p-3 shadow-sm gap-3 mb-10 max-h-[50vh] overflow-y-auto">
          
        </div>
      </div>

      <AnimatePresence>
        {mostrarFormCompras && (
          <div className="fixed inset-0 w-full bg-black/70 z-60">
            <ComprasForm/>
          </div>
        )}
      </AnimatePresence>
    </AnimatedContainer>
  );
}
