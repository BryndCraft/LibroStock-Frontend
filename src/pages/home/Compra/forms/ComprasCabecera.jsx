import { AnimatePresence, motion } from "framer-motion";
import CustomSelect from "../../../../components/utils/CustomSelect";
import { useProveedor } from "../../../../context/ProveedorContext";
import Swal from "sweetalert2";
export default function ComprasCabecera({
  setAbrirFormulario,
  formData,
  setFormData,
  setPaso,
}) {
  const { proveedores } = useProveedor();

  const handleSiguiente = () => {
    if (!formData.factura) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debes ingresar el número de factura",
      });
      return;
    } else if (!formData.metodo_pago) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debes ingresar un método de pago",
      });
      return;
    } else if (!formData.proveedor_id) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debes elegir un proveedor",
      });
      return;
    }

    setPaso(2);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="bg-white rounded-xl shadow-lg w-full max-h-[90vh] max-w-[80vw] overflow-y-auto p-4">
          <form className="p-6 space-y-4">
            <h1 className="font-bold text-3xl">Registrar Nueva Compra</h1>
            <h3 className="font-light text-2xl">
              Ingrese los datos de la factura y los productos adquiridos
            </h3>

            <div className="flex gap-10">
              {/* Precio */}
              <div>
                <label>Numero de factura</label>
                <input
                  type="text"
                  name="factura"
                  value={formData.factura}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      factura: e.target.value,
                    }))
                  }
                  min="0"
                  required
                  className="w-full border rounded  border-gray-500/70 px-3 py-2"
                  placeholder="0.00"
                />
              </div>

              {/* Costo */}

              {/* Stock Inicial */}
              <div>
                <label>Metodo de pago</label>
                <input
                  type="text"
                  name="metodo_pago"
                  value={formData.metodo_pago}
                  min="0"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metodo_pago: e.target.value,
                    }))
                  }
                  className="w-full border rounded  border-gray-500/70 px-3 py-2"
                  placeholder="Tarjeta, Efectivo"
                />
              </div>
            </div>

            <div>
              <label>Observaciones</label>
              <input
                type="text"
                name="observaciones"
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    observaciones: e.target.value,
                  }))
                }
                min="0"
                className="w-full rounded px-3 py-2 border-gray-400/70 border h-[100%]"
                placeholder="Escribe alguna Observacion (opcional)"
              />
            </div>
            <div className="flex w-full flex-col">
              {/* Proveedor */}
              <div className="md:col-span-2">
                <label>Proveedor *</label>
                <CustomSelect
                  label="Proveedor"
                  options={[
                    { value: "", label: "Seleccionar proveedor" },
                    ...proveedores.map((p) => ({
                      value: p.id,
                      label: p.empresa,
                    })),
                  ]}
                  value={formData.proveedor_id}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      proveedor_id: Number(value),
                      productos: [], 
                    }))
                  }
                  width="100%"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 ">
              <button
                type="button"
                className="px-6 py-3 bg-gray-500 text-white rounded"
                onClick={() => setAbrirFormulario(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded"
                onClick={handleSiguiente}
              >
                Siguiente
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
