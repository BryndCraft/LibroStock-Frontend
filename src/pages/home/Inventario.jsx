import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Search,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Visibility,
  Category,
  Inventory2,
  LocalOffer,
  Person,
  Description,
  Archive,
  PlaylistAdd,
} from "@mui/icons-material";

export default function Inventario() {
  return (
    <div className="h-screen w-full flex bg-gray-50">
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Gestión de Inventario
              </h1>
              <p className="text-gray-500">
                Administrar productos de la librería escolar
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-3 bg-green-600 text-white rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-green-700 flex items-center gap-2">
                <PlaylistAdd />
                Gestionar Categorías
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:cursor-pointer gap-2">
                <Add />
                Agregar Producto
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white border-b p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las categorías</option>
            </select>

            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos los proveedores</option>
            </select>

            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todo el stock</option>
              <option value="con-stock">Con stock</option>
              <option value="sin-stock">Sin stock</option>
              <option value="stock-bajo">Stock bajo</option>
            </select>

            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Limpiar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Productos</h2>
            </div>

            <div className="overflow-x-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
