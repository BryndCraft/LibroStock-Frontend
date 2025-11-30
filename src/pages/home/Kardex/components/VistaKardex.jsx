import {
  AnimatedContainer,
  AnimatedButton,
  AnimatedIcon,
} from "../../../../animations/animations";
import { useKardex } from "../../../../context/KardexContext";
import { useProductos } from "../../../../context/ProductosContext";

export default function VistaKardex() {
  const { kardex, setKardex } = useKardex();
  const { productos, setProductos } = useProductos();
  console.log(kardex);
  console.log(productos);

  const encontrarProducto = (IdProducto) => {
    const producto = productos.find((p) => p.id === IdProducto);
    return producto ? producto.nombre : "Producto no encontrado";
  };

  const formatearFecha = (fechaBase) => {
    if (!fechaBase) return "No tiene fecha";
    try {
      const fecha = new Date(fechaBase);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return fechaBD;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "entrada":
        return "bg-green-100 text-green-800 border-green-200";
      case "salida":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount || 0);
  };

  return (
    <AnimatedContainer className="min-h-screen w-full ml-75 bg-gray-50">
      {/* Header Mejorado */}
      <div className="w-full bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-12 shadow-lg">
        <div className="flex justify-between items-center w-full">
          <div className="space-y-3">
            <div className="font-bold text-white text-4xl tracking-tight">
              Kardex del Inventario
            </div>
            <div className="font-light text-emerald-100 text-xl">
              Historial completo de movimientos de inventario
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-white text-sm font-medium">
              Total de registros
            </div>
            <div className="text-white text-2xl font-bold">{kardex.length}</div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="px-8 -mt-8 relative">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          {/* Barra de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-blue-600 text-sm font-semibold">
                Entradas
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {
                  kardex.filter(
                    (item) => item.tipo?.toLowerCase() === "entrada"
                  ).length
                }
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <div className="text-red-600 text-sm font-semibold">Salidas</div>
              <div className="text-2xl font-bold text-red-800">
                {
                  kardex.filter((item) => item.tipo?.toLowerCase() === "salida")
                    .length
                }
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="text-purple-600 text-sm font-semibold">
                Productos
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {productos.length}
              </div>
            </div>
          </div>

          {/* Tabla Mejorada */}
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200">
                  <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                    ID
                  </th>
                  <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                    Producto
                  </th>
                  <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                    Fecha
                  </th>
                  <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                    Tipo
                  </th>
                  <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                    Referencia
                  </th>
                  <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                    Cantidad
                  </th>
                  <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                    Costo Promedio
                  </th>
                  <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {kardex.map((data) => (
                  <tr
                    key={data.id}
                    className="hover:bg-blue-50/30 transition-all duration-200 group cursor-pointer"
                  >
                    <td className="p-6 whitespace-nowrap">
                      <div className="text-gray-900 font-mono text-sm font-medium">
                        #{data.id}
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">
                          {encontrarProducto(data.producto_id)}
                        </span>
                        <span className="text-gray-500 text-xs">
                          ID: {data.producto_id}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="text-gray-700 font-medium">
                        {formatearFecha(data.fecha)}
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTipoColor(
                          data.tipo
                        )}`}
                      >
                        {data.tipo || "N/A"}
                      </span>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="text-gray-700 max-w-xs truncate">
                        {data.referencia || "Sin referencia"}
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div
                        className={`font-bold ${
                          data.tipo?.toLowerCase() === "entrada"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {data.cantidad}
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <div className="text-gray-900 font-semibold">
                        {formatCurrency(data.costo_prom_actual)}
                      </div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm">
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer de la tabla */}
          {kardex.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No hay registros
              </h3>
              <p className="mt-1 text-gray-500">
                No se encontraron movimientos en el kardex.
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatedContainer>
  );
}
