import { useNavigate } from "react-router-dom";
import farmer from "@assets/framer.png"; // Usa la imagen del agricultor como en el diseño

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#f4fcf1] to-[#e4fbdd]">
      <div className="flex flex-col items-center justify-center text-center px-4">
        {/* Número 404 con imagen */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
          <span className="text-7xl md:text-9xl font-extrabold text-[#2C7A18]">404</span>
          <img
            src={farmer}
            alt="Farmer"
            className="w-20 h-20 md:w-50 absolute  right-130 bottom-63   md:h-100 object-contain"
          />
        </div>

        {/* Texto explicativo */}
        <p className="text-[#2C7A18] text-lg md:text-xl font-semibold mb-2">
          Uy... parece que esta página no existe o no tienes permiso para verla
        </p>

        {/* Botón volver */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-[#48BD28] text-white px-6 py-2 rounded-md hover:bg-[#379E1B] transition font-bold"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default Error404;
