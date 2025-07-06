import { useNavigate } from "react-router-dom";
import farmer from "@assets/framer.png"; // Asegúrate que la ruta sea correcta
import FallingLeaves from "@/components/FallingLeaf"; // Asegúrate que este componente existe

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#F4FCF1] overflow-hidden">
      {/* Fondo de hojas cayendo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FallingLeaves quantity={20} />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-lg">
        {/* Número 404 + imagen */}
        <div className="relative flex items-center justify-center mb-6">
          <span className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-[#2C7A18]">
            404
          </span>
          <img
            src={farmer}
            alt="Farmer"
            className="absolute -right-10 sm:-right-25  w-16 h-16 sm:w-24 sm:h-24 md:w-40 md:h-50 object-contain"
          />
        </div>

        {/* Mensaje */}
        <p className="text-[#2C7A18] text-base sm:text-lg md:text-xl font-semibold mb-3">
          Uy... parece que esta página no existe o no tienes permiso para verla
        </p>

        {/* Botón */}
        <button
          onClick={() => navigate("/")}
          className="mt-2 bg-[#48BD28] text-white px-6 py-2 rounded-md hover:bg-[#379E1B] transition font-bold text-sm sm:text-base"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default Error404;
