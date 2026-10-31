/**
 * RutaCero Routing Service
 * Usa OSRM (Open Source Routing Machine) para calcular rutas reales con
 * pasos, tiempo estimado y distancia — no solo una línea recta en el mapa.
 * Fuente pública gratuita: https://router.project-osrm.org
 */

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

export type RouteStep = {
  instruction: string;
  distance: number;   // metros
  duration: number;   // segundos
  distanceText: string;
  durationText: string;
  type: 'start' | 'turn' | 'continue' | 'arrive' | 'roundabout';
};

export type CalculatedRoute = {
  distance: number;    // metros
  duration: number;    // segundos
  distanceText: string; // ej. "4.2 km"
  durationText: string; // ej. "12 min"
  steps: RouteStep[];
  geometry: [number, number][]; // [lat, lng] polyline simplificada
};

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return 'Menos de 1 min';
  return `${minutes} min`;
}

function stepType(modifier: string): RouteStep['type'] {
  switch (modifier) {
    case 'uturn': return 'turn';
    case 'sharp right': return 'turn';
    case 'right': return 'turn';
    case 'slight right': return 'turn';
    case 'sharp left': return 'turn';
    case 'left': return 'turn';
    case 'slight left': return 'turn';
    case 'straight': return 'continue';
    case 'roundabout': return 'roundabout';
    case 'depart': return 'start';
    case 'arrive': return 'arrive';
    default: return 'continue';
  }
}

export async function calculateRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<CalculatedRoute | null> {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson&steps=true&annotations=true`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return null;

    const steps: RouteStep[] = route.legs
      .flatMap((leg: any) =>
        leg.steps?.map((step: any) => {
          const distance = step.distance ?? 0;
          const duration = step.duration ?? 0;
          return {
            instruction: step.name || step.maneuver?.instruction || 'Continúa',
            distance,
            duration,
            distanceText: formatDistance(distance),
            durationText: formatDuration(duration),
            type: stepType(step.maneuver?.modifier ?? 'straight'),
          };
        }) ?? []
      )
      .filter((s: RouteStep) => s.distance > 0);

    const geometry: [number, number][] = route.geometry?.coordinates?.map(
      (c: [number, number]): [number, number] => [c[1], c[0]],
    ) ?? [];

    return {
      distance: route.distance ?? 0,
      duration: route.duration ?? 0,
      distanceText: formatDistance(route.distance ?? 0),
      durationText: formatDuration(route.duration ?? 0),
      steps,
      geometry,
    };
  } catch {
    return null;
  }
}
