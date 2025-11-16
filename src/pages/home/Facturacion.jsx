 import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/utils/Sidebar";
import {
  Search,
  Add,
  Remove,
  Delete,
  Receipt,
  Save,
  ClearAll,
  QrCodeScanner,
  Close,
  Person,
  AttachMoney,
} from "@mui/icons-material";

// Datos de ejemplo para productos
const productosEjemplo = [
  {
    id: 1,
    codigo: "LIB001",
    nombre: "Matemáticas 5° Grado",
    precio: 150,
    stock: 10,
    categoria: "Libros"
  },
  {
    id: 2,
    codigo: "CUAD001",
    nombre: "Cuaderno Cuadriculado",
    precio: 45,
    stock: 25,
    categoria: "Cuadernos"
  },
  {
    id: 3,
    codigo: "LAP001",
    nombre: "Lápiz HB Paquete x12",
    precio: 60,
    stock: 50,
    categoria: "Escritura"
  },
  {
    id: 4,
    codigo: "CAL001",
    nombre: "Calculadora Científica",
    precio: 320,
    stock: 8,
    categoria: "Calculadoras"
  },
  {
    id: 5,
    codigo: "MOCH001",
    nombre: "Mochila Escolar",
    precio: 480,
    stock: 15,
    categoria: "Mochilas"
  }
];

export default function Facturacion() {
  const [productos, setProductos] = useState(productosEjemplo);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cliente, setCliente] = useState("");
  const [metodoPago] = useState("efectivo");
  const [efectivoRecibido, setEfectivoRecibido] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const searchRef = useRef(null);

  // Filtrar productos según búsqueda
  useEffect(() => {
    if (busqueda.trim() === "") {
      setProductosFiltrados([]);
      setMostrarResultados(false);
      return;
    }

    const filtrados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    setProductosFiltrados(filtrados);
    setMostrarResultados(true);
  }, [busqueda, productos]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Simular escaneo de código de barras
  const simularEscaner = () => {
    const productosDisponibles = productos.filter(p => !carrito.some(item => item.id === p.id));
    if (productosDisponibles.length > 0) {
      const productoRandom = productosDisponibles[Math.floor(Math.random() * productosDisponibles.length)];
      agregarAlCarrito(productoRandom);
      setBusqueda("");
    }
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const existeEnCarrito = carrito.find(item => item.id === producto.id);

    if (existeEnCarrito) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    setMostrarResultados(false);
    setBusqueda("");
  };

  // Incrementar cantidad
  const incrementarCantidad = (id) => {
    setCarrito(carrito.map(item =>
      item.id === id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    ));
  };

  // Decrementar cantidad
  const decrementarCantidad = (id) => {
    setCarrito(carrito.map(item =>
      item.id === id && item.cantidad > 1
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    ));
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  // Limpiar carrito
  const limpiarCarrito = () => {
    setCarrito([]);
    setCliente("");
    setEfectivoRecibido("");
  };

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Calcular cambio
  const calcularCambio = () => {
    const total = calcularTotal();
    const recibido = parseFloat(efectivoRecibido) || 0;
    return recibido - total;
  };

  // Finalizar venta
  const finalizarVenta = () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (!cliente.trim()) {
      alert("Por favor ingrese el nombre del cliente");
      return;
    }

    const total = calcularTotal();
    const cambio = calcularCambio();

    if (cambio < 0) {
      alert("El efectivo recibido es insuficiente");
      return;
    }

    // Aquí iría la lógica para guardar la venta en la base de datos
    Swal.fire("Venta realizada exitosamente!", `Total: C$${total}\nCambio: C$${cambio}`, "sucess");
    limpiarCarrito();
  };

  const total = calcularTotal();
  const cambio = calcularCambio();  
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header compacto */}
        <header className="bg-white/80 px-6 py-4 border-b border-gray-200/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Facturación
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Buscar productos por nombre o código de barras
              </p>
            </div>

            {/* Información del cliente */}
            <div className="w-80 bg-white rounded-lg p-3 shadow-sm border border-gray-200/50">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                <Person className="text-blue-600 text-lg" />
                Información del Cliente
              </h3>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nombre del estudiante o acudiente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Panel principal - más compacto */}
          <div className="flex-1 flex flex-col">
            {/* Barra de búsqueda - menos padding */}
            <div className="p-4 bg-white/80 border-b border-gray-200/50">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3" ref={searchRef}>
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      onFocus={() => busqueda && setMostrarResultados(true)}
                      placeholder="Buscar producto por nombre, código de barras o categoría..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white/80"
                    />

                    {/* Resultados de búsqueda */}
                    {mostrarResultados && productosFiltrados.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 z-10 max-h-80 overflow-y-auto">
                        {productosFiltrados.map(producto => (
                          <div
                            key={producto.id}
                            onClick={() => agregarAlCarrito(producto)}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{producto.nombre}</h3>
                                <p className="text-gray-600 text-xs">Código: {producto.codigo} | Categoría: {producto.categoria}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600 text-sm">C${producto.precio}</p>
                                <p className="text-gray-500 text-xs">Stock: {producto.stock}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={simularEscaner}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <QrCodeScanner />
                    Escanear
                  </button>
                </div>
              </div>
            </div>

            {/* Carrito de venta - menos padding */}
            <div className="flex-1 p-4 bg-gray-50/80 overflow-auto">
              <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50">
                <div className="p-4 border-b border-gray-200/50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                      Carrito de Venta
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold text-sm">
                        {carrito.length} productos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {carrito.length === 0 ? (
                    <div className="text-center py-12">
                      <Receipt className="text-gray-400 text-6xl mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Carrito vacío</h3>
                      <p className="text-gray-500">Agrega productos escaneando o buscando</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {carrito.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200/50 shadow-sm">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{item.nombre}</h3>
                            <p className="text-gray-600">Código: {item.codigo}</p>
                            <p className="text-green-600 font-bold">C${item.precio} c/u</p>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Contador de cantidad */}
                            <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => decrementarCantidad(item.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <Remove className="text-gray-600" />
                              </button>
                              <span className="font-bold text-gray-800 min-w-8 text-center">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => incrementarCantidad(item.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <Add className="text-gray-600" />
                              </button>
                            </div>

                            <div className="text-right min-w-24">
                              <p className="font-bold text-gray-900 text-lg">
                                C${item.precio * item.cantidad}
                              </p>
                            </div>

                            <button
                              onClick={() => eliminarDelCarrito(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Delete />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informacion del Cliente */}
          <div className="w-87 bg-white/80 border-l border-gray-200/50 flex flex-col">
            <div className="p-4 space-y-4 flex-1">
              <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                <AttachMoney />
                Resumen de Pago
              </h3>

              {/* Método de pago (solo efectivo) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-600">
                  Efectivo
                </div>
              </div>

              {/* Efectivo recibido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Efectivo Recibido (C$)
                </label>
                <input
                  type="number"
                  value={efectivoRecibido}
                  onChange={(e) => setEfectivoRecibido(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Resumen de montos */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>C${total}</span>
                </div>

                {efectivoRecibido && (
                  <>
                    <div className="flex justify-between text-gray-600">
                      <span>Efectivo:</span>
                      <span>C${parseFloat(efectivoRecibido) || 0}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-semibold border-t border-gray-200 pt-2">
                      <span>Cambio:</span>
                      <span>C${cambio >= 0 ? cambio : 0}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3">
                  <span>Total a Pagar:</span>
                  <span className="text-green-600">C${total}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3 pt-6">
                <button
                  onClick={limpiarCarrito}
                  disabled={carrito.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <ClearAll />
                  Limpiar Carrito
                </button>
                <button
                  onClick={finalizarVenta}
                  disabled={carrito.length === 0 || !cliente.trim()}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Save />
                  Finalizar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

