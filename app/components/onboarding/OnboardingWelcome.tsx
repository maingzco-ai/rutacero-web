'use client';

import Link from 'next/link';
import { Gift, CheckCircle, Route } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type Props = {
  isFirstTrip: boolean;
  onFinish: () => void;
};

export function OnboardingWelcome({ isFirstTrip, onFinish }: Props) {
  return (
    <div className="mx-auto max-w-md px-4 py-8 text-center">
      <Card elevated className="mx-auto max-w-md">
        <div className="p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Perfil confirmado</h2>
          <p className="text-sm text-text-secondary mb-8">
            Ya eres parte de la comunidad RutaCero en Cali
          </p>

          {isFirstTrip ? (
            <div className="mb-8 flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-accent">
              <Gift className="h-5 w-5" />
              <span className="text-sm font-semibold">
                ¡50% de descuento en tu primer viaje!
              </span>
            </div>
          ) : null}

          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={onFinish}>
              <Route className="h-4 w-4 mr-2" /> Explorar viajes
            </Button>
            <Link
              href="/perfil"
              className="text-xs font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Editar perfil después
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
