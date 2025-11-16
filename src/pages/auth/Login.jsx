import { Person, Lock as LockIcon, RemoveRedEye as EyeIcon, VisibilityOff as EyeOffIcon } from "@mui/icons-material";
import LibrarySVG from "../../assets/images/alumnas.svg";
import Fondo from "../../assets/images/Fondo.svg";
import { useState } from "react";
import Swal from 'sweetalert2';
import { login } from "../../apis/auth.api";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../context/UserContext";
import CircularProgress from '@mui/material/CircularProgress';


export default function Login() {
  const { loginUser } = useUser();
  const navi = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire('Campos incompletos.', 'Debes llenar todos los campos', 'warning');
      return;
    }
    setLoading(true);
    try {
      const response = await login({ username, password });

      if (response.status === 200) {
        loginUser(response.data.user, response.data.token);
        await Swal.fire('Bienvenido', 'Inicio de Sesion exitoso', 'success');
        navi('/dashboard');

      }

    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Credenciales incorrectas.", "error");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="relative h-screen w-full">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center z-50">

            <div className="absolute inset-0 backdrop-blur-sm"></div>

            <CircularProgress size={60} color="primary" />
          </div>
        )}
      <img
        src={Fondo}
        alt="Fondo"
        className="absolute  w-full h-full object-cover "
      />
      <div className="flex items-center justify-center h-full relative z-10">
        <div className="flex flex-row shadow-glowblue h-[80vh] w-[140vh] bg-amber-300 rounded-3xl">
          <div className="bg-white h-full w-1/2">
            <img
              src={LibrarySVG}
              alt="Imagen"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-[#005BEA] h-full w-1/2 flex flex-col items-center justify-center gap-5">
            <h1 className="font-montserratB text-white text-3xl mb-10 flex items-center gap-2 select-none">
              Bienvenido!
            </h1>

            <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
              <div className="relative bg-white flex items-center rounded-3xl h-10 w-80 pl-10 pr-3 select-none">
                <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none" />
                <input
                  type="text"
                  className="focus:outline-none w-full"
                  placeholder="Nombre de Usuario"
                  value={username}
                  onChange={((e) => setUsername(e.target.value))}
                />
              </div>

              <div className="relative bg-white flex items-center rounded-3xl h-10 w-80 pl-10 pr-3 selec-none">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="focus:outline-none w-full"
                  placeholder="Contraseña"
                  value={password}
                  onChange={((e) => setPassword(e.target.value))}
                />
                <button
                  type="button"
                  className="bg-white rounded-full items-center justify-center w-10 y-10 flex hover:cursor-pointer hover:bg-gray-400"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOffIcon className="text-gray-400" />
                  ) : (
                    <EyeIcon className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="w-full flex justify-center items-center">
                <button disabled={loading} className="rounded-4xl bg-white flex justify-center text-gray-700 w-[50%] h-10 items-center hover:cursor-pointer hover:bg-amber-400 hover:text-white select-none">
                  <span className="select-none">Ingresar</span>

                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
