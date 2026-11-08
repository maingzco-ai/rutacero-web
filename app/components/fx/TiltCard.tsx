'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/app/lib/design-system';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees */
  intensity?: number;
  glare?: boolean;
  lift?: number;
};

export function TiltCard({ children, className, intensity = 7, glare = true, lift = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(0);
  const z = useMotionValue(0);

  const rotateX = useSpring(rx, { stiffness: 200, damping: 22, mass: 0.5 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 22, mass: 0.5 });
  const translateZ = useSpring(z, { stiffness: 220, damping: 26 });
  const background = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(124,156,255,0.18), transparent 62%)`;

  const handleMove = (event: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    ry.set((px - 0.5) * intensity * 2);
    rx.set(-(py - 0.5) * intensity * 2);
    mx.set(px * 100);
    my.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    z.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerEnter={() => z.set(lift)}
        onPointerLeave={reset}
        style={{
          rotateX,
          rotateY,
          translateZ,
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
        className="relative h-full w-full rounded-[26px]"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[26px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background, mixBlendMode: 'screen' }}
          />
        )}
      </motion.div>
    </div>
  );
}

export function Surface({
  children,
  className,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        'glass relative overflow-hidden rounded-[26px]',
        interactive && 'spotlight specular transition-transform duration-500',
        className,
      )}
    >
      {children}
    </div>
  );
}
