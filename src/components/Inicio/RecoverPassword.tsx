import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RecoverPasswordContext } from "@/contexts/User/UserManagement";
import senagrol from "@assets/senagrol.png";
import Image1 from "@assets/login.png"; // Imagen fija

export const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const context = useContext(RecoverPasswordContext);
  if (!context) {
    throw new Error("RecoverPassword debe usarse dentro de un RecoverPasswordProvider");
  }

  const { recoverPassword, message, error } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recoverPassword(email);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <div className="w-full flex flex-col md:flex-row">
        {/* Volver al inicio */}
        <div className="fixed top-5 left-5 z-20 text-sm text-green-600 font-semibold cursor-pointer hover:underline">
          <span onClick={() => navigate("/")}>← Volver al inicio</span>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-10 py-12 ">
          <motion.div
            className="w-full max-w-[450px]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src={senagrol}
                alt="Senagrol"
                className="w-20 h-20 rounded-full shadow-md"
              />
            </div>

            {/* Pestañas: Login | Registro */}
            <div className="flex justify-between mb-6 border-b border-gray-300 pb-2 text-sm sm:text-base">
              <span
                onClick={() => navigate("/Login")}
                className="text-black font-semibold border-b-2 border-[#48BD28] pb-1 cursor-pointer"
              >
                Iniciar sesión
              </span>
              <span
                onClick={() => navigate("/Register")}
                className="text-gray-400 cursor-pointer hover:text-black transition-colors duration-300"
              >
                Registro
              </span>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu usuario o correo electrónico"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#48BD28] text-black transition-all duration-300"
                />
              </div>

              {message && (
                <p className="text-green-600 text-sm text-center">{message}</p>
              )}
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#48BD28] text-white py-2 rounded-md font-bold hover:bg-[#379e1b] transition duration-300"
              >
                Enviar correo
              </button>
            </form>
          </motion.div>
        </div>

        {/* Imagen derecha */}
        <div className="hidden md:block md:w-1/2 h-screen">
          <img
            src={Image1}
            alt="Decoración"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
