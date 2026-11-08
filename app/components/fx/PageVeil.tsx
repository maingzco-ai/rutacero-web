'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from '@/app/lib/motion';

export function PageVeil() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const first = useRef(true);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    setActive(true);
    const timer = window.setTimeout(() => setActive(false), 980);
    return () => window.clearTimeout(timer);
  }, [pathname, reduced]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={pathname}
          className="pointer-events-none fixed inset-0 z-[120] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-x-0 h-[55vh]"
            initial={{ y: '-70vh', opacity: 0 }}
            animate={{ y: ['-70vh', '10vh', '120vh'], opacity: [0, 1, 0] }}
            transition={{ duration: 0.95, ease: EASE, times: [0, 0.42, 1] }}
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(124,156,255,0.10) 32%, rgba(92,233,220,0.20) 50%, rgba(124,156,255,0.10) 68%, transparent 100%)',
              filter: 'blur(2px)',
              mixBlendMode: 'screen',
            }}
          />
          <motion.div
            className="absolute inset-x-0 top-[50%] h-px"
            initial={{ scaleX: 0, opacity: 0.9 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
              boxShadow: '0 0 32px 4px rgba(124,156,255,0.6)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RouteBeam() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const first = useRef(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setRun((value) => value + 1);
  }, [pathname]);

  if (reduced) return null;

  return (
    <motion.div
      key={run}
      className="pointer-events-none fixed inset-x-0 top-0 z-[125] h-[2px] origin-left"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{
        background: 'linear-gradient(90deg, #4f6df5, #5ce9dc 55%, transparent)',
        boxShadow: '0 0 18px rgba(92,233,220,0.7)',
      }}
      aria-hidden="true"
    />
  );
}
