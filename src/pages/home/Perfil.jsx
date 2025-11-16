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
  VisibilityOff,
  DeleteForever,

} from "@mui/icons-material";
import CustomSelect from "../../components/utils/CustomSelect";
import Swal from "sweetalert2";
import { createUserApi, listUserApi, updateUserApi, deleteUserApi, uploadFoto, getMediaUrl } from "../../apis/auth.api";
import { useUser } from "../../context/UserContext";
import Sidebar from '../../components/Sidebar';

export default function Perfil() {

  const { user, updateUser } = useUser();
  const [perfil, setPerfil] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    rol: '',
    activo: true,
    photo_perfil: '',
    ...user
  });
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(false);
  const [mostrarFormUsuario, setMostrarFormUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "Cajero",
    password: "",
    username: "",
  });

  const [rolSeleccionado, setRolSeleccionado] = useState([]);
  const roles = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Cajero', label: 'Cajero' },
  ];
  const listarUsuarios = async () => {
    try {
      const response = await listUserApi();

      if (response.status === 200 && Array.isArray(response.data?.usuarios)) {

        setUsuarios(response.data.usuarios);
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      console.error("Error al listar usuarios:", error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    listarUsuarios();
  }, []);
  useEffect(() => {
    if (user?.nombre && user?.apellido) {
      const nombre = user.nombre;
      const apellido = user.apellido;

      setPerfil(prev => ({
        ...prev,
        nombre,
        apellido,
        correo: user.correo || prev.correo,
        rol: user.rol || prev.rol,
        photo_perfil: user.photo_perfil || prev.photo_perfil,
      }));
    }
  }, [user]);

  const manejarSubidaFoto = async (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;
    const reader = new FileReader();
    reader.onload = (e) => setFotoPreview(e.target.result);
    reader.readAsDataURL(archivo);
    try {
      const respuesta = await uploadFoto(archivo);
      if (respuesta.status === 200) {
        setPerfil(prev => ({ ...prev, photo_perfil: respuesta.ruta }));
        Swal.fire("Actualizado", "La foto de perfil ha sido actualizada correctamente.", "success");
        updateUser(prev => ({ ...prev, photo_perfil: respuesta.ruta }));
      } else {
        Swal.fire("Error", "No se pudo subir la foto", "error");
      }


    } catch (err) {
      Swal.fire("Error", "No se pudo subir la foto", "error");
    }
  };



  const handleChangeRol = (event) => {
    const { value } = event.target;
    setRolSeleccionado(typeof value === "string" ? value.split(",") : value);

    setNuevoUsuario(prev => ({
      ...prev,
      rol: value[value.length - 1]

    }));
  };
  const cerrarModal = () => {
    setMostrarFormUsuario(false);
    setNuevoUsuario({
      nombre: "",
      apellido: "",
      correo: "",
      rol: "Cajero",
      password: "",
      username: "",
    });
  };
const guardarPerfil = async () => {
  
  if (!perfil.id) {
    Swal.fire("Error!", "No se pudo actualizar el perfil porque no hay ID.", "error");
    return;
  }

  const dataEnviar = {
    id: perfil.id,
    nombre: perfil.nombre,
    apellido: perfil.apellido,
    correo: perfil.correo,
    rol: perfil.rol,
    photo_perfil: perfil.photo_perfil || '', 
    // cambiar password?
  };

  try {
    const response = await updateUserApi(dataEnviar);
    if (response.status === 200) {
      setEditando(false);
      Swal.fire("Actualizado", "Perfil actualizado correctamente.", "success");
      updateUser(dataEnviar); // Actualiza el contexto global
    } else {
      Swal.fire("Error!", "No se pudo actualizar el perfil.", "error");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error!", "Ocurrió un error al actualizar el perfil.", "error");
  }
};

  // Cancelar edición
const cancelarEdicion = () => {
  setPerfil({ ...user }); 
  setEditando(false);
  setFotoPreview(null);
};

  // Crear nuevo usuario
  const crearUsuario = async () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.apellido || !nuevoUsuario.correo || !nuevoUsuario.password || !nuevoUsuario.username) {
      Swal.fire({
        title: "Advertencia",
        text: "Debes llenar todos los campos.",
        icon: "warning",
      });
      return;
    }
    const dataEnviar = {
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      username: nuevoUsuario.username || nuevoUsuario.correo.split("@")[0],
      password: nuevoUsuario.password,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol || "Cajero",
    };
    try {
      const response = await createUserApi(dataEnviar);
      if (response.status === 201) {
        Swal.fire("Creado!", `El usuario ${nuevoUsuario.nombre} ha sido creado con éxito.`, "success");
        setMostrarFormUsuario(false);
        listarUsuarios();
      }
    } catch (error) {
      Swal.fire("Error!", `Hubo un error al crear el usuario ${nuevoUsuario.nombre}.`, "error");
      console.error(error);
    }
  };

  const editarUsuario = (usuario) => setUsuarioEditando({ ...usuario });

const guardarUsuarioEditado = async () => {
  if (!usuarioEditando?.id) {
    Swal.fire("Error", "No se pudo actualizar el usuario porque no hay ID.", "error");
    return;
  }

  const dataEnviar = {
    id: usuarioEditando.id,
    nombre: usuarioEditando.nombre,
    apellido: usuarioEditando.apellido,
    correo: usuarioEditando.correo,
    rol: usuarioEditando.rol,
    photo_perfil: usuarioEditando.photo_perfil || '',
    //password se puede actualizar?
  };

  try {
    const response = await updateUserApi(dataEnviar);
    if (response.status === 200) {
      Swal.fire("Actualizado", "Usuario actualizado correctamente.", "success");
      setUsuarioEditando(null);
      listarUsuarios(); // refresca la lista
    } else {
      Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Ocurrió un error al actualizar el usuario.", "error");
  }
};
  const eliminarUsuario = async (id) => {
    const result = await Swal.fire({
      title: "¿Desactivar Usuario?",
      text: "Esto hará que este usuario no pueda ingresar al sistema hasta que vuelva a ser activado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Desactivar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      const response = await deleteUserApi(id);
      if (response.status === 200) {
        Swal.fire("Desactivado", "El usuario ha sido desactivado correctamente.", "success");
        toggleUsuarioActivo(id);
        listarUsuarios();
      } else {
        Swal.fire("Error", "No se pudo desactivar el usuario.", "error");
      }
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      Swal.fire("Error", "Ocurrió un error al intentar desactivar el usuario.", "error");
    }
  };
  // Activar/Desactivar usuario
  const toggleUsuarioActivo = (id) => {
    setUsuarios(prev => prev.map(u =>
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  };

  const esAdmin = perfil?.rol?.toLowerCase() === "admin" || perfil?.rol?.toLowerCase() === "administrador";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100  flex">
      <Sidebar />
      <div className="flex-1 max-w-6xl mx-auto pt-3 pl-3">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 ">Perfil de Usuario</h1>
          <p className="text-gray-600 ">Gestiona tu información personal y usuarios del sistema</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
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
                    ) : perfil.photo_perfil ? (
                      <img
                        src={getMediaUrl(perfil.photo_perfil)}
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
                  {perfil?.nombre && perfil?.apellido ? `${perfil.nombre} ${perfil.apellido}` : 'Usuario'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Security className="text-green-600 text-sm" />
                  <span className="text-gray-600 capitalize">{perfil?.rol || 'Rol'}</span>
                </div>
              </div>

              {/* Información del perfil */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  {editando ? (
                    <input
                      type="text"
                      value={perfil?.nombre || 'Nombre'}
                      onChange={(e) => setPerfil(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{perfil?.nombre || 'Nombre'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  {editando ? (
                    <input
                      type="text"
                      value={perfil?.apellido || 'Apellido'}
                      onChange={(e) => setPerfil(prev => ({ ...prev, apellido: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{perfil?.apellido || 'Apellido'}</p>
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
                      value={perfil?.correo || 'Correo'}
                      onChange={(e) => setPerfil(prev => ({ ...prev, correo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{perfil?.correo || 'Correo'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Security className="text-green-600 text-sm" />
                    Rol
                  </label>
                  {editando ? (
                    <CustomSelect
                      label="Tu rol"
                      options={roles}
                      value={perfil?.rol || ''}
                      onChange={(selectedRol) => setPerfil(prev => ({ ...prev, rol: selectedRol }))}
                      multiple={false}
                      width="100%"
                      margin={0}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{perfil?.rol || 'Rol'}</p>
                  )}
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
                  {Array.isArray(usuarios) && usuarios.length > 0 ? (
                    usuarios.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {fotoPreview ? (
                      <img
                        src={fotoPreview}
                        alt="Foto de perfil"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : perfil.photo_perfil ? (
                      <img
                        src={getMediaUrl(perfil.photo_perfil)}
                        alt="Foto de perfil"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Person className="text-5xl" />
                    )}
                  </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {user.nombre} {user.apellido}
                            </h3>
                            <p className="text-gray-600 text-sm">{user.correo}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`px-4 py-2 rounded-full text-l font-medium ${user.activo
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}>
                                {user.activo ? "Activo" : "Inactivo"}
                              </span>
                              <span className="text-gray-800 text-l capitalize">{user.rol}</span>
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
                            onClick={() => {
                              eliminarUsuario(user.id);
                            }
                            }
                            className={`p-2 rounded-lg transition-colors ${user.activo
                              ? "text-orange-600 hover:bg-orange-50"
                              : "text-green-600 hover:bg-green-50"
                              }`}
                            title={user.activo ? "Desactivar usuario" : "Activar usuario"}
                          >
                            {user.activo ? <DeleteForever /> : <CheckCircle />}
                          </button>
                        </div>
                      </div>
                    ))) : (<p className="text-gray-500"> No hay usuarios registrados.</p>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para nuevo usuario */}
      {mostrarFormUsuario && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Usuario</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={nuevoUsuario.nombre}
                    onChange={(e) => setNuevoUsuario(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input
                    type="text"
                    value={nuevoUsuario.apellido}
                    onChange={(e) => setNuevoUsuario(prev => ({ ...prev, apellido: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
                  <input
                    type="email"
                    value={nuevoUsuario.correo}
                    onChange={(e) => setNuevoUsuario(prev => ({ ...prev, correo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario *</label>
                  <input
                    type="text"
                    value={nuevoUsuario.username}
                    onChange={(e) => setNuevoUsuario(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                  <input
                    type="password"
                    value={nuevoUsuario.password}
                    onChange={(e) => setNuevoUsuario(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <CustomSelect
                  label="Rol del usuario"
                  options={roles}
                  value={nuevoUsuario.rol}
                  onChange={(selectedRol) => setNuevoUsuario(prev => ({ ...prev, rol: selectedRol }))}
                  multiple={false}
                  width="100%"
                  margin={0}
                  required={true}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cerrarModal}
                  className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearUsuario}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                >
                  Crear Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal para editar usuario */}
      {usuarioEditando && (
        <div className="fixed inset-0 flex backdrop-blur-[2px] items-center justify-center p-4 z-50">
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
                <CustomSelect
                  label="Rol del usuario"
                  options={roles}
                  value={usuarioEditando.rol}
                  onChange={(selectedRol) => setUsuarioEditando(prev => ({ ...prev, rol: selectedRol }))}
                  multiple={false}
                  width="100%"
                  margin={0}
                  required={true}
                />
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