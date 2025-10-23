import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Search,
  Add,
  Remove,
  Delete,
  Receipt,
  Save,
  ClearAll,
  QrCodeScanner,
} from "@mui/icons-material";

export default function Facturacion() {
  return (
    <div className="h-screen w-full flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Sistema de Facturación
              </h1>
              <p className="text-gray-500">
                Buscar productos por nombre o código de barras
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="p-6 bg-white border-b">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Buscar producto por nombre, código de barras o categoría..."
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
                    />
                  </div>

                  <button className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-3 text-lg font-semibold">
                    <QrCodeScanner className="text-2xl" />
                    Escanear
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-3 ml-2">
                  Escribe el nombre del producto o usa el escáner. Ej:
                  "Matemáticas", "Lápiz", "9781234567890"
                </p>
              </div>
            </div>

            <div className="flex-1 p-6 bg-gray-50">
              <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Carrito de Venta
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold"></span>
                    </div>
                  </div>
                </div>

                <div className="p-6"></div>
              </div>
            </div>
          </div>

          <div className="w-80 bg-white border-l">
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                Información del Cliente
              </h3>
              <input
                type="text"
                placeholder="Nombre del estudiante o acudiente"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg">
                Resumen de Pago
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span></span>
                </div>

                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>Total:</span>
                  <span className="text-green-600"></span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <ClearAll />
                  Limpiar Carrito
                </button>
                <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold">
                  <Save />
                  Finalizar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
