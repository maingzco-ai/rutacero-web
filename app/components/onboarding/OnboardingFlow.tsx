'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OnboardingSplash } from './OnboardingSplash';
import { OnboardingRole } from './OnboardingRole';
import { OnboardingContactChoice } from './OnboardingContactChoice';
import { OnboardingVerify } from './OnboardingVerify';
import { OnboardingWelcome } from './OnboardingWelcome';
import { TelegramLogin } from './TelegramLogin';
import { OnboardingEmail } from './OnboardingEmail';
import { brand } from '@/app/lib/brand';

type Step = 'splash' | 'role' | 'contact' | 'telegram' | 'email' | 'verify' | 'welcome' | 'done';

const STORAGE_KEY = 'rutacero-onboarding';

type OnboardingData = {
  role: 'conductor' | 'viajero' | 'ambos' | null;
  contactMethod: 'telegram' | 'email' | null;
  telegramUid: string | null;
  telegramChatId: number | null;
  email: string | null;
  isFirstTrip: boolean;
  completedAt: string | null;
};

export function OnboardingFlow({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState<Step>('splash');
  const [data, setData] = useState<OnboardingData>({
    role: null,
    contactMethod: null,
    telegramUid: null,
    telegramChatId: null,
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
        if (parsed.role && (parsed.telegramChatId || parsed.email)) {
          setData((prev) => ({
            ...prev,
            role: parsed.role as 'conductor' | 'viajero' | 'ambos',
            contactMethod: parsed.contactMethod ?? 'telegram',
            telegramUid: parsed.telegramUid ?? null,
            telegramChatId: parsed.telegramChatId ?? null,
            email: parsed.email ?? null,
            isFirstTrip: parsed.isFirstTrip ?? true,
            completedAt: parsed.completedAt ?? null,
          }));
          setStep('done');
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
    goNext('contact');
  };

  const handleContactSelect = (method: 'telegram' | 'email') => {
    setData((prev) => ({ ...prev, contactMethod: method }));
    goNext(method === 'telegram' ? 'telegram' : 'email');
  };

  const handleTelegramSuccess = (uid: string) => {
    setData((prev) => ({ ...prev, telegramUid: uid }));
    setSecondsLeft(60);
    setCanResend(false);
    goNext('verify');
  };

  const handleTelegramCodeSent = () => {
    // El usuario ya abrió Telegram y el bot envió el código
    // Avanzar al step verify para que ingrese el código en la app
    setSecondsLeft(60);
    setCanResend(false);
    goNext('verify');
  };

  const handleEmailSubmit = async (email: string) => {
    setData((prev) => ({ ...prev, email }));
    setSecondsLeft(60);
    setCanResend(false);
    goNext('verify');
  };

  const handleVerifyCode = async (code: string) => {
    setVerifying(true);
    try {
      if (data.contactMethod === 'telegram' && data.telegramUid) {
        const response = await fetch('/api/auth/telegram-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: data.telegramUid, code }),
        });

        const result = await response.json();
        setVerifying(false);

        if (result.valid) {
          goNext('welcome');
        }
      } else if (data.contactMethod === 'email' && data.email) {
        const response = await fetch('/api/auth/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, code, action: 'verify' }),
        });

        const result = await response.json();
        setVerifying(false);

        if (result.valid) {
          goNext('welcome');
        }
      } else {
        setVerifying(false);
      }
    } catch {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (data.contactMethod === 'telegram' && data.telegramUid) {
      try {
        await fetch('/api/auth/telegram-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: data.telegramUid, action: 'resend' }),
        });
        setSecondsLeft(60);
        setCanResend(false);
      } catch {
        // Silenciar error
      }
    } else if (data.contactMethod === 'email' && data.email) {
      try {
        await fetch('/api/auth/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, action: 'resend' }),
        });
        setSecondsLeft(60);
        setCanResend(false);
      } catch {
        // Silenciar error
      }
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

  const verifyLabel = data.contactMethod === 'telegram' ? 'Telegram (@Rrutabot)' : data.email || 'Correo electrónico';

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
        {step === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <OnboardingContactChoice onSelect={handleContactSelect} />
          </motion.div>
        )}
        {step === 'telegram' && (
          <motion.div
            key="telegram"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <TelegramLogin onSuccess={handleTelegramSuccess} onCodeSent={handleTelegramCodeSent} />
          </motion.div>
        )}
        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <OnboardingEmail onSubmit={handleEmailSubmit} />
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
              email={verifyLabel}
              method={data.contactMethod}
              onVerify={handleVerifyCode}
              resendCode={handleResendCode}
              verifying={verifying}
              canResend={canResend}
              secondsLeft={secondsLeft}
              onError={() => {}}
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