'use client';

import { useEffect, useMemo, useState } from 'react';
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
  hud?: boolean;
}

function FitRoute({ points, enabled = true }: { points: [number, number][]; enabled?: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled || points.length < 2) return;
    // Use requestAnimationFrame to ensure map is fully rendered
    const frame = requestAnimationFrame(() => {
      map.fitBounds(points, { padding: [56, 56], maxZoom: 14 });
    });
    return () => cancelAnimationFrame(frame);
  }, [map, points, enabled]);
  return null;
}

const STEP_ICON: Record<CalculatedRoute['steps'][number]['type'] | string, string> = {
  start: '◎',
  turn: '↱',
  continue: '↑',
  roundabout: '↻',
  arrive: '◈',
};

export default function InteractiveMap({ routeData, className, hud = true }: InteractiveMapProps) {
  const [route, setRoute] = useState<CalculatedRoute | null>(null);

  // Calculate dynamic center from route data or default to Cali center
  const center = useMemo((): [number, number] => {
    if (!routeData) return [3.372, -76.532]; // Cali default
    const lats = [routeData.origen.lat, routeData.destino.lat, ...routeData.paradas.map(p => p.lat)];
    const lngs = [routeData.origen.lng, routeData.destino.lng, ...routeData.paradas.map(p => p.lng)];
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
  }, [routeData]);

  const icons = useMemo(
    () => ({
      origin: L.divIcon({
        className: 'rc-marker rc-marker-origin',
        html: '<span></span>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -14],
      }),
      stop: (num: number) =>
        L.divIcon({
          className: 'rc-marker rc-marker-stop',
          html: `<span>${num}</span>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          popupAnchor: [0, -16],
        }),
      destination: L.divIcon({
        className: 'rc-marker rc-marker-destination',
        html: '<span></span>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -14],
      }),
    }),
    [],
  );

  const points: [number, number][] = useMemo(() => {
    if (!routeData) return [];
    return [
      [routeData.origen.lat, routeData.origen.lng],
      ...routeData.paradas.map((stop): [number, number] => [stop.lat, stop.lng]),
      [routeData.destino.lat, routeData.destino.lng],
    ];
  }, [routeData]);

  useEffect(() => {
    if (!routeData?.origen || !routeData?.destino) return;
    let active = true;
    calculateRoute(routeData.origen, routeData.destino).then((calculated) => {
      if (active && calculated) setRoute(calculated);
    });
    return () => {
      active = false;
    };
  }, [routeData]);

  const routePoints: [number, number][] = route?.geometry.length ? route.geometry : points;

  return (
    <div className={cn('map-frame relative h-full w-full overflow-hidden', className)}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%', minHeight: '240px' }}
        scrollWheelZoom
        zoomControl={false}
        attributionControl
        className="map-dark h-full w-full"
        whenCreated={routeData ? undefined : (map => map.setView(center, 13))}
      >
        <TileLayer
          attribution="Esri, HERE, Garmin &copy; OpenStreetMap contributors"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <TileLayer
          attribution="Esri · Reference"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          opacity={0.9}
        />

        {routeData && (
          <>
            <FitRoute points={points} enabled={true} />
            {routePoints.length >= 2 && (
              <>
                <Polyline
                  positions={routePoints}
                  color="#5ce9dc"
                  weight={16}
                  opacity={0.10}
                  lineCap="round"
                  lineJoin="round"
                />
                <Polyline
                  positions={routePoints}
                  color="#7c9cff"
                  weight={7}
                  opacity={0.22}
                  lineCap="round"
                  lineJoin="round"
                />
                <Polyline
                  positions={routePoints}
                  color="#c9d6ff"
                  weight={2.4}
                  opacity={0.95}
                  lineCap="round"
                  lineJoin="round"
                  dashArray="1 9"
                />
              </>
            )}
            <Marker position={[routeData.origen.lat, routeData.origen.lng]} icon={icons.origin}>
              <Popup closeButton={false}>
                <p className="font-semibold">{routeData.origen.name}</p>
                <p className="text-sm opacity-70">{routeData.origen.estimatedTime ?? 'Origen'}</p>
              </Popup>
            </Marker>
            {routeData.paradas.map((stop, index) => (
              <Marker key={`${stop.name}-${index}`} position={[stop.lat, stop.lng]} icon={icons.stop(index + 1)}>
                <Popup closeButton={false}>
                  <p className="font-semibold">{stop.name}</p>
                  <p className="text-sm opacity-70">{stop.estimatedTime ?? 'Parada'}</p>
                </Popup>
              </Marker>
            ))}
            <Marker position={[routeData.destino.lat, routeData.destino.lng]} icon={icons.destination}>
              <Popup closeButton={false}>
                <p className="font-semibold">{routeData.destino.name}</p>
                <p className="text-sm opacity-70">{routeData.destino.estimatedTime ?? 'Destino'}</p>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {hud && (
        <div className="pointer-events-none absolute left-4 top-4 z-[500] flex items-center gap-2">
          <span className="glass flex items-center gap-1.5 rounded-full px-2.5 py-1.5">
            <span className="h-1 w-1 animate-pulse rounded-full bg-accent" />
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-text-secondary">Ruta óptima</span>
          </span>
          {route && (
            <span className="glass hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 sm:flex">
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-text-secondary">
                {route.distanceText} · {route.durationText}
              </span>
            </span>
          )}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-4 right-4 z-[500]">
        <span className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-text-secondary/50">
          Cali · 03°22′ N / 76°31′ O
        </span>
      </div>
    </div>
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
    <div className={cn('glass relative overflow-hidden rounded-[26px] p-5', className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="hud text-[7.5px]">Origen</p>
          <p className="mt-1 truncate text-[12px] font-medium text-text">{originName}</p>
        </div>
        <div className="flex flex-1 items-center gap-1.5 px-2">
          <span className="h-1.5 w-1.5 rounded-full border border-white/60 bg-white" />
          <span className="h-px flex-1 bg-gradient-to-r from-primary/70 via-accent/60 to-violet/40" />
          <span className="h-1.5 w-1.5 rounded-full border border-accent/80 bg-accent/40" />
        </div>
        <div className="min-w-0 text-right">
          <p className="hud text-[7.5px]">Destino</p>
          <p className="mt-1 truncate text-[12px] font-medium text-text">{destName}</p>
        </div>
      </div>

      {route ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
              <p className="hud text-[7px]">Distancia</p>
              <p className="mt-1 font-mono text-[14px] text-text">{route.distanceText}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
              <p className="hud text-[7px]">Tiempo estimado</p>
              <p className="mt-1 font-mono text-[14px] text-accent">{route.durationText}</p>
            </div>
          </div>

          <div className="mt-4 max-h-56 space-y-1 overflow-y-auto pr-1 no-scrollbar" data-lenis-prevent>
            {route.steps.slice(0, 8).map((step, index) => (
              <div key={index} className="flex items-start gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-white/[0.03]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-mono text-[9px] text-primary-light">
                  {STEP_ICON[step.type] ?? '↑'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] leading-snug text-text/85">{step.instruction}</p>
                  <p className="mt-0.5 font-mono text-[8.5px] text-text-secondary/55">
                    {step.distanceText ?? `${Math.round(step.distance / 1000).toFixed(1)} km`} ·{' '}
                    {step.durationText ?? `${Math.round(step.duration / 60)} min`}
                  </p>
                </div>
              </div>
            ))}
            {route.steps.length > 8 && (
              <p className="pl-7 pt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-text-secondary/40">
                +{route.steps.length - 8} pasos
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center gap-2 py-6">
          <span className="h-1 w-1 animate-ping rounded-full bg-accent" />
          <p className="hud text-[8px]">Calculando ruta óptima</p>
        </div>
      )}
    </div>
  );
}

RouteDirections.displayName = 'RouteDirections';
