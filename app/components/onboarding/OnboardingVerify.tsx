'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
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
  onError?: (message: string) => void;
};

export function OnboardingVerify({ email, onVerify, resendCode, verifying, canResend, secondsLeft, onError }: Props) {
  const [code, setCode] = useState('');
  const [focusedDigit, setFocusedDigit] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null]);
  const hasVerified = useRef(false);

  // Focus management
  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  useEffect(() => {
    focusInput(0);
  }, []);

  // Only trigger verification once when code reaches 5 digits
  useEffect(() => {
    if (code.length === 5 && !hasVerified.current) {
      hasVerified.current = true;
      onVerify(code);
    } else if (code.length < 5) {
      hasVerified.current = false;
    }
  }, [code, onVerify]);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    const nextCode = code.split('');
    nextCode[index] = digit;
    const joined = nextCode.join('');
    setCode(joined);

    // Auto-advance focus
    if (digit && index < 4) {
      setFocusedDigit(index + 1);
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    const padded = pasted.padEnd(5, '');
    setCode(padded);
    setFocusedDigit(Math.min(pasted.length, 4));
    focusInput(Math.min(pasted.length, 4));

    // Trigger verification if complete
    if (pasted.length === 5) {
      hasVerified.current = true;
      onVerify(pasted);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Backspace') {
      if (!code[index] && index > 0) {
        setFocusedDigit(index - 1);
        focusInput(index - 1);
      } else if (code[index]) {
        // Clear current and move back
        const nextCode = code.split('');
        nextCode[index] = '';
        setCode(nextCode.join(''));
      }
    }
    if (event.key === 'ArrowRight' && index < 4) {
      setFocusedDigit(index + 1);
      focusInput(index + 1);
    }
    if (event.key === 'ArrowLeft' && index > 0) {
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

  const maskedEmail = email.replace(/^(.{2})(.+)(@.+)$/, '$1***$3');
  const isTelegram = method === 'telegram';

  return (
    <div className="mx-auto max-w-md px-4 py-8 text-center">
      <Card elevated className="mx-auto max-w-md">
        <div className="p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">
            {isTelegram ? 'Verifica tu Telegram' : 'Verifica tu correo'}
          </h2>
          <p className="text-sm text-text-secondary mb-8">
            {isTelegram
              ? 'Te enviamos un código de 5 dígitos al chat de <br /><span className="block text-base font-medium text-text mt-1">@Rrutabot</span>'
              : `Te enviamos un código de 5 dígitos a <br /><span className="block text-base font-medium text-text mt-1">${maskedEmail}</span>`}
          </p>

          <div className="flex justify-center gap-2 mb-8" role="group" aria-label="Código de verificación de 5 dígitos">
            {Array.from({ length: 5 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
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
                className={cn(
                  'h-12 w-12 rounded-xl border text-center text-xl font-mono text-text transition-all',
                  code[i]
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-text-secondary dark:border-border-dark dark:bg-card-dark dark:text-text-secondary',
                  focusedDigit === i && !code[i]
                    ? 'ring-2 ring-primary/50 border-primary shadow-[0_0_0_3px_rgba(11,124,192,0.15)]'
                    : '',
                  verifying && 'opacity-50 cursor-wait'
                )}
              />
            ))}
          </div>

          {verifying && (
            <p className="text-xs text-primary mb-4" role="status" aria-live="polite">
              Verificando código...
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
                !canResend || verifying ? 'text-text-secondary' : 'text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary-dark',
              )}
            >
              {canResend ? 'Reenviar código' : `Reenviar en ${secondsLeft}s`}
            </button>
          </p>

          <div className="flex justify-center">
            <span className="text-xs text-text-secondary">{secondsLeft > 0 ? 'Código expira en' : 'Solicita un nuevo código'}</span>
            {secondsLeft > 0 && <span className="ml-1 text-xs font-semibold text-text">{secondsLeft}s</span>}
          </div>
        </div>
      </Card>
    </div>
  );
}
