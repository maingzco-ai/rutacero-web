'use client';

import { Users, Clock, Leaf, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RideCard } from '../RideCard';
import { formatCOP } from '@/app/lib/design-system';
import { cn } from '@/app/lib/design-system';

interface PassengersListProps {
  pasajeros: Array<{
    nombre: string;
    carrera: string;
    viajes: number;
    precio: number;
    recogida: string;
    pin: string;
    ubicacion: string;
    preferencia?: string;
  }>;
}

export default function PassengersList({ pasajeros }: PassengersListProps) {
  if (pasajeros.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" aria-hidden="true" />
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">No hay pasajeros asignados aún</p>
          <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
            Los pasajeros aparecerán aquí cuando soliciten cupo
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" aria-hidden="true" />
          Pasajeros asignados
        </CardTitle>
        <Badge variant="success">{pasajeros.length} pasajero{pasajeros.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="space-y-3">
        {pasajeros.map((p) => (
          <RideCard
            key={p.pin}
            passengerName={p.nombre}
            career={p.carrera}
            tripCount={p.viajes}
            priceCOP={p.precio}
            pickupTime={p.recogida}
            pickupLocation={p.ubicacion}
            pin={p.pin}
          />
        ))}
      </div>

      {/* Summary metrics */}
      <Card padding="md" className="bg-neutral-50 dark:bg-neutral-900/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {pasajeros.reduce((sum, p) => sum + p.precio, 0).toLocaleString('es-CO')}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Ingresos totales estimados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCOP(pasajeros.reduce((sum, p) => sum + p.precio, 0) / pasajeros.length || 0)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Promedio por pasajero</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {pasajeros.reduce((sum, p) => sum + p.viajes, 0)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Experiencia combinada</p>
          </div>
        </div>
      </Card>
    </div>
  );
}