import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👉 Importa useNavigate
import Logo from "../../assets/senagrol.jpeg";
import { InicioService } from "@/services/inicioServices";
import Inputs from "./inputs";
import { Paragraph } from "@/components/Inicio/paragraph";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate(); // 👈 Agregado
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await InicioService.login(identifier, password);

      localStorage.setItem("token", data.token);

      // ✅ Redirigir al usuario a la página de inicio
         navigate("/inicio");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-start bg-white">
      <div className="w-full max-w-md p-8 ml-15 mt-1">
        <img
          src={Logo}
          alt="Logo Senagrol"
          className="w-17 h-17 rounded-full border-l-2 border-r-4 border-white object-cover"
        />

        <h2 className="text-2xl ml-40 font-bold mb-6 w-140 text-black">
          Inicia sesión en tu cuenta
        </h2>

        <form className="space-y-4 ml-40 w-[450px]" onSubmit={handleSubmit}>
          <Inputs
            label="Usuario o correo electrónico"
            type="text"
            name="identifier"
            placeholder="Ingresa tu usuario o correo"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <div className="relative">
            <Inputs
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-[BFBFBD]"
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
            className="w-full bg-[#48BD28] text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Iniciando sesión" : "Iniciar sesión"}
          </button>

          <Paragraph />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
