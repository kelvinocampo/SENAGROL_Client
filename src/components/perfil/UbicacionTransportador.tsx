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

interface Props {
  id_compra: number;
}

const MapaUbicacion: React.FC<Props> = ({ id_compra }) => {
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<[number, number] | null>(null);
  const [direccionVendedor, setDireccionVendedor] = useState<string | null>(null);
  const [direccionComprador, setDireccionComprador] = useState<string | null>(null);
  const [rutaAVendedor, setRutaAVendedor] = useState<[number, number][]>([]);
  const [rutaVendedorComprador, setRutaVendedorComprador] = useState<[number, number][]>([]);
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
        }
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    obtenerUbicacion();
  }, [id_compra]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionUsuario([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (err) => {
          console.warn("Error obteniendo ubicación usuario:", err.message);
        }
      );
    } else {
      alert("Geolocalización no soportada por el navegador");
    }
  }, []);

  useEffect(() => {
    if (!ubicacion) return;

    const fetchDirecciones = async () => {
      try {
        // Dirección del vendedor
        const respVendedor = await fetch(
          `https://senagrol.up.railway.app/compra/getAddress?lat=${ubicacion.latitud}&lon=${ubicacion.longitud}`
        );
        const dataVendedor = await respVendedor.json();
        setDireccionVendedor(dataVendedor.success ? dataVendedor.message : "Dirección no disponible");

        // Dirección del comprador
        const respComprador = await fetch(
          `https://senagrol.up.railway.app/compra/getAddress?lat=${ubicacion.latitud_comprador}&lon=${ubicacion.longitud_comprador}`
        );
        const dataComprador = await respComprador.json();
        setDireccionComprador(dataComprador.success ? dataComprador.message : "Dirección no disponible");

      } catch (error) {
        setDireccionVendedor("Error al obtener la dirección");
        setDireccionComprador("Error al obtener la dirección");
      }
    };

    fetchDirecciones();
  }, [ubicacion]);

  useEffect(() => {
    const obtenerRuta = async () => {
      if (!ubicacionUsuario || !ubicacion) return;

      const origen = `${ubicacionUsuario[1]},${ubicacionUsuario[0]}`;
      const destino = `${ubicacion.longitud},${ubicacion.latitud}`;

      try {
        const response = await fetch(
          `http://router.project-osrm.org/route/v1/driving/${origen};${destino}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes?.length > 0) {
          const coordenadas = data.routes[0].geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          );
          setRutaAVendedor(coordenadas);
        }
      } catch (error) {
        console.error("Error obteniendo ruta transportador -> vendedor:", error);
      }
    };

    obtenerRuta();
  }, [ubicacionUsuario, ubicacion]);

  useEffect(() => {
    const obtenerRutaVendedorComprador = async () => {
      if (!ubicacion) return;

      const origen = `${ubicacion.longitud},${ubicacion.latitud}`;
      const destino = `${ubicacion.longitud_comprador},${ubicacion.latitud_comprador}`;

      try {
        const response = await fetch(
          `http://router.project-osrm.org/route/v1/driving/${origen};${destino}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes?.length > 0) {
          const coordenadas = data.routes[0].geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          );
          setRutaVendedorComprador(coordenadas);
        }
      } catch (error) {
        console.error("Error obteniendo ruta vendedor -> comprador:", error);
      }
    };

    obtenerRutaVendedorComprador();
  }, [ubicacion]);

  if (loading) return <p>Cargando mapa...</p>;
  if (error) return <p className="text-red-600">❌ Error: {error}</p>;
  if (!ubicacion) return <p>⚠️ No se encontró la ubicación.</p>;

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
    <div>
      <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg">
        <MapContainer center={centro} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={comprador}>
            <Popup>
              <strong>🏠 Comprador</strong>
              <br />
              {direccionComprador ?? "Buscando dirección..."}
            </Popup>
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
              {rutaAVendedor.length > 0 && (
                <Polyline positions={rutaAVendedor} color="green" />
              )}
            </>
          )}

          {rutaVendedorComprador.length > 0 && (
            <Polyline positions={rutaVendedorComprador} color="red" />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapaUbicacion;
