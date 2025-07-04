// @components/perfil/ModalQr.tsx
import { Dialog } from "@headlessui/react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

interface ModalQrProps {
  isOpen: boolean;
  onClose: () => void;
  codigo: string | null;
}

export const ModalQr: React.FC<ModalQrProps> = ({ isOpen, onClose, codigo }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-40" />

      <motion.div
        className="bg-white p-6 rounded-2xl flex-1 justify-center shadow-xl z-50 max-w-sm w-full text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4 text-[#205116]">Código QR</h2>
        {codigo ? (
          <QRCodeCanvas   value={codigo} size={200} />
        ) : (
          <p className="text-gray-500">Cargando código...</p>
        )}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-xl font-medium"
          >
            Volver
          </button>
          <button
            onClick={onClose}
            className="bg-[#48BD28] hover:bg-[#379e1b] text-white px-4 py-2 rounded-xl font-medium"
          >
            Aceptar
          </button>
        </div>
      </motion.div>
    </Dialog>
  );
};
