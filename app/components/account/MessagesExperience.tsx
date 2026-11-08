'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCheck, MessageCircle, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';
import { useAppState } from '@/app/lib/AppState';
import { cn, getInitials } from '@/app/lib/design-system';
import { EASE, springSoft } from '@/app/lib/motion';

export default function MessagesExperience() {
  const reduced = useReducedMotion();
  const { conversations, sendMessage } = useAppState();
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const active = conversations.find((item) => item.id === activeId) ?? conversations[0];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [active?.messages.length, active?.id, reduced]);

  if (!active) {
    return (
      <div className="page-shell">
        <PageHeader eyebrow="Canal seguro" title="Mensajes" description="Coordina el punto exacto y la hora con tu conductor." />
        <div className="glass mt-8 flex flex-col items-center rounded-[28px] px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-primary-light">
            <MessageCircle className="h-6 w-6" />
          </span>
          <p className="display mt-5 text-2xl">Sin conversaciones</p>
          <p className="mt-2 max-w-xs text-sm text-text-secondary">Reserva un cupo para abrir el canal con tu conductor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Canal seguro · cifrado"
        title="Coordina el"
        accent="punto exacto."
        description="Mensajes internos entre conductor y pasajero. Sin compartir teléfonos: todo queda dentro de RutaCero."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-[310px_1fr]">
        {/* Conversation list */}
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const current = conversation.id === active.id;
            return (
              <motion.button
                key={conversation.id}
                type="button"
                onClick={() => setActiveId(conversation.id)}
                whileHover={reduced ? undefined : { x: 3 }}
                className={cn(
                  'group relative flex w-full items-center gap-3 overflow-hidden rounded-[20px] border p-3 text-left transition-colors duration-300',
                  current
                    ? 'border-primary/30 bg-primary/[0.09]'
                    : 'border-white/[0.07] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]',
                )}
              >
                {current && (
                  <motion.span
                    layoutId="conv-active"
                    className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-gradient-to-b from-primary to-accent"
                    transition={springSoft}
                  />
                )}
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(145deg,#1a2440,#0a0f1c)] text-[11px] font-semibold text-text">
                  {getInitials(conversation.peerName)}
                  {conversation.unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 font-mono text-[8px] font-bold text-[#04110f]">
                      {conversation.unread}
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12.5px] font-semibold text-text">{conversation.peerName}</span>
                    <span className="font-mono text-[8px] text-text-secondary/50">{conversation.lastAt}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[10.5px] text-text-secondary/70">{conversation.lastMessage}</span>
                </span>
              </motion.button>
            );
          })}

          <div className="glass mt-3 rounded-2xl p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-medium text-success">
              <ShieldCheck className="h-3 w-3" /> Conversación protegida
            </p>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-text-secondary/60">
              No compartas datos bancarios ni enlaces externos. RutaCero nunca te pedirá pagos por chat.
            </p>
          </div>
        </div>

        {/* Chat */}
        <div className="glass-strong relative flex min-h-[520px] flex-col overflow-hidden rounded-[28px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[10px] font-semibold text-text">
                {getInitials(active.peerName)}
              </span>
              <div>
                <p className="text-[12.5px] font-semibold text-text">{active.peerName}</p>
                <p className="mt-0.5 flex items-center gap-1 font-mono text-[7.5px] uppercase tracking-[0.14em] text-accent/80">
                  <span className="h-1 w-1 rounded-full bg-accent" /> En línea · verificado
                </p>
              </div>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-primary/60" />
          </div>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-4 no-scrollbar"
            data-lenis-prevent
          >
            <div className="mx-auto mb-3 w-fit rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 font-mono text-[7.5px] uppercase tracking-[0.14em] text-text-secondary/50">
              Hoy · canal cifrado
            </div>

            <AnimatePresence initial={false} mode="popLayout">
              {active.messages.map((message, index) => {
                const mine = message.from === 'yo';
                return (
                  <motion.div
                    key={`${message.id}-${index}`}
                    layout
                    initial={reduced ? false : { opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={cn('flex max-w-[85%] flex-col gap-1', mine ? 'ml-auto items-end' : 'items-start')}
                  >
                    <div
                      className={cn(
                        'rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed',
                        mine
                          ? 'rounded-br-md border border-primary/30 bg-[linear-gradient(140deg,rgba(124,156,255,0.28),rgba(79,109,245,0.16))] text-text'
                          : 'rounded-bl-md border border-white/[0.08] bg-white/[0.05] text-text/90',
                      )}
                    >
                      {message.text}
                    </div>
                    <span className="flex items-center gap-1 px-1 font-mono text-[7.5px] text-text-secondary/40">
                      {message.at}
                      {mine && <CheckCheck className="h-2.5 w-2.5 text-accent/60" />}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <form
            className="border-t border-white/[0.07] p-3"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(active.id, draft);
              setDraft('');
            }}
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-1.5 pl-3 focus-within:border-primary/40">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Escribe al conductor…"
                className="min-w-0 flex-1 bg-transparent py-2 text-[12px] text-text outline-none placeholder:text-text-secondary/50"
              />
              <Button type="submit" variant="primary" size="sm" aria-label="Enviar" className="h-9 w-9 px-0">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="mt-2 px-1 font-mono text-[7px] uppercase tracking-[0.14em] text-text-secondary/30">
              RutaCero no comparte tu número · fin a la conversación al completar el viaje
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
