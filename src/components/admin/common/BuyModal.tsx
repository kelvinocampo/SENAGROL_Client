import { useState } from "react";
import { LocationPicker } from "@components/ProductsManagement/LocationPicker";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement"; // Ajusta según tu estructura

type Location = {
  lat: number;
  lng: number;
};

interface CompraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cantidad: number, ubicacion: string) => void;
  producto: {
    id: number;
    nombre: string;
    cantidad_minima: number;
  };
}

export default function CompraModal({ isOpen, onClose, onConfirm, producto }: CompraModalProps) {
  const [cantidad, setCantidad] = useState(producto.cantidad_minima || 1);
  const [ubicacion, setUbicacion] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (cantidad < producto.cantidad_minima) {
      alert(`La cantidad mínima para comprar este producto es ${producto.cantidad_minima}`);
      return;
    }

    if (!ubicacion) {
      alert("Por favor selecciona una ubicación en el mapa.");
      return;
    }

    const ubicacionTexto = `Lat: ${ubicacion.lat.toFixed(6)}, Lng: ${ubicacion.lng.toFixed(6)}`;

    try {
      setLoading(true);

      const id_user = Number(localStorage.getItem("user_id")); // o como lo estés guardando

      await ProductManagementService.buyProduct(producto.id, {
        id_user,
        cantidad,
        latitud: ubicacion.lat.toFixed(6),
        longitud: ubicacion.lng.toFixed(6),
      });


      alert("Compra realizada con éxito.");
      onConfirm(cantidad, ubicacionTexto); // Puedes notificar a un componente padre
      onClose();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al realizar la compra.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-centerh justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Comprar: {producto.nombre}</h2>

        <p className="text-sm text-gray-600 mb-2">
          Cantidad mínima: <strong>{producto.cantidad_minima}</strong>
        </p>

        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
          min={producto.cantidad_minima}
          className="w-full mb-3 p-2 border rounded"
          placeholder="Cantidad"
          disabled={loading}
        />

        <LocationPicker
          setLocation={setUbicacion}
          initialLocation={ubicacion}
          className="mb-4 h-110 rounded overflow-hidden"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar compra"}
          </button>
        </div>
      </div>
    </div>
  );
}
