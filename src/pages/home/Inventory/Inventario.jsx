import VistaProductos from "./components/VistaProductos";
import Sidebar from "../../../components/utils/Sidebar";
import { useState } from "react";
import VistaCategorias from "./components/VistaCategorias";
export default function Inventario() {
  const [vista, setVista] = useState("productos");

  return (
    <div className="  min-h-screen w-full flex">
      <Sidebar />
      {vista === "productos" && <VistaProductos setVista={setVista} />}
      {vista === "categorias" && <VistaCategorias setVista={setVista} />}
    </div>
  );
}
