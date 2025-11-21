// components/utils/ProductoFormModal.jsx
import { ProductoForm } from '../Forms/ProductoForms';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductoFormModal({ 
  isOpen, 
  producto, 
  onSave, 
  onCancel,
  onEditar,
  onCrear
}) {
  const handleSave = async (datos) => {
    if (producto) {
      await onEditar(producto.id, datos);
    } else {
      await onCrear(datos);
    }
    onSave && onSave(datos);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <ProductoForm
              producto={producto}
              onSave={handleSave}
              onCancel={onCancel}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}