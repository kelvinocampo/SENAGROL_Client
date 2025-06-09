import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import senagrol from "@assets/senagrol.png";
import Image1 from "@assets/LoginImg.jpg";
import Image2 from "@assets/Travel.jpg";
import Image3 from "@assets/co.jpg";
import { InicioService } from "@/services/Perfil/inicioServices";
import { Input } from "@components/Input";
import { Paragraph } from "@/components/Inicio/Paragraph";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const images = [Image1, Image2, Image3];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
};

const shake = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.5 },
  },
};

export const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await InicioService.login(identifier, password);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center bg-white">
      <div className="w-full h-full max-w-8xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Volver */}
        <div className="absolute top-5 left-5 z-10">
          <Link
            to="/"
            className="inline-flex items-center text-green-700 hover:text-green-900 font-medium transition-colors duration-300"
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
            Volver al inicio
          </Link>
        </div>

        {/* Formulario */}
        <motion.div
          className="relative w-full md:w-1/2 h-full p-6 sm:p-10 flex items-center justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border-4 border-[#48BD28] rounded-full p-1 shadow-lg"
          >
            <img
              src={senagrol}
              alt="Avatar"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
            />
          </motion.div>

          <motion.div
            className="w-full max-w-md mt-16 md:mt-0"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.div
              variants={fadeInUp}
              custom={0}
              className="flex justify-between mb-6 border-b border-gray-300 pb-2 text-sm sm:text-base"
            >
              <span className="text-black font-semibold border-b-2 border-[#48BD28] pb-1 transition-all duration-300">
                Login
              </span>
              <span
                onClick={() => navigate("/Register")}
                className="text-gray-400 cursor-pointer hover:text-black transition-colors duration-300"
              >
                Registro
              </span>
            </motion.div>

            <motion.form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              <motion.div variants={fadeInUp} custom={1}>
                <Input
                  className="text-black transition-all duration-300 focus:scale-[1.02] focus:ring-2 focus:ring-[#48BD28]"
                  label="Usuario o correo electrónico"
                  type="text"
                  name="identifier"
                  placeholder="Ingresa tu usuario o correo"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </motion.div>

              <motion.div variants={fadeInUp} custom={2} className="relative">
                <Input
                  className="text-black transition-all duration-300 focus:scale-[1.02] focus:ring-2 focus:ring-[#48BD28]"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-black transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </motion.div>

              {error && (
                <motion.p
                  className="text-[#F10E0E] text-sm font-medium"
                  initial="hidden"
                  animate="visible"
                  variants={shake}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                variants={fadeInUp}
                custom={4}
                type="submit"
                className="w-full bg-[#48BD28] text-white py-2 rounded-lg hover:bg-[#379e1b] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </motion.button>

              <motion.div variants={fadeInUp} custom={5}>
                <Paragraph />
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>

        {/* Imagen lateral con animación */}
        <div className="hidden md:block md:w-1/2 h-full">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt="Decoración login"
            className="w-full h-full object-cover"
            initial={{ opacity: 0.6, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </div>
  );
};
