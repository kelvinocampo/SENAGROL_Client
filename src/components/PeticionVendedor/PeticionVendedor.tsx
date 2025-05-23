import { useState } from "react";

export default function PeticionVendedor() {
  const [mensaje, setMensaje] = useState("");

  const solicitarVendedor = () => {
    const confirmacion = window.confirm("¿Está seguro de enviar la petición para ser vendedor?");
    if (confirmacion) {
      setTimeout(() => {
        setMensaje("Solicitud enviada correctamente, espere la aprobación del administrador.");
      }, 1000);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={solicitarVendedor}
        className="bg-[#48BD28] text py-2 rounded-full w-full"
      >
        Petición Vendedor
      </button>
      {mensaje && (
        <div className="mt-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
          {mensaje}
        </div>
      )}
    </div>
  );
}
