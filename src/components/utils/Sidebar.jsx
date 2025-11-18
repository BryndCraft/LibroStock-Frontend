import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/LibroStock-Logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import { useLogout } from "../../pages/auth/Logout";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import { getMediaUrl } from "../../apis/auth.api";
import { useEffect } from "react";
import { Person } from "@mui/icons-material";
import  SupervisedUserCircleIcon  from '@mui/icons-material/SupervisedUserCircle';
import { LibraryAdd } from "@mui/icons-material";
export default function Sidebar() {
  const location = useLocation();
  const handleLogout = useLogout();
  const { user } = useUser();
  const [perfil, setPerfil] = useState({ photo_perfil: '' });

  useEffect(() => {
    if (user) {
      const ruta = user.photo_perfil || '';
      setPerfil(prev => ({
        ...prev,
        photo_perfil: ruta
      }));
    }
  }, [user]);


  const links = [
    { name: "Dashboard", path: "/", icon: <DashboardIcon className="mr-3 text-lg" /> },
    { name: "Facturacion", path: "/facturacion", icon: <ReceiptLongIcon className="mr-3 text-lg" /> },
    { name: "Inventario", path: "/inventario", icon: <InventoryIcon className="mr-3 text-lg" /> },
    { name: "Proveedores", path:"/proveedores", icon:<SupervisedUserCircleIcon className="mr-3 text-lg"/>}, 
    { name: "Compras", path:"/compras", icon:<LibraryAdd className="mr-3 text-lg"/>}, 
    
  ];

  return (
    <div className="w-60 h-screen-full bg-gray-800 flex flex-col">

      <div className="w-full py-6 flex flex-col items-center border-b border-gray-600">
        <div className="bg-gray-600 rounded-full w-20 h-20 p-2 select-none shadow-lg mb-3">
          <img src={Logo} className="w-full h-full object-contain" alt="LibroStock Logo" />
        </div>
        <h2 className="text-white font-bold text-xl">LibroStock</h2>
        <p className="text-blue-200 text-sm">Librería Escolar</p>
      </div>

      <Link to="/perfil" className="px-5 py-4 border-b border-gray-600 hover:bg-gray-600/50">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {perfil.photo_perfil ? (
              <img
                src={getMediaUrl(perfil.photo_perfil)}
                alt="Foto de perfil"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Person className="text-5xl" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-white font-semibold">{user ? user.rol : ''}</h3>
            <p className="text-blue-300 text-xs">Colegio Liceo Franciscano</p>
          </div>
        </div>
      </Link>

      <div className="flex-1 py-6 px-4">
        <h4 className="text-blue-300 text-xs uppercase font-bold tracking-wider mb-4 px-3">Navegación Principal</h4>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center text-white py-3 px-4 rounded-xl transition-all duration-300 mb-2 ${isActive
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

      <div className="p-5 border-t border-gray-600">
        <button
          type="button"
          onClick={async () => await handleLogout()}
          className="flex items-center justify-center w-full bg-red-600 hover:cursor-pointer transform-all delay-100 transition ease-in-out hover:scale-110 hover:bg-red-800  text-white py-3 px-4 rounded-xl  border border-red-500/30 hover:border-red-500/50" >
          <LogoutIcon className="mr-2" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}