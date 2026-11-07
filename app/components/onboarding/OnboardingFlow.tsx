'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  const onFinishCalled = useRef(false);

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
          // Call onFinish for returning users so HomeExperience shows content
          if (!onFinishCalled.current) {
            onFinishCalled.current = true;
            onFinish();
          }
          return;
        }
      }
    } catch {
      /* ignore */
    }
  }, [onFinish]);

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

  const handleVerifyCode = async (code: string) => {
    setVerifying(true);
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, action: 'verify', code }),
      });

      const result = await response.json();
      setVerifying(false);

      if (result.valid) {
        goNext('welcome');
      } else {
        // Código inválido - OnboardingVerify manejará el reset
      }
    } catch {
      setVerifying(false);
      // Error de red - OnboardingVerify permitirá reintento
    }
  };

  const handleResendCode = async () => {
    if (!data.email) return;
    try {
      await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      setSecondsLeft(60);
      setCanResend(false);
    } catch {
      // Silenciar error, UI mostrará que puede reintentar
    }
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
              onError={() => {
                // Reset code state on error - OnboardingVerify handles this internally
              }}
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
