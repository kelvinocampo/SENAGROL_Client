import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';

// Fix para los iconos de marcador en React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
const API_URL = 'http://localhost:10101';
type Location = {
  lat: number;
  lng: number;
};

type LocationPickerProps = {
  setLocation: (location: Location | null) => void;
  initialLocation?: Location | null;
  required?: boolean;
  className?: string;
};

// ✅ Usa tu propia API para obtener la dirección
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/compra/getAddress?lat=${lat}&lon=${lon}`);

    const text = await response.text();
    console.log("Respuesta del backend (texto):", text);

    const data = JSON.parse(text);
    if (data.display_name) {
      return data.display_name;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener la dirección desde el backend:", error);
    return null;
  }
}



function LocationMarker({ 
  setLocation,
  initialLocation
}: {
  setLocation: (location: Location) => void;
  initialLocation?: Location | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (initialLocation && typeof initialLocation.lat === 'number' && typeof initialLocation.lng === 'number') {
      map.flyTo([initialLocation.lat, initialLocation.lng], 15);
    }
  }, [initialLocation, map]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) });
    },
  });

  return initialLocation && typeof initialLocation.lat === 'number' && typeof initialLocation.lng === 'number' ? (
    <Marker position={[initialLocation.lat, initialLocation.lng]} />
  ) : null;
}

export function LocationPicker({ 
  setLocation, 
  initialLocation = null,
  className = ''
}: LocationPickerProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (initialLocation && typeof initialLocation.lat === 'number' && typeof initialLocation.lng === 'number') {
      setCurrentLocation(initialLocation);
      reverseGeocode(initialLocation.lat, initialLocation.lng).then(setAddress);
    } else {
      setCurrentLocation(null);
      setAddress(null);
    }
  }, [initialLocation]);

  const handleLocationChange = async (location: Location) => {
    setCurrentLocation(location);
    setLocation(location);
    const addr = await reverseGeocode(location.lat, location.lng);
    setAddress(addr);
  };



  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <MapContainer
        center={currentLocation || [4.6097, -74.0818]}
        zoom={currentLocation ? 15 : 13}
        style={{ height: '500px', width: '100%', zIndex: 0 }}
        className="rounded-xl border border-gray-300"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker 
          setLocation={handleLocationChange} 
          initialLocation={currentLocation}
        />
      </MapContainer>

     
    </div>
  );
}
