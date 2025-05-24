import { useState, useContext, useEffect } from "react";
import { RecoverPasswordContext } from "@/contexts/User/UserManagement";
import Logo from "@assets/senagrol.jpeg";
import Image1 from "@assets/Fotos de Cafe - Descarga fotos gratis de gran calidad _ Freepik.jpg";
import Image2 from "@assets/Travel.jpg";
import Image3 from "@assets/🇨🇴.jpg";

const images = [Image1, Image2, Image3];

export const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

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
    <div className="w-full h-screen flex items-center justify-center bg-[#48BD28]">
      <div className="flex w-full h-full bg-white shadow-lg overflow-hidden">
        {/* Formulario lado izquierdo */}
        <div className="relative w-full md:w-1/2 p-10 pt-16 text-white flex items-center justify-center">
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border-4 border-[#48BD28] rounded-full p-1">
            <img src={Logo} alt="Logo" className="w-20 h-20 rounded-full object-cover" />
          </div>

          <div className="w-full max-w-[400px]">
            <div className="flex justify-between mb-6 border-b border-gray-600 pb-2">
              <span
                onClick={() => (location.href = "/LogIn")}
                className="text-gray-400 cursor-pointer hover:text-black"
              >
                Login
              </span>
              <span
                onClick={() => (location.href = "/Register")}
                className="text-gray-400 cursor-pointer hover:text-black"
              >
                Registro
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <label className="text-sm font-medium text-black">Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48BD28] text-black"
              />

              {message && <p className="text-green-600 text-sm text-center">{message}</p>}
              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <button
                type="submit"
                className="w-full bg-[#48BD28] text-white py-2 rounded-lg hover:bg-[#379e1b] transition"
              >
                Enviar correo
              </button>
            </form>
          </div>
        </div>

        {/* Imagen rotatoria lado derecho */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src={images[currentImage]}
            alt="Decoración"
            className="w-full h-full object-cover transition-all duration-1000"
          />
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
