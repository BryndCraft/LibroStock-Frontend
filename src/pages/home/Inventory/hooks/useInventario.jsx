import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  searchCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../../../../apis/categorias.api";
import { createProducto } from "../../../../apis/productos.api";
import { useProductos } from "../../../../context/ProductosContext";
import { useCategorias } from "../../../../context/CategoriasContext";

export const useInventario = () => {
  // Estados
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroStock, setFiltroStock] = useState("");

  const {
    productos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    activarProducto,
  } = useProductos();

  const {
    categorias,
    eliminarCategoria,
    activarCategoria,
    agregarCategoria,
    editarCategoria,
  } = useCategorias();

  const handleActivarProducto = async (productoId) => {
    const result = await Swal.fire({
      title: `¿Activar el producto?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, activar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await activarProducto(productoId);
        if (response.status === 200) {
          Swal.fire("Activado!", "El producto ha sido activado", "success");
        } else {
          Swal.fire("Error", "Hubo un error al activar el producto", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Hubo un error al activar el producto", "error");
      }
    }
  };

  const handleActivarCategoria = async (categoriaId) => {
    console.log(categoriaId)
    const result = await Swal.fire({
      title: `¿Activar la Categoria?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, activar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await activarCategoria(categoriaId);
        if (response.status === 200) {
          Swal.fire("Activado!", "La categoria ha sido activado", "success");
        } else {
          Swal.fire("Error", "Hubo un error al activar la Categoria", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Hubo un error al activar la Categoria", "error");
      }
    }
  };

  const handleEliminarProducto = async (productoId) => {

    const result = await Swal.fire({
      title: `¿Desactivar el producto?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarProducto(productoId);
        Swal.fire(
          "¡Desactivado!",
          "El producto ha sido desactivado.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire("Error", "No se pudo desactivar el producto", "error");
      }
    }
  };

  const handleGuardarProducto = async (
    datos,
    productoEditando,
    setMostrarFormProducto
  ) => {
    try {
      if (productoEditando) {
        console.log(datos)
        await editarProducto(productoEditando.id, datos);

        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "El producto ha sido actualizado correctamente",
        });
      } else {
        await agregarProducto(datos);
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: "El producto ha sido creado correctamente",
        });
      }
      setMostrarFormProducto(false);
    } catch (error) {
      console.error("Error guardando producto:", error);
      const mensajeBackend = error.response?.data?.error || "";

      if (mensajeBackend.includes("nombre o código de barras ya existe")) {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "No se puede tener 2 productos con el mismo nombre o código de barras",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: mensajeBackend || "Ocurrió un error al guardar el producto",
        });
      }
    }
  };

  const handleEliminarCategoria = async (categoriaId) => {
    
    const result = await Swal.fire({
      title: `¿Eliminar la categoria?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarCategoria(categoriaId);
        Swal.fire(
          "¡Eliminada!",
          "Las categoria han sido eliminada.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting categories:", error);
        Swal.fire("Error", "No se pudieron eliminar las categorías", "error");
      }
    }
  };

  const handleGuardarCategoria = async (
    datos,
    categoria,
    setMostrarFormCategoria
  ) => {
    try {
      if (categoria) {
        await editarCategoria(categoria.id, datos);
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "La categoría ha sido actualizada correctamente",
        });
      } else {
        // Crear nueva categoría
        await agregarCategoria(datos);
        Swal.fire({
          icon: "success",
          title: "¡Creada!",
          text: "La categoría ha sido creada correctamente",
        });
      }
      setMostrarFormCategoria(false);
    } catch (error) {
      console.error("Error guardando categoría:", error);
      console.log("Error completo:", error.response); // Agrega esto para debug

      const mensajeBackend =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Ocurrió un error al guardar la categoría";

      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: mensajeBackend,
      });
    }
  };
  const limpiarFiltros = () => {
    setFiltroBusqueda("");
    setFiltroCategoria("");
    setFiltroStock("");
  };

  const obtenerNombreCategoria = (categoriaId) => {
    if (!categoriaId) return "Sin categoría";
    const categoria = categorias.find((cat) => cat.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  const formatearPrecio = (precio) => {
    return `C$ ${parseFloat(precio).toFixed(2)}`;
  };

  const getColorStock = (producto) => {
    if (producto.stock === 0) return "bg-rose-100 text-rose-800 border-rose-200";
    if (producto.stock < producto.stock_minimo) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  // Filtrado de productos
  const productosFiltrados = productos.filter((p) => {
  //  Filtrar por búsqueda (nombre, código o categoría)
  const termino = filtroBusqueda.toLowerCase();
  const coincideBusqueda =
    p.nombre?.toLowerCase().includes(termino) ||
    p.codigo_barras?.toLowerCase().includes(termino) ||
    obtenerNombreCategoria(p.categoria_id)?.toLowerCase().includes(termino);

  // Filtrar por categoría seleccionada
  const coincideCategoria =
    !filtroCategoria || p.categoria_id === parseInt(filtroCategoria);

  // 3 Filtrar por stock
  const coincideStock = (() => {
    switch (filtroStock) {
      case "con-stock":
        return p.stock > p.stock_minimo;
      case "sin-stock":
        return p.stock === 0;
      case "stock-bajo":
      return p.stock > 0 && p.stock < p.stock_minimo; 
      default:
        return true;
    }
  })();

  // 4️⃣ Solo incluir si cumple todos los filtros
  return coincideBusqueda && coincideCategoria && coincideStock;
});

  return {
    productos,
    categorias,
    filtroBusqueda,
    filtroCategoria,
    filtroStock,
    productosFiltrados,
    setFiltroBusqueda,
    setFiltroCategoria,
    setFiltroStock,
    handleEliminarProducto,
    handleActivarProducto,
    handleGuardarProducto,
    handleEliminarCategoria,
    handleGuardarCategoria,
    handleActivarCategoria,
    limpiarFiltros,
    obtenerNombreCategoria,
    formatearPrecio,
    getColorStock,
  };
};
