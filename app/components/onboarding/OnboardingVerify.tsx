'use client';

import { useEffect, useState } from 'react';
import { Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { cn } from '@/app/lib/design-system';

type Props = {
  email: string;
  onVerify: (code: string) => void;
  resendCode: () => void;
  verifying: boolean;
  canResend: boolean;
  secondsLeft: number;
};

export function OnboardingVerify({ email, onVerify, resendCode, verifying, canResend, secondsLeft }: Props) {
  const [code, setCode] = useState('');
  const [focusedDigit, setFocusedDigit] = useState(0);

  useEffect(() => {
    if (code.length === 5) {
      onVerify(code);
    }
  }, [code, onVerify]);

  const handleDigitChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    const next = Array.from({ length: 5 }, (_, i) => digits[i] || '');
    setCode(next.join(''));

    if (digits[index] && index < 4) {
      setFocusedDigit(index + 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    setCode(padded(pasted));
    setFocusedDigit(pasted.length < 5 ? pasted.length : 4);
  };

  const padded = (value: string): string => value.padEnd(5, '');

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      setFocusedDigit(index - 1);
    }
    if (event.key === 'ArrowRight' && index < 4) setFocusedDigit(index + 1);
    if (event.key === 'ArrowLeft' && index > 0) setFocusedDigit(index - 1);
  };

  const domain = email.split('@')[1] || '';
  const maskedEmail = email.replace(/^(.{2})(.+)(@.+)$/, '$1***$3');

  return (
    <div className="mx-auto max-w-md px-4 py-8 text-center">
      <Card elevated className="mx-auto max-w-md">
        <div className="p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Verifica tu correo</h2>
          <p className="text-sm text-text-secondary mb-8">
            Te enviamos un código de 5 dígitos a <br />
            <span className="block text-base font-medium text-text mt-1">{maskedEmail}</span>
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => {
              const isFilled = !!code[i];
              const isFocused = focusedDigit === i && !isFilled;
              return (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={code[i] || ''}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  autoFocus={i === 0}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  className={cn(
                    'h-12 w-12 rounded-xl border text-center text-xl font-mono text-text transition-all',
                    isFilled
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card text-text-secondary dark:border-border-dark dark:bg-card-dark dark:text-text-secondary',
                    isFocused
                      ? 'ring-2 ring-primary/50 border-primary shadow-[0_0_0_3px_rgba(11,124,192,0.15)]'
                      : '',
                  )}
                />
              );
            })}
          </div>

          <p className="text-xs text-text-secondary mb-6">
            ¿No recibiste el código?
            <button
              type="button"
              onClick={resendCode}
              disabled={!canResend}
              className={cn(
                'ml-1 font-medium transition-colors',
                !canResend ? 'text-text-secondary' : 'text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary-dark',
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
