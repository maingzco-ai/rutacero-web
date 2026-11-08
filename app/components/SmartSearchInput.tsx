'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CornerDownLeft, MapPin, X } from 'lucide-react';
import { buscarSugerencias } from '@/app/lib/mapsCali';
import { cn } from '@/app/lib/design-system';
import { springSoft } from '@/app/lib/motion';

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
  const [highlight, setHighlight] = useState(0);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();

  const query = value ?? innerQuery;
  const suggestions = useMemo(() => (query ? buscarSugerencias(query) : []), [query]);

  const setQuery = useCallback(
    (next: string) => {
      if (onValueChange) onValueChange(next);
      else setInnerQuery(next);
      setHighlight(0);
    },
    [onValueChange],
  );

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
    [setQuery],
  );

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, [setQuery]);

  const open = focused && Boolean(query.trim());

  return (
    <div className="relative w-full">
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label className="hud">{label}</label>
          <span className="h-px w-8 bg-gradient-to-r from-white/20 to-transparent" aria-hidden="true" />
        </div>
      )}

      <div
        className={cn(
          'group/field relative flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition-all duration-500',
          focused
            ? 'border-primary/45 bg-primary/[0.07] shadow-[0_0_0_1px_rgba(124,156,255,0.18),0_0_44px_-14px_rgba(124,156,255,0.6)]'
            : 'border-white/10 bg-white/[0.045] hover:border-white/20',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <span
          className={cn(
            'relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-500',
            focused ? 'border-accent/40 bg-accent/10 text-accent' : 'border-white/10 bg-white/[0.05] text-primary',
          )}
        >
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {focused && !reduced && (
            <span className="absolute inset-0 animate-ping rounded-full border border-accent/40" />
          )}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 140)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && suggestions.length) {
              event.preventDefault();
              setHighlight((index) => (index + 1) % suggestions.length);
            } else if (event.key === 'ArrowUp' && suggestions.length) {
              event.preventDefault();
              setHighlight((index) => (index - 1 + suggestions.length) % suggestions.length);
            } else if (event.key === 'Enter' && open && suggestions[highlight]) {
              event.preventDefault();
              handleSelect(suggestions[highlight]);
            } else if (event.key === 'Escape') {
              setFocused(false);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent py-0.5 text-[15px] font-medium text-text outline-none placeholder:font-normal placeholder:text-text-secondary/55"
          aria-autocomplete="list"
          aria-controls={open && suggestions.length > 0 ? 'suggestions' : undefined}
        />

        {query ? (
          <motion.button
            type="button"
            onClick={handleClear}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-text-secondary transition-colors hover:text-text"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </motion.button>
        ) : (
          <span className="hidden shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-text-secondary/60 sm:flex">
            <CornerDownLeft className="h-2.5 w-2.5" />
            BUSCAR
          </span>
        )}
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            ref={dropdownRef}
            id="suggestions"
            role="listbox"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, scale: 0.985, transition: { duration: 0.18 } }}
            transition={springSoft}
            className="glass-strong absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl p-1.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,1)]"
          >
            <li className="flex items-center justify-between px-2.5 py-1.5">
              <span className="hud">Coincidencias en Cali</span>
              <span className="font-mono text-[9px] text-text-secondary/60">{suggestions.length}</span>
            </li>
            {suggestions.map((oficial, index) => (
              <li key={oficial} role="option" aria-selected={index === highlight}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => handleSelect(oficial)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-[13px] transition-colors duration-200',
                    index === highlight
                      ? 'bg-primary/15 text-text'
                      : 'text-text-secondary hover:bg-white/[0.05] hover:text-text',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[9px]',
                      index === highlight
                        ? 'border-accent/40 bg-accent/15 text-accent'
                        : 'border-white/10 bg-white/[0.04] text-text-secondary',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{oficial}</span>
                  <MapPin className="h-3 w-3 shrink-0 opacity-40" aria-hidden="true" />
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
