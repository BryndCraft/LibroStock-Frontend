import { useState } from "react";
import { Save, Cancel, Category, Description, Archive } from "@mui/icons-material";
import Swal from "sweetalert2";

export function CategoriaForm({ categoria, onSave, onCancel }) {
  
  const [formData, setFormData] = useState({
    nombre: categoria?.nombre || "",
    descripcion: categoria?.descripcion || "",
    activo: categoria?.activo !== undefined ? categoria.activo : true
  });


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      Swal.fire('Advertencia','El nombre de la categoría es requerido', 'warning');
      return;
    }

    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Category />
                {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <p className="text-gray-500">
                {categoria ? 'Modificar información de la categoría' : 'Complete la información de la nueva categoría'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Categoría *
              </label>
              <div className="relative">
                <Category className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Material Escolar, Libros, etc."
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <div className="relative">
                <Description className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Descripción de la categoría..."
                />
              </div>
            </div>

          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Cancel />
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Save />
              {categoria ? 'Actualizar' : 'Guardar'} Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}