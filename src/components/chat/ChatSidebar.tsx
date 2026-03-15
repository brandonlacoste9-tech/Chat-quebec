'use client';

import React from 'react';
import { MessageSquarePlus, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/lib/store';

interface ChatSidebarProps {
  onNewConversation: () => void;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('fr-CA', {
    day: '2-digit',
    month: 'short',
  }).format(date);

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onNewConversation }) => {
  const { conversations, activeConvId, setActiveConvId } = useChatStore();

  const orderedConversations = React.useMemo(
    () =>
      [...conversations].sort((a, b) => {
        const aTime = a.updatedAt?.getTime() ?? a.createdAt.getTime();
        const bTime = b.updatedAt?.getTime() ?? b.createdAt.getTime();
        return bTime - aTime;
      }),
    [conversations],
  );

  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-white/10 bg-[#171717] md:flex md:flex-col">
      <div className="p-3">
        <button
          onClick={onNewConversation}
          className="flex w-full items-center gap-2 rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white/95 transition hover:bg-white/10"
        >
          <MessageSquarePlus size={16} />
          <span>Nouvelle discussion</span>
        </button>
      </div>

      <div className="px-3 pb-2 text-[11px] uppercase tracking-wider text-white/45">
        Discussions récentes
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3 scrollbar-thin">
        {orderedConversations.map((conversation) => {
          const active = conversation.id === activeConvId;
          const title = conversation.title?.trim() || 'Nouvelle discussion';

          return (
            <button
              key={conversation.id}
              onClick={() => setActiveConvId(conversation.id)}
              className={cn(
                'flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left transition',
                active ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white',
              )}
            >
              <MessageCircle size={14} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{title}</p>
                <p className="mt-0.5 text-[11px] text-white/45">
                  {formatDate(conversation.updatedAt ?? conversation.createdAt)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-white/10 px-4 py-3 text-xs text-white/40">
        Interface de chat en français
      </div>
    </aside>
  );
};
