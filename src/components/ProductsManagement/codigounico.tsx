import { useEffect, useState } from "react";
import { getCodigoCompra } from "@/services/QrServices";
import { motion, AnimatePresence } from "framer-motion";

interface ModalCodigoProps {
  isOpen: boolean;
  onClose: () => void;
  id_compra: string | null;
}

export const ModalCodigo = ({ isOpen, onClose, id_compra }: ModalCodigoProps) => {
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCodigo = async () => {
      if (!isOpen || !id_compra) return;

      try {
        const token = localStorage.getItem("token");
        const code = await getCodigoCompra(id_compra, token);
        setCodigo(code);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error al obtener el código.");
        setCodigo(null);
      }
    };

    fetchCodigo();
  }, [id_compra, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-white/30 bg-opacity-50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full text-center relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          {/* Contenido del código */}
          <div className="mt-6">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : !codigo ? (
              <p className="text-gray-600">Cargando...</p>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2 mt-4">Código:</h3>
                <p className="text-2xl font-bold text-gray-800">{codigo}</p>
              </>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Volver
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#48BD28] text-white rounded hover:bg-[#379e1b]"
            >
              Aceptar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
