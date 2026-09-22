'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NarrativeHero from './components/NarrativeHero';
import AppDashboard from './components/AppDashboard';

/**
 * Orquestador de la Experiencia Narrativa:
 * 1. NarrativeHero (100vh · propósito) → CTA esmeralda.
 * 2. AppDashboard (demo funcional) con fade + slide suave (framer-motion).
 */
export default function Home() {
  const [verDemo, setVerDemo] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2C2C2C]">
      <AnimatePresence mode="wait">
        {!verDemo ? (
          <motion.div
            key="hero"
            exit={{ opacity: 0, y: -24, transition: { duration: 0.35 } }}
          >
            <NarrativeHero onVerDemo={() => setVerDemo(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24, transition: { duration: 0.35 } }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <AppDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}