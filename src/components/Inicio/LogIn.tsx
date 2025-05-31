import { useState, useEffect } from "react";
import { useNavigate, Link} from "react-router-dom";
import Logo from "@assets/senagrol.png";
import Image1 from "@assets/LoginImg.jpg";
import Image2 from "@assets/Travel.jpg";
import Image3 from "@assets/co.jpg";
import { InicioService } from "@/services/Perfil/inicioServices";
import { Input } from "@components/Input";
import { Paragraph } from "@/components/Inicio/Paragraph";
import { Eye, EyeOff } from "lucide-react";

const images = [Image1, Image2, Image3];

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
   <div className="h-screen w-full flex items-center ">
  <div className="w-full h-full max-w-8xl bg-white shadow-lg flex flex-col md:flex-row overflow-hidden rounded-none">
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
    <div className="relative w-full md:w-1/2 h-full p-6 sm:p-10 flex items-center justify-center">
      {/* Logo */}
     <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border-4 border-[#48BD28] rounded-full p-1 shadow-lg">
  <img
    src={Logo}
    alt="Avatar"
    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
  />
</div>

      <div className="w-full max-w-md mt-16 md:mt-0">
        <div className="flex justify-between mb-6 border-b border-gray-300 pb-2 text-sm sm:text-base">
          <span
            className="text-black font-semibold border-b-2 border-[#48BD28] pb-1"
          >
            Login
          </span>
          <span
            onClick={() => navigate("/Register")}
            className="text-gray-400 cursor-pointer hover:text-black"
          >
            Registro
          </span>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          
          <Input
            className="text-black"
            label="Usuario o correo electrónico"
            type="text"
            name="identifier"
            placeholder="Ingresa tu usuario o correo"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <div className="relative">
            <Input
              className="text-black"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
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

    {/* Imagen lateral */}
    <div className="hidden md:block md:w-1/2 h-full w-full">
      <img
        src={images[currentImage]}
        alt="Decoración login"
        className="w-full h-full object-cover transition-all duration-1000"
      />
    </div>
  </div>
</div>

  );
};
