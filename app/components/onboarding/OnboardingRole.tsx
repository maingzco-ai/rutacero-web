'use client';

import { useState } from 'react';
import { Car, User, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '@/app/lib/design-system';

type Role = 'conductor' | 'viajero' | 'ambos';

export function OnboardingRole({ onSelect }: { onSelect: (role: Role) => void }) {
  const [role, setRole] = useState<Role | null>(null);

  const ROLES: { value: Role; label: string; subtitle: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    {
      value: 'conductor',
      label: 'Conductor',
      subtitle: 'Publica tu ruta y comparte cupos',
      Icon: Car,
    },
    {
      value: 'viajero',
      label: 'Viajero',
      subtitle: 'Reserva un cupo y viaja con otros',
      Icon: User,
    },
    {
      value: 'ambos',
      label: 'Ambos',
      subtitle: 'Conduzco y viajo según el día',
      Icon: RefreshCw,
    },
  ];

  return (
    <div className="mx-auto max-w-md px-4 py-8 text-center">
      <Card elevated className="mx-auto max-w-md">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-text mb-2">¿Quién eres?</h2>
          <p className="text-sm text-text-secondary mb-8">
            Elige tu rol para continuar en RutaCero
          </p>

          <div className="space-y-3">
            {ROLES.map((r) => {
              const Icon = r.Icon;
              const isSelected = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 dark:bg-primary/5'
                      : 'border-border bg-card hover:border-borderHover hover:bg-secondary/50 dark:border-border-dark dark:bg-card-dark dark:hover:bg-muted/30',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-base font-semibold text-text">{r.label}</span>
                      <span className="block text-xs text-text-secondary">{r.subtitle}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <Button
              variant="primary"
              fullWidth
              disabled={!role}
              onClick={() => role && onSelect(role)}
            >
              Continuar como {role}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
