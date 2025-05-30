import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RecoverPasswordContext } from "@/contexts/User/UserManagement";
import senagrol from "@assets/senagrol.png";
import Image1 from "@assets/Fotos de Cafe - Descarga fotos gratis de gran calidad _ Freepik.jpg";
import Image2 from "@assets/Travel.jpg";
import Image3 from "@assets/🇨🇴.jpg";

const images = [Image1, Image2, Image3];

export const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const context = useContext(RecoverPasswordContext);
  if (!context) {
    throw new Error("RecoverPassword debe usarse dentro de un RecoverPasswordProvider");
  }

  const { recoverPassword, message, error } = context;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recoverPassword(email);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#48BD28]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-full max-w-8xl bg-white shadow-lg flex flex-col md:flex-row overflow-hidden"
      >
        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative w-full md:w-1/2 h-full p-6 sm:p-10 flex items-center justify-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border-4 border-[#48BD28] rounded-full p-1 shadow-lg"
          >
            <img
              src={senagrol}
              alt="Logo"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
            />
          </motion.div>

          <div className="w-full max-w-md mt-16 md:mt-0">
            <div className="flex justify-between mb-6 border-b border-gray-300 pb-2 text-sm sm:text-base">
              <span
                onClick={() => navigate("/Login")}
                className="text-gray-400 cursor-pointer hover:text-black transition-colors duration-300"
              >
                Login
              </span>
              <span
                onClick={() => navigate("/Register")}
                className="text-gray-400 cursor-pointer hover:text-black transition-colors duration-300"
              >
                Registro
              </span>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48BD28] text-black transition-all duration-300"
                />
              </div>

              {message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-600 text-sm text-center"
                >
                  {message}
                </motion.p>
              )}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-600 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#48BD28] text-white py-2 rounded-lg hover:bg-[#379e1b] transition-colors duration-300"
              >
                Enviar correo
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        {/* Imagen lateral */}
        <div className="hidden md:block md:w-1/2 h-full relative overflow-hidden">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt="Decoración"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default RecoverPassword;
