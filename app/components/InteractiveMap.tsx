'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
}

export default function InteractiveMap({ routeData }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="h-[400px] w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />;

  const center: [number, number] = [3.4516, -76.532];
  const zoom = 13;

  // Iconos personalizados
  const getBlueIcon = () => new L.DivIcon({
    html: `<div style="background-color:#3B82F6;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">📍</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

  const getGreenNumberedIcon = (num: number) => new L.DivIcon({
    html: `<div style="background-color:#10B981;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${num}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

  if (!routeData) {
    return (
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', minHeight: '400px' }} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', minHeight: '400px' }} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Línea de ruta */}
      <Polyline positions={polylineCoords} color="#10B981" weight={4} opacity={0.8} />

      {/* Origen */}
      <Marker position={[origen.lat, origen.lng]} icon={getBlueIcon()}>
        <Popup>
          <b>{origen.name}</b><br />
          Hora: {origen.estimatedTime || 'N/A'}<br />
          Costo: ${origen.price?.toFixed(2) || '0.00'} COP
        </Popup>
      </Marker>

      {/* Paradas */}
      {paradas.map((stop, idx) => (
        <Marker key={`${stop.name}-${idx}`} position={[stop.lat, stop.lng]} icon={getGreenNumberedIcon(idx + 1)}>
          <Popup>
            <b>{stop.name}</b><br />
            Hora: {stop.estimatedTime || 'N/A'}<br />
            Costo: ${stop.price?.toFixed(2) || '0.00'} COP
          </Popup>
        </Marker>
      ))}

      {/* Destino */}
      <Marker position={[destino.lat, destino.lng]}>
        <Popup>
          <b>{destino.name}</b><br />
          Hora: {destino.estimatedTime || 'N/A'}<br />
          Costo: ${destino.price?.toFixed(2) || '0.00'} COP
        </Popup>
      </Marker>
    </MapContainer>
  );
}
