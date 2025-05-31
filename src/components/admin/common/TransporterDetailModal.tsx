import React, { useEffect, useState } from "react";

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
}

interface TransporterData {
  licenciaConduccion: string;
  soatVigente: string;
  tarjetaPropiedad: string;
  tipoVehiculo: string;
  pesoVehiculo: string;
  imagenes: string[];
}

export const TransporterDetailModal: React.FC<TransporterDetailModalProps> = ({
  user,
  onClose,
}) => {
  const [transporterData, setTransporterData] = useState<TransporterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchTransporterData = async () => {
      try {
        const res = await fetch(`http://localhost:10101/transporters/${user.id}`);
        const data = await res.json();
        setTransporterData(data);
      } catch (error) {
        console.error("Error al cargar los datos del transportador:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransporterData();
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Detalles del Transportador</h2>

        <div className="space-y-2">
          <div><strong>Nombre:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Teléfono:</strong> {user.phone}</div>
          <div><strong>Dirección:</strong> {user.address}</div>
          <div><strong>Estado del rol:</strong> {user.transportador}</div>
        </div>

        {loading ? (
          <div className="mt-4 text-gray-600">Cargando datos del transportador...</div>
        ) : transporterData ? (
          <div className="space-y-2 mt-4">
            <div><strong>Licencia de conducción:</strong> {transporterData.licenciaConduccion}</div>
            <div><strong>SOAT vigente:</strong> {transporterData.soatVigente}</div>
            <div><strong>Tarjeta de propiedad del vehículo:</strong> {transporterData.tarjetaPropiedad}</div>
            <div><strong>Tipo de vehículo:</strong> {transporterData.tipoVehiculo}</div>
            <div><strong>Peso del vehículo:</strong> {transporterData.pesoVehiculo}</div>

            {transporterData.imagenes?.length > 0 && (
              <div>
                <strong>Imágenes:</strong>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {transporterData.imagenes.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Imagen ${idx + 1}`}
                      className="w-full h-auto rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 text-red-500">No se encontraron datos del transportador.</div>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-[#48BD28] text-white rounded-xl hover:bg-[#379E1B] transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
