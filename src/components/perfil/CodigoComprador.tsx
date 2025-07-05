import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { getCodigoCompra } from "@/services/Perfil/Qr&codigocompradorServices";

type ModalCodeGeneratorProps = {
  isOpen: boolean;
  onClose: () => void;
  compraId: number | null;
};

const ModalCodeGenerator: React.FC<ModalCodeGeneratorProps> = ({
  isOpen,
  onClose,
  compraId,
}) => {
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCodigo = async () => {
      if (!compraId) {
        setError("ID de compra no válido.");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const code = await getCodigoCompra(compraId.toString(), token);
        setCodigo(code);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error al obtener el código.");
        setCodigo(null);
      }
    };

    if (isOpen) {
      setCodigo(null);
      setError(null);
      fetchCodigo();
    }
  }, [isOpen, compraId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as="div"
          open
          onClose={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Fondo semitransparente */}
          <div className="fixed inset-0 bg-black/30" />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col items-center text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Dialog.Title className="text-xl font-bold text-[#205116] mb-4">
              Código alfanumérico
            </Dialog.Title>

            {error ? (
              <p className="text-red-500 mb-4">{error}</p>
            ) : !codigo ? (
              <p className="text-gray-500 mb-4">Cargando...</p>
            ) : (
              <input
                readOnly
                value={codigo}
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-center text-lg font-mono shadow-sm"
              />
            )}

            <div className="mt-6 flex w-full gap-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-xl font-medium transition"
              >
                Volver
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[#48BD28] hover:bg-[#379e1b] text-white py-2 rounded-xl font-medium transition"
              >
                Aceptar
              </button>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ModalCodeGenerator;
