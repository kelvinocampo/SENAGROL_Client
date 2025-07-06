import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackToHome } from "@components/admin/common/BackToHome";
import senagrol from "@assets/senagrol.png";
import Image1 from "@assets/login.png";
import { InicioService } from "@/services/Perfil/inicioServices";
import { Input } from "@components/Input";
import { Paragraph } from "@components/Inicio/Paragraph";
import { Eye, EyeOff } from "lucide-react";

export const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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
    <div className="h-screen w-full flex items-center">
      <div className="w-full h-full flex flex-col md:flex-row">
        {/* Botón volver al inicio */}
        <div className="absolute top-5 left-5 z-10">
          <BackToHome />
        </div>

        {/* Lado izquierdo: Formulario */}
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center px-6 sm:px-10 ">
          {/* Logo */}
          <div className="mb-6">
            <img
              src={senagrol}
              alt="Logo Senagrol"
              className="w-24 h-24 object-cover"
            />
          </div>

          {/* Encabezado */}
          <div className="flex justify-between w-full max-w-md mb-6 border-b border-gray-300 pb-2 text-sm sm:text-base">
            <span className="text-black font-semibold border-b-2 border-[#48BD28] pb-1">
              Iniciar sesión
            </span>
            <span
              onClick={() => navigate("/Register")}
              className="text-gray-400 cursor-pointer hover:text-black transition-colors"
            >
              Registro
            </span>
          </div>

          {/* Formulario */}
          <form
            className="w-full max-w-md flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <Input
              className="text-black focus:ring-2 focus:ring-[#48BD28]"
              label="Usuario o correo electrónico"
              type="text"
              name="identifier"
              placeholder="Ingresa tu usuario o correo"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <div className="relative">
              <Input
                className="text-black focus:ring-2 focus:ring-[#48BD28]"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {error && (
              <p className="text-[#F10E0E] text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#48BD28] text-white py-2 rounded-lg hover:bg-[#379e1b] transition duration-300"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            <Paragraph />
          </form>
        </div>

        {/* Lado derecho: Imagen fija */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src={Image1}
            alt="Imagen login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
