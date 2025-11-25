import { AnimatePresence } from "framer-motion";
import { AnimatedContainer } from "../../../../animations/animations";
import Card from "../../../../components/utils/Card";
import { useProductos } from "../../../../context/ProductosContext";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";
import SellIcon from "@mui/icons-material/Sell";
import SchoolIcon from "@mui/icons-material/School";
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function VistaDashBoard() {
  const { sinStock, stockBajo, productosActivos, desactivados } =
    useProductos();

  const navegacion = useNavigate();
  return (
    <AnimatedContainer className="min-h-screen w-full ml-75">
      {/*Header*/}
      <div className="w-full h-50 py-16 px-18 bg-gradient-to-r pb-20 from-blue-500 to-green-500 shadow-md">
        <div className="flex justify-between w-full">
          <div>
            <div className="font-bold text-white text-3xl">
              Dashboard General
            </div>
            <div className="font-light text-white text-2xl">
              Resumen completo de tu librería escolar
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-tl-3xl ml-5 relative -my-5 bg-white p-10">
        <div className="bg-white/50 border border-slate-200/40 rounded-2xl p-3 shadow-sm gap-3 mb-10 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card
              color="green"
              cantidad={productosActivos}
              texto="Total de Productos"
              icon={<LocalLibraryIcon className="text-white" />}
              trend="up"
              trendValue="12%"
              onClick={() => {
                navegacion("/inventario");
              }}
            />

            <Card
              color="blue"
              cantidad={42}
              texto="Ventas del día"
              icon={<SellIcon className="text-white" />}
              trend="up"
              trendValue="5%"
            />
            <Card
              color="yellow"
              cantidad={stockBajo}
              texto="Stock Bajo"
              icon={<WarningIcon className="text-white" />}
              trend="down"
              trendValue="8%"
              onClick={() => handleAbrirModal("stockBajo")}
            />
            <Card
              color="red"
              cantidad={sinStock}
              texto="Sin Stock"
              icon={<NotificationsActiveIcon className="text-white" />}
              trend="up"
              trendValue="2%"
              onClick={() => handleAbrirModal("sinStock")}
            />
            <Card
              color="gray"
              cantidad={desactivados}
              texto="Producto Inactivos"
              icon={<NotificationsActiveIcon className="text-white" />}
              trend="up"
              trendValue="2%"
              onClick={() => handleAbrirModal("sinStock")}
            />
          </div>

          <div className="border border-amber-300 w-full h-50 p-8 rounded-3xl bg-amber-200/40">
            <div className="flex flex-col">
              <span className="font-poppinsBold text-2xl text-amber-800">
                Alertas de Inventario
              </span>
              <span className="font-light text-xl text-amber-700">
                Productos que requieren atención
              </span>
            </div>
          </div>
        </div>

        <div className="border border-green-500/40 shadow-lg w-[50%] p-5 rounded-2xl h-70">
              <span className="font-poppinsBold text-2xl text-green-500">Actividad Reciente</span>
        </div>
      </div>

      {/*Modales*/}
      <AnimatePresence></AnimatePresence>
    </AnimatedContainer>
  );
}
