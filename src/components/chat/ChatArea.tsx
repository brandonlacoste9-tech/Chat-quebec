'use client';

import React, { useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { AgentType } from '@/types/chat';

const AGENTS: Record<AgentType, { name: string; label: string }> = {
    general: { name: 'Assistant', label: 'GPT-4.1' },
    immigration: { name: 'Conseiller immigration', label: 'GPT-4.1' },
    fiscalite: { name: 'Conseiller fiscal', label: 'GPT-4.1' },
    cegep: { name: 'Tuteur académique', label: 'GPT-4.1' },
    randonnee: { name: 'Guide plein air', label: 'GPT-4.1' },
};

export const ChatArea = () => {
    const {
        conversations,
        activeConvId,
        activeAgent,
        updateMessage
    } = useChatStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeConv = React.useMemo(() => conversations.find(c => c.id === activeConvId), [conversations, activeConvId]);
    const messages = React.useMemo(() => activeConv?.messages || [], [activeConv]);
    const currentAgent = AGENTS[activeAgent];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFeedback = (messageId: string, type: 'up' | 'down') => {
        if (activeConvId) {
            updateMessage(activeConvId, messageId, { feedback: type });
        }
    };

    return (
        <div className="flex-1 flex flex-col w-full bg-[#212121] min-h-0">
            <header className="sticky top-0 z-20 h-14 border-b border-white/10 bg-[#212121]/95 backdrop-blur">
                <div className="mx-auto flex h-full w-full max-w-3xl items-center justify-between px-4">
                    <h2 className="text-sm font-medium text-white/90">{currentAgent.name}</h2>
                    <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/65">
                        {currentAgent.label}
                    </span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8">
                    {messages.length === 0 ? (
                        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center animate-in fade-in duration-500">
                            <h1 className="text-3xl font-semibold text-white">
                                Comment puis-je vous aider aujourd&apos;hui&nbsp;?
                            </h1>
                            <p className="mt-3 max-w-xl text-sm text-white/60">
                                Posez une question, demandez une explication, ou collez un texte à résumer.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1 pb-10 w-full">
                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    agentName={currentAgent.name}
                                    onFeedback={(type) => handleFeedback(msg.id, type)}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
