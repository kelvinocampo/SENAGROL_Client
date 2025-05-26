import { useState } from "react";
import { requestSeller } from "@/services/PeticiónVService"; 

export default function PeticionVendedor() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const solicitarVendedor = async () => {
    const confirmacion = window.confirm("¿Está seguro de enviar la petición para ser vendedor?");
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Debe iniciar sesión para realizar esta acción.");
        return;
      }

      const respuesta = await requestSeller(token);
      setMensaje(respuesta.message || "Solicitud enviada correctamente.");
      setError("");
    } catch (error: unknown) {
      console.error("Error al solicitar ser vendedor:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error desconocido.");
      }

      setMensaje("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={solicitarVendedor}
        className="bg-[#48BD28] text-white py-2 rounded-full w-full hover:bg-green-600 transition"
      >
        Petición Vendedor
      </button>

      {mensaje && (
        <div className="mt-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
