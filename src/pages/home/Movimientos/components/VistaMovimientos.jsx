import {
  AnimatedContainer,
  AnimatedButton,
  AnimatedIcon,
} from "../../../../animations/animations";
import { useMovimientos } from "../../../../context/MovimientosContext";
import { useProductos } from "../../../../context/ProductosContext";
import SvgIcon from "@mui/icons-material/Dashboard";
import DatePickerValue from "../../../../components/utils/DatePickerValue";
import { useState } from "react";
import dayjs from "dayjs";

export default function VistaMovimientos() {
  const { movimientos, fetchMovimientos } = useMovimientos();
  const { productos, setProductos } = useProductos();
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  console.log(movimientos);
  const encontrarProducto = (IdProducto) => {
    const producto = productos.find((p) => p.id === IdProducto);
    return producto ? producto.nombre : "Producto no encontrado";
  };
  const handleFechaInicio = (fecha) => {
    setFechaInicio(fecha);
    console.log(movimientos);
  }
  const mapaProductos = Object.fromEntries(
    productos.map(p => [p.id, p.nombre.toLowerCase()])
  );
  const dentroDeRango = (fechaStr) => {
    const fecha = dayjs(fechaStr);

    if (fechaInicio && fecha.isBefore(fechaInicio, "day")) return false;
    if (fechaFin && fecha.isAfter(fechaFin, "day")) return false;

    return true;
  };
  const movimientosFiltrados = movimientos.filter((item) => {
    const nombreProducto = mapaProductos[item.producto_id] || "";

    const coincideBusqueda = nombreProducto.includes(busqueda.toLowerCase());
    const coincideFecha = dentroDeRango(item.fecha);

    return coincideBusqueda && coincideFecha;
  });

  const handleFechaFin = (fecha) => {
    setFechaFin(fecha);
  }
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
      <div className="w-full bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-10 pb-14 shadow-lg">
        <div className="flex justify-between items-center w-full">
          <div className="space-y-3 ">
            <div className="font-bold text-white text-4xl tracking-tight">
              Movimientos del Inventario
            </div>
            <div className="font-light text-emerald-100 text-xl">
              Historial completo de movimientos de inventario
            </div>
          </div>

          <div className="relative w-100 max-w-xl">
            <div className="bg-white rounded-xl shadow-lg w-full h-14 flex items-center px-4 border border-gray-200 hover:border-blue-400 transition-colors duration-200">
              <svg
                className="w-5 h-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Buscar movimientos por productos"
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-base"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-white text-sm font-medium">
              Total de registros
            </div>
            <div className="text-white text-2xl font-bold">{movimientosFiltrados.length}</div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="px-8 -mt-8 relative">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          {/* Barra de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-6  gap-4  mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-blue-600 text-sm font-semibold">
                Entradas
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {
                  movimientos.filter(
                    (item) => item.tipo?.toLowerCase() === "entrada"
                  ).length
                }
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <div className="text-red-600 text-sm font-semibold">Salidas</div>
              <div className="text-2xl font-bold text-red-800">
                {
                  movimientos.filter((item) => item.tipo?.toLowerCase() === "salida")
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
            {/*Aqui necesito 2 botones, uno para escoger una fecha de inicio*/}
            <div className="w-50">
              <DatePickerValue label="Fecha Inicio" onChangeDate={handleFechaInicio} />
            </div>
            <div className="pl-10 w-60">
              <DatePickerValue label="Fecha Fin" onChangeDate={handleFechaFin} />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider w-16">
                    ID
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider min-w-32 max-w-48">
                    Producto
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider w-24">
                    Fecha
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider w-24">
                    Tipo
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider min-w-28 max-w-40">
                    Referencia
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider w-20">
                    Cantidad
                  </th>
                                    <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider w-32">
                    Saldo
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider w-32">
                    Costo Unitario
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider w-32">
                    Total
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs uppercase tracking-wider min-w-40 max-w-64">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movimientosFiltrados.map((data) => (
                  <tr
                    key={data.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-3">
                      <div className="text-gray-900 font-mono text-xs font-semibold">
                        # {data.id}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="max-w-25">
                        <div className="text-gray-900 font-medium text-sm mb-2" title={encontrarProducto(data.producto_id)}>
                          {encontrarProducto(data.producto_id)}
                        </div>
                        <div className="text-gray-400 text-xs">
                          ID: {data.producto_id}
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-gray-700 text-sm whitespace-nowrap">
                        {formatearFecha(data.fecha)}
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(
                          data.tipo
                        )}`}
                      >
                        {data.tipo || "N/A"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="text-gray-700 text-sm break-words min-w-0">
                        {data.factura_id || data.compra_id || data.referencia_id || "Sin ref."}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className={`font-bold text-sm ${data.cantidad > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.cantidad > 0 ? '+' : '-'}{Math.abs(data.cantidad)}                        
                      </div>
                    </td>
<td className="p-3">
                      <div className={`font-bold text-sm ${data.cantidad > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.saldo}                        
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-900 font-semibold text-sm whitespace-nowrap">
                        {formatCurrency(data.costo_unitario)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-900 font-semibold text-sm whitespace-nowrap">
                        {formatCurrency(data.total)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-700 text-sm break-words max-w-40 max-h-16 overflow-y-auto">
                        {data.descripcion || "Sin descripción"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer de la tabla */}
          {movimientosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No hay registros
              </h3>
              <p className="mt-1 text-gray-500">
                No se encontraron movimientos en el movimientos.
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatedContainer>
  );
}
