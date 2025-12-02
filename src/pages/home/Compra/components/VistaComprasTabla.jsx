import { useCompras } from "../../../../context/ComprasContext";
import { useProveedor } from "../../../../context/ProveedorContext";
import {
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { ModalVerDetalles } from "./ModalVerDetalles";

export function VistaComprasTabla() {
  const { compras } = useCompras();
  const { proveedores } = useProveedor();
  const [verDetalles, setVerDetalles] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

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
      return fechaBase || "Fecha inválida";
    }
  };

  const obtenerNombreProveedor = (proveedorId) => {
    if (proveedorId == null) return "Sin Proveedor";
    const proveedor = proveedores.find((pro) => pro.id === proveedorId);
    return proveedor ? proveedor.empresa : "Sin Proveedor";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount || 0);
  };

  const getMetodoPagoColor = (metodo) => {
    switch (metodo?.toLowerCase()) {
      case "efectivo":
        return "bg-green-100 text-green-800 border-green-200";
      case "tarjeta":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "transferencia":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "cheque":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabla con scroll interno */}
      <div className="flex-1 overflow-auto h-full">
        <table className="w-full">
          {/* Cabecera fija */}
          <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200 z-10">
            <tr>
              <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <ReceiptIcon fontSize="small" />
                  <span>ID</span>
                </div>
              </th>
              <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <ReceiptIcon fontSize="small" />
                  <span>Factura</span>
                </div>
              </th>
              <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <BusinessIcon fontSize="small" />
                  <span>Proveedor</span>
                </div>
              </th>
              <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <CalendarIcon fontSize="small" />
                  <span>Fecha</span>
                </div>
              </th>
              <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <MoneyIcon fontSize="small" />
                  <span>Total</span>
                </div>
              </th>
              <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <PaymentIcon fontSize="small" />
                  <span>Método Pago</span>
                </div>
              </th>
              <th className="text-left p-6 font-bold text-gray-700 text-sm uppercase tracking-wider whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          <tbody className="divide-y divide-gray-100">
            {compras.map((compra) => (
              <tr
                key={compra.id}
                className="hover:bg-blue-50/30 transition-colors duration-150 group cursor-pointer"
              >
                <td className="p-6 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        #{compra.id}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <ReceiptIcon className="text-gray-400" fontSize="small" />
                    <span className="font-medium text-gray-900">
                      {compra.factura || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <BusinessIcon className="text-gray-400" fontSize="small" />
                    <div>
                      <span className="font-medium text-gray-900 block">
                        {obtenerNombreProveedor(compra.proveedor_id)}
                      </span>
                      {compra.proveedor_id && (
                        <span className="text-gray-500 text-xs">
                          ID: {compra.proveedor_id}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="text-gray-400" fontSize="small" />
                    <span className="font-medium text-gray-700">
                      {formatearFecha(compra.create_date)}
                    </span>
                  </div>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <MoneyIcon className="text-green-500" fontSize="small" />
                    <span className="font-bold text-green-600">
                      {formatCurrency(compra.total)}
                    </span>
                  </div>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getMetodoPagoColor(
                      compra.metodo_pago
                    )}`}
                  >
                    <PaymentIcon className="mr-1.5" fontSize="small" />
                    {compra.metodo_pago || "No especificado"}
                  </span>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setCompraSeleccionada(compra);
                      setVerDetalles(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
                  >
                    <VisibilityIcon className="mr-2" fontSize="small" />
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Estado vacío */}
        {compras.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShippingIcon className="text-gray-400" sx={{ fontSize: 48 }} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No hay compras registradas
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Aún no se han registrado compras en el sistema. Las compras
              aparecerán aquí una vez que sean agregadas.
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {verDetalles && compraSeleccionada && (
        <ModalVerDetalles
          compra={compraSeleccionada}
          setVerDetalles={setVerDetalles}
        />
      )}
    </div>
  );
}