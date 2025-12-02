import {
  Inventory2,
  Category,
  LocalOffer,
  Edit,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";
import { useInventario } from "../hooks/useInventario";
import { useProductos } from "../../../../context/ProductosContext";

export function VistaTabla({
  mostrar_inactivos = false,
  vista_facturacion = false,
  setFacturacionData,
  handleEditarProducto,
  facturacionData,
  productosFiltrados
}) {
  const { productos } = useProductos();
  const {
    handleActivarProducto,
    handleEliminarProducto,
    obtenerNombreCategoria,
    getColorStock,
    formatearPrecio,
  } = useInventario();

  const agregarCarritoCompra = (producto) => {
    const respuesta = comprobarProductoCarrito(producto.id);
    if (respuesta) {
      return;
    }
    setFacturacionData((prev) => ({
      ...prev,
      productos: [...prev.productos, { ...producto, cantidad: 1 }],
    }));
  };

  const comprobarProductoCarrito = (idProducto) => {
    const existe = facturacionData.productos.find((p) => p.id == idProducto);
    return !!existe;
  };

  // Clases condicionales basadas en vista_facturacion
  const tableContainerClass = `overflow-x-auto rounded-2xl border border-slate-200/40 ${
    vista_facturacion ? 'max-h-[500px] overflow-y-auto text-sm' : 'text-base'
  }`;

  const headerClass = (baseClass) => `${baseClass} ${
    vista_facturacion ? 'p-3 text-xs' : 'p-6 text-sm'
  }`;

  const cellClass = (baseClass) => `${baseClass} ${
    vista_facturacion ? 'p-3' : 'p-6'
  }`;

  const iconContainerClass = `bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 ${
    vista_facturacion ? 'w-8 h-8 rounded-lg' : 'w-12 h-12 rounded-2xl'
  }`;

  const iconClass = `text-white ${vista_facturacion ? 'text-sm' : 'text-lg'}`;

  const productNameClass = `font-semibold text-slate-800 ${
    vista_facturacion ? 'text-sm' : 'text-lg'
  }`;

  const productCodeClass = `text-slate-500 mt-1 font-mono ${
    vista_facturacion ? 'text-xs' : 'text-sm'
  }`;

  return (
    <div className={tableContainerClass}>
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50/80 to-blue-50/50 border-b border-slate-200/40">
            <th className={headerClass("text-left font-semibold text-slate-700 uppercase tracking-wider")}>
              Producto
            </th>
            <th className={headerClass("text-left font-semibold text-slate-700 uppercase tracking-wider")}>
              Categoría
            </th>
            <th className={headerClass("text-left font-semibold text-slate-700 uppercase tracking-wider")}>
              Precio
            </th>
            <th className={headerClass("text-left font-semibold text-slate-700 uppercase tracking-wider")}>
              Stock
            </th>
            <th className={headerClass("text-left font-semibold text-slate-700 uppercase tracking-wider")}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr
              key={producto.id}
              className="border-b border-slate-200/40 hover:bg-blue-50/20 transition-colors duration-200 group"
            >
              <td className={cellClass("")}>
                <div className={`flex items-center ${vista_facturacion ? 'gap-2' : 'gap-4'}`}>
                  <div className={iconContainerClass}>
                    <Inventory2 className={iconClass} />
                  </div>
                  <div>
                    <div className={productNameClass}>
                      {producto.nombre}
                    </div>
                    <div className={productCodeClass}>
                      {producto.codigo_barras}
                    </div>
                    {producto.descripcion && !vista_facturacion && (
                      <div className="text-slate-600 text-sm mt-2 max-w-md line-clamp-2 font-light">
                        {producto.descripcion}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className={cellClass("")}>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 text-purple-700 border border-purple-200/60 backdrop-blur-sm ${
                  vista_facturacion ? 'text-xs' : 'text-sm font-medium'
                }`}>
                  <Category className="w-4 h-4" />
                  {obtenerNombreCategoria(producto.categoria_id)}
                </span>
              </td>
              <td className={cellClass("")}>
                <div className="flex items-center gap-2">
                  <LocalOffer className={`${vista_facturacion ? 'w-4 h-4' : 'w-5 h-5'} text-emerald-500`} />
                  <span className={`font-bold text-emerald-600 ${
                    vista_facturacion ? 'text-base' : 'text-lg'
                  }`}>
                    {formatearPrecio(producto.precio)}
                  </span>
                </div>
              </td>
              <td className={cellClass("")}>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full border backdrop-blur-sm ${getColorStock(
                    producto
                  )} ${vista_facturacion ? 'text-xs' : 'text-sm font-medium'}`}
                >
                  {producto.stock} unidades
                </span>
              </td>
              <td className={cellClass("")}>
                {vista_facturacion ? (
                  <button
                    onClick={() => agregarCarritoCompra(producto)}
                    className={`flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-800 rounded-xl transition-all duration-200 hover:scale-105 border border-blue-200/60 backdrop-blur-sm hover:border-blue-200/80 cursor-pointer ${
                      vista_facturacion ? 'px-3 py-2 text-sm' : 'p-3'
                    }`}
                    title="Agregar Carrito"
                  >
                    <Edit className={`${vista_facturacion ? 'w-4 h-4' : 'w-5 h-5'}`} />
                    <span>{vista_facturacion ? 'Agregar' : 'Agregar al Carrito'}</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditarProducto(producto)}
                      className={`text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-200 hover:scale-105 border border-blue-200/60 backdrop-blur-sm hover:border-blue-300 ${
                        vista_facturacion ? 'p-2' : 'p-3'
                      }`}
                      title="Editar producto"
                    >
                      <Edit className={`${vista_facturacion ? 'w-4 h-4' : 'w-5 h-5'}`} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}