import { motion } from "framer-motion";

// Animaciones para el contenedor principal
export const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  out: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.3 }
  }
};

// Animaciones para el header
export const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Animaciones para botones
export const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Animaciones para íconos
export const iconVariants = {
  hover: { 
    rotate: 360, 
    transition: { duration: 0.5 } 
  },
  tap: { 
    scale: 0.9,
    transition: { duration: 0.1 }
  }
};

// Animaciones para cards y elementos de lista
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

// Animaciones para filtros
export const filterVariants = {
  hidden: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.3 }
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Animaciones para elementos de formulario
export const formItemVariants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4
    }
  })
};

// Animaciones para modales
export const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: -50
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: { duration: 0.3 }
  }
};

// Animaciones para backdrop
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Componentes animados preconfigurados
export const AnimatedButton = ({ children, className, onClick, ...props }) => (
  <motion.button
    className={className}
    onClick={onClick}
    variants={buttonVariants}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    {...props}
  >
    {children}
  </motion.button>
);

export const AnimatedCard = ({ children, className, custom = 0, ...props }) => (
  <motion.div
    className={className}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    custom={custom}
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedIcon = ({ children, className, ...props }) => (
  <motion.span
    className={className}
    variants={iconVariants}
    whileHover="hover"
    whileTap="tap"
    {...props}
  >
    {children}
  </motion.span>
);

export const AnimatedContainer = ({ children, className, ...props }) => (
  <motion.div
    className={className}
    variants={pageVariants}
    initial="initial"
    animate="in"
    exit="out"
    {...props}
  >
    {children}
  </motion.div>
);