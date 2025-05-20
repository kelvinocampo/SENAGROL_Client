import { useNavigate } from 'react-router-dom';

const CerrarSesion = () => {
  const navigate = useNavigate();

  const handleCancelar = () => {
    navigate(-1); // Regresa a la página anterior
  };

  const handleCerrarSesion = () => {
    // Aquí colocas la lógica para cerrar sesión (ej. limpiar tokens, redirigir, etc.)
    console.log("Sesión cerrada");
    navigate("/login"); // o a la página principal
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="text-center">
        <h1 className="text-lg font-bold text-[#1B1B1B] mb-2">Cerrar sesión</h1>
        <p className="text-sm text-[#1B1B1B] mb-6">¿Seguro que deseas cerrar la sesión?</p>

        <div className="flex flex-col gap-2 max-w-xs mx-auto w-full">
          <button
            onClick={handleCancelar}
            className="bg-[#FAF6F2] text-[#4B4B4B] py-2 rounded-full text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleCerrarSesion}
            className="bg-[#4CAF50] text-white py-2 rounded-full text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default CerrarSesion;
