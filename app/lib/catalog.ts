import type { Trip, PublishedRoute } from './types';

export type PuntoCali = {
  nombre: string;
  lat: number;
  lng: number;
};

/**
 * Ubicación predeterminada del usuario en Cali. Sirve de ancla para el mapa
 * y los formularios cuando no hay una selección previa.
 */
export const CURRENT_LOCATION = 'Ciudad Jardín';

/**
 * Destinos frecuentes del corredor universitario de Cali.
 * Se muestran como atajos en la pantalla de inicio.
 */
export const FREQUENT_DESTINATIONS = [
  'Universidad Icesi',
  'Pontificia Universidad Javeriana Cali',
  'Universidad Autónoma de Occidente (UAO)',
  'Universidad del Valle (Meléndez)',
  'Unicentro Cali',
  'Jardín Plaza',
] as const;

/**
 * Historial reciente de búsquedas del usuario.
 */
export const recentSearches = [
  { origin: 'Unicentro Cali', destination: 'Universidad Icesi' },
  { origin: 'Holguines Trade Center', destination: 'Pontificia Universidad Javeriana Cali' },
  { origin: 'Ciudad Jardín', destination: 'Universidad Autónoma de Occidente (UAO)' },
  { origin: 'Valle del Lili', destination: 'Universidad del Valle (Meléndez)' },
];

// Catálogo local de puntos en Cali (alineado con el servicio de mapas).
export const PUNTOS_BASE_CALI: Record<string, PuntoCali> = {
  'Universidad Icesi': { nombre: 'Universidad Icesi', lat: 3.3418, lng: -76.5303 },
  'Pontificia Universidad Javeriana Cali': { nombre: 'Pontificia Universidad Javeriana Cali', lat: 3.3486, lng: -76.5322 },
  'Universidad Autónoma de Occidente (UAO)': { nombre: 'Universidad Autónoma de Occidente (UAO)', lat: 3.3536, lng: -76.5239 },
  'Universidad del Valle (Meléndez)': { nombre: 'Universidad del Valle (Meléndez)', lat: 3.375, lng: -76.5335 },
  'Unicentro Cali': { nombre: 'Unicentro Cali', lat: 3.3768, lng: -76.537 },
  'Holguines Trade Center': { nombre: 'Holguines Trade Center', lat: 3.369, lng: -76.5285 },
  'Jardín Plaza': { nombre: 'Jardín Plaza', lat: 3.3675, lng: -76.532 },
  'Valle del Lili': { nombre: 'Valle del Lili', lat: 3.336, lng: -76.525 },
  'Ciudad Jardín': { nombre: 'Ciudad Jardín', lat: 3.3644, lng: -76.5342 },
  'Cañasgordas / Pance': { nombre: 'Cañasgordas / Pance', lat: 3.332, lng: -76.535 },
  'Menga / Chipichape (Norte)': { nombre: 'Menga / Chipichape (Norte)', lat: 3.4735, lng: -76.5262 },
  'Centro de Cali': { nombre: 'Centro de Cali', lat: 3.4516, lng: -76.532 },
  'Meléndez': { nombre: 'Meléndez', lat: 3.3595, lng: -76.54 },
  'Santa Anita': { nombre: 'Santa Anita', lat: 3.354, lng: -76.538 },
  'Pasoancho con 66 / La 14 de Pasoancho': { nombre: 'Pasoancho con 66 / La 14 de Pasoancho', lat: 3.385, lng: -76.532 },
  'Calle 5ta / Calle 5': { nombre: 'Calle 5ta / Calle 5', lat: 3.41, lng: -76.54 },
  'San Antonio': { nombre: 'San Antonio', lat: 3.4445, lng: -76.5405 },
};

// Aliases normalizados (sin tildes) → nombre canónico
const ALIASES: Record<string, string> = {
  cenco: 'Unicentro Cali',
  unicentro: 'Unicentro Cali',
  'unicentro cali': 'Unicentro Cali',
  holgui: 'Holguines Trade Center',
  holguines: 'Holguines Trade Center',
  'holguines trade center': 'Holguines Trade Center',
  trade: 'Holguines Trade Center',
  lili: 'Valle del Lili',
  'valle del lili': 'Valle del Lili',
  clinica: 'Valle del Lili',
  icesi: 'Universidad Icesi',
  'universidad icesi': 'Universidad Icesi',
  jav: 'Pontificia Universidad Javeriana Cali',
  javeriana: 'Pontificia Universidad Javeriana Cali',
  uao: 'Universidad Autónoma de Occidente (UAO)',
  autonoma: 'Universidad Autónoma de Occidente (UAO)',
  univalle: 'Universidad del Valle (Meléndez)',
  'universidad del valle': 'Universidad del Valle (Meléndez)',
  valle: 'Universidad del Valle (Meléndez)',
  jardin: 'Ciudad Jardín',
  'ciudad jardin': 'Ciudad Jardín',
  plaza: 'Jardín Plaza',
  'jardin plaza': 'Jardín Plaza',
  pance: 'Cañasgordas / Pance',
  canasgordas: 'Cañasgordas / Pance',
  chipichape: 'Menga / Chipichape (Norte)',
  menga: 'Menga / Chipichape (Norte)',
  centro: 'Centro de Cali',
  'centro de cali': 'Centro de Cali',
  melendez: 'Meléndez',
  'santa anita': 'Santa Anita',
  pasoancho: 'Pasoancho con 66 / La 14 de Pasoancho',
  'calle 5': 'Calle 5ta / Calle 5',
  'san antonio': 'San Antonio',
};

/** Normaliza texto: minúsculas, sin tildes, sin espacios extra. */
export function normalizar(texto: string): string {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/** Devuelve hasta 6 sugerencias (nombres canónicos) que coinciden con el texto. */
export function buscarSugerencias(consulta: string): string[] {
  const q = normalizar(consulta);
  if (!q) return [];
  const directas = Object.keys(PUNTOS_BASE_CALI).filter((n) =>
    normalizar(n).includes(q),
  );
  const porAlias = Object.entries(ALIASES)
    .filter(([alias]) => alias.includes(q))
    .map(([, nombre]) => nombre);
  return Array.from(new Set([...directas, ...porAlias])).slice(0, 6);
}

/**
 * Resuelve texto libre → PuntoCali. Ancla siempre a un punto válido de Cali.
 */
export function resolverPunto(texto: string): PuntoCali {
  const norm = normalizar(texto);
  if (!norm) return PUNTOS_BASE_CALI['Cañasgordas / Pance'];

  const directa = Object.keys(PUNTOS_BASE_CALI).find((n) => normalizar(n) === norm);
  if (directa) return PUNTOS_BASE_CALI[directa];

  const nombrePorAlias = Object.entries(ALIASES).find(([alias]) => alias === norm);
  if (nombrePorAlias) return PUNTOS_BASE_CALI[nombrePorAlias[1]];

  const porSubstring = Object.keys(PUNTOS_BASE_CALI).find((n) => normalizar(n).includes(norm));
  if (porSubstring) return PUNTOS_BASE_CALI[porSubstring];

  const aliasPorSubstring = Object.entries(ALIASES).find(([alias]) => norm.includes(alias) || alias.includes(norm));
  if (aliasPorSubstring) return PUNTOS_BASE_CALI[aliasPorSubstring[1]];

  return PUNTOS_BASE_CALI['Cañasgordas / Pance'];
}

/**
 * Viajes verificados base para el corredor universitario de Cali (Modo DEMO y producción inicial).
 */
export const DEFAULT_TRIPS: Trip[] = [
  {
    id: 'trip-demo-1',
    origin: 'Ciudad Jardín',
    destination: 'Universidad Icesi',
    driver: {
      id: 'drv-carlos',
      name: 'Carlos Mendoza',
      rating: 4.95,
      trips: 42,
      vehicle: 'Mazda 2 Blanco',
      plate: 'HNK-204',
      university: 'Universidad Icesi',
    },
    seats: 3,
    seatsTaken: 1,
    price: 4500,
    departure: '06:45 AM',
    arrival: '07:10 AM',
    dateLabel: 'Hoy',
    corridor: 'Sur · Cañasgordas',
    status: 'disponible',
    notes: 'Salgo frente al Carulla de Ciudad Jardín. Abordaje puntual con PIN.',
  },
  {
    id: 'trip-demo-2',
    origin: 'Unicentro Cali',
    destination: 'Pontificia Universidad Javeriana Cali',
    driver: {
      id: 'drv-vale',
      name: 'Valentina Restrepo',
      rating: 4.98,
      trips: 68,
      vehicle: 'Renault Sandero Gris',
      plate: 'UZO-819',
      university: 'Javeriana Cali',
    },
    seats: 4,
    seatsTaken: 2,
    price: 4500,
    departure: '07:15 AM',
    arrival: '07:35 AM',
    dateLabel: 'Hoy',
    corridor: 'Sur · Pasoancho',
    status: 'disponible',
    notes: 'Bahía de taxis Unicentro entrada Pasoancho.',
  },
  {
    id: 'trip-demo-3',
    origin: 'Holguines Trade Center',
    destination: 'Universidad Autónoma de Occidente (UAO)',
    driver: {
      id: 'drv-santi',
      name: 'Santiago Arango',
      rating: 4.90,
      trips: 31,
      vehicle: 'Chevrolet Onix Azul',
      plate: 'KLU-492',
      university: 'UAO',
    },
    seats: 3,
    seatsTaken: 0,
    price: 5000,
    departure: '07:30 AM',
    arrival: '07:55 AM',
    dateLabel: 'Hoy',
    corridor: 'Sur · Cañasgordas',
    status: 'disponible',
    notes: 'Aire acondicionado, música baja, espacio para morral.',
  },
  {
    id: 'trip-demo-4',
    origin: 'Valle del Lili',
    destination: 'Universidad del Valle (Meléndez)',
    driver: {
      id: 'drv-camila',
      name: 'Camila Ospina',
      rating: 4.92,
      trips: 27,
      vehicle: 'Kia Picanto Rojo',
      plate: 'MNX-631',
      university: 'Univalle',
    },
    seats: 3,
    seatsTaken: 1,
    price: 4500,
    departure: '08:00 AM',
    arrival: '08:20 AM',
    dateLabel: 'Hoy',
    corridor: 'Sur · Simón Bolívar',
    status: 'disponible',
    notes: 'Punto de encuentro: Parque El Ingenio / Valle del Lili.',
  },
];

/**
 * Catálogo mutable de viajes en memoria.
 */
export let catalogTrips: Trip[] = [...DEFAULT_TRIPS];

/**
 * Agrega un viaje publicado al catálogo buscable.
 */
export function addPublishedToCatalog(published: PublishedRoute): Trip {
  const existing = catalogTrips.find((t) => t.id === published.id);
  if (existing) return existing;

  const trip: Trip = {
    id: published.id,
    origin: published.origin,
    destination: published.destination,
    driver: {
      id: `drv-${published.id}`,
      name: 'Conductor Verificado',
      rating: 5.0,
      trips: 1,
      vehicle: published.vehicle,
      plate: published.plate,
      university: 'Universidad de Cali',
    },
    seats: published.seats,
    seatsTaken: 0,
    price: published.price,
    departure: published.departure || '07:00 AM',
    arrival: '07:30 AM',
    dateLabel: 'Hoy',
    corridor: 'Sur · Cañasgordas',
    status: 'disponible',
    notes: `Ruta publicada: ${published.vehicle} · Placa ${published.plate}`,
  };

  catalogTrips = [trip, ...catalogTrips];
  return trip;
}

/**
 * Sincroniza todas las rutas publicadas guardadas en localStorage con el catálogo activo.
 */
export function syncPublishedWithCatalog(publishedList: PublishedRoute[]): void {
  for (const pub of publishedList) {
    if (!catalogTrips.some((t) => t.id === pub.id)) {
      addPublishedToCatalog(pub);
    }
  }
}

/**
 * Busca viajes publicados que coincidan con origen/destino.
 */
export function matchTrips(origin: string, destination: string): Trip[] {
  const o = normalizar(origin);
  const d = normalizar(destination);
  return catalogTrips.filter((trip) => {
    const tripOrig = normalizar(trip.origin);
    const tripDest = normalizar(trip.destination);
    const originHit = !o || tripOrig.includes(o) || o.includes(tripOrig.slice(0, 8));
    const destHit = !d || tripDest.includes(d) || d.includes(tripDest.slice(0, 8));
    return originHit && destHit;
  });
}

/** Obtiene un viaje por su ID del catálogo. */
export function getTrip(id: string): Trip | undefined {
  return catalogTrips.find((trip) => trip.id === id);
}

/** Getter dinámico para compatibilidad total con export const trips */
export const trips = new Proxy(catalogTrips, {
  get(_target, prop) {
    return Reflect.get(catalogTrips, prop);
  },
});
