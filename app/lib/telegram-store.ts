// Store compartido para Telegram (en producción: Upstash Redis)
// En serverless Vercel, esto se reinicia por invocación, pero funciona si ambas
// APIs se ejecutan en la misma instancia (lo cual pasa a menudo en dev/preview)
// Para producción real: migrar a Upstash Redis o similar

export interface PendingLink {
  code: string;
  chatId?: number;
  expiresAt: number;
}

declare global {
  var __telegram_pendingLinks: Map<string, PendingLink> | undefined;
  var __telegram_linkedUsers: Map<string, number> | undefined;
}

// Singleton pattern para compartir entre invocaciones en la misma instancia
export const pendingLinks = global.__telegram_pendingLinks ??= new Map<string, PendingLink>();
export const linkedUsers = global.__telegram_linkedUsers ??= new Map<string, number>();

export function generateCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 5 dígitos
}

export function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN no configurado en variables de entorno');
  }
  return token;
}

export function getApiUrl(): string {
  return `https://api.telegram.org/bot${getBotToken()}`;
}