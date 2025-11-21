import { motion, AnimatePresence } from "framer-motion";
import { Person, Lock as LockIcon, RemoveRedEye as EyeIcon, VisibilityOff as EyeOffIcon } from "@mui/icons-material";
import LibrarySVG from "../../assets/images/alumnas.svg";
import Fondo from "../../assets/images/Fondo.svg";
import { useState } from "react";
import Swal from 'sweetalert2';
import { login } from "../../apis/auth.api";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../context/UserContext";
import CircularProgress from '@mui/material/CircularProgress';
import {
  pageVariants,
  buttonVariants,
  iconVariants,
  cardVariants,
  formItemVariants,
  backdropVariants,
  AnimatedButton,
  AnimatedIcon,
  AnimatedCard
} from "../../../src/animations/animations";

export default function Login() {
  const { loginUser } = useUser();
  const navi = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  // Animaciones específicas para el login
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const backgroundVariants = {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  
  return (
    <motion.div 
      className="relative h-screen w-full overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <CircularProgress 
                size={60} 
                color="primary" 
                sx={{ color: '#005BEA' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        src={Fondo}
        alt="Fondo"
        className="absolute w-full h-full object-cover"
        variants={backgroundVariants}
        animate="animate"
      />
      
      <div className="flex items-center justify-center h-full relative z-10">
        <AnimatedCard className="flex flex-row shadow-2xl h-[80vh] w-[140vh] bg-amber-300 rounded-3xl overflow-hidden border border-white/20">
          <motion.div 
            className="bg-white h-full w-1/2 relative overflow-hidden"
            variants={imageVariants}
          >
            <motion.img
              src={LibrarySVG}
              alt="Imagen"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 bg-black/10"
              whileHover={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Formulario */}
          <motion.div 
            className="bg-[#005BEA] h-full w-1/2 flex flex-col items-center justify-center gap-5 relative overflow-hidden"
            variants={formVariants}
          >
            {/* Efecto de fondo animado */}
            <motion.div
              className="absolute inset-0 "
              animate={{
                background: [
                  'linear-gradient(45deg, #005BEA 0%, #00C6FB 100%)',
                  'linear-gradient(45deg, #00C6FB 0%, #005BEA 100%)',
                  'linear-gradient(45deg, #005BEA 0%, #00C6FB 100%)'
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.h1 
              className="font-montserratB text-white text-4xl mb-10 flex items-center gap-2 select-none relative z-10"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              ¡Bienvenido!
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👋
              </motion.span>
            </motion.h1>

            <motion.form 
              className="flex flex-col gap-10 relative z-10 w-full max-w-xs"
              onSubmit={handleSubmit}
              variants={containerVariants}
            >
              {/* Campo de usuario */}
              <motion.div 
                className="relative bg-white flex items-center rounded-3xl h-12 w-full pl-12 pr-4 select-none shadow-lg"
                variants={formItemVariants}
                whileFocus="hover"
              >
                <AnimatedIcon>
                  <Person className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none" />
                </AnimatedIcon>
                <motion.input
                  type="text"
                  className="focus:outline-none w-full bg-transparent text-gray-800 placeholder-gray-500"
                  placeholder="Nombre de Usuario"
                  value={username}
                  onChange={((e) => setUsername(e.target.value))}
                  whileFocus={{ 
                    scale: 1.02,
                  }}
                />
              </motion.div>

              {/* Campo de contraseña */}
              <motion.div 
                className="relative bg-white flex items-center rounded-3xl h-12 w-full pl-12 pr-12 select-none shadow-lg"
                variants={formItemVariants}
              >
                <AnimatedIcon>
                  <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none" />
                </AnimatedIcon>
                <motion.input
                  type={passwordVisible ? "text" : "password"}
                  className="focus:outline-none w-full bg-transparent text-gray-800 placeholder-gray-500"
                  placeholder="Contraseña"
                  value={password}
                  onChange={((e) => setPassword(e.target.value))}
                  whileFocus={{ 
                    scale: 1.02,
                  }}
                />
                <AnimatedButton
                  type="button"
                  className="absolute right-3 bg-white rounded-full items-center justify-center w-8 h-8 flex hover:cursor-pointer hover:bg-gray-200 border border-gray-200"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatedIcon>
                    {passwordVisible ? (
                      <EyeOffIcon className="text-gray-600 text-sm" />
                    ) : (
                      <EyeIcon className="text-gray-600 text-sm" />
                    )}
                  </AnimatedIcon>
                </AnimatedButton>
              </motion.div>

              {/* Botón de ingreso */}
              <motion.div 
                className="w-full flex justify-center items-center relative"
                variants={formItemVariants}
              >
                <AnimatedButton
                  disabled={loading}
                  type="submit"
                  className="rounded-3xl bg-white flex justify-center text-gray-700 w-[60%] h-12 items-center hover:cursor-pointer shadow-lg relative overflow-hidden border-2 border-amber-400"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  <motion.span 
                    className="select-none font-semibold text-lg relative z-10"
                    animate={{ color: isHovered ? '#FFFFFF' : '#374151' }}
                  >
                    Ingresar
                  </motion.span>
                  
                  {/* Efecto de fondo animado en hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: isHovered ? "0%" : "-100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatedButton>

                {/* Efecto de pulso cuando el formulario está listo */}
                
              </motion.div>
            </motion.form>
       
          </motion.div>
        </AnimatedCard>
      </div>
    </motion.div>
  );
}