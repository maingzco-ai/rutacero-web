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
import { EASE } from '@/app/lib/motion';

type Step = 'splash' | 'role' | 'contact' | 'telegram' | 'email' | 'verify' | 'welcome' | 'done';

const STORAGE_KEY = 'rutacero-onboarding';

type OnboardingData = {
  role: 'conductor' | 'viajero' | 'ambos' | null;
  contactMethod: 'telegram' | 'email' | 'demo' | null;
  telegramUid: string | null;
  telegramChatId: number | null;
  email: string | null;
  isFirstTrip: boolean;
  completedAt: string | null;
};

function emptyData(): OnboardingData {
  return {
    role: null,
    contactMethod: null,
    telegramUid: null,
    telegramChatId: null,
    email: null,
    isFirstTrip: true,
    completedAt: null,
  };
}

function getInitialData(): OnboardingData {
  if (typeof window === 'undefined') return emptyData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<OnboardingData>;
      if (parsed.role && (parsed.telegramChatId || parsed.email || parsed.completedAt)) {
        return {
          role: parsed.role as OnboardingData['role'],
          contactMethod: parsed.contactMethod ?? 'email',
          telegramUid: parsed.telegramUid ?? null,
          telegramChatId: parsed.telegramChatId ?? null,
          email: parsed.email ?? null,
          isFirstTrip: parsed.isFirstTrip ?? true,
          completedAt: parsed.completedAt ?? null,
        };
      }
    }
  } catch {
    /* ignore */
  }
  return emptyData();
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.995, transition: { duration: 0.32, ease: [0.7, 0, 0.84, 0] } }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function OnboardingFlow({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState<Step>('splash');
  const [data, setData] = useState<OnboardingData>(emptyData);
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const onFinishCalled = useRef(false);
  const finishedRef = useRef(false);

  // Resolve a previously completed onboarding only after hydration so the
  // server and client render the same initial tree.
  useEffect(() => {
    const stored = getInitialData();
    if (stored.role && (stored.telegramChatId || stored.email || stored.completedAt)) {
      setData(stored);
      setStep('done');
    }
  }, []);

  useEffect(() => {
    if (step === 'done' && !finishedRef.current) {
      finishedRef.current = true;
      if (!onFinishCalled.current) {
        onFinishCalled.current = true;
        onFinish();
      }
    }
  }, [step, onFinish]);

  useEffect(() => {
    if (step !== 'verify' || canResend) return;
    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [step, canResend, secondsLeft]);

  const goNext = useCallback((next: Step) => {
    setErrorMessage(null);
    setStep(next);
  }, []);

  const handleRoleSelect = (role: 'conductor' | 'viajero' | 'ambos') => {
    setData((prev) => ({ ...prev, role }));
    goNext('contact');
  };

  const handleContactSelect = (method: 'telegram' | 'email' | 'demo') => {
    setData((prev) => ({ ...prev, contactMethod: method }));
    if (method === 'demo') {
      goNext('welcome');
    } else {
      goNext(method === 'telegram' ? 'telegram' : 'email');
    }
  };

  const handleTelegramSuccess = (uid: string) => {
    setData((prev) => ({ ...prev, telegramUid: uid }));
    setSecondsLeft(60);
    setCanResend(false);
    goNext('verify');
  };

  const handleTelegramCodeSent = (uid?: string) => {
    if (uid) setData((prev) => ({ ...prev, telegramUid: uid }));
    setSecondsLeft(60);
    setCanResend(false);
    goNext('verify');
  };

  const handleEmailSubmit = (email: string) => {
    setData((prev) => ({ ...prev, email }));
    setSecondsLeft(60);
    setCanResend(false);
    goNext('verify');
  };

  const handleVerifyCode = async (code: string) => {
    setVerifying(true);
    setErrorMessage(null);

    try {
      if (data.contactMethod === 'telegram' && data.telegramUid) {
        const response = await fetch('/api/auth/telegram-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: data.telegramUid, code }),
        });
        const result = await response.json();
        setVerifying(false);

        if (result.valid) goNext('welcome');
        else setErrorMessage(result.error || 'Código incorrecto. Verifica e intenta de nuevo.');
      } else if (data.contactMethod === 'email' && data.email) {
        const response = await fetch('/api/auth/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, code, action: 'verify' }),
        });
        const result = await response.json();
        setVerifying(false);

        if (result.valid) goNext('welcome');
        else setErrorMessage(result.error || 'Código incorrecto o expirado.');
      } else {
        setVerifying(false);
        goNext('welcome');
      }
    } catch {
      setVerifying(false);
      setErrorMessage('Error de red al verificar el código. Intenta nuevamente.');
    }
  };

  const handleResendCode = async () => {
    setErrorMessage(null);
    if (data.contactMethod === 'telegram' && data.telegramUid) {
      try {
        const response = await fetch('/api/auth/telegram-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: data.telegramUid, action: 'resend' }),
        });
        const result = await response.json();
        if (result.devCode) sessionStorage.setItem('rc_last_demo_code', result.devCode);
        setSecondsLeft(60);
        setCanResend(false);
      } catch {
        /* silenciar */
      }
    } else if (data.contactMethod === 'email' && data.email) {
      try {
        const response = await fetch('/api/auth/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, action: 'resend' }),
        });
        const result = await response.json();
        if (result.devCode) sessionStorage.setItem('rc_last_demo_code', result.devCode);
        setSecondsLeft(60);
        setCanResend(false);
      } catch {
        /* silenciar */
      }
    }
  };

  const handleWelcomeFinish = () => {
    onFinishCalled.current = true;
    const updated = { ...data, completedAt: new Date().toISOString() };
    setData(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
    setStep('done');
    onFinish();
  };

  if (step === 'done') return null;

  const verifyLabel =
    data.contactMethod === 'telegram' ? 'Telegram (@Rrutabot)' : data.email || 'Correo institucional';
  const verifyMethod =
    data.contactMethod === 'telegram' || data.contactMethod === 'email' ? data.contactMethod : undefined;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain bg-[#04060c]/55 backdrop-blur-md"
      data-lenis-prevent
    >
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <Stage key="splash">
            <OnboardingSplash onFinish={() => goNext('role')} />
          </Stage>
        )}
        {step === 'role' && (
          <Stage key="role">
            <OnboardingRole onSelect={handleRoleSelect} />
          </Stage>
        )}
        {step === 'contact' && (
          <Stage key="contact">
            <OnboardingContactChoice onSelect={handleContactSelect} />
          </Stage>
        )}
        {step === 'telegram' && (
          <Stage key="telegram">
            <TelegramLogin onSuccess={handleTelegramSuccess} onCodeSent={handleTelegramCodeSent} />
          </Stage>
        )}
        {step === 'email' && (
          <Stage key="email">
            <OnboardingEmail onSubmit={handleEmailSubmit} />
          </Stage>
        )}
        {step === 'verify' && (
          <Stage key="verify">
            <OnboardingVerify
              email={verifyLabel}
              method={verifyMethod}
              onVerify={handleVerifyCode}
              resendCode={handleResendCode}
              verifying={verifying}
              canResend={canResend}
              secondsLeft={secondsLeft}
              errorMessage={errorMessage}
            />
          </Stage>
        )}
        {step === 'welcome' && (
          <Stage key="welcome">
            <OnboardingWelcome isFirstTrip={data.isFirstTrip} onFinish={handleWelcomeFinish} />
          </Stage>
        )}
      </AnimatePresence>
    </div>
  );
}
