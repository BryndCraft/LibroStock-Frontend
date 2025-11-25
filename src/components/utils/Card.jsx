export default function Card(
  { color = "green", 
    cantidad = 4, 
    texto = "Total de productos", 
    icon = null, 
    onClick = null  
  }
) {
  const gradients = {
    green: "from-green-500 to-green-600",
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    yellow: "from-amber-500 to-amber-600",
    gray: "from-gray-500 to-gray-600"
  };

  const gradient = gradients[color] || gradients.green;

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="block text-3xl font-bold">{cantidad}</span>
          <span className="block text-white/90 font-medium mt-1">{texto}</span>
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}