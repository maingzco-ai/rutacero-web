'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, Star, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCOP, getInitials } from '@/app/lib/design-system';
import type { Trip } from '@/app/lib/types';

export const TripCard = React.memo(
  function TripCard({ trip, compact = false }: { trip: Trip; compact?: boolean }) {
    const available = Math.max(0, trip.seats - trip.seatsTaken);
    const full = available === 0;

    return (
      <Card padding="none" elevated className="overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {getInitials(trip.driver.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold leading-tight text-text">{trip.driver.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  {trip.driver.rating.toFixed(2)} · {trip.driver.trips} viajes
                </p>
              </div>
              <p className="text-right text-lg font-semibold text-primary">{formatCOP(trip.price)}</p>
            </div>
            <div className="mt-3 space-y-1.5 text-sm">
              <p className="flex items-center gap-2 text-text-secondary dark:text-text-secondary">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate">{trip.origin}</span>
              </p>
              <p className="flex items-center gap-2 text-text-secondary dark:text-text-secondary">
                <MapPin className="h-4 w-4 text-text-secondary" />
                <span className="truncate">{trip.destination}</span>
              </p>
            </div>
            {!compact && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" size="sm">
                  <Clock className="h-3 w-3" />
                  {trip.departure} – {trip.arrival}
                </Badge>
                <Badge variant={full ? 'outline' : 'primary'} size="sm">
                  <Users className="h-3 w-3" />
                  {full ? 'Sin cupos' : `${available} cupo${available === 1 ? '' : 's'}`}
                </Badge>
                <Badge variant="outline" size="sm">
                  {trip.driver.vehicle}
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-border px-4 py-3 dark:border-border-dark">
          <Link href={`/viaje/${trip.id}`}>
            <Button fullWidth disabled={full} variant={full ? 'secondary' : 'primary'}>
              {full ? 'Viaje completo' : 'Reservar cupo'}
            </Button>
          </Link>
        </div>
      </Card>
    );
  }
);
