import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { getCodigoCompra } from "@/services/Perfil/Qr&codigocompradorServices";

type ModalQrGeneratorProps = {
  isOpen: boolean;
  onClose: () => void;
  compraId: number | null;
};

const ModalQrGenerator: React.FC<ModalQrGeneratorProps> = ({
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

        const code = await getCodigoCompra(compraId.toString());
        setCodigo(code);
      } catch (err: any) {
        setError(err.message || "Error al obtener el código.");
      }
    };

    if (isOpen) {
      setCodigo(null);
      setError(null);
      fetchCodigo();
    }
  }, [compraId, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as="div"
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Fondo */}
          <div className="fixed inset-0 bg-black/40" />

          {/* Contenedor del modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs mx-4 p-6 flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Dialog.Title
              as="h2"
              className="text-lg font-bold text-[#205116] mb-4"
            >
              Código QR
            </Dialog.Title>

            {error ? (
              <p className="text-red-500 mb-4">{error}</p>
            ) : !codigo ? (
              <p className="text-gray-500 mb-4">Cargando código...</p>
            ) : (
              <QRCodeCanvas value={codigo} size={180} className="mb-4" />
            )}

            <div className="mt-4 w-full flex justify-between gap-2">
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

export default ModalQrGenerator;
