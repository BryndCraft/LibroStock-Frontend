// components/utils/ModalHeader.jsx
import { Close, Add, Inventory } from '@mui/icons-material';
import { motion } from 'framer-motion';

export function ModalHeader({ 
  titulo, 
  cantidadProductos, 
  onClose, 
  onCrearProducto,
  mostrarBotonCrear = true 
}) {
  return (
    <motion.div 
      className="flex items-center justify-between p-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Inventory className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-poppinsBold">
            {titulo}
          </h2>
          <motion.p 
            className="text-slate-600 mt-1 font-poppins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {cantidadProductos} producto{cantidadProductos !== 1 ? 's' : ''} encontrado{cantidadProductos !== 1 ? 's' : ''}
          </motion.p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Botón Nuevo Producto */}
        {mostrarBotonCrear && (
          <motion.button
            onClick={onCrearProducto}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm border border-blue-400/30 flex items-center gap-2 font-poppinsBold"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Add className="w-4 h-4" />
            Nuevo Producto
          </motion.button>
        )}

        {/* Botón Cerrar */}
        <motion.button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 flex items-center justify-center transition-all duration-200 border border-slate-200"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <Close className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}