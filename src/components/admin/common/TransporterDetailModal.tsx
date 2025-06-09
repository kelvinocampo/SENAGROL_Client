import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  estado_transportador: string;
  estado_rol?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fotos_vehiculo?: string; // CAMBIO: de "imagenes" a "fotos_vehiculo"
}

export const TransporterDetailModal: React.FC<TransporterDetailModalProps> = ({
  user,
  onClose,
  isOpen,
}) => {
  const [transporterData, setTransporterData] =
    useState<TransporterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !isOpen) return;

    const fetchTransporterData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://senagrol.up.railway.app/admin/transporters/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg text-gray-900 font-sans select-none"
        >
          <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
            Detalles del Transportador
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Cargando detalles...</p>
          ) : !transporterData ? (
            <p className="text-center text-red-500">
              No se encontraron datos del transportador.
            </p>
          ) : (
            <>
              <p>
                <strong>Nombre:</strong>{" "}
                {transporterData.nombre || "No disponible"}
              </p>
              <p>
                <strong>Licencia de conducción:</strong>{" "}
                {transporterData.licencia_conduccion || "No disponible"}
              </p>
              <p>
                <strong>SOAT vigente:</strong>{" "}
                {transporterData.soat || "No disponible"}
              </p>
              <p>
                <strong>Tarjeta de propiedad del vehículo:</strong>{" "}
                {transporterData.tarjeta_propiedad_vehiculo || "No disponible"}
              </p>
              <p>
                <strong>Tipo de vehículo:</strong>{" "}
                {transporterData.tipo_vehiculo || "No disponible"}
              </p>
              <p>
                <strong>Peso del vehículo:</strong>{" "}
                {transporterData.peso_vehiculo || "No disponible"}
              </p>
              <p>
                <strong>Estado del transportador:</strong>{" "}
                <span
                  className={
                    transporterData.estado_transportador === "Pendiente"
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {transporterData.estado_transportador || "No disponible"}
                </span>
              </p>

              {transporterData.fotos_vehiculo ? (
                <div className="mt-4">
                  <p className="font-semibold">Imagen del vehículo:</p>
                  <img
                    src={transporterData.fotos_vehiculo}
                    alt="Imagen del vehículo"
                    className="w-full h-64 object-cover rounded-lg border mt-2"
                  />
                </div>
              ) : (
                <p className="mt-4 text-gray-500">
                  No hay imagen del vehículo disponible.
                </p>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors duration-300"
            aria-label="Cerrar detalles del transportador"
          >
            Cerrar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
