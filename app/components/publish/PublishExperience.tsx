'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import SmartSearchInput from '../SmartSearchInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAppState } from '@/app/lib/AppState';
import { calculateFairFare, formatCOP, validation } from '@/app/lib/design-system';

export default function PublishExperience() {
  const router = useRouter();
  const { publishRoute } = useAppState();
  const [origin, setOrigin] = useState('Ciudad Jardín');
  const [destination, setDestination] = useState('Universidad Icesi');
  const [plate, setPlate] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [seats, setSeats] = useState(3);
  const [departure, setDeparture] = useState('07:00');
  const [done, setDone] = useState<string | null>(null);

  const plateOk = validation.licensePlate(plate);
  const vehicleOk = vehicle.trim().length >= 3;
  const price = calculateFairFare(seats);
  const canSubmit = plateOk && vehicleOk && origin && destination;

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Publicar ruta</h1>
      <p className="mt-1 text-sm text-text-secondary">Ofrece cupos en tu recorrido habitual. La tarifa se calcula de forma justa entre quienes viajan.</p>

      {done && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/20 bg-canvas p-4 text-sm text-primary dark:border-primary/30 dark:bg-muted/30 dark:text-primary">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold text-text">Ruta publicada</p>
            <p className="text-text-secondary">Los pasajeros ya pueden reservar. PIN de abordaje en cada cupo confirmado.</p>
          </div>
        </div>
      )}

      <Card className="mt-5 space-y-4" elevated>
        <SmartSearchInput label="Origen" value={origin} onValueChange={setOrigin} />
        <SmartSearchInput label="Destino" value={destination} onValueChange={setDestination} />
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium text-text">
            Hora de salida
            <input
              type="time"
              value={departure}
              onChange={(event) => setDeparture(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm dark:border-border-dark dark:bg-input-dark"
            />
          </label>
          <label className="text-sm font-medium text-text">
            Cupos
            <select
              value={seats}
              onChange={(event) => setSeats(Number(event.target.value))}
              className="mt-1.5 w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm dark:border-border-dark dark:bg-input-dark"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium text-text">
          Placa
          <input
            value={plate}
            onChange={(event) => setPlate(event.target.value.toUpperCase())}
            placeholder="ABC-123"
            className="mt-1.5 w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm dark:border-border-dark dark:bg-input-dark"
          />
          {plate && !plateOk && <p className="mt-1 text-xs text-error">Usa el formato AAA-123</p>}
        </label>
        <label className="block text-sm font-medium text-text">
          Vehículo
          <input
            value={vehicle}
            onChange={(event) => setVehicle(event.target.value)}
            placeholder="Mazda 2 blanco"
            className="mt-1.5 w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm dark:border-border-dark dark:bg-input-dark"
          />
        </label>
        <div className="rounded-2xl bg-secondary px-4 py-3 dark:bg-muted/30">
          <p className="text-sm text-text-secondary">Tarifa por pasajero</p>
          <p className="text-2xl font-semibold text-primary">{formatCOP(price)}</p>
        </div>
        <Button
          variant="primary"
          fullWidth
          disabled={!canSubmit}
          onClick={() => {
            publishRoute({ origin, destination, plate: plate.toUpperCase(), vehicle, seats, price, departure });
            setDone('ok');
            setTimeout(() => router.push('/historial'), 900);
          }}
        >
          Publicar ruta
        </Button>
      </Card>
    </div>
  );
}
