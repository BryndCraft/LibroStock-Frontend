import { AnimatePresence } from "framer-motion";
import { AnimatedContainer } from "../../../../animations/animations";
import { AddCircle, Search } from "@mui/icons-material";
import { Switch, FormControlLabel } from "@mui/material";

import CustomSelect from "../../../../components/utils/CustomSelect";
import VistaTablaProveedores from "./VistaTablaProveedores";
import { useState } from "react";
import { ProveedorForm } from "../Forms/ProveedorForm";
import { useProveedor } from "../../../../context/ProveedorContext";

export default function VistaProveedores() {
  const [formProveedorModal, setFormProveedorModal] = useState();
  const [editandoProveedor, setEditandoProveedor] = useState();
  const [proveedoresInactivos, setProveedoresInactivos] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const { proveedores } = useProveedor();

  const filtrarProveedores = () => {
    return proveedores.filter((p) => {
      // Filtrar por estado activo/inactivo
      const estadoOk = proveedoresInactivos ? !p.activo : p.activo;

      // Filtrar por término de búsqueda
      const termino = filtroBusqueda.toLowerCase();
      const coincidencia =
        p.empresa.toLowerCase().includes(termino) ||
        (p.nombre_contacto &&
          p.nombre_contacto.toLowerCase().includes(termino)) ||
        (p.correo && p.correo.toLowerCase().includes(termino)) ||
        (p.ruc && p.ruc.includes(termino));

      return estadoOk && coincidencia;
    });
  };

  const abrirCrearProveedor = () => {
    setEditandoProveedor(null);
    setFormProveedorModal(true);
  };

  const abrirEditarProveedor = (proveedor) => {
    setEditandoProveedor(proveedor);
    setFormProveedorModal(true);
  };
  return (
    <AnimatedContainer className="h-screen w-full ml-75">
      {/*Header*/}
      <div className="w-full h-50 py-16 px-18 bg-gradient-to-r pb-20 from-blue-500 to-green-500 shadow-md">
        <div className="flex justify-between w-full">
          <div>
            <div className="font-bold text-white text-3xl">
              Gestión de Proveedores
            </div>
            <div className="font-light text-white text-2xl">
              Administra y organiza los proveedores de la librería
            </div>
          </div>
          <div>
            <button
              className="bg-amber-400 items-center px-2 py-3 font-poppinsBold text-white rounded-3xl cursor-pointer hover:bg-amber-500 flex"
              onClick={() => abrirCrearProveedor()}
            >
              <AddCircle />
              <span>Agregar Proveedor</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-tl-3xl ml-5 relative -my-5 bg-white p-10 flex justify-between items-center">
        <div className="bg-white/50 border border-slate-200/40 rounded-2xl  p-3 shadow-sm flex items-center gap-3 w-[30%]">
          <Search className="text-slate-400" />
          <input
            type="text"
            className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400"
            placeholder="Realizar una Búsqueda por Nombre o Categoria"
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <span className="text-2xl font-poppinsBold">
            Mostrar Solo Proveedores Inactivos
          </span>
          <FormControlLabel
            control={
              <Switch
                checked={proveedoresInactivos}
                  value={filtroBusqueda}

                onChange={(e) => setProveedoresInactivos(e.target.checked)}
                color="primary"
              />
            }
          />
        </div>
      </div>

      <div className="w-full h-[60%]  p-10">
        <VistaTablaProveedores
          abrirEditarProveedor={abrirEditarProveedor}
          proveedoresInactivos={proveedoresInactivos}
          proveedoresFiltrados={filtrarProveedores()}
        />
      </div>

      {/*Modales */}

      {formProveedorModal && (
        <ProveedorForm
          proveedorEditando={editandoProveedor}
          setModalFormProveedor={setFormProveedorModal}
        />
      )}
    </AnimatedContainer>
  );
}
