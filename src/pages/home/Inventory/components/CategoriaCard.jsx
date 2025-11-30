import { Inventory2, Category, LocalOffer,Edit, ToggleOn, ToggleOff } from "@mui/icons-material";
import { useCategorias } from "../../../../context/CategoriasContext";
import { useInventario } from "../hooks/useInventario";

export function CategoriaCard({handleEditarCategoria}) {

  const {categorias} = useCategorias();
  const {handleActivarCategoria, handleEliminarCategoria} = useInventario();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categorias.map((categoria) => (
        <div key={categoria.id} className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-sm hover:shadow-2xl border border-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:border-slate-300/60">
          <div className="p-6">
            {/* Header con icono */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Category className="text-white text-2xl" />
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${categoria.activo ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                {categoria.activo ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            {/* Información de la categoría */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-800 text-xl mb-3 group-hover:text-slate-900 transition-colors">{categoria.nombre || 'Sin nombre'}</h3>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 font-light">
                {categoria.descripcion || 'Sin descripción disponible'}
              </p>
            </div>

            {/* ID de la categoría */}
            <div className="mb-6 p-3 bg-slate-100/50 rounded-xl border border-slate-200/40 backdrop-blur-sm">
              <span className="text-xs text-slate-500 font-mono">ID: {categoria.id}</span>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-slate-200/40">
              <button
                onClick={() => handleEditarCategoria(categoria)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-sm border border-blue-400/30"
              >
                Editar
              </button>
              
              {categoria.activo ? (
                <button
                onClick={() => handleEliminarCategoria(categoria.id)}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-sm border border-rose-400/30"
              >
                Desactivar
              </button>
              ):
              <button
                onClick={() => handleActivarCategoria(categoria.id)}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-sm border border-green-400/30"
              >
                Activar
              </button>
              }
              
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}