'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { OnboardingStage } from './OnboardingStage';
import { cn } from '@/app/lib/design-system';

type Props = {
  email: string;
  method?: 'telegram' | 'email';
  onVerify: (code: string) => void;
  resendCode: () => void;
  verifying: boolean;
  canResend: boolean;
  secondsLeft: number;
  errorMessage?: string | null;
  onError?: (message: string) => void;
};

export function OnboardingVerify({
  email,
  method,
  onVerify,
  resendCode,
  verifying,
  canResend,
  secondsLeft,
  errorMessage,
}: Props) {
  const [code, setCode] = useState('');
  const [focusedDigit, setFocusedDigit] = useState(0);
  const [demoHint] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const savedCode = sessionStorage.getItem('rc_last_demo_code');
    return savedCode && savedCode.length === 5 ? savedCode : null;
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null]);
  const hasVerified = useRef(false);
  const focusedRef = useRef(false);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  useEffect(() => {
    if (!focusedRef.current) {
      focusedRef.current = true;
      focusInput(0);
    }
  }, []);

  useEffect(() => {
    if (errorMessage) hasVerified.current = false;
  }, [errorMessage]);

  useEffect(() => {
    if (code.length === 5 && !hasVerified.current && !verifying) {
      hasVerified.current = true;
      onVerify(code);
    } else if (code.length < 5) {
      hasVerified.current = false;
    }
  }, [code, onVerify, verifying]);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const codeArr = code.split('');
    codeArr[index] = digit;
    const joined = codeArr.join('');
    setCode(joined);

    if (digit && index < 4) {
      setFocusedDigit(index + 1);
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    setCode(pasted);
    const nextFocus = Math.min(pasted.length, 4);
    setFocusedDigit(nextFocus);
    focusInput(nextFocus);

    if (pasted.length === 5 && !verifying) {
      hasVerified.current = true;
      onVerify(pasted);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Backspace') {
      if (!code[index] && index > 0) {
        setFocusedDigit(index - 1);
        focusInput(index - 1);
      } else {
        const codeArr = code.split('');
        codeArr[index] = '';
        setCode(codeArr.join(''));
        hasVerified.current = false;
      }
    } else if (event.key === 'ArrowRight' && index < 4) {
      setFocusedDigit(index + 1);
      focusInput(index + 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      setFocusedDigit(index - 1);
      focusInput(index - 1);
    }
  };

  const handleResend = () => {
    hasVerified.current = false;
    setCode('');
    setFocusedDigit(0);
    focusInput(0);
    resendCode();
  };

  const maskedEmail = email.includes('@') ? email.replace(/^(.{2})(.+)(@.+)$/, '$1***$3') : email;
  const isTelegram = method === 'telegram';

  return (
    <OnboardingStage
      step={4}
      eyebrow="Verificación segura"
      title="Ingresa tu"
      accent="código."
      description="Cinco dígitos. Un único uso. La verificación protege tu cupo y tu PIN de abordaje."
    >
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary-light shadow-[0_0_30px_-8px_rgba(124,156,255,0.7)]">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <p className="mt-3 text-[11.5px] text-text-secondary">
          {isTelegram ? 'Código enviado al chat de' : 'Código enviado a'}{' '}
          <span className="font-medium text-text">{isTelegram ? '@Rrutabot' : maskedEmail}</span>
        </p>

        {demoHint && (
          <div className="mt-4 flex w-full items-center justify-between gap-2 rounded-xl border border-amber/30 bg-amber/[0.07] px-3 py-2">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-amber/80">Código de prueba</span>
            <button
              type="button"
              onClick={() => {
                setCode(demoHint);
                onVerify(demoHint);
              }}
              className="font-mono text-[12px] font-bold tracking-[0.24em] text-amber underline decoration-amber/40 underline-offset-2"
            >
              {demoHint}
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-2" role="group" aria-label="Código de verificación de 5 dígitos">
          {Array.from({ length: 5 }).map((_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              maxLength={1}
              value={code[index] || ''}
              onChange={(event) => handleDigitChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={handlePaste}
              autoFocus={index === 0}
              autoComplete="one-time-code"
              inputMode="numeric"
              aria-label={`Dígito ${index + 1}`}
              disabled={verifying}
              className={cn(
                'h-[52px] w-[46px] rounded-xl border bg-white/[0.04] text-center font-mono text-[20px] text-text outline-none transition-all duration-300 sm:w-[52px]',
                code[index]
                  ? 'border-primary/50 bg-primary/[0.08] text-primary-light shadow-[0_0_22px_-8px_rgba(124,156,255,0.8)]'
                  : 'border-white/12',
                focusedDigit === index && !code[index] ? 'border-accent/60 ring-1 ring-accent/25' : '',
                errorMessage ? 'border-error/60' : '',
                verifying ? 'cursor-wait opacity-50' : '',
              )}
            />
          ))}
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] font-medium text-error" role="alert">
            <AlertCircle className="h-3.5 w-3.5" />
            {errorMessage}
          </div>
        )}

        {verifying && (
          <p className="mt-4 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-accent" role="status">
            <span className="h-1 w-1 animate-ping rounded-full bg-accent" />
            Verificando código
          </p>
        )}

        <div className="mt-5 w-full rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-text-secondary/45">
              {secondsLeft > 0 ? 'Vigencia del código' : 'Código expirado'}
            </span>
            <span className="font-mono text-[9px] text-text-secondary/80">
              {secondsLeft > 0 ? `${secondsLeft}s` : 'Solicita otro'}
            </span>
          </div>
          <div className="mt-1.5 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-1000 ease-linear"
              style={{ width: `${Math.min(100, (secondsLeft / 60) * 100)}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-[10.5px] text-text-secondary/70">
          ¿No llegó?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || verifying}
            className={cn(
              'ml-1 font-medium transition-colors',
              !canResend || verifying
                ? 'cursor-not-allowed text-text-secondary/30'
                : 'text-accent underline decoration-accent/40 underline-offset-2 hover:text-primary-light',
            )}
          >
            {canResend ? 'Reenviar código' : `Reenviar en ${secondsLeft}s`}
          </button>
        </p>
      </div>
    </OnboardingStage>
  );
}
