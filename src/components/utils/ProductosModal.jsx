// components/utils/ModalProductos.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductoVacioVentana } from './ProductosVacioVentana';
import { ModalHeader } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import { ProductoFormModal } from './ProductoFormModal';

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

  // Animaciones
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-200/60 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header del Modal */}
            <ModalHeader
              titulo={titulo}
              cantidadProductos={productos.length}
              onClose={onClose}
              onCrearProducto={handleCrearProducto}
              mostrarBotonCrear={productos.length > 0}
            />

            {/* Contenido del Modal */}
            <div className="flex-1 overflow-hidden">
              {productos.length > 0 ? (
                <motion.div 
                  className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                 
                </motion.div>
              ) : (
                <ProductoVacioVentana
                  onCrearProducto={handleCrearProducto}
                  titulo="No hay productos"
                  descripcion="No se encontraron productos para mostrar. Puedes crear uno nuevo haciendo clic en el botón de abajo."
                  textoBoton="Crear Primer Producto"
                />
              )}
            </div>

            {/* Footer del Modal */}
            {productos.length > 0 && (
              <ModalFooter
                cantidadProductos={productos.length}
                onCrearProducto={handleCrearProducto}
              />
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Modal del Formulario */}
      <ProductoFormModal
        isOpen={formAbierto}
        producto={productoSeleccionado}
        onSave={handleCerrarForm}
        onCancel={handleCerrarForm}
        onEditar={onEditar}
        onCrear={onCrear}
      />
    </AnimatePresence>
  );
}