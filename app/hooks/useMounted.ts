/**
 * useMounted - SSR-safe hook to detect client-side mounting
 * Prevents hydration mismatches by ensuring client-only code runs after mount
 */

import { useState, useEffect, useRef } from 'react';

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      setMounted(true);
    }
  }, []);

  return mounted;
}

/**
 * useClientValue - Returns a value only after client mount
 * Useful for values that differ between server and client (window, localStorage, etc.)
 */
export function useClientValue<T>(getValue: () => T, fallback: T): T {
  const [value, setValue] = useState(fallback);
  const mounted = useMounted();
  const valueSetRef = useRef(false);

  useEffect(() => {
    if (mounted && !valueSetRef.current) {
      valueSetRef.current = true;
      setValue(getValue());
    }
  }, [mounted, getValue]);

  return mounted ? value : fallback;
}

/**
 * useMediaQuery - SSR-safe media query hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const mounted = useMounted();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!mounted) return;

    const media = window.matchMedia(query);

    // Only set initial value once
    if (!initializedRef.current) {
      initializedRef.current = true;
      setMatches(media.matches);
    }

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [mounted, query]);

  return matches;
}

/**
 * useWindowSize - SSR-safe window dimensions
 */
export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const mounted = useMounted();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!mounted) return;

    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });

    // Only set initial value once
    if (!initializedRef.current) {
      initializedRef.current = true;
      update();
    }

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [mounted]);

  return size;
}