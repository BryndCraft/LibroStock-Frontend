import { motion, AnimatePresence } from "framer-motion";

export function FiltroBusqueda({ filtroBusqueda, setFiltroBusqueda }) {
  return (
    filtroBusqueda && (
      <motion.span
        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xl"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        Búsqueda: "{filtroBusqueda}"
        <button
          onClick={() => setFiltroBusqueda("")}
          className="text-blue-600 hover:text-blue-800 cursor-pointer text-2xl"
        >
          ×
        </button>
      </motion.span>
    )
  );
}
export function FiltroCategoria({
  filtroCategoria,
  categorias,
  setFiltroCategoria,
}) {
  return filtroCategoria ? (
    <motion.span
      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xl cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      Categoría:{" "}
      {categorias.find((c) => c.id.toString() === filtroCategoria)?.nombre}
      <button
        onClick={() => setFiltroCategoria("")}
        className="text-green-600 hover:text-green-800 cursor-pointer text-2xl"
      >
        ×
      </button>
    </motion.span>
  ) : null;
}

export function FiltroStock({ filtroStock, setFiltroStock }) {
  return filtroStock ? (
    <motion.span
      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xl"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      Stock:{" "}
      {filtroStock === "con-stock"
        ? "Con stock"
        : filtroStock === "sin-stock"
        ? "Sin stock"
        : "Stock bajo"}
      <button
        onClick={() => setFiltroStock("")}
        className="text-orange-600 hover:text-orange-800 cursor-pointer text-2xl"
      >
        ×
      </button>
    </motion.span>
  ) : null;
}
