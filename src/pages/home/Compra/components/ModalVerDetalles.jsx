import { Close as CloseIcon, ShoppingBag as ShoppingBagIcon } from "@mui/icons-material";

export function ModalVerDetalles({ compra, setVerDetalles }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-NI", {
      style: "currency",
      currency: "NIO",
    }).format(amount || 0);
  };

  const formatearFecha = (fechaBase) => {
    if (!fechaBase) return "No tiene fecha";
    try {
      const fecha = new Date(fechaBase);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return fechaBase || "Fecha inválida";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-11/12 max-w-4xl rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Detalles de Compra #{compra.id}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Factura: {compra.factura || "Sin factura"}
            </p>
          </div>
          <button
            onClick={() => setVerDetalles(false)}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Información general */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Información General</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">{formatearFecha(compra.create_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Proveedor ID:</span>
                <span className="font-medium">{compra.proveedor_id || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Método de Pago:</span>
                <span className="font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {compra.metodo_pago || "No especificado"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Resumen Financiero</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Compra:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(compra.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cantidad de Productos:</span>
                <span className="font-medium">{compra.productos?.length || 0} productos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ShoppingBagIcon className="mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Productos Comprados</h3>
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {compra.productos?.length || 0}
            </span>
          </div>
          
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Producto ID</th>
                  <th className="p-4 font-semibold text-gray-700">Cantidad</th>
                  <th className="p-4 font-semibold text-gray-700">Costo Unitario</th>
                  <th className="p-4 font-semibold text-gray-700">Total Producto</th>
                </tr>
              </thead>
              <tbody>
                {compra.productos && compra.productos.length > 0 ? (
                  compra.productos.map((producto, index) => (
                    <tr 
                      key={index} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold text-sm">
                              #{producto.producto_id}
                            </span>
                          </div>
                          <span className="font-medium">Producto #{producto.producto_id}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full">
                          {producto.cantidad} unidades
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-700">
                          {formatCurrency(producto.costo_unitario)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-green-600">
                          {formatCurrency(producto.total)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <ShoppingBagIcon className="text-gray-400 mb-2" sx={{ fontSize: 48 }} />
                        <p>No hay productos registrados en esta compra</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {compra.productos && compra.productos.length > 0 && (
                <tfoot className="bg-gray-100 border-t">
                  <tr>
                    <td colSpan="3" className="p-4 text-right font-semibold text-gray-700">
                      Total General:
                    </td>
                    <td className="p-4">
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(compra.total)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Observaciones */}
        {compra.observaciones && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Observaciones</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{compra.observaciones}</p>
            </div>
          </div>
        )}

        {/* Botón cerrar */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={() => setVerDetalles(false)}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}