// src/pages/RegisterForm.tsx
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import senagrol from "@assets/senagrol.png";
import Image1 from "@assets/co.jpg";
import Image2 from "@assets/Travel.jpg";
import Image3 from "@assets/LoginImg.jpg";
import { InicioService } from "@/services/Perfil/inicioServices";
import { Input } from "@components/Input";

const images = [Image1, Image2, Image3];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function RegisterForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);

    let score = 0;
    if (pwd.length >= 8) score += 30;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 30;

    setStrength(Math.min(score, 100));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    } as typeof errors;

    if (!name.trim()) newErrors.name = "El nombre completo es obligatorio.";
    if (!username.trim()) newErrors.username = "El nombre de usuario es obligatorio.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Correo inválido.";
    if (!phone.trim()) newErrors.phone = "El número es obligatorio.";
    if (password.length < 8)
      newErrors.password = "Debe tener al menos 8 caracteres.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden.";

    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Flujo alterno 1: Datos incorrectos (se valida en frontend primero)
    if (!validateForm()) {
      setMessage("Error en los datos. Por favor, verifica e intenta nuevamente.");
      return;
    }

    try {
      await InicioService.register(
        name,
        username,
        email,
        password,
        phone,
        confirmPassword
      );

      // Flujo principal: cuenta creada
      setMessage("Cuenta creada exitosamente.");

      // Redirige tras 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
   } catch (error: any) {
  let errorMessage = "Error al registrar.";

  const info = error?.errorInfo?.toString().toLowerCase() || "";

  if (info.includes("duplicate") || info.includes("ya existe")) {
    errorMessage = "Ya existe una cuenta con este correo o nombre de usuario.";
  } else if (info.includes("invalid") || info.includes("inválido") || info.includes("tienes")) {
    errorMessage = "Verifica que todos los datos estén correctos.";
  } else {
    errorMessage = error.errorInfo || error.message || errorMessage;
  }

  setMessage(errorMessage);
}

  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#48BD28]">
      <div className="w-full max-w-8xl h-full flex flex-col md:flex-row bg-white overflow-hidden shadow-lg">
        {/* Enlace de regreso */}
        <div className="px-4 pt-6">
          <Link
            to="/"
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
            Volver al inicio
          </Link>
        </div>

        {/* Formulario */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white border-4 border-[#48BD28] rounded-full p-1 shadow-md">
            <img
              src={senagrol}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
            />
          </div>

          <motion.div
            className="w-full max-w-[450px] mt-20 md:mt-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tabs */}
            <div className="flex justify-between mb-6 border-b border-gray-300 pb-2 text-sm sm:text-base">
              <motion.span
                onClick={() => navigate("/login")}
                className="text-gray-400 cursor-pointer hover:text-black"
                whileHover={{ scale: 1.1, color: "#000000" }}
                transition={{ duration: 0.2 }}
              >
                Login
              </motion.span>
              <span className="text-black font-semibold border-b-2 border-[#48BD28] pb-1">
                Registro
              </span>
            </div>

            {/* Form */}
            <motion.form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <motion.div variants={fadeInUp}>
                <Input
                  name="name"
                  label="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Input
                  name="email"
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Input
                  name="nombre completo"
                  label="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Input
                  name="phone"
                  label="Teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeInUp} className="relative">
                <Input
                  name="password"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
                <div className="w-full bg-gray-200 h-2 rounded mt-1">
                  <div
                    className={`h-2 rounded ${strength < 50 ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${strength}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Usa mínimo 8 caracteres, una mayúscula y un símbolo.
                </p>
              </motion.div>

              {/* Confirm password */}
              <motion.div variants={fadeInUp} className="relative">
                <Input
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                  onClick={() => setShowConfirmPassword(!setShowConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </motion.div>

              {/* Mensajes */}
              {message && (
                <motion.p
                  variants={fadeInUp}
                  className={`text-sm font-medium ${
                    message.toLowerCase().includes("exitosamente")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </motion.p>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                className="bg-[#48BD28] text-white font-bold py-2 px-4 rounded-md hover:bg-[#379E1B]"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                Registrarse
              </motion.button>
            </motion.form>
          </motion.div>
        </div>

        {/* Imagen del slider */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src={images[currentImage]}
            alt="slider"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
