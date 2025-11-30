import { motion, AnimatePresence } from "framer-motion";
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

  const {handleGuardarVenta} = useFacturacion();
  const handleSubmit = () =>{

    const ventaData ={
      ...facturacionData
    }
    handleGuardarVenta(ventaData);
  }

  useEffect(() => {
    calcularSubtotal();
  }, [facturacionData.productos]);

  const handleMontoRecibido = (montoRecibido) => {
    setFacturacionData((prev) => ({
      ...prev,
      montoRecibido: Number(montoRecibido), 
      montoDevuelto:  Number(montoRecibido) - prev.total, 
    }));
  };

  const handlecantidad = (idProducto, nuevaCantidad) => {
    setFacturacionData((prev) => {
      const productosActualizados = prev.productos.map((p) =>
        p.id === idProducto ? { ...p, cantidad: Number(nuevaCantidad) } : p
      );

      return {
        ...prev,
        productos: productosActualizados,
      };
    });
  };

  const handleDescuento = (nuevoDescuento) => {
    setFacturacionData((prev) => {
      return {
        ...prev,
        descuento: Number(nuevoDescuento),
      };
    });
  };

  useEffect(() => {
    calcularTotal();
  }, [facturacionData.subtotal, facturacionData.descuento]);

  const calcularTotal = () => {
    setFacturacionData((prev) => {
      const descuentoAplicado = prev.subtotal * (prev.descuento / 100 || 0);
      const total = prev.subtotal - descuentoAplicado;

      return {
        ...prev,
        total,
      };
    });
  };


  const calcularSubtotal = () => {
    setFacturacionData((prev) => {
      const subtotal = prev.productos.reduce(
        (acc, prod) => acc + prod.cantidad * prod.precio_venta,
        0
      );

      return {
        ...prev,
        subtotal: subtotal,
      };
    });
  };

  const eliminarProductoCarrito = (idProducto) => {
    setFacturacionData((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.id !== idProducto),
    }));
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
      activo: true,
    });
  };

  return (
    <div className="w-[30%] bg-gradient-to-b from-white to-blue-50 border-l border-gray-200/50 shadow-2xl flex flex-col h-full max-h-screen sticky top-0">
      {/* Header fijo */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h2 className="font-poppinsBold text-2xl text-gray-900 flex items-center gap-3">
          <ShoppingCart className="text-blue-600" />
          Carrito de Compra
        </h2>
      </div>

      {/* Contenido desplazable */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        {/* Lista de productos en carrito */}
        <div className="space-y-4 mb-6">
          {/* Aquí van tus productos del carrito */}
          <div className="h-70 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {facturacionData.productos.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
                <ShoppingCart className="text-4xl text-gray-300 mb-4" />
                <span className="text-lg font-poppins">Carrito vacío</span>
                <span className="text-sm text-gray-400 mt-2">
                  Agrega productos para continuar
                </span>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="min-w-full">
                  {/* Header de la tabla */}
                  <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white sticky top-0 z-10">
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 font-poppinsBold text-sm">
                      <div className="col-span-5">Producto</div>
                      <div className="col-span-3 text-center">Cantidad</div>
                      <div className="col-span-2 text-right">Precio</div>
                      <div className="col-span-2 text-center">Acciones</div>
                    </div>
                  </div>

                  {/* Lista de productos */}
                  <div className="divide-y divide-gray-100">
                    {facturacionData.productos.map((producto) => (
                      <div
                        key={producto.id}
                        className="hover:bg-gray-50/80 transition-colors duration-200"
                      >
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                          {/* Producto */}
                          <div className="col-span-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg flex items-center justify-center">
                                <Inventory className="text-blue-600 text-lg" />
                              </div>
                              <div>
                                <p className="font-poppinsBold text-gray-900 text-sm">
                                  {producto.nombre}
                                </p>
                                <p className="text-xs text-gray-500 font-poppins">
                                  {producto.codigo_barras || "Sin código"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Cantidad */}
                          <div className="col-span-3">
                            <div className="flex justify-center">
                              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                                <input
                                  type="number"
                                  min="1"
                                  onChange={(e) =>
                                    handlecantidad(producto.id, e.target.value)
                                  }
                                  defaultValue="1"
                                  className="w-12 py-2 text-center border-0 focus:ring-0 focus:outline-none font-poppinsBold text-gray-900"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Precio */}
                          <div className="col-span-2">
                            <p className="text-right font-poppinsBold text-gray-900 text-sm">
                              C${producto.precio_venta}
                            </p>
                          </div>

                          {/* Acciones */}
                          <div className="col-span-2">
                            <div className="flex justify-center">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Eliminar producto"
                                onClick={() =>
                                  eliminarProductoCarrito(producto.id)
                                }
                              >
                                <Delete className="text-lg" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumen de pago */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="font-poppinsBold text-gray-900 text-xl flex items-center gap-3 mb-6">
            <AttachMoney className="text-green-600 text-2xl" />
            Resumen de Pago
          </h3>

          <div className="space-y-6">
            {/* Método de pago */}
            <div>
              <label className="block text-sm font-poppinsBold text-gray-700 mb-3">
                Método de Pago
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-3 bg-blue-500 text-white rounded-xl font-poppinsBold shadow-md">
                  Efectivo
                </button>
                <button className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-poppinsBold hover:bg-gray-200 transition-colors">
                  Tarjeta
                </button>
              </div>
            </div>

            {/* Efectivo recibido */}
            <div>
              <label className="block text-sm font-poppinsBold text-gray-700 mb-3">
                Efectivo Recibido (C$)
              </label>
              <input
                type="number"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-lg text-center font-poppinsBold"
                onChange={(e) => handleMontoRecibido(e.target.value)}
              />
            </div>

            {/* Desglose de montos */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-gray-600 font-poppins text-lg">
                <span>Subtotal:</span>
                C${facturacionData.subtotal}
              </div>

              <div className="flex justify-between text-gray-600 font-poppins text-lg items-center">
                <span>Descuento:</span>
                <span>{facturacionData.descuento}</span>

                <input
                  type="number"
                  placeholder="Ingresa un porcentaje"
                  className="outline-none border border-gray-300 focus:border-blue-500 rounded px-3 py-2 "
                  onChange={(e) => handleDescuento(e.target.value)}
                />
              </div>

              <div className="flex justify-between text-green-600 font-poppinsBold text-xl border-t border-gray-200 pt-4">
                <span>Cambio:</span>
                <span>C${facturacionData.montoDevuelto}</span>
              </div>

              <div className="flex justify-between font-poppinsBold text-2xl border-t border-gray-200 pt-4">
                <span>Total a Pagar:</span>
                <span>{facturacionData.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones fijos en la parte inferior */}
      <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 flex items-center justify-center gap-3 font-poppinsBold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            onClick={() => limpiarCarrito()}
          >
            <ClearAll />
            Limpiar Carrito
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 flex items-center justify-center gap-3 text-xl font-poppinsBold shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={()=>handleSubmit()}
          >
            <Receipt className="text-2xl" />
            Finalizar Venta
          </motion.button>
        </div>
      </div>
    </div>
  );
}
