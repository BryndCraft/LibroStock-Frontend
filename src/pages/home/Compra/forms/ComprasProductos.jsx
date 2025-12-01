import { motion } from "framer-motion"; // Quita AnimatePresence de aquí
import CustomSelect from "../../../../components/utils/CustomSelect";
import { useProveedor } from "../../../../context/ProveedorContext";
import { useProductos } from "../../../../context/ProductosContext";
import { useState } from "react";
import { useCategorias } from "../../../../context/CategoriasContext";
import { Search, ArrowBack } from "@mui/icons-material";
import { useInventario } from "../../Inventory/hooks/useInventario";
import ModalProductosAgregados from "../components/ModalProductosAgregados";
import Swal from "sweetalert2";
import { useCompra } from "../hooks/useCompra";

export default function ComprasProductos({
  setAbrirFormulario,
  formData,
  setFormData,
  setPaso,
}) {
  const { handleGuardarCompra } = useCompra();
  const { proveedores } = useProveedor();
  const { productos } = useProductos();
  const { categorias } = useCategorias();
  const [filtroCategoria, setFiltroCategoria] = useState();
  const [filtroStock, setFiltroStock] = useState();
  const [abrirProductosAgregados, setAbrirProductosAgregados] = useState(false);
  const { obtenerNombreCategoria } = useInventario();

  const productosFiltrados = productos.filter(
    (p) => p.estado && p.proveedor_id === formData.proveedor_id
  );
  const handleSubmit = (e) => {
    e.preventDefault();

    const comprasDatos = {
      ...formData,
    };
    handleGuardarCompra(comprasDatos, setAbrirFormulario);
  };

  return (
    <div>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center p-4 backdrop-blur-[1px] h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="bg-white rounded-xl shadow-lg w-full h-[90vh] max-w-[80vw] overflow-y-auto p-4">
          <form className="p-6 space-y-4 h-full" onSubmit={handleSubmit}>
            <button
              className="hover:rounded-full hover:text-white rounded-full p-3 hover:bg-gray-600/60 cursor-pointer flex items-center gap-2"
              onClick={() => setPaso(1)}
            >
              <ArrowBack fontSize="large" />
              <span className="text-3xl font-poppins">Retroceder</span>
            </button>
            <h1 className="font-bold text-3xl">Registrar Nueva Compra</h1>
            <div className="flex justify-between">
              <h3 className="font-light text-2xl">
                Ingrese los datos de la factura y los productos adquiridos
              </h3>
              <button
                className="bg-blue-600 rounded-2xl px-4 py-3 text-white font-poppins cursor-pointer hover:bg-blue-900 relative"
                type="button"
                onClick={() => {
                  formData.productos?.length == 0
                    ? Swal.fire({
                        title: "Lo lamento",
                        text: "No hay productos Agregados",
                        icon: "info",
                        confirmButtonText: "Aceptar",
                      })
                    : setAbrirProductosAgregados(true);
                }}
              >
                <span>Ver productos Agregados</span>

                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {formData.productos?.length || 0}
                </div>
              </button>
            </div>

            <div className="overflow-y-auto w-full h-[100vh] border-gray-700/60 border rounded-2xl shadow-lg p-5 max-h-[55vh]">
              <div className="flex gap-5 items-center">
                <div className="bg-white/50 border border-slate-800/40 rounded-2xl p-3 shadow-sm flex items-center gap-3 w-[60%]">
                  <Search className="text-slate-400" />
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400"
                    placeholder="Realizar una Búsqueda por Nombre o Categoria"
                  />
                </div>

                <CustomSelect
                  label="Categorías"
                  options={[
                    { value: "", label: "Todas las categorías" },
                    ...categorias.map((cat) => ({
                      value: cat.id.toString(),
                      label: cat.nombre,
                    })),
                  ]}
                  value={filtroCategoria}
                  width={200}
                  onChange={setFiltroCategoria}
                  required={false}
                />

                <CustomSelect
                  label="Estado de stock"
                  options={[
                    { value: "con-stock", label: "Con stock" },
                    { value: "sin-stock", label: "Sin stock" },
                    { value: "stock-bajo", label: "Stock bajo" },
                  ]}
                  value={filtroStock}
                  onChange={setFiltroStock}
                  margin={0}
                  width={200}
                  required={false}
                />
              </div>

              <div className="mt-5 border border-gray-300 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3">Producto</th>
                      <th className="p-3">Categoría</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Precio Venta</th>
                      <th className="p-3 text-center">Acción</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {productosFiltrados.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-4 text-center text-gray-400"
                        >
                          No hay productos disponibles De este Proveedor
                        </td>
                      </tr>
                    ) : (
                      productosFiltrados.map((prod) => (
                        <tr key={prod.producto_id} className="hover:bg-gray-50">
                          <td className="p-3 font-medium">{prod.nombre}</td>
                          <td className="p-3">
                            {obtenerNombreCategoria(prod.categoria_id)}
                          </td>
                          <td className="p-3">{prod.stock}</td>
                          <td className="p-3">${prod.precio}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                const existe = formData.productos?.some(
                                  (p) => p.id === prod.id
                                );
                                if (existe) {
                                  Swal.fire({
                                    icon: "info",
                                    title: "Producto ya agregado",
                                    text: `${prod.nombre} ya está en la lista`,
                                  });
                                  return; // 🔴 Retornamos inmediatamente
                                }

                                // 2️⃣ Actualizar el estado
                                setFormData((prev) => ({
                                  ...prev,
                                  productos: [
                                    ...(prev.productos || []),
                                    {
                                      producto_id: prod.id,
                                      nombre: prod.nombre,
                                      precio: prod.precio,
                                      stock: prod.stock,
                                    },
                                  ],
                                }));

                                // 3️⃣ Mostrar alerta de éxito
                                Swal.fire({
                                  icon: "success",
                                  title: "Producto agregado",
                                  text: `${prod.nombre} se agregó correctamente`,
                                  timer: 1500,
                                  showConfirmButton: false,
                                });
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                              type="button"
                            >
                              Agregar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 cursor-pointer"
              >
                Guardar Compra
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
      {abrirProductosAgregados && (
        <div className="h-screen bg-black/50 w-full z-90 relative">
          <ModalProductosAgregados
            formData={formData}
            setFormData={setFormData}
            setAbrirProductosAgregados={setAbrirProductosAgregados}
          />
        </div>
      )}
    </div>
  );
}
