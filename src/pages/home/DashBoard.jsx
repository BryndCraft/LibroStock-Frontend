import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";

export default function DashBoard() {
  return (
    <div className="h-screen w-full flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard General
              </h1>
              <p className="text-gray-500">Resumen de la librería escolar</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <NotificationsActiveIcon />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
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
              icon={<LocalLibraryIcon className="text-white opacity-80" />}
            />
            <Card
              color="blue"
              cantidad={42}
              texto="Ventas del dia"
              icon={<ReceiptLongIcon className="text-white opacity-80" />}
            />
            <Card
              color="yellow"
              cantidad={23}
              texto="Stock Bajo"
              icon={<InventoryIcon className="text-white opacity-80" />}
            />
            <Card
              color="red"
              cantidad={5}
              texto="Sin Stock"
              icon={
                <NotificationsActiveIcon className="text-white opacity-80" />
              }
            />
          </div>

          <div className="bg-white rounded-2xl border p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Alertas de Inventario
                </h2>
                <p className="text-gray-500">
                  Productos que requieren atención
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out hover:scale-110 text-white font-medium rounded-xl hover:cursor-pointer flex items-center">
                  <DashboardIcon className="mr-2 text-sm" />
                  Actualizar Dashboard
                </button>
                <button className="px-5 py-2.5  hover:cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl flex items-center">
                  <NotificationsActiveIcon className="mr-2 text-sm" />
                  Ver Todas las Alertas
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                    <InventoryIcon />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800">
                      Matemáticas 5° Grado
                    </h3>
                    <p className="text-amber-600 text-sm">Quedan 3 unidades</p>
                  </div>
                </div>
              </div>

              <div className="border border-red-200 bg-red-50 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                    <NotificationsActiveIcon />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800">
                      Cuadernos Cuadriculados
                    </h3>
                    <p className="text-red-600 text-sm">Agotados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de actividad reciente */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Actividad Reciente
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <ReceiptLongIcon />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Venta realizada</p>
                  <p className="text-gray-500 text-sm">
                    5 libretas C$200
                  </p>
                </div>
                <span className="text-gray-400 text-sm">Hace 2 horas</span>
              </div>

              <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <InventoryIcon />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Stock actualizado</p>
                  <p className="text-gray-500 text-sm">
                    Lapices - 50 unidades agregadas
                  </p>
                </div>
                <span className="text-gray-400 text-sm">Hace 5 horas</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
