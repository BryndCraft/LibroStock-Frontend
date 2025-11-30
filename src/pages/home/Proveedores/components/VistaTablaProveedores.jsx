import { Edit, Delete, Business, Person, Phone, Email, LocationOn, AssignmentInd, CheckBox, Check } from '@mui/icons-material';
import { useProveedor } from '../../../../context/ProveedorContext';


export default function VistaTablaProveedores({abrirEditarProveedor, proveedoresInactivos, proveedoresFiltrados}) {

  const{proveedores, eliminarProveedor, activarProveedor} = useProveedor();



  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/40">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50/80 to-orange-50/50 border-b border-slate-200/40">
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Empresa</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Contacto</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Teléfono</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Email</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Estado</th>
            <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedoresFiltrados.filter((proveedor) => proveedoresInactivos ? proveedor.activo === false : proveedor.activo === true).map((proveedor) => (
            <tr key={proveedor.id} className="border-b border-slate-200/40 hover:bg-orange-50/20 transition-colors duration-200 group">
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Business className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-lg">{proveedor.empresa}</div>
                    {proveedor.ruc && (
                      <div className="text-slate-500 text-sm mt-1 font-mono">{proveedor.ruc}</div>
                    )}
                    {proveedor.direccion && (
                      <div className="text-slate-600 text-sm mt-2 max-w-md line-clamp-1 font-light flex items-center gap-1">
                        <LocationOn className="w-3 h-3" />
                        {proveedor.direccion}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="p-6">
                {proveedor.nombre_contacto ? (
                  <div className="flex items-center gap-2">
                    <Person className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 font-medium">{proveedor.nombre_contacto}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No especificado</span>
                )}
              </td>
              <td className="p-6">
                {proveedor.telefono ? (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-slate-700 font-mono">{proveedor.telefono}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No especificado</span>
                )}
              </td>
              <td className="p-6">
                {proveedor.correo ? (
                  <div className="flex items-center gap-2">
                    <Email className="w-4 h-4 text-purple-500" />
                    <span className="text-slate-700 text-sm truncate max-w-[200px]">{proveedor.correo}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No especificado</span>
                )}
              </td>
              <td className="p-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ">
                  {proveedor.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="p-6">
                <div className="flex gap-2">
                  <button
                    className="p-3 text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-200 hover:scale-105 border border-blue-200/60 backdrop-blur-sm hover:border-blue-300"
                    title="Editar proveedor"
                    onClick={() => abrirEditarProveedor((proveedor))}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  
                  {proveedor.activo ? (<button
                    className="p-3 text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all duration-200 hover:scale-105 border border-rose-200/60 backdrop-blur-sm hover:border-rose-300"
                    title="Eliminar proveedor"
                    onClick={() => eliminarProveedor(proveedor.id)}
                  >
                    
                    <Delete className="w-5 h-5" />
                  </button>):(
                    <button
                    className="p-3 text-white bg-green-500 rounded-xl transition-all duration-200 hover:scale-105 border border-green-300 backdrop-blur-sm hover:border-rose-300"
                    title="Activar Producto"
                    onClick={() => activarProveedor(proveedor.id)}
                  >
                    
                    <Check/>
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