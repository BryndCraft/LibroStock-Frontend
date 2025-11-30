import { motion, AnimatePresence } from "framer-motion";
import {
  AnimatedContainer,
} from "../../../../animations/animations";
import { Category } from "@mui/icons-material";
import { useInventario } from "../hooks/useInventario";
import { CategoriaCard } from "./CategoriaCard";
import { CategoriaForm } from "../Forms/CategoriaForms";
import { useCategorias } from "../../../../context/CategoriasContext";
import { useState } from "react";


export default function VistaCategorias({ setVista }) {



  const [mostrarCategoriaForm, setMostrarCategoriaForm] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const handleEditarCategoria = (categoria) => {
    setCategoriaEditando(categoria);
    setMostrarCategoriaForm(true);
  };

  const handleCrearCategoria = () => {
    setCategoriaEditando(null);
    setMostrarCategoriaForm(true);
  }
 

  const{categorias} = useCategorias();
  return (
    <AnimatedContainer className="min-h-screen w-full ml-75">
      {/*Header*/}
      <div className="w-full h-40 p-12  bg-green-500">
        <div className="flex justify-between w-full">
          <div>
            <div className="font-bold text-white text-3xl">
              Gestión de Inventario - Categorias
            </div>
            <div className="font-light text-white text-2xl">
              Administra y organiza los productos de la librería
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-3 font-semibold border border-purple-200/30 cursor-pointer"
              onClick={() => setVista("productos")}
            >
              <Category className="text-lg" />
              <span>Ver Productos</span>
            </button>

            <button
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl hover:from-yellow-600 hover:to-yelloww-700 transition-all duration-300 flex items-center gap-3 font-semibold border border-yellow-200/30 cursor-pointer" onClick={handleCrearCategoria}
            >
              <Category className="text-lg" />
              <span>Añadir Nueva Categoria</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-tl-3xl ml-5 relative -my-5 bg-white p-10">
        <div className="font-bold text-3xl mb-4">
          Numero Categorias{" "}
          <span className="text-blue-400">{categorias.length}</span>
        </div>
        <div className="bg-white/50 border border-slate-200/40 rounded-2xl p-3 shadow-sm gap-3 mb-10 max-h-[50vh] overflow-y-auto">
          <CategoriaCard handleEditarCategoria={handleEditarCategoria}
          />
        </div>
      </div>

      {/*Modales*/}
      <AnimatePresence>
        {mostrarCategoriaForm && (
          <div className="fixed inset-0 w-full bg-black/70 z-60">
            <CategoriaForm
              categoria={categoriaEditando}
              setMostrarCategoriaForm={setMostrarCategoriaForm}
            />
          </div>
        )}
      </AnimatePresence>
    </AnimatedContainer>
  );
}
