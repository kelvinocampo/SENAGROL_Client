import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@assets/senagrol.jpeg";
import Image1 from "@assets/Blubly Delivery Illustrations.jfif";
import Image2 from "@assets/Consórcio Itáu - CAXA estudio.jfif"; // Puedes agregar más imágenes
import Image3 from "@assets/Urban Farming.jfif";
import { InicioService } from "@/services/inicioServices";
import { Input } from "@components/Input";
import { Paragraph } from "@/components/Inicio/paragraph";
import { Eye, EyeOff } from "lucide-react";

const images = [Image1, Image2, Image3]; // 👈 Slider de imágenes

export const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(0); // 👈 Slider

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // Cambia cada 4 segundos
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await InicioService.login(identifier, password);
      localStorage.setItem("token", data.token);
      navigate("/inicio");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#48BD28]">
      <div className="flex w-full h-full bg-white shadow-lg overflow-hidden">
        {/* Login Form Section */}
        <div className="relative w-full md:w-1/2 p-10 pt-16 text-white flex items-center justify-center">
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border-4 border-[#48BD28] rounded-full p-1">
            <img src={Logo} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
          </div>

          <div className="w-full max-w-[400px]">
            {/* Tabs */}
            <div className="flex justify-between mb-6 border-b border-gray-600 pb-2">
              <span className="text-black font-semibold border-b-2 border-white pb-1">Login</span>
              <span className="text-gray-400 cursor-pointer hover:text-white">Sign Up</span>
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

              {error && <p className="text-[#F10E0E] text-sm font-medium">{error}</p>}

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

        {/* Right Image Section with slider */}
        <div className="hidden md:block md:w-1/2 h-full">
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
