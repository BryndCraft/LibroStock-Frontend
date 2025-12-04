import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, memo } from "react";


const ProductRow = memo(({ prod, index, onUpdate, onRemove }) => {
  const [localValues, setLocalValues] = useState({
    cantidad: prod.cantidad || "",
    costo_total: prod.costo_total || ""
  });

  const costoUnitarioVisual = (localValues.cantidad && localValues.costo_total)
    ? (Number(localValues.costo_total) / Number(localValues.cantidad))
    : 0;

  useEffect(() => {
    setLocalValues({
      cantidad: prod.cantidad || "",
      costo_total: prod.costo_total || ""
    });
  }, [prod.cantidad, prod.costo_total]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalValues(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    onUpdate(index, name, value === "" ? "" : Number(value));
  };

  return (
    <motion.tr
      className="bg-white hover:bg-gray-50 transition-colors border-b"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout 
    >
      <td className="p-3 text-gray-700 font-medium">{prod.producto_id}</td>
      <td className="p-3 text-gray-700">{prod.nombre}</td>
      <td className="p-3">
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={localValues.cantidad}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-2 border border-gray-300 rounded focus:outline-blue-400 focus:ring-1 focus:ring-blue-400"
          min="0"
          step="1"
        />
      </td>
      <td className="p-3">
        <input
          type="number"
          name="costo_total"
          placeholder="Costo Total"
          value={localValues.costo_total}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-2 border border-gray-300 rounded focus:outline-blue-400 focus:ring-1 focus:ring-blue-400"
          min="0"
          step="0.01"
        />
      </td>
      <td className="p-3 text-gray-700 font-medium">
        C${costoUnitarioVisual.toFixed(2)}
      </td>
      <td className="p-3 text-center">
        <button
          onClick={() => onRemove(index)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
        >
          Eliminar
        </button>
      </td>
    </motion.tr>
  );
});

// 2. COMPONENTE PRINCIPAL
export default function ModalProductosAgregados({
  formData,
  setFormData,
  setAbrirProductosAgregados,
}) {
  
  // Lógica de actualización del padre (Memoizada)
  const handleUpdateProduct = useCallback((index, field, value) => {
    setFormData((prevFormData) => {
      const updatedProductos = prevFormData.productos.map((producto, i) => {
        if (i === index) {
          const updatedProducto = { ...producto, [field]: value };
          
          // Recálculo de lógica de negocio
          if (updatedProducto.cantidad && updatedProducto.costo_total) {
            updatedProducto.costo_unitario = Number(
              (updatedProducto.costo_total / updatedProducto.cantidad).toFixed(2)
            );
          } else {
            updatedProducto.costo_unitario = 0;
          }
          return updatedProducto;
        }
        return producto;
      });

      const total = updatedProductos.reduce(
        (acc, producto) => acc + Number(producto.costo_total || 0),
        0
      );

      return {
        ...prevFormData,
        productos: updatedProductos,
        total: total,
      };
    });
  }, [setFormData]); // Dependencias mínimas

  const handleRemoveProduct = useCallback((index) => {
    setFormData((prevFormData) => {
      const updatedProductos = prevFormData.productos.filter((_, i) => i !== index);
      const total = updatedProductos.reduce(
        (acc, producto) => acc + Number(producto.costo_total || 0),
        0
      );

      if (updatedProductos.length === 0) {
        setAbrirProductosAgregados(false);
      }

      return {
        ...prevFormData,
        productos: updatedProductos,
        total: total,
      };
    });
  }, [setFormData, setAbrirProductosAgregados]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-start p-6 pt-12 backdrop-blur-sm bg-black/30 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[1000px] h-[80vh] overflow-y-auto p-6 flex flex-col"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Productos Agregados</h1>
            <button
              onClick={() => setAbrirProductosAgregados(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-700 text-white font-bold transition"
            >
              ×
            </button>
          </div>

          {/* Total */}
          <div className="flex justify-end items-center text-xl font-semibold text-gray-800 mb-4 gap-2">
            <span>Total:</span>
            <span className="text-blue-600">C${Number(formData.total || 0).toFixed(2)}</span>
          </div>

          {/* Tabla */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse shadow-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Costo Total</th>
                  <th className="p-3">Costo Unitario</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {formData.productos.map((prod, index) => (
                    <ProductRow
                      key={prod.producto_id}
                      index={index}
                      prod={prod}
                      onUpdate={handleUpdateProduct}
                      onRemove={handleRemoveProduct}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}