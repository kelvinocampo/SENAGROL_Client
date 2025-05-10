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

function LocationMarker({ 
  setLocation,
  initialLocation
}: {
  setLocation: (location: Location) => void;
  initialLocation?: Location | null;
}) {
  const map = useMap();
  
  // Efecto para centrar el mapa en la ubicación inicial
  useEffect(() => {
    if (initialLocation && typeof initialLocation.lat === 'number' && typeof initialLocation.lng === 'number') {
      map.flyTo([initialLocation.lat, initialLocation.lng], 15);
    }
  }, [initialLocation, map]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
    },
  });

  // Mostrar marcador si hay ubicación inicial válida
  return initialLocation && typeof initialLocation.lat === 'number' && typeof initialLocation.lng === 'number' ? (
    <Marker position={[initialLocation.lat, initialLocation.lng]} />
  ) : null;
}

export function LocationPicker({ 
  setLocation, 
  initialLocation = null,
  required = false,
  className = ''
}: LocationPickerProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  // Sincronizar currentLocation con initialLocation cuando cambia
  useEffect(() => {
    if (initialLocation && typeof initialLocation.lat === 'number' && typeof initialLocation.lng === 'number') {
      setCurrentLocation(initialLocation);
    } else {
      setCurrentLocation(null);
    }
  }, [initialLocation]);

  const handleLocationChange = (location: Location) => {
    setCurrentLocation(location);
    setLocation(location);
  };

  const handleClearLocation = () => {
    setCurrentLocation(null);
    setLocation(null);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="block text-sm font-medium">
        Ubicación
        {required && <span className="text-red-500">*</span>}
      </label>
      
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

      {currentLocation && typeof currentLocation.lat === 'number' && typeof currentLocation.lng === 'number' ? (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800">Ubicación seleccionada:</h4>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <span className="text-sm text-gray-600">Latitud:</span>
              <p className="font-mono">{currentLocation.lat.toFixed(6)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Longitud:</span>
              <p className="font-mono">{currentLocation.lng.toFixed(6)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearLocation}
            className="mt-2 text-sm text-red-500 hover:text-red-700"
          >
            Limpiar ubicación
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Haz clic en el mapa para seleccionar una ubicación
        </p>
      )}
    </div>
  );
}