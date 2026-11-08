'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Route } from 'lucide-react';
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
      <div className="page-shell flex min-h-[70vh] items-center justify-center">
        <div className="glass-strong relative w-full max-w-md overflow-hidden rounded-[30px] p-8 text-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-primary-light">
            <Route className="h-6 w-6" />
          </span>
          <p className="hud mt-5 text-[8px]">Vector fuera de línea</p>
          <h1 className="display mt-2 text-[1.8rem] text-text">Esta ruta ya no existe.</h1>
          <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">
            El cupo expiró o el conductor cerró la salida. El motor puede recalcular otro vector en tu
            corredor.
          </p>
          <Link
            href="/buscar"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(140deg,#eef3ff,#b9c8ff_55%,#7c9cff)] px-5 py-2.5 text-[12px] font-semibold text-[#07101f] transition-transform duration-300 hover:scale-[1.02]"
          >
            Explorar rutas activas
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return <TripDetail trip={trip} />;
}
