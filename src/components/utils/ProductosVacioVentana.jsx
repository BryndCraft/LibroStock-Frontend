// components/utils/EmptyState.jsx
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';

export function ProductoVacioVentana({ 
  onCrearProducto,
  icon = "📦",
  titulo = "No hay productos",
  descripcion = "No se encontraron productos para mostrar. Puedes crear uno nuevo haciendo clic en el botón de abajo.",
  textoBoton = "Crear Primer Producto"
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-12 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-slate-200"
        variants={itemVariants}
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          rotate: { duration: 0.5 }
        }}
      >
        <span className="text-4xl">{icon}</span>
      </motion.div>
      
      <motion.h3 
        className="text-xl font-semibold text-slate-700 mb-3 font-poppinsBold"
        variants={itemVariants}
      >
        {titulo}
      </motion.h3>
      
      <motion.p 
        className="text-slate-500 mb-8 max-w-md font-poppins leading-relaxed"
        variants={itemVariants}
      >
        {descripcion}
      </motion.p>
      
      <motion.button
        onClick={onCrearProducto}
        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-xl hover:shadow-2xl font-semibold text-base border border-blue-400/30 flex items-center gap-3 font-poppinsBold group"
        variants={itemVariants}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.5)",
          y: -2
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={{ rotate: [0, 180] }}
          transition={{ duration: 0.5 }}
        >
          <Add className="w-5 h-5" />
        </motion.span>
        {textoBoton}
      </motion.button>
    </motion.div>
  );
}