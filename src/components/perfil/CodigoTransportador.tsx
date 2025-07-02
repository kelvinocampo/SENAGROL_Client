import React, { useState, useEffect, useRef } from "react";
import { receiveBuyCode } from "@/services/Perfil/EscanearQr&codigo";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
   compraId: number | null; // 👈 AÑADIDO
};

const ManualCodeForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const [codigo, setCodigo] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await receiveBuyCode(codigo, token);
      setMessage(res.message || "Compra actualizada correctamente.");
      setStatus("success");
      setTimeout(() => {
        navigate("/mistransportes");
        onClose();
      }, 2000);
    } catch (err: any) {
      setMessage(err.message || "Ocurrió un error.");
      setStatus("error");
    }
  };

  const inputClass = focused
    ? "border-[#48BD28] focus:ring-[#48BD28]"
    : status === "success"
    ? "border-[#48BD28] focus:ring-[#48BD28]"
    : status === "error"
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-gray-300";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 bg-opacity-40"
          onClick={handleClickOutside}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-xl shadow-lg w-full flex-1  max-w-md p-8 relative mx-4"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            
            <h2 className="text-xl font-bold text-center mb-5">
              Ingresar Código de Compra
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`w-full p-2 border shadow-gray-400 rounded-xl focus:outline-none focus:ring-2 transition ${inputClass}`}
                placeholder="*****"
                required
              />
              <div className="flex w-full justify-end my-5">
                   <motion.button
                type="submit"
                className="w-30 bg-[#D9D9D9] text-black font-semibold py-2 rounded-full transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  onClick={onClose}
              >
                Cancelar
              </motion.button>
                <motion.button
                type="submit"
                className="w-30 bg-[#48BD28] text-white font-semibold py-2 rounded-full transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Confirmar 
              </motion.button>

              </div>

           
              {message && (
                <motion.p
                  className={`text-sm font-medium ${
                    status === "success" ? "text-green-600" : "text-red-600"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {message}
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ManualCodeForm;
