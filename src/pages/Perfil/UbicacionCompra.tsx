import { motion, AnimatePresence } from "framer-motion";
import MapaUbicacion from "@/components/perfil/UbicacionTransportador";
import { PiMapPinSimpleFill } from "react-icons/pi";
type Props = {
  id: number;
  onClose: () => void;
};

const ModalUbicacionCompra = ({ id, onClose }: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-5xl  bg-white rounded-lg shadow-2xl p-4 relative mx-4"
          initial={{ scale: 0.95, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 50 }}
          transition={{ duration: 0.3 }}
        >
         
          {/* Mapa */}
          <div className="bg-gray-100 rounded-xl h-80 overflow-hidden shadow-inner">
            <MapaUbicacion id_compra={id} />
          </div>

          {/* Leyenda */}
          <div className="mt-4 flex text-left gap-6">
            <div className="flex items-center gap-2 px-3 py-3 bg-white shadow-xl rounded-lg border-none">
              <PiMapPinSimpleFill size={30} className="text-[#FF0000] "/>
              
              <span className="text-sm font-medium">Yo</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-3 bg-white shadow-xl rounded-lg border-none">
               <PiMapPinSimpleFill size={30} className="text-[#0033FF] "/>
              <span className="text-sm font-medium">Vendedor</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-3 bg-white shadow-xl rounded-lg border-none">
               <PiMapPinSimpleFill size={30} className="text-[#3D8C00] "/>
              <span className="text-sm font-medium">Comprador</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 bg-[#D9D9D9] text-black rounded-xl hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-[#48BD28] text-white rounded-xl hover:bg-green-600 transition"
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalUbicacionCompra;
