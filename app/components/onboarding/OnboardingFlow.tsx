'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OnboardingSplash } from './OnboardingSplash';
import { OnboardingRole } from './OnboardingRole';
import { OnboardingEmail } from './OnboardingEmail';
import { OnboardingVerify } from './OnboardingVerify';
import { OnboardingWelcome } from './OnboardingWelcome';
import { brand } from '@/app/lib/brand';

type Step = 'splash' | 'role' | 'email' | 'verify' | 'welcome' | 'done';

const STORAGE_KEY = 'rutacero-onboarding';

type OnboardingData = {
  role: 'conductor' | 'viajero' | 'ambos' | null;
  email: string | null;
  isFirstTrip: boolean;
  completedAt: string | null;
};

export function OnboardingFlow({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState<Step>('splash');
  const [data, setData] = useState<OnboardingData>({
    role: null,
    email: null,
    isFirstTrip: true,
    completedAt: null,
  });
  const [verifying, setVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Cargar estado previo de onboarding
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OnboardingData>;
        if (parsed.role && parsed.email) {
          setData((prev) => ({
            ...prev,
            role: parsed.role as 'conductor' | 'viajero' | 'ambos',
            email: parsed.email as string,
            isFirstTrip: parsed.isFirstTrip ?? true,
            completedAt: parsed.completedAt ?? null,
          }));
          setStep('done');
          return;
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Temporizador de reenvío de código
  useEffect(() => {
    if (canResend) return;
    let timer: NodeJS.Timeout;
    if (secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [secondsLeft, canResend]);

  const goNext = useCallback((next: Step) => setStep(next), []);

  const handleRoleSelect = (role: 'conductor' | 'viajero' | 'ambos') => {
    setData((prev) => ({ ...prev, role }));
    goNext('email');
  };

  const handleEmailConfirm = (email: string) => {
    setData((prev) => ({ ...prev, email }));
    setSecondsLeft(60);
    setCanResend(false);
    goNext('verify');
  };

  const handleVerifyCode = (code: string) => {
    setVerifying(true);
    // Simular validación del servidor (código correcto si empieza con 1 o es 12345 para demo)
    const isValid = code === '12345' || code.startsWith('1');
    setTimeout(() => {
      setVerifying(false);
      if (isValid) {
        goNext('welcome');
      } else {
        // Código inválido, limpiar para que el usuario intente de nuevo
        // El componente OnboardingVerify llama onVerify automáticamente al completar 5 dígitos
        // Para permitir reintento, notificamos al padre limpiando el estado del código
        // El padre manejará esto
      }
    }, 800);
  };

  const handleResendCode = () => {
    setSecondsLeft(60);
    setCanResend(false);
  };

  const handleWelcomeFinish = () => {
    const now = new Date().toISOString();
    setData((prev) => ({ ...prev, completedAt: now }));
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...data, completedAt: now }),
      );
    } catch {
      /* ignore */
    }
    setStep('done');
    onFinish();
  };

  if (step === 'done') return null;

  return (
    <div className="fixed inset-0 z-50 bg-canvas dark:bg-background-dark overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <OnboardingSplash onFinish={() => goNext('role')} />
          </motion.div>
        )}
        {step === 'role' && (
          <motion.div
            key="role"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <OnboardingRole onSelect={handleRoleSelect} />
          </motion.div>
        )}
        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <OnboardingEmail onConfirm={handleEmailConfirm} />
          </motion.div>
        )}
        {step === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <OnboardingVerify
              email={data.email!}
              onVerify={handleVerifyCode}
              resendCode={handleResendCode}
              verifying={verifying}
              canResend={canResend}
              secondsLeft={secondsLeft}
            />
          </motion.div>
        )}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <OnboardingWelcome isFirstTrip={data.isFirstTrip} onFinish={handleWelcomeFinish} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
