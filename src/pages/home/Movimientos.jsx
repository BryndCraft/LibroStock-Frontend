import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import Sidebar from '../../components/utils/Sidebar';
import { 
  Inventory2, 
  Category, 
  LocalOffer, 
  Edit, 
  TrendingUp, 
  TrendingDown,
  SwapHoriz,
  CalendarToday,
  Person,
  Description
} from '@mui/icons-material';

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener el color según el tipo de movimiento
  const getColorTipo = (tipo) => {
    switch (tipo) {
      case 'ENTRADA':
        return 'bg-green-50/80 text-green-700 border-green-200/60';
      case 'SALIDA':
        return 'bg-red-50/80 text-red-700 border-red-200/60';
      case 'AJUSTE':
        return 'bg-blue-50/80 text-blue-700 border-blue-200/60';
      default:
        return 'bg-gray-50/80 text-gray-700 border-gray-200/60';
    }
  };

  // Función para obtener el icono según el tipo de movimiento
  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case 'ENTRADA':
        return <TrendingUp className="w-4 h-4" />;
      case 'SALIDA':
        return <TrendingDown className="w-4 h-4" />;
      case 'AJUSTE':
        return <SwapHoriz className="w-4 h-4" />;
      default:
        return <Inventory2 className="w-4 h-4" />;
    }
  };

  // Función para formatear la referencia
  const formatearReferencia = (movimiento) => {
    if (movimiento.referencia_tipo === 'FACTURA' && movimiento.referencia_id) {
      return `Factura #${movimiento.referencia_id}`;
    } else if (movimiento.referencia_tipo === 'COMPRA' && movimiento.referencia_id) {
      return `Compra #${movimiento.referencia_id}`;
    }
    return 'N/A';
  };

  // Filtrar movimientos por tipo
  const movimientosFiltrados = filtroTipo === 'TODOS' 
    ? movimientos 
    : movimientos.filter(mov => mov.tipo === filtroTipo);

  // Simular carga de datos (reemplaza con tu API real)
  useEffect(() => {
    const cargarMovimientos = async () => {
      try {
        setCargando(true);
        // Aquí iría tu llamada a la API
        // const response = await fetch('/api/movimientos-inventario');
        // const data = await response.json();
        // setMovimientos(data);
        
        // Datos de ejemplo
        setTimeout(() => {
          setMovimientos([
            {
              id: 1,
              producto: "Lápices HB",
              tipo: "ENTRADA",
              cantidad: 100,
              fecha: new Date().toISOString(),
              referencia_id: 123,
              referencia_tipo: "COMPRA",
              usuario: "Juan Pérez",
              descripcion: "Compra de lápices nueva temporada",
              stock_acumulado: 500
            },
            {
              id: 2,
              producto: "Cuadernos Espiral",
              tipo: "SALIDA",
              cantidad: 25,
              fecha: new Date().toISOString(),
              referencia_id: 456,
              referencia_tipo: "FACTURA",
              usuario: "María García",
              descripcion: "Venta a cliente regular",
              stock_acumulado: 275
            },
            {
              id: 3,
              producto: "Borradores",
              tipo: "AJUSTE",
              cantidad: -5,
              fecha: new Date().toISOString(),
              referencia_id: null,
              referencia_tipo: null,
              usuario: "Admin Sistema",
              descripcion: "Ajuste por inventario físico",
              stock_acumulado: 95
            }
          ]);
          setCargando(false);
        }, 1500);
      } catch (error) {
        console.error('Error cargando movimientos:', error);
        setCargando(false);
      }
    };

    cargarMovimientos();
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100">
      {cargando && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-[2px]">
          <CircularProgress size={60} color="primary" />
        </div>
      )}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm px-8 py-6 border-b border-gray-200/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Kardex de Inventario
              </h1>
              <p className="text-gray-600 mt-1">Historial de movimientos de productos</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Puedes agregar botones adicionales aquí si necesitas */}
            </div>
          </div>
        </header>

        {/* Filtros y Controles */}
        <div className="bg-white/60 backdrop-blur-sm px-8 py-4 border-b border-gray-200/40">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filtrar por tipo:</span>
              <select 
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="TODOS">Todos los movimientos</option>
                <option value="ENTRADA">Entradas</option>
                <option value="SALIDA">Salidas</option>
                <option value="AJUSTE">Ajustes</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Mostrando {movimientosFiltrados.length} movimiento{movimientosFiltrados.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Tabla de Movimientos */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="overflow-x-auto rounded-2xl border border-slate-200/40 bg-white/80 backdrop-blur-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50/80 to-blue-50/50 border-b border-slate-200/40">
                  <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Producto</th>
                  <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Tipo</th>
                  <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Cantidad</th>
                  <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Fecha</th>
                  <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Referencia</th>
                  <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Usuario</th>
                  <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Stock Acumulado</th>
                  <th className="text-left p-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.map((movimiento) => (
                  <tr key={movimiento.id} className="border-b border-slate-200/40 hover:bg-blue-50/20 transition-colors duration-200 group">
                    {/* Producto */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Inventory2 className="text-white text-lg" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-lg">{movimiento.producto}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Tipo */}
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm ${getColorTipo(movimiento.tipo)}`}>
                        {getIconoTipo(movimiento.tipo)}
                        {movimiento.tipo}
                      </span>
                    </td>
                    
                    {/* Cantidad */}
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${
                          movimiento.tipo === 'ENTRADA' ? 'text-green-600' : 
                          movimiento.tipo === 'SALIDA' ? 'text-red-600' : 
                          'text-blue-600'
                        }`}>
                          {movimiento.tipo === 'ENTRADA' ? '+' : movimiento.tipo === 'SALIDA' ? '-' : ''}
                          {Math.abs(movimiento.cantidad)}
                        </span>
                      </div>
                    </td>
                    
                    {/* Fecha */}
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <CalendarToday className="w-4 h-4" />
                        {formatearFecha(movimiento.fecha)}
                      </div>
                    </td>
                    
                    {/* Referencia */}
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50/80 text-gray-700 text-sm font-medium border border-gray-200/60">
                        {formatearReferencia(movimiento)}
                      </span>
                    </td>
                    
                    {/* Usuario */}
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Person className="w-4 h-4" />
                        {movimiento.usuario}
                      </div>
                    </td>
                    
                    {/* Stock Acumulado */}
                    <td className="p-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50/80 text-orange-700 text-sm font-medium border border-orange-200/60 backdrop-blur-sm">
                        {movimiento.stock_acumulado} unidades
                      </span>
                    </td>
                    
                    {/* Descripción */}
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-600 max-w-xs">
                        <Description className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-2">
                          {movimiento.descripcion || 'Sin descripción'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {movimientosFiltrados.length === 0 && !cargando && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      No se encontraron movimientos con los filtros seleccionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
