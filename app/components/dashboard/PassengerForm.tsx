'use client';

import { useState, useCallback } from 'react';
import { Check, CheckCircle2, Lock, User, Mail, MessageCircle, Music, Volume2, Wind } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { validation, generatePin, calculateFairFare } from '@/app/lib/design-system';
import { cn } from '@/app/lib/design-system';

interface PassengerFormProps {
  routeData: { paradas: Array<{ name: string }> } | null;
  pasajerosCount: number;
  onSubmit: (pasajero: {
    nombre: string;
    carrera: string;
    viajes: number;
    precio: number;
    recogida: string;
    pin: string;
    ubicacion: string;
    preferencia?: string;
  }) => void;
}

const PREFERENCIAS = [
  { value: 'Silencio', icon: Volume2, label: 'Silencio' },
  { value: 'Música', icon: Music, label: 'Música' },
  { value: 'Aire', icon: Wind, label: 'Aire acondicionado' },
];

export default function PassengerForm({ routeData, pasajerosCount, onSubmit }: PassengerFormProps) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preferencia, setPreferencia] = useState('Música');
  const [submitted, setSubmitted] = useState<{ pin: string; nombre: string } | null>(null);

  const correoOk = validation.email(correo);
  const whatsappOk = validation.whatsapp(whatsapp);
  const nombreOk = validation.required(nombre);
  const canSubmit = nombreOk && correoOk && whatsappOk;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const pin = generatePin();
    const ubicacion = routeData?.paradas[0]?.name ?? 'Cañasgordas / Pance';

    onSubmit({
      nombre: nombre.trim(),
      carrera: 'Estudiante verificado',
      viajes: 0,
      precio: 4500,
      recogida: '6:58 AM',
      pin,
      ubicacion,
      preferencia,
    });

    setSubmitted({ pin, nombre: nombre.trim() });
    setNombre('');
    setCorreo('');
    setWhatsapp('');
  }, [canSubmit, nombre, correo, whatsapp, preferencia, routeData, onSubmit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-green-600" aria-hidden="true" />
          Solicita tu cupo
        </CardTitle>
        <CardDescription>
          Solo correos institucionales · Validación en tiempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {submitted && (
          <div className="rounded-xl border-2 border-dashed border-green-500/40 bg-green-50 p-4 dark:bg-green-900/20 dark:border-green-500/30">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-300">Cupo solicitado</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  PIN de abordaje: <strong>{submitted.pin}</strong> — Dictalo al conductor al subir.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
              Nombre completo
            </label>
            <div className="relative">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Ana Gómez"
                className={cn(
                  'w-full rounded-2xl bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 outline-none transition-all duration-150',
                  'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                  'dark:bg-neutral-900 dark:text-white dark:border-neutral-700',
                  nombreOk
                    ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                    : 'border-neutral-200 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:focus:border-green-500 dark:focus:ring-green-500/20'
                )}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
          </div>

          {/* Correo institucional */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
              Correo institucional
            </label>
            <div className="relative">
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ana.gomez@icesi.edu.co"
                className={cn(
                  'w-full rounded-2xl bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 outline-none transition-all duration-150',
                  'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                  'dark:bg-neutral-900 dark:text-white',
                  correo
                    ? correoOk
                      ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                    : 'border-neutral-200 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:focus:border-green-500 dark:focus:ring-green-500/20'
                )}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
              {correo && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {correoOk ? (
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
            {correo && (
              <p className={cn('mt-1.5 text-xs', correoOk ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                {correoOk
                  ? '✅ Verificado (@icesi, @javeriana, @uao, @univalle)'
                  : '❌ Usa un correo institucional universitario'}
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
              WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej: 3151234567"
                className={cn(
                  'w-full rounded-2xl bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 outline-none transition-all duration-150',
                  'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                  'dark:bg-neutral-900 dark:text-white',
                  whatsapp
                    ? whatsappOk
                      ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                    : 'border-neutral-200 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:focus:border-green-500 dark:focus:ring-green-500/20'
                )}
              />
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
              {whatsapp && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {whatsappOk ? (
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
            {whatsapp && !whatsappOk && (
              <p className="mt-1.5 text-xs text-red-500">❌ Ingresa 10 dígitos empezando por 3</p>
            )}
          </div>

          {/* Preferencia */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
              Preferencia de viaje
            </label>
            <select
              value={preferencia}
              onChange={(e) => setPreferencia(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500/20"
            >
              {PREFERENCIAS.map(({ value, icon: Icon, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            fullWidth
            className="pt-2"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            Confirmar Solicitud
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}