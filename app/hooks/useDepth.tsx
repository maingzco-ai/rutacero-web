'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

type DepthValue = {
  /** Normalized pointer position, -0.5 → 0.5 */
  px: MotionValue<number>;
  py: MotionValue<number>;
  /** Spring-smoothed pointer */
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  /** Scroll progress of the document, 0 → 1 */
  progress: MotionValue<number>;
  /** Raw scroll offset */
  scrollY: MotionValue<number>;
  /** -1 → 1 signed page tilt from pointer X */
  tilt: MotionValue<number>;
  /** Whether the device has a precise pointer */
  finePointer: boolean;
  lenis: Lenis | null;
};

const DepthContext = createContext<DepthValue | null>(null);

export function DepthProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const progress = useMotionValue(0);
  const scrollY = useMotionValue(0);

  const sx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.6 });
  const tilt = useTransform(sx, [-0.5, 0.5], [-1, 1]);

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      lerp: 0.09,
    });

    lenisRef.current = instance;
    setLenis(instance);

    const tick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      scrollY.set(scroll);
      progress.set(limit > 0 ? Math.min(1, Math.max(0, scroll / limit)) : 0);
    };
    instance.on('scroll', onScroll);

    return () => {
      instance.off('scroll', onScroll);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reduced, progress, scrollY]);

  useEffect(() => {
    if (reduced) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      px.set(x);
      py.set(y);
    };
    const handleLeave = () => {
      px.set(0);
      py.set(0);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerleave', handleLeave);
    };
  }, [reduced, px, py]);

  const value = useMemo<DepthValue>(
    () => ({
      px,
      py,
      sx,
      sy,
      progress,
      scrollY,
      tilt,
      finePointer,
      lenis,
    }),
    [px, py, sx, sy, progress, scrollY, tilt, finePointer, lenis],
  );

  return <DepthContext.Provider value={value}>{children}</DepthContext.Provider>;
}

export function useDepth(): DepthValue {
  const context = useContext(DepthContext);
  if (!context) {
    throw new Error('useDepth must be used inside DepthProvider');
  }
  return context;
}
