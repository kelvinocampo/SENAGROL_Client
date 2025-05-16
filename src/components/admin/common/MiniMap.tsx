// src/components/admin/products/MiniMap.tsx
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige el icono del marcador (importante para que se vea)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

type MiniMapProps = {
  lat: number;
  lng: number;
};

export const MiniMap = ({ lat, lng }: MiniMapProps) => {
  return (
    <div className="relative z-0"> {/* Aquí agregamos control del z-index */}
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{ height: '150px', width: '150px', borderRadius: '10px' }}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  );
};

