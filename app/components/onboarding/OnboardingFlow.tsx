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

// Lazy initialization: read from localStorage once during initial render
function getInitialData(): OnboardingData {
  if (typeof window === 'undefined') {
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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<OnboardingData>;
      if (parsed.role && (parsed.telegramChatId || parsed.email || parsed.completedAt)) {
        return {
          role: parsed.role as 'conductor' | 'viajero' | 'ambos',
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

function getInitialStep(initialData: OnboardingData): Step {
  if (initialData.role && (initialData.telegramChatId || initialData.email || initialData.completedAt)) {
    return 'done';
  }
  return 'splash';
}

export function OnboardingFlow({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState<Step>(() => getInitialStep(getInitialData()));
  const [data, setData] = useState<OnboardingData>(() => getInitialData());
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const onFinishCalled = useRef(false);
  const finishedRef = useRef(false);

  // Auto-finish if initial data indicates completed onboarding
  useEffect(() => {
    if (step === 'done' && !finishedRef.current) {
      finishedRef.current = true;
      if (!onFinishCalled.current) {
        onFinishCalled.current = true;
        onFinish();
      }
    }
  }, [step, onFinish]);

  // Temporizador de reenvío de código - using refs to track state without setState in effect
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsLeftRef = useRef(secondsLeft);
  const canResendRef = useRef(canResend);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
    canResendRef.current = canResend;

    if (canResendRef.current) return;
    let timer: NodeJS.Timeout | null = null;
    if (secondsLeftRef.current > 0) {
      timer = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    } else {
      setCanResend(true);
    }
    timerRef.current = timer;
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []); // Intentionally empty: refs provide current values

  const goNext = useCallback((next: Step) => {
    setErrorMessage(null);
    setStep(next);
  }, []);

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

  const handleTelegramCodeSent = (uid?: string) => {
    if (uid) {
      setData((prev) => ({ ...prev, telegramUid: uid }));
    }
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

        if (result.valid) {
          goNext('welcome');
        } else {
          setErrorMessage(result.error || 'Código incorrecto. Verifica e intenta de nuevo.');
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
        } else {
          setErrorMessage(result.error || 'Código incorrecto o expirado.');
        }
      } else {
        // Fallback demostración
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
        const res = await fetch('/api/auth/telegram-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: data.telegramUid, action: 'resend' }),
        });
        const resData = await res.json();
        if (resData.devCode) {
          sessionStorage.setItem('rc_last_demo_code', resData.devCode);
        }
        setSecondsLeft(60);
        setCanResend(false);
      } catch {
        /* silenciar */
      }
    } else if (data.contactMethod === 'email' && data.email) {
      try {
        const res = await fetch('/api/auth/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, action: 'resend' }),
        });
        const resData = await res.json();
        if (resData.devCode) {
          sessionStorage.setItem('rc_last_demo_code', resData.devCode);
        }
        setSecondsLeft(60);
        setCanResend(false);
      } catch {
        /* silenciar */
      }
    }
  };

  const handleWelcomeFinish = () => {
    const now = new Date().toISOString();
    const updated = { ...data, completedAt: now };
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

  const verifyLabel = data.contactMethod === 'telegram' ? 'Telegram (@Rrutabot)' : data.email || 'Correo institucional';
  const verifyMethod = data.contactMethod ?? undefined;

  return (
    <div className="fixed inset-x-0 top-0 bottom-0 z-50 bg-canvas dark:bg-background-dark overflow-y-auto">
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
              method={verifyMethod}
              onVerify={handleVerifyCode}
              resendCode={handleResendCode}
              verifying={verifying}
              canResend={canResend}
              secondsLeft={secondsLeft}
              errorMessage={errorMessage}
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
