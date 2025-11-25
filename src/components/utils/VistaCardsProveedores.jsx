import { Edit, Delete, Business, Person, Phone, Email, LocationOn, AssignmentInd } from '@mui/icons-material';

import { useProveedor } from '../../context/ProveedorContext';

export default function VistaCardsProveedores({ proveedores, onEditar, onEliminar }) {
  const getEstadoColor = (activo) => {
    return activo 
      ? 'bg-emerald-100/80 text-emerald-700 border-emerald-200/60' 
      : 'bg-rose-100/80 text-rose-700 border-rose-200/60';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {proveedores.map((proveedor) => (
        <div key={proveedor.id} className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-sm hover:shadow-2xl border border-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:border-slate-300/60 flex flex-col min-h-[320px]">
          <div className="p-5 flex-1 flex flex-col">
            {/* Header con icono y estado */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Business className="text-white text-xl" />
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getEstadoColor(proveedor.activo)}`}>
                {proveedor.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* Contenedor principal */}
            <div className="space-y-3 flex-1">
              <h3 className="font-bold text-slate-800 text-xl line-clamp-2 group-hover:text-slate-900 transition-colors leading-tight">
                {proveedor.empresa}
              </h3>

              {proveedor.nombre_contacto && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Person className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">{proveedor.nombre_contacto}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 mt-3">
                {/* Teléfono */}
                {proveedor.telefono && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100/80 rounded-lg flex items-center justify-center border border-blue-200/60 flex-shrink-0">
                      <Phone className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium truncate">
                      {proveedor.telefono}
                    </span>
                  </div>
                )}

                {/* Email */}
                {proveedor.correo && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100/80 rounded-lg flex items-center justify-center border border-purple-200/60 flex-shrink-0">
                      <Email className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium truncate">
                      {proveedor.correo}
                    </span>
                  </div>
                )}

                {/* RUC */}
                {proveedor.ruc && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100/80 rounded-lg flex items-center justify-center border border-green-200/60 flex-shrink-0">
                      <AssignmentInd className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-slate-700 font-mono truncate">
                      {proveedor.ruc}
                    </span>
                  </div>
                )}
              </div>

              {/* Dirección */}
              {proveedor.direccion && (
                <div className="p-2 bg-slate-100/50 rounded-lg border border-slate-200/40 backdrop-blur-sm mt-3">
                  <div className="flex items-start gap-2">
                    <LocationOn className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-600 line-clamp-2">
                      {proveedor.direccion}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4 mt-4 border-t border-slate-200/40">
              <button
                onClick={() => onEditar(proveedor)}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-blue-400/30 flex items-center justify-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Editar
              </button>
              <button
                onClick={() => onEliminar(proveedor.id)}
                className="flex-1 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs border border-rose-400/30 flex items-center justify-center gap-1"
              >
                <Delete className="w-3 h-3" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}