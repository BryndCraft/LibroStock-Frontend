import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import { useUser } from "../../context/UserContext";
export default function DashBoard() {
  const {user} = useUser();

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm px-8 py-6 border-b border-gray-200/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard General
              </h1>
              <p className="text-gray-600 mt-1">Resumen de la librería escolar</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-200">
                <NotificationsActiveIcon />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Estadísticas */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
              color="green"
              cantidad={156}
              texto="Total de Productos"
              icon={<LocalLibraryIcon className="text-white" />}
              trend="up"
              trendValue="12%"
            />
            <Card
              color="blue"
              cantidad={42}
              texto="Ventas del día"
              icon={<ReceiptLongIcon className="text-white" />}
              trend="up"
              trendValue="5%"
            />
            <Card
              color="amber"
              cantidad={23}
              texto="Stock Bajo"
              icon={<InventoryIcon className="text-white" />}
              trend="down"
              trendValue="8%"
            />
            <Card
              color="red"
              cantidad={5}
              texto="Sin Stock"
              icon={<NotificationsActiveIcon className="text-white" />}
              trend="up"
              trendValue="2%"
            />
          </div>

          {/* Sección de alertas */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-gray-200/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Alertas de Inventario
                </h2>
                <p className="text-gray-600 mt-1">
                  Productos que requieren atención
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-white font-medium rounded-xl flex items-center shadow-sm hover:shadow-md">
                  <DashboardIcon className="mr-2 text-sm" />
                  Actualizar Dashboard
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-300 text-white font-medium rounded-xl flex items-center shadow-sm hover:shadow-md">
                  <NotificationsActiveIcon className="mr-2 text-sm" />
                  Ver Todas las Alertas
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 border-l-4 border-amber-400">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 mr-3">
                    <InventoryIcon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800">
                      Matemáticas 5° Grado
                    </h3>
                    <p className="text-amber-700 text-sm mt-1">Quedan 3 unidades</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-red-400">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700 mr-3">
                    <NotificationsActiveIcon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Cuadernos Cuadriculados
                    </h3>
                    <p className="text-red-700 text-sm mt-1">Agotados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sección de actividad reciente */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Actividad Reciente
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver todo
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <ReceiptLongIcon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Venta realizada</p>
                    <p className="text-gray-600 text-sm">
                      5 libretas - C$200
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">Hace 2 horas</span>
                </div>

                <div className="flex items-center p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <InventoryIcon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Stock actualizado</p>
                    <p className="text-gray-600 text-sm">
                      Lápices - 50 unidades agregadas
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">Hace 5 horas</span>
                </div>
                
                <div className="flex items-center p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <LocalLibraryIcon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Nuevo producto</p>
                    <p className="text-gray-600 text-sm">
                      Diccionarios de inglés añadidos
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">Hace 1 día</span>
                </div>
              </div>
            </div>

            {/* Sección de productos populares */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Productos Populares
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <LocalLibraryIcon />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Cuadernos profesionales</p>
                      <p className="text-gray-600 text-sm">45 vendidos</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUpIcon className="mr-1" />
                    <span className="text-sm font-medium">+12%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                      <InventoryIcon />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Lápices HB</p>
                      <p className="text-gray-600 text-sm">38 vendidos</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUpIcon className="mr-1" />
                    <span className="text-sm font-medium">+8%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50/80 rounded-xl transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <ReceiptLongIcon />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Calculadoras científicas</p>
                      <p className="text-gray-600 text-sm">22 vendidos</p>
                    </div>
                  </div>
                  <div className="flex items-center text-red-600">
                    <TrendingDownIcon className="mr-1" />
                    <span className="text-sm font-medium">-3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}