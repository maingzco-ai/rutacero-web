'use client';

import { useState } from 'react';
import { Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '@/app/lib/design-system';

type Method = 'telegram' | 'email';

interface Props {
  onSelect: (method: Method) => void;
}

export function OnboardingContactChoice({ onSelect }: Props) {
  const [method, setMethod] = useState<Method | null>(null);

  const METHODS: { value: Method; label: string; subtitle: string; icon: React.ComponentType<{ className?: string }>; benefits: string[] }[] = [
    {
      value: 'telegram',
      label: 'Telegram',
      subtitle: 'Gratis, seguro y sin spam',
      icon: MessageSquare,
      benefits: [
        '100% gratis · Sin límites de mensajes',
        'Tu número de teléfono queda privado',
        'Notificaciones: reservas, PINs, conductor, alertas',
        'Puedes desvincular en cualquier momento con /desvincular',
      ],
    },
    {
      value: 'email',
      label: 'Correo electrónico',
      subtitle: 'Código OTP de 5 dígitos',
      icon: Mail,
      benefits: [
        'Funciona sin apps adicionales',
        'Código de 5 dígitos en tu bandeja de entrada',
        'Expira en 5 minutos por seguridad',
        'Puedes cambiarlo en tu perfil después',
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Card elevated className="mx-auto max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text mb-2">¿Cómo verificamos tu cuenta?</h2>
            <p className="text-sm text-text-secondary">
              Elige tu método preferido para recibir el código de acceso
            </p>
          </div>

          <div className="space-y-3">
            {METHODS.map((m) => {
              const Icon = m.icon;
              const isSelected = method === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMethod(m.value)}
                  className={cn(
                    'flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 dark:bg-primary/5'
                      : 'border-border bg-card hover:border-borderHover hover:bg-secondary/50 dark:border-border-dark dark:bg-card-dark dark:hover:bg-muted/30',
                  )}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-base font-semibold text-text">{m.label}</span>
                        <span className="block text-xs text-text-secondary">{m.subtitle}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <ul className="mt-3 space-y-1.5 text-xs text-text-secondary">
                      {m.benefits.map((b, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <Button
              variant="primary"
              fullWidth
              disabled={!method}
              onClick={() => method && onSelect(method)}
            >
              Continuar con {method === 'telegram' ? 'Telegram' : 'Correo'}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-text-secondary">
            Puedes cambiar tu método preferido en ajustes después
          </p>
        </div      </Card>
    </div>
  );
}