import React from "react";
import { motion } from "framer-motion";

type FloatingIconProps = {
  icon: React.ReactNode;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  size?: string; // para tamaño opcional
  className?: string; // para estilos adicionales si quieres
};

const FloatingIcon: React.FC<FloatingIconProps> = ({
  icon,
  top,
  right,
  bottom,
  left,
  size = "6rem", // 24 = 6rem
  className = "",
}) => {
  const style = {
    position: "fixed" as const,
    top,
    right,
    bottom,
    left,
    width: size,
    height: size,
    pointerEvents: "none",
    opacity: 0.9,
    zIndex: 50,
  };

  return (
    <motion.div
      style={style}
      className={className}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {icon}
    </motion.div>
  );
};

export default FloatingIcon;
