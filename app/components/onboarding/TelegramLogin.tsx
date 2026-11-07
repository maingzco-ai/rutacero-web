'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MessageSquare, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';

type Props = {
  onSuccess: (uid: string, chatId?: number) => void;
  onCodeSent?: (uid: string, chatId?: number) => void;
};

function generateSafeUid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `uid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function TelegramLogin({ onSuccess, onCodeSent }: Props) {
  const uidRef = useRef(generateSafeUid());
  const [status, setStatus] = useState<'idle' | 'waiting' | 'code_sent' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(120);

  const startPolling = () => {
    setStatus('waiting');
    setCountdown(120);

    intervalRef.current = setInterval(async () => {
      setCountdown((c) => {
        if (c <= 1) {
          stopPolling();
          setStatus('error');
          setErrorMessage('Tiempo agotado. Intenta de nuevo.');
          return 0;
        }
        return c - 1;
      });

      try {
        const res = await fetch(`/api/auth/telegram-link?uid=${uidRef.current}`);
        const data = await res.json();

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
        // Error de red, continuar reintentando
      }
    }, 2000);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleClick = () => {
    setStatus('waiting');
    setErrorMessage('');

    // Abrir Telegram con enlace profundo al bot
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
      const res = await fetch('/api/auth/telegram-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: uidRef.current, action: 'resend' }),
      });
      const data = await res.json();
      if (data.devCode) {
        sessionStorage.setItem('rc_last_demo_code', data.devCode);
      }
    } catch {
      /* continue */
    }
    setStatus('code_sent');
    onCodeSent?.(uidRef.current, 999999);
  };

  const handleRetry = () => {
    uidRef.current = generateSafeUid();
    handleClick();
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Card elevated className="w-full">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text">Vincular con Telegram</h3>
                <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent-dark dark:text-accent">DEMO</span>
              </div>
              <p className="text-sm text-text-secondary">Notificaciones instantáneas de tus viajes</p>
            </div>
          </div>

          {/* Estado: Inicial */}
          {status === 'idle' && (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-text-secondary">
                Conecta tu cuenta de forma segura a través de Telegram sin exponer tu número de teléfono.
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={handleClick}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Continuar con Telegram (@Rrutabot)
              </Button>
              <Button
                variant="secondary"
                fullWidth
                size="sm"
                onClick={handleSimulateDemoCode}
                className="gap-2 text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Continuar en Modo DEMO (código simulado)
              </Button>
              <p className="text-xs text-text-secondary">
                Se abrirá t.me/Rrutabot · Te enviaremos un código de 5 dígitos
              </p>
            </div>
          )}

          {/* Estado: Esperando apertura de Telegram */}
          {status === 'waiting' && (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-sm font-medium text-text">Esperando interacción en Telegram…</p>
              <p className="text-xs text-text-secondary">
                Pulsa &quot;Iniciar&quot; en el chat con el bot para recibir tu código.
              </p>
              <p className="text-xs text-text-secondary">
                Tiempo restante: <span className="font-mono font-bold text-text">{formatTime(countdown)}</span>
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Button variant="secondary" size="sm" onClick={handleSimulateDemoCode} className="text-xs gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Saltar a ingreso de código [Modo DEMO]
                </Button>
                <Button variant="ghost" size="sm" onClick={stopPolling}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Estado: Código enviado */}
          {status === 'code_sent' && (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="font-semibold text-text">¡Código enviado!</p>
              <p className="text-sm text-text-secondary">
                Ingresa el código de 5 dígitos en la siguiente pantalla.
              </p>
            </div>
          )}

          {/* Estado: Éxito */}
          {status === 'success' && (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <p className="font-semibold text-text">¡Cuenta vinculada!</p>
              <p className="text-sm text-text-secondary">
                Ahora recibirás notificaciones de viajes y PINs por Telegram.
              </p>
            </div>
          )}

          {/* Estado: Error */}
          {status === 'error' && (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="font-medium text-text">No se pudo vincular</p>
              <p className="text-sm text-text-secondary">{errorMessage}</p>
              <div className="space-y-2">
                <Button variant="primary" fullWidth onClick={handleRetry}>
                  Intentar de nuevo
                </Button>
                <Button variant="secondary" fullWidth size="sm" onClick={handleSimulateDemoCode}>
                  Continuar en Modo DEMO
                </Button>
              </div>
            </div>
          )}

          {/* Beneficios */}
          <div className="pt-3 border-t border-border dark:border-border-dark space-y-2 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span>Privacidad garantizada · Sin intermediarios comerciales</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span>Notificaciones de reservas, PINs y llegada del conductor</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span>Desvinculación inmediata en cualquier momento con /desvincular</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
