import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../../components/utils/Sidebar";
import { CategoriaForm } from "../../../components/Forms/CategoriaForms";
import { VistaCards } from "./components/VistaCards";
import { VistaTabla } from "./components/VistaTabla";
import { VistaCategorias } from "./components/VistaCategorias";
import { ProductoForm } from "../../../components/Forms/ProductoForms";
import {
  Search,
  Add,
  Category,
  Inventory2,
  TableChart,
  Dashboard,
  Clear,
  FilterList,
} from "@mui/icons-material";
import CustomSelect from "../../../components/utils/CustomSelect";
import { useInventario } from "../inventario/hooks/useInventario";
import {
  headerVariants,
  filterVariants,
  formItemVariants,
  AnimatedButton,
  AnimatedCard,
  AnimatedIcon,
  AnimatedContainer
} from "../../../../src/animations/animations";

export default function Inventario() {
  const {
    // Estados
    mostrarFormProducto,
    mostrarFormCategoria,
    productos,
    vista,
    vistaActual,
    cargando,
    categorias,
    productoEditando,
    categoriaEditando,
    filtroBusqueda,
    filtroCategoria,
    filtroStock,
    productosFiltrados,

    // Setters
    setVista,
    setVistaActual,
    setFiltroBusqueda,
    setFiltroCategoria,
    setFiltroStock,

    // Handlers
    handleEditarProducto,
    handleEliminarProducto,
    handleActivarProducto,
    handleSaveProducto,
    handleEditarCategoria,
    handleEliminarCategoria,
    handleSaveCategoria,
    abrirFormProducto,
    abrirFormCategoria,
    cerrarFormProducto,
    cerrarFormCategoria,
    toggleVistaActual,
    limpiarFiltros,

    // Utilidades
    obtenerNombreCategoria,
    formatearPrecio,
    getColorStock,
  } = useInventario();

  return (
    <AnimatedContainer className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      {/* Sidebar */}
      <div className="relative z-30">
        <Sidebar />
      </div>

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-auto relative ml-73">
        {/* Header extendido detrás del sidebar */}
        <div className="relative">
          <motion.header 
            className="bg-gradient-to-r pb-20 from-green-500 to-emerald-600 px-8 py-6 shadow-md -ml-20 pl-40"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-5">
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {vistaActual === "productos"
                    ? "Gestión de Inventario"
                    : "Gestión de Categorías"}
                </motion.h1>
                <motion.p 
                  className="text-green-100 mt-2 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {vistaActual === "productos"
                    ? "Administra y organiza los productos de la librería"
                    : "Gestiona las categorías de productos"}
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AnimatedButton
                  onClick={toggleVistaActual}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 font-semibold border border-purple-200/30"
                >
                  <AnimatedIcon>
                    {vistaActual === "productos" ? (
                      <Category className="text-lg" />
                    ) : (
                      <Inventory2 className="text-lg" />
                    )}
                  </AnimatedIcon>
                  {vistaActual === "productos" ? "Ver Categorías" : "Ver Productos"}
                </AnimatedButton>

                <AnimatePresence>
                  {vistaActual === "categorias" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AnimatedButton
                        onClick={abrirFormCategoria}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 font-semibold border border-emerald-200/30"
                      >
                        <AnimatedIcon>
                          <Add className="text-lg" />
                        </AnimatedIcon>
                        Nueva Categoría
                      </AnimatedButton>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {vistaActual === "productos" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AnimatedButton
                        onClick={abrirFormProducto}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 font-semibold border border-blue-200/30"
                      >
                        <AnimatedIcon>
                          <Add className="text-lg" />
                        </AnimatedIcon>
                        Nuevo Producto
                      </AnimatedButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.header>
        </div>

        {/* Contenido principal superpuesto */}
        <main className="flex-1 p-8 ml-5 overflow-auto -mt-6 bg-gradient-to-br bg-white rounded-tl-4xl relative z-10">
          {/* Filtros - solo mostrar para productos */}
          <AnimatePresence>
            {vistaActual === "productos" && (
              <motion.div
                className="bg-white/50 backdrop-blur-lg border border-slate-200/40 rounded-2xl p-6 mb-6 shadow-sm"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={filterVariants}
              >
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Barra de búsqueda */}
                    <motion.div 
                      className="md:col-span-4 relative"
                      variants={formItemVariants}
                      custom={0}
                    >
                      <AnimatedIcon>
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      </AnimatedIcon>
                      <motion.input
                        type="text"
                        value={filtroBusqueda}
                        onChange={(e) => setFiltroBusqueda(e.target.value)}
                        placeholder="Buscar productos, código o categoría..."
                        className="w-full pl-12 pr-4 py-3 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white/70 backdrop-blur-sm transition-all duration-200"
                        whileFocus={{ 
                          scale: 1.02,
                          boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                        }}
                      />
                    </motion.div>

                    <motion.div 
                      className="md:col-span-2"
                      variants={formItemVariants}
                      custom={1}
                    >
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
                        onChange={setFiltroCategoria}
                        width="100%"
                        margin={0}
                        required={false}
                      />
                    </motion.div>

                    <motion.div 
                      className="md:col-span-2"
                      variants={formItemVariants}
                      custom={2}
                    >
                      <CustomSelect
                        label="Estado de stock"
                        options={[
                          { value: "", label: "Estado de stock" },
                          { value: "con-stock", label: "Con stock" },
                          { value: "sin-stock", label: "Sin stock" },
                          { value: "stock-bajo", label: "Stock bajo" },
                        ]}
                        value={filtroStock}
                        onChange={setFiltroStock}
                        width="100%"
                        margin={0}
                        required={false}
                      />
                    </motion.div>

                    {/* Botones de vista */}
                    <motion.div 
                      className="md:col-span-3"
                      variants={formItemVariants}
                      custom={3}
                    >
                      <div className="flex gap-3">
                        {/* Botón Tabla */}
                        <AnimatedButton
                          onClick={() => setVista("tabla")}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all ${
                            vista === "tabla"
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
                          onClick={() => setVista("cards")}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all ${
                            vista === "cards"
                              ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-500 shadow-lg"
                              : "bg-white/70 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300 backdrop-blur-sm"
                          }`}
                        >
                          <AnimatedIcon>
                            <Dashboard className="text-lg" />
                          </AnimatedIcon>
                          Cards
                        </AnimatedButton>

                        {/* Botón Quitar Filtros */}
                        <AnimatedButton
                          onClick={limpiarFiltros}
                          className="flex-[1.3] whitespace-nowrap px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium cursor-pointer"
                        >
                          <AnimatedIcon>
                            <Clear className="text-lg" />
                          </AnimatedIcon>
                          Quitar Filtros
                        </AnimatedButton>
                      </div>
                    </motion.div>

                    {/* Filtros activos */}
                    <AnimatePresence>
                      {(filtroBusqueda || filtroCategoria || filtroStock) && (
                        <motion.div 
                          className="md:col-span-12 flex flex-wrap gap-2 mt-2"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={filterVariants}
                        >
                          {filtroBusqueda && (
                            <motion.span 
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xl"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              Búsqueda: "{filtroBusqueda}"
                              <button
                                onClick={() => setFiltroBusqueda("")}
                                className="text-blue-600 hover:text-blue-800 cursor-pointer text-2xl"
                              >
                                ×
                              </button>
                            </motion.span>
                          )}
                          {filtroCategoria && (
                            <motion.span 
                              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xl cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              Categoría:{" "}
                              {
                                categorias.find(
                                  (c) => c.id.toString() === filtroCategoria
                                )?.nombre
                              }
                              <button
                                onClick={() => setFiltroCategoria("")}
                                className="text-green-600 hover:text-green-800 cursor-pointer text-2xl"
                              >
                                ×
                              </button>
                            </motion.span>
                          )}
                          {filtroStock && (
                            <motion.span 
                              className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xl"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              Stock:{" "}
                              {filtroStock === "con-stock"
                                ? "Con stock"
                                : filtroStock === "sin-stock"
                                ? "Sin stock"
                                : "Stock bajo"}
                              <button
                                onClick={() => setFiltroStock("")}
                                className="text-orange-600 hover:text-orange-800 cursor-pointer text-2xl"
                              >
                                ×
                              </button>
                            </motion.span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contenido principal */}
          {cargando ? (
            <motion.div 
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ) : vistaActual === "productos" ? (
            <div className="mx-auto">
              <AnimatedCard className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-sm border border-slate-200/40 overflow-hidden">
                <div className="p-8 pt-[1rem] pb-[0.6rem] border-b border-slate-200/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <motion.h2 
                      className="text-2xl font-bold text-slate-800"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      Productos{" "}
                      <span className="text-blue-600">
                        ({productosFiltrados.length})
                      </span>
                    </motion.h2>
                    <motion.p 
                      className="text-slate-600 mt-1 font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {filtroBusqueda
                        ? `Filtrado por: "${filtroBusqueda}"`
                        : "Todos los productos disponibles"}
                    </motion.p>
                  </div>
                  <motion.div 
                    className="flex items-center gap-3 text-slate-600"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <AnimatedIcon>
                      <FilterList className="text-lg" />
                    </AnimatedIcon>
                    <span className="text-sm font-medium">
                      {vista === "tabla"
                        ? "Vista de tabla"
                        : "Vista de tarjetas"}
                    </span>
                  </motion.div>
                </div>

                <div className="px-8 pb-6">
                  {vista === "tabla" ? (
                    <VistaTabla
                      productos={productosFiltrados}
                      formatearPrecio={formatearPrecio}
                      getColorStock={getColorStock}
                      obtenerNombreCategoria={obtenerNombreCategoria}
                      onEditar={handleEditarProducto}
                      onEliminar={handleEliminarProducto}
                      onActivar={handleActivarProducto}
                    />
                  ) : (
                    <VistaCards
                      productos={productosFiltrados}
                      formatearPrecio={formatearPrecio}
                      getColorStock={getColorStock}
                      obtenerNombreCategoria={obtenerNombreCategoria}
                      onEditar={handleEditarProducto}
                      onEliminar={handleEliminarProducto}
                      onActivar={handleActivarProducto}
                    />
                  )}
                </div>
              </AnimatedCard>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <AnimatedCard className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-sm border border-slate-200/40 overflow-hidden">
                <div className="p-8 border-b border-slate-200/40 flex justify-between items-center">
                  <div>
                    <motion.h2 
                      className="text-2xl font-bold text-slate-800"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      Categorías{" "}
                      <span className="text-purple-600">
                        ({categorias.length})
                      </span>
                    </motion.h2>
                    <motion.p 
                      className="text-slate-600 mt-1 font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      Organiza tus productos por categorías
                    </motion.p>
                  </div>
                </div>

                <div className="p-8">
                  <VistaCategorias
                    categorias={categorias}
                    onEditar={handleEditarCategoria}
                    onEliminar={handleEliminarCategoria}
                  />
                </div>
              </AnimatedCard>
            </div>
          )}
        </main>
      </div>

      {/* Modales */}
      <AnimatePresence>
        {mostrarFormProducto && (
          <div className="absolute h-screen w-full bg-black/70 z-60">
          <ProductoForm
            producto={productoEditando}
            onSave={handleSaveProducto}
            onCancel={cerrarFormProducto}
          />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mostrarFormCategoria && (
          <CategoriaForm
            categoria={categoriaEditando}
            onSave={handleSaveCategoria}
            onCancel={cerrarFormCategoria}
          />
        )}
      </AnimatePresence>
    </AnimatedContainer>
  );
}