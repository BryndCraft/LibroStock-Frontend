import { AnimatePresence, motion } from "framer-motion";

export default function ModalProductosAgregados({
  formData,
  setFormData,
  setAbrirProductosAgregados,
}) {
  //Funcion que cambia el campo de un producto en especifico y luego suma el costo de todos los productos para un coste total
  const handleInputChange = (index, field, value) => {
    const updatedProductos = formData.productos.map((producto, i) => {
      if (i === index) {
        const updatedProducto = {
          ...producto,
          [field]: value,
        };

        // Calculamos costo_unitario si hay cantidad y costo_total válidos
        if (updatedProducto.cantidad && updatedProducto.costo_total) {
          updatedProducto.costo_unitario = Number(
            (updatedProducto.costo_total / updatedProducto.cantidad).toFixed(4)
          );
        } else {
          updatedProducto.costo_unitario = 0;
        }

        return updatedProducto;
      }
      return producto;
    });

    // Recalculamos el total de todos los productos
    const total = updatedProductos.reduce(
      (acc, producto) => acc + Number(producto.costo_total || 0),
      0
    );

    setFormData({
      ...formData,
      productos: updatedProductos,
      total: total,
    });
  };

  //Funcion que crea una nueva lista excluyendo el elemento seleccionado y recalcula el costo Total
  const handleRemoveProduct = (index) => {
    const updatedProductos = formData.productos.filter(
      (producto, i) => i !== index
    );

    const total = updatedProductos.reduce(
      (acc, producto) => acc + Number(producto.costo_total || 0),
      0
    );

    setFormData({
      ...formData,
      productos: updatedProductos,
      total: total,
    });

    if (updatedProductos.length === 0) {
      setAbrirProductosAgregados(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center p-4 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="bg-white rounded-xl shadow-lg w-full max-h-[90vh] max-w-[80vw] overflow-y-auto p-4">
          <div className="flex">
            <div className="flex w-full justify-center">
              <h1 className="font-bold text-3xl">Productos Agregados</h1>
            </div>
            <button
              className="w-12 h-12 rounded-full bg-red-400  hover:bg-red-800 text-center text-white font-poppinsBold flex items-center justify-center cursor-pointer"
              onClick={() => setAbrirProductosAgregados(false)}
            >
              X
            </button>
          </div>
          <div className="mt-10 flex w-full justify-end  text-2xl font-poppinsBold gap-3">
            <span>Total:</span>
            <span>C${formData.total}</span>
          </div>
          <div className="w-full h-full mt-10">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">Id</th>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Costo Total</th>
                  <th className="p-3">Costo Unitario</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {formData.productos.map((prod, index) => (
                  <tr
                    key={`${prod.producto_id}-${index}`}
                    className="bg-gray-100 text-gray-700 font-poppinsBold"
                  >
                    <td className="p-3">{prod.producto_id}</td>
                    <td className="p-3">{prod.nombre}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        placeholder="Cantidad"
                        value={prod.cantidad || ""}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "cantidad",
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded focus:outline-blue-400"
                        min="0"
                        step="1"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        placeholder="Costo Total"
                        value={prod.costo_total || ""}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "costo_total",
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded focus:outline-blue-400"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3">
                      ${Number(prod.costo_unitario || 0).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
