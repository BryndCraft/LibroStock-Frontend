import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "../../../../components/utils/CustomSelect";
import { useProveedor } from "../../../../context/ProveedorContext";
import { useCategorias } from "../../../../context/CategoriasContext";
import { useInventario } from "../hooks/useInventario";

export function ProductoForm({ setMostrarProductoForm, productoEditando }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    stock_minimo: "",
    codigo_barras: "",
    categoria_id: "",
    proveedor_id: "",
    ubicacion: "",
    activo:
      productoEditando?.activo !== undefined ? productoEditando.activo : true,
    motivo: "",
    precio_compra: ""
  });
  const { handleGuardarProducto } = useInventario();
  const { proveedores } = useProveedor();
  const { categorias } = useCategorias();
  const [stockCambio, setStockCambio] = useState(false);

  // Actualizar formData cuando cambia el producto a editar
  useEffect(() => {
    if (productoEditando) {
      setFormData({
        nombre: productoEditando.nombre || "",
        descripcion: productoEditando.descripcion || "",
        precio: productoEditando.precio || "",
        stock: productoEditando.stock || "0",
        stock_minimo: productoEditando.stock_minimo || "0",
        codigo_barras: productoEditando.codigo_barras || "",
        categoria_id: productoEditando.categoria_id || "",
        proveedor_id: productoEditando.proveedor_id || "",
        ubicacion: productoEditando.ubicacion || "",
        activo:
          productoEditando.activo !== undefined
            ? productoEditando.activo
            : true,
        motivo: "", 
        precio_compra: productoEditando.precio_compra || ""
      });


    }
  }, [productoEditando]);

  useEffect(() => {
    if (!productoEditando) return;
    const cambio = parseInt(formData.stock) !== parseInt(productoEditando.stock);
    setStockCambio(cambio);
  }, [formData.stock, productoEditando])
  const handleSubmit = (e) => {
    e.preventDefault();
    // Preparar datos para enviar
    const datosEnviar = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock) || 0,
      stock_minimo: parseInt(formData.stock_minimo) || 0,
      categoria_id: formData.categoria_id || null,
      proveedor_id: formData.proveedor_id || null,
      codigo_barras:
        productoEditando?.codigo_barras || generarCodigoBarrasEAN13(),
      costo_promedio: parseFloat(0),
      descripcion_mov: formData.motivo, 
      precio_compra: parseFloat(formData.precio_compra)
    };

    handleGuardarProducto(
      datosEnviar,
      productoEditando,
      setMostrarProductoForm
    );
  };

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
              <div className="flex flex-col">
                <label>Precio *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">C$</span>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full border rounded px-8 py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Stock - Solo mostrar en creación, no en edición */}

              {productoEditando ? (
                <div>
                  <label>Stock</label>
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

              ) : (
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

              )}
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
              <div className="flex flex-col">
                <label>Precio de Compra</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">C$</span>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio_compra}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full border rounded px-8 py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>



              {/* Categoría */}
              <div className="md:col-span-2">
                <label>Categoría</label>
                <CustomSelect
                  label="Categoría"
                  options={[
                    { value: "", label: "Seleccionar categoría" },
                    ...categorias
                      .filter((cat) => cat.activo)
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
                    ...(productoEditando
                      ? proveedores.map((p) => ({
                        value: p.id,
                        label: p.empresa,
                      }))
                      : proveedores
                        .filter((p) => p.activo)
                        .map((p) => ({ value: p.id, label: p.empresa }))),
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
              {stockCambio && productoEditando && (
                <div className="md:col-span-2">
                  <label>Motivo del cambio de stock *</label>
                  <textarea
                    name="motivo"
                    value={formData.motivo} 
                    onChange={handleChange}
                    rows="3"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Describa el motivo del cambio de stock (ej: Ajuste por inventario físico, Devolución de cliente, etc.)"
                    required={stockCambio}
                  />
                </div>
              )}

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
                onClick={() => setMostrarProductoForm(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {productoEditando ? "Actualizar" : "Guardar"} Producto
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
