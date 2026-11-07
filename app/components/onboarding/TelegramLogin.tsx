'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { cn } from '@/app/lib/design-system';

type Props = {
  onSuccess: (uid: string) => void;
  onCodeSent?: () => void;
};

export function TelegramLogin({ onSuccess, onCodeSent }: Props) {
  const uidRef = useRef(crypto.randomUUID());
  const [status, setStatus] = useState<'idle' | 'waiting' | 'code_sent' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(120); // 2 min timeout

  const startPolling = () => {
    setStatus('waiting');
    setCountdown(120);

    intervalRef.current = setInterval(async () => {
      setCountdown((c) => c - 1);

      if (countdown <= 0) {
        stopPolling();
        setStatus('error');
        setErrorMessage('Tiempo agotado. Intenta de nuevo.');
        return;
      }

      try {
        const res = await fetch(`/api/auth/telegram-link?uid=${uidRef.current}`);
        const data = await res.json();

        if (data.linked) {
          stopPolling();
          setStatus('success');
          onSuccess(uidRef.current);
        } else if (data.pending && data.chatId) {
          // Usuario ya abrió Telegram y tiene chatId -> mostrar input de código en la app
          stopPolling();
          setStatus('code_sent');
          onCodeSent?.();
        } else if (data.pending) {
          setStatus('code_sent');
        } else if (data.expired) {
          stopPolling();
          setStatus('error');
          setErrorMessage('Sesión expirada. Intenta de nuevo.');
        }
      } catch {
        // Error de red, seguir intentando
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

    // Abrir Telegram con deep link
    const url = `https://t.me/Rrutabot?start=${uidRef.current}`;
    window.open(url, '_blank', 'width=600,height=700,noreferrer,noopener');

    // Iniciar polling
    startPolling();
  };

  const handleRetry = () => {
    // Generar nuevo UID
    uidRef.current = crypto.randomUUID();
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
    <div className="w-full">
      <Card elevated className="w-full">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-text">Vincular con Telegram</h3>
              <p className="text-sm text-text-secondary">Gratis, seguro y sin spam</p>
            </div>
          </div>

          {/* Estados */}
          {status === 'idle' && (
            <div className="text-center py-4">
              <p className="text-sm text-text-secondary mb-4">
                Abriremos Telegram para que vincules tu cuenta de forma segura.
                <br />No necesitas compartir tu número de teléfono.
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={handleClick}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Continuar con Telegram
              </Button>
              <p className="text-xs text-text-secondary mt-3">
                Se abrirá t.me/Rrutabot · Te enviaremos un código de 5 dígitos
              </p>
            </div>
          )}

          {status === 'waiting' && (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-sm text-text">Esperando que abras Telegram...</p>
              <p className="text-xs text-text-secondary">
                Tiempo restante: <span className="font-mono">{formatTime(countdown)}</span>
              </p>
              <Button variant="ghost" size="sm" onClick={stopPolling}>
                Cancelar
              </Button>
            </div>
          )}

          {status === 'code_sent' && (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="font-medium text-text">¡Código enviado a Telegram!</p>
              <p className="text-sm text-text-secondary">
                Revisa el chat con <b>@Rrutabot</b> e ingresa el código de 5 dígitos en la app.
              </p>
              <p className="text-xs text-text-secondary">
                Tiempo restante: <span className="font-mono">{formatTime(countdown)}</span>
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <p className="font-semibold text-text">¡Cuenta vinculada!</p>
              <p className="text-sm text-text-secondary">
                Ahora recibirás notificaciones de viajes, PINs y alertas por Telegram.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="font-medium text-text">No se pudo vincular</p>
              <p className="text-sm text-text-secondary">{errorMessage}</p>
              <Button variant="secondary" fullWidth onClick={handleRetry}>
                Intentar de nuevo
              </Button>
            </div>
          )}

          {/* Beneficios */}
          <div className="pt-2 border-t border-border space-y-2 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span>100% gratis · Sin límites de mensajes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span>Tu número de teléfono queda privado</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span>Notificaciones: reservas, PINs, conductor, alertas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span>Puedes desvincular en cualquier momento con /desvincular</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}