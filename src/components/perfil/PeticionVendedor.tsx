import { useState } from "react";
import { requestSeller } from "@/services/Perfil/PeticiónVService";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";

export default function PeticionVendedor() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirm = async () => {
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
    <div className="w-full max-w-md mx-auto px-4">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="w-full sm:w-50  mx-auto block bg-[#17A2B8] text-white py-2 rounded-xl font-[Fredoka] font-bold hover:bg-blue-500 transition"
      >
        Petición Vendedor
      </button>

      {/* Mensaje de éxito */}
      {mensaje && (
        <div className="mt-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
          {mensaje}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Confirmación */}
      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
        title="Confirmar solicitud"
        message="¿Está seguro de enviar la petición para ser vendedor?"
      />
    </div>
  );
}
