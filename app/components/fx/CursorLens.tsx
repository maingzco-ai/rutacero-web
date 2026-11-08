'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export function CursorLens() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const x = useSpring(rawX, { stiffness: 180, damping: 24, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 180, damping: 24, mass: 0.4 });

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    const sync = () => setEnabled(media.matches && !reduced);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest('a, button, [role="button"], input, select, textarea, [data-magnetic]')));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[130] overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute h-[460px] w-[460px] rounded-full"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          background:
            'radial-gradient(circle, rgba(124,156,255,0.10) 0%, rgba(92,233,220,0.045) 32%, transparent 68%)',
          mixBlendMode: 'screen',
        }}
      />
      <motion.div
        className="absolute rounded-full border border-white/25"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: active ? 54 : 26,
          height: active ? 54 : 26,
          opacity: active ? 0.85 : 0.4,
          borderColor: active ? 'rgba(92,233,220,0.55)' : 'rgba(255,255,255,0.28)',
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      />
      <motion.div
        className="absolute h-1 w-1 rounded-full bg-white"
        style={{ x, y, translateX: '-50%', translateY: '-50%', boxShadow: '0 0 14px 3px rgba(255,255,255,0.65)' }}
        animate={{ scale: active ? 0.4 : 1 }}
      />
    </div>
  );
}
