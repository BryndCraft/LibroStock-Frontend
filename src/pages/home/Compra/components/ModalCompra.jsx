import ComprasCabecera from "../forms/ComprasCabecera";
import ComprasProductos from "../forms/ComprasProductos";
import { useState } from "react";
import { useCompra } from "../hooks/useCompra";
export default function ModalCompra({setAbrirFormulario}) {
  const [paso, setPaso] = useState(1);
  const {formData, setFormData} = useCompra();
  return (
    <div>
      {paso == 1 && <ComprasCabecera setAbrirFormulario={setAbrirFormulario} formData={formData} setFormData={setFormData} setPaso={setPaso} />}
      {paso == 2 && (
        <ComprasProductos setAbrirFormulario={setAbrirFormulario} formData={formData} setFormData={setFormData} setPaso={setPaso} />
      )}
    </div>
  );
}
