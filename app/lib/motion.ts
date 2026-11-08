import type { Transition, Variants } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1] as const;
export const GLIDE = [0.22, 1, 0.36, 1] as const;
export const EXIT = [0.7, 0, 0.84, 0] as const;

export const springSoft: Transition = { type: 'spring', stiffness: 220, damping: 28, mass: 0.8 };
export const springSnap: Transition = { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 };
export const springLens: Transition = { type: 'spring', stiffness: 150, damping: 20, mass: 0.9 };

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE },
  },
};

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.95, ease: EASE },
  },
};

export const staggerParent = (stagger = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const clipReveal: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)', y: 18 },
  show: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    y: 0,
    transition: { duration: 1.05, ease: EASE },
  },
};

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.992, filter: 'blur(14px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(8px)',
    transition: { duration: 0.35, ease: EXIT },
  },
};
