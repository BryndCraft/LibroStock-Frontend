import React, { useEffect } from "react";
import { AnimatedContainer } from "../../../../animations/animations";
import { AddCircle, RemoveCircle, Inventory } from "@mui/icons-material";
import { useKardex } from "../../../../context/KardexContext";
import { useProductos } from "../../../../context/ProductosContext";
import Card from "../../../../components/utils/Card";

export default function VistaKardex() {
  const { kardex,fetchKardex} = useKardex();
  const { productos } = useProductos();

  useEffect(() =>{
    fetchKardex()
  }, [])
  
  const encontrarProducto = (IdProducto) => {
    const producto = productos.find((p) => p.id === IdProducto);
    return producto ? producto.nombre : "Producto no encontrado";
  };

  const formatearFecha = (fechaBase) => {
    if (!fechaBase) return "No tiene fecha";
    try {
      const fecha = new Date(fechaBase);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "entrada":
        return "bg-green-100 text-green-800 border-green-200";
      case "salida":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount || 0);

  const tieneRegistros = kardex.length > 0;

  return (
    <AnimatedContainer className="flex-1 bg-gray-50 flex flex-col overflow-hidden ml-74">
      {/* Header - Siempre visible */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-6 shadow-lg flex justify-between items-center">
        <div className="grid gap-2">
          <div className="font-bold text-white text-3xl">
            Kardex del Inventario
          </div>
          <div className="font-light text-emerald-100 text-lg">
            Historial completo de movimientos de inventario
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-white text-sm font-medium">Total de registros</div>
          <div className="text-white text-2xl font-bold">{kardex.length}</div>
        </div>
      </div>

      {/* Contenido principal - Siempre ocupa el espacio restante */}
      <div className="flex flex-col gap-5 p-6 flex-1 overflow-hidden">
        {/* Cards - Siempre visibles */}
        <div className="flex gap-5">
          <div className="flex-1">
            <Card
              color="green"
              cantidad={
                kardex.filter((item) => item.tipo_movimiento?.toLowerCase() === "entrada").length
              }
              texto="Total de Entradas"
              icon={<AddCircle />}
            />
          </div>
          <div className="flex-1">
            <Card
              color="red"
              cantidad={
                kardex.filter((item) => item.tipo_movimiento?.toLowerCase() === "salida").length
              }
              texto="Total de Salidas"
              icon={<RemoveCircle />}
            />
          </div>
        </div>

        {/* Tabla o Estado Vacío - Ambos mantienen la misma altura */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex-1 flex flex-col overflow-hidden">
          {tieneRegistros ? (
            <>
              {/* Encabezados de tabla */}
              <div className="grid grid-cols-9 gap-4 border-b border-gray-200 p-4 font-bold text-gray-700 text-xs uppercase bg-gray-50">
                {["ID","Producto","Fecha","Tipo","Referencia","Cantidad","Costo Unitario","Costo Total","Costo Promedio"].map((col) => (
                  <div key={col} className="truncate">{col}</div>
                ))}
              </div>

              {/* Filas con scroll vertical */}
              <div className="overflow-y-auto flex-1">
                {kardex.map((data) => (
                  <div
                    key={data.id}
                    className="grid grid-cols-9 gap-4 border-b border-gray-100 hover:bg-gray-50 transition-colors p-4"
                  >
                    <div className="font-mono text-sm">#{data.id}</div>
                    <div className="grid gap-1">
                      <span className="font-medium text-gray-900 truncate">{encontrarProducto(data.producto_id)}</span>
                      <span className="text-xs text-gray-500">ID: {data.producto_id}</span>
                    </div>
                    <div>{formatearFecha(data.created_date)}</div>
                    <div>
                      <span className={`inline-grid place-items-center px-3 py-1 rounded-full text-xs font-medium border ${getTipoColor(data.tipo_movimiento)}`}>
                        {data.tipo_movimiento || "N/A"}
                      </span>
                    </div>
                    <div className="truncate">{data.referencia || "Sin referencia"}</div>
                    <div className={`font-bold ${data.tipo_movimiento?.toUpperCase() === "ENTRADA" ? "text-green-600" : "text-red-600"}`}>
                      {data.cantidad}
                    </div>
                    <div className="font-semibold">{formatCurrency(data.costo_unitario)}</div>
                    <div className="font-semibold">{formatCurrency(data.costo_total)}</div>
                    <div className="font-semibold">{formatCurrency(data.costo_promedio)}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 grid place-items-center p-8">
              <div className="max-w-md text-center grid gap-4">
                <div className="grid place-items-center">
                  <div className="bg-emerald-50 w-20 h-20 rounded-full grid place-items-center mb-4">
                    <Inventory className="text-emerald-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No hay movimientos registrados
                  </h3>
                  <p className="text-gray-600 mb-4">
                    El kardex está vacío. Cuando realices movimientos de inventario, aparecerán aquí.
                  </p>
                  <div className="grid gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <AddCircle className="text-green-500 text-base" />
                      <span>Las entradas aumentan el inventario</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <RemoveCircle className="text-red-500 text-base" />
                      <span>Las salidas disminuyen el inventario</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedContainer>
  );
}