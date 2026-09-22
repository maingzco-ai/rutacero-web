export type PuntoCali = {
  nombre: string;
  lat: number;
  lng: number;
};

// Mock local basado en backend/maps_service.py (PUNTOS_BASE_CALI + aliases).
// Permite que la demo funcione sin tener el servidor Python encendido: al buscar
// una ruta resolvemos el texto al punto canónico y sus coordenadas de Cali.
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

// Aliases normalizados (sin tildes) → nombre canónico, como en maps_service.py.
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

/** Devuelve hasta 6 sugerencias (nombres canónicos) que matchean el texto. */
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
 * Resuelve texto libre → PuntoCali. Nunca devuelve un punto fuera de Cali:
 * si no encuentra coincidencia, ancla al corredor universitario de Cañasgordas
 * (mismo comportamiento que maps_service.resolver_coordenada).
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