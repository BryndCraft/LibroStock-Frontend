import { useState, useEffect } from "react";
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Inventory2 />
                {producto ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              <p className="text-gray-500">
                {producto ? 'Modificar información del producto' : 'Complete la información del nuevo producto'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <div className="relative">
                <Inventory2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Cuaderno Universitario 100 hojas"
                />
              </div>
            </div>

            {/* Precio y Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <div className="relative">
                <LocalOffer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  C$
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Inicial
              </label>
              <div className="relative">
                <Numbers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>

              {/* Barra de búsqueda */}
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar categoría..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchText && (
                    <button
                      type="button"
                      onClick={() => setSearchText('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
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
                    <Category
                      sx={{
                        color: 'text.secondary',

                      }}
                    />
                  }
                />
              </div>
            </div>
            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <div className="relative">
                <Description className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Descripción detallada del producto..."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Cancel />
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Save />
              {producto ? 'Actualizar' : 'Guardar'} Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}