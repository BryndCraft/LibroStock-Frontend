import { motion } from "framer-motion";
import { useCompras } from "../../../../context/ComprasContext";
import { useProveedor } from "../../../../context/ProveedorContext";
import {
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";

export function VistaComprasTabla() {
  const { compras } = useCompras();
  const { proveedores } = useProveedor();

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Calcular estadísticas
  const totalCompras = compras.length;
  const totalMonto = compras.reduce(
    (sum, compra) => sum + (compra.total || 0),
    0
  );
  const comprasEsteMes = compras.filter((compra) => {
    const fechaCompra = new Date(compra.fecha);
    const hoy = new Date();
    return (
      fechaCompra.getMonth() === hoy.getMonth() &&
      fechaCompra.getFullYear() === hoy.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={statsVariants}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Compras</p>
              <p className="text-3xl font-bold mt-2">{totalCompras}</p>
            </div>
            <ReceiptIcon className="text-white opacity-80" fontSize="large" />
          </div>
        </motion.div>

        <motion.div
          variants={statsVariants}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Monto Total</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(totalMonto)}
              </p>
            </div>
            <TrendingIcon className="text-white opacity-80" fontSize="large" />
          </div>
        </motion.div>

        <motion.div
          variants={statsVariants}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Este Mes</p>
              <p className="text-3xl font-bold mt-2">{comprasEsteMes}</p>
            </div>
            <InventoryIcon className="text-white opacity-80" fontSize="large" />
          </div>
        </motion.div>
      </motion.div>

      {/* Tabla */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200">
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
          <tbody className="divide-y divide-gray-100">
            {compras.map((compra) => (
              <tr
                key={compra.id}
                variants={rowVariants}
                className="hover:bg-blue-50/30 transition-all duration-200 group cursor-pointer"

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
                      {compra.numero_factura || "N/A"}
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
                      {formatearFecha(compra.fecha)}
                    </span>
                  </div>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <MoneyIcon className="text-green-500" fontSize="small" />
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(compra.total)}
                    </span>
                  </div>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getMetodoPagoColor(
                      compra.metodo_pago
                    )}`}
                  >
                    <PaymentIcon className="mr-1" fontSize="small" />
                    {compra.metodo_pago || "No especificado"}
                  </span>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <motion.button
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <VisibilityIcon className="mr-2" fontSize="small" />
                    Ver Detalles
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Estado vacío */}
        {compras.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShippingIcon className="text-gray-400" fontSize="large" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay compras registradas
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Aún no se han registrado compras en el sistema. Las compras
              aparecerán aquí una vez que sean agregadas.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
