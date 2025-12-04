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
  Download,
} from "@mui/icons-material";
import CustomSelect from "../../../../components/utils/CustomSelect";
import { useInventario } from "../hooks/useInventario";
import { ProductoCard } from "./ProductoCard";
import { ProductoForm } from "../Forms/ProductoForms";
import { useState } from "react";
import { VistaTabla } from "./VistaTabla";
import { Switch, FormControlLabel } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useProductos } from "../../../../context/ProductosContext";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import { useCategorias } from "../../../../context/CategoriasContext";

export default function VistaProductos({ setVista }) {
  const [productosInactivos, setProductosInactivos] = useState(false);
  const {
    categorias,
    filtroCategoria,
    filtroStock,
    productosFiltrados,
    setFiltroCategoria,
    setFiltroStock,
    limpiarFiltros,
    setFiltroBusqueda,
  } = useInventario();

  const {cargarProductos} = useProductos();
  
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);
  
  const [modoVisualizacion, setModoVisualizacion] = useState("cards");
  const [mostrarProductoForm, setMostrarProductoForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const handleNuevoProducto = () => {
    setProductoEditando(null);
    setMostrarProductoForm(true);
  };

  const handleEditarProducto = (producto) => {
    setProductoEditando(producto);
    setMostrarProductoForm(true);
  };

  const handleBusquedaChange = (e) => {
    setFiltroBusqueda(e.target.value);
  };



  
  const productosFiltradosFinal = productosFiltrados.filter((p) =>
    productosInactivos ? !p.estado : p.estado
  );

  // Función para exportar productos a Excel
  const exportarProductos = () => {
    // Usamos productosFiltradosFinal que ya están filtrados según los filtros aplicados
    const datosExportar = productosFiltradosFinal.map(producto => ({
      'Nombre': producto.nombre || '',
      'Categoría': categorias.find(categoria => categoria.id === producto.categoria_id)?.nombre || 'Sin categoría',
      'Precio': producto.precio || 0,
      'Stock': producto.stock || 0,
      'Estado': producto.estado ? 'Activo' : 'Inactivo',
      'Descripción': producto.descripcion || '',
      'Fecha Creación': producto.create_date? new Date(producto.create_date).toLocaleDateString() : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    
    // Auto ajustar el ancho de las columnas
    const wscols = [
      { wch: 30 }, // Nombre
      { wch: 20 }, // Categoría
      { wch: 15 }, // Precio
      { wch: 10 }, // Stock
      { wch: 15 }, // Estado
      { wch: 40 }, // Descripción
      { wch: 20 }, // Fecha Creación
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `productos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <AnimatedContainer className="h-screen w-full md:ml-75 flex flex-col">
      {/* HEADER */}
      <div className="w-full h-28 md:h-30 md:p-12 p-6 bg-green-500 md:flex md:items-center">
        <div className="flex flex-col lg:text-sm md:flex-row md:justify-between w-full gap-5">
          <div>
            <div className="font-bold text-white  text-2xl md:text-xl">
              Gestión de Inventario
            </div>
            <div className="font-light text-white text-lg">
              Administra y organiza los productos de la librería
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="w-full sm:w-auto px-5 py-3 md:px-2 md:py-1 lg:px-2 lg:py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold border border-purple-200/30 cursor-pointer" onClick={()=> setVista('categorias')}>
              <Category className="text-lg md:text-sm lg:text-sm" />
              <span className="text-base md:text-sm lg:text-sm">
                Ver Categorias
              </span>
            </button>
            <button
              onClick={handleNuevoProducto}
              className="
    flex w-full sm:w-auto 
    px-5 py-3 
    md:px-2 md:py-1 
    lg:px-2 lg:py-1
    bg-gradient-to-r from-yellow-500 to-yellow-600 
    text-white rounded-2xl 
    hover:from-yellow-600 hover:to-yellow-700 
    transition-all duration-300 
    items-center justify-center gap-2 
    font-semibold border border-yellow-200/30 
    cursor-pointer
  "
            >
              <Add className="text-lg md:text-sm lg:text-sm" />
              <span className="text-base md:text-sm lg:text-sm">
                Añadir Producto
              </span>
            </button>
          </div>
           <AnimatedButton
            onClick={exportarProductos}
            className="w-full sm:w-auto whitespace-nowrap px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium cursor-pointer"
          >
            <AnimatedIcon>
              <Download className="text-lg" />
            </AnimatedIcon>
            Exportar Excel
          </AnimatedButton>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-auto rounded-tl-3xl md:ml-5 bg-white p-5 sm:p-8 md:p-10 flex flex-col">
        {/* BARRA FILTROS */}
        <div className="bg-white/50 border border-slate-200/40 rounded-2xl p-3 shadow-sm flex flex-col lg:flex-row items-center gap-4 mb-5">
          {/* BUSQUEDA */}
          <div className="bg-white/50 border border-slate-200/40 rounded-2xl px-3 py-2 shadow-sm flex items-center gap-3 w-full lg:w-[30%]">
            <Search className="text-slate-400" />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400"
              placeholder="Buscar por Nombre o Categoría"
              onChange={handleBusquedaChange}
            />
          </div>

          {/* SELECT CATEGORIA */}
          <div className="md:w-60">
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
              width="100%"
              onChange={setFiltroCategoria}
              required={false}
            />
          </div>

          {/* SELECT STOCK */}
          <div className="md:w-60 ">
            <CustomSelect
              label="Estado de stock"
              options={[
                { value: "", label: "Todos" },
                { value: "con-stock", label: "Con stock" },
                { value: "sin-stock", label: "Sin stock" },
                { value: "stock-bajo", label: "Stock bajo" },
              ]}
              value={filtroStock}
              onChange={setFiltroStock}
              width="100%"
              required={false}
            />
          </div>

          {/* QUITAR FILTROS */}
          <AnimatedButton
            onClick={limpiarFiltros}
            className="w-full sm:w-auto whitespace-nowrap px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium cursor-pointer"
          >
            <AnimatedIcon>
              <Clear className="text-lg" />
            </AnimatedIcon>
            Quitar Filtros
          </AnimatedButton>

          {/* BOTÓN EXPORTAR */}
         

          {/* VISTAS */}
          <div className="flex w-full sm:w-auto gap-3">
            <AnimatedButton
              onClick={() => setModoVisualizacion("tabla")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                modoVisualizacion === "tabla"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-500 shadow-lg"
                  : "bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300"
              }`}
            >
              <AnimatedIcon>
                <TableChart className="text-lg" />
              </AnimatedIcon>
              Tabla
            </AnimatedButton>

            <AnimatedButton
              onClick={() => setModoVisualizacion("cards")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                modoVisualizacion === "cards"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-500 shadow-lg"
                  : "bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300"
              }`}
            >
              <AnimatedIcon>
                <Dashboard className="text-lg" />
              </AnimatedIcon>
              Cards
            </AnimatedButton>
          </div>
        </div>

        {/* TITULO + SWITCH */}
        <div className="mb-5 flex flex-col sm:flex-row justify-between gap-4">
          <div className="font-bold text-2xl ">
            Número de Productos{" "}
            <span className="text-blue-400">
              {productosInactivos
                ? productosFiltrados.filter((p) => !p.estado).length
                : productosFiltrados.filter((p) => p.estado).length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">
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

        {/* LISTA */}
        <div className="flex-1 bg-white/50 border border-slate-200/40 rounded-2xl p-4 shadow-sm overflow-y-auto">
          {productosFiltradosFinal.length !== 0 ? (
            modoVisualizacion === "cards" ? (
              <ProductoCard
                mostrar_inactivos={productosInactivos}
                handleEditarProducto={handleEditarProducto}
                productosFiltrados={productosFiltradosFinal}
              />
            ) : (
              <VistaTabla
                mostrar_inactivos={productosInactivos}
                handleEditarProducto={handleEditarProducto}
                productosFiltrados={productosFiltradosFinal}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[200px] text-gray-500 font-medium">
              No hay productos Disponibles
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {mostrarProductoForm && (
          <div className="fixed inset-0 w-full bg-black/70 z-60">
            <ProductoForm
              setMostrarProductoForm={setMostrarProductoForm}
              productoEditando={productoEditando}
            />
          </div>
        )}
      </AnimatePresence>
    </AnimatedContainer>
  );
}