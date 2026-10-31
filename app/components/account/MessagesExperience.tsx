'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAppState } from '@/app/lib/AppState';
import { getInitials } from '@/app/lib/design-system';
import { cn } from '@/app/lib/design-system';

export default function MessagesExperience() {
  const { conversations, sendMessage } = useAppState();
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const active = conversations.find((item) => item.id === activeId) ?? conversations[0];

  if (!active) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 text-sm text-text-secondary">
        Todavía no hay conversaciones. Reserva un cupo para escribirle al conductor.
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-4 px-4 py-4 lg:grid-cols-[280px_1fr]">
      <div className="space-y-2">
        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-text">Mensajes</h1>
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => setActiveId(conversation.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left',
              conversation.id === active.id
                ? 'border-primary bg-canvas dark:bg-muted/30'
                : 'border-border bg-card dark:border-border-dark dark:bg-card-dark',
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {getInitials(conversation.peerName)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-text">{conversation.peerName}</span>
                <span className="text-[11px] text-text-secondary">{conversation.lastAt}</span>
              </span>
              <span className="block truncate text-xs text-text-secondary">{conversation.lastMessage}</span>
            </span>
          </button>
        ))}
      </div>

      <Card padding="none" className="flex min-h-[420px] flex-col overflow-hidden">
        <div className="border-b border-border px-4 py-3 dark:border-border-dark">
          <p className="font-semibold text-text">{active.peerName}</p>
          <p className="text-xs text-text-secondary">Conductor verificado</p>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {active.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                message.from === 'yo'
                  ? 'ml-auto bg-primary text-white'
                  : 'bg-secondary text-text dark:bg-muted/30 dark:text-text-dark',
              )}
            >
              <p>{message.text}</p>
              <p className={cn('mt-1 text-[10px]', message.from === 'yo' ? 'text-primary/90' : 'text-text-secondary')}>
                {message.at}
              </p>
            </div>
          ))}
        </div>
        <form
          className="flex gap-2 border-t border-border p-3 dark:border-border-dark"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(active.id, draft);
            setDraft('');
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escribe un mensaje"
            className="flex-1 rounded-2xl border border-border bg-input px-3 py-2.5 text-sm dark:border-border-dark dark:bg-input-dark"
          />
          <Button type="submit" variant="primary" aria-label="Enviar">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
