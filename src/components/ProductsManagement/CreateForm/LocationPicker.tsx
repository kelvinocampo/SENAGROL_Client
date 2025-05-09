import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ setLocation }: any) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setLocation({ lat, lng });
        },
    });

    return null;
}

export function LocationPicker() {
    const [location, setLocation] = useState<any>(null);

    return (
        <div>
            <MapContainer
                center={[4.6097, -74.0818]}
                zoom={13}
                style={{ height: '500px', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker setLocation={setLocation} />
                {location && <Marker position={[location.lat, location.lng]} />}
            </MapContainer>

            {location && (
                <div>
                    <h4>Ubicación seleccionada:</h4>
                    <p>Lat: {location.lat}</p>
                    <p>Lng: {location.lng}</p>
                </div>
            )}
        </div>
    );
}
