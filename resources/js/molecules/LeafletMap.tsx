import L from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface MarkerData {
    id: string;
    name: string;
    address?: string | null;
    latitude: number;
    longitude: number;
}

interface Props {
    markers: MarkerData[];
    className?: string;
}

// Fix default marker icon path issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function LeafletMap({ markers, className = '' }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || instanceRef.current) {
return;
}

        const map = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        instanceRef.current = map;

        return () => {
            map.remove();
            instanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = instanceRef.current;

        if (!map) {
return;
}

        // Clear existing markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        if (markers.length === 0) {
return;
}

        const bounds = L.latLngBounds([]);

        markers.forEach((m) => {
            const latlng = L.latLng(m.latitude, m.longitude);
            bounds.extend(latlng);

            const marker = L.marker(latlng).addTo(map);
            marker.bindPopup(`
                <strong>${m.name}</strong>
                ${m.address ? `<br><span style="font-size:12px;color:#666">${m.address}</span>` : ''}
            `);
        });

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [markers]);

    return (
        <div
            ref={mapRef}
            className={`rounded-2xl overflow-hidden shadow-sm ${className}`}
            style={{ height: 360, zIndex: 0 }}
        />
    );
}
