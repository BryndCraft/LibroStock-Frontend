import React, { useEffect, useState, useRef } from "react";
import { useVentas } from "../../../../context/VentasContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function VistaVentasTabla() {
  const { ventas, cargarVentas, loading } = useVentas();
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    cargarVentas();
  }, []);

  const handleVerDetalles = (venta) => {
    setVentaSeleccionada(venta);
  };

  const handleCerrarModal = () => {
    setVentaSeleccionada(null);
  };

  // Función mejorada para exportar todas las ventas a PDF
  const exportarPDF = () => {
    const input = pdfRef.current;
    
    // Configuración mejorada del PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    html2canvas(input, {
      scale: 3, // Aumentado para mejor calidad
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: input.scrollWidth,
      height: input.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10;
      const pageHeight = pdfHeight - 20;
      
      // Manejo de múltiples páginas
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Encabezado personalizado
      pdf.setFontSize(20);
      pdf.setTextColor(0, 102, 204);
      pdf.text("REPORTE DE VENTAS", pdfWidth / 2, 15, { align: "center" });
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generado: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pdfWidth - 10, 10, { align: "right" });
      
      pdf.save(`reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`);
    });
  };

  // Función mejorada para exportar detalles con diseño de factura
  const exportarDetallesPDF = (venta) => {
    // Crear contenedor temporal con diseño profesional
    const facturaContainer = document.createElement("div");
    facturaContainer.id = "factura-export";
    facturaContainer.style.cssText = `
      width: 800px;
      padding: 40px;
      background: white;
      font-family: 'Arial', sans-serif;
      color: #333;
    `;
    
    // Plantilla de factura mejorada
    facturaContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 28px; color: #2c3e50; margin: 0; font-weight: bold;">FACTURA #${venta.numero_factura}</h1>
        <p style="font-size: 14px; color: #7f8c8d;">Fecha de emisión: ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <div>
          <h3 style="font-size: 18px; color: #2c3e50; margin-bottom: 10px;">Información de la Venta</h3>
          <p style="font-size: 16px; margin: 5px 0;"><strong>Número de Factura:</strong> ${venta.numero_factura}</p>
          <p style="font-size: 16px; margin: 5px 0;"><strong>Estado:</strong> <span style="color: ${venta.estado === 'completado' ? '#27ae60' : '#e74c3c'}">${venta.estado}</span></p>
        </div>
        <div style="text-align: right;">
          <h3 style="font-size: 18px; color: #2c3e50; margin-bottom: 10px;">Totales</h3>
          <p style="font-size: 20px; margin: 5px 0; font-weight: bold; color: #2c3e50;">Total: $${parseFloat(venta.total).toFixed(2)}</p>
          <p style="font-size: 16px; margin: 5px 0; color: #7f8c8d;">Subtotal: $${parseFloat(venta.subtotal).toFixed(2)}</p>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
          <h4 style="font-size: 16px; color: #2c3e50; margin-bottom: 10px;">Pagos</h4>
          <p style="font-size: 16px; margin: 5px 0;"><strong>Monto Recibido:</strong> $${parseFloat(venta.monto_recibido).toFixed(2)}</p>
          <p style="font-size: 16px; margin: 5px 0;"><strong>Monto Devuelto:</strong> $${parseFloat(venta.monto_devuelto).toFixed(2)}</p>
        </div>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
          <h4 style="font-size: 16px; color: #2c3e50; margin-bottom: 10px;">Descuentos</h4>
          <p style="font-size: 16px; margin: 5px 0;"><strong>Descuento Aplicado:</strong> $${parseFloat(venta.descuento).toFixed(2)}</p>
        </div>
      </div>
      
      <h3 style="font-size: 20px; color: #2c3e50; margin-bottom: 15px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Detalles de Productos</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 16px;">
        <thead style="background: #3498db; color: white;">
          <tr>
            <th style="padding: 12px; text-align: left; font-weight: bold; font-size: 16px;">Producto</th>
            <th style="padding: 12px; text-align: center; font-weight: bold; font-size: 16px;">Cantidad</th>
            <th style="padding: 12px; text-align: right; font-weight: bold; font-size: 16px;">Precio Unitario</th>
            <th style="padding: 12px; text-align: right; font-weight: bold; font-size: 16px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${venta.productos.map((p, index) => `
            <tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : ''}">
              <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">${p.producto}</td>
              <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center; font-size: 16px;">${p.cantidad}</td>
              <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 16px;">$${parseFloat(p.precio_unitario).toFixed(2)}</td>
              <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 16px; font-weight: bold;">$${parseFloat(p.subtotal).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="background: #2c3e50; color: white; padding: 20px; border-radius: 8px; text-align: right;">
        <div style="display: inline-block; text-align: left;">
          <p style="font-size: 18px; margin: 5px 0;"><strong>Subtotal:</strong> $${parseFloat(venta.subtotal).toFixed(2)}</p>
          <p style="font-size: 18px; margin: 5px 0;"><strong>Descuento:</strong> $${parseFloat(venta.descuento).toFixed(2)}</p>
          <p style="font-size: 24px; margin: 10px 0; font-weight: bold; color: #27ae60;">TOTAL: $${parseFloat(venta.total).toFixed(2)}</p>
        </div>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ecf0f1; text-align: center; color: #7f8c8d; font-size: 14px;">
        <p>Gracias por su compra</p>
        <p>Documento generado automáticamente el ${new Date().toLocaleString()}</p>
      </div>
    `;
    
    document.body.appendChild(facturaContainer);
    
    // Configuración mejorada para la captura
    html2canvas(facturaContainer, {
      scale: 3, // Alta resolución
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: facturaContainer.offsetWidth,
      height: facturaContainer.offsetHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      
      // Pie de página profesional
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Factura #${venta.numero_factura} - Página 1 de 1`, pdfWidth / 2, pdfHeight - 10, { align: "center" });
      
      pdf.save(`factura_${venta.numero_factura}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      document.body.removeChild(facturaContainer);
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-gray-800">Ventas Registradas</h2>
        
      </div>

      <div ref={pdfRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Cargando ventas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-lg">ID</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Factura</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Total</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Recibido</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Devuelto</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Estado</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Subtotal</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Descuento</th>
                  <th className="px-6 py-4 text-left font-bold text-lg">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ventas.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-12">
                      <div className="text-gray-400 text-xl">📭</div>
                      <p className="text-gray-500 text-lg mt-2">No hay ventas registradas</p>
                    </td>
                  </tr>
                ) : (
                  ventas.map((venta) => (
                    <tr key={venta.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-lg font-medium">{venta.id}</td>
                      <td className="px-6 py-4 text-lg font-semibold text-blue-700">#{venta.numero_factura}</td>
                      <td className="px-6 py-4 text-lg font-bold text-green-700">${parseFloat(venta.total).toFixed(2)}</td>
                      <td className="px-6 py-4 text-lg">${parseFloat(venta.monto_recibido).toFixed(2)}</td>
                      <td className="px-6 py-4 text-lg">${parseFloat(venta.monto_devuelto).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          venta.estado === 'completado' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {venta.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-lg">${parseFloat(venta.subtotal).toFixed(2)}</td>
                      <td className="px-6 py-4 text-lg text-red-600">${parseFloat(venta.descuento).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerDetalles(venta)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-medium"
                          >
                            <span>👁️</span> Ver
                          </button>
                          <button
                            onClick={() => exportarDetallesPDF(venta)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 font-medium"
                            title="Exportar factura en PDF"
                          >
                            <span>📄</span> PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal mejorado */}
      {ventaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Factura #{ventaSeleccionada.numero_factura}
                </h3>
                <p className="text-gray-600">Detalles completos de la venta</p>
              </div>
              <button
                onClick={() => exportarDetallesPDF(ventaSeleccionada)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                <span>📥</span> Descargar Factura
              </button>
            </div>

            {/* Información general mejorada */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                <h4 className="font-bold text-lg text-blue-800 mb-2">Totales</h4>
                <p className="text-2xl font-bold text-blue-900">$${parseFloat(ventaSeleccionada.total).toFixed(2)}</p>
                <p className="text-gray-600">Subtotal: ${parseFloat(ventaSeleccionada.subtotal).toFixed(2)}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                <h4 className="font-bold text-lg text-green-800 mb-2">Pagos</h4>
                <p className="text-lg font-bold text-green-900">Recibido: ${parseFloat(ventaSeleccionada.monto_recibido).toFixed(2)}</p>
                <p className="text-lg text-green-800">Devuelto: ${parseFloat(ventaSeleccionada.monto_devuelto).toFixed(2)}</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                <h4 className="font-bold text-lg text-purple-800 mb-2">Estado</h4>
                <span className={`px-4 py-2 rounded-full text-base font-semibold ${
                  ventaSeleccionada.estado === 'completado' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ventaSeleccionada.estado}
                </span>
                <p className="mt-2 text-gray-600">Descuento: ${parseFloat(ventaSeleccionada.descuento).toFixed(2)}</p>
              </div>
            </div>

            {/* Tabla de productos mejorada */}
            <div className="mb-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Productos</h4>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left font-bold text-gray-700 text-lg">Producto</th>
                      <th className="px-6 py-3 text-center font-bold text-gray-700 text-lg">Cantidad</th>
                      <th className="px-6 py-3 text-right font-bold text-gray-700 text-lg">Precio Unitario</th>
                      <th className="px-6 py-3 text-right font-bold text-gray-700 text-lg">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ventaSeleccionada.productos.map((p, index) => (
                      <tr key={p.producto_id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 text-lg">{p.producto}</td>
                        <td className="px-6 py-4 text-center text-lg">{p.cantidad}</td>
                        <td className="px-6 py-4 text-right text-lg">${parseFloat(p.precio_unitario).toFixed(2)}</td>
                        <td className="px-6 py-4 text-right text-lg font-semibold">${parseFloat(p.subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={handleCerrarModal}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold"
              >
                Cerrar
              </button>
              <button
                onClick={() => exportarDetallesPDF(ventaSeleccionada)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                <span>📄</span> Descargar Factura en PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}