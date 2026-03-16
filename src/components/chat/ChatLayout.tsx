'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { PaywallModal } from '@/components/chat/PaywallModal';
import { useChatStore } from '@/lib/store';
import { Message } from '@/types/chat';

interface ChatLayoutProps {
  user: {
    id: string;
    email: string;
    plan: string;
    stripeCustomerId?: string;
  };
}

export default function ChatLayout({ user }: ChatLayoutProps) {
  const {
    activeConvId,
    conversations,
    addConversation,
    addMessage,
    updateMessage,
    setIsStreaming,
    activeAgent
  } = useChatStore();

  const [ollamaStatus, setOllamaStatus] = useState<{ color: string; text: string }>({ color: 'grey', text: 'Prêt à jaser' });
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Initialize first conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      const id = Math.random().toString(36).substr(2, 9);
      addConversation({
        id,
        title: "Nouvelle jasette",
        messages: [],
        agent: 'general',
        createdAt: new Date(),
      });
    }
  }, [conversations.length, addConversation]);

  // Ping Ollama logic
  useEffect(() => {
    const pingOllama = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        const res = await fetch('http://localhost:11434/api/tags', { signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
          setOllamaStatus({ color: 'green', text: 'Ollama connecté' });
        } else {
          setOllamaStatus({ color: 'blue', text: 'DeepSeek en standby' });
        }
      } catch {
        setOllamaStatus({ color: 'blue', text: 'DeepSeek en standby' });
      }
    };
    pingOllama();
  }, []);

  const handleSend = useCallback(async (text: string, image?: string) => {
    if (!activeConvId) return;


    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
    };

    addMessage(activeConvId, userMsg);

    // Create assistant message placeholder
    const assistantId = Math.random().toString(36).substr(2, 9);
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
      streaming: true,
    };

    addMessage(activeConvId, assistantMsg);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(conversations.find(c => c.id === activeConvId)?.messages || []), userMsg],
          agent: activeAgent,
          image,
          userEmail: user.email // REAL USER EMAIL
        }),
      });

      if (response.status === 429) {
        setIsPaywallOpen(true);
        // Remove the placeholder message
        updateMessage(activeConvId, assistantId, { 
            content: "Limite de messages atteinte. Passe à Plus ou Pro!", 
            streaming: false,
            source: 'error'
        });
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch');

      // Detect source from header
      const source = response.headers.get('X-Source') as 'ollama' | 'deepseek' | null;
      if (source) {
        updateMessage(activeConvId, assistantId, { source });
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                fullContent += data.text;
                updateMessage(activeConvId, assistantId, { content: fullContent });
              } catch (e) {
                console.error('Error parsing SSE data', e);
              }
            }
          }
        }
      }

      updateMessage(activeConvId, assistantId, { content: fullContent, streaming: false });
    } catch (error) {
      console.error('Streaming error:', error);
      updateMessage(activeConvId, assistantId, {
        content: "Câline, y'a eu un pépin. Vérifie qu'Ollama roule ou que ta clé DeepSeek est bonne.",
        streaming: false,
        source: 'error'
      });
    } finally {
      setIsStreaming(false);
    }
  }, [activeConvId, addMessage, updateMessage, setIsStreaming, conversations, activeAgent, user.email]);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const showWelcome = !activeConv || activeConv.messages.length === 0;

  return (
    <div className="flex h-screen w-full bg-bark overflow-hidden select-none">
      <Sidebar user={user} />
      <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Topbar */}
        <div className="topbar h-[51px] px-[21px] flex items-center justify-between border-b border-border-parlons bg-[rgba(44,26,14,.88)] backdrop-blur-xl shrink-0 z-50">
          <div className="flex items-center gap-[11px]">
            <div className="tb-title font-playfair text-[13.5px] italic text-text-muted">
              {activeConv?.messages.length ? activeConv.title : "Nouvelle jasette"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="mdl-tag font-barlow-cond text-[10px] tracking-[2px] text-gold uppercase bg-[rgba(201,168,76,.07)] border border-border-parlons p-[3px_11px] rounded-full">
              Ollama · DeepSeek
            </div>
          </div>
        </div>

        {/* Messages / Welcome Screen content */}
        <div className="msgs flex-1 overflow-y-auto scrollbar-thin pattern-bg">
          {showWelcome ? (
            <div className="welcome flex flex-col items-center justify-center p-[36px_21px] text-center min-h-full">
              <div className="wcrest w-[74px] h-[74px] bg-bark-l border-2 border-gold-d rounded-[14px] flex items-center justify-center text-[34px] mb-[21px] shadow-[0_0_40px_rgba(201,168,76,.08)] relative">
                🍁
                <div className="absolute inset-[4px] border border-[rgba(201,168,76,.18)] rounded-[10px]" />
              </div>
              <div className="wtitle font-playfair text-[29px] font-black text-gold mb-[6px]">Allô, toé!</div>
              <div className="wsub font-barlow-cond text-[12px] tracking-[3px] text-text-dim uppercase mb-[26px]">Dis-moé queq&apos;chose — chu là</div>
              
              <div className="starters grid grid-cols-1 md:grid-cols-2 gap-[9px] max-w-[510px] w-full">
                {[
                  { icon: '🍽️', title: 'Meilleures places à Montréal', sub: 'Restos, cafés, bouffe de rue', prompt: "C'est quoi les meilleures places pour manger à Montréal?" },
                  { icon: '🤖', title: "L'IA expliquée en joual", sub: 'Simple pis clair, pas de chichi', prompt: "Explique-moé c'est quoi l'intelligence artificielle en joual" },
                  { icon: '✍️', title: 'Écrire un courriel pro', sub: 'En bon québécois correct', prompt: "Aide-moé à écrire un courriel professionnel en français québécois" },
                  { icon: '💡', title: 'Idées de business au Québec', sub: 'Pour partir à son compte', prompt: "Donne-moé des idées de business à lancer au Québec avec pas beaucoup d'argent" }
                ].map((s, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleSend(s.prompt)}
                    className="starter bg-bark-l border border-border-parlons rounded-[9px] p-[13px_14px] cursor-pointer transition-all hover:border-border-hot hover:bg-[rgba(201,168,76,.05)] hover:-translate-y-px text-left group"
                  >
                    <div className="se text-[17px] mb-[5px]">{s.icon}</div>
                    <div className="st text-[12.5px] font-medium text-text-main mb-[2px] line-height-[1.3]">{s.title}</div>
                    <div className="ss text-[10.5px] text-text-dim font-barlow-cond group-hover:text-text-muted">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ChatArea />
          )}
        </div>

        {/* Input Area */}
        <div className="inparea p-[13px_21px_17px] border-t border-border-parlons bg-[rgba(44,26,14,.65)] backdrop-blur-xl relative shrink-0">
          <div className="absolute top-0 left-[21px] right-[21px] h-px bg-[repeating-linear-gradient(90deg,var(--gold-d)_0,var(--gold-d)_7px,transparent_7px,transparent_12px)] opacity-[.21]" />
          <ChatInput onSend={handleSend} status={ollamaStatus} />
        </div>
      </main>
    </div>
  );
}
