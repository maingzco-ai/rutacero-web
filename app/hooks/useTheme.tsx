'use client';

/**
 * useTheme - SSR-safe theme management
 * Handles dark/light mode without hydration mismatches
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useMounted } from './useMounted';

type Theme = 'light' | 'dark';

export function useTheme(): [Theme, () => void, (theme: Theme) => void] {
  const mounted = useMounted();
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolved, setResolved] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    if (!mounted) return;

    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');

    setThemeState(initial);
    setResolved(true);

    // Apply to document
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, [mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || !resolved) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = event.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [mounted, resolved]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, []);

  // Return fallback theme during SSR, actual theme after mount
  return [mounted && resolved ? theme : 'light', toggleTheme, setTheme];
}

/**
 * ThemeProvider - Context provider for theme (optional, for deeper nesting)
 */

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resolved: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');

    setThemeState(initial);
    setResolved(true);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !resolved) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = event.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [mounted, resolved]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}