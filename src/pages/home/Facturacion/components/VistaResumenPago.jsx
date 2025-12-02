import { motion } from "framer-motion";
import {
  Receipt,
  AttachMoney,
  ShoppingCart,
  ClearAll,
  Inventory,
  Delete,
} from "@mui/icons-material";
import { useFacturacion } from "../hooks/useFacturacion";
import { useEffect, useState } from "react";

export function VistaResumenPago({ facturacionData, setFacturacionData }) {
  const { handleGuardarVenta } = useFacturacion();

  const [cantidades, setCantidades] = useState({});
  const [montoRecibido, setMontoRecibido] = useState("");
  const [descuento, setDescuento] = useState("");

  // Inicializar estados locales
  useEffect(() => {
    const nuevasCantidades = {};
    facturacionData.productos.forEach(p => {
      nuevasCantidades[p.id] = p.cantidad?.toString() || "";
    });
    setCantidades(nuevasCantidades);

    setMontoRecibido(facturacionData.montoRecibido?.toString() || "");
    setDescuento(facturacionData.descuento?.toString() || "");
  }, [facturacionData]);

  const formatNumber = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  };

  // Actualiza cantidad de un producto
  const handleCantidad = (id, value) => {
    // Permitir input vacío
    setCantidades(prev => ({ ...prev, [id]: value }));

    // Actualizar facturacionData solo si hay valor numérico válido
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setFacturacionData(prev => ({
        ...prev,
        productos: prev.productos.map(p =>
          p.id === id ? { ...p, cantidad: num, total: num * (p.precio || 0) } : p
        )
      }));
    } else if (value === "") {
      // Si está vacío, mantener total como 0
      setFacturacionData(prev => ({
        ...prev,
        productos: prev.productos.map(p =>
          p.id === id ? { ...p, cantidad: 0, total: 0 } : p
        )
      }));
    }
  };

  const handleMontoRecibido = (value) => {
    setMontoRecibido(value);
    const monto = parseFloat(value) || 0;
    const total = parseFloat(facturacionData.total) || 0;
    setFacturacionData(prev => ({
      ...prev,
      montoRecibido: monto,
      montoDevuelto: Math.max(0, monto - total)
    }));
  };

  const handleDescuento = (value) => {
    setDescuento(value);
    const d = Math.max(0, Math.min(100, parseFloat(value) || 0));
    setFacturacionData(prev => ({ ...prev, descuento: d }));
  };

  const calcularSubtotal = () => {
    const subtotal = facturacionData.productos.reduce((acc, p) => {
      const cantidad = parseInt(p.cantidad) || 0;
      const precio = parseFloat(p.precio) || 0;
      return acc + cantidad * precio;
    }, 0);
    setFacturacionData(prev => ({ ...prev, subtotal }));
  };

  const calcularTotal = () => {
    const subtotal = parseFloat(facturacionData.subtotal) || 0;
    const d = parseFloat(facturacionData.descuento) || 0;
    const total = Math.max(0, subtotal - (subtotal * d / 100));
    const montoRec = parseFloat(facturacionData.montoRecibido) || 0;
    setFacturacionData(prev => ({ ...prev, total, montoDevuelto: Math.max(0, montoRec - total) }));
  };

  useEffect(() => { calcularSubtotal(); }, [facturacionData.productos]);
  useEffect(() => { calcularTotal(); }, [facturacionData.subtotal, facturacionData.descuento, facturacionData.montoRecibido]);

  const eliminarProductoCarrito = (id) => {
    setFacturacionData(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p.id !== id)
    }));
    setCantidades(prev => {
      const nuevas = { ...prev };
      delete nuevas[id];
      return nuevas;
    });
  };

  const limpiarCarrito = () => {
    setFacturacionData({
      estado: "Pagada",
      montoRecibido: 0,
      montoDevuelto: 0,
      subtotal: 0,
      descuento: 0,
      total: 0,
      productos: [],
      activo: true
    });
    setCantidades({});
    setMontoRecibido("");
    setDescuento("");
  };

  const subtotal = parseFloat(facturacionData.subtotal) || 0;
  const total = parseFloat(facturacionData.total) || 0;
  const montoDevuelto = parseFloat(facturacionData.montoDevuelto) || 0;
  const d = parseFloat(facturacionData.descuento) || 0;

  const handleSubmit = () => handleGuardarVenta(facturacionData);

  return (
    <div className="w-[40%] bg-gradient-to-b from-white to-blue-50 border-l border-gray-200/50 shadow-2xl flex flex-col h-full sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h2 className="font-poppinsBold text-2xl text-gray-900 flex items-center gap-3 md:text-lg">
          <ShoppingCart className="text-blue-600" /> Carrito de Compra
        </h2>
      </div>

      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[400px] max-h-[70vh]">
            {facturacionData.productos.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
                <ShoppingCart className="text-4xl text-gray-300 mb-4" />
                <span className="text-lg font-poppins">Carrito vacío</span>
                <span className="text-sm text-gray-400 mt-2">Agrega productos para continuar</span>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white sticky top-0 z-10">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 font-poppinsBold text-sm">
                    <div className="col-span-5">Producto</div>
                    <div className="col-span-3 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Precio</div>
                    <div className="col-span-2 text-center">Acciones</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {facturacionData.productos.map(producto => (
                    <div key={producto.id} className="hover:bg-gray-50/80 transition-colors duration-200">
                      <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg flex items-center justify-center">
                            <Inventory className="text-blue-600 text-lg" />
                          </div>
                          <div>
                            <p className="font-poppinsBold text-gray-900 text-sm">{producto.nombre}</p>
                            <p className="text-xs text-gray-500 font-poppins">{producto.codigo_barras || "Sin código"}</p>
                          </div>
                        </div>

                        <div className="col-span-3 flex justify-center">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={cantidades[producto.id] || ""}
                            onChange={(e) => handleCantidad(producto.id, e.target.value)}
                            className="w-12 py-2 text-center border border-gray-300 rounded-xl focus:ring-0 focus:outline-none font-poppinsBold text-gray-900"
                          />
                        </div>

                        <div className="col-span-2 text-right font-poppinsBold text-gray-900 text-sm">
                          C${formatNumber(producto.precio)}
                        </div>

                        <div className="col-span-2 flex justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            onClick={() => eliminarProductoCarrito(producto.id)}
                          >
                            <Delete className="text-lg" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 mt-6">
            <h3 className="font-poppinsBold text-gray-900 text-xl flex items-center gap-3 mb-6">
              <AttachMoney className="text-green-600 text-2xl" /> Resumen de Pago
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-poppinsBold text-gray-700 mb-3">Método de Pago</label>
                <button className="px-4 py-3 bg-blue-500 text-white rounded-xl font-poppinsBold shadow-md">Efectivo</button>
              </div>

              <div>
                <label className="block text-sm font-poppinsBold text-gray-700 mb-3">Efectivo Recibido (C$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={montoRecibido}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-lg text-center font-poppinsBold"
                  onChange={(e) => handleMontoRecibido(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-gray-600 font-poppins text-lg">
                  <span>Subtotal:</span>
                  <span>C${formatNumber(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600 font-poppins text-lg items-center">
                  <span>Descuento:</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={descuento}
                    placeholder="0"
                    className="w-24 outline-none border border-gray-300 focus:border-blue-500 rounded px-3 py-2 text-right"
                    onChange={(e) => handleDescuento(e.target.value)}
                  />
                  <span>%</span>
                </div>

                <div className="flex justify-between text-green-600 font-poppinsBold text-xl border-t border-gray-200 pt-4">
                  <span>Cambio:</span>
                  <span>C${formatNumber(montoDevuelto)}</span>
                </div>

                <div className="flex justify-between font-poppinsBold text-2xl border-t border-gray-200 pt-4">
                  <span>Total a Pagar:</span>
                  <span>C${formatNumber(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0 space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl flex items-center justify-center gap-3 font-poppinsBold shadow-lg"
          onClick={limpiarCarrito}
        >
          <ClearAll /> Limpiar Carrito
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={facturacionData.productos.length === 0}
          className={`w-full py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl flex items-center justify-center gap-3 font-poppinsBold shadow-lg ${
            facturacionData.productos.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-600 hover:to-emerald-600'
          }`}
          onClick={handleSubmit}
        >
          <Receipt className="text-2xl" /> Finalizar Venta
        </motion.button>
      </div>
    </div>
  );
}
