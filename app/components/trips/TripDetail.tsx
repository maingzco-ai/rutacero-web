'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatCOP, getInitials } from '@/app/lib/design-system';
import { useAppState } from '@/app/lib/AppState';
import { CURRENT_LOCATION } from '@/app/lib/catalog';
import { resolverPunto } from '@/app/lib/mapsCali';
import { calculateRoute, type CalculatedRoute } from '@/app/lib/routing';
import type { Trip } from '@/app/lib/types';
import { RouteDirections } from '../InteractiveMap';

const InteractiveMap = dynamic(() => import('../InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-56 w-full animate-pulse rounded-3xl bg-secondary" />,
});

export default function TripDetail({ trip }: { trip: Trip }) {
  const router = useRouter();
  const { reserveSeat, reservations } = useAppState();
  const [open, setOpen] = useState(false);
  const [preference, setPreference] = useState('Conversación ligera');
  const [pickup, setPickup] = useState(CURRENT_LOCATION);
  const [routeLoading, setRouteLoading] = useState(false);
  const [route, setRoute] = useState<CalculatedRoute | null>(null);

  const existing = reservations.find((item) => item.tripId === trip.id && item.status === 'confirmada');
  const available = trip.seats - trip.seatsTaken;
  const origin = resolverPunto(trip.origin);
  const dest = resolverPunto(trip.destination);

  const routeData = useMemo(
    () => ({
      origen: { name: origin.nombre, lat: origin.lat, lng: origin.lng, estimatedTime: trip.departure },
      destino: { name: dest.nombre, lat: dest.lat, lng: dest.lng, estimatedTime: trip.arrival },
      paradas: [],
    }),
    [origin, dest, trip.departure, trip.arrival],
  );

  useMemo(() => {
    let cancelled = false;
    setRouteLoading(true);
    calculateRoute(routeData.origen, routeData.destino)
      .then((calculated) => {
        if (!cancelled && calculated) {
          setRoute(calculated);
        }
      })
      .finally(() => {
        if (!cancelled) setRouteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [routeData]);

  const routeSteps = useMemo(
    () => ({ origin: origin.nombre, dest: dest.nombre }),
    [origin, dest],
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <div className="overflow-hidden rounded-3xl">
        <div className="h-56">
          <InteractiveMap routeData={routeData} showDirections />
        </div>
        <RouteDirections route={route} originName={routeSteps.origin} destName={routeSteps.dest} className="mt-3" />
      </div>

      <div className="mt-5 flex items-start gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-white">
          {getInitials(trip.driver.name)}
        </span>
        <div>
          <h1 className="text-xl font-semibold text-text">{trip.driver.name}</h1>
          <p className="flex items-center gap-1 text-sm text-text-secondary">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {trip.driver.rating.toFixed(2)} · {trip.driver.trips} viajes · {trip.driver.university}
          </p>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary">
            {trip.driver.vehicle} · {trip.driver.plate}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-card p-4 shadow-sm dark:bg-background-dark">
        <p className="text-sm font-medium text-text-secondary">{trip.dateLabel} · {trip.corridor}</p>
        <p className="mt-2 text-lg font-semibold text-text">{trip.origin}</p>
        <p className="text-text-secondary">Salida {trip.departure}</p>
        <p className="mt-3 text-lg font-semibold text-text">{trip.destination}</p>
        <p className="text-text-secondary">Llegada {trip.arrival}</p>
        {trip.notes && <p className="mt-3 text-sm text-text-secondary dark:text-text-secondary">{trip.notes}</p>}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-3xl bg-canvas px-4 py-3 dark:bg-muted/30">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">Tarifa justa</p>
          <p className="text-2xl font-semibold text-primary">{formatCOP(trip.price)}</p>
        </div>
        <p className="text-sm text-primary">{available} cupo{available === 1 ? '' : 's'}</p>
      </div>

      {existing ? (
        <div className="mt-5 rounded-3xl border border-primary/20 bg-background p-4 dark:border-primary/30 dark:bg-background-dark">
          <p className="flex items-center gap-2 font-semibold text-primary">
            <ShieldCheck className="h-5 w-5" />
            Cupo confirmado
          </p>
          <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary">
            PIN de abordaje: <span className="font-mono font-semibold">{existing.pin}</span>. Compártelo solo con el conductor al subir.
          </p>
          <Button className="mt-4" fullWidth variant="secondary" onClick={() => router.push('/mensajes')}>
            Escribir al conductor
          </Button>
        </div>
      ) : (
        <Button className="mt-5" fullWidth variant="primary" disabled={available <= 0} onClick={() => setOpen(true)}>
          Reservar este cupo
        </Button>
      )}

      <Modal open={open} title="Confirmar cupo" onClose={() => setOpen(false)}>
        <p className="text-sm text-text-secondary">El cargo se hace al confirmar. El PIN se revela al instante.</p>
        <label className="mt-4 block text-sm font-medium">
          Punto de recogida
          <input
            value={pickup}
            onChange={(event) => setPickup(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm dark:border-border-dark dark:bg-input-dark"
          />
        </label>
        <label className="mt-3 block text-sm font-medium">
          Preferencia
          <select
            value={preference}
            onChange={(event) => setPreference(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm dark:border-border-dark dark:bg-input-dark"
          >
            <option>Conversación ligera</option>
            <option>Silencio</option>
            <option>Música baja</option>
            <option>Aire acondicionado</option>
          </select>
        </label>
        <Button
          className="mt-5"
          variant="primary"
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
