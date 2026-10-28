'use client';

import { useState, useCallback } from 'react';
import { ArrowUpDown, Search, Loader2, Route } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import SmartSearchInput from '../SmartSearchInput';
import { resolverPunto } from '@/app/lib/mapsCali';
import type { Location } from '../InteractiveMap';
import { cn } from '@/app/lib/design-system';

type RouteData = {
  origen: Location;
  destino: Location;
  paradas: Location[];
};

interface RouteSearchPanelProps {
  routeData: RouteData | null;
  onSearch: (origen: string, destino: string) => void;
  isSearching: boolean;
}

export default function RouteSearchPanel({ routeData, onSearch, isSearching }: RouteSearchPanelProps) {
  const [origen, setOrigen] = useState('Unicentro Cali');
  const [destino, setDestino] = useState('Universidad Icesi');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(origen, destino);
  }, [onSearch, origen, destino]);

  const swapPlaces = useCallback(() => {
    setOrigen(destino);
    setDestino(origen);
  }, [origen, destino]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5 text-green-600" aria-hidden="true" />
          Planifica tu viaje
        </CardTitle>
        <CardDescription>
          Autocompletado inteligente sobre 19 puntos de referencia en Cali.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SmartSearchInput
            label="Origen"
            placeholder="cenco, holgui, lili…"
            value={origen}
            onValueChange={setOrigen}
          />

          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={swapPlaces}
              aria-label="Intercambiar origen y destino"
              className="h-10 w-10 rounded-xl"
            >
              <ArrowUpDown className="h-5 w-5 text-neutral-500" aria-hidden="true" />
            </Button>
          </div>

          <SmartSearchInput
            label="Destino"
            placeholder="icesi, jav, uao…"
            value={destino}
            onValueChange={setDestino}
          />

          <Button
            type="submit"
            disabled={isSearching}
            fullWidth
            className="pt-2"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Buscando ruta óptima…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" aria-hidden="true" />
                Buscar Ruta Óptima
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}