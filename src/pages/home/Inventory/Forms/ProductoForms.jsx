import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Cancel,
  Inventory2,
  LocalOffer,
  Description,
  Category,
  Archive,
  Numbers,
  Search,
} from "@mui/icons-material";
import { searchCategorias } from "../../../../apis/categorias.api";
import CustomSelect from "../../../../components/utils/CustomSelect";
import { useProveedor } from "../../../../context/ProveedorContext";
import { useCategorias } from "../../../../context/CategoriasContext";

export function ProductoForm({ producto, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || "",
    descripcion: producto?.descripcion || "",
    precio: producto?.precio || "",
    costo: producto?.costo || "",
    stock: producto?.stock || "0",
    stock_minimo: producto?.stock_minimo || "0",
    stock_maximo: producto?.stock_maximo || "",
    codigo_barras: producto?.codigo_barras || "",
    categoria_id: producto?.categoria_id || "",
    proveedor_id: producto?.proveedor_id || "",
    ubicacion: producto?.ubicacion || "",
    activo: producto?.activo !== undefined ? producto.activo : true,
  });

  const { proveedores } = useProveedor();
  const { categorias } = useCategorias();

  function generarCodigoBarrasEAN13() {
    const base = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 10)
    );
    const suma = base.reduce(
      (acc, num, i) => acc + num * (i % 2 === 0 ? 1 : 3),
      0
    );
    const digitoVerificador = (10 - (suma % 10)) % 10;
    return [...base, digitoVerificador].join("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      alert("El nombre del producto es requerido");
      return;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    // Preparar datos para enviar
    const datosEnviar = {
      ...formData,
      precio: parseFloat(formData.precio),
      costo: parseFloat(formData.costo) || 0,
      stock: parseInt(formData.stock) || 0,
      stock_minimo: parseInt(formData.stock_minimo) || 0,
      stock_maximo: parseInt(formData.stock_maximo) || null,
      categoria_id: formData.categoria_id || null,
      proveedor_id: formData.proveedor_id || null,
      codigo_barras: producto?.codigo_barras || generarCodigoBarrasEAN13(), // no regenerar si ya existe
    };

    onSave(datosEnviar);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label>Nombre del Producto *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej: Cuaderno Universitario 100 hojas"
                />
              </div>

              {/* Precio */}
              <div>
                <label>Precio *</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="0.00"
                />
              </div>

              {/* Costo */}
              <div>
                <label>Costo</label>
                <input
                  type="number"
                  name="costo"
                  value={formData.costo}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded px-3 py-2"
                  placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label>Stock Inicial</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded px-3 py-2"
                  placeholder="0"
                />
              </div>

              {/* Stock mínimo */}
              <div>
                <label>Stock Mínimo</label>
                <input
                  type="number"
                  name="stock_minimo"
                  value={formData.stock_minimo}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Stock máximo */}
              <div>
                <label>Stock Máximo</label>
                <input
                  type="number"
                  name="stock_maximo"
                  value={formData.stock_maximo}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Categoría */}
              <div className="md:col-span-2">
                <label>Categoría</label>
                <CustomSelect
                  label="Categoría"
                  options={[
                    { value: "", label: "Seleccionar categoría" },
                    ...categorias
                      .filter((cat) => cat.activo) // <-- solo activas
                      .map((cat) => ({ value: cat.id, label: cat.nombre })),
                  ]}
                  value={formData.categoria_id || ""}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoria_id: value }))
                  }
                  width="100%"
                />
              </div>

              {/* Proveedor */}
              <div className="md:col-span-2">
                <label>Proveedor</label>
                <CustomSelect
                  label="Proveedor"
                  options={[
                    { value: "", label: "Seleccionar proveedor" },
                    ...proveedores.filter((p) => p.activo)
                    .map((p) => ({
                      value: p.id,
                      label: p.empresa,
                    }))
                  ]}
                  value={formData.proveedor_id || ""}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, proveedor_id: value }))
                  }
                  width="100%"
                />
              </div>

              {/* Ubicación */}
              <div className="md:col-span-2">
                <label>Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej: Estante A3"
                />
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Descripción detallada del producto..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-500 text-white rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded"
              >
                {producto ? "Actualizar" : "Guardar"} Producto
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
