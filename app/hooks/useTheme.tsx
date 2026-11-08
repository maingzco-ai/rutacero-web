'use client';

/**
 * useTheme — cinematic ambience management.
 * The application is dark-first. The two ambiences are:
 *  - "dark"  → Nocturne (obsidian + azure)
 *  - "light" → Solaris (same void, warmer solar spectrum)
 * The legacy light/dark API is preserved so existing consumers keep working.
 */

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  startTransition,
  type ReactNode,
} from 'react';
import { useMounted } from './useMounted';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add('dark');
  root.classList.toggle('theme-solaris', theme === 'light');
}

export function useTheme(): [Theme, () => void, (theme: Theme) => void] {
  const mounted = useMounted();
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem('theme') as Theme | null;
    const initial: Theme = stored === 'light' ? 'light' : 'dark';
    startTransition(() => {
      setThemeState(initial);
      setResolved(true);
    });
    applyTheme(initial);
  }, [mounted]);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyTheme(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, []);

  return [mounted && resolved ? theme : 'dark', toggleTheme, setTheme];
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resolved: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem('theme') as Theme | null;
    const initial: Theme = stored === 'light' ? 'light' : 'dark';
    startTransition(() => {
      setThemeState(initial);
      setResolved(true);
    });
    applyTheme(initial);
  }, [mounted]);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyTheme(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
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
