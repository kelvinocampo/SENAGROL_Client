import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

function LocationMarker({ setLocation }: { setLocation: (location: any) => void }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setLocation({ lat, lng });
        },
    });

    return null;
}

export function LocationPicker({ setLocation }: { setLocation: (location: any) => void }) {
    const [currentLocation, setCurrentLocation] = useState<any>(null);

    const handleLocationChange = (location: any) => {
        setCurrentLocation(location);
        setLocation(location);
    };

    return (
        <div className='flex flex-col gap-2'>
            <label htmlFor="">Ubicacion:</label>
            <MapContainer
                center={[4.6097, -74.0818]}
                zoom={13}
                style={{ height: '500px', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker setLocation={handleLocationChange} />
                {currentLocation && <Marker position={[currentLocation.lat, currentLocation.lng]} />}
            </MapContainer>

            {currentLocation && (
                <div>
                    <h4 className="font-medium">Ubicación seleccionada:</h4>
                    <p>Lat: {currentLocation.lat.toFixed(6)}</p>
                    <p>Lng: {currentLocation.lng.toFixed(6)}</p>
                </div>
            )}
        </div>
    );
}