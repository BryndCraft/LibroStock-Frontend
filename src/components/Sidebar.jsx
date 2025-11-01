import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../../src/assets/images/LibroStock-Logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import Logout from "../components/Logout";

export default function Sidebar() {
  const location = useLocation(); 
  const handleLogout = Logout();
  const links = [
    { name: "Dashboard", path: "/", icon: <DashboardIcon className="mr-3 text-lg" /> },
    { name: "Facturacion", path: "/facturacion", icon: <ReceiptLongIcon className="mr-3 text-lg" /> },
    { name: "Inventario", path: "/inventario", icon: <InventoryIcon className="mr-3 text-lg" /> },
  ];

  return (
    <div className="w-72 h-full bg-gradient-to-b from-blue-800 to-blue-950 flex flex-col shadow-xl">
      <div className="w-full py-6 flex flex-col items-center bg-blue-900/40 border-b border-blue-600">
        <div className="bg-white rounded-full w-20 h-20 p-2 select-none shadow-lg mb-3">
          <img src={Logo} className="w-full h-full object-contain" alt="LibroStock Logo" />
        </div>
        <h2 className="text-white font-bold text-xl">LibroStock</h2>
        <p className="text-blue-200 text-sm">Librería Escolar</p>
      </div>

      <div className="px-5 py-4 border-b border-blue-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="ml-3">
            <h3 className="text-white font-semibold">Administrador</h3>
            <p className="text-blue-200 text-xs">Colegio Liceo Franciscano</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 px-4">
        <h4 className="text-blue-300 text-xs uppercase font-bold tracking-wider mb-4 px-3">Navegación Principal</h4>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center text-white py-3 px-4 rounded-xl transition-all duration-300 mb-2 ${
                isActive 
                  ? "bg-white/20 font-bold shadow-md border-l-4 border-yellow-400" 
                  : "hover:bg-blue-700/50"
              }`}
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-5 border-t border-blue-700">
        <button 
        onClick={handleLogout}
        className="flex items-center justify-center w-full bg-red-600 hover:cursor-pointer transform-all delay-100 transition ease-in-out hover:scale-110 hover:bg-red-800  text-white py-3 px-4 rounded-xl  border border-red-500/30 hover:border-red-500/50" >
          <LogoutIcon className="mr-2" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}