/**
 * RutaCero Design System - Shared tokens and utilities
 * Single source of truth for design decisions
 */

// Color palette — RutaCero azul/celeste premium
export const colors = {
  primary: '#0B7CC0',
  primaryDark: '#085E9A',
  accent: '#22D3EE',
  background: '#FFFFFF',
  canvas: '#F8FAFC',
  secondary: '#F1F5F9',
  muted: '#CBD5E1',
  text: '#0F172A',
  textSecondary: '#64748B',

  // Semantic
  border: '#CBD5E1',
  borderHover: '#94A3B8',
  inputBg: '#FFFFFF',
  inputBorder: '#CBD5E1',
  inputFocus: '#0B7CC0',
  cardBg: '#FFFFFF',
  cardBorder: '#CBD5E1',
  overlay: 'rgba(15, 23, 42, 0.5)',
  overlayLight: 'rgba(15, 23, 42, 0.04)',

  // Dark mode
  dark: {
    background: '#0F172A',
    canvas: '#0B1120',
    secondary: '#1E293B',
    muted: '#334155',
    border: '#334155',
    borderHover: '#475569',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    inputBg: '#0B1120',
    inputBorder: '#334155',
    inputFocus: '#22D3EE',
    cardBg: '#0B1120',
    cardBorder: '#334155',
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(255, 255, 255, 0.04)',
  }
} as const;

// Typography
export const typography = {
  fontSans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  fontDisplay: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  lineHeights: {
    tight: 1.1,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
} as const;

// Spacing - 4px base unit
export const spacing = {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

// Border radius
export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// Shadows - Elevation system
export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
} as const;

// Transitions
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Z-index scale
export const zIndex = {
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
} as const;

// Container widths
export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Membership levels - consolidated from RideCard and MembershipBadge
export const membershipLevels = [
  {
    min: 0,
    max: 4,
    emoji: '',
    label: 'Nuevo',
    badgeClass: 'badge-secondary',
    progressColors: 'from-slate-400 to-slate-600',
    next: 5,
  },
  {
    min: 5,
    max: 19,
    emoji: '',
    label: 'RutaPass',
    badgeClass: 'badge-primary',
    progressColors: 'from-blue-400 to-blue-600',
    next: 20,
  },
  {
    min: 20,
    max: Infinity,
    emoji: '',
    label: 'Embajador',
    badgeClass: 'badge-accent',
    progressColors: 'from-cyan-400 to-cyan-600',
    next: null,
  },
] as const;

export type MembershipLevel = typeof membershipLevels[number];

export function getMembershipLevel(trips: number): MembershipLevel {
  return membershipLevels.find(l => trips >= l.min && trips <= l.max) ?? membershipLevels[0];
}

export function getMembershipProgress(trips: number): { percent: number; remainingText: string } {
  const level = getMembershipLevel(trips);

  if (level.next === null) {
    return { percent: 100, remainingText: 'Nivel máximo alcanzado' };
  }

  const range = level.next - level.min;
  const progress = Math.max(0, trips - level.min);
  const percent = Math.min(100, Math.round((progress / range) * 100));
  const remaining = level.next - trips;
  const nextLevel = membershipLevels.find((item) => item.min === level.next);
  const remainingText = nextLevel
    ? `${remaining} viaje${remaining === 1 ? '' : 's'} para ${nextLevel.label}`
    : `${remaining} viajes para el siguiente nivel`;

  return { percent, remainingText };
}

// Currency formatting
export function formatCOP(value: number): string {
  return `$${new Intl.NumberFormat('es-CO').format(value)} COP`;
}

// Initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('');
}

// Validation helpers
export const validation = {
  email: (email: string): boolean => {
    const domains = ['icesi.edu.co', 'javerianacali.edu.co', 'uao.edu.co', 'correounivalle.edu.co'];
    return /^[^@\s]+@[^@\s]+$/.test(email) && domains.some(d => email.toLowerCase().endsWith(d));
  },

  whatsapp: (phone: string): boolean => {
    return /^3\d{9}$/.test(phone);
  },

  licensePlate: (plate: string): boolean => {
    return /^[A-Z]{3}-\d{3}$/i.test(plate.trim());
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  }
};

// Fare calculation
export function calculateFairFare(seats: number): number {
  return Math.min(5000, Math.max(4500, Math.round(15000 / seats)));
}

// Generate PIN - client only
export function generatePin(): string {
  const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
  return `RC-${digits}`;
}

// Class name utility
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}