import { motion, AnimatePresence } from "framer-motion";
import {
  AnimatedContainer,
  AnimatedButton,
  AnimatedIcon,
} from "../../../../animations/animations";
import {
  Category,
  Search,
  Clear,
  Dashboard,
  TableChart,
} from "@mui/icons-material";
import CustomSelect from "../../../../components/utils/CustomSelect";
import { useInventario } from "../hooks/useInventario";
import { ProductoCard } from "./ProductoCard";
import { ProductoForm } from "../Forms/ProductoForms";
import { useState } from "react";
import { VistaTabla } from "./VistaTabla";
import { Switch, FormControlLabel } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function VistaProductos({ setVista }) {
  const [productosInactivos, setProductosInactivos] = useState(false);
  const {
    mostrarFormProducto,
    categorias,
    productoEditando,
    filtroCategoria,
    filtroStock,
    productosFiltrados,
    setFiltroCategoria,
    setFiltroStock,
    handleGuardarProducto,
    handleEditarProducto,
    abrirFormProducto,
    cerrarFormProducto,
    limpiarFiltros,
  } = useInventario();

  const [modoVisualizacion, setModoVisualizacion] = useState("cards");

  return (
    <AnimatedContainer className="min-h-screen w-full ml-75">
      {/*Header*/}
      <div className="w-full h-40 p-12  bg-green-500">
        <div className="flex justify-between w-full">
          <div>
            <div className="font-bold text-white text-3xl">
              Gestión de Inventario
            </div>
            <div className="font-light text-white text-2xl">
              Administra y organiza los productos de la librería
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-3 font-semibold border border-purple-200/30 cursor-pointer"
              onClick={() => setVista("categorias")}
            >
              <Category className="text-lg" />
              <span>Ver Categorias</span>
            </button>

            <button
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl hover:from-yellow-600 hover:to-yelloww-700 transition-all duration-300 flex items-center gap-3 font-semibold border border-yellow-200/30 cursor-pointer"
              onClick={abrirFormProducto}
            >
              <Add className="text-lg" />
              <span>Añadir Producto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Busqueda y de Categorias */}
      <div className="rounded-tl-3xl ml-5 relative -my-5 bg-white p-10">
        <div className="bg-white/50 border h-30 border-slate-200/40 rounded-2xl p-3 shadow-sm flex items-center gap-3 mb-10">
          <div className="bg-white/50 border  border-slate-200/40 rounded-2xl p-3 shadow-sm flex items-center gap-3 w-[30%]">
            <Search className="text-slate-400" />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400"
              placeholder="Realizar una Búsqueda por Nombre o Categoria"
            />
          </div>
          {/*Filtro de Estado de Categoria*/}

          <CustomSelect
            label="Categorías"
            options={[
              { value: "", label: "Todas las categorías" },
              ...categorias.map((cat) => ({
                value: cat.id.toString(),
                label: cat.nombre,
              })),
            ]}
            value={filtroCategoria}
            width={200}
            onChange={setFiltroCategoria}
            required={false}
          />
          {/*Filtro de Estado de Stock*/}
          <CustomSelect
            label="Estado de stock"
            options={[
              { value: "con-stock", label: "Con stock" },
              { value: "sin-stock", label: "Sin stock" },
              { value: "stock-bajo", label: "Stock bajo" },
            ]}
            value={filtroStock}
            onChange={setFiltroStock}
            margin={0}
            width={200}
            required={false}
          />
          {/*Boton para quitar los filtros*/}
          <AnimatedButton
            onClick={limpiarFiltros}
            className="whitespace-nowrap px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium cursor-pointer"
          >
            <AnimatedIcon>
              <Clear className="text-lg" />
            </AnimatedIcon>
            Quitar Filtros
          </AnimatedButton>

          {/* Botón Tabla */}
          <div className="flex gap-3">
            <AnimatedButton
              onClick={() => setModoVisualizacion("tabla")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                modoVisualizacion === "tabla"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-500 shadow-lg"
                  : "bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300 backdrop-blur-sm"
              }`}
            >
              <AnimatedIcon>
                <TableChart className="text-lg" />
              </AnimatedIcon>
              Tabla
            </AnimatedButton>

            {/* Botón Cards */}
            <AnimatedButton
              onClick={() => setModoVisualizacion("cards")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                modoVisualizacion === "cards"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-500 shadow-lg"
                  : "bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300 backdrop-blur-sm"
              }`}
            >
              <AnimatedIcon>
                <Dashboard className="text-lg" />
              </AnimatedIcon>
              Cards
            </AnimatedButton>
          </div>
        </div>

        <div className=" mb-5 flex justify-between">
          <div className="font-bold text-3xl">
            Número de Productos{" "}
            <span className="text-blue-400">
              {
                productosInactivos
                  ? productosFiltrados.filter((p) => !p.activo).length // solo inactivos
                  : productosFiltrados.filter((p) => p.activo).length // solo activos
              }
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl">
              Ver Solo Productos Inactivos
            </span>
            <FormControlLabel
              control={
                <Switch
                  checked={productosInactivos}
                  onChange={(e) => setProductosInactivos(e.target.checked)}
                  color="primary"
                />
              }
            />
          </div>
        </div>

        {/*Visualizar en Cards o Table*/}
        <div className="flex-1 bg-white/50 border border-slate-200/40 rounded-2xl p-5 shadow-sm overflow-hidden">
          <div className="max-h-[50vh] overflow-y-auto">
            {modoVisualizacion === "cards" ? (
              <ProductoCard mostrar_inactivos={productosInactivos} onEditar={handleEditarProducto} />
            ) : (
              <VistaTabla mostrar_inactivos={productosInactivos} />
            )}
          </div>
        </div>
      </div>

      {/*Modales*/}
      <AnimatePresence>
        {mostrarFormProducto && (
          <div className="fixed inset-0 w-full bg-black/70 z-60">
            <ProductoForm
              producto={productoEditando}
              onSave={handleGuardarProducto}
              onCancel={cerrarFormProducto}
            />
          </div>
        )}
      </AnimatePresence>
    </AnimatedContainer>
  );
}
