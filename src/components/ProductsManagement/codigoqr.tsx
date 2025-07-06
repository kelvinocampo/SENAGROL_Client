// @components/perfil/ModalQr.tsx
import React from "react";
import { Dialog } from "@headlessui/react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalQrProps {
  isOpen: boolean;
  onClose: () => void;
  codigo: string | null;
}

export const ModalQr: React.FC<ModalQrProps> = ({ isOpen, onClose, codigo }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as="div"
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Fondo semitransparente */}
          <div className="fixed inset-0 bg-black/40" />

          {/* Contenedor principal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs mx-4 p-6 flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Dialog.Title as="h2" className="text-lg font-bold text-[#205116] mb-4">
              Código QR
            </Dialog.Title>

            {codigo ? (
              <QRCodeCanvas value={codigo} size={180} className="mb-4" />
            ) : (
              <p className="text-gray-500 mb-4">Cargando código...</p>
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
