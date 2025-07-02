import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import QrScanner from "@components/perfil/EscanearQr";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  compraId?: number; // ✅ agregar esto
};

const ModalEscanearQr: React.FC<Props> = ({ isOpen, onClose, compraId }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 relative mx-4"
            initial={{ scale: 0.95, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-center mb-4 text-[#205116]">
              Escanear Código QR
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
             <QrScanner
  isOpen={isOpen}
  onClose={onClose}
  compraId={compraId}
/>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalEscanearQr;
