import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BackToHome } from "@components/admin/common/BackToHome";
import { motion } from "framer-motion";
import senagrol from "@assets/senagrol.png";
import Image1 from "@assets/login.png";
import { InicioService } from "@/services/Perfil/inicioServices";
import { Input } from "@components/Input";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState(0);
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

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

  const validate = () => {
    const e = { ...errors };
    e.name = !name.trim() ? "El nombre completo es obligatorio." : "";
    e.username = !username.trim() ? "El nombre de usuario es obligatorio." : "";
    e.email = !email.trim() || !/\S+@\S+\.\S+/.test(email) ? "Correo inválido." : "";
    e.phone = !phone.trim() ? "El número es obligatorio." : "";
    e.password = password.length < 8 ? "Debe tener al menos 8 caracteres." : "";
    e.confirmPassword = password !== confirmPassword ? "Las contraseñas no coinciden." : "";
    setErrors(e);
    return Object.values(e).every((v) => v === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setMessage("Error en los datos. Por favor, verifica e intenta nuevamente.");
      return;
    }
    try {
      await InicioService.register(name, username, email, password, phone, confirmPassword);
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="w-full flex flex-col md:flex-row">
        {/* Botón volver al inicio */}
        <div className="fixed top-5 left-5 z-20">
          <BackToHome />
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-10 py-12 bg-gradient-to-b from-[#e4fbdd] to-[#f4fcf1] max-h-screen overflow-y-auto">
          <motion.div className="w-full max-w-[450px] space-y-4">
            {/* Logo */}
            <div className="flex justify-center mb-2">
              <img
                src={senagrol}
                alt="Senagrol"
                className="w-20 h-20 rounded-full shadow-md"
              />
            </div>

            {/* Encabezado */}
            <div className="flex justify-between mb-4 border-b border-gray-300 pb-1 text-sm sm:text-base">
              <motion.span
                onClick={() => navigate("/login")}
                className="text-gray-400 cursor-pointer hover:text-black"
              >
                Iniciar sesión
              </motion.span>
              <span className="text-black font-semibold border-b-2 border-[#48BD28] pb-1">
                Registro
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="username"
                label="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={errors.username}
                placeholder="ingresa tu nombre de usuario"
              />

              <Input
                name="name"
                label="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="ingresa tu nombre completo"
              />

              <Input
                name="email"
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="ingresa tu correo electrónico"
              />

              <Input
                name="phone"
                label="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                placeholder="ingresa tu número de teléfono"
              />

              <div className="relative">
                <Input
                  name="password"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  placeholder="ingresa tu contraseña"
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
                  />
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Usa mínimo 8 caracteres, una mayúscula y un símbolo.
                </p>
              </div>

              <div className="relative">
                <Input
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  placeholder="ingresa tu contraseña"
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {message && (
                <p
                  className={`text-sm font-medium ${
                    message.toLowerCase().includes("exitosamente")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#48BD28] text-white py-2 rounded-md font-bold hover:bg-[#379E1B] transition"
              >
                Registrarse
              </button>
            </form>
          </motion.div>
        </div>

        {/* Imagen derecha fija (responsive) */}
        <div className="hidden md:flex md:w-1/2 h-screen">
          <img
            src={Image1}
            alt="Imagen"
            className="w-full h-full object-contain md:object-cover"
          />
        </div>
      </div>
    </div>
  );
}
