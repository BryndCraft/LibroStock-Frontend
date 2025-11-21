import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Cancel, Inventory2, LocalOffer, Description, Category, Archive, Numbers, Search } from "@mui/icons-material";
import { searchCategorias } from "../../apis/categorias.api";
import CustomSelect from "../utils/CustomSelect";

export function ProductoForm({ producto, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || "",
    descripcion: producto?.descripcion || "",
    precio: producto?.precio || "",
    stock: producto?.stock || "0",
    codigo_barras: producto?.codigo_barras || '',
    categoria_id: producto?.categoria_id || "",
    activo: producto?.activo !== undefined ? producto.activo : true
  });

  const [categorias, setCategorias] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async (query = "") => {
    try {
      const response = await searchCategorias(query, 1);
      setCategorias(response.data?.Categorias?.results || []);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  function generarCodigoBarrasEAN13() {
    const base = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    const suma = base.reduce((acc, num, i) => acc + num * (i % 2 === 0 ? 1 : 3), 0);
    const digitoVerificador = (10 - (suma % 10)) % 10;
    return [...base, digitoVerificador].join('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre del producto es requerido');
      return;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    // Preparar datos para enviar
    const datosEnviar = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock) || 0,
      categoria_id: formData.categoria_id || null,
      codigo_barras: generarCodigoBarrasEAN13(),
    };

    onSave(datosEnviar);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Animaciones
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: -50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.3 }
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4
      }
    })
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    hover: { rotate: 360, transition: { duration: 0.5 } }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <motion.div 
            className="bg-white border-b p-6 rounded-t-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <motion.h2 
                  className="text-xl font-bold text-gray-800 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.span
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <Inventory2 />
                  </motion.span>
                  {producto ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </motion.h2>
                <motion.p 
                  className="text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {producto ? 'Modificar información del producto' : 'Complete la información del nuevo producto'}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <motion.div 
                className="md:col-span-2"
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <div className="relative">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Inventory2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </motion.span>
                  <motion.input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Cuaderno Universitario 100 hojas"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                    }}
                  />
                </div>
              </motion.div>

              {/* Precio y Stock */}
              <motion.div
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <LocalOffer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </motion.span>
                  <motion.input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="0.00"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                    }}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    C$
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Inicial
                </label>
                <div className="relative">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Numbers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </motion.span>
                  <motion.input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                    }}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="md:col-span-2"
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>

                {/* Barra de búsqueda */}
                <div className="mb-3">
                  <div className="relative">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </motion.span>
                    <motion.input
                      type="text"
                      placeholder="Buscar categoría..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      whileFocus={{ 
                        scale: 1.02,
                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                      }}
                    />
                    <AnimatePresence>
                      {searchText && (
                        <motion.button
                          type="button"
                          onClick={() => setSearchText('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          ✕
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Select de categorías */}
                <div className="relative">
                  <CustomSelect
                    label="Categoría"
                    options={[
                      { value: '', label: 'Seleccionar categoría' },
                      ...categorias
                        .filter(cat =>
                          cat?.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
                          searchText === ''
                        )
                        .map(cat => ({
                          value: cat.id,
                          label: cat.nombre
                        }))
                    ]}
                    value={formData.categoria_id || ''}
                    onChange={(selectedValue) => {
                      handleChange({
                        target: {
                          name: 'categoria_id',
                          value: selectedValue
                        }
                      });
                    }}
                    width="100%"
                    margin={0}
                    required={true}
                    startAdornment={
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Category sx={{ color: 'text.secondary' }} />
                      </motion.span>
                    }
                  />
                </div>
              </motion.div>

              {/* Descripción */}
              <motion.div 
                className="md:col-span-2"
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <div className="relative">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Description className="absolute left-3 top-3 text-gray-400" />
                  </motion.span>
                  <motion.textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Descripción detallada del producto..."
                    whileFocus={{ 
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Botones */}
            <motion.div 
              className="flex justify-end gap-3 pt-4 border-t"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center gap-2"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <motion.span
                  whileHover={{ rotate: -90 }}
                  transition={{ duration: 0.3 }}
                >
                  <Cancel />
                </motion.span>
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <motion.span
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Save />
                </motion.span>
                {producto ? 'Actualizar' : 'Guardar'} Producto
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}