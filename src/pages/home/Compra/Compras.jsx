import { AnimatedContainer } from "../../../animations/animations";
import Sidebar from "../../../components/utils/Sidebar";
import VistaCompras from "./components/VistaCompras";
import { useState } from "react";

export default function Compras() {
  const [vista, setVista] = useState("productos");

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar/>
      <VistaCompras/>
    </div>

  );
}
