import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTruckMoving } from "react-icons/fa";

interface TransporterDetailModalProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    transportador: string;
  };
  onClose: () => void;
  isOpen: boolean;
}

interface TransporterData {
  licencia_conduccion: string;
  soat: string;
  tarjeta_propiedad_vehiculo: string;
  tipo_vehiculo: string;
  peso_vehiculo: string;
  estado: string;
  nombre?: string;
  fotos_vehiculo?: string;
}

export const TransporterDetailModal: React.FC<TransporterDetailModalProps> = ({
  user,
  onClose,
  isOpen,
}) => {
  const [transporterData, setTransporterData] = useState<TransporterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !isOpen) return;

    const fetchTransporterData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:10101/admin/transporters/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success && data.transporter.length > 0) {
          setTransporterData(data.transporter[0]);
        } else {
          setTransporterData(null);
        }
      } catch (error) {
        setTransporterData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransporterData();
  }, [user?.id, isOpen]);

  const renderField = (label: string, value: string | undefined) => (
    <p>
      <strong>{label}:</strong>{" "}
      <span className={value ? "text-gray-700" : "text-red-600 font-semibold"}>
        {value || "No disponible"}
      </span>
    </p>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border-4 border-none rounded-xl max-w-lg w-[90%] p-6 shadow-xl text-black"
        >
          <div className="flex flex-col items-center text-center">
            <FaTruckMoving size={50} className="text-green-600 mb-2" />
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Detalles del transportador
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Cargando detalles...</p>
          ) : !transporterData ? (
            <p className="text-center text-red-500">
              No se encontraron datos del transportador.
            </p>
          ) : (
            <div className="space-y-2 text-sm mt-2">
              {renderField("Nombre", user.name)}
              {renderField("Licencia de conducción", transporterData.licencia_conduccion)}
              {renderField("SOAT vigente", transporterData.soat)}
              {renderField("Tarjeta de propiedad de vehículo", transporterData.tarjeta_propiedad_vehiculo)}
              {renderField("Tipo de vehículo", transporterData.tipo_vehiculo)}
              {renderField("Peso de vehículo", transporterData.peso_vehiculo)}
              {renderField("Estado del transportador", transporterData.estado )}

              {transporterData.fotos_vehiculo && (
                <div className="mt-4">
                  <img
                    src={transporterData.fotos_vehiculo}
                    alt="Vehículo"
                    className="w-full h-48 object-contain rounded-md"
                  />
                </div>
              )}
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Cerrar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
