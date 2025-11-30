import { useState } from "react";
import Swal from "sweetalert2";
import { useVentas } from "../../../../context/VentasContext";
export function useFacturacion() {
  const { agregarVenta } = useVentas();

  const [facturacionData, setFacturacionData] = useState({
    estado: "Pagada",
    montoRecibido: 0,
    montoDevuelto: 0,
    total: 0,
    subtotal: 0,
    descuento: 0,
    productos: [],
    activo: true,
  });

  const handleGuardarVenta = async (datosVenta) => {
    try {
        console.log(datosVenta)
      await agregarVenta(datosVenta);
      Swal.fire({
        icon: "success",
        title: "Venta Realizada",
        text: "El Venta se ha realizado Corretamente",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text:  "Ocurrió un error al realizar la venta ",
      });
    }
  };

  return { facturacionData, setFacturacionData, handleGuardarVenta };
}
