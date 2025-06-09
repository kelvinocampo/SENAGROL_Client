import React, { useState } from "react";
import { receiveBuyCode } from "@/services/Perfil/EscanearQr&codigo";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const ManualCodeForm: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");
  const [focused, setFocused] = useState(false);

  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await receiveBuyCode(codigo, token);
      setMessage(res.message || "Compra actualizada correctamente.");
      setStatus("success");

      // Esperar un momento para mostrar el mensaje y luego redirigir
      setTimeout(() => {
        navigate("/mistransportes"); // Ajusta esta ruta si tu ruta real es diferente
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
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-4 pt-6 self-start">
        <Link
          to="/mistransportes"
          className="inline-flex items-center text-green-700 hover:text-green-900 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Volver a Mis Transportes
        </Link>
      </div>
      <motion.h1
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        Ingresar Código de Compra
      </motion.h1>
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 transition ${inputClass}`}
          placeholder="Ingresa el código de compra"
          required
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          type="submit"
          className="w-full bg-[#48BD28] text-white font-semibold py-2 rounded transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Confirmar Código
        </motion.button>
        {message && (
          <motion.p
            className={`mt-4 text-sm font-medium ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.p>
        )}
      </motion.form>
    </motion.div>
  );
};

export default ManualCodeForm;
