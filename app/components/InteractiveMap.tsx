'use client';

import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/app/lib/design-system';

export type Location = {
  lat: number;
  lng: number;
  name: string;
  estimatedTime?: string;
  price?: number;
};

interface InteractiveMapProps {
  routeData: {
    origen: Location;
    destino: Location;
    paradas: Location[];
  } | null;
  className?: string;
}

/**
 * Premium Interactive Map - Uber-inspired design
 * Only loads on client side (react-leaflet uses window)
 */
export default function InteractiveMap({ routeData, className }: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const center: [number, number] = [3.4516, -76.532];
  const zoom = 13;

  // Custom marker icons using Leaflet DivIcon with design system colors
  const icons = useMemo(() => ({
    origin: L.divIcon({
      className: 'rc-marker rc-marker-origin',
      html: '📍',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    }),
    stop: (num: number) => L.divIcon({
      className: 'rc-marker rc-marker-stop',
      html: `<span style="font-size: 12px; font-weight: 700;">${num}</span>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    }),
    destination: L.divIcon({
      className: 'rc-marker rc-marker-destination',
      html: '🏁',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    }),
  }), []);

  
  if (!routeData) {
    return (
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        scrollWheelZoom={false}
        className={cn('rounded-3xl', className)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
      </MapContainer>
    );
  }

  const { origen, destino, paradas } = routeData;
  const polylineCoords: [number, number][] = [
    [origen.lat, origen.lng],
    ...paradas.map((s): [number, number] => [s.lat, s.lng]),
    [destino.lat, destino.lng],
  ];

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', minHeight: '400px' }}
      scrollWheelZoom={false}
      className={cn('rounded-3xl', className)}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* Route polyline - premium green */}
      <Polyline
        positions={polylineCoords}
        color="#16A34A"
        weight={5}
        opacity={0.9}
        lineCap="round"
        lineJoin="round"
        dashArray={paradas.length > 0 ? undefined : '10, 10'}
      />

      {/* Origin marker */}
      <Marker position={[origen.lat, origen.lng]} icon={icons.origin}>
        <Popup
          className="rc-popup"
          closeButton={false}
        >
          <div className="p-1 min-w-[180px]">
            <p className="font-semibold text-neutral-900 dark:text-white">{origen.name}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {origen.estimatedTime ? `Hora: ${origen.estimatedTime}` : 'Punto de partida'}
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Stop markers with numbers */}
      {paradas.map((stop, idx) => (
        <Marker key={`${stop.name}-${idx}`} position={[stop.lat, stop.lng]} icon={icons.stop(idx + 1)}>
          <Popup
            className="rc-popup"
            closeButton={false}
          >
            <div className="p-1 min-w-[180px]">
              <p className="font-semibold text-neutral-900 dark:text-white">{stop.name}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {stop.estimatedTime ? `Recogida: ${stop.estimatedTime}` : 'Parada intermedia'}
              </p>
              {stop.price && (
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                  {stop.price.toLocaleString('es-CO')} COP
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Destination marker */}
      <Marker position={[destino.lat, destino.lng]} icon={icons.destination}>
        <Popup
          className="rc-popup"
          closeButton={false}
        >
          <div className="p-1 min-w-[180px]">
            <p className="font-semibold text-neutral-900 dark:text-white">{destino.name}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {destino.estimatedTime ? `Llegada: ${destino.estimatedTime}` : 'Destino final'}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

/* Leaflet popup custom styles - injected via CSS */
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .rc-popup .leaflet-popup-content-wrapper {
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      padding: 0;
    }
    .rc-popup .leaflet-popup-content {
      margin: 0;
      font-family: inherit;
    }
    .rc-popup .leaflet-popup-tip {
      background: white;
    }
    .dark .rc-popup .leaflet-popup-tip {
      background: #1a1a1a;
    }
    .dark .rc-popup .leaflet-popup-content-wrapper {
      background: #1a1a1a;
      color: white;
    }
  `;
  document.head.appendChild(style);
}