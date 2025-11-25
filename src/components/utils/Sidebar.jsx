import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/LibroStock-Logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout } from "../../pages/auth/Logout";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import { getMediaUrl } from "../../apis/auth.api";
import { useEffect } from "react";
import { Person } from "@mui/icons-material";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
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
    { name: "Dashboard", path: "/", icon: <DashboardIcon className="text-xl" /> },
    { name: "Facturación", path: "/facturacion", icon: <ReceiptLongIcon className="text-xl" /> },
    { name: "Inventario", path: "/inventario", icon: <InventoryIcon className="text-xl" /> },
    { name: "Proveedores", path: "/proveedores", icon: <SupervisedUserCircleIcon className="text-xl" /> },
    { name: "Compras", path: "/compras", icon: <LibraryAdd className="text-xl" /> },
    { name: "Prueba", path: "/prueba", icon: <LibraryAdd className="text-xl" />}
  ];

  return (
    <div className="w-80 h-full bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col absolute shadow-xl rounded-r-3xl font-poppins z-30">
      
      {/* Header */}
      <div className="w-full py-8 flex flex-col items-center border-b border-slate-600 bg-slate-700/50 rounded-tr-3xl">
        <div className="bg-white rounded-2xl w-28 h-28 p-4 select-none shadow-lg mb-5 transition-transform duration-300 hover:scale-105">
          <img src={Logo} className="w-full h-full object-contain" alt="LibroStock Logo" />
        </div>
        <h2 className="text-white text-2xl mb-2 font-poppinsBold">LibroStock</h2>
        <p className="text-slate-300 text-sm font-poppins">Tu biblioteca al día</p>
      </div>

      {/* Perfil del usuario */}
      <Link 
        to="/perfil" 
        className="px-6 py-5 border-b border-slate-600 hover:bg-slate-700/60 transition-all duration-300 group"
      >
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg border-2 border-white/20 group-hover:border-white/40 transition-colors">
            {perfil.photo_perfil ? (
              <img
                src={getMediaUrl(perfil.photo_perfil)}
                alt="Foto de perfil"
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <Person className="text-2xl" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-white text-lg font-poppinsBold">{user ? user.rol : ''}</h3>
            <p className="text-slate-400 text-sm mt-1 font-poppins">Colegio Franciscano</p>
          </div>
        </div>
      </Link>

      {/* Navegación principal */}
      <div className="flex-1 py-6 px-5">
        <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-5 px-2 font-poppinsBold">
          Navegación Principal
        </h4>
        <div className="space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center text-slate-300 py-4 px-5 rounded-xl transition-all duration-300 group relative overflow-hidden font-poppinsBold ${
                  isActive
                    ? "bg-blue-500/20 text-white border-l-4 border-blue-400 shadow-md"
                    : "hover:bg-slate-700/60 hover:text-white hover:translate-x-1"
                }`}
              >
                {/* Efecto de fondo para items activos */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
                )}
                
                <div className={`mr-4 transition-transform duration-300 ${
                  isActive ? 'text-blue-400 scale-110' : 'text-slate-400 group-hover:text-white group-hover:scale-110'
                }`}>
                  {link.icon}
                </div>
                
                <span className="text-lg relative z-10">{link.name}</span>
                
                {/* Indicador de página activa */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Botón de cerrar sesión */}
      <div className="p-6 border-t border-slate-600 bg-slate-700/30 rounded-br-3xl">
        <button
          type="button"
          onClick={async () => await handleLogout()}
          className="flex items-center justify-center w-full bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 text-white py-4 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] group font-poppinsBold"
        >
          <LogoutIcon className="mr-3 transition-transform duration-300 group-hover:translate-x-1" />
          <span className="text-lg">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}