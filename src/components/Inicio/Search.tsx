import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

interface BuscadorProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
  setPaginaActual: (page: number) => void;
  placeholderText: string;
  inputClassName?: string;
  containerClassName?: string; // ✅
}

export default function Buscador({
  busqueda,
  setBusqueda,
  setPaginaActual,
  placeholderText,
  inputClassName = "",
  containerClassName = "", // ✅
}: BuscadorProps) {
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setPlaceholder("");
    setIndex(0);
  }, [placeholderText]);

  useEffect(() => {
    if (index < placeholderText.length) {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + placeholderText[index]);
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, placeholderText]);

  return (
    <motion.div
      className={`flex mb-0 px-0 ${containerClassName}`} // ✅ Permite control externo del ancho
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="relative w-full"
        animate={{ scale: isFocused ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
        <motion.input
          type="text"
          value={busqueda}
          placeholder={placeholder}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ boxShadow: "0 0 0 4px rgba(34,197,94,0.4)" }}
          className={`w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-white ${inputClassName}`}
        />
      </motion.div>
    </motion.div>
  );
}
