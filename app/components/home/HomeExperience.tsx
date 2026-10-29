'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Clock, LocateFixed, MapPin, Route } from 'lucide-react';
import SmartSearchInput from '../SmartSearchInput';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { TripCard } from '../trips/TripCard';
import { CURRENT_LOCATION, FREQUENT_DESTINATIONS, recentSearches, trips } from '@/app/lib/catalog';
import { resolverPunto } from '@/app/lib/mapsCali';
import type { Location } from '../InteractiveMap';

const InteractiveMap = dynamic(() => import('../InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <p className="text-sm text-neutral-500">Cargando mapa de Cali…</p>
    </div>
  ),
});

function toLocation(name: string, time?: string): Location {
  const point = resolverPunto(name);
  return { name: point.nombre, lat: point.lat, lng: point.lng, estimatedTime: time };
}

export default function HomeExperience() {
  const router = useRouter();
  const [origin, setOrigin] = useState(CURRENT_LOCATION);
  const [destination, setDestination] = useState('');

  const featured = trips.filter((trip) => trip.status === 'disponible').slice(0, 3);

  const routeData = useMemo(() => {
    const dest = destination || featured[0]?.destination || 'Universidad Icesi';
    return {
      origen: toLocation(origin, 'Ahora'),
      destino: toLocation(dest),
      paradas: [],
    };
  }, [origin, destination, featured]);

  const goSearch = (from = origin, to = destination) => {
    const destino = to || 'Universidad Icesi';
    router.push(`/buscar?origen=${encodeURIComponent(from)}&destino=${encodeURIComponent(destino)}`);
  };

  return (
    <div className="relative h-dvh overflow-hidden">
      <div className="absolute inset-0">
        <InteractiveMap routeData={routeData} className="h-full rounded-none" />
      </div>

      <BottomSheet>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            goSearch();
          }}
          className="space-y-3"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Cali · en tiempo real</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">¿A dónde vas?</h1>
          </div>
          <button
            type="button"
            onClick={() => setOrigin(CURRENT_LOCATION)}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
          >
            <LocateFixed className="h-3.5 w-3.5" />
            Ubicación actual: {origin}
          </button>
          <SmartSearchInput
            label="Destino"
            placeholder="Universidad, barrio o centro comercial"
            value={destination}
            onValueChange={setDestination}
          />
          <Button type="submit" variant="success" fullWidth>
            Buscar viajes
          </Button>
        </form>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">Destinos frecuentes</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FREQUENT_DESTINATIONS.map((place) => (
              <button
                key={place}
                type="button"
                onClick={() => goSearch(origin, place)}
                className="flex shrink-0 items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-left text-xs font-medium text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                {place
                  .replace('Pontificia Universidad Javeriana Cali', 'Javeriana Cali')
                  .replace('Universidad Autónoma de Occidente (UAO)', 'UAO')}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">Viajes recientes</h2>
          <div className="space-y-2">
            {recentSearches.map((item) => (
              <button
                key={`${item.origin}-${item.destination}`}
                type="button"
                onClick={() => goSearch(item.origin, item.destination)}
                className="flex w-full items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-3 py-3 text-left dark:border-neutral-800 dark:bg-neutral-900"
              >
                <Clock className="h-4 w-4 text-neutral-400" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.origin}</span>
                  <span className="block truncate text-xs text-neutral-500">{item.destination}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Viajes recomendados</h2>
            <button type="button" onClick={() => goSearch()} className="text-xs font-medium text-emerald-700">
              Ver todos
            </button>
          </div>
          {featured.map((trip) => (
            <TripCard key={trip.id} trip={trip} compact />
          ))}
        </section>

        <Button variant="secondary" fullWidth className="mt-6" onClick={() => router.push('/publicar')}>
          <Route className="h-4 w-4" />
          Publicar una ruta
        </Button>
      </BottomSheet>
    </div>
  );
}
