import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { obtenerUbicacionCompra, Ubicacion } from "@/services/Perfil/UbicacionTRansportador";
import { motion } from "framer-motion";


// Configuración del ícono por defecto

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface Props {
  id_compra: number;
}

const MapaUbicacion: React.FC<Props> = ({ id_compra }) => {
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<[number, number] | null>(null);
  const [direccionVendedor, setDireccionVendedor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerUbicacion = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("❌ No hay token de autenticación");

        const data = await obtenerUbicacionCompra(id_compra, token);

        if (
          data.success &&
          typeof data.message === "object" &&
          data.message !== null &&
          "latitud" in data.message &&
          "latitud_comprador" in data.message &&
          "longitud" in data.message &&
          "longitud_comprador" in data.message
        ) {
          setUbicacion(data.message as Ubicacion);
        } else {
          setError("Respuesta inválida del servidor");
          setUbicacion(null);
        }
      } catch (err: any) {
        setError(err.message || "Error desconocido");
        setUbicacion(null);
      } finally {
        setLoading(false);
      }
    };

    obtenerUbicacion();
  }, [id_compra]);

  const solicitarGeolocalizacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUbicacionUsuario(coords);
        },
        (err) => {
          alert("No se pudo obtener tu ubicación: " + err.message);
        }
      );
    } else {
      alert("Geolocalización no soportada por el navegador");
    }
  };

  useEffect(() => {
    const fetchDireccion = async () => {
      if (
        !ubicacion ||
        isNaN(Number(ubicacion.latitud)) ||
        isNaN(Number(ubicacion.longitud))
      ) return;

      try {
        const response = await fetch(
          `http://localhost:10101/compra/getAddress?lat=${ubicacion.latitud}&lng=${ubicacion.longitud}`
        );
        const data = await response.json();

        if (data.success && data.message) {
          setDireccionVendedor(data.message);
        } else {
          setDireccionVendedor("Dirección no disponible");
        }
      } catch (error) {
        setDireccionVendedor("Error al obtener la dirección");
      }
    };

    fetchDireccion();
  }, [ubicacion]);

  if (loading)
    return <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-4">Cargando mapa...</motion.p>;
  if (error)
    return <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-600 font-semibold mt-4">❌ Error: {error}</motion.p>;
  if (!ubicacion)
    return <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">⚠️ No se encontró la ubicación.</motion.p>;

  const comprador: [number, number] = [
    parseFloat(ubicacion.latitud_comprador),
    parseFloat(ubicacion.longitud_comprador),
  ];

  const vendedor: [number, number] = [
    parseFloat(ubicacion.latitud),
    parseFloat(ubicacion.longitud),
  ];

  const centro: [number, number] = ubicacionUsuario
    ? [
        (comprador[0] + vendedor[0] + ubicacionUsuario[0]) / 3,
        (comprador[1] + vendedor[1] + ubicacionUsuario[1]) / 3,
      ]
    : [
        (comprador[0] + vendedor[0]) / 2,
        (comprador[1] + vendedor[1]) / 2,
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-6 p-4 rounded-xl bg-white shadow-xl"
    >
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={solicitarGeolocalizacion}
        className="mb-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-full shadow hover:from-blue-700 hover:to-blue-600"
      >
        📍 Obtener mi ubicación
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-300"
      >
        <MapContainer center={centro} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={comprador}>
            <Popup>📍 Comprador</Popup>
          </Marker>

          <Marker position={vendedor}>
            <Popup>
              <strong>📦 Vendedor</strong>
              <br />
              {direccionVendedor ?? "Buscando dirección..."}
            </Popup>
          </Marker>

          {ubicacionUsuario && (
            <>
              <Marker position={ubicacionUsuario}>
                <Popup>🧍‍♂️ Tú</Popup>
              </Marker>
              <Polyline positions={[ubicacionUsuario, vendedor]} color="green" />
            </>
          )}

          <Polyline positions={[comprador, vendedor]} color="blue" />
        </MapContainer>
      </motion.div>
    </motion.div>
  );
};

export default MapaUbicacion;
