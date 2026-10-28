'use client';

import { Users, Leaf, Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '@/app/lib/design-system';

interface Metric {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const METRICS: Metric[] = [
  { icon: <Users className="h-5 w-5" />, label: 'Viajes Hoy', value: '1.2k' },
  { icon: <Leaf className="h-5 w-5" />, label: 'CO₂ Mitigado', value: '-30%' },
  { icon: <Clock className="h-5 w-5" />, label: 'Tiempo Promedio', value: '25 min' },
];

export default function MetricsWidget() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {METRICS.map(({ icon, label, value }) => (
        <Card key={label} padding="md" className="text-center">
          <CardContent className="pt-0">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              {icon}
            </div>
            <p className="mt-2 text-lg font-bold text-neutral-900 dark:text-white">{value}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}