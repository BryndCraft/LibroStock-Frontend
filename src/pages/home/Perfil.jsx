import { useState, useEffect } from "react";
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Security,
  PhotoCamera,
  Add,
  Delete,
  Block,
  CheckCircle,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import Swal from "sweetalert2";

// Datos de ejemplo
const usuarioEjemplo = {
  id: 1,
  nombre: "María",
  apellido: "González",
  correo: "admin@colegio.edu",
  rol: "admin",
  foto: null,
  activo: true
};

const usuariosEjemplo = [
  {
    id: 1,
    nombre: "María",
    apellido: "González",
    correo: "admin@colegio.edu",
    rol: "admin",
    activo: true,
    fechaCreacion: "2024-01-15"
  },
  {
    id: 2,
    nombre: "Carlos",
    apellido: "Rodríguez",
    correo: "carlos@colegio.edu",
    rol: "profesor",
    activo: true,
    fechaCreacion: "2024-02-20"
  },
  {
    id: 3,
    nombre: "Ana",
    apellido: "Martínez",
    correo: "ana@colegio.edu",
    rol: "vendedor",
    activo: false,
    fechaCreacion: "2024-03-10"
  }
];

export default function Perfil() {
  const [usuario, setUsuario] = useState(usuarioEjemplo);
  const [usuarios, setUsuarios] = useState(usuariosEjemplo);
  const [editando, setEditando] = useState(false);
  const [mostrarFormUsuario, setMostrarFormUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  // Estados para nuevo usuario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "vendedor",
    password: ""
  });

  const manejarSubidaFoto = (event) => {
    const archivo = event.target.files[0];
    if (!archivo){
        return;
    }
    if (archivo.size > 30 * 1024 * 1024){
        Swal.fire({
            icon: 'error',
            title: 'Correo electrónico requerido',
            text: 'Por favor ingresa tu correo electrónico'
            });
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setFotoPreview(e.target.result);
    reader.readAsDataURL(archivo);
    setUsuario(prev => ({...prev, foto: archivo}));
};

  const guardarPerfil = () => {

    setEditando(false);
    alert("Perfil actualizado correctamente");
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setUsuario(usuarioEjemplo);
    setEditando(false);
    setFotoPreview(null);
  };

  // Crear nuevo usuario
  const crearUsuario = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.apellido || !nuevoUsuario.correo || !nuevoUsuario.password) {
      alert("Por favor complete todos los campos");
      return;
    }

    const usuario = {
      id: Date.now(),
      ...nuevoUsuario,
      activo: true,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };

    setUsuarios(prev => [...prev, usuario]);
    setNuevoUsuario({
      nombre: "",
      apellido: "",
      correo: "",
      rol: "vendedor",
      password: ""
    });
    setMostrarFormUsuario(false);
    alert("Usuario creado exitosamente");
  };

  // Editar usuario
  const editarUsuario = (usuario) => {
    setUsuarioEditando({ ...usuario });
  };

  // Guardar edición de usuario
  const guardarUsuarioEditado = () => {
    setUsuarios(prev => prev.map(u => 
      u.id === usuarioEditando.id ? usuarioEditando : u
    ));
    setUsuarioEditando(null);
    alert("Usuario actualizado correctamente");
  };

  // Eliminar usuario
  const eliminarUsuario = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
      setUsuarios(prev => prev.filter(u => u.id !== id));
      alert("Usuario eliminado correctamente");
    }
  };

  // Activar/Desactivar usuario
  const toggleUsuarioActivo = (id) => {
    setUsuarios(prev => prev.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  };

  const esAdmin = usuario.rol === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Perfil de Usuario</h1>
          <p className="text-gray-600 mt-2">Gestiona tu información personal y usuarios del sistema</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
              {/* Foto de perfil */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {fotoPreview ? (
                      <img 
                        src={fotoPreview} 
                        alt="Foto de perfil" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : usuario.foto ? (
                      <img 
                        src={usuario.foto} 
                        alt="Foto de perfil" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Person className="text-5xl" />
                    )}
                  </div>
                  
                  <label htmlFor="foto-perfil" className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <PhotoCamera className="text-blue-600 text-lg" />
                    <input
                      id="foto-perfil"
                      type="file"
                      accept="image/*"
                      onChange={manejarSubidaFoto}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 text-center">
                  {usuario.nombre} {usuario.apellido}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Security className="text-green-600 text-sm" />
                  <span className="text-gray-600 capitalize">{usuario.rol}</span>
                </div>
              </div>

              {/* Información del perfil */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  {editando ? (
                    <input
                      type="text"
                      value={usuario.nombre}
                      onChange={(e) => setUsuario(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{usuario.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  {editando ? (
                    <input
                      type="text"
                      value={usuario.apellido}
                      onChange={(e) => setUsuario(prev => ({ ...prev, apellido: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{usuario.apellido}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Email className="text-gray-400 text-sm" />
                    Correo Electrónico
                  </label>
                  {editando ? (
                    <input
                      type="email"
                      value={usuario.correo}
                      onChange={(e) => setUsuario(prev => ({ ...prev, correo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{usuario.correo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <p className="text-gray-900 font-medium capitalize">{usuario.rol}</p>
                </div>

                {/* Botones de acción del perfil */}
                <div className="pt-4 flex gap-3">
                  {editando ? (
                    <>
                      <button
                        onClick={guardarPerfil}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-semibold transition-colors"
                      >
                        <Save className="text-lg" />
                        Guardar
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2 font-semibold transition-colors"
                      >
                        <Cancel className="text-lg" />
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditando(true)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold transition-colors"
                    >
                      <Edit className="text-lg" />
                      Editar Perfil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Gestión de Usuarios (solo para admin) */}
          {esAdmin && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                    <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
                  </div>
                  <button
                    onClick={() => setMostrarFormUsuario(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold transition-colors"
                  >
                    <Add />
                    Nuevo Usuario
                  </button>
                </div>

                {/* Lista de usuarios */}
                <div className="space-y-4">
                  {usuarios.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                          {user.nombre[0]}{user.apellido[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.nombre} {user.apellido}
                          </h3>
                          <p className="text-gray-600 text-sm">{user.correo}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.activo 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {user.activo ? "Activo" : "Inactivo"}
                            </span>
                            <span className="text-gray-500 text-xs capitalize">{user.rol}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editarUsuario(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar usuario"
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => toggleUsuarioActivo(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.activo 
                              ? "text-orange-600 hover:bg-orange-50" 
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={user.activo ? "Desactivar usuario" : "Activar usuario"}
                        >
                          {user.activo ? <Block /> : <CheckCircle />}
                        </button>
                        <button
                          onClick={() => eliminarUsuario(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar usuario"
                        >
                          <Delete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para nuevo usuario */}
      {mostrarFormUsuario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Usuario</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={nuevoUsuario.nombre}
                  onChange={(e) => setNuevoUsuario(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  value={nuevoUsuario.apellido}
                  onChange={(e) => setNuevoUsuario(prev => ({ ...prev, apellido: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  value={nuevoUsuario.correo}
                  onChange={(e) => setNuevoUsuario(prev => ({ ...prev, correo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={nuevoUsuario.password}
                  onChange={(e) => setNuevoUsuario(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={nuevoUsuario.rol}
                  onChange={(e) => setNuevoUsuario(prev => ({ ...prev, rol: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="profesor">Profesor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={crearUsuario}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
              >
                Crear Usuario
              </button>
              <button
                onClick={() => setMostrarFormUsuario(false)}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar usuario */}
      {usuarioEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Editar Usuario</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={usuarioEditando.nombre}
                  onChange={(e) => setUsuarioEditando(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  value={usuarioEditando.apellido}
                  onChange={(e) => setUsuarioEditando(prev => ({ ...prev, apellido: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  value={usuarioEditando.correo}
                  onChange={(e) => setUsuarioEditando(prev => ({ ...prev, correo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={usuarioEditando.rol}
                  onChange={(e) => setUsuarioEditando(prev => ({ ...prev, rol: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="profesor">Profesor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={guardarUsuarioEditado}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setUsuarioEditando(null)}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}