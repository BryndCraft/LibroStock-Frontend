import {
  Inventory2,
  Category,
  LocalOffer,
  Edit,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";
import { useProductos } from "../../../../context/ProductosContext";
import { useInventario } from "../hooks/useInventario";
import { searchProductos } from "../../../../apis/productos.api";
export function ProductoCard({
  mostrar_inactivos,
  handleEditarProducto,
  productosFiltrados
}) {
  const { productos } = useProductos();
  const {
    handleActivarProducto,
    handleEliminarProducto,
    obtenerNombreCategoria,
    getColorStock,
    formatearPrecio,
  } = useInventario();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {productosFiltrados.map((producto) => (
        <div
          key={producto.id}
          className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-sm hover:shadow-2xl border border-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:border-slate-300/60 flex flex-col min-h-[280px]"
        >
          <div className="p-5 flex-1 flex flex-col">
            {/* Header con icono y stock */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Inventory2 className="text-white text-xl" />
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xl font-medium border backdrop-blur-sm ${getColorStock(
                  producto
                )}`}
              >
                {producto.stock} unidades
              </span>
            </div>

            {/* Contenedor principal */}
            <div className="space-y-3 flex-1">
              <h3 className="font-bold text-slate-800 text-2xl line-clamp-2 group-hover:text-slate-900 transition-colors leading-tight">
                {producto.nombre}
              </h3>

              {producto.descripcion && (
                <p className="text-slate-600 text-lg line-clamp-2 leading-relaxed font-light">
                  {producto.descripcion}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {/* Columna izquierda - Categoría */}
                <div className="flex items-start gap-2 min-w-0">
                  <div className="w-6 h-6 bg-purple-100/80 rounded-lg flex items-center justify-center border border-purple-200/60 flex-shrink-0 mt-0.5">
                    <Category className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-xs text-slate-700 font-medium break-words line-clamp-2 min-w-0">
                    {obtenerNombreCategoria(producto.categoria_id)}
                  </span>
                </div>

                {/* Columna derecha - Precio */}
                <div className="flex items-start gap-2 min-w-0">
                  <div className="w-6 h-6 bg-emerald-100/80 rounded-lg flex items-center justify-center border border-emerald-200/60 flex-shrink-0 mt-0.5">
                    <LocalOffer className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="font-bold text-emerald-600 text-sm break-words min-w-0">
                    {formatearPrecio(producto.precio)}
                  </span>
                </div>
              </div>

              {/* Código de barras */}
              {producto.codigo_barras && (
                <div className="p-2 bg-slate-100/50 rounded-lg border border-slate-200/40 backdrop-blur-sm mt-3">
                  <span className="text-xs text-slate-500 font-mono truncate block">
                    Cód: {producto.codigo_barras}
                  </span>
                </div>
              )}
              {/* Precio de Compra */}
              {producto.precio_compra && (
                <div className="p-2 bg-slate-100/50 rounded-lg border border-slate-200/40 backdrop-blur-sm mt-3">
                  <span className="text-xs text-slate-500 font-mono truncate block">
                    Precio de compra: C$  {producto.precio_compra}
                  </span>
                </div>
              )}
              
              {/* Stock Minimo */}
              {producto.stock_minimo && (
                <div className="p-2 bg-slate-100/50 rounded-lg border border-slate-200/40 backdrop-blur-sm mt-3">
                  <span className="text-xs text-slate-500 font-mono truncate block">
                    Stock Minimo: {producto.stock_minimo} unidades
                  </span>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4 mt-4 border-t border-slate-200/40">
              <button
                onClick={() => handleEditarProducto(producto)}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-blue-400/30 flex items-center justify-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Editar
              </button>
              {producto.activo ? (
                <button
                  onClick={() => handleEliminarProducto(producto.id)}
                  className="flex-1 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-rose-400/30 flex items-center justify-center gap-1"
                >
                  <ToggleOff className="w-3 h-3" />
                  Desactivar
                </button>
              ) : (
                <button
                  onClick={() => handleActivarProducto(producto.id)}
                  className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-rose-400/30 flex items-center justify-center gap-1"
                >
                  <ToggleOn className="w-3 h-3" />
                  Activar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}