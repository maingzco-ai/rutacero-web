'use client';

import Link from 'next/link';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { useAppState } from '@/app/lib/AppState';
import { getTrip } from '@/app/lib/catalog';
import { formatCOP } from '@/app/lib/design-system';

export default function HistoryExperience() {
  const { reservations, published } = useAppState();

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Tus viajes</h1>
      <p className="mt-1 text-sm text-text-secondary">Cupos reservados y rutas que publicaste.</p>

      <h2 className="mt-6 text-sm font-semibold text-text">Reservas</h2>
      <div className="mt-3 space-y-3">
        {reservations.length === 0 && (
          <Card>
            <p className="text-sm text-text-secondary">Aún no tienes cupos. Busca un viaje desde el inicio.</p>
            <Link href="/" className="mt-3 inline-block text-sm font-medium text-primary">
              Ir a buscar
            </Link>
          </Card>
        )}
        {reservations.map((reservation) => {
          const trip = getTrip(reservation.tripId);
          return (
            <Card key={reservation.id} padding="md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">{trip ? `${trip.origin} → ${trip.destination}` : 'Viaje'}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Recogida: {reservation.pickup} · {reservation.createdAt}
                  </p>
                  <p className="mt-2 font-mono text-sm font-semibold text-primary">PIN {reservation.pin}</p>
                </div>
                <Badge variant="primary">{reservation.status}</Badge>
              </div>
              {trip && <p className="mt-3 text-sm text-text-secondary">{formatCOP(trip.price)} · {trip.driver.name}</p>}
            </Card>
          );
        })}
      </div>

      <h2 className="mt-8 text-sm font-semibold text-text">Rutas publicadas</h2>
      <div className="mt-3 space-y-3">
        {published.length === 0 && (
          <Card>
            <p className="text-sm text-text-secondary">Cuando publiques un cupo, aparece aquí.</p>
            <Link href="/publicar" className="mt-3 inline-block text-sm font-medium text-primary">
              Publicar ruta
            </Link>
          </Card>
        )}
        {published.map((route) => (
          <Card key={route.id}>
            <p className="font-semibold text-text">
              {route.origin} → {route.destination}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {route.departure} · {route.seats} cupos · {formatCOP(route.price)} · {route.vehicle}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
