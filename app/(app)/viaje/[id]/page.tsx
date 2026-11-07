'use client';

import { use } from 'react';
import Link from 'next/link';
import TripDetail from '../../../components/trips/TripDetail';
import { getTrip, addPublishedToCatalog } from '../../../lib/catalog';
import { useAppState } from '../../../lib/AppState';

type TripPageProps = {
  params: Promise<{ id: string }>;
};

export default function TripPage({ params }: TripPageProps) {
  const { id } = use(params);
  const { published } = useAppState();

  let trip = getTrip(id);
  if (!trip) {
    const pub = published.find((p) => p.id === id);
    if (pub) {
      trip = addPublishedToCatalog(pub);
    }
  }

  if (!trip) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider mb-2">
          DEMO · RUTA
        </span>
        <h1 className="text-xl font-bold text-text">Viaje no encontrado</h1>
        <p className="mt-2 text-sm text-text-secondary max-w-xs">
          El viaje seleccionado no está disponible o ya ha expirado.
        </p>
        <Link
          href="/buscar"
          className="mt-6 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          Explorar viajes disponibles
        </Link>
      </div>
    );
  }

  return <TripDetail trip={trip} />;
}
