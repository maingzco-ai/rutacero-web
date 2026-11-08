'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  scale?: number;
  className?: string;
  as?: 'span' | 'div';
};

export function Magnetic({ children, strength = 0.32, scale = 1.02, className, as = 'div' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 250, damping: 18, mass: 0.5 });
  const Component = as === 'span' ? motion.span : motion.div;

  return (
    <Component
      ref={ref as never}
      data-magnetic
      className={className}
      style={{ x, y, display: 'inline-flex' }}
      whileHover={reduced ? undefined : { scale }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      onPointerMove={(event) => {
        if (reduced || !ref.current) return;
        const bounds = ref.current.getBoundingClientRect();
        const relX = event.clientX - bounds.left - bounds.width / 2;
        const relY = event.clientY - bounds.top - bounds.height / 2;
        mx.set(relX * strength);
        my.set(relY * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </Component>
  );
}
