import { Redis } from '@upstash/redis';

export interface PendingLink {
  code: string;
  chatId?: number;
  expiresAt: number;
}

// In-memory store fallback for development, demo, or when Upstash Redis is not configured
declare global {
  var __rc_pending_links: Map<string, PendingLink> | undefined;
  var __rc_linked_users: Map<string, number> | undefined;
}

if (!globalThis.__rc_pending_links) {
  globalThis.__rc_pending_links = new Map<string, PendingLink>();
}
if (!globalThis.__rc_linked_users) {
  globalThis.__rc_linked_users = new Map<string, number>();
}

const memoryPendingLinks = globalThis.__rc_pending_links;
const memoryLinkedUsers = globalThis.__rc_linked_users;

const PENDING_KEY = 'telegram:pendingLinks';
const LINKED_KEY = 'telegram:linkedUsers';

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || url.includes('xxxxxxxx')) {
    return null;
  }
  try {
    return new Redis({ url, token });
  } catch (error) {
    console.warn('[TelegramStore] No se pudo inicializar Redis Upstash, usando memoria local:', error);
    return null;
  }
}

export function hasRedisConfigured(): boolean {
  return getRedisClient() !== null;
}

export async function getPendingLinks(): Promise<Map<string, PendingLink>> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.hgetall(PENDING_KEY);
      const map = new Map<string, PendingLink>();
      if (data) {
        for (const [uid, value] of Object.entries(data)) {
          try {
            map.set(uid, typeof value === 'string' ? JSON.parse(value) : (value as PendingLink));
          } catch {
            /* ignore malformed entry */
          }
        }
      }
      return map;
    } catch (err) {
      console.warn('[TelegramStore] Fallo al consultar Redis, recurriendo a memoria local:', err);
    }
  }

  // Fallback a memoria local: limpiar expirados
  const now = Date.now();
  for (const [uid, item] of memoryPendingLinks.entries()) {
    if (now > item.expiresAt) {
      memoryPendingLinks.delete(uid);
    }
  }
  return new Map(memoryPendingLinks);
}

export async function setPendingLink(uid: string, link: PendingLink): Promise<void> {
  // Siempre guardar en memoria local como respaldo
  memoryPendingLinks.set(uid, link);

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.hset(PENDING_KEY, { [uid]: JSON.stringify(link) });
      await redis.expire(PENDING_KEY, 360);
    } catch (err) {
      console.warn('[TelegramStore] Error al guardar pendingLink en Redis:', err);
    }
  }
}

export async function deletePendingLink(uid: string): Promise<void> {
  memoryPendingLinks.delete(uid);

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.hdel(PENDING_KEY, uid);
    } catch (err) {
      console.warn('[TelegramStore] Error al borrar pendingLink en Redis:', err);
    }
  }
}

export async function getLinkedUsers(): Promise<Map<string, number>> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.hgetall(LINKED_KEY);
      const map = new Map<string, number>();
      if (data) {
        for (const [uid, chatId] of Object.entries(data)) {
          map.set(uid, Number(chatId));
        }
      }
      return map;
    } catch (err) {
      console.warn('[TelegramStore] Fallo al consultar linkedUsers en Redis:', err);
    }
  }

  return new Map(memoryLinkedUsers);
}

export async function setLinkedUser(uid: string, chatId: number): Promise<void> {
  memoryLinkedUsers.set(uid, chatId);

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.hset(LINKED_KEY, { [uid]: chatId.toString() });
    } catch (err) {
      console.warn('[TelegramStore] Error al guardar linkedUser en Redis:', err);
    }
  }
}

export async function deleteLinkedUser(uid: string): Promise<void> {
  memoryLinkedUsers.delete(uid);

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.hdel(LINKED_KEY, uid);
    } catch (err) {
      console.warn('[TelegramStore] Error al borrar linkedUser en Redis:', err);
    }
  }
}

export function generateCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 5 dígitos
}

export function getBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN || '';
}

export function hasBotConfigured(): boolean {
  const token = getBotToken();
  return Boolean(token && !token.includes('xxxxxxxx') && token.length > 15);
}

export function getApiUrl(): string {
  const token = getBotToken();
  return token ? `https://api.telegram.org/bot${token}` : '';
}
