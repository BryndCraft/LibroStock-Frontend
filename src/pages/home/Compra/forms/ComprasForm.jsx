import { AnimatePresence, motion } from "framer-motion";
import CustomSelect from "../../../../components/utils/CustomSelect";
import { useProveedor } from "../../../../context/ProveedorContext";
import { useState } from "react";

export default function ComprasForm() {
  const { proveedores } = useProveedor();

  // 1. Estado del formulario
  const [formData, setFormData] = useState({
    proveedor_id: "", // id del proveedor seleccionado
    precio: "",       // precio total de la compra
    costo: "",        // costo
    stock: "0",       // stock inicial
    stock_minimo: "0",
    stock_maximo: "",
    // aquí podrías agregar otros campos como fecha, número de factura, productos seleccionados, etc.
  });

  // 2. Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  // 3. Función para submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos de la compra:", formData);
    // aquí podrías llamar a tu función de agregarCompra() desde un contexto o API
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h1 className="font-bold text-3xl">Registrar Nueva Compra</h1>
            <h3 className="font-light text-2xl">
              Ingrese los datos de la factura y los productos adquiridos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Proveedor */}
              <div className="md:col-span-2">
                <label>Proveedor *</label>
                <CustomSelect
                  label="Proveedor"
                  options={[
                    { value: "", label: "Seleccionar proveedor" },
                    ...proveedores.map(p => ({ value: p.id, label: p.empresa }))
                  ]}
                  value={formData.proveedor_id}
                  onChange={(value) =>
                    setFormData(prev => ({ ...prev, proveedor_id: value }))
                  }
                  width="100%"
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

              {/* Stock Inicial */}
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
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                className="px-6 py-3 bg-gray-500 text-white rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded"
              >
                Guardar Compra
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
