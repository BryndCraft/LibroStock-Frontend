import { Inventory2, Category, LocalOffer,Edit, ToggleOn, ToggleOff } from "@mui/icons-material";

export function VistaTabla({ productos, formatearPrecio, getColorStock, obtenerNombreCategoria, onEditar, onEliminar, onActivar }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/40">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50/80 to-blue-50/50 border-b border-slate-200/40">
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Producto</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Categoría</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Precio</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Stock</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className="border-b border-slate-200/40 hover:bg-blue-50/20 transition-colors duration-200 group">
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Inventory2 className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-lg">{producto.nombre}</div>
                    <div className="text-slate-500 text-sm mt-1 font-mono">{producto.codigo_barras}</div>
                    {producto.descripcion && (
                      <div className="text-slate-600 text-sm mt-2 max-w-md line-clamp-2 font-light">{producto.descripcion}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="p-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50/80 text-purple-700 text-sm font-medium border border-purple-200/60 backdrop-blur-sm">
                  <Category className="w-4 h-4" />
                  {obtenerNombreCategoria(producto.categoria_id)}
                </span>
              </td>
              <td className="p-6">
                <div className="flex items-center gap-2">
                  <LocalOffer className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-emerald-600 text-lg">
                    {formatearPrecio(producto.precio)}
                  </span>
                </div>
              </td>
              <td className="p-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm ${getColorStock(producto.stock)}`}>
                  {producto.stock} unidades
                </span>
              </td>
              <td className="p-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditar(producto)}
                    className="p-3 text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-200 hover:scale-105 border border-blue-200/60 backdrop-blur-sm hover:border-blue-300"
                    title="Editar producto"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                 {producto.activo ? (
                            <button
                onClick={() => onEliminar(producto.id)}
                className="w-25 flex-1 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-rose-400/30 flex items-center justify-center gap-1"
              >
                <ToggleOff className="w-3 h-3" />
                Desactivar
              </button>
  
              ) : (
                <button
                onClick={() => onActivar(producto.id)}
                className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-rose-400/30 flex items-center justify-center gap-1"
              >
                <ToggleOn className="w-3 h-3" />
                Activar
              </button>
  
              )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
