'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { OnboardingStage } from './OnboardingStage';

type Props = {
  onSuccess: (uid: string, chatId?: number) => void;
  onCodeSent?: (uid: string, chatId?: number) => void;
};

function generateSafeUid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `uid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function TelegramLogin({ onSuccess, onCodeSent }: Props) {
  const uidRef = useRef(generateSafeUid());
  const [status, setStatus] = useState<'idle' | 'waiting' | 'code_sent' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(120);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startPolling = () => {
    setStatus('waiting');
    setCountdown(120);

    intervalRef.current = setInterval(async () => {
      setCountdown((current) => {
        if (current <= 1) {
          stopPolling();
          setStatus('error');
          setErrorMessage('Tiempo agotado. Intenta de nuevo.');
          return 0;
        }
        return current - 1;
      });

      try {
        const response = await fetch(`/api/auth/telegram-link?uid=${uidRef.current}`);
        const data = await response.json();

        if (data.linked) {
          stopPolling();
          setStatus('success');
          onSuccess(uidRef.current, data.chatId);
        } else if (data.pending && data.chatId) {
          stopPolling();
          setStatus('code_sent');
          onCodeSent?.(uidRef.current, data.chatId);
        } else if (data.expired) {
          stopPolling();
          setStatus('error');
          setErrorMessage('Sesión expirada. Intenta de nuevo.');
        }
      } catch {
        /* reintentar */
      }
    }, 2000);
  };

  const handleClick = () => {
    setStatus('waiting');
    setErrorMessage('');
    const botUser = process.env.NEXT_PUBLIC_TELEGRAM_BOT || 'Rrutabot';
    const url = `https://t.me/${botUser}?start=${uidRef.current}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'width=600,height=700,noreferrer,noopener');
    }
    startPolling();
  };

  const handleSimulateDemoCode = async () => {
    stopPolling();
    try {
      const response = await fetch('/api/auth/telegram-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: uidRef.current, action: 'resend' }),
      });
      const data = await response.json();
      if (data.devCode) sessionStorage.setItem('rc_last_demo_code', data.devCode);
    } catch {
      /* continuar */
    }
    setStatus('code_sent');
    onCodeSent?.(uidRef.current, 999999);
  };

  const handleRetry = () => {
    uidRef.current = generateSafeUid();
    handleClick();
  };

  useEffect(() => () => stopPolling(), []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <OnboardingStage
      step={3}
      eyebrow="Canal Telegram"
      title="Vincula tu"
      accent="chat seguro."
      description="Recibe códigos, confirmaciones y PINs directo en Telegram. Tu número de teléfono nunca se expone."
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary-light">
          <MessageSquare className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold text-text">@Rrutabot</p>
          <p className="mt-0.5 font-mono text-[7.5px] uppercase tracking-[0.12em] text-text-secondary/50">
            Bot oficial · verificado
          </p>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_10px_rgba(85,230,165,0.8)]" />
      </div>

      {status === 'idle' && (
        <div className="mt-4 space-y-2.5">
          <Button variant="primary" fullWidth size="lg" onClick={handleClick} icon={<MessageSquare className="h-4 w-4" />}>
            Continuar con Telegram
          </Button>
          <Button variant="secondary" fullWidth size="sm" onClick={handleSimulateDemoCode} icon={<Sparkles className="h-3.5 w-3.5" />}>
            Usar código simulado (evaluación)
          </Button>
          <p className="text-center font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.12em] text-text-secondary/35">
            Se abrirá t.me/Rrutabot · código de 5 dígitos
          </p>
        </div>
      )}

      {status === 'waiting' && (
        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/[0.05] p-4 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary-light" />
          <p className="mt-3 text-[12px] font-medium text-text">Esperando interacción en Telegram…</p>
          <p className="mt-1 text-[10px] text-text-secondary/70">Pulsa «Iniciar» en el chat con el bot.</p>
          <p className="mt-2 font-mono text-[10px] text-text-secondary/60">
            Tiempo restante <span className="text-text">{formatTime(countdown)}</span>
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="secondary" size="sm" onClick={handleSimulateDemoCode} icon={<Sparkles className="h-3.5 w-3.5" />}>
              Saltar a ingreso de código
            </Button>
            <Button variant="ghost" size="sm" onClick={stopPolling}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {status === 'code_sent' && (
        <div className="mt-5 rounded-2xl border border-success/25 bg-success/[0.06] p-4 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-success" />
          <p className="mt-2 text-[12px] font-semibold text-text">Código enviado</p>
          <p className="mt-1 text-[10px] text-text-secondary/70">Ingrésalo en la siguiente pantalla.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-5 rounded-2xl border border-success/25 bg-success/[0.06] p-4 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-success" />
          <p className="mt-2 text-[12px] font-semibold text-text">Cuenta vinculada</p>
          <p className="mt-1 text-[10px] text-text-secondary/70">Recibirás notificaciones y PINs por Telegram.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-5 rounded-2xl border border-error/25 bg-error/[0.06] p-4 text-center">
          <AlertCircle className="mx-auto h-7 w-7 text-error" />
          <p className="mt-2 text-[12px] font-semibold text-text">No se pudo vincular</p>
          <p className="mt-1 text-[10px] text-text-secondary/70">{errorMessage}</p>
          <div className="mt-3 space-y-2">
            <Button variant="primary" fullWidth size="sm" onClick={handleRetry}>
              Intentar de nuevo
            </Button>
            <Button variant="secondary" fullWidth size="sm" onClick={handleSimulateDemoCode}>
              Continuar en modo exploración
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2 border-t border-white/[0.07] pt-4">
        {[
          'Privacidad garantizada · sin intermediarios',
          'Notificaciones de reservas, PINs y llegada',
          'Desvinculación inmediata con /desvincular',
        ].map((item) => (
          <p key={item} className="flex items-start gap-2 text-[9.5px] leading-relaxed text-text-secondary/65">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
            {item}
          </p>
        ))}
      </div>
    </OnboardingStage>
  );
}
