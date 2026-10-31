'use client';

import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { paymentMethods, useAppState } from '@/app/lib/AppState';
import { formatCOP } from '@/app/lib/design-system';
import { cn } from '@/app/lib/design-system';

export default function PaymentsExperience() {
  const { balance, ledger, preferredPayment, setPreferredPayment } = useAppState();

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Pagos</h1>
      <p className="mt-1 text-sm text-text-secondary">Saldo y métodos para cupos en Cali.</p>

      <Card elevated className="mt-5 bg-secondary text-text dark:bg-card-dark dark:text-text-dark">
        <p className="text-xs uppercase tracking-wide text-text-secondary">Saldo disponible</p>
        <p className="mt-2 text-3xl font-semibold text-text">{formatCOP(balance)}</p>
        <p className="mt-2 text-sm text-text-secondary">Los cargos se descuentan al confirmar un cupo.</p>
      </Card>

      <h2 className="mt-8 text-sm font-semibold text-text">Métodos</h2>
      <div className="mt-3 space-y-2">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setPreferredPayment(method.id)}
            className={cn(
              'flex w-full items-center justify-between rounded-2xl border bg-card px-4 py-3 text-left dark:bg-card-dark',
              preferredPayment === method.id ? 'border-primary' : 'border-border dark:border-border-dark',
            )}
          >
            <span>
              <span className="block font-medium text-text">{method.label}</span>
              <span className="text-sm text-text-secondary">{method.detail}</span>
            </span>
            {preferredPayment === method.id && <Badge variant="primary">Preferido</Badge>}
          </button>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold text-text">Movimientos</h2>
      <div className="mt-3 space-y-2">
        {ledger.map((entry) => (
          <Card key={entry.id} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text">{entry.label}</p>
                <p className="text-xs text-text-secondary">{entry.at}</p>
              </div>
              <p className={cn(entry.amount < 0 ? 'font-semibold text-text' : 'font-semibold text-primary')}>
                {entry.amount < 0 ? '-' : '+'}
                {formatCOP(Math.abs(entry.amount))}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
