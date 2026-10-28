'use client';

import { useState, useCallback } from 'react';
import { CarFront, Check, CheckCircle2, Settings, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { validation, calculateFairFare, formatCOP } from '@/app/lib/design-system';
import { cn } from '@/app/lib/design-system';

interface DriverFormProps {
  onSubmit: (data: {
    placa: string;
    modelo: string;
    cupos: number;
    rutaHabitual: string;
    tarifa: number;
  }) => void;
}

const RUTAS_HABITUALES = [
  'Cañasgordas → Icesi',
  'Unicentro → Javeriana',
  'Holguines → UAO',
  'Valle del Lili → Univalle',
];

export default function DriverForm({ onSubmit }: DriverFormProps) {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cupos, setCupos] = useState(3);
  const [rutaHabitual, setRutaHabitual] = useState(RUTAS_HABITUALES[0]);
  const [published, setPublished] = useState(false);

  const placaOk = validation.licensePlate(placa);
  const modeloOk = validation.required(modelo) && modelo.trim().length >= 3;
  const canPublish = placaOk && modeloOk;
  const tarifa = calculateFairFare(cupos);

  const handlePublish = useCallback(() => {
    if (!canPublish) return;
    onSubmit({
      placa: placa.trim().toUpperCase(),
      modelo: modelo.trim(),
      cupos,
      rutaHabitual,
      tarifa,
    });
    setPublished(true);
  }, [canPublish, placa, modelo, cupos, rutaHabitual, onSubmit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CarFront className="h-5 w-5 text-green-600" aria-hidden="true" />
          Publica tu ruta
        </CardTitle>
        <CardDescription>
          Tarifa justa: $15.000 base divididos entre cupos ({formatCOP(tarifa)} por pasajero)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {published && (
          <div className="rounded-xl border-2 border-dashed border-green-500/40 bg-green-50 p-4 dark:bg-green-900/20 dark:border-green-500/30">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-300">Ruta publicada</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {rutaHabitual} · {cupos} cupos · {formatCOP(tarifa)} por pasajero
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Placa */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
              Placa
            </label>
            <div className="relative">
              <input
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                placeholder="Ej: UES-123"
                className={cn(
                  'w-full rounded-2xl bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 outline-none transition-all duration-150',
                  'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                  'dark:bg-neutral-900 dark:text-white',
                  placa
                    ? placaOk
                      ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                    : 'border-neutral-200 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:focus:border-green-500 dark:focus:ring-green-500/20'
                )}
              />
              <Settings className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
              {placa && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {placaOk ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                  ) : (
                    <svg className="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                </div>
              )}
            </div>
            {placa && !placaOk && (
              <p className="mt-1.5 text-xs text-red-500">❌ Formato AAA-123</p>
            )}
          </div>

          {/* Modelo y color */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
              Modelo y color
            </label>
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Ej: Mazda 2 Blanco"
              className={cn(
                'w-full rounded-2xl bg-white py-2.5 pl-4 pr-4 text-sm text-neutral-900 outline-none transition-all duration-150',
                'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                'dark:bg-neutral-900 dark:text-white dark:border-neutral-700',
                modeloOk
                  ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  : modelo
                  ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                  : 'border-neutral-200 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:focus:border-green-500 dark:focus:ring-green-500/20'
              )}
            />
          </div>

          {/* Cupos y Ruta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
                Cupos
              </label>
              <select
                value={cupos}
                onChange={(e) => setCupos(Number(e.target.value))}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500/20"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} cupo{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
                Ruta habitual
              </label>
              <select
                value={rutaHabitual}
                onChange={(e) => setRutaHabitual(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500/20"
              >
                {RUTAS_HABITUALES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tarifa preview */}
          <div className="rounded-xl bg-neutral-100 p-4 dark:bg-neutral-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tarifa estimada por pasajero</span>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{formatCOP(tarifa)}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 text-center">
              Base $15.000 / {cupos} cupos · Tarifa justa $4.500-$5.000
            </p>
          </div>

          {/* Publish button */}
          <Button
            type="button"
            onClick={handlePublish}
            disabled={!canPublish || published}
            fullWidth
            className="pt-2"
          >
            <CarFront className="h-4 w-4" aria-hidden="true" />
            {published ? 'Ruta Publicada' : 'Publicar Ruta'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}