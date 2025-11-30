import Sidebar from "../../../components/utils/Sidebar";
import VistaProveedores from "./components/VistaProveedores";
export default function Proveedores() {
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar />
      <VistaProveedores />
    </div>
  );
}
