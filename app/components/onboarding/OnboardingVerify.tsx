'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
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
  // Lazy initialization - read from sessionStorage during initial render
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

  // Focus first input on mount - usando ref para evitar setState en effect
  useEffect(() => {
    if (!focusedRef.current) {
      focusedRef.current = true;
      focusInput(0);
    }
  }, []);

  // Reset verification flag when code is edited or when verification finishes with error
  useEffect(() => {
    if (errorMessage) {
      hasVerified.current = false;
    }
  }, [errorMessage]);

  // Trigger verification once code reaches 5 digits
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

  const maskedEmail = email.includes('@')
    ? email.replace(/^(.{2})(.+)(@.+)$/, '$1***$3')
    : email;
  const isTelegram = method === 'telegram';

  return (
    <div className="mx-auto max-w-md px-4 py-8 text-center">
      <Card elevated className="mx-auto max-w-md">
        <div className="p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">
            {isTelegram ? 'Verifica tu Telegram' : 'Verifica tu código'}
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            {isTelegram ? (
              <>
                Te enviamos un código de 5 dígitos al chat de{' '}
                <span className="block text-base font-semibold text-text mt-1">@Rrutabot</span>
              </>
            ) : (
              <>
                Te enviamos un código de 5 dígitos a{' '}
                <span className="block text-base font-semibold text-text mt-1">{maskedEmail}</span>
              </>
            )}
          </p>

          {/* Banner con código de prueba en modo DEMO */}
          {demoHint && (
            <div className="mb-6 p-2.5 rounded-xl bg-accent/15 border border-accent/40 text-xs text-text flex items-center justify-center gap-2">
              <span className="font-bold text-primary">DEMO OTP:</span>
              <button
                type="button"
                onClick={() => {
                  setCode(demoHint);
                  onVerify(demoHint);
                }}
                className="font-mono font-bold tracking-widest text-primary underline hover:text-primary-dark"
              >
                {demoHint} (clic para autocompletar)
              </button>
            </div>
          )}

          <div
            className="flex justify-center gap-2 mb-4"
            role="group"
            aria-label="Código de verificación de 5 dígitos"
            style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                maxLength={1}
                value={code[i] || ''}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                autoFocus={i === 0}
                autoComplete="one-time-code"
                inputMode="numeric"
                aria-label={`Dígito ${i + 1}`}
                disabled={verifying}
                style={{
                  width: '48px',
                  height: '48px',
                  minWidth: '48px',
                  flexShrink: 0,
                }}
                className={cn(
                  'rounded-xl border text-center text-xl font-mono text-text transition-all',
                  code[i]
                    ? 'border-primary bg-primary/5 text-primary font-bold'
                    : 'border-border bg-card text-text-secondary dark:border-border-dark dark:bg-card-dark',
                  focusedDigit === i && !code[i]
                    ? 'ring-2 ring-primary/50 border-primary shadow-[0_0_0_3px_rgba(11,124,192,0.15)]'
                    : '',
                  errorMessage ? 'border-error ring-1 ring-error/50' : '',
                  verifying ? 'opacity-50 cursor-wait' : ''
                )}
              />
            ))}
          </div>

          {errorMessage && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-error font-medium mb-4 animate-slide-up">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {verifying && (
            <p className="text-xs text-primary font-medium mb-4" role="status" aria-live="polite">
              Verificando código de seguridad…
            </p>
          )}

          <p className="text-xs text-text-secondary mb-6">
            ¿No recibiste el código?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || verifying}
              className={cn(
                'ml-1 font-medium transition-colors',
                !canResend || verifying
                  ? 'text-text-secondary opacity-60 cursor-not-allowed'
                  : 'text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary-dark cursor-pointer',
              )}
            >
              {canResend ? 'Reenviar código' : `Reenviar en ${secondsLeft}s`}
            </button>
          </p>

          <div className="flex justify-center text-xs text-text-secondary">
            <span>{secondsLeft > 0 ? 'Vigencia del código:' : 'Código expirado:'}</span>
            <span className="ml-1 font-semibold text-text">{secondsLeft > 0 ? `${secondsLeft}s` : 'Solicita uno nuevo'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
