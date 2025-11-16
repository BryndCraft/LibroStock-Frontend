import { useState } from 'react';
import { Close } from '@mui/icons-material';
import VistaCards from './VistaCards';
import { ProductoForm } from '../Forms/ProductoForms';

export default function ModalProductos({
  productos = [],
  isOpen = false,
  onClose = () => { },
  onEditar = () => { },
  onEliminar = () => { },
  onCrear = () => { },
  formatearPrecio = (precio) => `$${precio?.toFixed(2) || '0.00'}`,
  getColorStock = (stock) => {
    if (stock === 0) return 'bg-red-100 text-red-800 border-red-200';
    if (stock < 5) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  },
  obtenerNombreCategoria = (categoriaId) => `Categoría ${categoriaId}`,
  titulo = "Gestión de Productos"
}) {

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formAbierto, setFormAbierto] = useState(false);


  if (!isOpen) return null;
  const handleCrearProducto = () => {
    setProductoSeleccionado(null);
    setFormAbierto(true);
  };

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setFormAbierto(true);
  };
  const handleCerrarForm = () => {
    setFormAbierto(false);
  };
  const handleEliminarProducto = (id) => {
    onEliminar(id);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{titulo}</h2>
            <p className="text-slate-600 mt-1">
              {productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">


            {/* Botón Cerrar */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 flex items-center justify-center transition-all duration-200"
            >
              <Close className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="flex-1 overflow-hidden">
          {productos.length > 0 ? (
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <VistaCards
                productos={productos}
                formatearPrecio={formatearPrecio}
                getColorStock={getColorStock}
                obtenerNombreCategoria={obtenerNombreCategoria}
                onEditar={handleEditarProducto}
                onEliminar={handleEliminarProducto}
              />
            </div>
          ) : (
            // ← Aquí estaba el error: se usaban llaves {} en lugar de paréntesis ()
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-slate-400">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No hay productos
              </h3>
              <p className="text-slate-500 mb-6 max-w-md">
                No se encontraron productos para mostrar. Puedes crear uno nuevo haciendo clic en el botón "Nuevo Producto".
              </p>
              <button
                onClick={handleCrearProducto}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm border border-blue-400/30 flex items-center gap-2"
              >
                <span>+</span>
                Crear Primer Producto
              </button>
            </div>
          )}
        </div>
      </div>

      {formAbierto && (
        <ProductoForm
          producto={productoSeleccionado}
          onSave={async (datos) => {
            if (productoSeleccionado) {
              await editarProducto(productoSeleccionado.id, datos);
            }
            setFormAbierto(false);
            cargarProductos();
          }}
          onCancel={handleCerrarForm}
        />
      )}
    </div>
  );
}
