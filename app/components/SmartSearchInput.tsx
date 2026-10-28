'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, X } from 'lucide-react';
import { buscarSugerencias } from '@/app/lib/mapsCali';
import { Input } from './ui/Input';
import { cn } from '@/app/lib/design-system';

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
  placeholder = 'Buscar lugar en Cali...',
  label,
  disabled = false,
}: SmartSearchInputProps) {
  const [innerQuery, setInnerQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = value ?? innerQuery;
  const setQuery = useCallback((v: string) => {
    if (onValueChange) onValueChange(v);
    else setInnerQuery(v);
    setSuggestions(buscarSugerencias(v));
  }, [onValueChange]);

  // Update suggestions when query changes
  useEffect(() => {
    if (focused) {
      setSuggestions(buscarSugerencias(query));
    }
  }, [query, focused]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
          setFocused(false);
        }
      }
    };

    if (focused) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [focused]);

  const handleSelect = useCallback((oficial: string) => {
    setQuery(oficial);
    setFocused(false);
    inputRef.current?.blur();
  }, [setQuery]);

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, [setQuery]);

  return (
    <div className="relative w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 pointer-events-none">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 100)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full rounded-2xl bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 outline-none transition-all duration-150',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
            'dark:bg-neutral-900 dark:text-white dark:border-neutral-700',
            'border-neutral-200 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:focus:border-green-500 dark:focus:ring-green-500/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-autocomplete="list"
          aria-controls={focused && suggestions.length > 0 ? 'suggestions' : undefined}
          aria-expanded={focused && suggestions.length > 0}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
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
          className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
        >
          {suggestions.map((oficial, index) => (
            <li key={oficial} role="option">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(oficial)}
                className={cn(
                  'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-neutral-700 transition-colors',
                  'hover:bg-green-50 hover:text-green-700 dark:text-neutral-300 dark:hover:bg-green-900/30 dark:hover:text-green-400',
                  index === 0 && 'rounded-t-2xl',
                  index === suggestions.length - 1 && 'rounded-b-2xl'
                )}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
                {oficial}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}