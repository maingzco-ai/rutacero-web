'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { buscarSugerencias } from '../lib/mapsCali';

type SmartSearchInputProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
};

/**
 * Input de búsqueda con autocompletado inteligente sobre los 19 puntos base de
 * backend/maps_service.py (acepta 'cenco', 'holgui', 'lili', 'icesi', etc.).
 */
export default function SmartSearchInput({
  value,
  onValueChange,
  placeholder = 'Buscar lugar en Cali...',
  label,
}: SmartSearchInputProps) {
  const [innerQuery, setInnerQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const query = value ?? innerQuery;
  const setQuery = (v: string) => {
    if (onValueChange) onValueChange(v);
    else setInnerQuery(v);
  };

  const sugerencias = buscarSugerencias(query);

  const handleSelect = (oficial: string) => {
    setQuery(oficial);
    setFocused(false);
  };

  return (
    <div className="relative w-full">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
          {label}
        </span>
      )}
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
        />
      </div>
      {focused && query.trim() && sugerencias.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {sugerencias.map((oficial) => (
            <li key={oficial}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(oficial)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-400"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {oficial}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}