import { AnimatePresence, motion } from "framer-motion";
import CustomSelect from "../../../../components/utils/CustomSelect";
import { useProveedor } from "../../../../context/ProveedorContext";
import Swal from "sweetalert2";
import { useMemo, useCallback, useState, useEffect } from "react"; 

export default function ComprasCabecera({
  setAbrirFormulario,
  formData,
  setFormData,
  setPaso,
}) {
  const { proveedores } = useProveedor();

  // 1. ESTADO LOCAL: Para escritura rápida sin lag
  // Inicializamos con los valores que vengan de formData
  const [localState, setLocalState] = useState({
    factura: formData.factura || "",
    metodo_pago: formData.metodo_pago || "",
    observaciones: formData.observaciones || ""
  });

  // Sincronizar si formData cambia externamente (ej. si vuelves del paso 2 al 1)
  useEffect(() => {
    setLocalState({
      factura: formData.factura || "",
      metodo_pago: formData.metodo_pago || "",
      observaciones: formData.observaciones || ""
    });
  }, [formData.factura, formData.metodo_pago, formData.observaciones]);

  // 2. HANDLER LOCAL: Solo actualiza el estado visual del input (rápido)
  const handleLocalChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalState((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 3. HANDLER ONBLUR: Actualiza el estado global cuando sales del input
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, [setFormData]);

  // 4. VALIDACIÓN Y SIGUIENTE
  const handleSiguiente = useCallback(() => {
    // Aseguramos que usamos los valores más recientes del estado local para validar
    const { factura, metodo_pago } = localState;

    if (!factura) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debes ingresar el número de factura",
      });
      return;
    } else if (!metodo_pago) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debes ingresar un método de pago",
      });
      return;
    } else if (!formData.proveedor_id) { // El proveedor sí usa formData directo porque es un Select
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debes elegir un proveedor",
      });
      return;
    }

    // Sincronización final de seguridad antes de pasar
    setFormData(prev => ({
        ...prev,
        factura: localState.factura,
        metodo_pago: localState.metodo_pago,
        observaciones: localState.observaciones
    }));

    setPaso(2);
  }, [localState, formData.proveedor_id, setPaso, setFormData]);

  const handleCancelar = useCallback(() => {
    setAbrirFormulario(false);
  }, [setAbrirFormulario]);

  const handleProveedorChange = useCallback((value) => {
    setFormData((prev) => ({ 
      ...prev, 
      proveedor_id: Number(value), 
      productos: [] 
    }));
  }, [setFormData]);

  // Opciones y Variantes (Sin cambios, tu código ya estaba bien aquí)
  const proveedorOptions = useMemo(() => {
    const baseOptions = [{ value: "", label: "Seleccionar proveedor" }];
    if (!proveedores || proveedores.length === 0) return baseOptions;
    const mappedOptions = proveedores.map((p) => ({
      value: p.id,
      label: p.empresa || `Proveedor ${p.id}`
    }));
    return [...baseOptions, ...mappedOptions];
  }, [proveedores]);

  const modalOverlayVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }), []);

  const modalContentVariants = useMemo(() => ({
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
    exit: { y: 50, opacity: 0 }
  }), []);

  const titleVariants = useMemo(() => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { delay: 0.1 } }
  }), []);

  const formGroupVariants = (delay) => useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay } }
  }), [delay]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
        variants={modalOverlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] max-w-[600px] overflow-y-auto p-6"
          variants={modalContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <form className="space-y-6">
            <motion.div className="space-y-1" variants={titleVariants} initial="initial" animate="animate">
              <h1 className="text-3xl font-bold text-gray-800">Registrar Nueva Compra</h1>
              <p className="text-gray-600 text-sm md:text-base">Ingresa los datos de la factura y los productos adquiridos</p>
            </motion.div>

            <motion.div className="flex flex-col md:flex-row gap-4" variants={formGroupVariants(0.2)} initial="initial" animate="animate">
              <div className="flex-1 flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Número de factura *</label>
                <input
                  type="text"
                  name="factura"
                  // Usamos localState aquí
                  value={localState.factura} 
                  onChange={handleLocalChange}
                  onBlur={handleBlur} // Actualiza el global al salir
                  className="px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="0000"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Método de pago *</label>
                <input
                  type="text"
                  name="metodo_pago"
                  // Usamos localState aquí
                  value={localState.metodo_pago}
                  onChange={handleLocalChange}
                  onBlur={handleBlur} // Actualiza el global al salir
                  className="px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Tarjeta, Efectivo"
                />
              </div>
            </motion.div>

            <motion.div className="flex flex-col" variants={formGroupVariants(0.3)} initial="initial" animate="animate">
              <label className="text-gray-700 font-medium mb-1">Observaciones</label>
              <input
                type="text"
                name="observaciones"
                // Usamos localState aquí
                value={localState.observaciones}
                onChange={handleLocalChange}
                onBlur={handleBlur} // Actualiza el global al salir
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Escribe alguna observación (opcional)"
              />
            </motion.div>

            <motion.div className="flex flex-col" variants={formGroupVariants(0.4)} initial="initial" animate="animate">
              <label className="text-gray-700 font-medium mb-1">Proveedor *</label>
              {/* El select se mantiene igual porque su actualización no es tan frecuente como escribir texto */}
              <CustomSelect
                label="Proveedor"
                options={proveedorOptions}
                value={formData.proveedor_id}
                onChange={handleProveedorChange}
                width="100%"
              />
            </motion.div>

            <motion.div className="flex justify-end gap-3 mt-4" variants={formGroupVariants(0.5)} initial="initial" animate="animate">
              <button
                type="button"
                className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow-sm transition"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
                onClick={handleSiguiente}
              >
                Siguiente
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}