'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { buscarSugerencias } from '@/app/lib/mapsCali';
import { cn } from '@/app/lib/design-system';

/** Escapa HTML para prevenir XSS al renderizar sugerencias del usuario. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

type SmartSearchInputProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
};

export default function SmartSearchInput({
  value,
  onValueChange,
  placeholder = 'Buscar lugar en Cali…',
  label,
  disabled = false,
}: SmartSearchInputProps) {
  const [innerQuery, setInnerQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = value ?? innerQuery;

  // Derive suggestions from query instead of calling setState inside an effect
  const suggestions = useMemo(() => (query ? buscarSugerencias(query) : []), [query]);

  const setQuery = useCallback(
    (v: string) => {
      if (onValueChange) onValueChange(v);
      else setInnerQuery(v);
    },
    [onValueChange]
  );

  // Click outside to close (subscription pattern: setState inside listener callback)
  useEffect(() => {
    if (!focused) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
          setFocused(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [focused]);

  const handleSelect = useCallback(
    (oficial: string) => {
      setQuery(oficial);
      setFocused(false);
      inputRef.current?.blur();
    },
    [setQuery]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, [setQuery]);

  return (
    <div className="relative w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 100)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full rounded-2xl border bg-input py-2.5 pl-10 pr-10 text-sm text-text outline-none transition-all duration-150',
            'placeholder:text-text-secondary dark:placeholder:text-text-secondary',
            'dark:bg-input-dark dark:text-text dark:border-border-dark',
            'border-border focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-border-dark dark:focus:border-accent dark:focus:ring-accent/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-autocomplete="list"
          aria-controls={focused && suggestions.length > 0 ? 'suggestions' : undefined}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text dark:text-text-secondary dark:hover:text-text transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {focused && query.trim() && suggestions.length > 0 && (
        <ul
          ref={dropdownRef}
          id="suggestions"
          role="listbox"
          className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto rounded-2xl border border-border bg-card shadow-xl dark:border-border-dark dark:bg-card-dark"
        >
          {suggestions.map((oficial, index) => (
            <li key={oficial} role="option" aria-selected="false">
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(oficial)}
                className={cn(
                  'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-text transition-colors',
                  'hover:bg-canvas hover:text-primary dark:hover:bg-muted/50 dark:hover:text-accent',
                  index === 0 && 'rounded-t-2xl',
                  index === suggestions.length - 1 && 'rounded-b-2xl'
                )}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                {escapeHtml(oficial)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
