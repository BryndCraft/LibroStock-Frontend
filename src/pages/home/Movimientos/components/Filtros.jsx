export function Filtros({ busqueda, setBusqueda }) {
  return (
    busqueda && (
      <motion.span
        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xl"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        Búsqueda: "{busqueda}"
        <button
          onClick={() => setBusqueda("")}
          className="text-blue-600 hover:text-blue-800 cursor-pointer text-2xl"
        >
          ×
        </button>
      </motion.span>
    )
  );
}


