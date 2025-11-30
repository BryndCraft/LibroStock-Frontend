import { useEffect, useState } from "react";
import {
  Save,
  Cancel,
  Business,
  Person,
  Phone,
  Email,
  LocationOn,
  AssignmentInd,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useProveedor } from "../../../../context/ProveedorContext";
export function ProveedorForm({ proveedorEditando, setModalFormProveedor }) {
  const { agregarProveedor, editarProveedor } = useProveedor();

  const [formData, setFormData] = useState({
    empresa: "",
    nombre_contacto: "",
    telefono: "",
    correo: "",
    ruc: "",
    direccion: "",
    activo:
      proveedorEditando?.activo !== undefined ? proveedorEditando.activo : true,
  });

  useEffect(() => {
    setFormData((prev) => {
      if (proveedorEditando) {
        return {
          ...prev,
          empresa: proveedorEditando?.empresa || "",
          nombre_contacto: proveedorEditando?.nombre_contacto || "",
          telefono: proveedorEditando?.telefono || "",
          correo: proveedorEditando?.correo || "",
          ruc: proveedorEditando?.ruc || "",
          direccion: proveedorEditando?.direccion || "",
          activo: proveedorEditando?.activo,
        };
      } else {
        return {
          ...prev,
        };
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Preparar datos para enviar
    const datosEnviar = {
      ...formData,
    };

    if (proveedorEditando) {
      console.log(datosEnviar);
      console.log(proveedorEditando.id)
      editarProveedor(proveedorEditando.id, datosEnviar);
    } else {
      agregarProveedor(datosEnviar);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Business />
                {proveedorEditando
                  ? "Editar Proveedor"
                  : "Agregar Nuevo Proveedor"}
              </h2>
              <p className="text-gray-500">
                {proveedorEditando
                  ? "Modificar información del proveedor"
                  : "Complete la información del nuevo proveedor"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Empresa */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <div className="relative">
                <Business className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Distribuidora Comercial S.A."
                />
              </div>
            </div>

            {/* Nombre Contacto y Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Contacto
              </label>
              <div className="relative">
                <Person className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="nombre_contacto"
                  onChange={handleChange}
                  value={formData.nombre_contacto}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 8888-8888"
                />
              </div>
            </div>

            {/* Correo y RUC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Email className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: contacto@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RUC
              </label>
              <div className="relative">
                <AssignmentInd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="ruc"
                  value={formData.ruc}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 1234567890123"
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <div className="relative">
                <LocationOn className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="direccion"
                  rows="3"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Dirección completa de la empresa..."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setModalFormProveedor(false)}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Cancel />
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Save />
              {proveedorEditando ? "Actualizar" : "Guardar"} Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
