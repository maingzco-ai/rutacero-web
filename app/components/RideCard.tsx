'use client';

import { memo } from 'react';
import { Clock, GraduationCap, KeyRound, Lock, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import { formatCOP, getInitials, getMembershipLevel, getMembershipProgress } from '@/app/lib/design-system';

type RideCardProps = {
  passengerName: string;
  career: string;
  tripCount: number;
  /** Precio final en COP (tarifa justa típica: 4.500-5.000). */
  priceCOP?: number;
  pickupTime?: string;
  pickupLocation?: string;
  pin?: string;
  isOnBoard?: boolean;
};

export const RideCard = memo(function RideCard({
  passengerName,
  career,
  tripCount = 0,
  priceCOP = 4500,
  pickupTime = '6:55 AM',
  pickupLocation = 'Holguines Trade Center',
  pin = 'RC-0000',
  isOnBoard = false,
}: RideCardProps) {
  const level = getMembershipLevel(tripCount);
  const { percent, remainingText } = getMembershipProgress(tripCount);

  return (
    <Card padding="none" className="overflow-hidden">
      <CardContent className="p-0">
        {/* Avatar + nombre + carrera + badge */}
        <div className="flex items-center gap-3 p-4 pb-3 border-b border-border dark:border-border-dark">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: '#0B7CC0' }}
          >
            {getInitials(passengerName)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold leading-tight text-text">
              {passengerName}
            </h3>
            <p className="flex items-center gap-1.5 truncate text-sm text-text-secondary">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {career}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {level.label}
          </Badge>
        </div>

        {/* Progress bar towards next level */}
        <div className="px-4 pt-3 pb-2 border-b border-border dark:border-border-dark">
          <Progress value={percent} max={100} size="sm" color="primary" />
          <p className="mt-1.5 text-xs text-text-secondary text-center">
            {remainingText}
          </p>
        </div>

        {/* Precio destacado + hora de recogida */}
        <div className="flex items-end justify-between px-4 py-4 border-b border-border dark:border-border-dark">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Tarifa justa
            </p>
            <p className="mt-0.5 text-3xl font-extrabold leading-none tracking-tight text-primary">
              {formatCOP(priceCOP)}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {tripCount} viaje{tripCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 dark:bg-muted/30">
            <Clock className="h-4 w-4 text-text-secondary" aria-hidden="true" />
            <div className="leading-none text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                Recogida
              </p>
              <p className="text-sm font-bold text-text">
                {pickupTime}
              </p>
            </div>
          </div>
        </div>

        {/* Info de recogida */}
        <div className="flex items-start gap-2 px-4 py-3 border-b border-border dark:border-border-dark">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm leading-snug text-text-secondary dark:text-text-secondary">
            {pickupTime} · {pickupLocation}
          </p>
        </div>

        {/* PIN de seguridad */}
        <div className="p-4">
          {isOnBoard ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
              <Lock className="h-4 w-4" aria-hidden="true" />
              A bordo · Viaje seguro
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-canvas px-4 py-2.5 text-sm font-semibold text-primary dark:bg-primary/20 dark:border-primary/30 dark:text-primary">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              PIN de seguridad: {pin}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

RideCard.displayName = 'RideCard';
