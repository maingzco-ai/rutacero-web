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
      <h1 className="text-2xl font-semibold tracking-tight">Pagos</h1>
      <p className="mt-1 text-sm text-neutral-500">Saldo y métodos para cupos en Cali.</p>

      <Card elevated className="mt-5 bg-neutral-900 text-white dark:bg-black">
        <p className="text-xs uppercase tracking-wide text-neutral-400">Saldo disponible</p>
        <p className="mt-2 text-3xl font-semibold">{formatCOP(balance)}</p>
        <p className="mt-2 text-sm text-neutral-400">Los cargos se descuentan al confirmar un cupo.</p>
      </Card>

      <h2 className="mt-8 text-sm font-semibold">Métodos</h2>
      <div className="mt-3 space-y-2">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setPreferredPayment(method.id)}
            className={cn(
              'flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-3 text-left dark:bg-neutral-900',
              preferredPayment === method.id ? 'border-emerald-500' : 'border-neutral-200 dark:border-neutral-800',
            )}
          >
            <span>
              <span className="block font-medium">{method.label}</span>
              <span className="text-sm text-neutral-500">{method.detail}</span>
            </span>
            {preferredPayment === method.id && <Badge variant="success">Preferido</Badge>}
          </button>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold">Movimientos</h2>
      <div className="mt-3 space-y-2">
        {ledger.map((entry) => (
          <Card key={entry.id} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{entry.label}</p>
                <p className="text-xs text-neutral-500">{entry.at}</p>
              </div>
              <p className={entry.amount < 0 ? 'font-semibold text-neutral-900 dark:text-white' : 'font-semibold text-emerald-700'}>
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
