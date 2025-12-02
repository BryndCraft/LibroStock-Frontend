import { Edit, Delete, Business, Person, Phone, Email, LocationOn, AssignmentInd, CheckBox, Check } from '@mui/icons-material';
import { useProveedor } from '../../../../context/ProveedorContext';

export default function VistaTablaProveedores({ abrirEditarProveedor, proveedoresInactivos, proveedoresFiltrados }) {
  const { proveedores, eliminarProveedor, activarProveedor } = useProveedor();

  // Filtrar proveedores según estado
  const proveedoresFiltradosPorEstado = proveedoresFiltrados
    ? proveedoresFiltrados.filter((proveedor) => 
        proveedoresInactivos ? proveedor.estado === false : proveedor.estado === true
      )
    : [];

  return (
    <div className="h-full flex flex-col">
      {/* Contenedor principal con altura fija y scroll */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200/40 bg-white">
        <div className="h-full overflow-auto">
          <table className="w-full">
            {/* Cabecera fija */}
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-slate-50/80 to-orange-50/50 border-b border-slate-200/40">
                <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider whitespace-nowrap">
                  Empresa
                </th>
                <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider whitespace-nowrap">
                  Contacto
                </th>
                <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider whitespace-nowrap">
                  Teléfono
                </th>
                <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider whitespace-nowrap">
                  Estado
                </th>
                <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla */}
            <tbody>
              {proveedoresFiltradosPorEstado.length > 0 ? (
                proveedoresFiltradosPorEstado.map((proveedor) => (
                  <tr 
                    key={proveedor.id} 
                    className="border-b border-slate-200/40 hover:bg-orange-50/20 transition-colors duration-200 group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Business className="text-white text-lg" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 text-lg truncate">
                            {proveedor.empresa}
                          </div>
                          {proveedor.ruc && (
                            <div className="text-slate-500 text-sm mt-1 font-mono truncate">
                              {proveedor.ruc}
                            </div>
                          )}
                          {proveedor.direccion && (
                            <div className="text-slate-600 text-sm mt-2 max-w-md line-clamp-1 font-light flex items-center gap-1">
                              <LocationOn className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{proveedor.direccion}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      {proveedor.nombre_contacto ? (
                        <div className="flex items-center gap-2">
                          <Person className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 font-medium truncate">
                            {proveedor.nombre_contacto}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No especificado</span>
                      )}
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      {proveedor.telefono ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-slate-700 font-mono">{proveedor.telefono}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No especificado</span>
                      )}
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      {proveedor.correo ? (
                        <div className="flex items-center gap-2">
                          <Email className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span className="text-slate-700 text-sm truncate max-w-[180px]">
                            {proveedor.correo}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No especificado</span>
                      )}
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${
                        proveedor.estado 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {proveedor.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          className="p-3 text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-200 hover:scale-105 border border-blue-200/60 backdrop-blur-sm hover:border-blue-300"
                          title="Editar proveedor"
                          onClick={() => abrirEditarProveedor(proveedor)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        
                        {proveedor.estado ? (
                          <button
                            className="p-3 text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all duration-200 hover:scale-105 border border-rose-200/60 backdrop-blur-sm hover:border-rose-300"
                            title="Eliminar proveedor"
                            onClick={() => eliminarProveedor(proveedor.id)}
                          >
                            <Delete className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            className="p-3 text-white bg-green-500 hover:bg-green-600 rounded-xl transition-all duration-200 hover:scale-105 border border-green-300 backdrop-blur-sm"
                            title="Activar Proveedor"
                            onClick={() => activarProveedor(proveedor.id)}
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Estado vacío
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <Business className="text-orange-400 text-3xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        {proveedoresInactivos 
                          ? "No hay proveedores inactivos" 
                          : "No hay proveedores activos"}
                      </h3>
                      <p className="text-slate-500 max-w-md">
                        {proveedoresInactivos
                          ? "Todos los proveedores están activos en este momento."
                          : "No se encontraron proveedores activos. Agrega uno nuevo."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}