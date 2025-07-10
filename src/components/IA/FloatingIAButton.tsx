// src/components/IA/FloatingIAButton.tsx
import { useEffect, useState } from "react";
import { CiChat1 } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingIAButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mostrar automáticamente el mensaje solo en la página principal y por 5 segundos
  useEffect(() => {
    if (location.pathname === "/") {
      setShowTooltip(true);
      const timeout = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(timeout);
    } else {
      setShowTooltip(false);
    }
  }, [location.pathname]);

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip descriptivo */}
      <AnimatePresence>
        {(isHovered || showTooltip) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-white text-gray-800 text-sm max-w-xs shadow-lg rounded-md px-4 py-2 border border-gray-200"
          >
            Soy tu asistente inteligente. Puedo ayudarte a encontrar productos, guiarte en tus compras y resolver dudas sobre el sistema.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/IA")}
        aria-label="Ir al Asistente IA"
        className="bg-[#48BD28] hover:bg-[#379E1B] text-white p-4 rounded-full shadow-2xl"
      >
        <CiChat1 size={24} />
      </motion.button>
    </div>
  );
}
