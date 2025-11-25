import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  searchCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../../../../apis/categorias.api";
import {
  searchProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  activateProductos,
} from "../../../../apis/productos.api";
import { useProductos } from "../../../../context/ProductosContext";
import { useCategorias } from "../../../../context/CategoriasContext";

export const useInventario = () => {
  // Estados
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [mostrarFormCategoria, setMostrarFormCategoria] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroStock, setFiltroStock] = useState("");

  const {
    productos,
    cargarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    activarProducto,
  } = useProductos();

  const {
    categorias,
    cargarCategorias,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    activarCategoria,
  } = useCategorias();

  const handleEditarProducto = (producto) => {
    setProductoEditando(producto);
    setMostrarFormProducto(true);
  };

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

  const handleGuardarProducto = async (datos) => {
    try {
      if (productoEditando) {
        await editarProducto(productoEditando.id, datos);
      } else {
        await createProducto(datos);
      }
      setMostrarFormProducto(false);
      setProductoEditando(null);
      cargarProductos();
    } catch (error) {
      console.error("Error guardando producto:", error);

      // Capturamos el mensaje que viene del backend
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

  // Handlers de Categorías
  const handleEditarCategoria = (categoria) => {
    setCategoriaEditando(categoria);
    setMostrarFormCategoria(true);
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

  const handleSaveCategoria = async (datos) => {
    try {
      if (categoriaEditando) {
        await updateCategoria(categoriaEditando.id, datos);
      } else {
        await createCategoria(datos);
      }
      setMostrarFormCategoria(false);
      setCategoriaEditando(null);
      cargarCategorias();
    } catch (error) {
      console.error("Error guardando categoría:", error);
      throw error; // Para manejar el error en el componente si es necesario
    }
  };

  // Handlers de UI
  const abrirFormProducto = () => {
    setProductoEditando(null);
    setMostrarFormProducto(true);
  };

  const abrirFormCategoria = () => {
    setCategoriaEditando(null);
    setMostrarFormCategoria(true);
  };

  const cerrarFormProducto = () => {
    setMostrarFormProducto(false);
    setProductoEditando(null);
  };

  const cerrarFormCategoria = () => {
    setMostrarFormCategoria(false);
    setCategoriaEditando(null);
  };

  const limpiarFiltros = () => {
    setFiltroBusqueda("");
    setFiltroCategoria("");
    setFiltroStock("");
  };

  // Utilidades
  const obtenerNombreCategoria = (categoriaId) => {
    if (!categoriaId) return "Sin categoría";
    const categoria = categorias.find((cat) => cat.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  const formatearPrecio = (precio) => {
    return `C$ ${parseFloat(precio).toFixed(2)}`;
  };

  const getColorStock = (stock) => {
    if (stock === 0) return "bg-rose-100 text-rose-800 border-rose-200";
    if (stock < 10) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  // Filtrado de productos
  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      producto.codigo_barras
        ?.toLowerCase()
        .includes(filtroBusqueda.toLowerCase()) ||
      obtenerNombreCategoria(producto.categoria_id)
        ?.toLowerCase()
        .includes(filtroBusqueda.toLowerCase());

    const coincideCategoria =
      !filtroCategoria || producto.categoria_id === parseInt(filtroCategoria);

    const coincideStock = (() => {
      switch (filtroStock) {
        case "con-stock":
          return producto.stock > 0;
        case "sin-stock":
          return producto.stock === 0;
        case "stock-bajo":
          return producto.stock > 0 && producto.stock < 10;
        default:
          return true;
      }
    })();

    return coincideBusqueda && coincideCategoria && coincideStock;
  });

  // Retornar todos los estados y handlers
  return {
    // Estados
    mostrarFormProducto,
    mostrarFormCategoria,
    productos,
    categorias,
    productoEditando,
    categoriaEditando,
    filtroBusqueda,
    filtroCategoria,
    filtroStock,
    productosFiltrados,

    // Setters

    setFiltroBusqueda,
    setFiltroCategoria,
    setFiltroStock,

    // Handlers de productos
    handleEditarProducto,
    handleEliminarProducto,
    handleActivarProducto,
    handleGuardarProducto,

    // Handlers de categorías
    handleEditarCategoria,
    handleEliminarCategoria,
    handleSaveCategoria,
    handleActivarCategoria,

    // Handlers de UI
    abrirFormProducto,
    abrirFormCategoria,
    cerrarFormProducto,
    cerrarFormCategoria,
    limpiarFiltros,

    // Utilidades
    obtenerNombreCategoria,
    formatearPrecio,
    getColorStock,

    // Funciones de carga
    cargarCategorias,
  };
};
