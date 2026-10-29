'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import SmartSearchInput from '../SmartSearchInput';
import { Button } from '../ui/Button';
import { TripCard } from '../trips/TripCard';
import { matchTrips } from '@/app/lib/catalog';
import { resolverPunto } from '@/app/lib/mapsCali';

export default function SearchExperience({
  initialOrigin,
  initialDestination,
}: {
  initialOrigin: string;
  initialDestination: string;
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);

  const results = useMemo(() => {
    const resolvedOrigin = resolverPunto(origin).nombre;
    const resolvedDest = resolverPunto(destination).nombre;
    const matched = matchTrips(resolvedOrigin, resolvedDest);
    if (matched.length) return matched;
    const fallback = [...matchTrips('', resolvedDest), ...matchTrips(resolvedOrigin, '')];
    return Array.from(new Map(fallback.map((trip) => [trip.id, trip])).values()).slice(0, 4);
  }, [origin, destination]);

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <h1 className="text-2xl font-semibold tracking-tight">Buscar viaje</h1>
      <p className="mt-1 text-sm text-neutral-500">Cupos verificados en el corredor sur de Cali.</p>

      <form
        className="mt-5 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          router.replace(`/buscar?origen=${encodeURIComponent(origin)}&destino=${encodeURIComponent(destination)}`);
        }}
      >
        <SmartSearchInput label="Origen" value={origin} onValueChange={setOrigin} placeholder="¿Desde dónde sales?" />
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Intercambiar origen y destino"
            onClick={() => {
              setOrigin(destination);
              setDestination(origin);
            }}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        <SmartSearchInput label="Destino" value={destination} onValueChange={setDestination} placeholder="¿A dónde vas?" />
        <Button type="submit" variant="success" fullWidth>
          Actualizar búsqueda
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {results.length} viaje{results.length === 1 ? '' : 's'} disponibles
        </p>
        {results.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
        {results.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-sm text-neutral-500 shadow-sm dark:bg-neutral-900">
            No hay cupos para esa ruta ahora. Publica el tramo o prueba otro destino cercano.
          </p>
        )}
      </div>
    </div>
  );
}
