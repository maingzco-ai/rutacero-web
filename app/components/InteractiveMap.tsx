'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/app/lib/design-system';
import { calculateRoute, type CalculatedRoute } from '@/app/lib/routing';

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
  showDirections?: boolean;
}

function FitRoute({ points }: { points: [number, number][] }) {
  const map = useMap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (points.length < 2) return;
    map.fitBounds(points, { padding: [48, 48], maxZoom: 14 });
  }, [map, points]);
  return null;
}

const STEP_ICON: Record<CalculatedRoute['steps'][number]['type'] | string, string> = {
  start: '📍',
  turn: '🔄',
  continue: '➡️',
  roundabout: '🔁',
  arrive: '🏁',
};

export default function InteractiveMap({
  routeData,
  className,
  showDirections = false,
}: InteractiveMapProps) {
  const center: [number, number] = [3.372, -76.532];
  const zoom = 13;

  const [route, setRoute] = useState<CalculatedRoute | null>(null);
  const [loading, setLoading] = useState(false);

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

  const fetchRoute = useCallback(async () => {
    if (!routeData || !routeData.origen || !routeData.destino) return;
    setLoading(true);
    try {
      const calculated = await calculateRoute(routeData.origen, routeData.destino);
      setRoute(calculated ?? null);
    } finally {
      setLoading(false);
    }
  }, [routeData]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  const routePoints: [number, number][] = route?.geometry.length ? route.geometry : points;

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
          {routePoints.length >= 2 && (
            <Polyline
              positions={routePoints}
              color="#0B7CC0"
              weight={5}
              opacity={0.92}
              lineCap="round"
              lineJoin="round"
            />
          )}
          <Marker position={[routeData.origen.lat, routeData.origen.lng]} icon={icons.origin}>
            <Popup closeButton={false}>
              <p className="font-semibold">{routeData.origen.name}</p>
              <p className="text-sm text-text-secondary">{routeData.origen.estimatedTime ?? 'Origen'}</p>
            </Popup>
          </Marker>
          {routeData.paradas.map((stop, idx) => (
            <Marker key={`${stop.name}-${idx}`} position={[stop.lat, stop.lng]} icon={icons.stop(idx + 1)}>
              <Popup closeButton={false}>
                <p className="font-semibold">{stop.name}</p>
                <p className="text-sm text-text-secondary">{stop.estimatedTime ?? 'Parada'}</p>
              </Popup>
            </Marker>
          ))}
          <Marker position={[routeData.destino.lat, routeData.destino.lng]} icon={icons.destination}>
            <Popup closeButton={false}>
              <p className="font-semibold">{routeData.destino.name}</p>
              <p className="text-sm text-text-secondary">{routeData.destino.estimatedTime ?? 'Destino'}</p>
            </Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}

interface RouteDirectionsProps {
  route: CalculatedRoute | null;
  originName: string;
  destName: string;
  className?: string;
}

export function RouteDirections({ route, originName, destName, className }: RouteDirectionsProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card shadow-md p-4 dark:border-border-dark dark:bg-card-dark', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
            O
          </div>
          <p className="text-sm font-medium text-text truncate">{originName}</p>
        </div>
        <div className="h-3 w-px bg-secondary" />
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-dark text-white text-xs font-bold">
            D
          </div>
          <p className="text-sm font-medium text-text truncate">{destName}</p>
        </div>
      </div>

      {route ? (
        <>
          <div className="flex items-center justify-between gap-4 mb-4 p-3 rounded-xl bg-secondary/50 dark:bg-muted/40">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Distancia</p>
              <p className="text-lg font-bold text-text">{route.distanceText}</p>
            </div>
            <div className="h-5 w-px bg-secondary" />
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Tiempo estimado</p>
              <p className="text-lg font-bold text-text">{route.durationText}</p>
            </div>
          </div>

          <div className="space-y-2">
            {route.steps.slice(0, 8).map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5"
              >
                <span className="flex shrink-0 items-center justify-center h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold leading-none">
                  {STEP_ICON[step.type] ?? '➡️'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text">{step.instruction}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {step.distanceText ?? `${Math.round(step.distance / 1000).toFixed(1)} km`} · {step.durationText ?? `${Math.round(step.duration / 60)} min`}
                  </p>
                </div>
              </div>
            ))}
            {route.steps.length > 8 && (
              <p className="mt-1 text-xs text-text-secondary italic">
                +{route.steps.length - 8} paso{route.steps.length - 8 > 1 ? 's' : ''} más
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-text-secondary">
          <p className="text-sm">Calculando ruta óptima…</p>
        </div>
      )}
    </div>
  );
}

RouteDirections.displayName = 'RouteDirections';
