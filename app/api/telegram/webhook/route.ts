import { NextRequest, NextResponse } from 'next/server';
import {
  getPendingLinks,
  setPendingLink,
  deletePendingLink,
  getLinkedUsers,
  setLinkedUser,
  deleteLinkedUser,
  generateCode,
  getApiUrl,
} from '@/app/lib/telegram-store';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // Procesar mensaje
    if (update.message) {
      const { message } = update;
      const chatId = message.chat.id;
      const text = message.text || '';
      const userId = message.from?.id;
      const username = message.from?.username;

      const pendingLinks = await getPendingLinks();
      const linkedUsers = await getLinkedUsers();

      // Comando /start UID → vincular cuenta
      if (text.startsWith('/start ')) {
        const uid = text.split(' ')[1];

        if (uid && uid.length > 10) { // UUID válido
          const code = generateCode();

          await setPendingLink(uid, {
            code,
            chatId,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
          });

          await sendTelegramMessage(chatId,
            `🔐 <b>RutaCero - Código de verificación</b>\n\n` +
            `Tu código: <code>${code}</code>\n\n` +
            `Expira en <b>5 minutos</b>. Ingrésalo en la app para vincular tu cuenta.\n\n` +
            `— RutaCero Bot`
          );
        } else {
          await sendTelegramMessage(chatId,
            `👋 <b>Bienvenido a RutaCero Bot</b>\n\n` +
            `Para vincular tu cuenta, abre la app RutaCero y usa la opción <b>"Continuar con Telegram"</b>.\n\n` +
            `Esto generará un enlace único para conectar tu cuenta de forma segura.\n\n` +
            `— RutaCero Bot`
          );
        }
      }

      // Comando /codigo para reenviar (si ya está vinculado)
      if (text === '/codigo' || text === '/code') {
        // Buscar uid por chatId
        let foundUid: string | null = null;
        for (const [uid, chatIdStored] of linkedUsers.entries()) {
          if (chatIdStored === chatId) {
            foundUid = uid;
            break;
          }
        }

        if (foundUid) {
          const code = generateCode();
          await setPendingLink(foundUid, {
            code,
            chatId,
            expiresAt: Date.now() + 5 * 60 * 1000,
          });

          await sendTelegramMessage(chatId,
            `🔐 <b>Nuevo código de verificación</b>\n\n` +
            `Tu código: <code>${code}</code>\n\n` +
            `Expira en <b>5 minutos</b>.`
          );
        } else {
          await sendTelegramMessage(chatId,
            `❌ No tienes cuenta vinculada.\n\n` +
            `Usa <b>"Continuar con Telegram"</b> en la app para vincular tu cuenta.`
          );
        }
      }

      // Comando /desvincular
      if (text === '/desvincular' || text === '/unlink') {
        let foundUid: string | null = null;
        for (const [uid, chatIdStored] of linkedUsers.entries()) {
          if (chatIdStored === chatId) {
            foundUid = uid;
            break;
          }
        }

        if (foundUid) {
          await deleteLinkedUser(foundUid);
          await sendTelegramMessage(chatId, `✅ Cuenta desvinculada correctamente.`);
        } else {
          await sendTelegramMessage(chatId, `ℹ️ No tenías cuenta vinculada.`);
        }
      }

      // Comando /ayuda
      if (text === '/ayuda' || text === '/help') {
        await sendTelegramMessage(chatId,
          `🤖 <b>RutaCero Bot - Comandos</b>\n\n` +
          `<b>/start [código]</b> - Vincular cuenta (desde la app)\n` +
          `<b>/codigo</b> - Generar nuevo código OTP\n` +
          `<b>/desvincular</b> - Desvincular cuenta\n` +
          `<b>/ayuda</b> - Mostrar esta ayuda\n\n` +
          `📱 <b>Notificaciones automáticas:</b>\n` +
          `• Reserva confirmada + PIN\n` +
          `• Conductor asignado + placa\n` +
          `• Recordatorio 10 min antes\n` +
          `• Viaje completado + rating\n\n` +
          `¿Preguntas? soporte@rutacero.co`
        );
      }
    }

    // Callback queries (botones inline)
    if (update.callback_query) {
      const { callback_query } = update;
      const chatId = callback_query.message?.chat?.id;
      const data = callback_query.data;

      if (chatId && data?.startsWith('notify_')) {
        // Responder al callback
        await fetch(`${getApiUrl()}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: callback_query.id }),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// GET para verificación de webhook (Telegram lo llama al setear)
export async function GET() {
  try {
    // Verificar que el token esté configurado
    getApiUrl();
    return NextResponse.json({
      status: 'ok',
      bot: 'RutaCero Bot',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Configuración incompleta'
    }, { status: 500 });
  }
}

async function sendTelegramMessage(chatId: number, text: string): Promise<boolean> {
  try {
    const res = await fetch(`${getApiUrl()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Exportar funciones para que telegram-link las use
export {
  getPendingLinks,
  setPendingLink,
  deletePendingLink,
  getLinkedUsers,
  setLinkedUser,
  deleteLinkedUser,
  generateCode,
  getApiUrl,
} from '@/app/lib/telegram-store';