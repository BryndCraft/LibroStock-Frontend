import { motion } from "framer-motion";
import CustomSelect from "../../../../components/utils/CustomSelect";
import { useProveedor } from "../../../../context/ProveedorContext";
import { useProductos } from "../../../../context/ProductosContext";
import { useState, useMemo, useCallback } from "react"; // Importar useMemo y useCallback
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
  // No necesitamos proveedores aquí si no se usa en el render
  const { productos } = useProductos();
  const { categorias } = useCategorias();
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroStock, setFiltroStock] = useState("");
  const [busqueda, setBusqueda] = useState(""); // Estado para el input de búsqueda
  const [abrirProductosAgregados, setAbrirProductosAgregados] = useState(false);
  const { obtenerNombreCategoria } = useInventario();

  // --- OPTIMIZACIÓN CRÍTICA: useMemo ---
  // Esto evita que el filtro corra cada vez que react renderiza por cualquier cosa
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      // Filtro base
      if (!p.estado || p.proveedor_id !== formData.proveedor_id) return false;
      
      // Filtro Categoría
      if (filtroCategoria && p.categoria_id.toString() !== filtroCategoria) return false;

      // Filtro Stock
      if (filtroStock === "sin-stock" && p.stock > 0) return false;
      if (filtroStock === "con-stock" && p.stock <= 0) return false;
      if (filtroStock === "stock-bajo" && p.stock > 10) return false; // Ejemplo de umbral

      // Filtro Búsqueda (Texto)
      if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;

      return true;
    });
  }, [productos, formData.proveedor_id, filtroCategoria, filtroStock, busqueda]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const comprasDatos = { ...formData };
    handleGuardarCompra(comprasDatos, setAbrirFormulario);
  };

  // Función auxiliar para agregar producto
  const handleAgregarProducto = useCallback((prod) => {
      const existe = formData.productos?.some((p) => p.producto_id === prod.id); // Ojo: verifica si usas 'id' o 'producto_id'
      
      if (existe) {
        Swal.fire({
          icon: "info",
          title: "Producto ya agregado",
          text: `${prod.nombre} ya está en la lista`,
          timer: 1500,
          showConfirmButton: false
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        productos: [
          ...(prev.productos || []),
          {
            producto_id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio, // Precio de venta (referencia)
            stock: prod.stock,
            cantidad: 1, // Inicializar en 1
            costo_total: 0 // Inicializar
          },
        ],
      }));

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'success',
        title: 'Agregado'
      });
  }, [formData.productos, setFormData]);

  return (
    <div>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center p-4 backdrop-blur-[1px] h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-white rounded-xl shadow-lg w-full h-[90vh] max-w-[80vw] overflow-y-auto p-4 flex flex-col"> 
          {/* Cambié motion.div por div normal en el contenedor interno para reducir carga de animación */}
          
          <form className="p-6 space-y-4 h-full flex flex-col" onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <button
                    className="hover:rounded-full hover:text-white rounded-full p-2 mb-2 hover:bg-gray-600/60 cursor-pointer flex items-center gap-2 transition-colors"
                    onClick={() => setPaso(1)}
                    type="button"
                    >
                    <ArrowBack />
                    <span className="font-poppins font-medium">Retroceder</span>
                    </button>
                    <h1 className="font-bold text-3xl">Selección de Productos</h1>
                </div>
              
                <button
                    className="bg-blue-600 rounded-xl px-4 py-2 text-white font-poppins hover:bg-blue-700 relative transition-colors shadow-md"
                    type="button"
                    onClick={() => {
                    formData.productos?.length === 0
                        ? Swal.fire({ title: "Lista vacía", text: "No has agregado productos", icon: "info" })
                        : setAbrirProductosAgregados(true);
                    }}
                >
                    <span>Ver carrito</span>
                    {formData.productos?.length > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm border border-white">
                        {formData.productos.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
                  <Search className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                <CustomSelect
                  label="Categorías"
                  options={[
                    { value: "", label: "Todas" },
                    ...categorias.map((cat) => ({
                      value: cat.id.toString(),
                      label: cat.nombre,
                    })),
                  ]}
                  value={filtroCategoria}
                  width="100%"
                  onChange={setFiltroCategoria}
                  required={false}
                />

                <CustomSelect
                  label="Stock"
                  options={[
                    { value: "", label: "Todos" },
                    { value: "con-stock", label: "Con stock" },
                    { value: "sin-stock", label: "Sin stock" },
                    { value: "stock-bajo", label: "Stock bajo" },
                  ]}
                  value={filtroStock}
                  onChange={setFiltroStock}
                  width="100%"
                  required={false}
                />
            </div>

            {/* Tabla */}
            <div className="flex-1 overflow-hidden border border-gray-200 rounded-xl shadow-inner bg-white flex flex-col">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="p-3 font-semibold text-sm uppercase">Producto</th>
                      <th className="p-3 font-semibold text-sm uppercase">Categoría</th>
                      <th className="p-3 font-semibold text-sm uppercase">Stock Actual</th>
                      <th className="p-3 font-semibold text-sm uppercase text-center">Acción</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {productosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-gray-400">
                           No se encontraron productos coincidentes.
                        </td>
                      </tr>
                    ) : (
                      productosFiltrados.map((prod) => (
                        <tr key={prod.id} className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="p-3 font-medium text-gray-800">{prod.nombre}</td>
                          <td className="p-3 text-gray-600 text-sm">
                            {obtenerNombreCategoria(prod.categoria_id)}
                          </td>
                          <td className="p-3">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${prod.stock <= 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {prod.stock}
                             </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleAgregarProducto(prod)}
                              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
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

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setAbrirFormulario(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md transition-all font-medium"
              >
                Finalizar Compra
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      
      {abrirProductosAgregados && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex justify-center items-center">
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