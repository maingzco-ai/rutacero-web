'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
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

function FitRoute({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(points, { padding: [48, 48], maxZoom: 14 });
  }, [map, points]);
  return null;
}

export default function InteractiveMap({ routeData, className }: InteractiveMapProps) {
  const center: [number, number] = [3.372, -76.532];
  const zoom = 13;

  const icons = useMemo(
    () => ({
      origin: L.divIcon({
        className: 'rc-marker rc-marker-origin',
        html: '<span></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -12],
      }),
      stop: (num: number) =>
        L.divIcon({
          className: 'rc-marker rc-marker-stop',
          html: `<span>${num}</span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        }),
      destination: L.divIcon({
        className: 'rc-marker rc-marker-destination',
        html: '<span></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -12],
      }),
    }),
    [],
  );

  const points: [number, number][] = routeData
    ? [
        [routeData.origen.lat, routeData.origen.lng],
        ...routeData.paradas.map((stop): [number, number] => [stop.lat, stop.lng]),
        [routeData.destino.lat, routeData.destino.lng],
      ]
    : [];

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', minHeight: '240px' }}
      scrollWheelZoom
      zoomControl={false}
      className={cn('h-full w-full', className)}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />

      {routeData && (
        <>
          <FitRoute points={points} />
          <Polyline positions={points} color="#0F8A5F" weight={5} opacity={0.92} lineCap="round" lineJoin="round" />
          <Marker position={[routeData.origen.lat, routeData.origen.lng]} icon={icons.origin}>
            <Popup closeButton={false}>
              <p className="font-semibold">{routeData.origen.name}</p>
              <p className="text-sm text-neutral-500">{routeData.origen.estimatedTime ?? 'Origen'}</p>
            </Popup>
          </Marker>
          {routeData.paradas.map((stop, idx) => (
            <Marker key={`${stop.name}-${idx}`} position={[stop.lat, stop.lng]} icon={icons.stop(idx + 1)}>
              <Popup closeButton={false}>
                <p className="font-semibold">{stop.name}</p>
                <p className="text-sm text-neutral-500">{stop.estimatedTime ?? 'Parada'}</p>
              </Popup>
            </Marker>
          ))}
          <Marker position={[routeData.destino.lat, routeData.destino.lng]} icon={icons.destination}>
            <Popup closeButton={false}>
              <p className="font-semibold">{routeData.destino.name}</p>
              <p className="text-sm text-neutral-500">{routeData.destino.estimatedTime ?? 'Destino'}</p>
            </Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}
