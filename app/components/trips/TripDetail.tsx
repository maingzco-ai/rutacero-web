'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatCOP, getInitials } from '@/app/lib/design-system';
import { useAppState } from '@/app/lib/AppState';
import { CURRENT_LOCATION } from '@/app/lib/catalog';
import { resolverPunto } from '@/app/lib/mapsCali';
import type { Trip } from '@/app/lib/types';

const InteractiveMap = dynamic(() => import('../InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-56 w-full animate-pulse rounded-3xl bg-neutral-100" />,
});

export default function TripDetail({ trip }: { trip: Trip }) {
  const router = useRouter();
  const { reserveSeat, reservations } = useAppState();
  const [open, setOpen] = useState(false);
  const [preference, setPreference] = useState('Conversación ligera');
  const [pickup, setPickup] = useState(CURRENT_LOCATION);
  const existing = reservations.find((item) => item.tripId === trip.id && item.status === 'confirmada');
  const available = trip.seats - trip.seatsTaken;
  const origin = resolverPunto(trip.origin);
  const dest = resolverPunto(trip.destination);

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <div className="overflow-hidden rounded-3xl">
        <div className="h-56">
          <InteractiveMap
            routeData={{
              origen: { name: origin.nombre, lat: origin.lat, lng: origin.lng, estimatedTime: trip.departure },
              destino: { name: dest.nombre, lat: dest.lat, lng: dest.lng, estimatedTime: trip.arrival },
              paradas: [],
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
          {getInitials(trip.driver.name)}
        </span>
        <div>
          <h1 className="text-xl font-semibold">{trip.driver.name}</h1>
          <p className="flex items-center gap-1 text-sm text-neutral-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {trip.driver.rating.toFixed(2)} · {trip.driver.trips} viajes · {trip.driver.university}
          </p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            {trip.driver.vehicle} · {trip.driver.plate}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-white p-4 shadow-sm dark:bg-neutral-900">
        <p className="text-sm font-medium text-neutral-500">{trip.dateLabel} · {trip.corridor}</p>
        <p className="mt-2 text-lg font-semibold">{trip.origin}</p>
        <p className="text-neutral-500">Salida {trip.departure}</p>
        <p className="mt-3 text-lg font-semibold">{trip.destination}</p>
        <p className="text-neutral-500">Llegada {trip.arrival}</p>
        {trip.notes && <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{trip.notes}</p>}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-3xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/40">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Tarifa justa</p>
          <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-300">{formatCOP(trip.price)}</p>
        </div>
        <p className="text-sm text-emerald-800 dark:text-emerald-300">{available} cupo{available === 1 ? '' : 's'}</p>
      </div>

      {existing ? (
        <div className="mt-5 rounded-3xl border border-emerald-200 bg-white p-4 dark:border-emerald-900 dark:bg-neutral-900">
          <p className="flex items-center gap-2 font-semibold text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
            Cupo confirmado
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            PIN de abordaje: <span className="font-mono font-semibold">{existing.pin}</span>. Compártelo solo con el conductor al subir.
          </p>
          <Button className="mt-4" fullWidth variant="secondary" onClick={() => router.push('/mensajes')}>
            Escribir al conductor
          </Button>
        </div>
      ) : (
        <Button className="mt-5" fullWidth variant="success" disabled={available <= 0} onClick={() => setOpen(true)}>
          Reservar este cupo
        </Button>
      )}

      <Modal open={open} title="Confirmar cupo" onClose={() => setOpen(false)}>
        <p className="text-sm text-neutral-500">El cargo se hace al confirmar. El PIN se revela al instante.</p>
        <label className="mt-4 block text-sm font-medium">
          Punto de recogida
          <input
            value={pickup}
            onChange={(event) => setPickup(event.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </label>
        <label className="mt-3 block text-sm font-medium">
          Preferencia
          <select
            value={preference}
            onChange={(event) => setPreference(event.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option>Conversación ligera</option>
            <option>Silencio</option>
            <option>Música baja</option>
            <option>Aire acondicionado</option>
          </select>
        </label>
        <Button
          className="mt-5"
          variant="success"
          fullWidth
          onClick={() => {
            const reservation = reserveSeat(trip.id, pickup, preference);
            setOpen(false);
            if (reservation) router.push('/historial');
          }}
        >
          Pagar {formatCOP(trip.price)} y reservar
        </Button>
      </Modal>
    </div>
  );
}
