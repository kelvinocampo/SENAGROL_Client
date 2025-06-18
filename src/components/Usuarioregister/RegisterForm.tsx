/* -------------------------------------------------------------
   src/pages/RegisterForm.tsx
   - Logo fijo arriba del formulario (no se cruza con inputs)
   - Sin bordes/fondos verdes extra
   - 100 % responsive (xs → xl)
------------------------------------------------------------- */

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BackToHome } from "@components/admin/common/BackToHome";
import { motion } from "framer-motion";
import senagrol from "@assets/senagrol.png";
import Image1 from "@assets/co.jpg";
import Image2 from "@assets/Travel.jpg";
import Image3 from "@assets/LoginImg.jpg";
import { InicioService } from "@/services/Perfil/inicioServices";
import { Input } from "@components/Input";

/* ----------------- Slider ----------------- */
const images = [Image1, Image2, Image3];

/* ----------------- Animaciones ----------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.15 },
  },
};
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export function RegisterForm() {
  /* ---------- Estados de formulario ---------- */
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

  /* ---------- Slider ---------- */
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const int = setInterval(() => setCurrentImage((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(int);
  }, []);

  /* ---------- Password strength ---------- */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    let sc = 0;
    if (pwd.length >= 8) sc += 30;
    if (/[A-Z]/.test(pwd)) sc += 20;
    if (/[0-9]/.test(pwd)) sc += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) sc += 30;
    setStrength(Math.min(sc, 100));
  };

  /* ---------- Validación ---------- */
  const validate = () => {
    const e = { ...errors };
    e.name = !name.trim() ? "El nombre completo es obligatorio." : "";
    e.username = !username.trim() ? "El nombre de usuario es obligatorio." : "";
    e.email =
      !email.trim() || !/\S+@\S+\.\S+/.test(email) ? "Correo inválido." : "";
    e.phone = !phone.trim() ? "El número es obligatorio." : "";
    e.password = password.length < 8 ? "Debe tener al menos 8 caracteres." : "";
    e.confirmPassword =
      password !== confirmPassword ? "Las contraseñas no coinciden." : "";
    setErrors(e);
    return Object.values(e).every((v) => v === "");
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
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
      setMessage("Cuenta creada exitosamente.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      let msg = "Error al registrar.";
      const txt = err?.errorInfo?.toString().toLowerCase() || "";
      if (txt.includes("duplicate") || txt.includes("ya existe"))
        msg = "Ya existe una cuenta con este correo o nombre de usuario.";
      else if (txt.includes("invalid") || txt.includes("inválido"))
        msg = "Verifica que todos los datos estén correctos.";
      else msg = err.errorInfo || err.message || msg;
      setMessage(msg);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full flex flex-col md:flex-row">
        <div className="fixed top-5 left-5 z-20">
          <BackToHome />
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-10 py-12 bg-white">
          <motion.div
            className="w-full max-w-[450px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-center mb-8">
              <img
                src={senagrol}
                alt="Senagrol"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-md"
              />
            </div>

            <div className="flex justify-between mb-6 border-b border-gray-300 pb-2 text-sm sm:text-base">
              <motion.span
                onClick={() => navigate("/login")}
                className="text-gray-400 cursor-pointer hover:text-black"
                whileHover={{ scale: 1.05 }}
              >
                Login
              </motion.span>
              <span className="text-black font-semibold border-b-2 border-[#48BD28] pb-1">
                Registro
              </span>
            </div>

            <motion.form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <motion.div variants={fadeInUp}>
                <Input
                  name="username"
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
                  name="name"
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

              {/* Contraseña */}
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
                    className={`h-2 rounded ${
                      strength < 50 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Usa mínimo 8 caracteres, una mayúscula y un símbolo.
                </p>
              </motion.div>

              {/* Confirmar contraseña */}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

              {/* Botón */}
              <motion.button
                type="submit"
                variants={fadeInUp}
                className="bg-[#48BD28] text-white font-bold py-2 px-4 rounded-md hover:bg-[#379E1B] transition"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                Registrarse
              </motion.button>
            </motion.form>
          </motion.div>
        </div>

  
        <div className="hidden md:block md:w-1/2 h-screen">
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
