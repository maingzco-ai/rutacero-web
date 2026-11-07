import { Redis } from '@upstash/redis';

export interface PendingLink {
  code: string;
  chatId?: number;
  expiresAt: number;
}

// Cliente Redis singleton
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const PENDING_KEY = 'telegram:pendingLinks';
const LINKED_KEY = 'telegram:linkedUsers';

export async function getPendingLinks(): Promise<Map<string, PendingLink>> {
  const data = await redis.hgetall(PENDING_KEY);
  const map = new Map<string, PendingLink>();
  if (data) {
    for (const [uid, value] of Object.entries(data)) {
      map.set(uid, JSON.parse(value as string));
    }
  }
  return map;
}

export async function setPendingLink(uid: string, link: PendingLink): Promise<void> {
  await redis.hset(PENDING_KEY, { [uid]: JSON.stringify(link) });
  // TTL automático de 6 min (código expira en 5)
  await redis.expire(PENDING_KEY, 360);
}

export async function deletePendingLink(uid: string): Promise<void> {
  await redis.hdel(PENDING_KEY, uid);
}

export async function getLinkedUsers(): Promise<Map<string, number>> {
  const data = await redis.hgetall(LINKED_KEY);
  const map = new Map<string, number>();
  if (data) {
    for (const [uid, chatId] of Object.entries(data)) {
      map.set(uid, Number(chatId));
    }
  }
  return map;
}

export async function setLinkedUser(uid: string, chatId: number): Promise<void> {
  await redis.hset(LINKED_KEY, { [uid]: chatId.toString() });
  // Sin TTL - vinculado permanente
}

export async function deleteLinkedUser(uid: string): Promise<void> {
  await redis.hdel(LINKED_KEY, uid);
}

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