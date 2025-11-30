import { useState } from "react";
import Swal from "sweetalert2";
import { useCompras } from "../../../../context/ComprasContext";

export function useCompra() {
  const { agregarCompra, cargarCompra } = useCompras();

  const [formData, setFormData] = useState({
    proveedor_id: "",
    factura: "",
    metodo_pago: "",
    observaciones: "",
    total: 0,
    productos: [],
  });

  // Función para agregar un producto
  const handleGuardarCompra = async (datosCompra, setMostrarFormCompra) => {
    try {
      await agregarCompra(datosCompra);
      Swal.fire({
        icon: "success",
        title: "¡Creado!",
        text: "La compra ha sido creada Correctamente",
      });

      setMostrarFormCompra(false);
    } catch (error) {
      console.error("Error creando la compra", error);
      const mensajeBackend = error.response?.data?.error || "";

      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: mensajeBackend || "Ocurrió un error al realizar la compra",
      });
    }
  };

  return {
    formData,
    setFormData,
    handleGuardarCompra,
  };
}
