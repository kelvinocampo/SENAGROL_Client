import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { obtenerUbicacionCompra, Ubicacion } from "@/services/Perfil/UbicacionTRansportador";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface UbicacionConEstado extends Ubicacion {
  estado: string;
}

interface Props {
  id_compra: number;
}

const MapaUbicacion: React.FC<Props> = ({ id_compra }) => {
  const [ubicacion, setUbicacion] = useState<UbicacionConEstado | null>(null);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [geoChecked, setGeoChecked] = useState(false);

  useEffect(() => {
    const obtenerUbicacion = async () => {
      try {
        console.log("[API] -> Iniciando petición para ubicación de compra con id:", id_compra);
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("[API] -> No hay token en localStorage");
          throw new Error("❌ No hay token de autenticación");
        }

        const data = await obtenerUbicacionCompra(id_compra, token);
        console.log("[API] -> Respuesta recibida:", data);

        if (!data.success) {
          console.error("[API] -> Error de backend:", data.message);
          setError((data.message as string) || "Error al obtener ubicación");
          setUbicacion(null);
          return;
        }

        if (
          typeof data.message === "object" &&
          data.message !== null &&
          "estado" in data.message &&
          typeof data.message.estado === "string"
        ) {
          console.log("[API] -> Estado de compra:", data.message.estado);

          if (!["Asignado", "En Proceso"].includes(data.message.estado)) {
            console.warn("[API] -> Estado inválido para mostrar ubicación:", data.message.estado);
            setError("La compra no está en un estado válido para mostrar ubicación");
            setUbicacion(null);
            return;
          }

          setUbicacion(data.message as UbicacionConEstado);
        } else {
          console.error("[API] -> Respuesta inválida del servidor");
          setError("Respuesta inválida del servidor");
          setUbicacion(null);
          return;
        }
      } catch (err: any) {
        console.error("[API] -> Error en la petición:", err);
        setError(err.message || "Error desconocido");
        setUbicacion(null);
      } finally {
        setLoading(false);
      }
    };

    obtenerUbicacion();
  }, [id_compra]);

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("[GEO] -> Intentando obtener geolocalización del usuario");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          console.log("[GEO] -> Ubicación usuario obtenida:", coords);
          setUbicacionUsuario(coords);
          setGeoChecked(true);
        },
        (err) => {
          console.warn("[GEO] -> Error obteniendo ubicación usuario:", err.message);
          setGeoChecked(true);
        }
      );
    } else {
      console.warn("[GEO] -> Geolocalización no soportada por el navegador");
      setGeoChecked(true);
    }
  }, []);

  if (loading) {
    console.log("[RENDER] -> Cargando mapa...");
    return <p>Cargando mapa...</p>;
  }

  if (error) {
    console.log("[RENDER] -> Error:", error);
    return <p className="text-red-600">❌ Error: {error}</p>;
  }

  if (!ubicacion) {
    console.log("[RENDER] -> No se encontró la ubicación para la compra.");
    return <p>⚠️ No se encontró la ubicación.</p>;
  }

  if (!geoChecked) {
    console.log("[RENDER] -> Esperando obtención ubicación usuario...");
    return <p>Obteniendo ubicación del usuario...</p>;
  }

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

  console.log("[RENDER] -> Centro del mapa calculado en:", centro);

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer center={centro} zoom={13} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={comprador}>
          <Popup>Ubicación del Comprador</Popup>
        </Marker>

        <Marker position={vendedor}>
          <Popup>Ubicación del Vendedor</Popup>
        </Marker>

        {ubicacionUsuario && (
          <>
            <Marker position={ubicacionUsuario}>
              <Popup>Tu ubicación actual</Popup>
            </Marker>
            <Polyline positions={[ubicacionUsuario, vendedor]} color="green" />
          </>
        )}

        <Polyline positions={[comprador, vendedor]} color="blue" />
      </MapContainer>
    </div>
  );
};

export default MapaUbicacion;
