import { Person } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import LibrarySVG from "../../assets/images/alumnas.svg";
import Fondo from "../../assets/images/Fondo.svg";
import { useState } from "react";
export default function Login() {
  const [password, setPassword] = useState("text");

  return (
    <div className="relative h-screen w-full">
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

            <form className="flex flex-col gap-10">
              <div className="relative bg-white flex items-center rounded-3xl h-10 w-80 pl-10 pr-3 select-none">
                <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none" />
                <input
                  type="text"
                  className="focus:outline-none w-full"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="relative bg-white flex items-center rounded-3xl h-10 w-80 pl-10 pr-3 selec-none">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none" />
                <input
                  type={password}
                  className="focus:outline-none w-full"
                  placeholder="Tu contraseña"
                />
                <button
                type="button"
                  className="bg-white rounded-full items-center justify-center w-10 y-10 flex hover:cursor-pointer hover:bg-gray-400"
                  onClick={() =>  password === "password" ? setPassword("text") : setPassword("password") }  
                >
                  {password &&( <RemoveRedEyeIcon className="text-gray-400 hover:text-white " />)}
                  
                </button>
              </div>

              <div className="w-full flex justify-center items-center">
                <button className="rounded-4xl bg-white flex justify-center text-gray-700 w-[50%] h-10 items-center hover:cursor-pointer hover:bg-amber-400 hover:text-white select-none">
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
