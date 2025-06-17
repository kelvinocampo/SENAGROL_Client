import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationPicker } from "@components/ProductsManagement/LocationPicker";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { CardElement, 
  // useStripe, useElements 
} from '@stripe/react-stripe-js';

type Location = { lat: number; lng: number };

interface CompraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cantidad: number, ubicacion: string) => void;
  producto: {
    id: number;
    nombre: string;
    cantidad_minima: number;
    precio_unidad: number;
    precio_transporte: number; // 👈 nuevo (usa 0 si no hay)
  };
}

export default function CompraModal({
  isOpen,
  onClose,
  onConfirm,
  producto,
}: CompraModalProps) {
  // const stripe = useStripe();
  // const elements = useElements();
  const [cantidad, setCantidad] = useState(producto.cantidad_minima);
  const [ubicacion, setUbicacion] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);

  /* ----- Precios ----- */
  const precioProducto = producto.precio_unidad;
  const precioTransporte = producto.precio_transporte ?? 0;
  const subtotal = precioProducto * cantidad;
  const precioTotal = subtotal + precioTransporte;

  /* ----- Confirmar compra ----- */
  const handleConfirm = async () => {
    if (cantidad < producto.cantidad_minima) {
      alert(
        `La cantidad mínima para este producto es ${producto.cantidad_minima}`
      );
      return;
    }
    if (!ubicacion) {
      alert("Por favor selecciona una ubicación en el mapa.");
      return;
    }

    const ubicacionTexto = `Lat: ${ubicacion.lat.toFixed(
      6
    )}, Lng: ${ubicacion.lng.toFixed(6)}`;

    try {
      setLoading(true);
      const id_user = Number(localStorage.getItem("user_id"));

      await ProductManagementService.buyProduct(producto.id, {
        id_user,
        cantidad,
        latitud: ubicacion.lat.toFixed(6),
        longitud: ubicacion.lng.toFixed(6),
      });

     
      onConfirm(cantidad, ubicacionTexto);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al realizar la compra.");
    } finally {
      setLoading(false);
    }
  };

  /* ----- Render ----- */
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
              Comprar: {producto.nombre}
            </h2>

            {/* Cantidad con botones */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                disabled={cantidad <= producto.cantidad_minima || loading}
                onClick={() =>
                  setCantidad((c) =>
                    Math.max(producto.cantidad_minima, c - 1)
                  )
                }
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-40"
              >
                –
              </button>
              <span className="text-lg font-semibold">{cantidad}</span>
              <button
                disabled={loading}
                onClick={() => setCantidad((c) => c + 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-40"
              >
                +
              </button>
            </div>

            {/* Tabla de precios */}
            <div className="text-sm text-gray-700 mb-4 space-y-1">
              <p>
                <span className="font-semibold">Precio producto:</span>{" "}
                ${precioProducto.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Subtotal:</span>{" "}
                ${subtotal.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Precio transporte:</span>{" "}
                ${precioTransporte.toLocaleString()}
              </p>
              <p className="text-green-700 font-bold">
                Precio total: ${precioTotal.toLocaleString()}
              </p>
            </div>

            {/* Mapa */}
            <LocationPicker
              setLocation={setUbicacion}
              initialLocation={ubicacion}
              className="mb-4 h-110 rounded overflow-hidden border"
            />

            <CardElement className="p-3 
              border border-gray-300 
              rounded-lg 
              shadow-sm 
              hover:border-indigo-400 
              transition-colors
              focus:outline-none
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              bg-white" />

            {/* Botones */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`px-4 py-2 text-white rounded transition ${
                  loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Confirmar compra"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
