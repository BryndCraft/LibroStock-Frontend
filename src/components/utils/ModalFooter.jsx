// components/utils/ModalFooter.jsx
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';

export function ModalFooter({ 
  cantidadProductos, 
  onCrearProducto 
}) {
  return (
    <motion.div 
      className="px-6 py-4 border-t border-slate-200/60 bg-slate-50/50 flex justify-between items-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-slate-500 text-sm font-poppins">
        Total: <span className="font-semibold text-slate-700">{cantidadProductos}</span> productos
      </p>
      <motion.button
        onClick={onCrearProducto}
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm border border-emerald-400/30 flex items-center gap-2 font-poppins"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Add className="w-4 h-4" />
        Agregar Producto
      </motion.button>
    </motion.div>
  );
}