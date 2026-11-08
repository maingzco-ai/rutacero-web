'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, Star, Users } from 'lucide-react';
import { TiltCard } from '../fx/TiltCard';
import { formatCOP, getInitials } from '@/app/lib/design-system';
import { cn } from '@/app/lib/design-system';
import type { Trip } from '@/app/lib/types';

export const TripCard = React.memo(function TripCard({
  trip,
  compact = false,
}: {
  trip: Trip;
  compact?: boolean;
}) {
  const available = Math.max(0, trip.seats - trip.seatsTaken);
  const full = available === 0;

  return (
    <TiltCard className="group h-full" intensity={compact ? 3.5 : 5} lift={8}>
      <article
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/[0.09]',
          'bg-[linear-gradient(158deg,rgba(22,30,52,0.72),rgba(6,9,17,0.9))]',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_40px_80px_-46px_rgba(0,0,0,1)]',
          'backdrop-blur-[24px] backdrop-saturate-[150%]',
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/25 opacity-50 blur-[70px] transition-opacity duration-700 group-hover:opacity-90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        <div className={cn('relative', compact ? 'p-4' : 'p-5')}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(from_140deg,rgba(124,156,255,0.9),rgba(92,233,220,0.9),rgba(167,139,250,0.85),rgba(124,156,255,0.9))] p-[1.5px] shadow-[0_0_22px_-4px_rgba(124,156,255,0.6)]">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0f1c] text-[11px] font-semibold tracking-wide text-text">
                  {getInitials(trip.driver.name)}
                </span>
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold leading-tight text-text">{trip.driver.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[10.5px] text-text-secondary">
                  <Star className="h-3 w-3 fill-amber/90 text-amber/90" aria-hidden="true" />
                  <span className="font-mono">{trip.driver.rating.toFixed(2)}</span>
                  <span className="opacity-40">/</span>
                  <span>{trip.driver.trips} viajes</span>
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-mono text-[15px] font-semibold leading-none tracking-tight text-text">
                {formatCOP(trip.price).replace(' COP', '')}
              </p>
              <p className="hud mt-1 text-[8px]">COP / cupo</p>
            </div>
          </div>

          <div className={cn('relative mt-4 pl-1', compact && 'mt-3')}>
            <span
              aria-hidden="true"
              className="absolute left-[5px] top-[9px] bottom-[9px] w-px bg-gradient-to-b from-primary via-accent/60 to-violet/50"
            />
            <div className="flex items-start gap-3">
              <span className="mt-[6px] h-[9px] w-[9px] shrink-0 rounded-full border border-white/80 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
              <div className="min-w-0 flex-1">
                <p className="hud mb-0.5 text-[8px]">Origen · {trip.departure}</p>
                <p className="truncate text-[13px] font-medium text-text/90">{trip.origin}</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-start gap-3">
              <span className="mt-[6px] h-[9px] w-[9px] shrink-0 rounded-full border border-accent/80 bg-accent/30 shadow-[0_0_12px_rgba(92,233,220,0.6)]" />
              <div className="min-w-0 flex-1">
                <p className="hud mb-0.5 text-[8px]">Destino · {trip.arrival}</p>
                <p className="truncate text-[13px] font-medium text-text/90">{trip.destination}</p>
              </div>
            </div>
          </div>

          {!compact && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="badge badge-secondary">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {trip.corridor}
              </span>
              <span className="badge badge-secondary">{trip.driver.vehicle}</span>
            </div>
          )}
        </div>

        <div className={cn('relative mt-auto border-t border-white/[0.07]', compact ? 'px-4 py-3' : 'px-5 py-3.5')}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-[3px]" aria-hidden="true">
                {Array.from({ length: trip.seats }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      'h-1 w-3.5 rounded-full transition-colors duration-500',
                      index < trip.seatsTaken
                        ? 'bg-white/15'
                        : 'bg-accent/80 shadow-[0_0_8px_rgba(92,233,220,0.55)]',
                    )}
                  />
                ))}
              </div>
              <span className={cn('text-[10px] font-medium', full ? 'text-error/90' : 'text-text-secondary')}>
                {full ? 'Sin cupos' : `${available} cupo${available === 1 ? '' : 's'}`}
              </span>
            </div>

            <Link
              href={`/viaje/${trip.id}`}
              aria-disabled={full}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[10.5px] font-semibold tracking-wide transition-all duration-300',
                full
                  ? 'pointer-events-none border-white/5 bg-white/[0.02] text-text-secondary/40'
                  : 'border-white/15 bg-white/[0.07] text-text hover:border-accent/35 hover:bg-accent/10 hover:text-accent',
              )}
            >
              {full ? 'Completo' : 'Reservar'}
              {!full && <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
            </Link>
          </div>
        </div>
      </article>
    </TiltCard>
  );
});
